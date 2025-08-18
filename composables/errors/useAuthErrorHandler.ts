import { useBaseErrorHandler } from './useBaseErrorHandler';
import type { ApiError } from '~/types/api';

/**
 * Authentication-specific error handler
 * Handles errors related to authentication and user management
 */
export function useAuthErrorHandler() {
  // Get the base error handler
  const { 
    error, 
    errorMessage, 
    handleCommonError, 
    formatValidationErrors,
    clearError,
    isErrorCode,
    ErrorCodes 
  } = useBaseErrorHandler();
  
  /**
   * Handle authentication-specific errors
   */
  function handleAuthError(apiError: ApiError | undefined, defaultMessage = 'Authentication failed'): string {
    if (!apiError) {
      return handleCommonError(apiError, defaultMessage);
    }
    
    // Handle auth-specific error codes
    switch (apiError.code) {
      case ErrorCodes.INVALID_CREDENTIALS:
        errorMessage.value = 'Invalid email or password';
        break;
        
      case ErrorCodes.UNAUTHORIZED:
        errorMessage.value = 'You need to login to access this resource';
        break;
        
      case ErrorCodes.TOKEN_EXPIRED:
        errorMessage.value = 'Your session has expired, please login again';
        break;
        
      case ErrorCodes.TOKEN_INVALID:
        errorMessage.value = 'Invalid authentication token';
        break;
        
      case ErrorCodes.FORBIDDEN:
      case ErrorCodes.INSUFFICIENT_PERMISSIONS:
        errorMessage.value = 'You do not have permission to perform this action';
        break;
        
      case ErrorCodes.VALIDATION_ERROR:
      case ErrorCodes.INVALID_INPUT:
        errorMessage.value = formatValidationErrors(apiError);
        break;
        
      default:
        // For errors not specific to auth, use the common handler
        return handleCommonError(apiError, defaultMessage);
    }
    
    error.value = apiError;
    return errorMessage.value;
  }
  
  /**
   * Handle registration-specific errors
   */
  function handleRegistrationError(apiError: ApiError | undefined, defaultMessage = 'Registration failed'): string {
    if (!apiError) {
      return handleCommonError(apiError, defaultMessage);
    }
    
    // Handle registration-specific error codes
    switch (apiError.code) {
      case ErrorCodes.ALREADY_EXISTS:
        if (apiError.details?.field === 'email') {
          errorMessage.value = 'This email is already registered';
        } else {
          errorMessage.value = 'This user already exists';
        }
        break;
        
      case ErrorCodes.VALIDATION_ERROR:
      case ErrorCodes.INVALID_INPUT:
        errorMessage.value = formatValidationErrors(apiError);
        break;
        
      default:
        // For errors not specific to registration, use the common handler
        return handleCommonError(apiError, defaultMessage);
    }
    
    error.value = apiError;
    return errorMessage.value;
  }
  
  return {
    error,
    errorMessage,
    handleAuthError,
    handleRegistrationError,
    clearError,
    isErrorCode,
    ErrorCodes
  };
}
