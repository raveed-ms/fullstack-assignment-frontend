<template>
  <v-dialog
    v-model="dialogValue"
    max-width="1000px"
    persistent
  >
    <v-card class="create-season-modal">
      <!-- Header -->
      <v-card-title class="d-flex align-center pa-6 pb-4">
        <v-icon start color="primary" size="large" class="mr-3">mdi-calendar-plus</v-icon>
        <span class="text-h5 font-weight-medium">Create New Season</span>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6 pt-0">
        <v-form ref="form" v-model="isValid">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="createForm.title"
                label="Season Title"
                placeholder="e.g., Summer Golf Championship 2025"
                variant="outlined"
                density="compact"
                :rules="[rules.required, rules.titleLength]"
                class="input-field"
                :disabled="isLoading"
                prepend-inner-icon="mdi-trophy"
                clearable
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-text-field
                v-model="dollarAmount"
                label="Prize Pool (USD)"
                type="number"
                variant="outlined"
                :rules="[rules.required, rules.dollarAmount]"
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
                    :rules="[rules.startDateRequired]"
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
                    v-model="selectedDate"
                    @update:model-value="onDateSelected"
                    :min="minDate"
                    color="primary"
                  ></v-date-picker>
                  <v-divider></v-divider>
                  <div class="pa-4">
                    <v-time-picker
                      v-model="selectedTime"
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


        </v-form>
      </v-card-text>
      
      <v-divider></v-divider>
      
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
          @click="createSeason"
          :loading="isLoading"
          :disabled="!isValid"
        >
          Create Season
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { seasonsApi } from '~/api/seasons';
import { useSeasonsErrorHandler } from '~/composables/errors/useSeasonsErrorHandler';
import { useNotifications } from '~/composables/ui/useNotifications';
import type { Season, SeasonCreate } from '~/api/seasons';

interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'season-created', season: Season): void;
  (e: 'show-weeks-modal', season: Season): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const form = ref();
const isValid = ref(false);
const isLoading = ref(false);

const createForm = ref<SeasonCreate>({
  title: '',
  startDate: '',
  reward: { cash: 0 }
});

// Date and time picker state
const showDatePicker = ref(false);
const selectedDate = ref<string | null>(null);
const selectedTime = ref<string>('00:00'); // Initialize with default time

// Display values for the input fields
const displayDateTime = computed(() => {
  console.log('displayDateTime computed - selectedDate:', selectedDate.value, 'selectedTime:', selectedTime.value); // Debug log
  
  if (!selectedDate.value) return 'Please select a date';
  if (!selectedTime.value) return 'Please select a time';
  
  try {
    // Parse the date and time without timezone conversion
    const [year, month, day] = selectedDate.value.split('-').map(Number);
    const [hours, minutes] = selectedTime.value.split(':').map(Number);
    
    // Create date object in local timezone
    const localDate = new Date(year, month - 1, day, hours, minutes);
    
    const result = localDate.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    console.log('displayDateTime result:', result); // Debug log
    return result;
  } catch (error) {
    console.error('Error formatting date:', error);
    return `${selectedDate.value} at ${selectedTime.value}`;
  }
});



// Dollar amount input (for user display)
const dollarAmount = ref<number | null>(null);

// Convert dollars to cents for backend
const centsAmount = computed(() => {
  if (!dollarAmount.value) return 0;
  return Math.round(dollarAmount.value * 100);
});

const rules = {
  required: (value: any) => !!value || 'This field is required',
  titleLength: (value: string) => (value.length >= 3 && value.length <= 100) || 'Title must be 3-100 characters',
  dollarAmount: (value: number | null) => {
    if (!value) return 'This field is required';
    if (value < 0) return 'Amount must be positive';
    if (value > 9999999.99) return 'Amount cannot exceed $9,999,999.99';
    return true;
  },
  startDateRequired: (value: any) => {
    if (!createForm.value.startDate) return 'Please select a start date and time';
    return true;
  }
};

// Date constraints for the date picker
const minDate = computed(() => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0]; // Return YYYY-MM-DD format
});

const maxDate = computed(() => {
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 2); // Allow up to 2 years in future
  return maxDate.toISOString().split('T')[0]; // Return YYYY-MM-DD format
});

const dialogValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const closeModal = () => {
  emit('update:modelValue', false);
  // Reset form when closing
  createForm.value = {
    title: '',
    startDate: '',
    reward: { cash: 0 }
  };
  // Reset date and time pickers
  selectedDate.value = null;
  selectedTime.value = '00:00';
  // Reset dollar amount
  dollarAmount.value = null;
};

// Date and time picker functions
const onDateSelected = (date: string | null) => {
  console.log('Date selected:', date); // Debug log
  if (date) {
    selectedDate.value = date;
    updateStartDate();
    // Don't close the picker yet - let user select time too
  }
};

const onTimeSelected = (time: string) => {
  console.log('Time selected:', time); // Debug log
  selectedTime.value = time;
  updateStartDate();
};

const onDateTimeConfirmed = () => {
  showDatePicker.value = false;
};

const updateStartDate = () => {
  if (selectedDate.value && selectedTime.value) {
    const [hours, minutes] = selectedTime.value.split(':');
    const date = new Date(selectedDate.value);
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    createForm.value.startDate = date.toISOString();
    console.log('Updated startDate:', createForm.value.startDate); // Debug log
  } else {
    createForm.value.startDate = '';
    console.log('Missing date or time:', { date: selectedDate.value, time: selectedTime.value }); // Debug log
  }
};

const createSeason = async () => {
  console.log('Form validation - startDate:', createForm.value.startDate); // Debug log
  console.log('Form validation - selectedDate:', selectedDate.value); // Debug log
  console.log('Form validation - selectedTime:', selectedTime.value); // Debug log
  
  if (!form.value?.validate()) return;
  
  isLoading.value = true;
  
  try {
    // Convert startDate to ISO string for API and dollars to cents
    const seasonData: SeasonCreate = {
      ...createForm.value,
      startDate: new Date(createForm.value.startDate).toISOString(),
      reward: { cash: centsAmount.value }
    };
    
    const response = await seasonsApi.createSeason(seasonData);
    
    if (response.success && response.data) {
      emit('season-created', response.data);
      emit('show-weeks-modal', response.data);
      showSuccess('Season created successfully!');
      closeModal();
    } else {
      showError('Failed to create season');
    }
  } catch (error: any) {
    // Use proper error handler for seasons
    const errorMessage = handleSeasonCreateError(error);
    if (errorMessage) {
      showError('Failed to create season', errorMessage);
    }
  } finally {
    isLoading.value = false;
  }
};

const { showError, showSuccess } = useNotifications();
const { handleSeasonCreateError } = useSeasonsErrorHandler();
</script>

<style scoped>
.create-season-modal {
  border-radius: 12px;
}

/* Custom styles for input fields - same as profile page */
:deep(.input-field) {
  font-size: 2rem;
}

.date-time-picker-card {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.input-field .v-field__input) {
  padding: 12px 16px;
  min-height: 56px;
  font-size: 1.4rem !important;
}

:deep(.input-field .v-field__prepend-inner) {
  padding-left: 12px;
}

:deep(.input-field .v-field__append-inner) {
  padding-right: 12px;
}

:deep(.input-field .v-label) {
  font-size: 1.2rem;
  opacity: 0.8;
}

:deep(.v-messages) {
  font-size: 1.1rem;
  line-height: 1.4;
  min-height: 1.4rem;
}

/* Custom styles for modal buttons - same as profile page */
:deep(.modal-button) {
  font-size: 1.2rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* Enhanced alert styling */
:deep(.v-alert) {
  border-radius: 8px;
}

:deep(.v-alert ul) {
  margin: 0;
  padding-left: 20px;
}

:deep(.v-alert li) {
  margin-bottom: 4px;
}

/* Header styling */
:deep(.v-card-title h2) {
  color: #1976d2;
  font-weight: 600;
}

:deep(.v-card-title p) {
  line-height: 1.4;
}

/* Icon styling */
:deep(.v-icon) {
  opacity: 0.9;
}
</style>
