<template>
  <v-row align="center" class="mb-4">
    <!-- Search Field -->
    <v-col cols="12" sm="3">
      <v-select
        :model-value="searchField"
        :items="searchOptions"
        label="Search Field"
        variant="outlined"
        density="compact"
        hide-details
        @update:model-value="updateSearchField"
      />
    </v-col>

    <!-- Search Term -->
    <v-col cols="12" sm="4">
      <v-text-field
        :model-value="searchTerm"
        :label="`Search ${searchFieldLabel}`"
        variant="outlined"
        density="compact"
        hide-details
        clearable
        @update:model-value="updateSearchTerm"
        @input="handleSearchInput"
        @keyup.enter="handleSearchEnter"
      >
        <template v-slot:append>
          <v-icon>mdi-magnify</v-icon>
        </template>
      </v-text-field>
    </v-col>

    <!-- Sort By -->
    <v-col cols="12" sm="2">
      <v-select
        :model-value="sortBy"
        :items="sortOptions"
        label="Sort By"
        variant="outlined"
        density="compact"
        hide-details
        @update:model-value="updateSortBy"
      />
    </v-col>

    <!-- Sort Order -->
    <v-col cols="12" sm="2">
      <v-select
        :model-value="sortOrder"
        :items="sortOrderOptions"
        label="Order"
        variant="outlined"
        density="compact"
        hide-details
        @update:model-value="updateSortOrder"
      />
    </v-col>

    <!-- Action Buttons -->
    <v-col cols="12" sm="1">
      <v-btn
        color="primary"
        variant="outlined"
        size="small"
        @click="applySort"
        :loading="loading"
      >
        <v-icon>mdi-sort</v-icon>
      </v-btn>
    </v-col>
  </v-row>

  <!-- Action Buttons Row -->
  <v-row class="mb-4">
    <v-col>
      <v-btn
        color="primary"
        prepend-icon="mdi-refresh"
        @click="refresh"
        :loading="loading"
        class="mr-2"
      >
        Refresh
      </v-btn>
      
      <v-btn
        variant="outlined"
        prepend-icon="mdi-sort-variant-remove"
        @click="clearSort"
        :disabled="!hasSort"
        class="mr-2"
      >
        Clear Sort
      </v-btn>
      
      <v-btn
        variant="outlined"
        prepend-icon="mdi-magnify-close"
        @click="clearSearch"
        :disabled="!searchTerm"
      >
        Clear Search
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { USER_SEARCH_OPTIONS, USER_SORT_OPTIONS, USER_SORT_ORDER_OPTIONS } from '~/constants/users'

interface Props {
  searchTerm: string
  searchField: 'name' | 'email' | 'id'
  sortBy: string
  sortOrder: 'asc' | 'desc'
  loading?: boolean
}

interface Emits {
  (e: 'update:search-term', value: string): void
  (e: 'update:search-field', value: 'name' | 'email' | 'id'): void
  (e: 'update:sort-by', value: string): void
  (e: 'update:sort-order', value: 'asc' | 'desc'): void
  (e: 'search-input'): void
  (e: 'search-enter'): void
  (e: 'apply-sort'): void
  (e: 'clear-sort'): void
  (e: 'clear-search'): void
  (e: 'refresh'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<Emits>()

const searchOptions = USER_SEARCH_OPTIONS
const sortOptions = USER_SORT_OPTIONS
const sortOrderOptions = USER_SORT_ORDER_OPTIONS

const searchFieldLabel = computed(() => {
  const option = searchOptions.find(opt => opt.value === props.searchField)
  return option?.title || 'users'
})

const hasSort = computed(() => {
  return props.sortBy !== 'name' || props.sortOrder !== 'asc'
})

// Update functions for two-way binding
const updateSearchTerm = (value: string) => {
  emit('update:search-term', value)
}

const updateSearchField = (value: 'name' | 'email' | 'id') => {
  emit('update:search-field', value)
}

const updateSortBy = (value: string) => {
  emit('update:sort-by', value)
}

const updateSortOrder = (value: 'asc' | 'desc') => {
  emit('update:sort-order', value)
}

const handleSearchInput = () => {
  emit('search-input')
}

const handleSearchEnter = () => {
  emit('search-enter')
}

const applySort = () => {
  emit('apply-sort')
}

const clearSort = () => {
  emit('clear-sort')
}

const clearSearch = () => {
  emit('clear-search')
}

const refresh = () => {
  emit('refresh')
}
</script> 