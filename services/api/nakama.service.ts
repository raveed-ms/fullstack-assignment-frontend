import type { FlattenedNakamaUser, NakamaUsersResponse } from '~/types'
import { ApiClient } from './client'

export interface NakamaQueryParams {
  limit?: number
  skip?: number
  sort?: string
  search?: string
  // Direct database columns
  username?: string
  email?: string
  lang_tag?: string
  location?: string
  
  // Metadata filters
  chatRole?: number
  chatBanned?: boolean
  isBotUser?: boolean
  isPayingUser?: boolean
  
  // Stats filters
  statsGIR?: number
  statsWinRatio?: number
  statsLongestDrive?: number
  statsLongestPutt?: number
  statsLongestChip?: number
  statsHoleInOneCount?: number
  statsTotalAttempted?: number
  
  // Badge filters
  statsSpeedKing?: number
  statsPuttMaster?: number
  statsPerfectRound?: number
  statsSharpShooter?: number
  statsRecoveryMaster?: number
  
  // Earnings filters
  earningsRanking?: number
  earningsCashEarned?: number
  earningsCoinsEarned?: number
  
  // Career filters
  careerXP?: number
  careerLevel?: number
  careerLeague?: number
  
  // Avatar filters
  avatarType?: number
  avatarIndex?: number
  
  // Wallet filters
  walletCoins?: number
  walletBonusCash?: number
  
  // Date range filters
  createTimeFrom?: string
  createTimeTo?: string
  updateTimeFrom?: string
  updateTimeTo?: string
  
  // Index signature for additional properties
  [key: string]: any
}

export class NakamaService {
  private client: ApiClient

  constructor(client: ApiClient) {
    this.client = client
  }

  setToken(token: string | null) {
    this.client.setToken(token)
  }

  async getAllUsers(params?: NakamaQueryParams): Promise<NakamaUsersResponse> {
    return this.client.get<NakamaUsersResponse>('/api/users', params)
  }

  async getUserById(id: string): Promise<FlattenedNakamaUser> {
    const response = await this.client.get<{ success: boolean; data: FlattenedNakamaUser }>(`/api/users/${id}`)
    if (!response.success) {
      throw new Error('Failed to fetch user')
    }
    return response.data
  }

  async updateUser(id: string, updates: Partial<FlattenedNakamaUser>): Promise<FlattenedNakamaUser> {
    const response = await this.client.put<{ success: boolean; data: FlattenedNakamaUser }>(`/api/users/${id}`, updates)
    if (!response.success) {
      throw new Error('Failed to update user')
    }
    return response.data
  }

  async searchUsers(params: NakamaQueryParams): Promise<NakamaUsersResponse> {
    return this.client.get<NakamaUsersResponse>('/api/users', params)
  }

  async getUsersWithPagination(page: number, limit: number, params?: NakamaQueryParams): Promise<NakamaUsersResponse> {
    const queryParams: NakamaQueryParams = {
      limit,
      skip: (page - 1) * limit,
      ...params
    }
    return this.client.get<NakamaUsersResponse>('/api/users', queryParams)
  }

  async getUsersWithSort(sortBy: string, sortOrder: 'asc' | 'desc', params?: NakamaQueryParams): Promise<NakamaUsersResponse> {
    const sortParam = JSON.stringify({ [sortBy]: sortOrder })
    const queryParams: NakamaQueryParams = {
      sort: encodeURIComponent(sortParam),
      ...params
    }
    return this.client.get<NakamaUsersResponse>('/api/users', queryParams)
  }

  async getUsersWithFilters(filters: NakamaQueryParams): Promise<NakamaUsersResponse> {
    return this.client.get<NakamaUsersResponse>('/api/users', filters)
  }
} 