<template>
  <PageLayout>
    <!-- Loading State -->
    <v-skeleton-loader
      v-if="isInitializing || isLoading"
      type="article"
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
    
    <!-- User Details -->
    <div v-else-if="user && editedUser">
      <!-- Header -->
      <v-card class="mb-6">
        <v-card-title class="text-h4">
          <v-btn
            icon
            variant="text"
            class="mr-3"
            @click="navigateTo('/nakama')"
          >
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-avatar size="60" class="mr-3">
            <v-img v-if="user.avatar_url" :src="user.avatar_url" />
            <v-icon v-else size="40">mdi-account</v-icon>
          </v-avatar>
          {{ user.username }}
          <v-chip class="ml-2" :color="user.isBotUser ? 'orange' : 'green'" size="small">
            {{ user.isBotUser ? 'Bot' : 'Human' }}
          </v-chip>
          <v-chip class="ml-2" :color="getChatRoleColor(user.chatRole)" size="small">
            {{ getChatRoleLabel(user.chatRole) }}
          </v-chip>
        </v-card-title>
        <v-card-subtitle>
          User ID: {{ user.id }} | Created: {{ formatDate(user.create_time) }}
          <br>
          Last Updated: {{ formatDate(user.update_time) }}
        </v-card-subtitle>
      </v-card>

      <!-- User Form Component -->
      <NakamaUserForm
        :user="user"
        v-model:edited-user="editedUser"
        :saving="isSaving"
        @reset="resetForm"
        @save="saveChanges"
      />
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import type { FlattenedNakamaUser } from '~/types'
import { useAuth } from '~/composables/useAuth'
import { useNakamaUsers } from '~/composables/useNakamaUsers'
import { useDateUtils } from '~/composables/useDateUtils'

// Get route parameters
const route = useRoute()
const userId = route.params.id as string

// Page metadata
definePageMeta({ title: 'Nakama User Details' })

// Composables
const { isInitializing } = useAuth()
const { 
  getNakamaUser, 
  updateNakamaUser,
  getChatRoleColor, 
  getChatRoleLabel 
} = useNakamaUsers()
const { formatDate } = useDateUtils()

// Reactive state
const user = ref<FlattenedNakamaUser | null>(null)
const editedUser = ref<FlattenedNakamaUser | null>(null)
const isLoading = ref(false)
const isSaving = ref(false)
const error = ref('')

// Load user data
const loadUser = async () => {
  try {
    isLoading.value = true
    error.value = ''
    
    const userData = await getNakamaUser(userId)
    user.value = userData
    editedUser.value = { ...userData } // Create a copy for editing
  } catch (err: any) {
    console.error('Failed to load user:', err)
    error.value = err.message || 'Failed to load user data'
  } finally {
    isLoading.value = false
  }
}

// Save changes
const saveChanges = async () => {
  if (!editedUser.value || !user.value) return
  
  try {
    isSaving.value = true
    error.value = ''
    
    // Calculate differences
    const changes: Partial<FlattenedNakamaUser> = {}
    Object.keys(editedUser.value).forEach(key => {
      const k = key as keyof FlattenedNakamaUser
      if (editedUser.value![k] !== user.value![k]) {
        ;(changes as any)[k] = editedUser.value![k]
      }
    })
    
    if (Object.keys(changes).length === 0) {
      // No changes to save
      return
    }
    
    // Update user
    const updatedUser = await updateNakamaUser(userId, changes)
    user.value = updatedUser
    editedUser.value = { ...updatedUser }
    
    // Show success message
    console.log('User updated successfully')
    // You can add a toast notification here if you have one
  } catch (err: any) {
    console.error('Failed to update user:', err)
    error.value = err.message || 'Failed to update user'
  } finally {
    isSaving.value = false
  }
}

// Reset form to original values
const resetForm = () => {
  if (user.value) {
    editedUser.value = { ...user.value }
  }
}

// Load user on mount
onMounted(() => {
  if (userId) {
    loadUser()
  }
})

// Watch for route changes
watch(() => route.params.id, (newId) => {
  if (newId && newId !== userId) {
    loadUser()
  }
})
</script> 