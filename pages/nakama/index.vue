<template>
  <v-container>
    <v-row>
      <v-col cols="12">
    <!-- Loading State -->
    <v-skeleton-loader
      v-if="isInitializing"
      type="table"
      class="mb-4"
    />
    
    <!-- Header -->
    <v-card v-else class="mb-6 pa-0">
      <v-card-title class="text-h4">
        <v-icon class="mr-2">mdi-gamepad-variant</v-icon>
        Nakama Game Users
      </v-card-title>
      <v-card-subtitle>
        Manage game players from the Nakama database ({{ totalUsers }} total users)
        <br>
        <small class="text-caption">
          <span v-if="itemsPerPage === -1">
            Showing all {{ currentUsers.length }} users
          </span>
          <span v-else>
            Showing {{ currentUsers.length }} users on page {{ currentPage }} of {{ totalPages }}
          </span>
          <v-chip v-if="searchTerm" size="x-small" class="ml-2" color="info">
            Search: "{{ searchTerm }}"
          </v-chip>
        </small>
      </v-card-subtitle>
    </v-card>

    <!-- User List -->
    <v-card class="pa-0">
      <v-card-title>
            <!-- Search Controls Component -->
            <NakamaSearchControls
              v-model:search-term="searchTerm"
              v-model:search-field="searchField"
              v-model:sort-by="sortBy"
              v-model:sort-order="sortOrder"
              :loading="isLoading"
              @search-input="handleSearchInput"
              @search-enter="handleSearchEnter"
              @apply-sort="applySort"
              @clear-sort="clearSort"
              @clear-search="clearSearch"
              @refresh="loadInitialUsers"
            />
          </v-card-title>

          <!-- Filters Component -->
          <v-card-subtitle>
            <NakamaFilters
              v-model:filters="filters"
              :loading="isLoading"
              @apply-filters="applyFilters"
              @clear-all-filters="clearAllFilters"
            />
          </v-card-subtitle>

          <!-- Table Component -->
          <NakamaUserTable
            :users="currentUsers"
          :loading="isLoading"
          :items-per-page="itemsPerPage"
            :total-users="totalUsers"
          @update:options="handleTableOptionsUpdate"
            @view-user="navigateToUser"
          />
    </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { FlattenedNakamaUser } from '~/types'
import type { NakamaFilters } from '~/types/nakama'
import { useAuth } from '~/composables/useAuth'
import { useNakamaUsers } from '~/composables/useNakamaUsers'
import { useNakamaFilters } from '~/composables/useNakamaFilters'
import { NAKAMA_DEFAULT_FILTERS } from '~/constants/nakama'

definePageMeta({ title: 'Nakama Users' })

// Composables
const { isInitializing } = useAuth()
const { 
  currentUsers,
  currentPage,
  itemsPerPage,
  totalUsers,
  totalPages,
  isLoading,
  searchTerm,
  searchField,
  sortBy,
  sortOrder,
  activeFilters,
  loadInitialUsers,
  loadPage,
  updateItemsPerPage,
  searchUsers,
  sortUsers,
  clearSearch: clearSearchComposable,
  applyFilters: applyFiltersComposable,
  clearFilters: clearFiltersComposable
} = useNakamaUsers()

const {
  filters,
  hasActiveFilters,
  buildFilterQuery,
  clearFilters: clearFiltersUtil,
  resetFilters
} = useNakamaFilters()

// Debounced search function
const debouncedSearch = useDebounceFn(async (term: string) => {
  if (term.trim()) {
    await searchUsers(term, searchField.value)
  }
}, 500)

// Event handlers
const handleSearchInput = () => {
  if (searchTerm.value.trim()) {
    debouncedSearch(searchTerm.value)
  }
}

const handleSearchEnter = async () => {
  if (searchTerm.value.trim()) {
    await searchUsers(searchTerm.value, searchField.value)
  }
}

const navigateToUser = (user: FlattenedNakamaUser) => {
  if (user && user.id) {
    navigateTo(`/nakama/${user.id}`)
  } else {
    console.error('Invalid user data:', user)
  }
}

const handleTableOptionsUpdate = async (options: any) => {
  console.log('Table options update:', options)
  
  // Update items per page if changed
  if (options.itemsPerPage !== itemsPerPage.value) {
    console.log('Updating items per page from', itemsPerPage.value, 'to', options.itemsPerPage)
    await updateItemsPerPage(options.itemsPerPage)
  }
  
  // Update sorting if changed
  if (options.sortBy && options.sortBy.length > 0 && (options.sortBy[0] !== sortBy.value || options.sortDesc[0] !== (sortOrder.value === 'desc'))) {
    console.log('Updating sort from', sortBy.value, sortOrder.value, 'to', options.sortBy[0], options.sortDesc[0] ? 'desc' : 'asc')
    await sortUsers(options.sortBy[0], options.sortDesc[0] ? 'desc' : 'asc')
  }
  
  // Update page if changed
  if (options.page !== currentPage.value) {
    console.log('Updating page from', currentPage.value, 'to', options.page)
    await loadPage(options.page)
  }
}

const applySort = async () => {
  console.log('Applying sort:', { field: sortBy.value, order: sortOrder.value })
  await sortUsers(sortBy.value, sortOrder.value)
}

const clearSort = async () => {
  console.log('Clearing sort - resetting to default')
  sortBy.value = 'username'
  sortOrder.value = 'asc'
  await sortUsers('username', 'asc')
}

const clearSearch = async () => {
  await clearSearchComposable()
}

const applyFilters = async () => {
  console.log('Applying filters:', filters.value)
  
  // Build filter query
  const filterQuery = buildFilterQuery()
  console.log('Filter query:', filterQuery)
  
  // Apply filters using composable
  await applyFiltersComposable(filterQuery)
}

const clearAllFilters = async () => {
  console.log('Clearing all filters')
  
  // Reset all filters to default values
  resetFilters()
  
  // Clear filters using composable
  await clearFiltersComposable()
}

// Initialize on mount
onMounted(() => {
  loadInitialUsers()
})
</script>

<style scoped>
/* Standard table styling */
.table-container {
  overflow-x: auto;
  border-radius: 4px;
}

/* Ensure table cells have consistent padding */
:deep(.v-data-table td) {
  padding: 8px 12px !important;
}

/* Make headers sticky */
:deep(.v-data-table th) {
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
  padding: 12px 8px !important;
}
</style> 