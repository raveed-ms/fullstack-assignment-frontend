import { defineStore } from 'pinia'
import type { ApiError } from '~/types'

interface CacheEntry {
  data: any
  timestamp: number
  ttl: number
}

interface StoreApiError extends ApiError {
  id: string
  timestamp: string
}

export const useApiStore = defineStore('api', () => {
  // State
  const loading = ref(false)
  const errors = ref<StoreApiError[]>([])
  const cache = ref<Map<string, CacheEntry>>(new Map())
  const requestCount = ref(0)

  // Getters
  const isLoading = computed(() => loading.value)
  const hasErrors = computed(() => errors.value.length > 0)
  const currentErrors = computed(() => errors.value)
  const isRequesting = computed(() => requestCount.value > 0)

  // Actions
  const setLoading = (isLoading: boolean) => {
    loading.value = isLoading
  }

  const addError = (error: ApiError) => {
    // Remove duplicate errors
    const existingIndex = errors.value.findIndex(e => 
      e.message === error.message && e.code === error.code
    )
    
    if (existingIndex === -1) {
      const storeError: StoreApiError = {
        ...error,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      }
      errors.value.push(storeError)
    }
  }

  const clearErrors = () => {
    errors.value = []
  }

  const removeError = (errorId: string) => {
    errors.value = errors.value.filter(e => e.id !== errorId)
  }

  const clearCache = () => {
    cache.value.clear()
  }

  const getCachedData = (key: string) => {
    const entry = cache.value.get(key)
    if (entry && Date.now() - entry.timestamp < entry.ttl) {
      return entry.data
    }
    return null
  }

  const setCachedData = (key: string, data: any, ttl: number = 5 * 60 * 1000) => {
    cache.value.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  const incrementRequestCount = () => {
    requestCount.value++
  }

  const decrementRequestCount = () => {
    requestCount.value = Math.max(0, requestCount.value - 1)
  }

  const withRequestTracking = async <T>(fn: () => Promise<T>): Promise<T> => {
    incrementRequestCount()
    try {
      return await fn()
    } finally {
      decrementRequestCount()
    }
  }

  return {
    // State
    loading,
    errors,
    cache,
    requestCount,
    
    // Getters
    isLoading,
    hasErrors,
    currentErrors,
    isRequesting,
    
    // Actions
    setLoading,
    addError,
    clearErrors,
    removeError,
    clearCache,
    getCachedData,
    setCachedData,
    withRequestTracking
  }
}) 