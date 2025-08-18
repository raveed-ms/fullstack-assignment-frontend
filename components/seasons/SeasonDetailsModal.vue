<template>
  <v-dialog
    v-model="dialogValue"
    max-width="1200px"
    persistent
  >
    <v-card>
      <!-- Header -->
      <v-card-title class="d-flex align-center pa-6 pb-4">
        <v-icon start color="primary" size="large" class="mr-3">mdi-calendar-multiple</v-icon>
        <span class="text-h5 font-weight-medium">{{ season?.title || 'Season Details' }}</span>
      </v-card-title>
      
      <v-divider></v-divider>
      
      <v-card-text class="pa-6 pt-0">
        <div v-if="season" class="season-details">
          <!-- Tabs -->
          <v-tabs v-model="activeTab" color="primary" class="mb-6">
            <v-tab value="basic">Basic Info</v-tab>
            <v-tab value="weeks">Weeks</v-tab>
          </v-tabs>

          <!-- Tab Content -->
          <v-window v-model="activeTab">
            <!-- Basic Info Tab -->
            <v-window-item value="basic">
              <div class="tab-content">
                <v-row>
                  <!-- Left Column -->
                  <v-col cols="12" md="6">
                    <v-card variant="outlined" class="detail-card mb-4">
                      <v-card-text class="pa-4">
                        <div class="detail-item">
                          <div class="detail-label">Season Title</div>
                          <div class="detail-value">{{ season.title }}</div>
                        </div>
                      </v-card-text>
                    </v-card>
                    
                    <v-card variant="outlined" class="detail-card mb-4">
                      <v-card-text class="pa-4">
                        <div class="detail-item">
                          <div class="detail-label">Status</div>
                          <div class="detail-value">{{ season.status }}</div>
                        </div>
                      </v-card-text>
                    </v-card>
                    
                    <v-card variant="outlined" class="detail-card mb-4">
                      <v-card-text class="pa-4">
                        <div class="detail-item">
                          <div class="detail-label">Start Date</div>
                          <div class="detail-value">{{ formatDateTime(season.startDate) }}</div>
                        </div>
                      </v-card-text>
                    </v-card>
                    
                    <v-card variant="outlined" class="detail-card mb-4">
                      <v-card-text class="pa-4">
                        <div class="detail-item">
                          <div class="detail-label">End Date</div>
                          <div class="detail-value">{{ formatDateTime(season.endDate) }}</div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  
                  <!-- Right Column -->
                  <v-col cols="12" md="6">
                    <v-card variant="outlined" class="detail-card mb-4">
                      <v-card-text class="pa-4">
                        <div class="detail-item">
                          <div class="detail-label">Prize Pool</div>
                          <div class="detail-value">${{ (season.reward.cash / 100).toFixed(2) }}</div>
                        </div>
                      </v-card-text>
                    </v-card>
                    
                    <v-card variant="outlined" class="detail-card mb-4">
                      <v-card-text class="pa-4">
                        <div class="detail-item">
                          <div class="detail-label">Created By</div>
                          <div class="detail-value">{{ getUserName(season.createdBy) }}</div>
                        </div>
                      </v-card-text>
                    </v-card>
                    
                    <v-card variant="outlined" class="detail-card mb-4">
                      <v-card-text class="pa-4">
                        <div class="detail-item">
                          <div class="detail-label">Created At</div>
                          <div class="detail-value">{{ formatDate(season.createdAt) }}</div>
                        </div>
                      </v-card-text>
                    </v-card>
                    
                    <v-card variant="outlined" class="detail-card mb-4">
                      <v-card-text class="pa-4">
                        <div class="detail-item">
                          <div class="detail-label">Updated By</div>
                          <div class="detail-value">{{ getUserName(season.updatedBy) }}</div>
                        </div>
                      </v-card-text>
                    </v-card>
                    
                    <v-card variant="outlined" class="detail-card mb-4">
                      <v-card-text class="pa-4">
                        <div class="detail-item">
                          <div class="detail-label">Updated At</div>
                          <div class="detail-value">{{ formatDate(season.updatedAt) }}</div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
            </v-window-item>

            <!-- Weeks Tab -->
            <v-window-item value="weeks">
              <div class="tab-content">
                <div class="mb-6">

            
            <div v-if="isLoadingWeeks" class="text-center py-6">
              <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
              <div class="mt-3 text-body-2 text-grey">Loading weeks...</div>
            </div>
            
            <div v-else-if="weeks.length === 0" class="text-center py-6">
              <v-icon size="48" color="primary" class="mb-3">mdi-calendar-blank</v-icon>
              <div class="text-h6 text-grey mb-2">No Weeks Available</div>
              <div class="text-body-2 text-grey">This season doesn't have any weeks configured yet.</div>
            </div>
            
            <div v-else>
              <!-- Week Tabs -->
              <v-tabs
                v-model="activeWeekTab"
                color="primary"
                align-tabs="start"
                class="week-tabs"
              >
                <v-tab
                  v-for="week in weeks"
                  :key="week.id"
                  :value="week.id"
                  class="week-tab"
                >
                  <div class="d-flex align-center">
                    <v-icon start size="small" class="mr-2" color="primary">mdi-calendar-week</v-icon>
                    Week {{ week.weekNumber }}
                  </div>
                </v-tab>
              </v-tabs>

              <!-- Week Content -->
              <v-window v-model="activeWeekTab" class="week-content">
                <v-window-item
                  v-for="week in weeks"
                  :key="week.id"
                  :value="week.id"
                >
                  <div class="week-details pa-4">
                    <!-- Week Date Range -->
                    <div class="week-date-range text-body-2 text-grey mb-4 text-center">
                      {{ formatDateTime(week.startDate) }} - {{ formatDateTime(week.endDate) }}
                    </div>
                    
                    <!-- Personas Section -->
                    <div class="personas-section">
                      <div class="d-flex align-center mb-3">
                        <h5 class="text-subtitle-1 d-flex align-center">
                          <v-icon start color="primary" class="mr-2">mdi-account-group</v-icon>
                          Personas
                        </h5>
                      </div>
                      
                      <div v-if="week.buckets && week.buckets.length > 0" class="personas-grid">
                        <v-card
                          v-for="bucket in week.buckets"
                          :key="bucket.id"
                          variant="outlined"
                          class="persona-card clickable-persona"
                          @click="openPersonaModal(bucket, week)"
                        >
                          <v-card-title class="pa-3 pb-2">
                            <div class="d-flex align-center justify-space-between">
                              <div class="d-flex align-center">
                                <v-icon start color="primary" size="small" class="mr-2">mdi-account</v-icon>
                                <span class="text-subtitle-1 font-weight-medium">{{ bucket.name }}</span>
                              </div>
                              <div class="d-flex align-center">
                                <v-chip 
                                  color="primary" 
                                  variant="flat" 
                                  size="small"
                                  class="priority-chip"
                                >
                                  Priority: {{ bucket.priority }}
                                </v-chip>
                                <v-icon 
                                  size="small" 
                                  color="primary" 
                                  class="ml-2 click-indicator"
                                >
                                  mdi-chevron-right
                                </v-icon>
                              </div>
                            </div>
                          </v-card-title>
                          
                          <v-card-text class="pa-3 pt-0">
                            <!-- Description -->
                            <div v-if="bucket.description" class="mb-3">
                              <div class="text-caption text-grey-darken-1 mb-1">Description:</div>
                              <div class="text-body-2">{{ bucket.description }}</div>
                            </div>
                            
                            <!-- Persona Rules Grid -->
                            <v-row class="persona-rules-grid">
                              <!-- Level -->
                              <v-col v-if="bucket.personaRules?.level?.min || bucket.personaRules?.level?.max" cols="12" md="4">
                                <div class="rule-item">
                                  <div class="rule-label">
                                    <v-icon size="small" class="me-1" color="primary">mdi-account-star</v-icon>
                                    Level
                                  </div>
                                  <div class="rule-value">
                                    <span v-if="bucket.personaRules?.level?.min && bucket.personaRules?.level?.max">
                                      {{ bucket.personaRules.level.min }} - {{ bucket.personaRules.level.max }}
                                    </span>
                                    <span v-else-if="bucket.personaRules?.level?.min">
                                      Min: {{ bucket.personaRules.level.min }}
                                    </span>
                                    <span v-else-if="bucket.personaRules?.level?.max">
                                      Max: {{ bucket.personaRules.level.max }}
                                    </span>
                                  </div>
                                </div>
                              </v-col>
                              
                              <!-- MMR -->
                              <v-col v-if="bucket.personaRules?.mmr?.min || bucket.personaRules?.mmr?.max" cols="12" md="4">
                                <div class="rule-item">
                                  <div class="rule-label">
                                    <v-icon size="small" class="me-1" color="primary">mdi-trophy</v-icon>
                                    MMR
                                  </div>
                                  <div class="rule-value">
                                    <span v-if="bucket.personaRules?.mmr?.min && bucket.personaRules?.mmr?.max">
                                      {{ bucket.personaRules.mmr.min }} - {{ bucket.personaRules.mmr.max }}
                                    </span>
                                    <span v-else-if="bucket.personaRules?.mmr?.min">
                                      Min: {{ bucket.personaRules.mmr.min }}
                                    </span>
                                    <span v-else-if="bucket.personaRules?.mmr?.max">
                                      Max: {{ bucket.personaRules.mmr.max }}
                                    </span>
                                  </div>
                                </div>
                              </v-col>
                              
                              <!-- Spending -->
                              <v-col v-if="bucket.personaRules?.spending?.min || bucket.personaRules?.spending?.max" cols="12" md="4">
                                <div class="rule-item">
                                  <div class="rule-label">
                                    <v-icon size="small" class="me-1" color="primary">mdi-currency-usd</v-icon>
                                    Spending
                                  </div>
                                  <div class="rule-value">
                                    <span v-if="bucket.personaRules?.spending?.min && bucket.personaRules?.spending?.max">
                                      ${{ (bucket.personaRules.spending.min / 100).toFixed(2) }} - ${{ (bucket.personaRules.spending.max / 100).toFixed(2) }}
                                    </span>
                                    <span v-else-if="bucket.personaRules?.spending?.min">
                                      Min: ${{ (bucket.personaRules.spending.min / 100).toFixed(2) }}
                                    </span>
                                    <span v-else-if="bucket.personaRules?.spending?.max">
                                      Max: ${{ (bucket.personaRules.spending.max / 100).toFixed(2) }}
                                    </span>
                                  </div>
                                </div>
                              </v-col>
                            </v-row>
                            
                            <!-- Event Attachment -->
                            <div v-if="bucket.eventId || bucket.eventName" class="mt-3">
                              <div class="text-caption text-grey-darken-1 mb-1">Attached Event:</div>
                              <div class="d-flex align-center">
                                <v-icon size="small" class="me-2" color="primary">mdi-calendar-event</v-icon>
                                <span class="text-body-2">
                                  {{ bucket.eventName || `Event #${bucket.eventId}` }}
                                </span>
                              </div>
                            </div>
                          </v-card-text>
                        </v-card>
                      </div>
                      
                      <div v-else class="text-center py-6">
                        <v-icon size="48" color="primary" class="mb-2">mdi-account-group-outline</v-icon>
                        <div class="text-h6 text-grey mb-2">No Personas Configured</div>
                        <div class="text-body-2 text-grey">This week doesn't have any personas configured yet.</div>
                      </div>
                    </div>
                  </div>
                </v-window-item>
              </v-window>
            </div>
          </div>
        </div>
      </v-window-item>


    </v-window>
        </div>
      </v-card-text>
      
      <v-divider></v-divider>
      
      <v-card-actions class="pa-6">
        <v-spacer></v-spacer>
        <v-btn
          color="secondary"
          variant="outlined"
          @click="closeModal"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  
      <!-- Persona Details Modal -->
    <PersonaDetailsModal
      v-model="personaModalOpen"
      :persona="selectedPersona"
    />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { seasonsApi } from '~/api/seasons';
import { bucketsApi } from '~/api/buckets';
import { eventsApi } from '~/api/events';
import { usersApi } from '~/api/users';
import PersonaDetailsModal from './PersonaDetailsModal.vue';
import type { Season, Week } from '~/api/seasons';
import type { Bucket } from '~/api/buckets';
import type { User } from '~/types/api';

interface Props {
  modelValue: boolean;
  season: Season | null;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
}

// Extended Week interface with buckets that include all needed properties
interface WeekWithBuckets extends Week {
  buckets?: Array<{
    id: number;
    name: string;
    description?: string;
    priority: number;
    personaRules: {
      level?: { min?: number; max?: number };
      mmr?: { min?: number; max?: number };
      spending?: { min?: number; max?: number };
    };
    eventId?: number;
    eventName?: string;
  }>;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// State
const weeks = ref<WeekWithBuckets[]>([]);
const isLoadingWeeks = ref(false);
const activeWeekTab = ref<number | null>(null); // Track the active week tab
const activeTab = ref('basic'); // Track the active main tab
const userCache = ref<Map<number, string>>(new Map()); // Cache for user names

// Persona modal state
const personaModalOpen = ref(false);
const selectedPersona = ref<any>(null);

// Computed
const dialogValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const totalPersonas = computed(() => {
  return weeks.value.reduce((total, week) => {
    return total + (week.buckets?.length || 0);
  }, 0);
});

// Methods
const closeModal = () => {
  emit('update:modelValue', false);
};

const loadUserNames = async () => {
  if (!props.season) return;
  
  const userIds = [props.season.createdBy, props.season.updatedBy].filter(id => id && !userCache.value.has(id));
  
  for (const userId of userIds) {
    try {
      const response = await usersApi.getUser(userId);
      if (response.success && response.data) {
        userCache.value.set(userId, response.data.name);
      }
    } catch (error) {
      console.error('Error fetching user name:', error);
      userCache.value.set(userId, `User ID: ${userId}`);
    }
  }
};

const getUserName = (userId: number): string => {
  return userCache.value.get(userId) || `User ID: ${userId}`;
};

const openPersonaModal = (persona: any, week: WeekWithBuckets) => {
  selectedPersona.value = persona;
  personaModalOpen.value = true;
};

const loadWeeks = async () => {
  if (!props.season) return;
  
  isLoadingWeeks.value = true;
  try {
    const response = await seasonsApi.getWeeksBySeason(props.season.id);
    if (response.success && response.data) {
      // Cast to WeekWithBuckets and initialize buckets as empty arrays
      weeks.value = response.data.map(week => ({
        ...week,
        buckets: []
      }));
      // Load buckets for each week
      await loadBucketsForWeeks();
    } else {
      weeks.value = [];
    }
  } catch (error) {
    console.error('Error loading weeks:', error);
    weeks.value = [];
  } finally {
    isLoadingWeeks.value = false;
  }
};

const loadBucketsForWeeks = async () => {
  if (!weeks.value.length) return;
  
  console.log('SeasonDetailsModal: Loading buckets for', weeks.value.length, 'weeks');
  
  try {
    // Load buckets for each week
    for (const week of weeks.value) {
      console.log(`SeasonDetailsModal: Fetching buckets for week ${week.weekNumber} (ID: ${week.id})`);
      const bucketsResponse = await bucketsApi.getBucketsBySeasonAndWeek(props.season!.id, week.id);
      console.log(`SeasonDetailsModal: Buckets response for week ${week.weekNumber}:`, bucketsResponse);
      
      if (bucketsResponse.success && bucketsResponse.data) {
        // Update the week object with buckets and fetch event names
        week.buckets = await Promise.all(
          bucketsResponse.data.map(async (bucket: Bucket) => {
            let eventName = undefined;
            
            // Fetch event name if eventId exists
            if (bucket.eventId) {
              try {
                const eventResponse = await eventsApi.getEvent(bucket.eventId);
                if (eventResponse.success && eventResponse.data) {
                  eventName = eventResponse.data.name;
                }
              } catch (error) {
                console.warn(`Failed to fetch event name for eventId ${bucket.eventId}:`, error);
              }
            }
            
            return {
              id: bucket.id,
              name: bucket.name,
              description: bucket.description,
              priority: bucket.priority,
              personaRules: bucket.personaRules,
              eventId: bucket.eventId,
              eventName: eventName
            };
          })
        );
        console.log(`SeasonDetailsModal: Set ${week.buckets.length} buckets for week ${week.weekNumber}:`, week.buckets);
      } else {
        week.buckets = [];
        console.log(`SeasonDetailsModal: No buckets found for week ${week.weekNumber}`);
      }
    }
    
    console.log('SeasonDetailsModal: Final weeks with buckets:', weeks.value);
  } catch (error) {
    console.error('SeasonDetailsModal: Error loading buckets for weeks:', error);
    // Set empty buckets array for all weeks on error
    weeks.value.forEach(week => {
      week.buckets = [];
    });
  }
};

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'TBD';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return 'Invalid Date';
  }
};

const formatDateTime = (dateString: string | undefined) => {
  if (!dateString) return 'TBD';
  try {
    // Parse the date string directly - JavaScript handles UTC conversion automatically
    const date = new Date(dateString);
    
    // Use toLocaleString with 24-hour format for consistency
    return date.toString();
  } catch {
    return 'Invalid Date';
  }
};

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

// Watchers
watch(() => props.modelValue, (isOpen) => {
  if (isOpen && props.season) {
    loadWeeks();
  }
});

// Watch weeks to set default active tab
watch(weeks, (newWeeks) => {
  if (newWeeks.length > 0 && !activeWeekTab.value) {
    activeWeekTab.value = newWeeks[0].id;
  }
});

// Load weeks when season changes
watch(() => props.season, (newSeason) => {
  if (newSeason) {
    loadWeeks();
    loadUserNames();
    activeTab.value = 'basic'; // Reset to basic tab
  }
}, { immediate: true });

// Load weeks when modal opens
onMounted(() => {
  if (props.modelValue && props.season) {
    loadWeeks();
  }
});
</script>

<style scoped>
.season-details {
  min-height: 300px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 0;
}

.tab-content {
  padding: 16px 0;
}

.detail-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.87);
}

.detail-card {
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.detail-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-color: rgba(0, 0, 0, 0.12);
}

.week-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
  transition: all 0.2s ease;
}

.week-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.week-info-item {
  display: flex;
  align-items: center;
  padding: 4px 0;
}

.personas-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.summary-item {
  text-align: center;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.87);
  line-height: 1;
}

.summary-label {
  font-size: 0.9rem;
  color: rgba(0, 0, 0, 0.6);
  margin-top: 4px;
  font-weight: 500;
}

/* Custom styles for modal buttons */
:deep(.modal-button) {
  font-size: 1.2rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}



/* Week tabs styles */
.week-tabs {
  margin-bottom: 16px;
}

.week-tab {
  min-width: 120px;
}

.week-content {
  min-height: 400px;
}

.week-details {
  background-color: #fafafa;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.week-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding-bottom: 16px;
}

.week-date-range {
  margin-top: 8px;
  font-style: italic;
}

.week-info-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  height: 100%;
}

.week-info-icon {
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.04);
  border-radius: 6px;
}

.week-info-content {
  flex: 1;
}

.week-info-label {
  font-size: 0.8rem;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 2px;
  font-weight: 500;
}

.week-info-value {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.87);
}

/* Personas section styles */
.personas-section {
  margin-top: 24px;
}

.personas-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
}

.persona-card {
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.persona-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-color: rgba(0, 0, 0, 0.12);
}

.clickable-persona {
  cursor: pointer;
  transition: all 0.2s ease;
}

.clickable-persona:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: rgba(25, 118, 210, 0.3);
}

.click-indicator {
  opacity: 0.7;
  transition: all 0.2s ease;
}

.clickable-persona:hover .click-indicator {
  opacity: 1;
  transform: translateX(2px);
}

.priority-chip {
  font-weight: 500;
}

.persona-rules-grid {
  margin-top: 8px;
}

.rule-item {
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.rule-label {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: rgba(0, 0, 0, 0.7);
  margin-bottom: 4px;
  font-weight: 500;
}

.rule-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.87);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .personas-grid {
    grid-template-columns: 1fr;
  }
  
  .overview-card {
    margin-bottom: 16px;
  }
}
</style>
