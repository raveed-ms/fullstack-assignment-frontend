import { useBaseErrorHandler } from './useBaseErrorHandler';
import { useNotifications } from '~/composables/ui/useNotifications';
import type { ApiError } from '~/types/api';

export function useUsersErrorHandler() {
  const { handleCommonError, formatValidationErrors, ErrorCodes } = useBaseErrorHandler();
  const { showError, showWarning, showInfo } = useNotifications();

  /**
   * Handle user-specific API errors
   */
  const handleUserError = (error: ApiError, context?: string) => {
    const contextPrefix = context ? `${context}: ` : '';
    
    // Handle specific user error codes
    switch (error.code) {
      case 'USER_NOT_FOUND':
        showError(`${contextPrefix}User not found`);
        break;
        
      case 'USER_ALREADY_EXISTS':
        showError(`${contextPrefix}User already exists with this email`);
        break;
        
      case 'INVALID_USER_DATA':
        showError(`${contextPrefix}Invalid user data provided`);
        break;
        
      case 'USER_UPDATE_FAILED':
        showError(`${contextPrefix}Failed to update user`);
        break;
        
      case 'USER_CREATION_FAILED':
        showError(`${contextPrefix}Failed to create user`);
        break;
        
      case 'USER_DELETION_FAILED':
        showError(`${contextPrefix}Failed to delete user`);
        break;
        
      case 'INSUFFICIENT_PERMISSIONS':
        showError(`${contextPrefix}Insufficient permissions to perform this action`);
        break;
        
      case 'USER_SEARCH_FAILED':
        showError(`${contextPrefix}User search failed`);
        break;
        
      case 'USER_COUNT_FAILED':
        showError(`${contextPrefix}Failed to get user count`);
        break;
        
      case 'PASSWORD_CHANGE_FAILED':
        showError(`${contextPrefix}Failed to change password`);
        break;
        
      case 'ROLE_UPDATE_FAILED':
        showError(`${contextPrefix}Failed to update user role`);
        break;
        
      case 'BLACKLIST_UPDATE_FAILED':
        showError(`${contextPrefix}Failed to update blacklist status`);
        break;
        
      case 'SELF_DELETION_ATTEMPT':
        showError(`${contextPrefix}You cannot delete your own account`);
        break;
        
      case 'SELF_ROLE_CHANGE_ATTEMPT':
        showError(`${contextPrefix}You cannot change your own role`);
        break;
        
      case 'SELF_BLACKLIST_ATTEMPT':
        showError(`${contextPrefix}You cannot blacklist your own account`);
        break;
        
      default:
        // Fall back to base error handling
        handleCommonError(error, `User operation failed: ${error.message}`);
    }
  };

  /**
   * Handle user validation errors with field-specific messages
   */
  const handleUserValidationError = (error: ApiError, context?: string) => {
    const contextPrefix = context ? `${context}: ` : '';
    
    if (error.details && Array.isArray(error.details)) {
      // Handle field-specific validation errors
      const fieldErrors = error.details.map((detail: any) => {
        const field = detail.instancePath?.replace('/', '') || detail.field || 'field';
        const message = detail.message || 'Invalid value';
        return `${field}: ${message}`;
      });
      
      if (fieldErrors.length > 0) {
        showError(`${contextPrefix}${fieldErrors.join(', ')}`);
        return;
      }
    }
    
    // Handle specific validation error codes
    switch (error.code) {
      case 'VALIDATION_ERROR':
        if (error.message.includes('Password')) {
          showError(`${contextPrefix}Password is required and must meet security requirements`);
        } else if (error.message.includes('Email')) {
          showError(`${contextPrefix}Please provide a valid email address`);
        } else if (error.message.includes('Name')) {
          showError(`${contextPrefix}Name must be 2-100 characters`);
        } else if (error.message.includes('Role')) {
          showError(`${contextPrefix}Invalid role specified`);
        } else if (error.message.includes('Current password')) {
          showError(`${contextPrefix}Current password is required when changing password`);
        } else if (error.message.includes('Current password incorrect')) {
          showError(`${contextPrefix}Current password is incorrect`);
        } else {
          showError(`${contextPrefix}${error.message}`);
        }
        break;
        
      case 'INVALID_INPUT':
        showError(`${contextPrefix}Invalid input provided`);
        break;
        
      default:
        showError(`${contextPrefix}${error.message || 'Validation failed'}`);
    }
  };

  /**
   * Handle user authentication errors
   */
  const handleUserAuthError = (error: ApiError, context?: string) => {
    const contextPrefix = context ? `${context}: ` : '';
    
    switch (error.code) {
      case 'UNAUTHORIZED':
        showError(`${contextPrefix}Authentication required`);
        break;
        
      case 'TOKEN_EXPIRED':
        showError(`${contextPrefix}Your session has expired. Please log in again`);
        break;
        
      case 'TOKEN_INVALID':
        showError(`${contextPrefix}Invalid authentication token`);
        break;
        
      case 'INVALID_CREDENTIALS':
        showError(`${contextPrefix}Invalid email or password`);
        break;
        
      default:
        showError(`${contextPrefix}Authentication failed`);
    }
  };

  /**
   * Handle user authorization errors
   */
  const handleUserAuthorizationError = (error: ApiError, context?: string) => {
    const contextPrefix = context ? `${context}: ` : '';
    
    switch (error.code) {
      case 'FORBIDDEN':
        showError(`${contextPrefix}Access denied`);
        break;
        
      case 'INSUFFICIENT_PERMISSIONS':
        showError(`${contextPrefix}You don't have permission to perform this action`);
        break;
        
      case 'ADMIN_REQUIRED':
        showError(`${contextPrefix}Admin role required for this operation`);
        break;
        
      case 'MOD_OR_ADMIN_REQUIRED':
        showError(`${contextPrefix}Moderator or Admin role required for this operation`);
        break;
        
      default:
        showError(`${contextPrefix}Authorization failed`);
    }
  };

  /**
   * Handle user database errors
   */
  const handleUserDatabaseError = (error: ApiError, context?: string) => {
    const contextPrefix = context ? `${context}: ` : '';
    
    switch (error.code) {
      case '23505': // UNIQUE_VIOLATION
        if (error.message.includes('email')) {
          showError(`${contextPrefix}Email address already exists`);
        } else {
          showError(`${contextPrefix}User with this information already exists`);
        }
        break;
        
      case '23503': // FOREIGN_KEY_VIOLATION
        showError(`${contextPrefix}Cannot delete user due to existing references`);
        break;
        
      case '23502': // NOT_NULL_VIOLATION
        showError(`${contextPrefix}Required field is missing`);
        break;
        
      default:
        showError(`${contextPrefix}Database operation failed`);
    }
  };

  /**
   * Main error handler that routes to appropriate handlers
   */
  const handleError = (error: any, context?: string) => {
    console.log('useUsersErrorHandler.handleError called with:', error, context);
    
    // Extract the actual error from the response if needed
    const apiError = error?.error || error;
    
    if (!apiError || !apiError.code) {
      showError(`${context || 'User operation'}: An unexpected error occurred`);
      return;
    }

    // Route to appropriate handler based on error type
    if (apiError.code?.includes('VALIDATION') || apiError.code === 'INVALID_INPUT') {
      handleUserValidationError(apiError, context);
    } else if (apiError.code?.includes('AUTH') || apiError.code === 'UNAUTHORIZED' || apiError.code === 'TOKEN_EXPIRED' || apiError.code === 'TOKEN_INVALID') {
      handleUserAuthError(apiError, context);
    } else if (apiError.code?.includes('FORBIDDEN') || apiError.code === 'INSUFFICIENT_PERMISSIONS') {
      handleUserAuthorizationError(apiError, context);
    } else if (apiError.code?.match(/^23\d{3}$/)) { // Database error codes
      handleUserDatabaseError(apiError, context);
    } else {
      handleUserError(apiError, context);
    }
  };

  return {
    handleError,
    handleUserError,
    handleUserValidationError,
    handleUserAuthError,
    handleUserAuthorizationError,
    handleUserDatabaseError
  };
}
