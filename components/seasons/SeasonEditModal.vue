<template>
  <v-dialog
    v-model="dialogValue"
    max-width="1000px"
    persistent
  >
    <v-card class="season-edit-modal">
      <v-card-title class="d-flex align-center pa-6 pb-4">
        <v-icon start color="primary" size="large" class="mr-3">mdi-pencil</v-icon>
        <span class="text-h5 font-weight-medium">Edit Season: {{ season?.title || 'Unknown' }}</span>
      </v-card-title>
      
      <v-card-text class="pa-6 pt-0">
        <v-form ref="form" v-model="isValid">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="editForm.title"
                label="Season Title"
                variant="outlined"
                density="compact"
                :rules="[rules.required, rules.titleLength]"
                class="input-field"
                :disabled="isLoading"
                prepend-inner-icon="mdi-trophy"
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-text-field
                v-model="editForm.reward.cash"
                label="Prize Pool (USD)"
                type="number"
                variant="outlined"
                :rules="[rules.required, rules.rewardAmount]"
                class="input-field"
                :disabled="isLoading"
                prepend-inner-icon="mdi-currency-usd"
                step="0.01"
                min="0"
              ></v-text-field>
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="12" md="6">
              <v-menu
                v-model="showDatePicker"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="displayDateTime"
                    label="Start Date & Time"
                    variant="outlined"
                    :rules="[rules.required]"
                    class="input-field"
                    :disabled="isLoading"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    v-bind="props"
                    placeholder="Select start date and time"
                  ></v-text-field>
                </template>
                <v-card class="date-time-picker-card">
                  <v-date-picker
                    v-model="editForm.startDate"
                    @update:model-value="onDateSelected"
                    :min="minDate"
                    color="primary"
                  ></v-date-picker>
                  <v-divider></v-divider>
                  <div class="pa-4">
                    <v-time-picker
                      v-model="editForm.startTime"
                      format="24hr"
                      color="primary"
                      class="mb-3"
                      width="100%"
                      @update:model-value="onTimeSelected"
                    ></v-time-picker>
                    <div class="d-flex justify-end">
                      <v-btn
                        color="primary"
                        size="small"
                        @click="onDateTimeConfirmed"
                      >
                        Confirm
                      </v-btn>
                    </div>
                  </div>
                </v-card>
              </v-menu>
            </v-col>
          </v-row>

          <!-- Update Weeks Button -->
          <v-divider class="my-6"></v-divider>
          
          <div class="d-flex justify-center">
            <v-btn
              color="primary"
              variant="outlined"
              size="large"
              @click="openWeeksModal"
              :disabled="isLoading || !season"
              class="update-weeks-btn"
              prepend-icon="mdi-calendar-edit"
            >
              Update Weeks & Personas
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
      
      <v-card-actions class="pa-6">
        <v-spacer></v-spacer>
        <v-btn
          color="secondary"
          variant="outlined"
          @click="closeModal"
          :disabled="isLoading"
          class="me-3"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          @click="saveChanges"
          :loading="isLoading"
          :disabled="!isValid"
        >
          Save Changes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { seasonsApi } from '~/api/seasons';
import { useSeasonsErrorHandler } from '~/composables/errors/useSeasonsErrorHandler';
import { useNotifications } from '~/composables/ui/useNotifications';
import type { Season, SeasonUpdate } from '~/api/seasons';

interface Props {
  modelValue: boolean;
  season: Season | null;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'season-updated', season: Season): void;
  (e: 'open-weeks-modal', season: Season): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const form = ref();
const isValid = ref(false);
const isLoading = ref(false);
const showDatePicker = ref(false);

const editForm = ref({
  title: '',
  startDate: '',
  startTime: '00:00',
  reward: { cash: 0 }
});

// Computed properties for date handling
const displayDateTime = computed(() => {
  const rawDate: any = editForm.value.startDate as any;
  const rawTime: any = editForm.value.startTime as any;

  if (!rawDate || !rawTime) return '';

  // Normalize date to YYYY-MM-DD string
  let startDateStr: string | null = null;
  if (typeof rawDate === 'string') {
    startDateStr = rawDate;
  } else if (rawDate instanceof Date) {
    startDateStr = rawDate.toISOString().split('T')[0];
  } else {
    const parsed = new Date(rawDate);
    if (!isNaN(parsed.getTime())) {
      startDateStr = parsed.toISOString().split('T')[0];
    }
  }

  if (!startDateStr || typeof rawTime !== 'string') return '';

  try {
    const [year, month, day] = startDateStr.split('-').map(Number);
    const [hours, minutes] = rawTime.split(':').map(Number);

    const localDate = new Date(year, month - 1, day, hours, minutes);
    return localDate.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error in displayDateTime:', error);
    return '';
  }
});

const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

const rules = {
  required: (value: any) => !!value || 'This field is required',
  titleLength: (value: string) => (value.length >= 3 && value.length <= 100) || 'Title must be 3-100 characters',
  rewardAmount: (value: number) => (value >= 0 && value <= 1000000) || 'Prize pool must be between $0 and $1,000,000'
};

const dialogValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Watch for season changes and update form
watch(() => props.season, (newSeason) => {
  if (newSeason) {
    const date = new Date(newSeason.startDate);
    editForm.value = {
      title: newSeason.title,
      startDate: date.toISOString().split('T')[0], // Format for date picker (YYYY-MM-DD)
      startTime: date.toTimeString().slice(0, 5), // Format for time picker (HH:MM)
      reward: { cash: newSeason.reward.cash / 100 } // Convert from cents to dollars
    };
  }
}, { immediate: true });

// Watch for changes in editForm to debug updates
watch(editForm, (newForm) => {
  console.log('editForm changed:', newForm);
}, { deep: true });

const closeModal = () => {
  emit('update:modelValue', false);
};

const openWeeksModal = () => {
  if (props.season) {
    emit('open-weeks-modal', props.season);
  }
};

const onDateSelected = (date: any) => {
  // Normalize to YYYY-MM-DD string regardless of picker output type
  if (typeof date === 'string') {
    editForm.value.startDate = date;
  } else if (date instanceof Date) {
    editForm.value.startDate = date.toISOString().split('T')[0];
  } else {
    const d = new Date(date);
    if (!isNaN(d.getTime())) {
      editForm.value.startDate = d.toISOString().split('T')[0];
    }
  }
};

const onTimeSelected = (time: string) => {
  editForm.value.startTime = time;
};

const onDateTimeConfirmed = () => {
  console.log('DateTime confirmed. Final form values:', editForm.value);
  console.log('startDate:', editForm.value.startDate);
  console.log('startTime:', editForm.value.startTime);
  showDatePicker.value = false;
};

const saveChanges = async () => {
  if (!props.season || !form.value?.validate()) return;
  
  isLoading.value = true;
  
  try {
    // Normalize potential Date object from picker
    const rawDate: any = editForm.value.startDate as any;
    const startDateStr = typeof rawDate === 'string' ? rawDate : new Date(rawDate).toISOString().split('T')[0];
    const timeStr = typeof editForm.value.startTime === 'string' ? editForm.value.startTime : '00:00';

    // Convert startDate and startTime to ISO string and prize to cents for API
    // Treat the selected time as local time and convert to UTC
    const [year, month, day] = startDateStr.split('-').map(Number);
    const [hours, minutes] = timeStr.split(':').map(Number);

    // Create date object in local timezone
    const localDate = new Date(year, month - 1, day, hours, minutes);

    const updateData: SeasonUpdate = {
      ...editForm.value,
      startDate: localDate.toISOString(), // Convert local time to UTC ISO string
      reward: { cash: Math.round(editForm.value.reward.cash * 100) } // Convert dollars to cents
    };
    
    const response = await seasonsApi.updateSeason(props.season.id, updateData);
    
    if (response.success && response.data) {
      emit('season-updated', response.data);
      showSuccess('Season updated successfully!');
    } else {
      showError('Failed to update season');
    }
  } catch (error: any) {
    showError('Failed to update season', error.message || 'An unexpected error occurred');
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Invalid Date';
  }
};



const { showError, showSuccess } = useNotifications();
</script>

<style scoped>
.season-edit-modal {
  border-radius: 8px;
}

.update-weeks-btn {
  font-size: 1.1rem;
  font-weight: 500;
  padding: 12px 24px;
  border-radius: 8px;
  text-transform: none;
  letter-spacing: 0.3px;
}

.date-time-picker-card {
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}
</style>
