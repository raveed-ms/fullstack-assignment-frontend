import type { ApiError } from '~/types'

export interface ErrorInfo {
  message: string
  code?: number
  type: 'api' | 'validation' | 'network' | 'auth' | 'permission' | 'unknown'
  details?: any
  timestamp: number
  userFriendly: boolean
}

export interface ErrorHandlerOptions {
  showNotification?: boolean
  logToConsole?: boolean
  reportToAnalytics?: boolean
  retryable?: boolean
}

export function useErrorHandler() {
  const { addError, clearErrors } = useApiStore()
  const { showError: showErrorNotification } = useUiStore()
  
  const error = ref<ErrorInfo | null>(null)
  const isLoading = ref(false)

  // Categorize error types
  const categorizeError = (err: any): ErrorInfo['type'] => {
    if (err.code === 401 || err.code === 403) return 'auth'
    if (err.code === 422) return 'validation'
    if (err.code >= 500) return 'api'
    if (err.name === 'NetworkError' || err.message?.includes('network')) return 'network'
    if (err.code === 403) return 'permission'
    return 'unknown'
  }

  // Extract meaningful error message
  const extractErrorMessage = (err: any): string => {
    // Handle different error formats
    if (typeof err === 'string') return err
    
    if (err.message) {
      // Remove technical details from user-facing messages
      const message = err.message
      if (message.includes('fetch') || message.includes('network')) {
        return 'Network connection error. Please check your internet connection.'
      }
      if (message.includes('timeout')) {
        return 'Request timed out. Please try again.'
      }
      return message
    }
    
    if (err.data?.message) return err.data.message
    if (err.data?.error) return err.data.error
    
    return 'An unexpected error occurred. Please try again.'
  }

  // Check if error is retryable
  const isRetryableError = (err: any): boolean => {
    const type = categorizeError(err)
    const code = err.code || err.status
    
    // Network errors are usually retryable
    if (type === 'network') return true
    
    // 5xx server errors are retryable
    if (code >= 500 && code < 600) return true
    
    // Timeout errors are retryable
    if (err.message?.includes('timeout')) return true
    
    return false
  }

  // Main error handler function
  const handleError = (
    err: any, 
    options: ErrorHandlerOptions = {}
  ): ErrorInfo => {
    const {
      showNotification = true,
      logToConsole = true,
      reportToAnalytics = true,
      retryable = false
    } = options

    const errorInfo: ErrorInfo = {
      message: extractErrorMessage(err),
      code: err.code || err.status,
      type: categorizeError(err),
      details: err,
      timestamp: Date.now(),
      userFriendly: true
    }

    // Set the error state
    error.value = errorInfo
    
    // Add to API store
    addError({
      message: errorInfo.message,
      code: errorInfo.code,
      name: errorInfo.type
    })

    // Log to console if enabled
    if (logToConsole) {
      console.error('Error handled:', {
        message: errorInfo.message,
        type: errorInfo.type,
        code: errorInfo.code,
        details: errorInfo.details
      })
    }

    // Report to analytics if enabled
    if (reportToAnalytics) {
      // TODO: Integrate with analytics service
      console.log('Error reported to analytics:', errorInfo)
    }

    return errorInfo
  }

  // Handle API errors specifically
  const handleApiError = (apiError: ApiError, options?: ErrorHandlerOptions): ErrorInfo => {
    return handleError(apiError, {
      showNotification: true,
      logToConsole: true,
      reportToAnalytics: true,
      retryable: isRetryableError(apiError),
      ...options
    })
  }

  // Handle validation errors
  const handleValidationError = (validationError: any, options?: ErrorHandlerOptions): ErrorInfo => {
    return handleError(validationError, {
      showNotification: true,
      logToConsole: false, // Don't log validation errors to console
      reportToAnalytics: false, // Don't report validation errors
      retryable: false,
      ...options
    })
  }

  // Handle network errors
  const handleNetworkError = (networkError: any, options?: ErrorHandlerOptions): ErrorInfo => {
    return handleError(networkError, {
      showNotification: true,
      logToConsole: true,
      reportToAnalytics: true,
      retryable: true,
      ...options
    })
  }

  // Clear current error
  const clearError = () => {
    error.value = null
    clearErrors()
  }

  // Check if there's an active error
  const hasError = computed(() => error.value !== null)

  // Get error type for UI styling
  const getErrorType = computed(() => {
    if (!error.value) return 'info'
    
    switch (error.value.type) {
      case 'auth': return 'error'
      case 'validation': return 'warning'
      case 'network': return 'warning'
      case 'permission': return 'error'
      case 'api': return 'error'
      default: return 'error'
    }
  })

  // Get error icon for UI
  const getErrorIcon = computed(() => {
    if (!error.value) return 'mdi-information'
    
    switch (error.value.type) {
      case 'auth': return 'mdi-shield-alert'
      case 'validation': return 'mdi-alert-circle'
      case 'network': return 'mdi-wifi-off'
      case 'permission': return 'mdi-shield-lock'
      case 'api': return 'mdi-server-off'
      default: return 'mdi-alert'
    }
  })

  // Get error color for UI
  const getErrorColor = computed(() => {
    if (!error.value) return 'info'
    
    switch (error.value.type) {
      case 'auth': return 'error'
      case 'validation': return 'warning'
      case 'network': return 'warning'
      case 'permission': return 'error'
      case 'api': return 'error'
      default: return 'error'
    }
  })

  return {
    // State
    error: readonly(error),
    isLoading: readonly(isLoading),
    
    // Computed
    hasError,
    getErrorType,
    getErrorIcon,
    getErrorColor,
    
    // Methods
    handleError,
    handleApiError,
    handleValidationError,
    handleNetworkError,
    clearError,
    categorizeError,
    isRetryableError
  }
} 