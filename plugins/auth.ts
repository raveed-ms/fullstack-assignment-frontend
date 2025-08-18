import { authApi } from '~/api/auth';
import { useUserStore } from '~/stores/user';

export default defineNuxtPlugin(async (nuxtApp) => {
  // Initialize auth from localStorage on client-side
  if (process.client) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Set token in API client
      authApi.setToken(token);
      
      // Initialize user store with token
      const userStore = useUserStore();
      await userStore.checkAuth();
      
      console.log('Auth plugin initialized, token found in localStorage');
    }
  }
});
