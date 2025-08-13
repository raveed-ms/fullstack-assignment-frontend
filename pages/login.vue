<template>
  <AuthForm
    title="Login"
    submit-button-text="Login"
    link-text="Don't have an account?"
    link-label="Register here"
    link-to="/register"
    :initial-data="initialFormData"
    :form-data="form.data.value"
    :field-errors="form.errors.value"
    :is-form-valid="form.isValid.value"
    :is-loading="form.isLoading.value"
    :error-message="form.errorMessage.value"
    :success-message="form.successMessage.value"
    :show-password="showPassword"
    :clear-error="form.clearError"
    :clear-success="form.clearSuccess"
    @submit="handleLogin"
    @validate-field="validateField"
    @update:show-password="showPassword = $event"
    @update:is-form-valid="form.isValid.value = $event"
  />
</template>

<script setup lang="ts">
import type { LoginForm } from '~/types'
import { useForm } from '~/composables/useForm'
import { useAuth } from '~/composables/useAuth'
import { validateLogin } from '~/utils/validation'
import { VALIDATION_RULES } from '~/constants'

definePageMeta({
  title: 'Login'
})

// Initial form data
const initialFormData: LoginForm = {
  email: '',
  password: ''
}

// Form composable
const form = useForm(initialFormData, (data) => {
  const validationData = {
    strategy: VALIDATION_RULES.STRATEGY,
    email: data.email,
    password: data.password
  }
  return validateLogin(validationData)
})

// Auth composable
const { login } = useAuth()

// Password visibility
const showPassword = ref(false)

// Handle form submission
const handleLogin = async (formData: LoginForm) => {
  if (!form.isValid.value) return
  
  form.setLoading(true)
  form.clearError()
  
  try {
    const validationData = {
      strategy: VALIDATION_RULES.STRATEGY,
      email: formData.email,
      password: formData.password
    }
    
    const validation = validateLogin(validationData)
    
    if (!validation.isValid) {
      // Show the first error message
      if (validation.errors.length > 0) {
        form.setError(validation.errors[0])
      } else if (Object.keys(validation.fieldErrors).length > 0) {
        // Show the first field error
        const firstField = Object.keys(validation.fieldErrors)[0]
        form.setError(validation.fieldErrors[firstField][0])
      }
      return
    }
    
    const authResponse = await login(validationData)
    form.setSuccess('Login successful! Redirecting to dashboard...')
    
    setTimeout(async () => {
      await navigateTo('/dashboard')
    }, 1000)
    
  } catch (error) {
    form.setError(error instanceof Error ? error.message : 'An unexpected error occurred')
  } finally {
    form.setLoading(false)
  }
}

// Validate individual field
const validateField = (fieldName: string) => {
  form.validateField(fieldName as keyof LoginForm)
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style> 