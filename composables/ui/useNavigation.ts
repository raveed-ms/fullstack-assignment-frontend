import { ref, computed, readonly } from 'vue'

export interface NavigationItem {
  label: string
  icon: string
  route: string
  requiresAuth?: boolean
  roles?: string[]
}

export function useNavigation() {
  const isMobileMenuOpen = ref(false)
  const currentRoute = ref('')

  // Navigation items configuration
  const navigationItems = computed((): NavigationItem[] => [
    {
      label: 'Dashboard',
      icon: 'mdi-view-dashboard',
      route: '/dashboard',
      requiresAuth: true
    },
    {
      label: 'All Users',
      icon: 'mdi-account-multiple',
      route: '/users',
      requiresAuth: true
    },
    {
      label: 'Game Users',
      icon: 'mdi-gamepad-variant',
      route: '/nakama',
      requiresAuth: true
    },
    {
      label: 'Profile',
      icon: 'mdi-account',
      route: '/profile',
      requiresAuth: true
    }
  ])

  // Auth navigation items
  const authNavigationItems = computed((): NavigationItem[] => [
    {
      label: 'Login',
      icon: 'mdi-login',
      route: '/login',
      requiresAuth: false
    },
    {
      label: 'Register',
      icon: 'mdi-account-plus',
      route: '/register',
      requiresAuth: false
    }
  ])

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
  }

  // Close mobile menu
  const closeMobileMenu = () => {
    isMobileMenuOpen.value = false
  }

  // Open mobile menu
  const openMobileMenu = () => {
    isMobileMenuOpen.value = true
  }

  // Check if item should be visible based on auth state
  const isItemVisible = (item: NavigationItem, isAuthenticated: boolean, userRole?: string): boolean => {
    if (item.requiresAuth && !isAuthenticated) return false
    if (!item.requiresAuth && isAuthenticated) return false
    if (item.roles && userRole && !item.roles.includes(userRole)) return false
    return true
  }

  // Get filtered navigation items
  const getFilteredNavigationItems = (isAuthenticated: boolean, userRole?: string): NavigationItem[] => {
    const items = isAuthenticated ? navigationItems.value : authNavigationItems.value
    return items.filter(item => isItemVisible(item, isAuthenticated, userRole))
  }

  // Check if current route is active
  const isRouteActive = (route: string): boolean => {
    return currentRoute.value === route
  }

  // Update current route
  const updateCurrentRoute = (route: string) => {
    currentRoute.value = route
  }

  return {
    // State
    isMobileMenuOpen: readonly(isMobileMenuOpen),
    currentRoute: readonly(currentRoute),

    // Computed
    navigationItems,
    authNavigationItems,

    // Methods
    toggleMobileMenu,
    closeMobileMenu,
    openMobileMenu,
    isItemVisible,
    getFilteredNavigationItems,
    isRouteActive,
    updateCurrentRoute
  }
} 