<template>
  <AuthForm
    title="Register"
    submit-button-text="Register"
    link-text="Already have an account?"
    link-label="Login here"
    link-to="/login"
    :show-name-field="true"
    :show-confirm-password-field="true"
    :initial-data="initialFormData"
    :form-data="form.data.value"
    :field-errors="form.errors.value"
    :is-form-valid="form.isValid.value"
    :is-loading="form.isLoading.value"
    :error-message="form.errorMessage.value"
    :success-message="form.successMessage.value"
    :show-password="showPassword"
    :show-confirm-password="showConfirmPassword"
    :clear-error="form.clearError"
    :clear-success="form.clearSuccess"
    @submit="handleRegister"
    @validate-field="validateField"
    @update:show-password="showPassword = $event"
    @update:show-confirm-password="showConfirmPassword = $event"
    @update:is-form-valid="form.isValid.value = $event"
  />
</template>

<script setup lang="ts">
import type { RegisterForm, LoginForm } from '~/types'
import { useForm } from '~/composables/useForm'
import { useAuth } from '~/composables/useAuth'
import { validateRegistration } from '~/utils/validation'

definePageMeta({
  title: 'Register'
})

// Initial form data
const initialFormData: RegisterForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
}

// Form composable with custom validation
const form = useForm(initialFormData, (data) => {
  // Custom validation for confirm password
  const confirmPasswordError = validateConfirmPassword(data.confirmPassword, data.password)
  
  // Run standard validation
  const validationData = {
    name: data.name,
    email: data.email,
    password: data.password
  }
  
  const result = validateRegistration(validationData)
  
  // Add confirm password error if exists
  if (confirmPasswordError) {
    result.fieldErrors = result.fieldErrors || {}
    result.fieldErrors.confirmPassword = [confirmPasswordError]
    result.isValid = false
  }
  
  return result
})

// Auth composable
const { register } = useAuth()

// Password visibility
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Custom validation for confirm password
const validateConfirmPassword = (confirmPassword: string, password: string): string => {
  if (!confirmPassword) return 'Confirm password is required'
  if (confirmPassword !== password) return 'Passwords must match'
  return ''
}

// Handle form submission
const handleRegister = async (formData: LoginForm | RegisterForm) => {
  // Type guard to ensure we have a RegisterForm
  if (!('name' in formData) || !('confirmPassword' in formData)) {
    form.setError('Invalid form data')
    return
  }
  
  const registerData = formData as RegisterForm
  
  if (!form.isValid.value) return
  
  form.setLoading(true)
  form.clearError()
  
  try {
    // Final validation before submission
    const validationData = {
      name: registerData.name,
      email: registerData.email,
      password: registerData.password
    }
    
    const validation = validateRegistration(validationData)
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
    
    // Check confirm password
    const confirmPasswordError = validateConfirmPassword(registerData.confirmPassword, registerData.password)
    if (confirmPasswordError) {
      form.setError(confirmPasswordError)
      return
    }
    
    // Attempt registration
    await register(validationData)
    
    // Show success message
    form.setSuccess(`Registration successful! Welcome ${registerData.name}! You will be redirected to login in 3 seconds.`)
    
    // Redirect to login page after 3 seconds
    setTimeout(async () => {
      await navigateTo('/login')
    }, 3000)
    
  } catch (error) {
    form.setError(error instanceof Error ? error.message : 'An unexpected error occurred')
  } finally {
    form.setLoading(false)
  }
}

// Validate individual field
const validateField = (fieldName: string) => {
  form.validateField(fieldName as keyof RegisterForm)
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style> 