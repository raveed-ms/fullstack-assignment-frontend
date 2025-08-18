/**
 * Moderator role middleware
 * Checks if the user has mod or admin role
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
  
  // Second check: Does the user have the moderator or admin role?
  if (!userStore.isModerator) {
    return navigateTo({
      path: '/access-denied',
      query: { reason: 'moderator-required' }
    });
  }
});
