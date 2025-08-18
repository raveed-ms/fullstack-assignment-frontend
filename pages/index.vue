<template>
  <div class="home-wrapper">
    <ClientOnly>
      <template #default>
        <div v-if="isLoading" class="loading-container">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          <p class="mt-4">Checking authentication status...</p>
        </div>
      </template>
      
      <template #fallback>
        <div class="home-fallback">
          <h1>Welcome to the Application</h1>
          <p>Loading...</p>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const isLoading = ref(true)

// Check auth status on page load and redirect accordingly
onMounted(async () => {
  isLoading.value = true
  
  try {
    // Check if user is authenticated (this will restore from localStorage if token exists)
    const isAuthenticated = await userStore.checkAuth()
    
    // Redirect based on authentication status
    if (isAuthenticated) {
      console.log('User is authenticated, redirecting to dashboard')
      router.replace('/dashboard')
    } else {
      console.log('User is not authenticated, redirecting to login')
      router.replace('/login')
    }
  } catch (error) {
    console.error('Error checking authentication:', error)
    // If there's an error, default to login page
    router.replace('/login')
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.home-wrapper {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.home-fallback {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  text-align: center;
}

.home-fallback h1 {
  margin-bottom: 1.5rem;
  color: #4a6fa5;
}

.loading-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  text-align: center;
  font-size: 1.2rem;
  color: #4a6fa5;
}
</style>
