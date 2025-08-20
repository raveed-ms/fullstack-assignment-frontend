<template>
  <div class="events-wrapper">
    <ClientOnly>
      <template #default>
                      <v-container fluid class="bg-grey-lighten-4 pa-0 ma-0">
          <v-row class="ma-0">
            <v-col cols="12">
              

              <!-- Search and Filters -->
              <v-card class="mb-6" elevation="1">
                <v-card-text class="pa-4">
                  <v-row class="align-center">
                    <!-- Search -->
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="searchQuery"
                        label="Search events"
                        placeholder="Search by name or description..."
                        prepend-inner-icon="mdi-magnify"
                        variant="outlined"
                        density="compact"
                        clearable
                        :loading="isSearching"
                        class="input-field"
                      ></v-text-field>
                    </v-col>
                    
                    <!-- Create Event Button - Only visible to mods and admins -->
                    <v-col cols="12" md="8" class="d-flex justify-end">
                      <v-btn
                        v-if="userStore.isModerator"
                        color="primary"
                        variant="elevated"
                        prepend-icon="mdi-plus"
                        @click="openCreateModal"
                        class="profile-button"
                        size="large"
                      >
                        Create Event
                      </v-btn>
                    </v-col>
                  </v-row>
                  
                  <!-- Filter Actions -->
                  <v-row class="mt-2">
                    <v-col cols="12" class="d-flex gap-2">
                      <v-btn
                        color="secondary"
                        variant="outlined"
                        size="small"
                        @click="clearFilters"
                        :disabled="!hasActiveFilters"
                        class="profile-button me-4"
                      >
                        Clear Filters
                      </v-btn>
                      <v-btn
                        color="primary"
                        variant="outlined"
                        size="small"
                        @click="refreshEvents"
                        :loading="isLoading"
                        class="profile-button"
                      >
                        Refresh
                      </v-btn>
                    </v-col>
                  </v-row>
                                     </v-card-text>
                   </v-card>

                   <!-- Sorting Options -->
                   <v-card class="mb-6" elevation="1">
                     <v-card-text class="pa-4">
                       <v-row>
                         <v-col cols="12" md="3">
                           <v-select
                             v-model="sortBy"
                             label="Sort By"
                             :items="sortOptions"
                             variant="outlined"
                             density="compact"
                             @update:model-value="handleSortChange"
                             class="input-field"
                           ></v-select>
                         </v-col>
                         <v-col cols="12" md="3">
                           <v-select
                             v-model="sortOrder"
                             label="Sort Order"
                             :items="sortOrderOptions"
                             variant="outlined"
                             density="compact"
                             @update:model-value="handleSortChange"
                             class="input-field"
                           ></v-select>
                         </v-col>

                       </v-row>
                     </v-card-text>
                   </v-card>

              <!-- Events Table -->
              <v-card class="events-table-card" elevation="1">
                <v-card-text class="pa-0">
                  <!-- Loading State -->
                  <div v-if="isLoading" class="text-center py-12">
                    <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
                    <div class="mt-4 text-body-1 text-grey">Loading events...</div>
                  </div>

                  <!-- Events Table -->
                  <div v-else>
                    <v-data-table
                      :key="`events-table-${currentPage}-${itemsPerPage}`"
                      :headers="tableHeaders"
                      :items="events"
                      :loading="isLoading"
                      :items-per-page="itemsPerPage"
                      class="events-table"
                      hover
                      hide-default-footer
                    >
                      <!-- ID Column -->
                      <template v-slot:item.id="{ item }">
                        <span class="font-weight-medium">{{ item.id }}</span>
                      </template>

                      <!-- Name Column -->
                      <template v-slot:item.name="{ item }">
                        <div class="font-weight-medium">{{ item.name }}</div>
                      </template>



                      <!-- Holes Count Column -->
                      <template v-slot:item.holesCount="{ item }">
                        <div class="d-flex align-center">
                          <v-icon size="small" class="me-2" color="green">mdi-golf</v-icon>
                          <span>{{ item.holes?.length || 0 }}</span>
                        </div>
                      </template>

                      <!-- Entry Fee Column -->
                      <template v-slot:item.entryFees="{ item }">
                        <span class="font-weight-medium">${{ (item.entryFees / 100).toFixed(2) }}</span>
                      </template>

                      <!-- Participants Column -->
                      <template v-slot:item.numberOfParticipants="{ item }">
                        <div class="d-flex align-center">
                          <v-icon size="small" class="me-2" color="blue">mdi-account-group</v-icon>
                          <span>{{ item.numberOfParticipants }}</span>
                        </div>
                      </template>

                      <!-- Actions Column -->
                      <template v-slot:item.actions="{ item }">
                        <div class="d-flex gap-2">
                          <v-btn
                            color="primary"
                            variant="text"
                            size="small"
                            @click="viewEvent(item)"
                          >
                            View
                          </v-btn>
                          <v-btn
                            v-if="userStore.isModerator && item.status === 'DRAFT'"
                            color="secondary"
                            variant="text"
                            size="small"
                            @click="editEvent(item)"
                          >
                            Edit
                          </v-btn>
                          <v-tooltip
                            v-if="userStore.isModerator && item.status !== 'DRAFT'"
                            text="Only DRAFT events can be edited"
                            location="top"
                          >
                            <template v-slot:activator="{ props }">
                              <v-btn
                                color="grey"
                                variant="text"
                                size="small"
                                disabled
                                v-bind="props"
                              >
                                Edit
                              </v-btn>
                            </template>
                          </v-tooltip>
                        </div>
                      </template>
                    </v-data-table>
                  </div>
                </v-card-text>
              </v-card>



                    <!-- Custom Pagination -->
                    <div class="custom-pagination pa-6">
                      <div class="d-flex justify-space-between align-center">
                        <!-- Page Size Selector -->
                        <div class="d-flex align-center page-size-section">
                          <v-select
                            v-model="itemsPerPage"
                            :items="pageSizeOptions"
                            variant="outlined"
                            density="compact"
                            class="page-size-select"
                            style="width: 140px"
                            @update:model-value="handlePageSizeChange"
                          ></v-select>
                        </div>

                        <!-- Page Info -->
                        <div class="page-info text-body-1 font-weight-medium">
                          Page <span class="text-primary font-weight-bold">{{ currentPage }}</span> of <span class="text-primary font-weight-bold">{{ totalPages }}</span>
                        </div>

                        <!-- Navigation Controls -->
                        <div class="d-flex align-center gap-3">
                          <v-btn
                            :disabled="currentPage === 1"
                            variant="outlined"
                            size="default"
                            color="primary"
                            class="pagination-btn"
                            @click="() => handlePageChange(currentPage - 1)"
                            title="Previous Page"
                          >
                            <v-icon start>mdi-chevron-left</v-icon>
                            Previous
                          </v-btn>
                          
                          <v-btn
                            :disabled="currentPage >= totalPages"
                            variant="outlined"
                            size="default"
                            color="primary"
                            class="pagination-btn"
                            @click="() => handlePageChange(currentPage + 1)"
                            title="Next Page"
                          >
                            Next
                            <v-icon end>mdi-chevron-right</v-icon>
                          </v-btn>
                        </div>
                      </div>
                    </div>
            </v-col>
          </v-row>
        </v-container>
      </template>
      
      <template #fallback>
        <div class="events-fallback">
          <p>Loading events...</p>
        </div>
      </template>
    </ClientOnly>
  </div>

  <!-- Event Details Modal -->
  <EventDetailsModal
    v-model="eventDetailsModalOpen"
    :event="selectedEvent"
  />

  <!-- Event Edit Modal -->
  <EventEditModal
    v-model="eventEditModalOpen"
    :event="eventToEdit"
    @event-updated="handleEventUpdated"
  />

  <!-- Create Event Modal -->
  <CreateEventModal
    v-model="createEventModalOpen"
    @event-created="handleEventCreated"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { eventsApi } from '~/api/events';
import { useEventsErrorHandler } from '~/composables/errors/useEventsErrorHandler';
import { useNotifications } from '~/composables/ui/useNotifications';
import { useUserStore } from '~/stores/user';
import { EventStatus } from '~/api/events';
import type { Event, EventQuery } from '~/api/events';
import EventDetailsModal from '~/components/events/EventDetailsModal.vue';
import EventEditModal from '~/components/events/EventEditModal.vue';
import CreateEventModal from '~/components/events/CreateEventModal.vue';

// Define page meta for auth layout and middleware
// @ts-ignore - definePageMeta is a Nuxt 3 global function
definePageMeta({
  middleware: ['auth'],
  requiresAuth: true,
  layout: 'authenticated'
});

const router = useRouter();
const { handleEventsFetchError, clearError } = useEventsErrorHandler();
const { showError, showSuccess } = useNotifications();
const userStore = useUserStore();

// Events state
const events = ref<Event[]>([]);
const isLoading = ref(false);
const totalEvents = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(12);

// Query parameters
const queryParams = ref<EventQuery>({
  limit: itemsPerPage.value,
  skip: 0
});

// Search and filter state
const searchQuery = ref('');
const debouncedSearchQuery = ref('');
const isSearching = ref(false);


// Sorting state
const sortBy = ref<'id' | 'name' | 'status' | 'start_date' | 'end_date' | 'number_of_participants' | 'entry_fees' | 'created_at' | 'updated_at'>('id');
const sortOrder = ref<'asc' | 'desc'>('asc');



// Event details modal state
const eventDetailsModalOpen = ref(false);
const selectedEvent = ref<Event | null>(null);

// Event edit modal state
const eventEditModalOpen = ref(false);
const eventToEdit = ref<Event | null>(null);

// Create event modal state
const createEventModalOpen = ref(false);



// Sort options - using actual database column names
const sortOptions = [
  { title: 'ID', value: 'id' },
  { title: 'Name', value: 'name' },
  { title: 'Date', value: 'start_date' },
  { title: 'Entry Fee', value: 'entry_fees' },
  { title: 'Participants', value: 'number_of_participants' }
];

const sortOrderOptions = [
  { title: 'Ascending', value: 'asc' },
  { title: 'Descending', value: 'desc' }
];

// Page size options for pagination
const pageSizeOptions = [
  { title: '12 per page', value: 12 },
  { title: '20 per page', value: 20 },
  { title: '50 per page', value: 50 },
  { title: '100 per page', value: 100 }
];

// Computed properties
const totalPages = computed(() => Math.ceil(totalEvents.value / itemsPerPage.value));




// Table headers for data table
const tableHeaders = [
  { title: 'ID', key: 'id', sortable: true, width: '100px' },
  { title: 'Name', key: 'name', sortable: true, width: '250px' },
  { title: 'Holes', key: 'holesCount', sortable: false, width: '100px' },
  { title: 'Entry Fee', key: 'entryFees', sortable: true, width: '120px' },
  { title: 'Participants', key: 'numberOfParticipants', sortable: true, width: '120px' },
  { title: 'Actions', key: 'actions', sortable: false, width: '150px' }
];

// Computed properties
const hasActiveFilters = computed(() => {
  return debouncedSearchQuery.value;
});



// Load events from API
const loadEvents = async () => {
  isLoading.value = true;
  clearError();
  
  try {
    const response = await eventsApi.getEvents(queryParams.value);
    
    if (response.success && response.data) {
      // Ensure we have valid data
      events.value = response.data || [];
      // Use the length of the data array as the count
      totalEvents.value = response.data.length || 0;
    } else {
      
      const errorMessage = handleEventsFetchError(response.error);
      showError('Failed to Load Events', errorMessage || 'An unexpected error occurred');
      // Set default values on error
      events.value = [];
      totalEvents.value = 0;
    }
  } catch (error: any) {
    console.error('Error loading events:', error);
    
    showError('Failed to Load Events', error.message || 'An unexpected error occurred');
    // Set default values on error
    events.value = [];
    totalEvents.value = 0;
  } finally {
    isLoading.value = false;
    isSearching.value = false;
  }
};

// Load events on mount
onMounted(() => {
  loadEvents();
});

// Debounced search watcher
let searchTimeout: NodeJS.Timeout;
watch(searchQuery, (newValue) => {
  clearTimeout(searchTimeout);
  isSearching.value = true;
  searchTimeout = setTimeout(() => {
    debouncedSearchQuery.value = newValue;
    handleSearch();
  }, 500); // 500ms debounce delay
});



// Search and filter functions
const handleSearch = () => {
  currentPage.value = 1;
  updateQueryParams();
  loadEvents();
};

const handleFilterChange = () => {
  currentPage.value = 1;
  // Add a small delay to ensure date values are properly set
  setTimeout(() => {
    updateQueryParams();
    loadEvents();
  }, 100);
};

const handleSortChange = () => {
  currentPage.value = 1;
  updateQueryParams();
  loadEvents();
};

const clearFilters = () => {
  searchQuery.value = '';
  debouncedSearchQuery.value = '';
  isSearching.value = false;
  currentPage.value = 1;
  updateQueryParams();
  loadEvents();
};

const refreshEvents = () => {
  loadEvents();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  updateQueryParams();
  loadEvents();
};

const handlePageSizeChange = (newSize: number) => {
  itemsPerPage.value = newSize;
  currentPage.value = 1; // Reset to first page when changing page size
  updateQueryParams();
  loadEvents();
};

const updateQueryParams = () => {
  queryParams.value = {
    limit: itemsPerPage.value,
    skip: (currentPage.value - 1) * itemsPerPage.value
  };



  // Add search parameters
  if (debouncedSearchQuery.value) {
    queryParams.value.searchName = debouncedSearchQuery.value;
  }



  // Add sorting parameters - backend expects { field, order } format
  if (sortBy.value) {
    queryParams.value.sort = {
      field: sortBy.value,
      order: sortOrder.value
    };
  }
};



// Event actions
const openCreateEventModal = () => {
  router.push('/events/create');
};

const viewEvent = (event: Event) => {
  selectedEvent.value = event;
  eventDetailsModalOpen.value = true;
};

const editEvent = (event: Event) => {
  eventToEdit.value = event;
  eventEditModalOpen.value = true;
};

const handleEventUpdated = (updatedEvent: Event) => {
  // Update the event in the local list
  const index = events.value.findIndex(e => e.id === updatedEvent.id);
  if (index !== -1) {
    events.value[index] = updatedEvent;
  }
  
  // Close the edit modal
  eventEditModalOpen.value = false;
  eventToEdit.value = null;
  
  // Show success message
  showSuccess('Event updated successfully!');
};

const openCreateModal = () => {
  createEventModalOpen.value = true;
};

const handleEventCreated = (newEvent: Event) => {
  // Add the new event to the local list
  events.value.unshift(newEvent);
  
  // Update the total count
  totalEvents.value = events.value.length;
  
  // Close the create modal
  createEventModalOpen.value = false;
  
  // Show success message
  showSuccess('Event created successfully!');
};


</script>

<style scoped>
.events-wrapper {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.events-table {
  border-radius: 8px;
}

.create-event-btn {
  font-size: 1.1rem;
  font-weight: 500;
}

.events-fallback {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  text-align: center;
  font-size: 1.2rem;
  color: #4a6fa5;
}

/* Custom styles for input fields - same as profile page */
:deep(.input-field) {
  font-size: 2rem;
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

/* Custom styles for buttons - same as profile page */
:deep(.profile-button) {
  font-size: 1.2rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* Events table card styling */
.events-table-card {
  background: white;
}

/* Custom pagination styling */
.custom-pagination {
  background: rgba(0, 0, 0, 0.02);
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  margin-top: 16px;
}

.page-size-section {
  min-width: 140px;
  display: flex;
  align-items: center;
}

.page-size-select {
  min-width: 140px;
}

/* Hide the messages area below the select to fix alignment */
:deep(.page-size-select .v-input__details) {
  display: none;
}

.page-info {
  min-width: 200px;
  text-align: center;
}

.pagination-btn {
  min-width: 120px;
  font-weight: 500;
  letter-spacing: 0.5px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}

/* Events table styling */
:deep(.events-table) {
  font-size: 1.1rem;
}

/* Column width control */
:deep(.events-table .v-data-table__td) {
  font-size: 1.1rem;
  padding: 16px 8px;
  white-space: nowrap;
}

:deep(.events-table .v-data-table__th) {
  font-size: 1.2rem;
  font-weight: 600;
  padding: 16px 8px;
  white-space: nowrap;
}

/* Specific column widths */
:deep(.events-table .v-data-table__td:nth-child(1)) { /* ID */
  width: 100px;
  min-width: 100px;
  max-width: 100px;
  padding-left: 20px !important;
}

:deep(.events-table .v-data-table__td:nth-child(2)) { /* Name */
  width: 250px;
  min-width: 250px;
  max-width: 250px;
}

:deep(.events-table .v-data-table__td:nth-child(3)) { /* Holes */
  width: 100px;
  min-width: 100px;
  max-width: 100px;
}

:deep(.events-table .v-data-table__td:nth-child(4)) { /* Entry Fee */
  width: 120px;
  min-width: 120px;
  max-width: 120px;
}

:deep(.events-table .v-data-table__td:nth-child(5)) { /* Participants */
  width: 120px;
  min-width: 120px;
  max-width: 120px;
}

:deep(.events-table .v-data-table__td:nth-child(6)) { /* Actions */
  width: 150px;
  min-width: 150px;
  max-width: 150px;
}





:deep(.events-table .v-icon) {
  font-size: 20px !important;
}

:deep(.events-table .v-btn) {
  font-size: 1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .d-flex.justify-space-between {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
</style>
