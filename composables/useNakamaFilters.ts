import type { NakamaFilters, NakamaFilterQuery } from '~/types/nakama'
import { NAKAMA_DEFAULT_FILTERS } from '~/constants/nakama'

export function useNakamaFilters() {
  // Filter state
  const filters = ref<NakamaFilters>({ ...NAKAMA_DEFAULT_FILTERS })

  // Check if any filters are active
  const hasActiveFilters = computed(() => {
    const f = filters.value
    return (
      f.location !== null ||
      f.chatRole !== null ||
      f.isBotUser !== false ||
      f.statsGIR[0] !== 0 || f.statsGIR[1] !== 100 ||
      f.statsWinRatio[0] !== 0 || f.statsWinRatio[1] !== 1 ||
      f.statsLongestDrive[0] !== 0 || f.statsLongestDrive[1] !== 500 ||
      f.statsHoleInOneCount[0] !== 0 || f.statsHoleInOneCount[1] !== 50 ||
      f.careerLevel[0] !== 1 || f.careerLevel[1] !== 100 ||
      f.careerXP[0] !== 0 || f.careerXP[1] !== 1000000 ||
      f.earningsCashEarned[0] !== 0 || f.earningsCashEarned[1] !== 100000 ||
      f.walletCoins[0] !== 0 || f.walletCoins[1] !== 100000 ||
      f.createTimeFrom !== null ||
      f.createTimeTo !== null ||
      f.updateTimeFrom !== null ||
      f.updateTimeTo !== null
    )
  })

  // Build filter query for API
  const buildFilterQuery = (): NakamaFilterQuery => {
    const f = filters.value
    const query: NakamaFilterQuery = {}
    
    // Basic info filters
    if (f.location) query.location = f.location
    if (f.chatRole !== null) query.chatRole = f.chatRole
    if (f.isBotUser) query.isBotUser = true
    
    // Range filters - only apply if not at default values
    if (f.statsGIR[0] !== 0 || f.statsGIR[1] !== 100) {
      query.statsGIR = `${f.statsGIR[0]}-${f.statsGIR[1]}`
    }
    if (f.statsWinRatio[0] !== 0 || f.statsWinRatio[1] !== 1) {
      query.statsWinRatio = `${f.statsWinRatio[0]}-${f.statsWinRatio[1]}`
    }
    if (f.statsLongestDrive[0] !== 0 || f.statsLongestDrive[1] !== 500) {
      query.statsLongestDrive = `${f.statsLongestDrive[0]}-${f.statsLongestDrive[1]}`
    }
    if (f.statsHoleInOneCount[0] !== 0 || f.statsHoleInOneCount[1] !== 50) {
      query.statsHoleInOneCount = `${f.statsHoleInOneCount[0]}-${f.statsHoleInOneCount[1]}`
    }
    if (f.careerLevel[0] !== 1 || f.careerLevel[1] !== 100) {
      query.careerLevel = `${f.careerLevel[0]}-${f.careerLevel[1]}`
    }
    if (f.careerXP[0] !== 0 || f.careerXP[1] !== 1000000) {
      query.careerXP = `${f.careerXP[0]}-${f.careerXP[1]}`
    }
    if (f.earningsCashEarned[0] !== 0 || f.earningsCashEarned[1] !== 100000) {
      query.earningsCashEarned = `${f.earningsCashEarned[0]}-${f.earningsCashEarned[1]}`
    }
    if (f.walletCoins[0] !== 0 || f.walletCoins[1] !== 100000) {
      query.walletCoins = `${f.walletCoins[0]}-${f.walletCoins[1]}`
    }
    
    // Date filters
    if (f.createTimeFrom) query.createTimeFrom = f.createTimeFrom
    if (f.createTimeTo) query.createTimeTo = f.createTimeTo
    if (f.updateTimeFrom) query.updateTimeFrom = f.updateTimeFrom
    if (f.updateTimeTo) query.updateTimeTo = f.updateTimeTo
    
    return query
  }

  // Clear all filters
  const clearFilters = () => {
    Object.assign(filters.value, NAKAMA_DEFAULT_FILTERS)
  }

  // Reset filters to default
  const resetFilters = () => {
    clearFilters()
  }

  // Update a specific filter
  const updateFilter = <K extends keyof NakamaFilters>(key: K, value: NakamaFilters[K]) => {
    filters.value[key] = value
  }

  // Get active filter count
  const getActiveFilterCount = computed(() => {
    let count = 0
    const f = filters.value
    
    if (f.location) count++
    if (f.chatRole !== null) count++
    if (f.isBotUser) count++
    if (f.statsGIR[0] !== 0 || f.statsGIR[1] !== 100) count++
    if (f.statsWinRatio[0] !== 0 || f.statsWinRatio[1] !== 1) count++
    if (f.statsLongestDrive[0] !== 0 || f.statsLongestDrive[1] !== 500) count++
    if (f.statsHoleInOneCount[0] !== 0 || f.statsHoleInOneCount[1] !== 50) count++
    if (f.careerLevel[0] !== 1 || f.careerLevel[1] !== 100) count++
    if (f.careerXP[0] !== 0 || f.careerXP[1] !== 1000000) count++
    if (f.earningsCashEarned[0] !== 0 || f.earningsCashEarned[1] !== 100000) count++
    if (f.walletCoins[0] !== 0 || f.walletCoins[1] !== 100000) count++
    if (f.createTimeFrom) count++
    if (f.createTimeTo) count++
    if (f.updateTimeFrom) count++
    if (f.updateTimeTo) count++
    
    return count
  })

  return {
    filters,
    hasActiveFilters,
    buildFilterQuery,
    clearFilters,
    resetFilters,
    updateFilter,
    getActiveFilterCount
  }
} 