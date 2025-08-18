<template>
  <div class="seasons-wrapper">
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
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="searchQuery"
                        label="Search seasons"
                        placeholder="Search by title..."
                        prepend-inner-icon="mdi-magnify"
                        variant="outlined"
                        density="compact"
                        clearable
                        :loading="isSearching"
                        class="input-field"
                      ></v-text-field>
                    </v-col>
                    
                    <!-- Create Season Button - Only visible to admins -->
                    <v-col cols="12" md="6" class="d-flex justify-end">
                      <v-btn
                        v-if="userStore.isAdmin"
                        color="primary"
                        variant="elevated"
                        prepend-icon="mdi-plus"
                        @click="openCreateModal"
                        class="profile-button"
                        size="large"
                      >
                        Create Season
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
                        @click="refreshSeasons"
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

              <!-- Seasons Table -->
              <v-card class="seasons-table-card" elevation="1">
                <v-card-text class="pa-0">
                  <!-- Loading State -->
                  <div v-if="isLoading" class="text-center py-12">
                    <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
                    <div class="mt-4 text-body-1 text-grey">Loading seasons...</div>
                  </div>
                  <!-- Seasons Table -->
                  <div v-else>
                    <v-data-table
                      :key="`seasons-table-${currentPage}-${itemsPerPage}`"
                      :headers="tableHeaders"
                      :items="seasons"
                      :loading="isLoading"
                      class="seasons-table"
                      hover
                      hide-default-footer
                    >
                      <!-- ID Column -->
                      <template v-slot:item.id="{ item }">
                        <span class="font-weight-medium">{{ item.id }}</span>
                      </template>

                      <!-- Title Column -->
                      <template v-slot:item.title="{ item }">
                        <div class="font-weight-medium">{{ item.title }}</div>
                      </template>

                      <!-- Start Date Column -->
                      <template v-slot:item.startDate="{ item }">
                        <div class="d-flex align-center">
                          <v-icon size="small" class="me-2" color="green">mdi-calendar-start</v-icon>
                          <span>{{ formatDate(item.startDate) }}</span>
                        </div>
                      </template>

                      <!-- End Date Column -->
                      <template v-slot:item.endDate="{ item }">
                        <div class="d-flex align-center">
                          <v-icon size="small" class="me-2" color="red">mdi-calendar-end</v-icon>
                          <span>{{ formatDate(item.endDate) }}</span>
                        </div>
                      </template>

                      <!-- Reward Column -->
                      <template v-slot:item.reward="{ item }">
                        <span class="font-weight-medium">${{ (item.reward.cash / 100).toFixed(2) }}</span>
                      </template>

                      <!-- Actions Column -->
                      <template v-slot:item.actions="{ item }">
                        <div class="d-flex gap-2">
                          <v-btn
                            color="primary"
                            variant="text"
                            size="small"
                            @click="viewSeason(item)"
                          >
                            View
                          </v-btn>
                          <v-btn
                            v-if="userStore.isAdmin && item.status === 'DRAFT'"
                            color="secondary"
                            variant="text"
                            size="small"
                            @click="editSeason(item)"
                          >
                            Edit
                          </v-btn>
                          <v-tooltip
                            v-if="userStore.isAdmin && item.status !== 'DRAFT'"
                            text="Only DRAFT seasons can be modified"
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
                          
                          <!-- Publish Button - Only visible to admins for DRAFT seasons -->
                          <v-btn
                            v-if="userStore.isAdmin && item.status === 'DRAFT'"
                            color="success"
                            variant="text"
                            size="small"
                            @click="publishSeason(item)"
                            :loading="publishingSeasons.has(item.id)"
                            prepend-icon="mdi-publish"
                          >
                            Publish
                          </v-btn>
                        </div>
                      </template>
                    </v-data-table>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Pagination -->
              <div v-if="totalSeasons > 0" class="mt-6">
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
              </div>
            </v-col>
          </v-row>
        </v-container>
      </template>
      
      <template #fallback>
        <div class="seasons-fallback">
          <p>Loading seasons...</p>
        </div>
      </template>
    </ClientOnly>
  </div>

  <!-- Season Details Modal -->
  <SeasonDetailsModal
    v-model="seasonDetailsModalOpen"
    :season="selectedSeason"
  />

  <!-- Season Edit Modal -->
  <SeasonEditModal
    v-model="seasonEditModalOpen"
    :season="seasonToEdit"
    @season-updated="handleSeasonUpdated"
    @open-weeks-modal="showWeeksModal"
  />

  <!-- Create Season Modal -->
  <CreateSeasonModal
    v-model="createSeasonModalOpen"
    @season-created="handleSeasonCreated"
    @show-weeks-modal="showWeeksModal"
  />

  <!-- Season Weeks Modal -->
  <SeasonWeeksModal
    v-model="seasonWeeksModalOpen"
    :season="selectedSeasonForWeeks"
    :weeks="selectedSeasonWeeks"
    :mode="weeksModalMode"
    :title="weeksModalMode === 'edit' ? `Edit Season Weeks: ${selectedSeasonForWeeks?.title || ''}` : `Season Weeks: ${selectedSeasonForWeeks?.title || ''}`"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { seasonsApi } from '~/api/seasons';
import { useSeasonsErrorHandler } from '~/composables/errors/useSeasonsErrorHandler';
import { useNotifications } from '~/composables/ui/useNotifications';
import { useUserStore } from '~/stores/user';
import type { Season, SeasonQuery } from '~/api/seasons';
import SeasonDetailsModal from '~/components/seasons/SeasonDetailsModal.vue';
import SeasonEditModal from '~/components/seasons/SeasonEditModal.vue';
import CreateSeasonModal from '~/components/seasons/CreateSeasonModal.vue';
import SeasonWeeksModal from '~/components/seasons/SeasonWeeksModal.vue';

// Define page meta for auth layout and middleware
// @ts-ignore - definePageMeta is a Nuxt 3 global function
definePageMeta({
  middleware: ['auth'],
  requiresAuth: true,
  layout: 'authenticated'
});

const router = useRouter();
const { handleSeasonsFetchError, clearError } = useSeasonsErrorHandler();
const { showError, showSuccess } = useNotifications();
const userStore = useUserStore();

// Seasons state
const seasons = ref<Season[]>([]);
const isLoading = ref(false);
const totalSeasons = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(12);

// Query parameters
const queryParams = ref<SeasonQuery>({
  limit: itemsPerPage.value,
  skip: 0
});

// Search and filter state
const searchQuery = ref('');
const debouncedSearchQuery = ref('');

const isSearching = ref(false);

// Sorting state
const sortBy = ref('id');
const sortOrder = ref<'asc' | 'desc'>('asc');

// Modal state
const seasonDetailsModalOpen = ref(false);
const seasonEditModalOpen = ref(false);
const createSeasonModalOpen = ref(false);
const seasonWeeksModalOpen = ref(false);
const selectedSeason = ref<Season | null>(null);
const seasonToEdit = ref<Season | null>(null);
const selectedSeasonForWeeks = ref<Season | null>(null);
const selectedSeasonWeeks = ref<any[]>([]);
const weeksModalMode = ref<'create' | 'edit'>('create');

// Publishing state
const publishingSeasons = ref<Set<number>>(new Set());

// Page size options for pagination
const pageSizeOptions = [
  { title: '12 per page', value: 12 },
  { title: '20 per page', value: 20 },
  { title: '50 per page', value: 50 },
  { title: '100 per page', value: 100 }
];



// Sort options - using actual database column names
const sortOptions = [
  { title: 'ID', value: 'id' },
  { title: 'Title', value: 'title' },
  { title: 'Start Date', value: 'start_date' },
  { title: 'End Date', value: 'end_date' }
];

const sortOrderOptions = [
  { title: 'Ascending', value: 'asc' },
  { title: 'Descending', value: 'desc' }
];

// Table headers for data table
const tableHeaders = [
  { title: 'ID', key: 'id', sortable: true, width: '100px' },
  { title: 'Title', key: 'title', sortable: true, width: '300px' },
  { title: 'Start Date', key: 'startDate', sortable: true, width: '150px' },
  { title: 'End Date', key: 'endDate', sortable: true, width: '150px' },
  { title: 'Reward', key: 'reward', sortable: false, width: '120px' },
  { title: 'Actions', key: 'actions', sortable: false, width: '200px' }
];

// Computed properties
const hasActiveFilters = computed(() => {
  return debouncedSearchQuery.value;
});

const totalPages = computed(() => Math.ceil(totalSeasons.value / itemsPerPage.value));

// Load seasons from API
const loadSeasons = async () => {
  isLoading.value = true;
  clearError();
  
  try {
    // Get both seasons data and total count
    const [seasonsResponse, countResponse] = await Promise.all([
      seasonsApi.getSeasons(queryParams.value),
      seasonsApi.getSeasonsCount(queryParams.value)
    ]);
    
    if (seasonsResponse.success && seasonsResponse.data && countResponse.success && countResponse.data !== undefined) {
      // Set seasons data
      seasons.value = seasonsResponse.data || [];
      // Set total count from count endpoint
      totalSeasons.value = countResponse.data || 0;
      

    } else {
      const errorMessage = handleSeasonsFetchError(seasonsResponse.error || countResponse.error);
      showError('Failed to Load Seasons', errorMessage || 'An unexpected error occurred');
      // Set default values on error
      seasons.value = [];
      totalSeasons.value = 0;
    }
  } catch (error: any) {
    console.error('Error loading seasons:', error);
    
    showError('Failed to Load Seasons', error.message || 'An unexpected error occurred');
    // Set default values on error
    seasons.value = [];
    totalSeasons.value = 0;
  } finally {
    isLoading.value = false;
    isSearching.value = false;
  }
};

// Load seasons on mount
onMounted(() => {
  loadSeasons();
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
  loadSeasons();
};



const handleSortChange = () => {
  currentPage.value = 1;
  updateQueryParams();
  loadSeasons();
};

const clearFilters = () => {
  searchQuery.value = '';
  debouncedSearchQuery.value = '';
  isSearching.value = false;
  currentPage.value = 1;
  updateQueryParams();
  loadSeasons();
};

const refreshSeasons = () => {
  loadSeasons();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  updateQueryParams();
  loadSeasons();
};

const handlePageSizeChange = (newSize: number) => {
  itemsPerPage.value = newSize;
  currentPage.value = 1;
  updateQueryParams();
  loadSeasons();
};

const updateQueryParams = () => {
  queryParams.value = {
    limit: itemsPerPage.value,
    skip: (currentPage.value - 1) * itemsPerPage.value,
    search: debouncedSearchQuery.value || undefined,
    sort: {
      field: sortBy.value as any,
      order: sortOrder.value
    }
  };
};

// Season actions
const viewSeason = (season: Season) => {
  selectedSeason.value = season;
  seasonDetailsModalOpen.value = true;
};

const editSeason = (season: Season) => {
  seasonToEdit.value = season;
  seasonEditModalOpen.value = true;
};

const publishSeason = async (season: Season) => {
  if (!userStore.isAdmin) {
    showError('Access Denied', 'Only administrators can publish seasons');
    return;
  }
  
  if (season.status !== 'DRAFT') {
    showError('Invalid Action', 'Only DRAFT seasons can be published');
    return;
  }
  
  try {
    // Set loading state for this specific season
    publishingSeasons.value.add(season.id);
    
    // First validate the season for publishing
    const validationResponse = await seasonsApi.validateSeasonPublish(season.id);
    if (!validationResponse.success || !validationResponse.data) {
      showError('Validation Failed', 'Could not validate season for publishing');
      return;
    }
    
    const validation = validationResponse.data;
    if (!validation.isValid) {
      const errorMessage = validation.errors.join('\n');
      showError('Cannot Publish Season', errorMessage);
      return;
    }
    
    // Show warnings if any
    if (validation.warnings.length > 0) {
      console.warn('Publishing warnings:', validation.warnings);
    }
    
    // Publish the season
    const publishResponse = await seasonsApi.publishSeason(season.id);
    if (publishResponse.success && publishResponse.data) {
      // Update the season in the local list
      const index = seasons.value.findIndex(s => s.id === season.id);
      if (index !== -1) {
        seasons.value[index] = publishResponse.data;
      }
      
      showSuccess('Season published successfully!');
    } else {
      showError('Failed to publish season', publishResponse.error?.message || 'Unknown error');
    }
  } catch (error: any) {
    console.error('Error publishing season:', error);
    showError('Failed to publish season', error.message || 'An unexpected error occurred');
  } finally {
    // Clear loading state
    publishingSeasons.value.delete(season.id);
  }
};



const openCreateModal = () => {
  createSeasonModalOpen.value = true;
};

const showWeeksModal = async (season: Season, mode: 'create' | 'edit' = 'create') => {
  selectedSeasonForWeeks.value = season;
  weeksModalMode.value = mode;
  
  try {
    // Fetch weeks for this season FIRST
    const response = await seasonsApi.getWeeksBySeason(season.id);
    if (response.success && response.data) {
      selectedSeasonWeeks.value = response.data;
      console.log('showWeeksModal: Weeks loaded successfully:', response.data);
      
      // Only open the modal AFTER weeks are loaded
      seasonWeeksModalOpen.value = true;
    } else {
      showError('Failed to fetch weeks', 'No weeks data received');
    }
  } catch (error: any) {
    console.error('showWeeksModal: Error fetching weeks:', error);
    showError('Failed to fetch weeks', error.message || 'An unexpected error occurred');
  }
};

const closeWeeksModal = () => {
  seasonWeeksModalOpen.value = false;
  selectedSeasonForWeeks.value = null;
  selectedSeasonWeeks.value = [];
};



const handleSeasonCreated = (newSeason: Season) => {
  // Add the new season to the local list
  seasons.value.unshift(newSeason);
  
  // Update the total count
  totalSeasons.value = seasons.value.length;
  
  // Close the create modal
  createSeasonModalOpen.value = false;
  
  // Show success message
  showSuccess('Season created successfully!');
};

const handleSeasonUpdated = (updatedSeason: Season) => {
  // Update the season in the local list
  const index = seasons.value.findIndex(s => s.id === updatedSeason.id);
  if (index !== -1) {
    seasons.value[index] = updatedSeason;
  }
  
  // Close the edit modal
  seasonEditModalOpen.value = false;
  seasonToEdit.value = null;
  
  // Show success message
  showSuccess('Season updated successfully!');
};

// Utility functions
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


</script>

<style scoped>
.seasons-wrapper {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.seasons-table {
  border-radius: 8px;
}

.create-season-btn {
  font-size: 1.1rem;
  font-weight: 500;
}

.seasons-fallback {
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



/* Seasons table styling */
:deep(.seasons-table) {
  font-size: 1.1rem;
}

/* Column width control */
:deep(.seasons-table .v-data-table__td) {
  font-size: 1.1rem;
  padding: 16px 8px;
  white-space: nowrap;
}

:deep(.seasons-table .v-data-table__th) {
  font-size: 1.2rem;
  font-weight: 600;
  padding: 16px 8px;
  white-space: nowrap;
}

/* Table column spacing */
:deep(.seasons-table .v-data-table__td:nth-child(1)) { /* ID */
  width: 100px;
  min-width: 100px;
  max-width: 100px;
  padding-left: 20px !important;
}

:deep(.seasons-table .v-data-table__td:nth-child(2)) { /* Title */
  width: 300px;
  min-width: 300px;
  max-width: 300px;
}

:deep(.seasons-table .v-data-table__td:nth-child(3)) { /* Start Date */
  width: 150px;
  min-width: 150px;
  max-width: 150px;
}

:deep(.seasons-table .v-data-table__td:nth-child(4)) { /* End Date */
  width: 150px;
  min-width: 150px;
  max-width: 150px;
}

:deep(.seasons-table .v-data-table__td:nth-child(5)) { /* Reward */
  width: 120px;
  min-width: 120px;
  max-width: 120px;
}

:deep(.seasons-table .v-data-table__td:nth-child(6)) { /* Actions */
  width: 200px;
  min-width: 200px;
  max-width: 200px;
}

:deep(.seasons-table .v-icon) {
  font-size: 20px !important;
}

:deep(.seasons-table .v-btn) {
  font-size: 1rem;
}

/* Seasons table card styling */
.seasons-table-card {
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
</style>
