<template>
  <PageLayout>
    <!-- Loading State -->
    <ClientOnly>
      <v-skeleton-loader v-if="isInitializing" type="card" class="mb-4" />
    </ClientOnly>
    
    <!-- Profile Form -->
    <ClientOnly>
      <v-card v-if="!isInitializing" class="mb-6">
        <v-card-title class="text-h4">
          <v-icon class="mr-2">mdi-account-edit</v-icon>
          Edit Profile
        </v-card-title>
        <v-card-subtitle>
          Update your profile information
        </v-card-subtitle>
      </v-card>

      <v-card>
        <v-card-text>
          <v-form @submit.prevent="handleSubmit" :model-value="form.isValid.value" @update:model-value="updateFormValidity">
            <!-- Success Alert -->
            <v-alert
              v-if="form.successMessage.value"
              type="success"
              variant="tonal"
              class="mb-4"
              closable
              @click:close="form.clearSuccess"
            >
              {{ form.successMessage.value }}
            </v-alert>
            
            <!-- Error Alert -->
            <v-alert
              v-if="form.errorMessage.value"
              type="error"
              variant="tonal"
              class="mb-4"
              closable
              @click:close="form.clearError"
            >
              {{ form.errorMessage.value }}
            </v-alert>

            <v-row>
              <!-- Name Field -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.data.value.name"
                  label="Name"
                  required
                  :error-messages="form.errors.value.name"
                  @blur="validateField('name')"
                  @input="validateField('name')"
                />
              </v-col>

              <!-- Email Field -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.data.value.email"
                  label="Email"
                  type="email"
                  required
                  :error-messages="form.errors.value.email"
                  @blur="validateField('email')"
                  @input="validateField('email')"
                />
              </v-col>

              <!-- Current Password Field -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.data.value.currentPassword"
                  label="Current Password"
                  type="password"
                  :error-messages="form.errors.value.currentPassword"
                  @blur="validateField('currentPassword')"
                  @input="validateField('currentPassword')"
                />
              </v-col>

              <!-- New Password Field -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.data.value.newPassword"
                  label="New Password"
                  type="password"
                  :error-messages="form.errors.value.newPassword"
                  @blur="validateField('newPassword')"
                  @input="validatePasswordFields"
                />
              </v-col>

              <!-- Confirm New Password Field -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.data.value.confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  :error-messages="form.errors.value.confirmPassword"
                  @blur="validateField('confirmPassword')"
                  @input="validatePasswordFields"
                />
              </v-col>
            </v-row>

            <!-- Password Visibility Toggle -->
            <v-checkbox
              v-model="showPasswords"
              label="Show passwords"
              density="compact"
              hide-details
              class="mb-4 ml-2"
            />

            <!-- Submit Button -->
            <v-btn
              type="submit"
              color="primary"
              size="large"
              :loading="form.isLoading.value"
              :disabled="!form.isValid.value"
              class="mt-4"
            >
              Update Profile
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </ClientOnly>
  </PageLayout>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useForm } from '~/composables/useForm'
import { validateProfileUpdate } from '~/utils/validation'

definePageMeta({ title: 'Profile' })

const { user, updateUser, isInitializing } = useAuth()

// Form data interface
interface ProfileFormData {
  name: string
  email: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// Initialize form with current user data
const initialFormData: ProfileFormData = {
  name: user?.name || '',
  email: user?.email || '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
}

// Form state management
const form = useForm(initialFormData, validateProfileUpdate)

// Password visibility
const showPasswords = ref(false)

// Watch for password visibility changes
watch(showPasswords, (show) => {
  const passwordFields = document.querySelectorAll('input[type="password"]')
  passwordFields.forEach((field) => {
    (field as HTMLInputElement).type = show ? 'text' : 'password'
  })
})

// Handle form submission
const handleSubmit = async () => {
  if (!form.isValid.value || !user) return
  
  form.setLoading(true)
  form.clearError()
  form.clearSuccess()

  try {
    // Prepare update data (only include fields that have changed)
    const updateData: any = {}
    
    if (form.data.value.name !== user.name) {
      updateData.name = form.data.value.name
    }
    
    if (form.data.value.email !== user.email) {
      updateData.email = form.data.value.email
    }
    
    if (form.data.value.newPassword) {
      updateData.password = form.data.value.newPassword
      updateData.currentPassword = form.data.value.currentPassword
    }

    // Only proceed if there are changes
    if (Object.keys(updateData).length === 0) {
      form.setError('No changes detected')
      return
    }

    // Make API call to update profile
    const response = await $fetch(`/api/users/${user.id}`, {
      method: 'PATCH',
      body: updateData,
      headers: {
        'Authorization': `Bearer ${useAuth().token}`,
        'Content-Type': 'application/json'
      }
    })

    // Update local state
    updateUser(response as any)
    
    // Clear password fields
    form.data.value.currentPassword = ''
    form.data.value.newPassword = ''
    form.data.value.confirmPassword = ''
    
    form.setSuccess('Profile updated successfully!')
    
  } catch (error: any) {
    console.error('Profile update error:', error)
    
    // Handle different error types
    if (error.data && error.data.data && Array.isArray(error.data.data)) {
      // Backend validation errors
      const fieldErrors = error.data.data.reduce((acc: any, err: any) => {
        const field = err.instancePath.replace('/', '')
        if (!acc[field]) acc[field] = []
        acc[field].push(err.message)
        return acc
      }, {})
      
      // Set field-specific errors
      Object.keys(fieldErrors).forEach(field => {
        form.errors.value[field] = fieldErrors[field]
      })
      
      form.setError('Please fix the validation errors above')
    } else if (error.data && error.data.message) {
      // General error message
      form.setError(error.data.message)
    } else {
      // Fallback error
      form.setError('Failed to update profile. Please try again.')
    }
  } finally {
    form.setLoading(false)
  }
}

// Validate individual fields
const validateField = (fieldName: keyof ProfileFormData) => {
  form.validateField(fieldName)
}

// Validate password fields in real-time
const validatePasswordFields = () => {
  // Validate new password
  form.validateField('newPassword')
  
  // Validate confirm password
  form.validateField('confirmPassword')
  
  // Additional real-time validation for password matching
  if (form.data.value.newPassword && form.data.value.confirmPassword) {
    if (form.data.value.newPassword !== form.data.value.confirmPassword) {
      form.errors.value.confirmPassword = 'Passwords must match'
    } else {
      // Clear error if passwords match
      if (form.errors.value.confirmPassword === 'Passwords must match') {
        delete form.errors.value.confirmPassword
      }
    }
  }
  
  // Update form validity
  form.updateFormValidity()
}

// Update form validity
const updateFormValidity = (value: boolean | null) => {
  form.isValid.value = value ?? false
}
</script> 