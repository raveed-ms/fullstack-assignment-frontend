/**
 * Global authentication middleware
 * Checks if the user is authenticated for routes that require login
 */
export default defineNuxtRouteMiddleware((to) => {
  // Skip middleware if route doesn't require auth
  if (!to.meta.requiresAuth) {
    return;
  }

  const userStore = useUserStore();
  
  // If user is not authenticated, redirect to login
  if (!userStore.isAuthenticated) {
    // Save the original route to redirect back after login
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  }
});
