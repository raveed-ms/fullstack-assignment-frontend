import { defineStore } from 'pinia';
import { authApi } from '~/api/auth';
import type { User } from '~/types/api';

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  
  const hasRole = (role: string | string[]) => {
    if (!user.value) return false;
    
    if (Array.isArray(role)) {
      return role.some(r => user.value?.role === r);
    }
    
    return user.value.role === role;
  };
  
  const isAdmin = computed(() => hasRole('admin'));
  const isModerator = computed(() => hasRole(['admin', 'mod']));

  // Actions
  const setUser = (newUser: User | null) => {
    user.value = newUser;
  };

  const setToken = (newToken: string | null) => {
    token.value = newToken;
    
    // Update the API client's auth token
    if (newToken) {
      authApi.setToken(newToken);
    } else {
      authApi.logout();
    }
  };

  const login = async (email: string, password: string) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await authApi.login(email, password);
      
      if (response.success && response.data) {
        setToken(response.data.accessToken);
        setUser(response.data.user);
        return { success: true };
      } else {
        error.value = response.message || 'Login failed';
        return { success: false, error: error.value };
      }
    } catch (err: any) {
      error.value = err.message || 'An unexpected error occurred';
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    // Could add navigation to login page here if needed
  };

  const checkAuth = async () => {
    const storedToken = authApi.getToken();
    
    if (!storedToken) {
      return false;
    }
    
    // Set the token in the store and API client
    setToken(storedToken);
    
    // Try to get the current user with the stored token
    isLoading.value = true;
    
    try {
      const response = await authApi.getCurrentUser();
      
      if (response.success && response.data) {
        setUser(response.data);
        return true;
      } else {
        // Token might be invalid or expired
        logout();
        return false;
      }
    } catch (err) {
      logout();
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // State
    user,
    token,
    isLoading,
    error,
    
    // Getters
    isAuthenticated,
    hasRole,
    isAdmin,
    isModerator,
    
    // Actions
    login,
    logout,
    checkAuth,
    setUser,
    setToken
  };
});
