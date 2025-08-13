import { useApiStore, useUiStore } from '~/stores'

export interface LoadingState {
  id: string
  message?: string
  progress?: number
  startTime: number
  timeout?: number
}

export interface LoadingOptions {
  message?: string
  progress?: number
  timeout?: number
  showSpinner?: boolean
  showOverlay?: boolean
}

export function useLoadingState() {
  const { setLoading, withRequestTracking, isRequesting } = useApiStore()
  const { setLoadingOverlay } = useUiStore()
  
  const loadingStates = ref<Map<string, LoadingState>>(new Map())
  const globalLoading = ref(false)
  const defaultTimeout = 30000 // 30 seconds

  // Generate unique loading ID
  const generateLoadingId = (): string => {
    return `loading-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Start loading with optional message and progress
  const startLoading = (
    id?: string,
    options: LoadingOptions = {}
  ): string => {
    const loadingId = id || generateLoadingId()
    const {
      message,
      progress = 0,
      timeout = defaultTimeout,
      showSpinner = true,
      showOverlay = false
    } = options

    const loadingState: LoadingState = {
      id: loadingId,
      message,
      progress,
      startTime: Date.now(),
      timeout
    }

    loadingStates.value.set(loadingId, loadingState)
    globalLoading.value = true
    
    if (showOverlay) {
      setLoadingOverlay(true)
    }
    
    if (showSpinner) {
      setLoading(true)
    }

    // Set timeout if specified
    if (timeout > 0) {
      setTimeout(() => {
        if (loadingStates.value.has(loadingId)) {
          console.warn(`Loading timeout reached for: ${loadingId}`)
          stopLoading(loadingId)
        }
      }, timeout)
    }

    return loadingId
  }

  // Stop specific loading state
  const stopLoading = (id: string): void => {
    loadingStates.value.delete(id)
    
    // Update global loading state
    if (loadingStates.value.size === 0) {
      globalLoading.value = false
      setLoading(false)
      setLoadingOverlay(false)
    }
  }

  // Update loading progress
  const updateProgress = (id: string, progress: number): void => {
    const loadingState = loadingStates.value.get(id)
    if (loadingState) {
      loadingState.progress = Math.min(100, Math.max(0, progress))
    }
  }

  // Update loading message
  const updateMessage = (id: string, message: string): void => {
    const loadingState = loadingStates.value.get(id)
    if (loadingState) {
      loadingState.message = message
    }
  }

  // Stop all loading states
  const stopAllLoading = (): void => {
    loadingStates.value.clear()
    globalLoading.value = false
    setLoading(false)
    setLoadingOverlay(false)
  }

  // Check if specific loading state is active
  const isLoading = (id: string): boolean => {
    return loadingStates.value.has(id)
  }

  // Get loading state by ID
  const getLoadingState = (id: string): LoadingState | undefined => {
    return loadingStates.value.get(id)
  }

  // Get loading duration
  const getLoadingDuration = (id: string): number => {
    const loadingState = loadingStates.value.get(id)
    return loadingState ? Date.now() - loadingState.startTime : 0
  }

  // Wrapper for async operations with loading state
  const withLoading = async <T>(
    operation: () => Promise<T>,
    options: LoadingOptions & { id?: string } = {}
  ): Promise<T> => {
    const loadingId = startLoading(options.id, options)
    
    try {
      return await operation()
    } finally {
      stopLoading(loadingId)
    }
  }

  // Wrapper for async operations with progress tracking
  const withProgress = async <T>(
    operation: (updateProgress: (progress: number) => void) => Promise<T>,
    options: LoadingOptions & { id?: string } = {}
  ): Promise<T> => {
    const loadingId = startLoading(options.id, options)
    
    try {
      const updateProgressFn = (progress: number) => {
        updateProgress(loadingId, progress)
      }
      
      return await operation(updateProgressFn)
    } finally {
      stopLoading(loadingId)
    }
  }

  // Wrapper that integrates with API store request tracking
  const withApiLoading = async <T>(
    operation: () => Promise<T>,
    options: LoadingOptions & { id?: string } = {}
  ): Promise<T> => {
    return withRequestTracking(async () => {
      return withLoading(operation, options)
    })
  }

  // Computed properties
  const hasActiveLoading = computed(() => loadingStates.value.size > 0)
  const activeLoadingCount = computed(() => loadingStates.value.size)
  const isAnyLoading = computed(() => globalLoading.value || isRequesting)

  return {
    // State
    loadingStates: readonly(loadingStates),
    globalLoading: readonly(globalLoading),
    
    // Getters
    hasActiveLoading,
    activeLoadingCount,
    isAnyLoading,
    
    // Actions
    startLoading,
    stopLoading,
    updateProgress,
    updateMessage,
    stopAllLoading,
    isLoading,
    getLoadingState,
    getLoadingDuration,
    
    // Wrappers
    withLoading,
    withProgress,
    withApiLoading
  }
} 