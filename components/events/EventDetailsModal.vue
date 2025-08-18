<template>
  <v-dialog v-model="dialogValue" max-width="800px" persistent>
    <v-card class="event-details-modal">
      <!-- Clean Header -->
      <v-card-title class="d-flex align-center pa-6 pb-4">
        <v-icon start color="primary" size="large" class="mr-3">mdi-calendar</v-icon>
        <span class="text-h5 font-weight-medium">{{ event?.name || 'Event Details' }}</span>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6 pt-0">
        <div v-if="event" class="event-details">
          <!-- Tabs -->
          <v-tabs v-model="activeTab" color="primary" class="mb-6">
            <v-tab value="basic">
              <v-icon start>mdi-information</v-icon>
              Basic Info
            </v-tab>
            <v-tab value="course">
              <v-icon start>mdi-golf-course</v-icon>
              Course Layout
            </v-tab>
          </v-tabs>

          <!-- Tab Content -->
          <v-window v-model="activeTab">
            <!-- Basic Info Tab -->
            <v-window-item value="basic">
              <v-row>
                <v-col cols="12" md="6">
                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">Event ID</div>
                    <div class="detail-value font-mono">{{ event.id }}</div>
                  </div>

                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">Status</div>
                    <div class="detail-value">{{ event.status }}</div>
                  </div>

                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">Entry Fee</div>
                    <div class="detail-value">${{ (event.entryFees || 0) / 100 }}</div>
                  </div>

                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">Participants</div>
                    <div class="detail-value">{{ event.numberOfParticipants }} players</div>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">Holes</div>
                    <div class="detail-value">{{ event.holes?.length || 0 }} holes</div>
                  </div>

                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">Created</div>
                    <div class="detail-value">{{ formatDate(event.createdAt) }}</div>
                  </div>

                  <div class="detail-item mb-4">
                    <div class="detail-label mb-2">Last Updated</div>
                    <div class="detail-value">{{ formatDate(event.updatedAt) }}</div>
                  </div>
                </v-col>
              </v-row>

              <!-- Description -->
              <div v-if="event.description" class="mt-6">
                <div class="detail-item">
                  <div class="detail-label mb-2">Description</div>
                  <div class="detail-value">{{ event.description }}</div>
                </div>
              </div>
            </v-window-item>

            <!-- Course Layout Tab -->
            <v-window-item value="course">
              <div v-if="event.holes && event.holes.length > 0">
                <!-- Individual Hole Details -->
                <v-row>
                  <v-col v-for="hole in event.holes" :key="hole.holeNumber" cols="12" md="6" lg="4">
                    <v-card variant="outlined" class="hole-card" elevation="0">
                      <v-card-title class="text-subtitle-2 pa-3 pb-2">
                        Hole {{ hole.holeNumber }}
                      </v-card-title>
                      
                      <v-card-text class="pa-3 pt-0">
                        <div class="hole-details">
                          <div class="hole-detail-item mb-2">
                            <v-icon size="small" class="me-2" color="green-darken-1">mdi-map-marker</v-icon>
                            <span class="text-body-2">Course {{ hole.courseId }}</span>
                          </div>
                          <div class="hole-detail-item mb-2">
                            <v-icon size="small" class="me-2" color="blue-darken-1">mdi-weather-windy</v-icon>
                            <span class="text-body-2">{{ hole.windSpeed }} km/h</span>
                          </div>
                          <div class="hole-detail-item mb-2">
                            <v-icon size="small" class="me-2" color="orange-darken-1">mdi-target</v-icon>
                            <span class="text-body-2">{{ hole.needleSpeed }} m/s</span>
                          </div>
                          <div class="hole-detail-item mb-2">
                            <v-icon size="small" class="me-2" color="purple-darken-1">mdi-flag</v-icon>
                            <span class="text-body-2">{{ hole.teePosition }}</span>
                          </div>
                          <div class="hole-detail-item">
                            <v-icon size="small" class="me-2" color="amber-darken-1">mdi-weather-partly-cloudy</v-icon>
                            <span class="text-body-2">{{ hole.weather }}</span>
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
              <div v-else class="text-center py-8">
                <v-icon size="large" color="grey-lighten-1">mdi-golf-course</v-icon>
                <div class="text-body-1 text-grey mt-2">No course layout available</div>
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
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '~/stores/user';
import type { Event } from '~/api/events';

interface Props {
  modelValue: boolean;
  event: Event | null;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const userStore = useUserStore();
const activeTab = ref('basic');

const dialogValue = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
});

const closeModal = () => {
  emit('update:modelValue', false);
};



const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'TBD';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'America/Los_Angeles'
    });
  } catch (error) {
    return 'Invalid Date';
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


</script>

<style scoped>
.event-details-modal {
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

.modal-header {
  background: #fafafa;
  border-bottom: 1px solid #e0e0e0;
}

.header-content {
  flex: 1;
}

.event-title {
  color: #1976d2;
  font-weight: 600;
  margin: 0;
}

.event-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-chip {
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.event-id {
  font-weight: 500;
}

.detail-item {
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.detail-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #616161;
  display: flex;
  align-items: center;
}

.detail-value {
  font-size: 1rem;
  font-weight: 600;
  color: #212121;
  margin: 0;
}

/* Event details styling */
.event-details {
  padding: 0;
}

.detail-item {
  margin-bottom: 1.5rem;
}

.detail-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6c757d;
  margin-bottom: 0.5rem;
}

.detail-value {
  font-size: 1rem;
  color: #212529;
}





.price {
  color: #2e7d32;
  font-size: 1.125rem;
}

.hole-card {
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  transition: all 0.2s ease;
}

.hole-card:hover {
  border-color: #1976d2;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
}

.hole-details {
  display: flex;
  flex-direction: column;
}

.hole-detail-item {
  display: flex;
  align-items: center;
}

.border-top {
  border-top: 1px solid #e0e0e0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hole-card {
    margin-bottom: 16px;
  }
}
</style>
