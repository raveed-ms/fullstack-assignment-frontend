// Form types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface LoginRequest {
  strategy: 'local'
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

// User types
export interface User {
  id: number
  email: string
  name: string
  role: 'user' | 'mod' | 'admin'
  blacklisted: boolean
  created_at: string
  updated_at: string
}

// Nakama User types
export interface FlattenedNakamaUser {
  // Standard database fields
  id: string
  username: string
  display_name: string
  avatar_url: string
  lang_tag: string
  location: string
  timezone: string
  email: string
  password: string
  edge_count: number
  create_time: string
  update_time: string
  verify_time: string
  disable_time: string
  
  // Social/Platform IDs
  facebook_id: string
  google_id: string
  gamecenter_id: string
  steam_id: string
  custom_id: string
  facebook_instant_game_id: string
  apple_id: string
  
  // Wallet fields (from JSON)
  walletCoins: number
  walletBonusCash: number
  
  // Flattened metadata fields
  chatRole: number           // 0 = User, 1 = Mod, 2 = Admin
  chatBanned: boolean        // Chat ban status
  isBotUser: boolean         // Bot vs human users
  
  // Stats
  statsGIR: number           // Greens in Regulation
  statsWinRatio: number      // Win percentage
  statsLongestDrive: number  // Longest drive distance
  statsLongestPutt: number   // Longest putt distance
  statsLongestChip: number   // Longest chip distance
  statsHoleInOneCount: number // Number of hole-in-ones
  statsTotalAttempted: number // Total games played
  
  // Badges
  statsSpeedKing: number     // Speed King badge count
  statsPuttMaster: number    // Putt Master badge count
  statsPerfectRound: number  // Perfect Round badge count
  statsSharpShooter: number  // Sharp Shooter badge count
  statsRecoveryMaster: number // Recovery Master badge count
  
  // Earnings
  earningsRanking: number    // Player ranking
  earningsCashEarned: number // Total cash earned
  earningsCoinsEarned: number // Total coins earned
  isPayingUser: boolean      // Has made payments
  
  // Career
  careerXP: number           // Experience points
  careerLevel: number        // Player level
  careerLeague: number       // Current league
  
  // Avatar
  avatarType: number         // Avatar type
  avatarIndex: number        // Avatar selection
}

export interface NakamaUsersResponse {
  success: boolean
  data: {
    users: FlattenedNakamaUser[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

// API response types
export interface AuthResponse {
  accessToken: string
  authentication: {
    strategy: string
    payload: {
      iat: number
      exp: number
      sub: string
      jti: string
    }
  }
  user: User
}

export interface ApiError {
  message: string
  name?: string
  code?: number
  className?: string
  data?: any
  errors?: Record<string, any>
}

// Export user-specific types
export * from './users'
export * from './nakama'

// Validation types
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  fieldErrors: { [key: string]: string[] }
}

// Form state types
export interface FormState<T> {
  data: T
  errors: { [key: string]: string }
  isValid: boolean
  isLoading: boolean
  errorMessage: string
  successMessage: string
} 