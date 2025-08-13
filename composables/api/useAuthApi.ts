import type { LoginRequest, RegisterRequest, AuthResponse, User } from '~/types'
import { authService } from '~/services/api'

export function useAuthApi() {
  const setToken = (token: string | null) => {
    authService.setToken(token)
  }

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    return authService.login(credentials)
  }

  const register = async (userData: RegisterRequest): Promise<User> => {
    return authService.register(userData)
  }

  const getCurrentUser = async (): Promise<User> => {
    return authService.getCurrentUser()
  }

  const updateProfile = async (userId: number, updates: Partial<User>): Promise<User> => {
    return authService.updateProfile(userId, updates)
  }

  const changePassword = async (userId: number, passwordData: {
    currentPassword: string
    newPassword: string
  }): Promise<User> => {
    return authService.changePassword(userId, passwordData)
  }

  const deleteAccount = async (userId: number): Promise<void> => {
    return authService.deleteAccount(userId)
  }

  return {
    setToken,
    login,
    register,
    getCurrentUser,
    updateProfile,
    changePassword,
    deleteAccount
  }
} 