<template>
  <PageLayout>
    <!-- Loading State -->
    <v-skeleton-loader
      v-if="isLoading"
      type="card"
      class="mb-4"
    />
    
    <!-- Error State -->
    <v-alert
      v-else-if="error"
      type="error"
      class="mb-4"
    >
      {{ error }}
    </v-alert>

    <!-- User Profile -->
    <UserProfile
      v-else-if="user"
      :user="user"
      :loading="isLoading"
      :is-blacklisting="isBlacklisting"
      :is-deleting="isDeleting"
      @toggle-blacklist="toggleBlacklist"
      @confirm-delete="confirmDelete"
      @refresh="loadUser"
      @go-back="goBack"
    />

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5 text-error">
          <v-icon class="mr-2">mdi-alert</v-icon>
          Confirm Deletion
        </v-card-title>
        <v-card-text>
          <p class="text-body-1">
            Are you sure you want to delete <strong>{{ user?.name }}</strong>?
          </p>
          <p class="text-body-2 text-grey-600 mt-2">
            This action cannot be undone. The user will be permanently removed from the system.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="outlined"
            @click="showDeleteDialog = false"
            :disabled="isDeleting"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            @click="deleteUser"
            :loading="isDeleting"
            prepend-icon="mdi-delete"
          >
            Delete User
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Error Dialog -->
    <v-dialog v-model="showErrorDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5 text-error">
          <v-icon class="mr-2">mdi-alert-circle</v-icon>
          Operation Failed
        </v-card-title>
        <v-card-text>
          <p class="text-body-1">
            {{ errorMessage }}
          </p>
          <p class="text-body-2 text-grey-600 mt-2">
            Please try again or contact support if the problem persists.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            @click="showErrorDialog = false"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </PageLayout>
</template>

<script setup lang="ts">
import type { User } from '~/types'
import { useUsers } from '~/composables/useUsers'
// Explicit imports for now - auto-import investigation needed
import UserProfile from '~/components/users/UserProfile.vue'

const route = useRoute()
const userId = parseInt(route.params.id as string)

const {
  currentUser: user,
  isLoading,
  error,
  getUser,
  updateUser,
  deleteUser: deleteUserComposable,
  toggleBlacklist: toggleBlacklistComposable,
  clearError
} = useUsers()

const isBlacklisting = ref(false)
const isDeleting = ref(false)
const showDeleteDialog = ref(false)
const showErrorDialog = ref(false)
const errorMessage = ref('')

const loadUser = async () => {
  try {
    clearError()
    await getUser(userId)
  } catch (err: any) {
    console.error('Failed to load user:', err)
    // Error is already set in the composable
  }
}

const toggleBlacklist = async () => {
  if (!user.value) return
  
  try {
    isBlacklisting.value = true
    clearError()
    
    await toggleBlacklistComposable(user.value.id)
    
    // Show success message
    console.log(`User ${user.value.blacklisted ? 'blacklisted' : 'unblacklisted'} successfully`)
  } catch (err: any) {
    console.error('Failed to toggle blacklist status:', err)
    
    // Extract meaningful error message
    let errorMsg = 'Failed to update user status'
    
    if (err.data?.message) {
      errorMsg = err.data.message
    } else if (err.status === 403) {
      errorMsg = 'You do not have permission to perform this action'
    } else if (err.status === 404) {
      errorMsg = 'User not found'
    } else if (err.status === 401) {
      errorMsg = 'Authentication required. Please log in again.'
    } else if (err.status >= 500) {
      errorMsg = 'Server error. Please try again later.'
    }
    
    errorMessage.value = errorMsg
    showErrorDialog.value = true
  } finally {
    isBlacklisting.value = false
  }
}

const confirmDelete = () => {
  showDeleteDialog.value = true
}

const deleteUser = async () => {
  if (!user.value) return
  
  try {
    isDeleting.value = true
    clearError()
    
    await deleteUserComposable(user.value.id)
    
    // Show success message
    console.log('User deleted successfully')
    
    // Navigate back to users list
    await navigateTo('/users')
  } catch (err: any) {
    console.error('Failed to delete user:', err)
    
    // Extract meaningful error message
    let errorMsg = 'Failed to delete user'
    
    if (err.data?.message) {
      errorMsg = err.data.message
    } else if (err.status === 403) {
      errorMsg = 'You do not have permission to delete this user'
    } else if (err.status === 404) {
      errorMsg = 'User not found'
    } else if (err.status === 401) {
      errorMsg = 'Authentication required. Please log in again.'
    } else if (err.status >= 500) {
      errorMsg = 'Server error. Please try again later.'
    }
    
    errorMessage.value = errorMsg
    showErrorDialog.value = true
  } finally {
    isDeleting.value = false
    showDeleteDialog.value = false
  }
}

const goBack = () => {
  navigateTo('/users')
}

onMounted(() => {
  loadUser()
})
</script> 