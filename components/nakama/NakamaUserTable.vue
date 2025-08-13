<template>
  <div class="table-container" style="overflow-x: auto; width: 100%; border-radius: 4px;">
    <v-data-table-server
      :headers="headers"
      :items="users"
      :loading="loading"
      :items-per-page="itemsPerPage"
      :items-per-page-options="[10, 25, 50, 100, -1]"
      :items-length="totalUsers"
      @update:options="$emit('update:options', $event)"
      class="elevation-1"
    >
      <!-- Username Column -->
      <template v-slot:item.username="{ item }">
        <div class="d-flex align-center">
          <v-avatar size="32" class="mr-2">
            <v-img v-if="item.avatar_url" :src="item.avatar_url" />
            <v-icon v-else>mdi-account</v-icon>
          </v-avatar>
          <span class="font-weight-medium">{{ item.username }}</span>
        </div>
      </template>

      <!-- Email Column -->
      <template v-slot:item.email="{ item }">
        <span class="text-caption">{{ item.email || 'N/A' }}</span>
      </template>

      <!-- Language Column -->
      <template v-slot:item.lang_tag="{ item }">
        <v-chip size="x-small" color="info">{{ item.lang_tag || 'N/A' }}</v-chip>
      </template>

      <!-- Location Column -->
      <template v-slot:item.location="{ item }">
        <span class="text-caption">{{ item.location || 'N/A' }}</span>
      </template>

      <!-- Created Date Column -->
      <template v-slot:item.create_time="{ item }">
        <span class="text-caption">{{ formatDate(item.create_time) }}</span>
      </template>

      <!-- Updated Date Column -->
      <template v-slot:item.update_time="{ item }">
        <span class="text-caption">{{ formatDate(item.update_time) }}</span>
      </template>

      <!-- Actions Column -->
      <template v-slot:item.actions="{ item }">
        <v-btn
          size="small"
          color="primary"
          variant="text"
          @click="$emit('view-user', item)"
        >
          View & Edit
        </v-btn>
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup lang="ts">
import type { FlattenedNakamaUser } from '~/types'
import { useDateUtils } from '~/composables/useDateUtils'

// Props
interface Props {
  users: FlattenedNakamaUser[]
  loading: boolean
  itemsPerPage: number
  totalUsers: number
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update:options': [options: any]
  'view-user': [user: FlattenedNakamaUser]
}>()

// Composables
const { formatDate } = useDateUtils()

// Table headers
const headers = [
  { title: 'Username', key: 'username', sortable: true },
  { title: 'Display Name', key: 'display_name', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Language', key: 'lang_tag', sortable: true },
  { title: 'Location', key: 'location', sortable: true },
  { title: 'Created', key: 'create_time', sortable: true },
  { title: 'Updated', key: 'update_time', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
]
</script>

<style scoped>
.table-container {
  overflow-x: auto;
  border-radius: 4px;
}

:deep(.v-data-table td) {
  padding: 8px 12px !important;
}

:deep(.v-data-table th) {
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
  padding: 12px 8px !important;
}
</style> 