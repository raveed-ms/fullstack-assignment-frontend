import { defineStore } from 'pinia'

interface CacheEntry {
  data: any
  timestamp: number
  ttl: number
  key: string
}

interface CacheStats {
  hits: number
  misses: number
  size: number
  keys: string[]
}

export const useCacheStore = defineStore('cache', () => {
  // State
  const cache = ref<Map<string, CacheEntry>>(new Map())
  const stats = ref<CacheStats>({
    hits: 0,
    misses: 0,
    size: 0,
    keys: []
  })

  // Getters
  const cacheSize = computed(() => cache.value.size)
  const cacheKeys = computed(() => Array.from(cache.value.keys()))
  const cacheStats = computed(() => ({
    ...stats.value,
    size: cache.value.size,
    keys: Array.from(cache.value.keys()),
    hitRate: stats.value.hits + stats.value.misses > 0 
      ? (stats.value.hits / (stats.value.hits + stats.value.misses)) * 100 
      : 0
  }))

  // Actions
  const get = (key: string) => {
    const entry = cache.value.get(key)
    
    if (entry && Date.now() - entry.timestamp < entry.ttl) {
      // Cache hit
      stats.value.hits++
      return entry.data
    }
    
    // Cache miss or expired
    if (entry) {
      // Remove expired entry
      cache.value.delete(key)
      stats.value.size = cache.value.size
    }
    
    stats.value.misses++
    return null
  }

  const set = (key: string, data: any, ttl: number = 5 * 60 * 1000) => {
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      ttl,
      key
    }
    
    cache.value.set(key, entry)
    stats.value.size = cache.value.size
  }

  const has = (key: string) => {
    const entry = cache.value.get(key)
    return entry && Date.now() - entry.timestamp < entry.ttl
  }

  const remove = (key: string) => {
    const deleted = cache.value.delete(key)
    if (deleted) {
      stats.value.size = cache.value.size
    }
    return deleted
  }

  const clear = () => {
    cache.value.clear()
    stats.value.size = 0
  }

  const clearExpired = () => {
    const now = Date.now()
    let clearedCount = 0
    
    for (const [key, entry] of cache.value.entries()) {
      if (now - entry.timestamp >= entry.ttl) {
        cache.value.delete(key)
        clearedCount++
      }
    }
    
    stats.value.size = cache.value.size
    return clearedCount
  }

  const getCacheInfo = (key: string) => {
    const entry = cache.value.get(key)
    if (!entry) return null
    
    const now = Date.now()
    const age = now - entry.timestamp
    const isExpired = age >= entry.ttl
    const timeToExpiry = Math.max(0, entry.ttl - age)
    
    return {
      key: entry.key,
      age,
      ttl: entry.ttl,
      isExpired,
      timeToExpiry,
      dataSize: JSON.stringify(entry.data).length
    }
  }

  const setWithCustomKey = (customKey: string, data: any, ttl: number = 5 * 60 * 1000) => {
    set(customKey, data, ttl)
  }

  const generateKey = (prefix: string, params: Record<string, any>) => {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|')
    
    return `${prefix}:${sortedParams}`
  }

  const getOrSet = async <T>(
    key: string, 
    fetcher: () => Promise<T>, 
    ttl: number = 5 * 60 * 1000
  ): Promise<T> => {
    const cached = get(key)
    if (cached !== null) {
      return cached as T
    }
    
    const data = await fetcher()
    set(key, data, ttl)
    return data
  }

  const resetStats = () => {
    stats.value = {
      hits: 0,
      misses: 0,
      size: cache.value.size,
      keys: Array.from(cache.value.keys())
    }
  }

  return {
    // State
    cache,
    stats,
    
    // Getters
    cacheSize,
    cacheKeys,
    cacheStats,
    
    // Actions
    get,
    set,
    has,
    remove,
    clear,
    clearExpired,
    getCacheInfo,
    setWithCustomKey,
    generateKey,
    getOrSet,
    resetStats
  }
}) 