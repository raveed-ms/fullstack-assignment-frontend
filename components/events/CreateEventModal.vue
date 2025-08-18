<template>
  <v-dialog v-model="dialogValue" max-width="1000px" persistent>
    <v-card class="event-create-modal">
      <!-- Header -->
      <v-card-title class="d-flex align-center pa-6 pb-4">
        <v-icon start color="primary" size="large" class="mr-3">mdi-plus</v-icon>
        <span class="text-h5 font-weight-medium">Create New Event</span>
      </v-card-title>

      <v-divider></v-divider>

      <!-- Content -->
      <v-card-text class="modal-content pa-6">
        <v-form ref="createFormRef" v-model="createFormValid">
          <!-- Basic Event Information -->
          <div class="mb-6">
            <h3 class="text-subtitle-1 font-weight-medium mb-4 text-grey-darken-2">
              <v-icon size="small" color="grey-darken-1" class="me-2">mdi-information</v-icon>
              Basic Information
            </h3>
            
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="createForm.name"
                  label="Event Name"
                  variant="outlined"
                  :rules="[rules.required, rules.nameLength]"
                  prepend-inner-icon="mdi-calendar"
                  placeholder="Enter event name"
                  class="input-field"
                  :disabled="isLoading"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="createForm.numberOfParticipants"
                  label="Max Participants"
                  type="number"
                  variant="outlined"
                  :rules="[rules.required, rules.participants]"
                  prepend-inner-icon="mdi-account-group"
                  min="1"
                  max="10"
                  class="input-field"
                  :disabled="isLoading"
                ></v-text-field>
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="createForm.entryFees"
                  label="Entry Fee (USD)"
                  type="number"
                  variant="outlined"
                  :rules="[rules.required, rules.entryFees]"
                  prepend-inner-icon="mdi-currency-usd"
                  min="0"
                  max="100"
                  step="0.01"
                  class="input-field"
                  :disabled="isLoading"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" md="6">
                <!-- Empty column for balance -->
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="createForm.description"
                  label="Description"
                  variant="outlined"
                  :rules="[rules.descriptionLength]"
                  prepend-inner-icon="mdi-text"
                  rows="3"
                  class="input-field"
                  :disabled="isLoading"
                  placeholder="Enter event description (optional)"
                ></v-textarea>
              </v-col>
            </v-row>
          </div>

          <!-- Course Holes -->
          <div class="mb-6">
            <div class="d-flex align-center justify-space-between mb-4">
              <h3 class="text-subtitle-1 font-weight-medium text-grey-darken-2">
                <v-icon size="small" color="grey-darken-1" class="me-2">mdi-golf-course</v-icon>
                Course Holes ({{ createForm.holes.length }})
              </h3>
              <v-btn
                color="primary"
                variant="outlined"
                size="small"
                prepend-icon="mdi-plus"
                @click="addHole"
                :disabled="isLoading || createForm.holes.length >= 18"
                class="modal-button"
              >
                Add Hole
              </v-btn>
            </div>
            
            <v-row>
              <v-col v-for="(hole, index) in createForm.holes" :key="index" cols="12" md="6" lg="4">
                <v-card variant="outlined" class="hole-card" elevation="0">
                  <v-card-title class="text-subtitle-2 pa-3 pb-2 d-flex align-center justify-space-between">
                    <span>Hole {{ hole.holeNumber }}</span>
                    <div class="d-flex">
                      <v-btn
                        v-if="index > 0"
                        color="grey"
                        variant="text"
                        size="x-small"
                        icon
                        @click="moveHole(index, 'up')"
                        :disabled="isLoading"
                        class="me-1"
                      >
                        <v-icon size="small">mdi-arrow-up</v-icon>
                      </v-btn>
                      <v-btn
                        v-if="index < createForm.holes.length - 1"
                        color="grey"
                        variant="text"
                        size="x-small"
                        icon
                        @click="moveHole(index, 'down')"
                        :disabled="isLoading"
                        class="me-1"
                      >
                        <v-icon size="small">mdi-arrow-down</v-icon>
                      </v-btn>
                      <v-btn
                        color="error"
                        variant="text"
                        size="x-small"
                        icon
                        @click="removeHole(index)"
                        :disabled="isLoading"
                      >
                        <v-icon size="small">mdi-close</v-icon>
                      </v-btn>
                    </div>
                  </v-card-title>
                  
                  <v-card-text class="pa-3 pt-0">
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="hole.courseId"
                          label="Course ID"
                          :items="courseIdOptions"
                          variant="outlined"
                          density="compact"
                          :rules="[rules.required]"
                          class="input-field"
                          :disabled="isLoading"
                        ></v-select>
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="hole.holeNumber"
                          label="Hole Number"
                          type="number"
                          variant="outlined"
                          density="compact"
                          :rules="[rules.required, rules.holeNumber]"
                          min="1"
                          max="18"
                          class="input-field"
                          :disabled="isLoading"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="hole.weather"
                          label="Weather"
                          :items="weatherOptions"
                          variant="outlined"
                          density="compact"
                          :rules="[rules.required]"
                          class="input-field"
                          :disabled="isLoading"
                        ></v-select>
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="hole.teePosition"
                          label="Tee Position"
                          :items="teePositionOptions"
                          variant="outlined"
                          density="compact"
                          :rules="[rules.required]"
                          class="input-field"
                          :disabled="isLoading"
                        ></v-select>
                      </v-col>
                    </v-row>
                    
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="hole.windSpeed"
                          label="Wind Speed (km/h)"
                          type="number"
                          variant="outlined"
                          density="compact"
                          :rules="[rules.required, rules.windSpeed]"
                          min="0"
                          max="100"
                          class="input-field"
                          :disabled="isLoading"
                        ></v-text-field>
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="hole.needleSpeed"
                          label="Needle Speed (m/s)"
                          type="number"
                          variant="outlined"
                          density="compact"
                          :rules="[rules.required, rules.needleSpeed]"
                          min="0"
                          max="100"
                          class="input-field"
                          :disabled="isLoading"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <!-- Validation Summary -->
          <div v-if="validationErrors.length > 0" class="mb-6">
            <v-alert
              type="error"
              variant="tonal"
              class="mb-4"
            >
              <template v-slot:title>Please fix the following errors:</template>
              <ul class="ma-0 pa-0" style="list-style: none;">
                <li v-for="(error, index) in validationErrors" :key="index" class="mb-1">
                  • {{ error }}
                </li>
              </ul>
            </v-alert>
          </div>
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
          @click="createEvent"
          :loading="isLoading"
          :disabled="!createFormValid || isLoading"
        >
          Create Event
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useEventsErrorHandler } from '~/composables/errors/useEventsErrorHandler';
import { useNotifications } from '~/composables/ui/useNotifications';
import { eventsApi } from '~/api/events';
import { EventStatus, TeePosition, Weather } from '~/api/events';
import type { EventCreate } from '~/api/events';

interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'eventCreated', event: any): void;
}

// Local interface for hole data (only the fields needed for creation)
interface HoleData {
  courseId: number;
  holeNumber: number;
  windSpeed: number;
  teePosition: TeePosition;
  weather: Weather;
  needleSpeed: number;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Composables
const { handleEventCreateError, clearError, errorMessage } = useEventsErrorHandler();
const { showSuccess, showError } = useNotifications();

// Form refs and state
const createFormRef = ref();
const createFormValid = ref(false);
const isLoading = ref(false);

// Form data
const createForm = ref({
  name: '',
  description: '',
  numberOfParticipants: 1,
  entryFees: 0,
  holes: [] as HoleData[]
});

// Validation rules
const rules = {
  required: (value: any) => !!value || 'This field is required',
  nameLength: (value: string) => (value && value.length >= 1 && value.length <= 100) || 'Name must be 1-100 characters',
  descriptionLength: (value: string) => !value || value.length <= 500 || 'Description must be 500 characters or less',
  participants: (value: number) => (value >= 1 && value <= 10) || 'Participants must be between 1 and 10',
  entryFees: (value: number) => (value >= 0 && value <= 100) || 'Entry fees must be between 0 and 100',
  windSpeed: (value: number) => (value >= 0 && value <= 100) || 'Wind speed must be between 0 and 100',
  needleSpeed: (value: number) => (value >= 0 && value <= 100) || 'Needle speed must be between 0 and 100',
  holeNumber: (value: number) => (value >= 1 && value <= 18) || 'Hole number must be between 1 and 18'
};

// Options for selects
const weatherOptions = Object.values(Weather);
const teePositionOptions = Object.values(TeePosition);
const courseIdOptions = Array.from({ length: 10 }, (_, i) => i + 1); // 1 to 10

// Computed properties
const dialogValue = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
});

const validationErrors = computed(() => {
  const errors: string[] = [];
  
  if (createForm.value.holes.length === 0) {
    errors.push('At least one hole must be defined');
  }
  
  if (createForm.value.holes.length > 18) {
    errors.push('Maximum 18 holes allowed');
  }
  
  return errors;
});

// Methods
const initializeForm = () => {
  createForm.value = {
    name: '',
    description: '',
    numberOfParticipants: 1,
    entryFees: 0,
    holes: []
  };
  
  // Add at least one hole by default
  addHole();
};

const addHole = () => {
  if (createForm.value.holes.length < 18) {
    createForm.value.holes.push({
      weather: Weather.SUNNY,
      teePosition: TeePosition.BACK,
      windSpeed: 0,
      needleSpeed: 0,
      holeNumber: createForm.value.holes.length + 1,
      courseId: 1
    });
  }
};

const removeHole = (index: number) => {
  createForm.value.holes.splice(index, 1);
  // Update hole numbers
  createForm.value.holes.forEach((hole, idx) => {
    hole.holeNumber = idx + 1;
  });
};

const moveHole = (index: number, direction: 'up' | 'down') => {
  const holes = [...createForm.value.holes];
  const holeToMove = holes[index];

  if (direction === 'up') {
    if (index > 0) {
      holes[index] = holes[index - 1];
      holes[index - 1] = holeToMove;
    }
  } else {
    if (index < holes.length - 1) {
      holes[index] = holes[index + 1];
      holes[index + 1] = holeToMove;
    }
  }

  createForm.value.holes = holes;
  // Update hole numbers after reordering
  createForm.value.holes.forEach((hole, idx) => {
    hole.holeNumber = idx + 1;
  });
};

const closeModal = () => {
  clearError();
  emit('update:modelValue', false);
  initializeForm();
};

const createEvent = async () => {
  if (!createFormValid.value) return;
  
  try {
    isLoading.value = true;
    clearError();
    
    // Prepare create data
    const createData: EventCreate = {
      name: createForm.value.name,
      description: createForm.value.description || undefined,
      numberOfParticipants: createForm.value.numberOfParticipants,
      entryFees: Math.round(createForm.value.entryFees * 100), // Convert to cents
      holes: createForm.value.holes.map(hole => ({
        courseId: hole.courseId,
        holeNumber: hole.holeNumber,
        windSpeed: hole.windSpeed,
        teePosition: hole.teePosition,
        weather: hole.weather,
        needleSpeed: hole.needleSpeed
      })) as any
    };
    
    // Call API
    const response = await eventsApi.createEvent(createData);
    
    if (response.success && response.data) {
      showSuccess('Event created successfully!');
      emit('eventCreated', response.data);
      closeModal();
    } else {
      showError('Failed to create event');
    }
  } catch (error: any) {
    const errorMessage = handleEventCreateError(error, 'Failed to create event');
    if (errorMessage) {
      showError(errorMessage);
    }
  } finally {
    isLoading.value = false;
  }
};

// Get status color
const getStatusColor = (status: string | undefined) => {
  switch (status) {
    case 'PUBLISHED':
      return 'success';
    case 'DRAFT':
      return 'warning';
    case 'ARCHIVED':
      return 'grey';
    default:
      return 'primary';
  }
};

// Lifecycle
onMounted(() => {
  initializeForm();
});
</script>

<style scoped>
.event-create-modal {
  border-radius: 8px;
}

.modal-content {
  max-height: 70vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.hole-card {
  border: 1px solid #e0e0e0;
  transition: all 0.2s ease;
}

.hole-card:hover {
  border-color: #1976d2;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
}

:deep(.input-field .v-field__input) {
  font-size: 1rem;
}

:deep(.modal-button) {
  font-size: 1rem;
}
</style>
