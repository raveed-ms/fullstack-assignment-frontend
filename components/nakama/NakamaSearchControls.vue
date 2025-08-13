<template>
  <div class="d-flex flex-column w-100">
    <!-- Search and Sort Controls -->
    <div class="d-flex align-center mb-3">
      <!-- Search Field Selection -->
      <v-select
        v-model="searchField"
        :items="searchFieldOptions"
        label="Search Field"
        density="compact"
        variant="outlined"
        class="mr-3"
        style="min-width: 150px;"
      />
      
      <!-- Sort Field Selection -->
      <v-select
        v-model="sortBy"
        :items="sortFieldOptions"
        label="Sort By"
        density="compact"
        variant="outlined"
        class="mr-3"
        style="min-width: 150px;"
      />
      
      <!-- Sort Direction -->
      <v-select
        v-model="sortOrder"
        :items="sortOrderOptions"
        label="Order"
        density="compact"
        variant="outlined"
        class="mr-3"
        style="min-width: 100px;"
      />
      
      <!-- Apply Sort Button -->
      <v-btn
        size="small"
        color="primary"
        variant="outlined"
        prepend-icon="mdi-sort"
        @click="$emit('apply-sort')"
        :loading="loading"
        class="mr-3"
      >
        Apply Sort
      </v-btn>
      
      <!-- Clear Sort Button -->
      <v-btn
        v-if="sortBy !== 'username' || sortOrder !== 'asc'"
        size="small"
        variant="text"
        @click="$emit('clear-sort')"
        class="mr-3"
      >
        Clear Sort
      </v-btn>
      
      <v-spacer />
      
      <!-- Clear Search Button -->
      <v-btn
        v-if="searchTerm"
        size="small"
        variant="text"
        @click="$emit('clear-search')"
      >
        Clear Search
      </v-btn>
    </div>
    
    <!-- Search Input -->
    <div class="d-flex align-center">
      <v-text-field
        v-model="searchTerm"
        append-icon="mdi-magnify"
        label="Search users (server-side)"
        single-line
        hide-details
        class="mr-4"
        @input="$emit('search-input')"
        @keyup.enter="$emit('search-enter')"
      />
      <v-spacer />
      <v-btn
        color="primary"
        prepend-icon="mdi-refresh"
        @click="$emit('refresh')"
        :loading="loading"
      >
        Refresh
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NAKAMA_SEARCH_OPTIONS, NAKAMA_SORT_OPTIONS, NAKAMA_SORT_ORDER_OPTIONS } from '~/constants/nakama'

// Props
interface Props {
  searchTerm: string
  searchField: string
  sortBy: string
  sortOrder: string
  loading: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update:searchTerm': [value: string]
  'update:searchField': [value: string]
  'update:sortBy': [value: string]
  'update:sortOrder': [value: string]
  'search-input': []
  'search-enter': []
  'apply-sort': []
  'clear-sort': []
  'clear-search': []
  'refresh': []
}>()

// Computed properties for two-way binding
const searchTerm = computed({
  get: () => props.searchTerm,
  set: (value) => emit('update:searchTerm', value)
})

const searchField = computed({
  get: () => props.searchField,
  set: (value) => emit('update:searchField', value)
})

const sortBy = computed({
  get: () => props.sortBy,
  set: (value) => emit('update:sortBy', value)
})

const sortOrder = computed({
  get: () => props.sortOrder,
  set: (value) => emit('update:sortOrder', value)
})

// Options from constants
const searchFieldOptions = NAKAMA_SEARCH_OPTIONS
const sortFieldOptions = NAKAMA_SORT_OPTIONS
const sortOrderOptions = NAKAMA_SORT_ORDER_OPTIONS
</script> 