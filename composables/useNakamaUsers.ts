import type { FlattenedNakamaUser, NakamaUsersResponse, ApiError } from '~/types'
import { useAuth } from './useAuth'
import { useNakamaApi } from './api/useNakamaApi'
import { useErrorHandler } from './ui/useErrorHandler'
import { useNotifications } from './ui/useNotifications'
import { useLoading } from './ui/useLoading'

export function useNakamaUsers() {
  const { token } = useAuth()
  const nakamaApi = useNakamaApi()
  const { handleApiError, clearError } = useErrorHandler()
  const { showSuccess, showError, showInfo } = useNotifications()
  const { withLoading } = useLoading()
  const { withRequestTracking } = useApiStore()
  const { getOrSet, generateKey } = useCacheStore()

  // Server-side pagination state
  const currentUsers = ref<FlattenedNakamaUser[]>([])
  const currentPage = ref(1)
  const itemsPerPage = ref(10)
  const totalUsers = ref(0)
  const isLoading = ref(false)

  // Search state
  const searchTerm = ref('')
  const searchField = ref<'username' | 'email' | 'id' | 'display_name'>('username')
  const sortBy = ref('username')
  const sortOrder = ref<'asc' | 'desc'>('asc')
  
  // Filter state
  const activeFilters = ref<Record<string, any>>({})

  // Load users with server-side pagination, search, and sorting
  const loadUsers = async (page: number = 1, limit: number = 10): Promise<{ users: FlattenedNakamaUser[], total: number }> => {
    const cacheKey = generateKey('nakama-users', { 
      page, 
      limit, 
      search: searchTerm.value, 
      sortBy: sortBy.value, 
      sortOrder: sortOrder.value,
      filters: JSON.stringify(activeFilters.value)
    })
    
    return withRequestTracking(async () => {
      return getOrSet(cacheKey, async () => {
        return withLoading(async () => {
          console.log('loadUsers called with:', { page, limit, searchTerm: searchTerm.value, sortBy: sortBy.value, sortOrder: sortOrder.value, filters: activeFilters.value })
          
          try {
            clearError() // Clear any previous errors
            
            // Set token before making request
            nakamaApi.setToken(token)
            
            // Build query parameters
            const params: any = {}
            
            // Handle "All" option (limit = -1)
            if (limit === -1) {
              // For "All" option, we need to fetch all users without pagination
              // We'll use a very large limit to get all users
              params.limit = 10000 // Large enough to get all users
              params.skip = 0
            } else {
              params.limit = limit
              params.skip = (page - 1) * limit
            }
            
            // Add search if provided
            if (searchTerm.value.trim()) {
              // For specific field search, we'll use the backend's prefix search
              params.search = searchTerm.value.trim()
            }
            
            // Add sorting if provided
            if (sortBy.value && sortOrder.value) {
              const sortParam = JSON.stringify({ [sortBy.value]: sortOrder.value })
              params.sort = encodeURIComponent(sortParam)
            }
            
            // Add filters if provided
            Object.entries(activeFilters.value).forEach(([key, value]) => {
              if (value !== null && value !== undefined && value !== '') {
                params[key] = value.toString()
              }
            })
            
            console.log('Making request with params:', params)
            
            const response = await nakamaApi.getAllUsers(params)
            
            console.log('Response received:', { 
              usersCount: response.data.users.length, 
              total: response.data.pagination.total,
              pagination: response.data.pagination 
            })
            
            return {
              users: response.data.users,
              total: response.data.pagination.total
            }
          } catch (error: any) {
            console.error('Failed to load users:', error)
            const errorInfo = handleApiError(error as ApiError)
            
            // Show error notification
            showError(errorInfo.message)
            
            throw error
          }
        }, { message: 'Loading users...' })
      }, 1 * 60 * 1000) // Cache for 1 minute (shorter cache for search/filter results)
    })
  }

  // Load initial users
  const loadInitialUsers = async (): Promise<void> => {
    console.log('loadInitialUsers called')
    try {
      const { users, total } = await loadUsers(1, itemsPerPage.value)
      console.log('loadInitialUsers result:', { usersCount: users.length, total })
      currentUsers.value = users
      totalUsers.value = total
      currentPage.value = 1
      
      // Show success notification
      if (users.length > 0) {
        showSuccess(`Loaded ${users.length} users successfully`)
      }
    } catch (error) {
      console.error('Failed to load initial users:', error)
      throw error
    }
  }

  // Load specific page
  const loadPage = async (page: number): Promise<void> => {
    console.log('loadPage called with page:', page)
    try {
      const { users, total } = await loadUsers(page, itemsPerPage.value)
      console.log('loadPage result:', { usersCount: users.length, total })
      currentUsers.value = users
      totalUsers.value = total
      currentPage.value = page
      
      // Show info notification for page changes
      showInfo(`Loaded page ${page} with ${users.length} users`)
    } catch (error) {
      console.error('Failed to load page:', error)
      throw error
    }
  }

  // Update items per page
  const updateItemsPerPage = async (newItemsPerPage: number): Promise<void> => {
    itemsPerPage.value = newItemsPerPage
    await loadPage(1) // Reset to first page when changing items per page
  }

  // Search users (server-side)
  const searchUsers = async (term: string, field: string = 'all'): Promise<void> => {
    searchTerm.value = term
    searchField.value = field as any
    await loadPage(1) // Reset to first page when searching
  }

  // Sort users (server-side)
  const sortUsers = async (field: string, order: 'asc' | 'desc'): Promise<void> => {
    sortBy.value = field
    sortOrder.value = order
    await loadPage(currentPage.value) // Keep current page when sorting
  }

  // Clear search
  const clearSearch = async (): Promise<void> => {
    searchTerm.value = ''
    searchField.value = 'username'
    await loadPage(1)
  }

  // Apply filters
  const applyFilters = async (filterParams: Record<string, any>): Promise<void> => {
    activeFilters.value = filterParams
    await loadPage(1) // Reset to first page when applying filters
  }

  // Clear all filters
  const clearFilters = async (): Promise<void> => {
    activeFilters.value = {}
    await loadPage(1)
  }

  // Get a single Nakama user by ID
  const getNakamaUser = async (id: string): Promise<FlattenedNakamaUser> => {
    return withLoading(async () => {
      try {
        clearError() // Clear any previous errors
        
        // Set token before making request
        nakamaApi.setToken(token)
        
        return await nakamaApi.getUserById(id)
      } catch (error: any) {
        console.error('Failed to get Nakama user:', error)
        const errorInfo = handleApiError(error as ApiError)
        
        // Show error notification
        showError(errorInfo.message)
        
        throw error
      }
    }, { message: 'Loading user details...' })
  }

  // Update a Nakama user
  const updateNakamaUser = async (id: string, updates: Partial<FlattenedNakamaUser>): Promise<FlattenedNakamaUser> => {
    return withLoading(async () => {
      try {
        clearError() // Clear any previous errors
        
        // Set token before making request
        nakamaApi.setToken(token)
        
        const response = await nakamaApi.updateUser(id, updates)
        
        // Show success notification
        showSuccess('User updated successfully')
        
        return response
      } catch (error: any) {
        console.error('Failed to update Nakama user:', error)
        const errorInfo = handleApiError(error as ApiError)
        
        // Show error notification
        showError(errorInfo.message)
        
        throw error
      }
    }, { message: 'Updating user...' })
  }

  // Helper function to get role color
  const getChatRoleColor = (role: number) => {
    if (role == null) return 'grey'
    switch (role) {
      case 0: return 'blue'    // User
      case 1: return 'orange'  // Mod
      case 2: return 'red'     // Admin
      default: return 'grey'
    }
  }

  // Helper function to get chat role label
  const getChatRoleLabel = (role: number) => {
    if (role == null) return 'Unknown'
    switch (role) {
      case 0: return 'User'
      case 1: return 'Mod'
      case 2: return 'Admin'
      default: return 'Unknown'
    }
  }

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    if (amount == null) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Helper function to format percentage
  const formatPercentage = (value: number) => {
    if (value == null) return 'N/A'
    return `${(value * 100).toFixed(1)}%`
  }

  // Computed properties
  const totalPages = computed(() => {
    // When showing all users, there's only 1 page
    if (itemsPerPage.value === -1) {
      return 1
    }
    return Math.ceil(totalUsers.value / itemsPerPage.value)
  })

  const hasNextPage = computed(() => {
    // When showing all users, there's no next page
    if (itemsPerPage.value === -1) {
      return false
    }
    return currentPage.value < totalPages.value
  })

  const hasPreviousPage = computed(() => {
    // When showing all users, there's no previous page
    if (itemsPerPage.value === -1) {
      return false
    }
    return currentPage.value > 1
  })

  return {
    // State
    currentUsers,
    currentPage,
    itemsPerPage,
    totalUsers,
    isLoading,
    searchTerm,
    searchField,
    sortBy,
    sortOrder,
    activeFilters,
    
    // Computed
    totalPages,
    hasNextPage,
    hasPreviousPage,
    
    // Functions
    loadInitialUsers,
    loadPage,
    updateItemsPerPage,
    searchUsers,
    sortUsers,
    clearSearch,
    applyFilters,
    clearFilters,
    getNakamaUser,
    updateNakamaUser,
    getChatRoleColor,
    getChatRoleLabel,
    formatCurrency,
    formatPercentage
  }
} 