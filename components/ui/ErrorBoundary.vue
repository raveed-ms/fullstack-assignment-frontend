<template>
  <div>
    <!-- Error state -->
    <div v-if="error" class="error-boundary">
      <v-card class="error-card" color="error" variant="tonal">
        <v-card-title class="d-flex align-center">
          <v-icon :icon="errorIcon" class="me-2" />
          {{ errorTitle }}
        </v-card-title>
        
        <v-card-text>
          <p class="error-message">{{ error.message }}</p>
          
          <!-- Show error details in development -->
          <v-expand-transition>
            <div v-if="showDetails" class="mt-3">
              <v-divider class="mb-3" />
              <v-alert
                type="info"
                variant="tonal"
                class="mb-3"
                title="Error Details (Development)"
              >
                <pre class="error-details">{{ errorDetails }}</pre>
              </v-alert>
            </div>
          </v-expand-transition>
        </v-card-text>
        
        <v-card-actions>
          <v-btn
            color="primary"
            variant="outlined"
            @click="retry"
            :loading="isRetrying"
            :disabled="isRetrying"
          >
            <v-icon icon="mdi-refresh" class="me-1" />
            Try Again
          </v-btn>
          
          <v-btn
            variant="text"
            @click="goBack"
            :disabled="!canGoBack"
          >
            <v-icon icon="mdi-arrow-left" class="me-1" />
            Go Back
          </v-icon>
          </v-btn>
          
          <v-spacer />
          
          <v-btn
            variant="text"
            @click="toggleDetails"
            size="small"
          >
            {{ showDetails ? 'Hide' : 'Show' }} Details
          </v-btn>
          
          <v-btn
            variant="text"
            @click="reportError"
            size="small"
          >
            <v-icon icon="mdi-bug" class="me-1" />
            Report
          </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
    
    <!-- Normal content -->
    <div v-else>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ErrorInfo } from '~/composables/ui/useErrorHandler'

interface Props {
  fallback?: (error: ErrorInfo) => any
  onError?: (error: ErrorInfo) => void
  retryable?: boolean
  showDetails?: boolean
}

interface Emits {
  (e: 'error', error: ErrorInfo): void
  (e: 'retry'): void
  (e: 'recovered'): void
}

const props = withDefaults(defineProps<Props>(), {
  retryable: true,
  showDetails: false
})

const emit = defineEmits<Emits>()

// Error state
const error = ref<ErrorInfo | null>(null)
const isRetrying = ref(false)
const showDetails = ref(props.showDetails)

// Router for navigation
const router = useRouter()
const route = useRoute()

// Check if we can go back
const canGoBack = computed(() => {
  return window.history.length > 1
})

// Error display properties
const errorTitle = computed(() => {
  if (!error.value) return ''
  
  switch (error.value.type) {
    case 'auth': return 'Authentication Error'
    case 'validation': return 'Validation Error'
    case 'network': return 'Network Error'
    case 'permission': return 'Permission Denied'
    case 'api': return 'Server Error'
    default: return 'Unexpected Error'
  }
})

const errorIcon = computed(() => {
  if (!error.value) return 'mdi-alert'
  
  switch (error.value.type) {
    case 'auth': return 'mdi-shield-alert'
    case 'validation': return 'mdi-alert-circle'
    case 'network': return 'mdi-wifi-off'
    case 'permission': return 'mdi-shield-lock'
    case 'api': return 'mdi-server-off'
    default: return 'mdi-alert'
  }
})

const errorDetails = computed(() => {
  if (!error.value) return ''
  
  return JSON.stringify({
    message: error.value.message,
    type: error.value.type,
    code: error.value.code,
    timestamp: new Date(error.value.timestamp).toISOString(),
    route: route.fullPath,
    userAgent: navigator.userAgent
  }, null, 2)
})

// Error handling methods
const handleError = (err: any) => {
  const errorInfo: ErrorInfo = {
    message: err.message || 'An unexpected error occurred',
    code: err.code || err.status,
    type: categorizeError(err),
    details: err,
    timestamp: Date.now(),
    userFriendly: true
  }
  
  error.value = errorInfo
  emit('error', errorInfo)
  
  // Call onError callback if provided
  if (props.onError) {
    props.onError(errorInfo)
  }
  
  // Log error for debugging
  console.error('ErrorBoundary caught error:', errorInfo)
}

const categorizeError = (err: any): ErrorInfo['type'] => {
  if (err.code === 401 || err.code === 403) return 'auth'
  if (err.code === 422) return 'validation'
  if (err.code >= 500) return 'api'
  if (err.name === 'NetworkError' || err.message?.includes('network')) return 'network'
  if (err.code === 403) return 'permission'
  return 'unknown'
}

// Recovery methods
const retry = async () => {
  if (!props.retryable || isRetrying.value) return
  
  isRetrying.value = true
  
  try {
    // Clear the error
    error.value = null
    
    // Emit retry event
    emit('retry')
    
    // Wait a bit to show loading state
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Emit recovered event
    emit('recovered')
  } catch (err) {
    // If retry fails, show the error again
    handleError(err)
  } finally {
    isRetrying.value = false
  }
}

const goBack = () => {
  if (canGoBack.value) {
    router.back()
  }
}

const toggleDetails = () => {
  showDetails.value = !showDetails.value
}

const reportError = () => {
  if (!error.value) return
  
  // In a real application, this would send the error to a reporting service
  console.log('Error reported:', {
    error: error.value,
    route: route.fullPath,
    timestamp: new Date().toISOString()
  })
  
  // Show a notification that the error was reported
  // This would use the notification system from Phase 2
  console.log('Error reported successfully')
}

// Expose methods for parent components
defineExpose({
  handleError,
  retry,
  clearError: () => { error.value = null }
})
</script>

<style scoped>
.error-boundary {
  padding: 1rem;
}

.error-card {
  max-width: 600px;
  margin: 0 auto;
}

.error-message {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 0;
}

.error-details {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
  background: rgba(0, 0, 0, 0.05);
  padding: 0.75rem;
  border-radius: 4px;
  margin: 0;
}
</style> 