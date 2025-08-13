import type { LoginRequest, RegisterRequest, AuthResponse, User } from '~/types'
import { ApiClient } from './client'

export class AuthService {
  private client: ApiClient

  constructor(client: ApiClient) {
    this.client = client
  }

  setToken(token: string | null) {
    this.client.setToken(token)
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.client.post<AuthResponse>('/authentication', credentials)
  }

  async register(userData: RegisterRequest): Promise<User> {
    return this.client.post<User>('/users', userData)
  }

  async getCurrentUser(): Promise<User> {
    return this.client.get<User>('/authentication')
  }

  async updateProfile(userId: number, updates: Partial<User>): Promise<User> {
    return this.client.patch<User>(`/users/${userId}`, updates)
  }

  async changePassword(userId: number, passwordData: {
    currentPassword: string
    newPassword: string
  }): Promise<User> {
    return this.client.patch<User>(`/users/${userId}`, passwordData)
  }

  async deleteAccount(userId: number): Promise<void> {
    return this.client.delete<void>(`/users/${userId}`)
  }
} 