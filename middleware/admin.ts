/**
 * Admin role middleware
 * Checks if the user has admin role
 */
export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();
  
  // First check: Is the user logged in at all?
  if (!userStore.isAuthenticated) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  }
  
  // Second check: Does the user have the admin role?
  if (!userStore.isAdmin) {
    return navigateTo({
      path: '/access-denied',
      query: { reason: 'admin-required' }
    });
  }
});
