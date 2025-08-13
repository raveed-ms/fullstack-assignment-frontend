import type { LoginRequest, RegisterRequest, AuthResponse, ApiError } from '~/types'
import { ERROR_MESSAGES } from '~/constants'
import { mapBackendError } from '~/utils/validation'
import { useAuthStore } from '~/stores'
import { useAuthApi } from './api/useAuthApi'
import { useErrorHandler } from './ui/useErrorHandler'
import { useNotifications } from './ui/useNotifications'

export function useAuth() {
  const authStore = useAuthStore()
  const authApi = useAuthApi()
  const { handleApiError, clearError } = useErrorHandler()
  const { showSuccess, showError } = useNotifications()
  const { withRequestTracking } = useApiStore()
  const { setLoadingOverlay } = useUiStore()

  // Extract error from Nuxt fetch response
  const extractError = (error: any): ApiError => {
    let actualError = error
    
    // Check if it's a Nuxt fetch error with response._data
    if (error.response && error.response._data) {
      actualError = error.response._data
    }
    
    // Check if it's a Nuxt fetch error with data
    if (error.data && !error.response) {
      actualError = error.data
    }
    
    return actualError
  }

  // Login function
  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    return withRequestTracking(async () => {
      try {
        authStore.isLoading = true
        setLoadingOverlay(true)
        clearError() // Clear any previous errors
        
        const response = await authApi.login(credentials)
        
        // Store authentication data in Pinia store
        authStore.setAuth(response)
        
        // Set token in API service
        authApi.setToken(response.accessToken)
        
        // Show success notification
        showSuccess('Login successful! Welcome back.')
        
        return response
      } catch (error) {
        console.error('Login failed:', error)
        const apiError = extractError(error)
        const errorInfo = handleApiError(apiError)
        
        // Show error notification
        showError(errorInfo.message)
        
        throw new Error(errorInfo.message)
      } finally {
        authStore.isLoading = false
        setLoadingOverlay(false)
      }
    })
  }

  // Register function
  const register = async (userData: RegisterRequest): Promise<any> => {
    return withRequestTracking(async () => {
      try {
        authStore.isLoading = true
        setLoadingOverlay(true)
        clearError() // Clear any previous errors
        
        const response = await authApi.register(userData)
        
        // Show success notification
        showSuccess('Registration successful! Please log in.')
        
        return response
      } catch (error) {
        console.error('Registration failed:', error)
        const apiError = extractError(error)
        const errorInfo = handleApiError(apiError)
        
        // Show error notification
        showError(errorInfo.message)
        
        throw new Error(errorInfo.message)
      } finally {
        authStore.isLoading = false
        setLoadingOverlay(false)
      }
    })
  }

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      // Clear authentication data from store
      authStore.clearAuth()
      
      // Clear token from API service
      authApi.setToken(null)
      
      // Clear any errors
      clearError()
      
      // Show success notification
      showSuccess('Logged out successfully')
    } catch (error) {
      console.error('Logout failed:', error)
      // Even if logout fails, clear local state
      authStore.clearAuth()
      authApi.setToken(null)
      clearError()
      
      // Show warning notification
      showError('Logout completed, but there was an issue with the server')
    }
  }

  // Check if user is authenticated
  const checkAuth = (): boolean => {
    return authStore.isAuthenticated && authStore.hasValidToken
  }

  // Get current user
  const getCurrentUser = () => {
    return authStore.user
  }

  // Get auth headers for API calls
  const getAuthHeaders = () => {
    return authStore.authHeaders
  }

  return {
    // Store state
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user,
    token: authStore.token,
    isLoading: authStore.isLoading,
    isInitializing: authStore.isInitializing,
    
    // Store getters
    isAdmin: authStore.isAdmin,
    isModerator: authStore.isModerator,
    isUser: authStore.isUser,
    canManageUsers: authStore.canManageUsers,
    canDeleteUsers: authStore.canDeleteUsers,
    canPromoteUsers: authStore.canPromoteUsers,
    canBlacklistUsers: authStore.canBlacklistUsers,
    userName: authStore.userName,
    userEmail: authStore.userEmail,
    userId: authStore.userId,
    userRole: authStore.userRole,
    hasValidToken: authStore.hasValidToken,
    authHeaders: authStore.authHeaders,
    
    // Methods
    login,
    register,
    logout,
    checkAuth,
    getCurrentUser,
    getAuthHeaders,
    
    // Store actions
    initializeAuth: authStore.initializeAuth,
    updateUser: authStore.updateUser,
    hasPermission: authStore.hasPermission,
    canPerformAction: authStore.canPerformAction
  }
} 