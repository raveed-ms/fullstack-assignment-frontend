<template>
  <ClientOnly>
    <template #default>
      <v-card class="w-100 pa-8" elevation="8">
        <v-card-title class="text-h4 text-center mb-6">Login</v-card-title>
        
        <v-form @submit.prevent="handleSubmit" class="login-form">
          <v-text-field
            v-model="email"
            :error-messages="emailError"
            label="Email"
            type="email"
            variant="outlined"
            prepend-inner-icon="mdi-email"
            class="mb-4 input-field"
            bg-color="grey-lighten-5"
            required
          ></v-text-field>
          
          <v-text-field
            v-model="password"
            :error-messages="passwordError"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            variant="outlined"
            prepend-inner-icon="mdi-lock"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="togglePasswordVisibility"
            class="mb-4 input-field"
            bg-color="grey-lighten-5"
            required
          ></v-text-field>
          
          <v-alert
            v-if="formError"
            type="error"
            variant="tonal"
            class="mb-6"
            density="compact"
          >
            {{ formError }}
          </v-alert>
          
          <div class="mt-6">
            <v-btn
              type="submit"
              color="primary"
              size="large"
              block
              :loading="isSubmitting"
              height="56"
              class="login-button"
            >
              {{ isSubmitting ? 'Logging in...' : 'Login' }}
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </template>
    
    <template #fallback>
      <div class="login-fallback">
        <p>Loading login form...</p>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthErrorHandler } from '~/composables/errors/useAuthErrorHandler'
import { useRouter, useRoute } from 'vue-router'
import type { ApiError } from '~/types/api'
import { useUserStore } from '~/stores/user'

// Get composables and store
const userStore = useUserStore()
const { handleAuthError, ErrorCodes } = useAuthErrorHandler()
const router = useRouter()
const route = useRoute()

// Get redirect path from query parameters
const redirectPath = computed(() => route.query.redirect as string || '/')

// Form data
const email = ref('')
const password = ref('')

// Form state
const isSubmitting = ref(false)
const showPassword = ref(false)

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// Form errors
const emailError = ref('')
const passwordError = ref('')
const formError = ref('')

// Form validation
const validateForm = () => {
  let isValid = true
  
  // Reset errors
  emailError.value = ''
  passwordError.value = ''
  formError.value = ''
  
  // Validate email
  if (!email.value) {
    emailError.value = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'Please enter a valid email address'
    isValid = false
  }
  
  // Validate password
  if (!password.value) {
    passwordError.value = 'Password is required'
    isValid = false
  } else if (password.value.length < 6) {
    passwordError.value = 'Password must be at least 6 characters'
    isValid = false
  }
  
  return isValid
}

// Form submission
const handleSubmit = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  formError.value = ''
  
  try {
    // Call the user store login action
    const result = await userStore.login(email.value, password.value)
    
    if (result.success) {
      // Redirect to the original requested page or home
      router.push(redirectPath.value)
    } else {
      // Use auth-specific error handler
      formError.value = result.error || 'Login failed. Please try again.'
    }
  } catch (error: any) {
    // Handle unexpected errors
    formError.value = error.message || 'An unexpected error occurred'
    console.error('Login error:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.login-form {
  padding: 1rem 0;
}

/* Custom styles for input fields */
:deep(.input-field) {
  font-size: 2rem;
}

:deep(.input-field .v-field__input) {
  padding: 12px 16px;
  min-height: 56px;
  font-size: 1.4rem !important;
}

:deep(.input-field .v-field__prepend-inner) {
  padding-left: 12px;
}

:deep(.input-field .v-field__append-inner) {
  padding-right: 12px;
}

:deep(.input-field .v-label) {
  font-size: 1.2rem;
  opacity: 0.8;
}

:deep(.v-messages) {
  font-size: 1.1rem;
  line-height: 1.4;
  min-height: 1.4rem;
}

:deep(.login-button) {
  font-size: 1.2rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.login-fallback {
  width: 100%;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}
</style>
