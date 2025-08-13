import type { User } from '~/types'
import { ApiClient } from './client'

export interface UsersQueryParams {
  $limit?: number
  $skip?: number
  $sort?: Record<string, 'asc' | 'desc'>
  $select?: string[]
  search?: string
  role?: string
  blacklisted?: boolean
  [key: string]: string | number | boolean | Record<string, 'asc' | 'desc'> | string[] | undefined
}

export class UsersService {
  private client: ApiClient

  constructor(client: ApiClient) {
    this.client = client
  }

  setToken(token: string | null) {
    this.client.setToken(token)
  }

  async getAllUsers(params?: UsersQueryParams): Promise<User[]> {
    return this.client.get<User[]>('/users', params)
  }

  async getUserById(id: number): Promise<User> {
    return this.client.get<User>(`/users/${id}`)
  }

  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    return this.client.post<User>('/users', userData)
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    return this.client.patch<User>(`/users/${id}`, updates)
  }

  async deleteUser(id: number): Promise<void> {
    return this.client.delete<void>(`/users/${id}`)
  }

  async toggleBlacklist(id: number, blacklisted: boolean): Promise<User> {
    return this.client.patch<User>(`/users/${id}`, { blacklisted })
  }

  async changeUserRole(id: number, role: 'user' | 'mod' | 'admin'): Promise<User> {
    return this.client.patch<User>(`/users/${id}`, { role })
  }

  async searchUsers(query: string, field?: 'name' | 'email' | 'id'): Promise<User[]> {
    const params: UsersQueryParams = { search: query }
    return this.client.get<User[]>('/users', params)
  }
} 