// Nakama Filters Interface
export interface NakamaFilters {
  // Basic info
  location: string | null
  chatRole: number | null
  isBotUser: boolean
  
  // Game stats
  statsGIR: [number, number]
  statsWinRatio: [number, number]
  statsLongestDrive: [number, number]
  statsHoleInOneCount: [number, number]
  
  // Career & earnings
  careerLevel: [number, number]
  careerXP: [number, number]
  earningsCashEarned: [number, number]
  walletCoins: [number, number]
  
  // Date range
  createTimeFrom: string | null
  createTimeTo: string | null
  updateTimeFrom: string | null
  updateTimeTo: string | null
}

// Nakama Search State Interface
export interface NakamaSearchState {
  searchTerm: string
  searchField: string
  sortBy: string
  sortOrder: string
}

// Nakama Pagination State Interface
export interface NakamaPaginationState {
  currentPage: number
  itemsPerPage: number
  totalUsers: number
  totalPages: number
}

// Nakama Table Options Interface
export interface NakamaTableOptions {
  page: number
  itemsPerPage: number
  sortBy: string[]
  sortDesc: boolean[]
}

// Nakama Filter Query Interface
export interface NakamaFilterQuery {
  location?: string
  chatRole?: number
  isBotUser?: boolean
  statsGIR?: string
  statsWinRatio?: string
  statsLongestDrive?: string
  statsHoleInOneCount?: string
  careerLevel?: string
  careerXP?: string
  earningsCashEarned?: string
  walletCoins?: string
  createTimeFrom?: string
  createTimeTo?: string
  updateTimeFrom?: string
  updateTimeTo?: string
} 