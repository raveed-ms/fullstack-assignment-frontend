<template>
  <div class="login-wrapper">
    <ClientOnly>
      <template #default>
        <v-container fluid class="fill-height bg-grey-lighten-4 pa-0 ma-0" style="min-height: 100vh;">
          <v-row class="fill-height ma-0" justify="center" align="center">
            <v-col cols="12" sm="8" md="6" lg="4" class="d-flex justify-center align-center">
              <LoginForm class="w-100" />
            </v-col>
          </v-row>
        </v-container>
      </template>
      
      <template #fallback>
        <div class="login-page-fallback">
          <p>Loading login page...</p>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '~/components/auth/LoginForm.vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '~/stores/user'

// Define page meta to use auth layout (no navbar)
definePageMeta({
  layout: 'auth'
})

// Get the redirect path from query parameters
const route = useRoute()
const redirectPath = computed(() => route.query.redirect as string || '/')

// Get user store to check authentication status
const userStore = useUserStore()

// Redirect if already authenticated
onMounted(async () => {
  if (userStore.isAuthenticated) {
    navigateTo(redirectPath.value)
  }
})
</script>

<style scoped>
.login-wrapper {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.login-page-fallback {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  text-align: center;
  font-size: 1.2rem;
  color: #4a6fa5;
}
</style>
