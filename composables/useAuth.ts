import { useUserStore } from '~/stores/user';
import type { User } from '~/types/api';

/**
 * Authentication composable
 * This is now a wrapper around the user store for backward compatibility
 * Prefer using useUserStore() directly in new code
 */
export function useAuth() {
  const userStore = useUserStore();
  
  /**
   * Login with email and password
   * @deprecated Use userStore.login directly
   */
  async function login(email: string, password: string) {
    return userStore.login(email, password);
  }
  
  /**
   * Logout current user
   * @deprecated Use userStore.logout directly
   */
  function logout() {
    userStore.logout();
  }
  
  /**
   * Check if user is authenticated
   * @deprecated Use userStore.checkAuth directly
   */
  async function checkAuth() {
    return userStore.checkAuth();
  }
  
  /**
   * Check if user has specific role
   * @deprecated Use userStore.hasRole directly
   */
  function hasRole(role: string | string[]): boolean {
    return userStore.hasRole(role);
  }
  
  return {
    // Forward state from the store
    get user() { return userStore.user },
    get loading() { return userStore.isLoading },
    get error() { return userStore.error },
    get isAuthenticated() { return userStore.isAuthenticated },
    
    // Methods
    login,
    logout,
    checkAuth,
    hasRole
  };
}
