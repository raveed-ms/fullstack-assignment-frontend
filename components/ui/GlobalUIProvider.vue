<template>
  <div class="global-ui-provider">
    <!-- Main content -->
    <slot />
    
    <!-- Global notifications -->
    <NotificationToast
      :notifications="notifications"
      @remove="removeNotification"
      @action="handleNotificationAction"
    />
    
    <!-- Global loading overlay -->
    <v-overlay
      :model-value="hasActiveLoading"
      class="global-loading-overlay"
      persistent
    >
      <v-card class="loading-card" color="primary" variant="tonal">
        <v-card-text class="text-center">
          <v-progress-circular
            indeterminate
            color="white"
            size="64"
            class="mb-4"
          />
          <div v-if="loadingMessage" class="loading-message">
            {{ loadingMessage }}
          </div>
          <div v-if="loadingProgress !== null" class="loading-progress">
            <v-progress-linear
              :model-value="loadingProgress"
              color="white"
              height="8"
              class="mt-2"
            />
            <div class="progress-text mt-1">
              {{ Math.round(loadingProgress) }}%
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-overlay>
    
    <!-- Global error boundary -->
    <ErrorBoundary
      v-if="hasError"
      :error="error"
      :retryable="isRetryableError"
      @retry="handleErrorRetry"
      @recovered="handleErrorRecovered"
    />
  </div>
</template>

<script setup lang="ts">
import type { ErrorInfo, LoadingState } from '~/composables/ui'
import type { Notification } from '~/composables/ui'

// Import composables
const { error, hasError, isRetryableError, clearError } = useErrorHandler()
const { notifications, removeNotification } = useNotifications()
const { hasActiveLoading, getAllLoadingStates, averageProgress } = useLoading()

// Computed properties for loading state
const loadingMessage = computed(() => {
  const states = getAllLoadingStates.value
  if (states.length === 0) return ''
  
  // Get the most recent loading state with a message
  const stateWithMessage = states.find((state: LoadingState) => state.message)
  return stateWithMessage?.message || 'Loading...'
})

const loadingProgress = computed(() => {
  return averageProgress.value
})

// Handle notification action
const handleNotificationAction = (notification: Notification) => {
  // Handle different notification actions
  if (notification.action) {
    notification.action.handler()
  }
}

// Handle error retry
const handleErrorRetry = () => {
  // Clear the error and let the parent component handle retry
  clearError()
}

// Handle error recovery
const handleErrorRecovered = () => {
  // Show success notification
  const { showSuccess } = useNotifications()
  showSuccess('Operation completed successfully')
}

// Provide global UI state to child components
provide('globalUI', {
  error,
  hasError,
  notifications,
  hasActiveLoading,
  loadingMessage,
  loadingProgress
})
</script>

<style scoped>
.global-ui-provider {
  position: relative;
  min-height: 100vh;
}

.global-loading-overlay {
  z-index: 9998;
}

.loading-card {
  max-width: 300px;
  padding: 2rem;
}

.loading-message {
  font-size: 1rem;
  color: white;
  margin-bottom: 1rem;
}

.loading-progress {
  margin-top: 1rem;
}

.progress-text {
  font-size: 0.875rem;
  color: white;
  text-align: center;
}
</style> 