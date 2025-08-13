import { ref, computed, watch } from 'vue'
import type { FormState, ValidationResult } from '~/types'

export function useForm<T extends Record<string, any>>(
  initialData: T,
  validator: (data: T) => ValidationResult
) {
  // Form state
  const data = ref<T>({ ...initialData })
  const errors = ref<{ [key: string]: string }>({})
  const isValid = ref(false)
  const isLoading = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')

  // Computed form state
  const formState = computed<FormState<T>>(() => ({
    data: data.value,
    errors: errors.value,
    isValid: isValid.value,
    isLoading: isLoading.value,
    errorMessage: errorMessage.value,
    successMessage: successMessage.value
  }))

  // Validation function
  const validateField = (fieldName: keyof T) => {
    const fieldValue = data.value[fieldName]
    
    // Clear previous error
    errors.value[fieldName as string] = ''
    
    // Run validation
    const result = validator(data.value)
    
    if (!result.isValid) {
      // Check for field-specific errors first
      if (result.fieldErrors && result.fieldErrors[fieldName as string]) {
        errors.value[fieldName as string] = result.fieldErrors[fieldName as string][0]
      } else {
        // Check general errors for this field
        const fieldErrors = result.errors.filter(error => 
          error.toLowerCase().includes(fieldName.toString().toLowerCase())
        )
        if (fieldErrors.length > 0) {
          errors.value[fieldName as string] = fieldErrors[0]
        }
      }
    }
    
    updateFormValidity()
  }

  // Update form validity
  const updateFormValidity = () => {
    const hasErrors = Object.values(errors.value).some(error => error !== '')
    const hasAllRequiredFields = Object.keys(data.value).every(key => 
      data.value[key as keyof T] !== undefined && data.value[key as keyof T] !== ''
    )
    
    isValid.value = hasAllRequiredFields && !hasErrors
  }

  // Reset form
  const resetForm = () => {
    data.value = { ...initialData }
    errors.value = {}
    errorMessage.value = ''
    successMessage.value = ''
    isValid.value = false
  }

  // Set loading state
  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  // Set error message
  const setError = (message: string) => {
    errorMessage.value = message
    successMessage.value = '' // Clear success message when error occurs
  }

  // Set success message
  const setSuccess = (message: string) => {
    successMessage.value = message
    errorMessage.value = '' // Clear error message when success occurs
  }

  // Clear error message
  const clearError = () => {
    errorMessage.value = ''
  }

  // Clear success message
  const clearSuccess = () => {
    successMessage.value = ''
  }

  // Watch for form changes
  watch(data, () => {
    updateFormValidity()
  }, { deep: true })

  return {
    // State
    data,
    errors,
    isValid,
    isLoading,
    errorMessage,
    successMessage,
    formState,
    
    // Methods
    validateField,
    updateFormValidity,
    resetForm,
    setLoading,
    setError,
    setSuccess,
    clearError,
    clearSuccess
  }
} 