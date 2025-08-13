export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  
  // Initialize auth store on app startup
  if (authStore.isInitializing) {
    await authStore.initializeAuth()
  }
}) 