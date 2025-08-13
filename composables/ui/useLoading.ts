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
}

export function useLoading() {
  const { setLoading, withRequestTracking } = useApiStore()
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
      showSpinner = true
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
    setLoading(true)
    setLoadingOverlay(true)

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

  // Get all active loading states
  const getAllLoadingStates = computed(() => {
    return Array.from(loadingStates.value.values())
  })

  // Get loading count
  const loadingCount = computed(() => loadingStates.value.size)

  // Check if any loading is active
  const hasActiveLoading = computed(() => loadingStates.value.size > 0)

  // Get loading duration for a specific loading state
  const getLoadingDuration = (id: string): number => {
    const loadingState = loadingStates.value.get(id)
    if (loadingState) {
      return Date.now() - loadingState.startTime
    }
    return 0
  }

  // Wrapper function for async operations with loading
  const withLoading = async <T>(
    operation: () => Promise<T>,
    options: LoadingOptions & { id?: string } = {}
  ): Promise<T> => {
    const loadingId = startLoading(options.id, options)
    
    try {
      const result = await operation()
      return result
    } finally {
      stopLoading(loadingId)
    }
  }

  // Wrapper function for async operations with progress updates
  const withProgress = async <T>(
    operation: (updateProgress: (progress: number) => void) => Promise<T>,
    options: LoadingOptions & { id?: string } = {}
  ): Promise<T> => {
    const loadingId = startLoading(options.id, options)
    
    try {
      const updateProgressFn = (progress: number) => {
        updateProgress(loadingId, progress)
      }
      
      const result = await operation(updateProgressFn)
      return result
    } finally {
      stopLoading(loadingId)
    }
  }

  // Get loading states by type (useful for UI components)
  const getLoadingStatesWithProgress = computed(() => {
    return getAllLoadingStates.value.filter(state => state.progress !== undefined)
  })

  const getLoadingStatesWithMessage = computed(() => {
    return getAllLoadingStates.value.filter(state => state.message)
  })

  // Get average progress across all loading states
  const averageProgress = computed(() => {
    const states = getAllLoadingStates.value
    if (states.length === 0) return 0
    
    const totalProgress = states.reduce((sum, state) => sum + (state.progress || 0), 0)
    return Math.round(totalProgress / states.length)
  })

  return {
    // State
    globalLoading: readonly(globalLoading),
    loadingStates: readonly(loadingStates),
    
    // Computed
    hasActiveLoading,
    loadingCount,
    getAllLoadingStates,
    getLoadingStatesWithProgress,
    getLoadingStatesWithMessage,
    averageProgress,
    
    // Methods
    startLoading,
    stopLoading,
    updateProgress,
    updateMessage,
    stopAllLoading,
    isLoading,
    getLoadingState,
    getLoadingDuration,
    withLoading,
    withProgress
  }
} 