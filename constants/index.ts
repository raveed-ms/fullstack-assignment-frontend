// API endpoints
export const API_ENDPOINTS = {
  AUTHENTICATION: '/api/authentication',
  USERS: '/api/users',
  NAKAMA_USERS: 'http://localhost:3032/api/users'
} as const

// Form validation rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  STRATEGY: 'local'
} as const

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  INVALID_CREDENTIALS: 'Invalid email or password',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVICE_UNAVAILABLE: 'The requested service is not available. Please try again later.',
  ACCESS_DENIED: 'Access denied. You do not have permission to perform this action.',
  RATE_LIMITED: 'Too many requests. Please wait a moment and try again.',
  UNEXPECTED_ERROR: 'An unexpected error occurred. Please try again or contact support if the problem persists.',
  DUPLICATE_EMAIL: 'This email address is already registered. Please use a different email or try logging in instead.'
} as const

// Export user-specific constants
export * from './users' 