<template>
  <PageLayout>
    <!-- Loading State -->
    <v-skeleton-loader
      v-if="isInitializing"
      type="table"
      class="mb-4"
    />
    
    <!-- Header -->
    <v-card v-else class="mb-6">
      <v-card-title class="text-h4">
        <v-icon class="mr-2">mdi-account-multiple</v-icon>
        All Users
      </v-card-title>
      <v-card-subtitle>
        View all users in the system ({{ totalUsers }} total users)
        <br>
        <small class="text-caption">
          <v-chip v-if="searchTerm" size="x-small" class="ml-2" color="info">
            Search: "{{ searchTerm }}"
          </v-chip>
        </small>
      </v-card-subtitle>
    </v-card>

    <!-- User List -->
    <v-card>
      <v-card-title>
        <!-- Search Controls Component -->
        <UserSearchControls
          v-model:search-term="searchTerm"
          v-model:search-field="searchField"
          v-model:sort-by="sortBy"
          v-model:sort-order="sortOrder"
          @search-input="handleSearchInput"
          @search-enter="handleSearchEnter"
          @apply-sort="applySort"
          @clear-sort="clearSort"
          @clear-search="clearSearch"
          @refresh="loadUsers"
        />
      </v-card-title>

      <!-- Table Component -->
      <UserTable
        :users="filteredUsers"
        :search-term="searchTerm"
        @view-user="navigateToUser"
      />
    </v-card>
  </PageLayout>
</template>

<script setup lang="ts">
import type { User } from '~/types'
import { useAuth } from '~/composables/useAuth'
import { useUsers } from '~/composables/useUsers'
// Explicit imports for now - auto-import investigation needed
import UserSearchControls from '~/components/users/UserSearchControls.vue'
import UserTable from '~/components/users/UserTable.vue'

definePageMeta({ title: 'All Users' })

// Composables
const { isInitializing } = useAuth()
const {
  users,
  error,
  searchTerm,
  searchField,
  sortBy,
  sortOrder,
  loadUsers,
  searchUsers,
  sortUsers,
  clearError,
  getRoleColor,
  getRoleIcon,
  formatDate,
  formatDateTime,
  totalUsers
} = useUsers()

// Computed properties
const filteredUsers = computed(() => {
  let result = users.value

  // Apply search if provided
  if (searchTerm.value.trim()) {
    result = searchUsers(searchTerm.value, searchField.value)
  }

  // Apply sorting if provided
  if (sortBy.value && sortOrder.value) {
    result = sortUsers(sortBy.value, sortOrder.value)
  }

  return result
})

// Debounced search function
const debouncedSearch = useDebounceFn(async (term: string) => {
  if (term.trim()) {
    // For now, we're using client-side search
    // In the future, this could be server-side
    console.log('Searching for:', term, 'in field:', searchField.value)
  }
}, 300)

// Event handlers
const handleSearchInput = () => {
  if (searchTerm.value.trim()) {
    debouncedSearch(searchTerm.value)
  }
}

const handleSearchEnter = async () => {
  if (searchTerm.value.trim()) {
    console.log('Search entered:', searchTerm.value, 'in field:', searchField.value)
  }
}

const navigateToUser = (user: User) => {
  if (user && user.id) {
    navigateTo(`/users/${user.id}`)
  } else {
    console.error('Invalid user data:', user)
  }
}

const applySort = async () => {
  console.log('Applying sort:', { field: sortBy.value, order: sortOrder.value })
  // For now, we're using client-side sorting
  // In the future, this could be server-side
}

const clearSort = async () => {
  console.log('Clearing sort - resetting to default')
  sortBy.value = 'name'
  sortOrder.value = 'asc'
}

const clearSearch = async () => {
  searchTerm.value = ''
  searchField.value = 'name'
}

// Initialize on mount
onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
/* Standard table styling */
.table-container {
  overflow-x: auto;
  border-radius: 4px;
}
</style> 