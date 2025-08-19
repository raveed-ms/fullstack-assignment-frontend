<template>
  <div class="buckets-wrapper">
    <ClientOnly>
      <template #default>
        <v-container fluid class="bg-grey-lighten-4 pa-0 ma-0">
          <v-row class="ma-0">
            <v-col cols="12">
              <!-- Search and Toolbar -->
              <v-card class="mb-6" elevation="1">
                <v-card-text class="pa-4">
                  <v-row class="align-center">
                    <!-- Search -->
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="searchQuery"
                        label="Search buckets"
                        placeholder="Search by name..."
                        prepend-inner-icon="mdi-magnify"
                        variant="outlined"
                        density="compact"
                        clearable
                        :loading="isSearching"
                        class="input-field"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6" class="d-flex justify-end"></v-col>
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
                        @click="refreshBuckets"
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

              <!-- Buckets Table (placeholder data) -->
              <v-card class="buckets-table-card" elevation="1">
                <v-card-text class="pa-0">
                  <div v-if="isLoading" class="text-center py-12">
                    <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
                    <div class="mt-4 text-body-1 text-grey">Loading buckets...</div>
                  </div>
                  <div v-else>
                    <v-data-table
                      :headers="tableHeaders"
                      :items="buckets"
                      :loading="isLoading"
                      class="buckets-table"
                      hover
                      hide-default-footer
                    >
                      <template v-slot:item.name="{ item }">
                        <div class="font-weight-medium">{{ item.name }}</div>
                      </template>

                      <template v-slot:item.rules="{ item }">
                        <div class="d-flex flex-wrap gap-2">
                          <v-chip v-if="item.personaRules?.level" size="x-small" variant="tonal" color="primary">
                            Level: {{ item.personaRules.level.min ?? 'any' }}–{{ item.personaRules.level.max ?? 'any' }}
                          </v-chip>
                          <v-chip v-if="item.personaRules?.mmr" size="x-small" variant="tonal" color="secondary">
                            MMR: {{ item.personaRules.mmr.min ?? 'any' }}–{{ item.personaRules.mmr.max ?? 'any' }}
                          </v-chip>
                          <v-chip v-if="item.personaRules?.spending" size="x-small" variant="tonal" color="accent">
                            Spending: {{ item.personaRules.spending.min ?? 'any' }}–{{ item.personaRules.spending.max ?? 'any' }}
                          </v-chip>
                          <v-chip v-if="!item.personaRules || (!item.personaRules.level && !item.personaRules.mmr && !item.personaRules.spending)" size="x-small" variant="tonal" color="grey">
                            No rules
                          </v-chip>
                        </div>
                      </template>

                      
                    </v-data-table>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Pagination -->
              <div v-if="totalBuckets > 0" class="mt-6">
                <div class="custom-pagination pa-6">
                  <div class="d-flex justify-space-between align-center">
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

                    <div class="page-info text-body-1 font-weight-medium">
                      Page <span class="text-primary font-weight-bold">{{ currentPage }}</span> of <span class="text-primary font-weight-bold">{{ totalPages }}</span>
                    </div>

                    <div class="d-flex align-center gap-3">
                      <v-btn :disabled="currentPage === 1" variant="outlined" color="primary" class="pagination-btn" @click="() => handlePageChange(currentPage - 1)">
                        <v-icon start>mdi-chevron-left</v-icon>
                        Previous
                      </v-btn>
                      <v-btn :disabled="currentPage >= totalPages" variant="outlined" color="primary" class="pagination-btn" @click="() => handlePageChange(currentPage + 1)">
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
        <div class="buckets-fallback">
          <p>Loading buckets...</p>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
definePageMeta({ middleware: ['auth'], requiresAuth: true, layout: 'authenticated' });

import { ref, computed, watch, onMounted } from 'vue';
import { bucketsApi } from '~/api/buckets';
import type { Bucket, BucketQuery } from '~/api/buckets';
import { useBucketsErrorHandler } from '~/composables/errors/useBucketsErrorHandler';
import { useNotifications } from '~/composables/ui/useNotifications';

const { handleBucketFetchError } = useBucketsErrorHandler();
const { showError } = useNotifications();

const buckets = ref<Bucket[]>([]);
const isLoading = ref(false);
const totalBuckets = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(12);

const searchQuery = ref('');
const debouncedSearchQuery = ref('');
const isSearching = ref(false);

const sortBy = ref('id');
const sortOrder = ref<'asc' | 'desc'>('asc');

const pageSizeOptions = [
  { title: '12 per page', value: 12 },
  { title: '20 per page', value: 20 },
  { title: '50 per page', value: 50 },
  { title: '100 per page', value: 100 }
];

const sortOptions = [
  { title: 'ID', value: 'id' },
  { title: 'Name', value: 'name' }
];

const sortOrderOptions = [
  { title: 'Ascending', value: 'asc' },
  { title: 'Descending', value: 'desc' }
];

const tableHeaders = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Rules', key: 'rules', sortable: false }
];

const hasActiveFilters = computed(() => !!debouncedSearchQuery.value);
const totalPages = computed(() => Math.ceil(totalBuckets.value / itemsPerPage.value));

// Build backend query
const buildQuery = (): BucketQuery => {
  const q: BucketQuery = {
    limit: itemsPerPage.value,
    skip: (currentPage.value - 1) * itemsPerPage.value,
  };
  if (debouncedSearchQuery.value) q.searchName = debouncedSearchQuery.value;
  if (sortBy.value) q.sort = { [sortBy.value]: sortOrder.value } as any;
  return q;
};

const loadBuckets = async () => {
  isLoading.value = true;
  try {
    const query = buildQuery();
    const [listResp, countResp] = await Promise.all([
      bucketsApi.getBuckets(query),
      bucketsApi.getBucketsCount(query),
    ]);

    if (listResp.success && listResp.data) {
      buckets.value = listResp.data;
    } else {
      const msg = listResp.error ? handleBucketFetchError(listResp.error) : 'Unknown error';
      showError('Failed to load buckets', msg);
      buckets.value = [];
    }

    if (countResp.success && typeof countResp.data === 'number') {
      totalBuckets.value = countResp.data;
    } else {
      totalBuckets.value = buckets.value.length;
    }
  } catch (err: any) {
    const msg = err?.message || 'An unexpected error occurred';
    showError('Failed to load buckets', msg);
    buckets.value = [];
    totalBuckets.value = 0;
  } finally {
    isLoading.value = false;
    isSearching.value = false;
  }
};

onMounted(() => {
  loadBuckets();
});

let searchTimeout: NodeJS.Timeout;
watch(searchQuery, (v) => {
  clearTimeout(searchTimeout);
  isSearching.value = true;
  searchTimeout = setTimeout(() => {
    debouncedSearchQuery.value = v;
    handleSearch();
  }, 500);
});

const handleSearch = () => {
  currentPage.value = 1;
  loadBuckets();
};

const handleSortChange = () => {
  currentPage.value = 1;
  loadBuckets();
};

const clearFilters = () => {
  searchQuery.value = '';
  debouncedSearchQuery.value = '';
  isSearching.value = false;
  currentPage.value = 1;
  loadBuckets();
};

const refreshBuckets = () => {
  loadBuckets();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  loadBuckets();
};

const handlePageSizeChange = (newSize: number) => {
  itemsPerPage.value = newSize;
  currentPage.value = 1;
  loadBuckets();
};

const viewBucket = (bucket: Bucket) => {
  // Placeholder action for future details modal
};
</script>

<style scoped>
.buckets-wrapper {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

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

.buckets-table-card { background: white; }

:deep(.buckets-table) { font-size: 1.1rem; }

:deep(.buckets-table table) {
  table-layout: fixed;
  width: 100%;
}

:deep(.buckets-table .v-data-table__td),
:deep(.buckets-table .v-data-table__th) {
  padding: 16px 12px;
  white-space: normal;
  word-break: break-word;
}
:deep(.buckets-table .v-data-table__td:nth-child(5)) { width: 200px; }

.custom-pagination { background: rgba(0,0,0,0.02); border-top: 1px solid rgba(0,0,0,0.08); margin-top: 16px; }
.page-size-section { min-width: 140px; display:flex; align-items:center; }
.page-size-select { min-width: 140px; }
:deep(.page-size-select .v-input__details) { display:none; }
.page-info { min-width: 200px; text-align:center; }
.pagination-btn { min-width: 120px; font-weight: 500; letter-spacing: .5px; border-radius: 8px; transition: all .2s; }
.pagination-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.15); }
.pagination-btn:disabled { opacity:.5; cursor:not-allowed; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }

.buckets-fallback { min-height: 100vh; display:flex; justify-content:center; align-items:center; background:#f5f5f5; text-align:center; font-size:1.2rem; color:#4a6fa5; }
</style>


