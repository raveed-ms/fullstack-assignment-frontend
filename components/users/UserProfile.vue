<template>
  <div>
    <!-- Header -->
    <v-card class="mb-6">
      <v-card-title class="text-h4">
        <v-icon class="mr-2">mdi-account</v-icon>
        User Profile
      </v-card-title>
      <v-card-subtitle>
        Detailed information for {{ user?.name }}
      </v-card-subtitle>
    </v-card>

    <v-row>
      <!-- User Information Card -->
      <v-col cols="12" md="8">
        <v-card class="mb-6">
          <v-card-title class="text-h5">
            <v-icon class="mr-2">mdi-information</v-icon>
            Basic Information
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-title class="text-subtitle-2 text-grey-600">ID</v-list-item-title>
                <v-list-item-subtitle class="text-h6">{{ user?.id }}</v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <v-list-item-title class="text-subtitle-2 text-grey-600">Name</v-list-item-title>
                <v-list-item-subtitle class="text-h6">{{ user?.name }}</v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <v-list-item-title class="text-subtitle-2 text-grey-600">Email</v-list-item-title>
                <v-list-item-subtitle class="text-h6">{{ user?.email }}</v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <v-list-item-title class="text-subtitle-2 text-grey-600">Role</v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip :color="getRoleColor(user?.role || 'user')" size="large">
                    <v-icon class="mr-1">{{ getRoleIcon(user?.role || 'user') }}</v-icon>
                    {{ user?.role?.toUpperCase() }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <v-list-item-title class="text-subtitle-2 text-grey-600">Status</v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip :color="user?.blacklisted ? 'error' : 'success'" size="large">
                    <v-icon class="mr-1">{{ user?.blacklisted ? 'mdi-block' : 'mdi-check-circle' }}</v-icon>
                    {{ user?.blacklisted ? 'BLACKLISTED' : 'ACTIVE' }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <v-list-item-title class="text-subtitle-2 text-grey-600">Created</v-list-item-title>
                <v-list-item-subtitle class="text-h6">
                  {{ user?.created_at ? formatDateTime(user.created_at) : 'N/A' }}
                </v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <v-list-item-title class="text-subtitle-2 text-grey-600">Last Updated</v-list-item-title>
                <v-list-item-subtitle class="text-h6">
                  {{ user?.updated_at ? formatDateTime(user.updated_at) : 'N/A' }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Actions Card (Only for Admins and Mods) -->
      <v-col cols="12" md="4" v-if="canPerformAdminActions || canPerformModActions">
        <v-card class="mb-6">
          <v-card-title class="text-h5">
            <v-icon class="mr-2">mdi-cog</v-icon>
            Actions
          </v-card-title>
          <v-card-text>
            <v-list>
              <!-- Blacklist Action (Admins and Mods) -->
              <v-list-item v-if="canPerformAdminActions || canPerformModActions">
                <v-list-item-title class="text-subtitle-2 text-grey-600">User Management</v-list-item-title>
                <v-list-item-subtitle>
                  <v-btn
                    variant="outlined"
                    :color="user?.blacklisted ? 'success' : 'error'"
                    :prepend-icon="user?.blacklisted ? 'mdi-check-circle' : 'mdi-block'"
                    class="mt-2"
                    block
                    :loading="isBlacklisting"
                    @click="toggleBlacklist"
                  >
                    {{ user?.blacklisted ? 'Unblacklist' : 'Blacklist' }}
                  </v-btn>
                </v-list-item-subtitle>
              </v-list-item>

              <!-- Delete Action (Admins Only) -->
              <v-list-item v-if="canPerformAdminActions">
                <v-list-item-title class="text-subtitle-2 text-grey-600">Danger Zone</v-list-item-title>
                <v-list-item-subtitle>
                  <v-btn
                    variant="outlined"
                    color="error"
                    prepend-icon="mdi-delete"
                    class="mt-2"
                    block
                    :loading="isDeleting"
                    @click="confirmDelete"
                  >
                    Delete User
                  </v-btn>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Back Button -->
    <v-card>
      <v-card-actions>
        <v-btn
          variant="outlined"
          prepend-icon="mdi-arrow-left"
          @click="goBack"
        >
          Back to Users List
        </v-btn>
        <v-spacer />
        <v-btn
          color="primary"
          prepend-icon="mdi-refresh"
          @click="refresh"
          :loading="loading"
        >
          Refresh
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types'
import { useAuth } from '~/composables/useAuth'
import { useUsers } from '~/composables/useUsers'

interface Props {
  user: User | null
  loading?: boolean
  isBlacklisting?: boolean
  isDeleting?: boolean
}

interface Emits {
  (e: 'toggle-blacklist'): void
  (e: 'confirm-delete'): void
  (e: 'refresh'): void
  (e: 'go-back'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  isBlacklisting: false,
  isDeleting: false
})

const emit = defineEmits<Emits>()

const { user: currentUser } = useAuth()
const { getRoleColor, getRoleIcon, formatDateTime } = useUsers()

// Computed properties for action permissions
const canPerformAdminActions = computed(() => {
  return currentUser?.role === 'admin' && props.user?.id !== currentUser?.id
})

const canPerformModActions = computed(() => {
  return currentUser?.role === 'mod' && props.user?.role === 'user' && props.user?.id !== currentUser?.id
})

const toggleBlacklist = () => {
  emit('toggle-blacklist')
}

const confirmDelete = () => {
  emit('confirm-delete')
}

const refresh = () => {
  emit('refresh')
}

const goBack = () => {
  emit('go-back')
}
</script> 