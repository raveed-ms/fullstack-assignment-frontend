<template>
  <PageLayout>
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-6">
          <v-card-title class="text-h4 text-center mb-4">
            {{ title }}
          </v-card-title>
          
          <!-- Success Alert -->
          <v-alert
            v-if="successMessage"
            type="success"
            variant="tonal"
            class="mb-4"
            closable
            @click:close="clearSuccess"
          >
            {{ successMessage }}
          </v-alert>
          
          <!-- Error Alert -->
          <v-alert
            v-if="errorMessage"
            type="error"
            variant="tonal"
            class="mb-4"
            closable
            @click:close="clearError"
          >
            {{ errorMessage }}
          </v-alert>
          
          <v-form @submit.prevent="handleSubmit" :model-value="isFormValid" @update:model-value="(value: boolean | null) => $emit('update:isFormValid', value ?? false)">
            <!-- Email Field -->
            <v-text-field
              v-model="formData.email"
              label="Email"
              type="email"
              required
              :error-messages="fieldErrors.email"
              @blur="validateField('email')"
              @input="validateField('email')"
            />

            <!-- Name Field (for registration) -->
            <v-text-field
              v-if="showNameField && 'name' in formData"
              v-model="(formData as RegisterForm).name"
              label="Name"
              required
              :error-messages="fieldErrors.name"
              @blur="validateField('name')"
              @input="validateField('name')"
            />

            <!-- Password Field -->
            <v-text-field
              v-model="formData.password"
              label="Password"
              :type="showPassword ? 'text' : 'password'"
              required
              :error-messages="fieldErrors.password"
              @blur="validateField('password')"
              @input="validateField('password')"
            />

            <!-- Confirm Password Field (for registration) -->
            <v-text-field
              v-if="showConfirmPasswordField && 'confirmPassword' in formData"
              v-model="formData.confirmPassword"
              label="Confirm Password"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              :error-messages="fieldErrors.confirmPassword"
              @blur="validateField('confirmPassword')"
              @input="validateField('confirmPassword')"
            />

            <!-- Password Visibility Toggle -->
            <v-checkbox
              :model-value="showPassword"
              label="Show password"
              density="compact"
              hide-details
              class="mb-4 ml-2"
              @update:model-value="(value: boolean | null) => $emit('update:showPassword', value ?? false)"
            />

            <!-- Confirm Password Visibility Toggle -->
            <template v-if="showConfirmPasswordField && 'confirmPassword' in formData">
              <v-checkbox
                :model-value="showConfirmPassword"
                label="Show confirm password"
                density="compact"
                hide-details
                class="mb-6 ml-2"
                @update:model-value="(value: boolean | null) => $emit('update:showConfirmPassword', value ?? false)"
              />
            </template>

            <!-- Submit Button -->
            <v-btn
              type="submit"
              color="primary"
              size="large"
              block
              :loading="isLoading"
              :disabled="!isFormValid"
              class="mb-4"
            >
              {{ submitButtonText }}
            </v-btn>
          </v-form>

          <!-- Link to other auth page -->
          <div class="text-center">
            <span class="text-body-2">{{ linkText }}</span>
            <NuxtLink :to="linkTo" class="text-primary text-decoration-none ml-1">
              {{ linkLabel }}
            </NuxtLink>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </PageLayout>
</template>

<script setup lang="ts">
import type { LoginForm, RegisterForm } from '~/types'

interface Props {
  title: string
  submitButtonText: string
  linkText: string
  linkLabel: string
  linkTo: string
  showNameField?: boolean
  showConfirmPasswordField?: boolean
  initialData: LoginForm | RegisterForm
  formData: LoginForm | RegisterForm
  fieldErrors: Record<string, string>
  isFormValid: boolean
  isLoading: boolean
  errorMessage: string
  successMessage: string
  showPassword: boolean
  showConfirmPassword?: boolean
  clearError: () => void
  clearSuccess: () => void
}

const props = withDefaults(defineProps<Props>(), {
  showNameField: false,
  showConfirmPasswordField: false,
  showConfirmPassword: false
})

const emit = defineEmits<{
  submit: [data: LoginForm | RegisterForm]
  validateField: [fieldName: string]
  'update:showPassword': [value: boolean]
  'update:showConfirmPassword': [value: boolean]
  'update:isFormValid': [value: boolean]
}>()

const handleSubmit = () => {
  emit('submit', props.formData)
}

const validateField = (fieldName: string) => {
  emit('validateField', fieldName)
}
</script> 