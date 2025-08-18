import { ref } from 'vue';
import type { ApiError } from '~/types/api';

/**
 * Error codes from the backend
 */
export const ErrorCodes = {
  // Authentication Errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  
  // Authorization Errors
  FORBIDDEN: 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  
  // Resource Errors
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  
  // Validation Errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  
  // Database Errors
  DB_ERROR: 'DB_ERROR',
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
  NOT_NULL_VIOLATION: '23502',
  
  // Server Errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  
  // Network Errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  REQUEST_TIMEOUT: 'REQUEST_TIMEOUT'
};

/**
 * Base error handler composable
 * Provides common error handling functionality that can be extended by module-specific handlers
 */
export function useBaseErrorHandler() {
  const error = ref<ApiError | null>(null);
  const errorMessage = ref<string | null>(null);
  
  /**
   * Handle common API errors
   * This handles general errors that are common across all modules
   */
  function handleCommonError(apiError: ApiError | undefined, defaultMessage = 'An error occurred'): string {
    if (!apiError) {
      error.value = null;
      errorMessage.value = defaultMessage;
      return defaultMessage;
    }
    
    error.value = apiError;
    
    // Format error message based on error code
    switch (apiError.code) {
      case ErrorCodes.NETWORK_ERROR:
        errorMessage.value = 'Network error. Please check your connection';
        break;
        
      case ErrorCodes.REQUEST_TIMEOUT:
        errorMessage.value = 'Request timed out. Please try again';
        break;
        
      case ErrorCodes.INTERNAL_ERROR:
        errorMessage.value = 'An internal server error occurred. Please try again later';
        break;
        
      case ErrorCodes.SERVICE_UNAVAILABLE:
        errorMessage.value = 'The service is currently unavailable. Please try again later';
        break;
        
      default:
        // Let module-specific handlers deal with other error codes
        errorMessage.value = apiError.message || defaultMessage;
    }
    
    return errorMessage.value;
  }
  
  /**
   * Format validation errors
   */
  function formatValidationErrors(apiError: ApiError): string {
    if (apiError.details?.errors && Array.isArray(apiError.details.errors)) {
      const errors = apiError.details.errors.map((e: any) => e.message).join(', ');
      return `Validation error: ${errors}`;
    }
    return apiError.message || 'Invalid credentials';
  }
  
  /**
   * Clear current error
   */
  function clearError() {
    error.value = null;
    errorMessage.value = null;
  }
  
  /**
   * Check if error is of specific code
   */
  function isErrorCode(code: string): boolean {
    return error.value?.code === code;
  }
  
  return {
    error,
    errorMessage,
    handleCommonError,
    formatValidationErrors,
    clearError,
    isErrorCode,
    ErrorCodes
  };
}
