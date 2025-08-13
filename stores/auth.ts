import { defineStore } from 'pinia'
import type { AuthResponse, User } from '~/types'

interface AuthState {
  // Authentication state
  isAuthenticated: boolean
  token: string | null
  user: User | null
  
  // Loading states
  isLoading: boolean
  isInitializing: boolean
}

// Helper function to safely access localStorage
const getLocalStorage = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error('Error accessing localStorage:', error)
      return null
    }
  }
  return null
}

const setLocalStorage = (key: string, value: string): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.error('Error setting localStorage:', error)
    }
  }
}

const removeLocalStorage = (key: string): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing localStorage:', error)
    }
  }
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: false,
    token: null,
    user: null,
    isLoading: false,
    isInitializing: true
  }),

  getters: {
    // User role getters for easy access
    isAdmin: (state) => state.user?.role === 'admin',
    isModerator: (state) => state.user?.role === 'mod',
    isUser: (state) => state.user?.role === 'user',
    
    // Role-based permissions
    canManageUsers: (state) => ['admin', 'mod'].includes(state.user?.role || ''),
    canDeleteUsers: (state) => ['admin', 'mod'].includes(state.user?.role || ''),
    canPromoteUsers: (state) => state.user?.role === 'admin',
    canBlacklistUsers: (state) => ['admin', 'mod'].includes(state.user?.role || ''),
    
    // User info getters
    userName: (state) => state.user?.name || 'Unknown User',
    userEmail: (state) => state.user?.email || '',
    userId: (state) => state.user?.id || null,
    userRole: (state) => state.user?.role || 'guest',
    
    // Token getters
    hasValidToken: (state) => !!state.token,
    
    // Auth headers for API calls
    authHeaders: (state) => ({
      'Authorization': `Bearer ${state.token}`,
      'Content-Type': 'application/json'
    })
  },

  actions: {
    // Initialize auth state from localStorage
    async initializeAuth() {
      try {
        this.isInitializing = true
        
        // Check for stored token
        const storedToken = getLocalStorage('auth_token')
        const storedUser = getLocalStorage('auth_user')
        
        if (storedToken && storedUser) {
          this.token = storedToken
          this.user = JSON.parse(storedUser)
          this.isAuthenticated = true
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        this.clearAuth()
      } finally {
        this.isInitializing = false
      }
    },

    // Set authentication data after successful login
    setAuth(authResponse: AuthResponse) {
      this.token = authResponse.accessToken
      this.user = authResponse.user
      this.isAuthenticated = true
      
      // Persist to localStorage
      setLocalStorage('auth_token', authResponse.accessToken)
      setLocalStorage('auth_user', JSON.stringify(authResponse.user))
    },

    // Clear authentication data (logout)
    clearAuth() {
      this.token = null
      this.user = null
      this.isAuthenticated = false
      
      // Clear localStorage
      removeLocalStorage('auth_token')
      removeLocalStorage('auth_user')
    },

    // Update user data (for profile updates, etc.)
    updateUser(userData: Partial<User>) {
      if (this.user) {
        this.user = { ...this.user, ...userData }
        setLocalStorage('auth_user', JSON.stringify(this.user))
      }
    },

    // Check if user has specific permission
    hasPermission(permission: string): boolean {
      if (!this.user) return false
      
      const permissions = {
        'admin': ['manage_users', 'delete_users', 'promote_users', 'blacklist_users', 'view_all'],
        'mod': ['manage_users', 'delete_users', 'blacklist_users', 'view_users'],
        'user': ['view_own_profile', 'edit_own_profile']
      }
      
      return permissions[this.user.role as keyof typeof permissions]?.includes(permission) || false
    },

    // Check if user can perform action on target user
    canPerformAction(action: string, targetUser?: User): boolean {
      if (!this.user) return false
      
      // Self-actions are always allowed for basic operations
      if (targetUser && this.user.id === targetUser.id) {
        return ['view_own_profile', 'edit_own_profile'].includes(action)
      }
      
      // Role-based permissions
      switch (action) {
        case 'delete_user':
          return !!(this.canDeleteUsers && targetUser && targetUser.role !== 'admin')
        case 'promote_user':
          return !!(this.canPromoteUsers && targetUser && targetUser.role !== 'admin')
        case 'blacklist_user':
          return !!(this.canBlacklistUsers && targetUser && targetUser.role !== 'admin')
        case 'view_user':
          return !!this.canManageUsers
        default:
          return false
      }
    }
  }
}) 