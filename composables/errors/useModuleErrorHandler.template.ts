import { useBaseErrorHandler } from './useBaseErrorHandler';
import type { ApiError } from '~/types/api';

/**
 * Module-specific error handler template
 * Copy this file and customize for each module
 */
export function useModuleErrorHandler() {
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
   * Handle module-specific errors
   */
  function handleModuleError(apiError: ApiError | undefined, defaultMessage = 'Operation failed'): string {
    if (!apiError) {
      return handleCommonError(apiError, defaultMessage);
    }
    
    // Handle module-specific error codes
    switch (apiError.code) {
      case ErrorCodes.NOT_FOUND:
        errorMessage.value = 'The requested resource was not found';
        break;
        
      case ErrorCodes.ALREADY_EXISTS:
        errorMessage.value = 'This resource already exists';
        break;
        
      case ErrorCodes.VALIDATION_ERROR:
      case ErrorCodes.INVALID_INPUT:
        errorMessage.value = formatValidationErrors(apiError);
        break;
        
      // Add more module-specific error codes here
        
      default:
        // For errors not specific to this module, use the common handler
        return handleCommonError(apiError, defaultMessage);
    }
    
    error.value = apiError;
    return errorMessage.value;
  }
  
  // Add more module-specific error handlers as needed
  
  return {
    error,
    errorMessage,
    handleModuleError,
    clearError,
    isErrorCode,
    ErrorCodes
  };
}
