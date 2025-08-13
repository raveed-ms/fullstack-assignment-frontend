<template>
  <v-data-table
    :headers="headers"
    :items="users"
    :loading="loading"
    :search="searchTerm"
    class="elevation-1"
    @click:row="handleRowClick"
  >
    <!-- Role Column -->
    <template v-slot:item.role="{ item }">
      <v-chip
        :color="getRoleColor(item.role)"
        size="small"
      >
        <v-icon class="mr-1" size="small">{{ getRoleIcon(item.role) }}</v-icon>
        {{ item.role.toUpperCase() }}
      </v-chip>
    </template>

    <!-- Status Column -->
    <template v-slot:item.blacklisted="{ item }">
      <v-chip
        :color="item.blacklisted ? 'error' : 'success'"
        size="small"
      >
        <v-icon class="mr-1" size="small">
          {{ item.blacklisted ? 'mdi-block' : 'mdi-check-circle' }}
        </v-icon>
        {{ item.blacklisted ? 'Blacklisted' : 'Active' }}
      </v-chip>
    </template>

    <!-- Created Date Column -->
    <template v-slot:item.created_at="{ item }">
      {{ formatDate(item.created_at) }}
    </template>

    <!-- Updated Date Column -->
    <template v-slot:item.updated_at="{ item }">
      {{ formatDate(item.updated_at) }}
    </template>

    <!-- Actions Column -->
    <template v-slot:item.actions="{ item }">
      <v-btn
        size="small"
        color="primary"
        variant="outlined"
        @click.stop="viewUser(item)"
      >
        <v-icon size="small">mdi-eye</v-icon>
        View
      </v-btn>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import type { User } from '~/types'
import { USER_TABLE_HEADERS } from '~/constants/users'
import { useUsers } from '~/composables/useUsers'

interface Props {
  users: User[]
  loading?: boolean
  searchTerm?: string
}

interface Emits {
  (e: 'view-user', user: User): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  searchTerm: ''
})

const emit = defineEmits<Emits>()

const { getRoleColor, getRoleIcon, formatDate } = useUsers()

const headers = USER_TABLE_HEADERS

const handleRowClick = (event: any, item: any) => {
  viewUser(item)
}

const viewUser = (user: User) => {
  emit('view-user', user)
}
</script>

<style scoped>
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

/* Make rows clickable */
:deep(.v-data-table tbody tr) {
  cursor: pointer;
}

:deep(.v-data-table tbody tr:hover) {
  background-color: rgba(0, 0, 0, 0.04);
}
</style> 