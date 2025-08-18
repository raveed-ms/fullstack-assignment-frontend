import { useBaseErrorHandler } from './useBaseErrorHandler';
import type { ApiError } from '~/types/api';

/**
 * Profile-specific error handler
 * Handles errors related to profile management and updates
 */
export function useProfileErrorHandler() {
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
   * Handle profile update errors
   */
  function handleProfileUpdateError(apiError: ApiError | undefined, defaultMessage = 'Profile update failed'): string {
    if (!apiError) {
      return handleCommonError(apiError, defaultMessage);
    }
    
    // Handle profile-specific error codes
    switch (apiError.code) {
      case ErrorCodes.VALIDATION_ERROR:
      case ErrorCodes.INVALID_INPUT:
        errorMessage.value = formatValidationErrors(apiError);
        break;
        
      case ErrorCodes.UNAUTHORIZED:
        errorMessage.value = 'You need to login to update your profile';
        break;
        
      case ErrorCodes.FORBIDDEN:
      case ErrorCodes.INSUFFICIENT_PERMISSIONS:
        errorMessage.value = 'You do not have permission to update this profile';
        break;
        
      case ErrorCodes.NOT_FOUND:
        errorMessage.value = 'User profile not found';
        break;
        
      case ErrorCodes.ALREADY_EXISTS:
        if (apiError.details?.field === 'email') {
          errorMessage.value = 'This email is already in use by another user';
        } else {
          errorMessage.value = 'A user with this information already exists';
        }
        break;
        
      case ErrorCodes.UNIQUE_VIOLATION:
        if (apiError.details?.field === 'email') {
          errorMessage.value = 'This email is already in use by another user';
        } else {
          errorMessage.value = 'This information conflicts with an existing user';
        }
        break;
        
      default:
        // For errors not specific to profile updates, use the common handler
        return handleCommonError(apiError, defaultMessage);
    }
    
    error.value = apiError;
    return errorMessage.value;
  }
  
  /**
   * Handle profile fetch errors
   */
  function handleProfileFetchError(apiError: ApiError | undefined, defaultMessage = 'Failed to load profile'): string {
    if (!apiError) {
      return handleCommonError(apiError, defaultMessage);
    }
    
    // Handle profile fetch-specific error codes
    switch (apiError.code) {
      case ErrorCodes.UNAUTHORIZED:
        errorMessage.value = 'You need to login to view your profile';
        break;
        
      case ErrorCodes.FORBIDDEN:
      case ErrorCodes.INSUFFICIENT_PERMISSIONS:
        errorMessage.value = 'You do not have permission to view this profile';
        break;
        
      case ErrorCodes.NOT_FOUND:
        errorMessage.value = 'Profile not found';
        break;
        
      default:
        // For errors not specific to profile fetching, use the common handler
        return handleCommonError(apiError, defaultMessage);
    }
    
    error.value = apiError;
    return errorMessage.value;
  }
  
  return {
    error,
    errorMessage,
    handleProfileUpdateError,
    handleProfileFetchError,
    clearError,
    isErrorCode,
    ErrorCodes
  };
}
