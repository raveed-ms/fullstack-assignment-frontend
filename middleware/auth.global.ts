export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  
  // Initialize auth state if not already done and we're on client side
  if (typeof window !== 'undefined' && authStore.isInitializing) {
    await authStore.initializeAuth()
  }
  
  // Define protected routes
  const protectedRoutes = ['/dashboard', '/profile', '/admin', '/users']
  const authRoutes = ['/login', '/register']
  
  const isProtectedRoute = protectedRoutes.some(route => to.path.startsWith(route))
  const isAuthRoute = authRoutes.some(route => to.path.startsWith(route))
  
  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !authStore.isAuthenticated) {
    return navigateTo('/login')
  }
  
  // Redirect to dashboard if accessing auth routes while authenticated
  if (isAuthRoute && authStore.isAuthenticated) {
    return navigateTo('/dashboard')
  }
  
  // Role-based route protection
  if (to.path.startsWith('/admin') && !authStore.isAdmin) {
    return navigateTo('/dashboard')
  }
  
  if (to.path.startsWith('/mod') && !authStore.isModerator) {
    return navigateTo('/dashboard')
  }
}) 