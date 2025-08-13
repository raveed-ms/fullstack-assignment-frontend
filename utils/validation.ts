import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import ajvErrors from 'ajv-errors'
import type { ValidationResult, LoginRequest, RegisterRequest } from '~/types'
import { VALIDATION_RULES, ERROR_MESSAGES } from '~/constants'

// Initialize AJV with the same configuration as backend
const ajv = new Ajv({ 
  allErrors: true,
  removeAdditional: false,
  useDefaults: false
})

addFormats(ajv)
ajvErrors(ajv)

// Registration schema - mirrors backend userRegistrationSchema
const userRegistrationSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
      errorMessage: 'Please provide a valid email address'
    },
    password: {
      type: 'string',
      minLength: VALIDATION_RULES.PASSWORD_MIN_LENGTH,
      errorMessage: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters long`
    },
    name: {
      type: 'string',
      minLength: VALIDATION_RULES.NAME_MIN_LENGTH,
      errorMessage: `Name must be at least ${VALIDATION_RULES.NAME_MIN_LENGTH} characters long`
    }
  },
  required: ['email', 'password', 'name'],
  additionalProperties: false,
  errorMessage: {
    required: {
      email: 'Email is required',
      password: 'Password is required',
      name: 'Name is required'
    },
    additionalProperties: 'Registration only allows: email, password, and name fields'
  }
}

// Login schema - mirrors backend loginSchema
const loginSchema = {
  type: 'object',
  properties: {
    strategy: {
      type: 'string',
      const: VALIDATION_RULES.STRATEGY,
      errorMessage: 'Authentication strategy is required'
    },
    email: {
      type: 'string',
      format: 'email',
      errorMessage: 'Please provide a valid email address'
    },
    password: {
      type: 'string',
      minLength: 1,
      errorMessage: 'Password is required'
    }
  },
  required: ['strategy', 'email', 'password'],
  additionalProperties: false,
  errorMessage: {
    required: {
      strategy: 'Authentication strategy is required',
      email: 'Email is required',
      password: 'Password is required'
    },
    additionalProperties: 'Login only allows: strategy, email, and password fields'
  }
}

// Create validators
export const userRegistrationValidator = ajv.compile(userRegistrationSchema)
export const loginValidator = ajv.compile(loginSchema)

// Validation functions with proper typing
export const validateRegistration = (data: RegisterRequest): ValidationResult => {
  const isValid = userRegistrationValidator(data)
  if (!isValid) {
    const errors = userRegistrationValidator.errors || []
    
    // Group errors by field for better field-specific validation
    const fieldErrors: { [key: string]: string[] } = {}
    const generalErrors: string[] = []
    
    errors.forEach(error => {
      if (error.instancePath) {
        // Field-specific error
        const field = error.instancePath.replace('/', '')
        if (!fieldErrors[field]) fieldErrors[field] = []
        fieldErrors[field].push(error.message || 'Invalid value')
      } else {
        // General error (like required fields, additional properties)
        generalErrors.push(error.message || 'Validation failed')
      }
    })
    
    return {
      isValid: false,
      errors: generalErrors,
      fieldErrors
    }
  }
  return { isValid: true, errors: [], fieldErrors: {} }
}

export const validateLogin = (data: LoginRequest): ValidationResult => {
  const isValid = loginValidator(data)
  
  if (!isValid) {
    const errors = loginValidator.errors || []
    
    // Group errors by field for better field-specific validation
    const fieldErrors: { [key: string]: string[] } = {}
    const generalErrors: string[] = []
    
    errors.forEach(error => {
      if (error.instancePath) {
        // Field-specific error
        const field = error.instancePath.replace('/', '')
        if (!fieldErrors[field]) fieldErrors[field] = []
        fieldErrors[field].push(error.message || 'Invalid value')
      } else {
        // General error (like required fields, additional properties)
        generalErrors.push(error.message || 'Validation failed')
      }
    })
    
    return {
      isValid: false,
      errors: generalErrors,
      fieldErrors
    }
  }
  return { isValid: true, errors: [], fieldErrors: {} }
}

// Enhanced error message mapping for backend errors
export const mapBackendError = (error: any): string => {
  // Handle different error structures that Nuxt might provide
  let actualError = error
  
  // Check if it's a Nuxt fetch error with response._data
  if (error.response && error.response._data) {
    actualError = error.response._data
  }
  
  // Check if it's a Nuxt fetch error with data
  if (error.data && !error.response) {
    actualError = error.data
  }
  
  // Handle BadRequest errors (validation errors)
  if (actualError.name === 'BadRequest') {
    // Check if it's a validation error with detailed field information
    if (actualError.data && Array.isArray(actualError.data)) {
      // Extract field-specific error messages
      const fieldErrors = actualError.data.map((fieldError: any) => fieldError.message)
      return fieldErrors.join('. ')
    }
    
    // Handle specific BadRequest messages
    if (actualError.message.includes('email') && actualError.message.includes('already exists')) {
      return ERROR_MESSAGES.DUPLICATE_EMAIL
    }
    
    return actualError.message
  }
  
  // Handle authentication errors
  if (actualError.name === 'NotAuthenticated') {
    if (actualError.message === 'Invalid login') {
      return ERROR_MESSAGES.INVALID_CREDENTIALS
    }
    return 'Authentication failed. Please try again.'
  }
  
  // Handle forbidden errors (authorization)
  if (actualError.name === 'Forbidden') {
    if (actualError.message.includes('Current password is required')) {
      return 'Current password is required when changing password'
    }
    if (actualError.message.includes('Current password is incorrect')) {
      return 'Current password is incorrect. Please check your password and try again.'
    }
    if (actualError.message.includes('blacklisted')) {
      return 'Your account has been blacklisted. Please contact an administrator for assistance.'
    }
    return actualError.message
  }
  
  // Handle conflict errors (duplicate email)
  if (actualError.name === 'Conflict') {
    if (actualError.message.includes('email')) {
      return ERROR_MESSAGES.DUPLICATE_EMAIL
    }
    return actualError.message
  }
  
  // Handle validation errors
  if (actualError.name === 'ValidationError') {
    if (actualError.data && Array.isArray(actualError.data)) {
      const fieldErrors = actualError.data.map((fieldError: any) => fieldError.message)
      return fieldErrors.join('. ')
    }
    return actualError.message
  }
  
  // Handle network/connection errors
  if (actualError.status === 0 || actualError.status === 500) {
    return ERROR_MESSAGES.NETWORK_ERROR
  }
  
  // Handle 404 errors
  if (actualError.status === 404) {
    return ERROR_MESSAGES.SERVICE_UNAVAILABLE
  }
  
  // Handle 403 errors
  if (actualError.status === 403) {
    return ERROR_MESSAGES.ACCESS_DENIED
  }
  
  // Handle 429 (rate limiting)
  if (actualError.status === 429) {
    return ERROR_MESSAGES.RATE_LIMITED
  }
  
  // Default error message for unknown errors
  console.error('Unhandled error type:', actualError)
  return ERROR_MESSAGES.UNEXPECTED_ERROR
} 

// Profile update validation
export const validateProfileUpdate = (data: any): ValidationResult => {
  const errors: string[] = []
  const fieldErrors: { [key: string]: string[] } = {}

  // Name validation
  if (data.name) {
    if (data.name.length < 2) {
      fieldErrors.name = ['Name must be at least 2 characters long']
      errors.push('Name must be at least 2 characters long')
    }
  }

  // Email validation
  if (data.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      fieldErrors.email = ['Please provide a valid email address']
      errors.push('Please provide a valid email address')
    }
  }

  // Password validation
  if (data.newPassword) {
    if (data.newPassword.length < 6) {
      fieldErrors.newPassword = ['Password must be at least 6 characters long']
      errors.push('Password must be at least 6 characters long')
    }

    // Confirm password validation
    if (data.confirmPassword !== data.newPassword) {
      fieldErrors.confirmPassword = ['Passwords must match']
      errors.push('Passwords must match')
    }

    // Current password is required when changing password
    if (!data.currentPassword) {
      fieldErrors.currentPassword = ['Current password is required to change password']
      errors.push('Current password is required to change password')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    fieldErrors
  }
} 