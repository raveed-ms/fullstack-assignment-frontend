<template>
  <v-dialog
    v-model="dialogValue"
    max-width="1600px"
    persistent
  >
    <v-card class="season-weeks-modal">
      <!-- Header -->
      <v-card-title class="d-flex align-center pa-6 pb-4">
        <v-icon 
          start
          icon="mdi-calendar-week"
          size="large" 
          color="primary"
          class="mr-3"
        ></v-icon>
        <span class="text-h5 font-weight-medium">
          {{ props.title || 'Season Weeks' }}
        </span>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-8">


        <!-- Weeks Tabs -->
        <v-tabs
          v-model="activeTab"
          color="primary"
          align-tabs="center"
          class="weeks-tabs mb-8"
        >
          <v-tab
            v-for="week in weeks"
            :key="week.id"
            :value="week.id"
            class="week-tab"
          >
            <v-icon start size="small">mdi-calendar-week</v-icon>
            Week {{ week.weekNumber }}
            <v-chip
              v-if="week.buckets && week.buckets.length > 0"
              size="x-small"
              color="success"
              class="ms-2"
            >
              {{ week.buckets.length }}
            </v-chip>
          </v-tab>
        </v-tabs>

        <!-- Tab Content -->
        <v-window v-model="activeTab" class="mt-6">
          <v-window-item
            v-for="week in weeks"
            :key="week.id"
            :value="week.id"
          >
            <div class="week-content">
              <!-- Week Header -->
              <div class="d-flex align-center justify-space-between mb-8">
                <div>
                  <h3 class="text-h5 mb-2">Week {{ week.weekNumber }}</h3>
                  <div class="text-body-1 text-grey-darken-1">
                    <v-icon size="small" class="me-2">mdi-calendar-range</v-icon>
                    {{ formatDate(week.startDate) }} - {{ formatDate(week.endDate) }}
                  </div>
                </div>

              </div>

              <!-- Persona Management -->
              <div class="persona-management">
                <div class="d-flex align-center justify-space-between mb-6">
                  <h4 class="text-h6">Persona Buckets</h4>
                  <v-btn
                    color="primary"
                    variant="outlined"
                    size="small"
                    @click="addPersonaRow(week.id)"
                    :disabled="isLoading"
                  >
                    <v-icon start size="small">mdi-plus</v-icon>
                    Add Persona
                  </v-btn>
                </div>
                
                <!-- Loading indicator for buckets -->
                <div v-if="isLoadingBuckets" class="text-center py-4">
                  <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
                  <div class="mt-2 text-body-2 text-grey">Loading existing personas...</div>
                </div>

                <!-- Persona Grid -->
                <div v-if="!isLoadingBuckets && (!personaRows[week.id] || personaRows[week.id].length === 0)" class="text-center py-6">
                  <v-icon size="48" color="grey-lighten-1" class="mb-3">mdi-account-group-outline</v-icon>
                  <div class="text-h6 text-grey mb-2">No Personas Yet</div>
                  <div class="text-body-2 text-grey mb-4">This week doesn't have any personas configured yet.</div>
                  <v-btn
                    color="primary"
                    variant="outlined"
                    size="small"
                    @click="addPersonaRow(week.id)"
                    :disabled="isLoading"
                  >
                    <v-icon start size="small">mdi-plus</v-icon>
                    Add First Persona
                  </v-btn>
                </div>
                
                <v-data-table
                  v-else
                  :headers="personaHeaders"
                  :items="personaRows[week.id] || []"
                  :loading="isLoading"
                  class="persona-grid"
                  density="compact"
                >

                  <template v-slot:item="{ item, index }">
                    <tr>
                      <!-- Persona Name -->
                      <td>
                        <v-text-field
                          :model-value="item.name || ''"
                          @update:model-value="(value) => updatePersonaValue(week.id, index, 'name', value)"
                          variant="outlined"
                          density="compact"
                          placeholder="e.g., Beginner"
                          :rules="[rules.required, rules.nameLength]"
                          hide-details
                          class="persona-input"
                        ></v-text-field>
                      </td>
                      
                      <!-- Description -->
                      <td>
                        <v-text-field
                          :model-value="item.description || ''"
                          @update:model-value="(value) => updatePersonaValue(week.id, index, 'description', value)"
                          variant="outlined"
                          density="compact"
                          placeholder="Description"
                          hide-details
                          class="persona-input"
                        ></v-text-field>
                      </td>
                      
                      <!-- Min Level -->
                      <td>
                        <v-text-field
                          :model-value="item.personaRules?.level?.min || ''"
                          @update:model-value="(value) => updatePersonaValue(week.id, index, 'personaRules.level.min', value)"
                          type="number"
                          variant="outlined"
                          density="compact"
                          placeholder="Min"
                          min="0"
                          max="100"
                          hide-details
                          class="persona-input"
                        ></v-text-field>
                      </td>
                      
                      <!-- Max Level -->
                      <td>
                        <v-text-field
                          :model-value="item.personaRules?.level?.max || ''"
                          @update:model-value="(value) => updatePersonaValue(week.id, index, 'personaRules.level.max', value)"
                          type="number"
                          variant="outlined"
                          density="compact"
                          placeholder="Max"
                          min="0"
                          max="100"
                          hide-details
                          class="persona-input"
                        ></v-text-field>
                      </td>
                      
                      <!-- Min MMR -->
                      <td>
                        <v-text-field
                          :model-value="item.personaRules?.mmr?.min || ''"
                          @update:model-value="(value) => updatePersonaValue(week.id, index, 'personaRules.mmr.min', value)"
                          type="number"
                          variant="outlined"
                          density="compact"
                          placeholder="Min"
                          min="0"
                          max="3000"
                          hide-details
                          class="persona-input"
                        ></v-text-field>
                      </td>
                      
                      <!-- Max MMR -->
                      <td>
                        <v-text-field
                          :model-value="item.personaRules?.mmr?.max || ''"
                          @update:model-value="(value) => updatePersonaValue(week.id, index, 'personaRules.mmr.max', value)"
                          type="number"
                          variant="outlined"
                          density="compact"
                          placeholder="Max"
                          min="0"
                          max="3000"
                          hide-details
                          class="persona-input"
                        ></v-text-field>
                      </td>
                      
                      <!-- Min Spending -->
                      <td>
                        <v-text-field
                          :model-value="item.personaRules?.spending?.min || ''"
                          @update:model-value="(value) => updatePersonaValue(week.id, index, 'personaRules.spending.min', value)"
                          type="number"
                          variant="outlined"
                          density="compact"
                          placeholder="Min"
                          min="0"
                          hide-details
                          class="persona-input"
                        ></v-text-field>
                      </td>
                      
                      <!-- Max Spending -->
                      <td>
                        <v-text-field
                          :model-value="item.personaRules?.spending?.max || ''"
                          @update:model-value="(value) => updatePersonaValue(week.id, index, 'personaRules.spending.max', value)"
                          type="number"
                          variant="outlined"
                          density="compact"
                          placeholder="Max"
                          min="0"
                          hide-details
                          class="persona-input"
                        ></v-text-field>
                      </td>
                      
                      <!-- Priority -->
                      <td>
                        <v-text-field
                          :model-value="item.priority || ''"
                          @update:model-value="(value) => updatePersonaValue(week.id, index, 'priority', value)"
                          type="number"
                          variant="outlined"
                          density="compact"
                          placeholder="Priority"
                          min="1"
                          max="10"
                          hide-details
                          class="persona-input"
                        ></v-text-field>
                      </td>
                      
                      <!-- Event -->
                      <td>
                        <div class="d-flex align-center">
                          <v-text-field
                            :model-value="item.eventName || ''"
                            variant="outlined"
                            density="compact"
                            placeholder="Select Event"
                            readonly
                            hide-details
                            class="persona-input mr-2"
                          ></v-text-field>
                          <v-btn
                            color="primary"
                            variant="outlined"
                            size="x-small"
                            @click="openEventSelector(week.id, index)"
                            :disabled="isLoading"
                          >
                            <v-icon size="small">mdi-magnify</v-icon>
                          </v-btn>
                        </div>
                      </td>
                      
                      <!-- Actions -->
                      <td>
                        <v-btn
                          color="error"
                          variant="outlined"
                          size="x-small"
                          @click="removePersonaRow(week.id, index)"
                          :disabled="isLoading"
                          :loading="isDeletingPersona?.weekId === week.id && isDeletingPersona?.index === index"
                        >
                          <v-icon size="small">mdi-delete</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
                
                <!-- Week Save Button -->
                <div class="d-flex justify-end mt-4">
                  <v-btn
                    color="primary"
                    @click="saveWeekPersonas(week.id)"
                    :loading="isLoading"
                    :disabled="!hasPersonasForWeek(week.id)"
                  >
                    Save Week {{ week.weekNumber }}
                  </v-btn>
                </div>
              </div>
            </div>
          </v-window-item>
        </v-window>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-6">
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="closeModal"
          :disabled="isLoading"
        >
          Done
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Event Selector Modal -->
  <v-dialog
    v-model="eventSelectorOpen"
    max-width="800px"
    persistent
  >
    <v-card>
      <v-card-title class="d-flex align-center pa-6 pb-4">
        <v-icon start color="primary" size="large" class="mr-3">mdi-calendar-search</v-icon>
        <span class="text-h5 font-weight-medium">Select Event for Persona</span>
      </v-card-title>
      
      <v-card-text>
        <div class="mb-4">
          <v-text-field
            v-model="eventSearchQuery"
            variant="outlined"
            placeholder="Search events by name..."
            prepend-inner-icon="mdi-magnify"
            clearable
            @update:model-value="searchEvents"
            hide-details
          ></v-text-field>
        </div>
        
        <div v-if="searchingEvents" class="text-center py-4">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <div class="mt-2">Searching events...</div>
        </div>
        
        <div v-else-if="searchResults.length === 0" class="text-center py-4 text-grey">
          No events found
        </div>
        
        <div v-else class="event-list">
          <v-list>
            <v-list-item
              v-for="event in searchResults"
              :key="event.id"
              @click="selectEvent(event)"
              class="mb-2"
              :class="{ 'selected-event': selectedEventId === event.id }"
            >
              <template v-slot:prepend>
                <v-icon color="primary">mdi-calendar</v-icon>
              </template>
              
              <v-list-item-title>{{ event.name }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ formatDate(event.startDate) }} - {{ formatDate(event.endDate) }}
              </v-list-item-subtitle>
              
              <template v-slot:append>
                <v-chip
                  :color="getEventStatusColor(event.status)"
                  size="small"
                  variant="outlined"
                >
                  {{ event.status }}
                </v-chip>
              </template>
            </v-list-item>
          </v-list>
        </div>
      </v-card-text>
      
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          color="secondary"
          variant="outlined"
          @click="closeEventSelector"
          :disabled="isLoading"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          @click="confirmEventSelection"
          :disabled="!selectedEventId"
          :loading="isLoading"
        >
          Select Event
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Season, Week } from '~/api/seasons';
import { bucketsApi } from '~/api/buckets';
import { useBucketsErrorHandler } from '~/composables/errors/useBucketsErrorHandler';
import { useNotifications } from '~/composables/ui/useNotifications';
import { eventsApi } from '~/api/events';

interface Props {
  modelValue: boolean;
  season: Season | null;
  weeks: Week[];
  mode?: 'create' | 'edit';
  title?: string;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { showError, showSuccess } = useNotifications();
const { handleBucketCreateError, handleBucketUpdateError, handleBucketValidationError, handleBucketFetchError, handleBucketDeleteError } = useBucketsErrorHandler();

const isLoading = ref(false);
const isLoadingBuckets = ref(false);
const isDeletingPersona = ref<{ weekId: number; index: number } | null>(null);
const activeTab = ref<number | null>(null);

// Event selector state
const eventSelectorOpen = ref(false);
const eventSearchQuery = ref('');
const searchResults = ref<any[]>([]);
const searchingEvents = ref(false);
const selectedEventId = ref<number | null>(null);
const currentPersonaContext = ref<{ weekId: number; index: number } | null>(null);

// Persona management state
const personaRows = ref<Record<number, any[]>>({});

// Persona table headers
const personaHeaders = [
  { title: 'Name', key: 'name', width: '180px' },
  { title: 'Description', key: 'description', width: '300px' },
  { title: 'Min Level', key: 'level.min', width: '120px' },
  { title: 'Max Level', key: 'level.max', width: '120px' },
  { title: 'Min MMR', key: 'mmr.min', width: '120px' },
  { title: 'Max MMR', key: 'mmr.max', width: '120px' },
  { title: 'Min Spending', key: 'spending.min', width: '140px' },
  { title: 'Max Spending', key: 'spending.max', width: '140px' },
  { title: 'Priority', key: 'priority', width: '120px' },
  { title: 'Event', key: 'eventName', width: '350px' },
  { title: 'Actions', key: 'actions', width: '100px' }
];

// Validation rules
const rules = {
  required: (value: any) => !!value || 'This field is required',
  nameLength: (value: string) => (value.length >= 2 && value.length <= 50) || 'Name must be 2-50 characters'
};

// Initialize persona rows when weeks are available
const initializePersonaRows = () => {
  if (props.weeks.length > 0) {
    activeTab.value = props.weeks[0].id;
    // Initialize persona rows for each week
    props.weeks.forEach(week => {
      if (!personaRows.value[week.id]) {
        personaRows.value[week.id] = [];
      }
    });
  }
};

// Watch for weeks changes to initialize persona rows
watch(() => props.weeks, (newWeeks) => {
  console.log('SeasonWeeksModal: Weeks changed:', newWeeks);
  if (newWeeks && newWeeks.length > 0) {
    initializePersonaRows();
  }
}, { immediate: true });

// Watch for modal opening to load existing buckets
watch(() => props.modelValue, async (isOpen) => {
  console.log('SeasonWeeksModal watch triggered:', { isOpen, hasSeason: !!props.season, weeksCount: props.weeks.length });
  
  if (isOpen && props.season && props.weeks.length > 0) {
    console.log('SeasonWeeksModal: Modal opened, loading existing buckets...');
    // Ensure persona rows are initialized before loading buckets
    initializePersonaRows();
    await loadExistingBuckets();
  } else {
    console.log('SeasonWeeksModal: Modal not ready to load buckets:', { 
      isOpen, 
      hasSeason: !!props.season, 
      weeksCount: props.weeks.length 
    });
  }
}, { immediate: true });

const dialogValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Check if there are personas to save
const hasPersonasToSave = computed(() => {
  if (!personaRows.value || typeof personaRows.value !== 'object') {
    return false;
  }
  return Object.values(personaRows.value).some(rows => rows && Array.isArray(rows) && rows.length > 0);
});

// Check if a specific week has personas to save
const hasPersonasForWeek = (weekId: number) => {
  if (!personaRows.value || typeof personaRows.value !== 'object') {
    return false;
  }
  return personaRows.value[weekId] && Array.isArray(personaRows.value[weekId]) && personaRows.value[weekId].length > 0;
};

const closeModal = () => {
  emit('update:modelValue', false);
};

const goToSeasonsList = () => {
  // Navigate to seasons list page
  navigateTo('/seasons');
  closeModal();
};

// Persona management functions
const addPersonaRow = (weekId: number) => {
  // Ensure personaRows is properly initialized
  if (!personaRows.value || typeof personaRows.value !== 'object') {
    personaRows.value = {};
  }
  
  if (!personaRows.value[weekId]) {
    personaRows.value[weekId] = [];
  }
  
  const newPersona = {
    name: '',
    description: '',
    personaRules: {
      level: { min: undefined, max: undefined },
      mmr: { min: undefined, max: undefined },
      spending: { min: undefined, max: undefined }
    },
    priority: 1,
    eventId: undefined,
    eventName: ''
  };
  
  const week = props.weeks.find(w => w.id === weekId);
  const weekNumber = week ? week.weekNumber : weekId;
  
  console.log(`Adding new persona row for week ${weekNumber}:`, newPersona);
  personaRows.value[weekId].push(newPersona);
  console.log(`Updated personaRows for week ${weekNumber}:`, personaRows.value[weekId]);
};

const removePersonaRow = async (weekId: number, index: number) => {
  // Ensure personaRows is properly initialized
  if (!personaRows.value || typeof personaRows.value !== 'object') {
    return;
  }
  
  if (!personaRows.value[weekId] || !Array.isArray(personaRows.value[weekId])) {
    return;
  }
  
  const persona = personaRows.value[weekId][index];
  if (!persona) {
    return;
  }
  
  // Set loading state for this specific persona
  isDeletingPersona.value = { weekId, index };
  
  try {
    // If the persona has an existing bucket ID, delete it from the database
    if (persona.bucketId) {
      console.log(`Deleting existing bucket with ID: ${persona.bucketId}`);
      await bucketsApi.deleteBucket(persona.bucketId);
      showSuccess(`Persona deleted successfully`);
    }
    
    // Remove from local state
    personaRows.value[weekId].splice(index, 1);
    console.log(`Removed persona at index ${index} from week ${weekId}`);
    
  } catch (error: any) {
    console.error('Error deleting persona:', error);
    const errorMessage = handleBucketDeleteError(error);
    showError('Failed to delete persona', errorMessage);
  } finally {
    // Clear loading state
    isDeletingPersona.value = null;
  }
};

// Helper function to safely update nested persona values
const updatePersonaValue = (weekId: number, index: number, path: string, value: any) => {
  if (!personaRows.value || typeof personaRows.value !== 'object') {
    return;
  }
  
  if (!personaRows.value[weekId] || !Array.isArray(personaRows.value[weekId])) {
    return;
  }
  
  const persona = personaRows.value[weekId][index];
  if (!persona) {
    return;
  }
  
  // Parse the path (e.g., "personaRules.level.min")
  const pathParts = path.split('.');
  let current = persona;
  
  // Navigate to the parent object
  for (let i = 0; i < pathParts.length - 1; i++) {
    const part = pathParts[i];
    if (!current[part]) {
      current[part] = {};
    }
    current = current[part];
  }
  
  // Set the final value
  const finalPart = pathParts[pathParts.length - 1];
  if (value === '' || value === null || value === undefined) {
    current[finalPart] = undefined;
  } else {
    // Handle different field types
    if (finalPart === 'name' || finalPart === 'description' || finalPart === 'eventName') {
      current[finalPart] = String(value);
    } else {
      current[finalPart] = Number(value);
    }
  }
  
  console.log(`Updated ${path} to ${value} for week ${weekId}, persona ${index}`);
};

const loadExistingBuckets = async () => {
  if (!props.season) {
    console.log('loadExistingBuckets: No season provided');
    return;
  }
  
  console.log('loadExistingBuckets: Starting to load buckets for season:', props.season.id);
  console.log('loadExistingBuckets: Weeks to check:', props.weeks);
  
  // Ensure personaRows is properly initialized
  if (!personaRows.value || typeof personaRows.value !== 'object') {
    console.log('loadExistingBuckets: Initializing personaRows');
    personaRows.value = {};
  }
  
  isLoadingBuckets.value = true;
  
  try {
    for (const week of props.weeks) {
      console.log(`loadExistingBuckets: Fetching buckets for week ${week.weekNumber} (ID: ${week.id})`);
      
      // Ensure the week entry exists in personaRows
      if (!personaRows.value[week.id]) {
        personaRows.value[week.id] = [];
      }
      
      const bucketsResponse = await bucketsApi.getBucketsBySeasonAndWeek(props.season.id, week.id);
      console.log(`loadExistingBuckets: Response for week ${week.weekNumber}:`, bucketsResponse);
      
      if (bucketsResponse.success && bucketsResponse.data) {
        console.log(`loadExistingBuckets: Found ${bucketsResponse.data.length} buckets for week ${week.weekNumber}`);
        
        // Convert buckets to persona format and fetch event details
        const personas = await Promise.all(bucketsResponse.data.map(async (bucket) => {
          // Fetch event details if eventId exists
          let eventName = '';
          if (bucket.eventId !== null && bucket.eventId !== undefined && !isNaN(Number(bucket.eventId))) {
            try {
              console.log(`loadExistingBuckets: Fetching event details for eventId: ${bucket.eventId}`);
              const eventResponse = await eventsApi.getEvent(bucket.eventId);
              console.log(`loadExistingBuckets: Event response for ${bucket.eventId}:`, eventResponse);
              
              if (eventResponse.success && eventResponse.data) {
                eventName = eventResponse.data.name || `Event #${bucket.eventId}`;
                console.log(`loadExistingBuckets: Set eventName to: "${eventName}" for event ${bucket.eventId}`);
              } else {
                eventName = `Event #${bucket.eventId}`;
                console.log(`loadExistingBuckets: Event response not successful, using fallback: "${eventName}"`);
              }
            } catch (error) {
              console.warn(`Failed to fetch event ${bucket.eventId}:`, error);
              eventName = `Event #${bucket.eventId}`;
              console.log(`loadExistingBuckets: Error fetching event, using fallback: "${eventName}"`);
            }
          } else {
            console.log(`loadExistingBuckets: No eventId for bucket "${bucket.name}"`);
          }
          
          // Ensure all required properties exist with safe defaults
          const persona = {
            bucketId: bucket.id, // Store the bucket ID for deletion
            name: bucket.name || '',
            description: bucket.description || '',
            personaRules: {
              level: {
                min: (bucket.personaRules && bucket.personaRules.level && bucket.personaRules.level.min !== null && bucket.personaRules.level.min !== undefined) ? bucket.personaRules.level.min : undefined,
                max: (bucket.personaRules && bucket.personaRules.level && bucket.personaRules.level.max !== null && bucket.personaRules.level.max !== undefined) ? bucket.personaRules.level.max : undefined
              },
              mmr: {
                min: (bucket.personaRules && bucket.personaRules.mmr && bucket.personaRules.mmr.min !== null && bucket.personaRules.mmr.min !== undefined) ? bucket.personaRules.mmr.min : undefined,
                max: (bucket.personaRules && bucket.personaRules.mmr && bucket.personaRules.mmr.max !== null && bucket.personaRules.mmr.max !== undefined) ? bucket.personaRules.mmr.max : undefined
              },
              spending: {
                min: (bucket.personaRules && bucket.personaRules.spending && bucket.personaRules.spending.min !== null && bucket.personaRules.spending.min !== undefined) ? bucket.personaRules.spending.min : undefined,
                max: (bucket.personaRules && bucket.personaRules.spending && bucket.personaRules.spending.max !== null && bucket.personaRules.spending.max !== undefined) ? bucket.personaRules.spending.max : undefined
              }
            },
            priority: (bucket.priority !== null && bucket.priority !== undefined && !isNaN(Number(bucket.priority))) ? Number(bucket.priority) : 1,
            eventId: (bucket.eventId !== null && bucket.eventId !== undefined && !isNaN(Number(bucket.eventId))) ? Number(bucket.eventId) : undefined,
            eventName: eventName
          };
          
          // Validate the structure
          console.log(`loadExistingBuckets: Validated persona for ${bucket.name}:`, persona);
          console.log(`loadExistingBuckets: Final eventName for ${bucket.name}: "${persona.eventName}"`);
          return persona;
        }));
        
        console.log(`loadExistingBuckets: Converted personas for week ${week.weekNumber}:`, personas);
        console.log(`loadExistingBuckets: Sample persona structure:`, JSON.stringify(personas[0], null, 2));
        personaRows.value[week.id] = personas;
      } else {
        console.log(`loadExistingBuckets: No buckets found for week ${week.weekNumber} or API call failed`);
        console.log(`loadExistingBuckets: Response success: ${bucketsResponse.success}, data:`, bucketsResponse.data);
        // Ensure empty array is set for this week
        personaRows.value[week.id] = [];
      }
    }
    
    console.log('loadExistingBuckets: Final personaRows state:', personaRows.value);
    
    // Check if any personas were loaded
    const totalPersonas = Object.values(personaRows.value).reduce((total, personas) => total + personas.length, 0);
    console.log(`loadExistingBuckets: Total personas loaded: ${totalPersonas}`);
    
    if (totalPersonas === 0) {
      console.log('loadExistingBuckets: No existing personas found - this is normal for new seasons');
    }
  } catch (error: any) {
    console.error('loadExistingBuckets: Error occurred:', error);
    const errorMessage = handleBucketFetchError(error);
    showError('Failed to load existing buckets', errorMessage);
  } finally {
    isLoadingBuckets.value = false;
  }
};

const savePersonas = async () => {
  if (!props.season) return;
  
  console.log('Starting save personas...', { season: props.season, personaRows: personaRows.value });
  
  isLoading.value = true;
  
  try {
    // Validate personas before saving
    const validationErrors = validatePersonas();
    if (validationErrors.length > 0) {
      // Show validation errors
      const errorMessage = validationErrors.join('\n');
      showError('Validation failed', errorMessage);
      return;
    }
    
    console.log('Validation passed, saving personas...');
    
    // Save personas for each week
    if (!personaRows.value || typeof personaRows.value !== 'object') {
      console.log('savePersonas: No personaRows to save');
      return;
    }
    
    for (const [weekId, personas] of Object.entries(personaRows.value)) {
      if (personas && Array.isArray(personas) && personas.length > 0) {
        const week = props.weeks.find(w => w.id === parseInt(weekId));
        const weekNumber = week ? week.weekNumber : parseInt(weekId);
        console.log(`Saving ${personas.length} personas for week ${weekNumber}`);
        await savePersonasForWeek(parseInt(weekId), personas, weekNumber);
      }
    }
    
    console.log('All personas saved, validating...');
    
    // Validate week personas after saving
    await validateWeekPersonas();
    
    // Show success message
    showSuccess('Personas saved successfully!');
    
    // Close modal
    closeModal();
    
  } catch (error: any) {
    console.error('Error in savePersonas:', error);
    const errorMessage = handleBucketCreateError(error);
    showError('Failed to save personas', errorMessage);
  } finally {
    isLoading.value = false;
  }
};

// Save personas for a specific week
const saveWeekPersonas = async (weekId: number) => {
  if (!props.season) return;
  
  // Find the week object to get the week number
  const week = props.weeks.find(w => w.id === weekId);
  if (!week) return;
  
  console.log(`Starting save personas for week ${week.weekNumber}...`);
  
  isLoading.value = true;
  
  try {
    // Validate personas for this week
    const weekPersonas = (personaRows.value && personaRows.value[weekId] && Array.isArray(personaRows.value[weekId])) 
      ? personaRows.value[weekId] 
      : [];
    const validationErrors = validatePersonasForWeek(weekId, weekPersonas);
    
    if (validationErrors.length > 0) {
      const errorMessage = validationErrors.join('\n');
      showError('Validation failed', errorMessage);
      return;
    }
    
    console.log(`Validation passed, saving ${weekPersonas.length} personas for week ${week.weekNumber}`);
    
    // Save personas for this week
    await savePersonasForWeek(weekId, weekPersonas, week.weekNumber);
    
    // Validate week personas after saving
    await validateWeekPersonas();
    
    // Show success message
    showSuccess(`Week ${week.weekNumber} personas saved successfully!`);
    
  } catch (error: any) {
    console.error(`Error saving personas for week ${week.weekNumber}:`, error);
    const errorMessage = handleBucketCreateError(error);
    showError(`Failed to save week ${week.weekNumber} personas`, errorMessage);
  } finally {
    isLoading.value = false;
  }
};

const validatePersonas = (): string[] => {
  const errors: string[] = [];
  
  if (!personaRows.value || typeof personaRows.value !== 'object') {
    return errors;
  }
  
  Object.entries(personaRows.value).forEach(([weekId, personas]) => {
    if (!personas || !Array.isArray(personas)) {
      return;
    }
    
    const week = props.weeks.find(w => w.id === parseInt(weekId));
    const weekNumber = week ? week.weekNumber : parseInt(weekId);
    
    personas.forEach((persona, index) => {
      if (!persona || !persona.name || !persona.name.trim()) {
        errors.push(`Week ${weekNumber}: Persona ${index + 1} name is required`);
        return;
      }
      
      // Validate level ranges
      if (persona.personaRules?.level?.min !== undefined && persona.personaRules?.level?.max !== undefined) {
        if (persona.personaRules.level.min > persona.personaRules.level.max) {
          errors.push(`Week ${weekNumber}: Persona ${index + 1} min level cannot be greater than max level`);
        }
      }
      
      // Validate MMR ranges
      if (persona.personaRules?.mmr?.min !== undefined && persona.personaRules?.mmr?.max !== undefined) {
        if (persona.personaRules.mmr.min > persona.personaRules.mmr.max) {
          errors.push(`Week ${weekNumber}: Persona ${index + 1} min MMR cannot be greater than max MMR`);
        }
      }
      
      // Validate spending ranges
      if (persona.personaRules?.spending?.min !== undefined && persona.personaRules?.spending?.max !== undefined) {
        if (persona.personaRules.spending.min > persona.personaRules.spending.max) {
          errors.push(`Week ${weekNumber}: Persona ${index + 1} min spending cannot be greater than max spending`);
        }
      }
    });
  });
  
  return errors;
};

// Validate personas for a specific week
const validatePersonasForWeek = (weekId: number, personas: any[]): string[] => {
  const errors: string[] = [];
  
  // Check for duplicate priorities
  const priorities = personas.map(p => p.priority).filter(p => p !== undefined);
  const uniquePriorities = new Set(priorities);
  if (priorities.length !== uniquePriorities.size) {
    errors.push('Duplicate priorities found. Each persona must have a unique priority.');
  }
  
  personas.forEach((persona, index) => {
    if (!persona.name.trim()) {
      errors.push(`Persona ${index + 1} name is required`);
    }
    
    // Validate level ranges
    if (persona.personaRules.level.min !== undefined && persona.personaRules.level.max !== undefined) {
      if (persona.personaRules.level.min > persona.personaRules.level.max) {
        errors.push(`Persona ${index + 1} min level cannot be greater than max level`);
      }
    }
    
    // Validate MMR ranges
    if (persona.personaRules.mmr.min !== undefined && persona.personaRules.mmr.max !== undefined) {
      if (persona.personaRules.mmr.min > persona.personaRules.mmr.max) {
        errors.push(`Persona ${index + 1} min MMR cannot be greater than max MMR`);
      }
    }
    
    // Validate spending ranges
    if (persona.personaRules.spending.min !== undefined && persona.personaRules.spending.max !== undefined) {
      if (persona.personaRules.spending.min > persona.personaRules.spending.max) {
        errors.push(`Persona ${index + 1} min spending cannot be greater than max spending`);
      }
    }
  });
  
  return errors;
};

const savePersonasForWeek = async (weekId: number, personas: any[], weekNumber: number) => {
  if (!props.season) return;
  
  console.log(`Starting savePersonasForWeek for week ${weekNumber} with ${personas.length} personas`);
  
  // Get existing buckets for this week to check for updates
  const existingBucketsResponse = await bucketsApi.getBucketsBySeasonAndWeek(props.season.id, weekId);
  console.log('Existing buckets response:', existingBucketsResponse);
  
  const existingBuckets = existingBucketsResponse.success && existingBucketsResponse.data ? existingBucketsResponse.data : [];
  console.log('Existing buckets:', existingBuckets);
  
  for (const persona of personas) {
    try {
      console.log(`Processing persona:`, persona);
      
      // Check if bucket with this name already exists
      const existingBucket = existingBuckets.find(bucket => bucket.name === persona.name);
      
      if (existingBucket) {
        console.log(`Updating existing bucket:`, existingBucket);
        // Clean persona rules to remove undefined values
        const cleanPersonaRules = {
          level: persona.personaRules.level.min !== undefined || persona.personaRules.level.max !== undefined ? {
            min: persona.personaRules.level.min,
            max: persona.personaRules.level.max
          } : undefined,
          mmr: persona.personaRules.mmr.min !== undefined || persona.personaRules.mmr.max !== undefined ? {
            min: persona.personaRules.mmr.min,
            max: persona.personaRules.mmr.max
          } : undefined,
          spending: persona.personaRules.spending.min !== undefined || persona.personaRules.spending.max !== undefined ? {
            min: persona.personaRules.spending.min,
            max: persona.personaRules.spending.max
          } : undefined
        };
        
        // Update existing bucket
        const updateData = {
          description: persona.description,
          personaRules: cleanPersonaRules,
          priority: persona.priority,
          eventId: persona.eventId
        };
        
                const updateResponse = await bucketsApi.updateBucket(existingBucket.id, updateData);
        console.log('Update response:', updateResponse);
        
        // Check if update was successful
        if (!updateResponse.success) {
          console.error('Update failed with response:', updateResponse);
          const errorMsg = updateResponse.error?.message || 'Unknown error';
          const errorCode = updateResponse.error?.code || 'UNKNOWN';
          throw new Error(`Failed to update bucket "${persona.name}" for Week ${weekNumber}: ${errorMsg}`);
        }
      } else {
        // Clean persona rules to remove undefined values
        const cleanPersonaRules = {
          level: persona.personaRules.level.min !== undefined || persona.personaRules.level.max !== undefined ? {
            min: persona.personaRules.level.min,
            max: persona.personaRules.level.max
          } : undefined,
          mmr: persona.personaRules.mmr.min !== undefined || persona.personaRules.mmr.max !== undefined ? {
            min: persona.personaRules.mmr.min,
            max: persona.personaRules.mmr.max
          } : undefined,
          spending: persona.personaRules.spending.min !== undefined || persona.personaRules.spending.max !== undefined ? {
            min: persona.personaRules.spending.min,
            max: persona.personaRules.spending.max
          } : undefined
        };
        
        console.log(`Creating new bucket with data:`, {
          seasonId: props.season.id,
          weekId: weekId,
          name: persona.name,
          description: persona.description,
          personaRules: cleanPersonaRules,
          priority: persona.priority
        });
        
        // Create new bucket
        const createData = {
          seasonId: props.season.id,
          weekId: weekId,
          name: persona.name,
          description: persona.description,
          personaRules: cleanPersonaRules,
          priority: persona.priority,
          eventId: persona.eventId
        };
        
        const createResponse = await bucketsApi.createBucket(createData);
        console.log('Create response:', createResponse);
        
        // Check if creation was successful
        if (!createResponse.success) {
          console.error('Creation failed with response:', createResponse);
          const errorMsg = createResponse.error?.message || 'Unknown error';
          const errorCode = createResponse.error?.code || 'UNKNOWN';
          throw new Error(`Failed to create bucket "${persona.name}" for Week ${weekNumber}: ${errorMsg}`);
        }
      }
    } catch (error: any) {
      console.error(`Error processing persona ${persona.name}:`, error);
      const existingBucket = existingBuckets.find(bucket => bucket.name === persona.name);
      if (existingBucket) {
        const errorMessage = handleBucketUpdateError(error);
        throw new Error(`Failed to update bucket "${persona.name}" for Week ${weekNumber}: ${errorMessage}`);
      } else {
        const errorMessage = handleBucketCreateError(error);
        throw new Error(`Failed to create bucket "${persona.name}" for Week ${weekNumber}: ${errorMessage}`);
      }
    }
  }
  
  console.log(`Completed savePersonasForWeek for week ${weekNumber}`);
};

// Event selector functions
const openEventSelector = (weekId: number, index: number) => {
  currentPersonaContext.value = { weekId, index };
  selectedEventId.value = null;
  eventSearchQuery.value = '';
  searchResults.value = [];
  eventSelectorOpen.value = true;
  
  // Load initial events
  searchEvents();
};

const searchEvents = async () => {
  if (!eventSearchQuery.value.trim()) {
    // Load all events if no search query
    try {
      searchingEvents.value = true;
      const response = await eventsApi.getEvents({ limit: 50 });
      if (response.success && response.data) {
        searchResults.value = response.data;
      }
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      searchingEvents.value = false;
    }
  } else {
    // Search events by name
    try {
      searchingEvents.value = true;
      const response = await eventsApi.getEvents({ 
        searchName: eventSearchQuery.value,
        limit: 20 
      });
      if (response.success && response.data) {
        searchResults.value = response.data;
      }
    } catch (error) {
      console.error('Failed to search events:', error);
    } finally {
      searchingEvents.value = false;
    }
  }
};

const selectEvent = (event: any) => {
  selectedEventId.value = event.id;
};

const closeEventSelector = () => {
  eventSelectorOpen.value = false;
  currentPersonaContext.value = null;
  selectedEventId.value = null;
  eventSearchQuery.value = '';
  searchResults.value = [];
};

const confirmEventSelection = () => {
  if (!currentPersonaContext.value || !selectedEventId.value) return;
  
  const { weekId, index } = currentPersonaContext.value;
  const selectedEvent = searchResults.value.find(e => e.id === selectedEventId.value);
  
  if (selectedEvent && personaRows.value[weekId] && personaRows.value[weekId][index]) {
    personaRows.value[weekId][index].eventId = selectedEvent.id;
    personaRows.value[weekId][index].eventName = selectedEvent.name;
  }
  
  closeEventSelector();
};

const getEventStatusColor = (status: string) => {
  switch (status) {
    case 'DRAFT':
      return 'grey';
    case 'PUBLISHED':
      return 'green';
    case 'ARCHIVED':
      return 'red';
    default:
      return 'blue';
  }
};

const validateWeekPersonas = async () => {
  if (!props.season) return;
  
  try {
    // Validate each week's personas
    for (const week of props.weeks) {
      const validationResponse = await bucketsApi.validateBucketsOnPublish(props.season.id, week.id);
      
      if (validationResponse.success && validationResponse.data) {
        const result = validationResponse.data;
        
        if (!result.isValid) {
          const errorMessage = result.errors.join('\n');
          showError('Validation failed', errorMessage);
          return false;
        }
        
        if (result.warnings.length > 0) {
          const warningMessage = result.warnings.join('\n');
          // You could show warnings in a different way if needed
          console.warn('Validation warnings:', warningMessage);
        }
      }
    }
    
    return true;
  } catch (error: any) {
    const errorMessage = handleBucketValidationError(error);
    showError('Validation failed', errorMessage);
    return false;
  }
};





const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};


</script>

<style scoped>
.season-weeks-modal {
  border-radius: 8px;
}

.weeks-tabs {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.week-tab {
  font-size: 1rem;
  font-weight: 500;
}

.week-content {
  min-height: 600px;
  padding: 24px 0;
}

.persona-management {
  margin-top: 32px;
  padding: 24px;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.persona-grid {
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.persona-input {
  font-size: 0.9rem;
}

/* Event selector styling */
.event-list {
  max-height: 400px;
  overflow-y: auto;
}

.selected-event {
  background-color: rgba(25, 118, 210, 0.08) !important;
  border-left: 4px solid #1976d2;
}

:deep(.v-list-item) {
  cursor: pointer;
  border-radius: 8px;
  margin-bottom: 4px;
  transition: background-color 0.2s ease;
}

:deep(.v-list-item:hover) {
  background-color: rgba(0, 0, 0, 0.04);
}

:deep(.v-list-item-title) {
  font-weight: 500;
  font-size: 1rem;
}

:deep(.v-list-item-subtitle) {
  font-size: 0.9rem;
  color: rgba(0, 0, 0, 0.6);
}




</style>
