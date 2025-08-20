<template>
  <div class="changelogs-wrapper">
    <ClientOnly>
      <template #default>
        <v-container fluid class="bg-grey-lighten-4 pa-0 ma-0">
          <v-row class="ma-0">
            <v-col cols="12">
              
              <!-- Date Range and Sorting Options -->
              <v-card class="mb-6" elevation="1">
                <v-card-text class="pa-4">
                  <v-row>
                    <!-- Date Range Filters -->
                    <v-col cols="12" md="6">
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-menu
                            v-model="showDateFromPicker"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ props }">
                              <v-text-field
                                v-model="filters.from_date"
                                label="From Date"
                                readonly
                                v-bind="props"
                                prepend-inner-icon="mdi-calendar"
                                density="compact"
                                variant="outlined"
                                class="input-field"
                                clearable
                              />
                            </template>
                            <v-date-picker
                              v-model="filters.from_date"
                              @update:model-value="showDateFromPicker = false"
                            />
                          </v-menu>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-menu
                            v-model="showDateToPicker"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ props }">
                              <v-text-field
                                v-model="filters.to_date"
                                label="To Date"
                                readonly
                                v-bind="props"
                                prepend-inner-icon="mdi-calendar"
                                density="compact"
                                variant="outlined"
                                class="input-field"
                                clearable
                              />
                            </template>
                            <v-date-picker
                              v-model="filters.to_date"
                              @update:model-value="showDateToPicker = false"
                            />
                          </v-menu>
                        </v-col>
                      </v-row>
                    </v-col>

                    <!-- Entity Type and Sorting Options -->
                    <v-col cols="12" md="6">
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="filters.entityType"
                            :items="entityTypeOptions"
                            label="Entity Type"
                            variant="outlined"
                            density="compact"
                            class="input-field"
                            clearable
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="sortOrder"
                            label="Sort Order"
                            :items="sortOrderOptions"
                            variant="outlined"
                            density="compact"
                            class="input-field"
                            @update:model-value="handleSortChange"
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>

                  <!-- Filter Actions -->
                  <v-row class="mt-4">
                    <v-col cols="12" class="d-flex justify-end align-center">
                      <div class="d-flex gap-2">
                        <v-btn
                          color="secondary"
                          variant="outlined"
                          size="small"
                          @click="clearFilters"
                          :disabled="!hasActiveFilters"
                          class="profile-button"
                        >
                          <v-icon start>mdi-filter-off</v-icon>
                          Clear Filters
                        </v-btn>
                        <v-btn
                          color="primary"
                          variant="outlined"
                          size="small"
                          @click="applyFilters"
                          :disabled="!hasActiveFilters"
                          class="profile-button"
                        >
                          <v-icon start>mdi-filter-check</v-icon>
                          Apply Filters
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <!-- Changelogs Table -->
              <v-card class="changelogs-table-card" elevation="1">
                <v-card-text class="pa-0">
                  <!-- Loading State -->
                  <div v-if="isLoading" class="text-center py-12">
                    <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
                    <div class="mt-4 text-body-1 text-grey">Loading changelogs...</div>
                  </div>

                  <!-- Changelogs Table -->
                  <div v-else>
                    <v-data-table
                      :key="`changelogs-table-${currentPage}-${itemsPerPage}`"
                      :headers="tableHeaders"
                      :items="processedChangelogs"
                      :loading="isLoading"
                      :items-per-page="itemsPerPage"
                      class="changelogs-table"
                      hover
                      hide-default-footer
                    >
                      <!-- Entity ID Column -->
                      <template v-slot:item.entityId="{ item }">
                        <span class="font-mono text-caption pl-4">{{ item.entityId }}</span>
                      </template>

                      <!-- Entity Type Column -->
                      <template v-slot:item.entityType="{ item }">
                        <span class="text-body-2 font-weight-medium">{{ item.entityType }}</span>
                      </template>

                      <!-- Change Reason Column -->
                      <template v-slot:item.changeReason="{ item }">
                        <span class="text-caption">{{ item.changeReason }}</span>
                      </template>

                      <!-- Modified By Column -->
                      <template v-slot:item.modifiedBy="{ item }">
                        <span class="text-caption">{{ item.modifierName }}</span>
                      </template>

                      <!-- Modified At Column -->
                      <template v-slot:item.modifiedAt="{ item }">
                        <span class="text-caption">{{ formatDate(item.modifiedAt) }}</span>
                      </template>

                      <!-- Actions Column -->
                      <template v-slot:item.actions="{ item }">
                        <div class="d-flex gap-2">
                          <v-btn
                            color="primary"
                            variant="text"
                            size="small"
                            @click="viewChanges(item)"
                          >
                            View Details
                          </v-btn>
                        </div>
                      </template>
                    </v-data-table>

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
                </v-card-text>
              </v-card>

            </v-col>
          </v-row>
        </v-container>
      </template>
    </ClientOnly>
  </div>

  <!-- Changelog Details Modal -->
  <ChangelogDetailsModal
    v-model="viewDetailsModalOpen"
    :changelog="selectedChangelog"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { changelogsApi } from '~/api/changelogs';
import { usersApi } from '~/api/users';
import { useChangelogsErrorHandler } from '~/composables/errors/useChangelogsErrorHandler';
import { useNotifications } from '~/composables/ui/useNotifications';
import type { Changelog, ChangelogQuery, EntityType } from '~/types/api';
import ChangelogDetailsModal from '~/components/seasons/ChangelogDetailsModal.vue';

// Page meta
definePageMeta({
  middleware: ['auth', 'admin'],
  requiresAuth: true,
  layout: 'authenticated'
});

// Composables
const { showError, showSuccess } = useNotifications();
const { handleChangelogsFetchError } = useChangelogsErrorHandler();

// Reactive data
const changelogs = ref<Changelog[]>([]);
const totalChangelogs = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const isLoading = ref(false);

// User name cache
const userNamesCache = ref<Map<number, string>>(new Map());

// Modal state
const viewDetailsModalOpen = ref(false);
const selectedChangelog = ref<Changelog | null>(null);

// Filter state
const filters = ref({
  from_date: null as string | null,
  to_date: null as string | null,
  entityType: undefined as EntityType | undefined
});

// Date picker state
const showDateFromPicker = ref(false);
const showDateToPicker = ref(false);

// Sorting state
const sortOrder = ref<'asc' | 'desc'>('desc');

// Options
const pageSizeOptions = [
  { title: '10 per page', value: 10 },
  { title: '20 per page', value: 20 },
  { title: '50 per page', value: 50 },
  { title: '100 per page', value: 100 }
];

const sortOrderOptions = [
  { title: 'Newest First', value: 'desc' },
  { title: 'Oldest First', value: 'asc' }
];

const entityTypeOptions = [
  { title: 'All Types', value: undefined },
  { title: 'Events', value: 'EVENT' as EntityType },
  { title: 'Seasons', value: 'SEASON' as EntityType },
  { title: 'Buckets', value: 'BUCKET' as EntityType }
];

// Table headers
const tableHeaders = [
  { title: 'Entity ID', key: 'entityId', sortable: true, width: '100px' },
  { title: 'Entity Type', key: 'entityType', sortable: true, width: '120px' },
  { title: 'Change Reason', key: 'changeReason', sortable: false, width: '200px' },
  { title: 'Modified By', key: 'modifiedBy', sortable: true, width: '120px' },
  { title: 'Modified At', key: 'modifiedAt', sortable: true, width: '180px' },
  { title: 'Actions', key: 'actions', sortable: false, width: '120px' }
];

// Computed
const totalPages = computed(() => {
  return Math.ceil(totalChangelogs.value / itemsPerPage.value);
});

const hasActiveFilters = computed(() => {
  return filters.value.from_date !== null || filters.value.to_date !== null || filters.value.entityType !== undefined;
});

// Processed changelogs with user names
const processedChangelogs = computed(() => {
  return changelogs.value.map(changelog => ({
    ...changelog,
    modifierName: userNamesCache.value.get(changelog.modifiedBy) || `User ${changelog.modifiedBy}`
  }));
});

// Methods
const loadChangelogs = async () => {
  try {
    isLoading.value = true;
    
    const query: ChangelogQuery = {
      limit: itemsPerPage.value,
      offset: (currentPage.value - 1) * itemsPerPage.value,
      orderBy: 'modifiedAt',
      order: sortOrder.value
    };

    // Add date filters if provided
    if (filters.value.from_date) {
      // Set to start of day in UTC
      const fromDate = new Date(filters.value.from_date);
      fromDate.setHours(0, 0, 0, 0);
      query.startDate = fromDate.toISOString();
    }
    if (filters.value.to_date) {
      // Set to end of day in UTC
      const toDate = new Date(filters.value.to_date);
      toDate.setHours(23, 59, 59, 999);
      query.endDate = toDate.toISOString();
    }

    // Add entity type filter if provided
    if (filters.value.entityType) {
      query.entityType = filters.value.entityType;
    }

    console.log('Loading changelogs with query:', query);

    const response = await changelogsApi.getChangelogs(query);
    
    if (response.success && response.data) {
      changelogs.value = response.data.changelogs;
      totalChangelogs.value = response.data.pagination.total;
      
      // Fetch user names for new changelogs
      await loadUserNames();
    }
  } catch (err: any) {
    console.error('Error loading changelogs:', err);
    const errorMessage = handleChangelogsFetchError(err);
    showError('Failed to load changelogs', errorMessage);
  } finally {
    isLoading.value = false;
  }
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  loadChangelogs();
};

const handlePageSizeChange = () => {
  currentPage.value = 1;
  loadChangelogs();
};

const viewChanges = (change: Changelog) => {
  selectedChangelog.value = change;
  viewDetailsModalOpen.value = true;
};

const formatDate = (dateString: string) => {
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
  } catch (error) {
    return 'Invalid Date';
  }
};

const getEntityTypeColor = (entityType: EntityType) => {
  switch (entityType) {
    case 'EVENT':
      return 'primary';
    case 'SEASON':
      return 'success';
    case 'BUCKET':
      return 'warning';
    default:
      return 'grey';
  }
};

const loadUserNames = async () => {
  // Get unique user IDs from changelogs
  const userIds = [...new Set(changelogs.value.map(c => c.modifiedBy))];
  
  // Filter out users we already have cached
  const uncachedUserIds = userIds.filter(id => !userNamesCache.value.has(id));
  
  // Fetch user names for uncached users
  for (const userId of uncachedUserIds) {
    try {
      const response = await usersApi.getUser(userId);
      if (response.success && response.data) {
        userNamesCache.value.set(userId, response.data.name);
      }
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      // Set a fallback name
      userNamesCache.value.set(userId, `User ${userId}`);
    }
  }
};

const getModifierName = (cmsUserId: number) => {
  // Return cached user name or fallback
  return userNamesCache.value.get(cmsUserId) || `User ${cmsUserId}`;
};

// Filter and sort methods
const handleSortChange = () => {
  currentPage.value = 1;
  loadChangelogs();
};

const clearFilters = () => {
  filters.value = {
    from_date: null,
    to_date: null,
    entityType: undefined
  };
  currentPage.value = 1;
  loadChangelogs();
};

const applyFilters = () => {
  currentPage.value = 1;
  loadChangelogs();
};

// Load initial data
onMounted(() => {
  loadChangelogs();
});
</script>

<style scoped>
.changelogs-wrapper {
  min-height: 100vh;
}

.changelogs-table-card {
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Custom styles for input fields */
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

/* Custom styles for buttons */
:deep(.profile-button) {
  font-size: 1.2rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* Changelogs table styling */
:deep(.changelogs-table) {
  font-size: 1.1rem;
}

/* Column width control */
:deep(.changelogs-table .v-data-table__td) {
  font-size: 1.1rem;
  padding: 16px 8px;
  white-space: nowrap;
}

:deep(.changelogs-table .v-data-table__th) {
  font-size: 1.2rem;
  font-weight: 600;
  padding: 16px 8px;
  white-space: nowrap;
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
