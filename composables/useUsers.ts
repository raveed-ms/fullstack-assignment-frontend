import type { User } from '~/types'
import { useAuth } from './useAuth'
import { useUsersApi } from './api/useUsersApi'
import { useErrorHandler } from './ui/useErrorHandler'
import { useNotifications } from './ui/useNotifications'
import { useLoading } from './ui/useLoading'

export function useUsers() {
  const { token } = useAuth()
  const usersApi = useUsersApi()
  const { handleApiError, clearError } = useErrorHandler()
  const { showSuccess, showError, showWarning } = useNotifications()
  const { withLoading } = useLoading()
  const { withRequestTracking } = useApiStore()
  const { getOrSet, generateKey } = useCacheStore()

  // State
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Search and filter state
  const searchTerm = ref('')
  const searchField = ref<'name' | 'email' | 'id'>('name')
  const sortBy = ref('name')
  const sortOrder = ref<'asc' | 'desc'>('asc')

  // Pagination state (for future implementation)
  const currentPage = ref(1)
  const itemsPerPage = ref(25)
  const totalUsers = ref(0)

  // Load all users
  const loadUsers = async (): Promise<User[]> => {
    const cacheKey = generateKey('users', { action: 'getAll' })
    
    return withRequestTracking(async () => {
      return getOrSet(cacheKey, async () => {
        return withLoading(async () => {
          try {
            clearError() // Clear any previous errors
            
            // Set token before making request
            usersApi.setToken(token)
            
            const response = await usersApi.getAllUsers()
            
            users.value = response
            totalUsers.value = response.length
            
            // Show success notification if users were loaded
            if (response.length > 0) {
              showSuccess(`Loaded ${response.length} users successfully`)
            }
            
            return response
          } catch (err: any) {
            console.error('Failed to load users:', err)
            const errorInfo = handleApiError(err)
            
            // Show error notification
            showError(errorInfo.message)
            
            error.value = errorInfo.message
            throw err
          }
        }, { message: 'Loading users...' })
      }, 2 * 60 * 1000) // Cache for 2 minutes
    })
  }

  // Get a single user by ID
  const getUser = async (id: number): Promise<User> => {
    const cacheKey = generateKey('user', { id })
    
    return withRequestTracking(async () => {
      return getOrSet(cacheKey, async () => {
        return withLoading(async () => {
          try {
            clearError() // Clear any previous errors
            
            // Set token before making request
            usersApi.setToken(token)
            
            const response = await usersApi.getUserById(id)
            
            currentUser.value = response
            return response
          } catch (err: any) {
            console.error('Failed to get user:', err)
            const errorInfo = handleApiError(err)
            
            // Show error notification
            showError(errorInfo.message)
            
            error.value = errorInfo.message
            throw err
          }
        }, { message: 'Loading user details...' })
      }, 5 * 60 * 1000) // Cache for 5 minutes
    })
  }

  // Update a user
  const updateUser = async (id: number, updates: Partial<User>): Promise<User> => {
    return withLoading(async () => {
      try {
        clearError() // Clear any previous errors
        
        // Set token before making request
        usersApi.setToken(token)
        
        const response = await usersApi.updateUser(id, updates)
        
        // Update the user in the list if it exists
        const userIndex = users.value.findIndex(u => u.id === id)
        if (userIndex !== -1) {
          users.value[userIndex] = response
        }
        
        // Update current user if it's the same user
        if (currentUser.value?.id === id) {
          currentUser.value = response
        }
        
        // Show success notification
        showSuccess('User updated successfully')
        
        return response
      } catch (err: any) {
        console.error('Failed to update user:', err)
        const errorInfo = handleApiError(err)
        
        // Show error notification
        showError(errorInfo.message)
        
        error.value = errorInfo.message
        throw err
      }
    }, { message: 'Updating user...' })
  }

  // Delete a user
  const deleteUser = async (id: number): Promise<void> => {
    return withLoading(async () => {
      try {
        clearError() // Clear any previous errors
        
        // Set token before making request
        usersApi.setToken(token)
        
        await usersApi.deleteUser(id)
        
        // Remove user from the list
        users.value = users.value.filter(u => u.id !== id)
        totalUsers.value = users.value.length
        
        // Clear current user if it's the same user
        if (currentUser.value?.id === id) {
          currentUser.value = null
        }
        
        // Show success notification
        showSuccess('User deleted successfully')
      } catch (err: any) {
        console.error('Failed to delete user:', err)
        const errorInfo = handleApiError(err)
        
        // Show error notification
        showError(errorInfo.message)
        
        error.value = errorInfo.message
        throw err
      }
    }, { message: 'Deleting user...' })
  }

  // Toggle user blacklist status
  const toggleBlacklist = async (id: number): Promise<User> => {
    return withLoading(async () => {
      try {
        const user = users.value.find(u => u.id === id) || currentUser.value
        if (!user) {
          throw new Error('User not found')
        }
        
        // Set token before making request
        usersApi.setToken(token)
        
        const response = await usersApi.toggleBlacklist(id, !user.blacklisted)
        
        // Show success notification
        const action = user.blacklisted ? 'removed from' : 'added to'
        showSuccess(`User ${action} blacklist successfully`)
        
        return response
      } catch (err: any) {
        console.error('Failed to toggle blacklist:', err)
        const errorInfo = handleApiError(err)
        
        // Show error notification
        showError(errorInfo.message)
        
        throw err
      }
    }, { message: 'Updating blacklist status...' })
  }

  // Search users (client-side for now)
  const searchUsers = (term: string, field: string = 'name'): User[] => {
    if (!term.trim()) return users.value
    
    const searchTermLower = term.toLowerCase()
    return users.value.filter(user => {
      switch (field) {
        case 'name':
          return user.name.toLowerCase().includes(searchTermLower)
        case 'email':
          return user.email.toLowerCase().includes(searchTermLower)
        case 'id':
          return user.id.toString().includes(searchTermLower)
        default:
          return user.name.toLowerCase().includes(searchTermLower) ||
                 user.email.toLowerCase().includes(searchTermLower) ||
                 user.id.toString().includes(searchTermLower)
      }
    })
  }

  // Sort users (client-side for now)
  const sortUsers = (field: string, order: 'asc' | 'desc'): User[] => {
    return [...users.value].sort((a, b) => {
      let aValue: any = a[field as keyof User]
      let bValue: any = b[field as keyof User]
      
      // Handle different data types
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }
      
      if (aValue < bValue) return order === 'asc' ? -1 : 1
      if (aValue > bValue) return order === 'asc' ? 1 : -1
      return 0
    })
  }

  // Helper function to get role color
  const getRoleColor = (role: string): string => {
    switch (role) {
      case 'admin': return 'red'
      case 'mod': return 'orange'
      case 'user': return 'blue'
      default: return 'grey'
    }
  }

  // Helper function to get role icon
  const getRoleIcon = (role: string): string => {
    switch (role) {
      case 'admin': return 'mdi-shield-crown'
      case 'mod': return 'mdi-shield-account'
      case 'user': return 'mdi-account'
      default: return 'mdi-account-question'
    }
  }

  // Helper function to format date
  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString()
  }

  // Helper function to format date and time
  const formatDateTime = (date: string): string => {
    return new Date(date).toLocaleString()
  }

  // Clear error
  const clearUserError = () => {
    error.value = null
    clearError()
  }

  return {
    // State
    users,
    currentUser,
    isLoading,
    error,
    searchTerm,
    searchField,
    sortBy,
    sortOrder,
    currentPage,
    itemsPerPage,
    totalUsers,
    
    // Functions
    loadUsers,
    getUser,
    updateUser,
    deleteUser,
    toggleBlacklist,
    searchUsers,
    sortUsers,
    getRoleColor,
    getRoleIcon,
    formatDate,
    formatDateTime,
    clearError: clearUserError
  }
} 