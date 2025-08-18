import { useBaseErrorHandler } from './useBaseErrorHandler';
import { useNotifications } from '~/composables/ui/useNotifications';
import type { ApiError } from '~/types/api';

export function usePlayersErrorHandler() {
  const { handleCommonError, formatValidationErrors, ErrorCodes } = useBaseErrorHandler();
  const { showError, showWarning, showInfo } = useNotifications();

  /**
   * Handle player-specific API errors
   */
  const handlePlayerError = (error: ApiError, context?: string) => {
    const contextPrefix = context ? `${context}: ` : '';
    
    // Handle specific player error codes
    switch (error.code) {
      case 'PLAYER_NOT_FOUND':
        showError(`${contextPrefix}Player not found`);
        break;
        
      case 'PLAYER_ALREADY_EXISTS':
        showError(`${contextPrefix}Player already exists with this information`);
        break;
        
      case 'INVALID_PLAYER_DATA':
        showError(`${contextPrefix}Invalid player data provided`);
        break;
        
      case 'PLAYER_UPDATE_FAILED':
        showError(`${contextPrefix}Failed to update player`);
        break;
        
      case 'CHANGELOG_CREATION_FAILED':
        showError(`${contextPrefix}Failed to create changelog entry`);
        break;
        
      case 'INSUFFICIENT_PERMISSIONS':
        showError(`${contextPrefix}Insufficient permissions to perform this action`);
        break;
        
      case 'PLAYER_SEARCH_FAILED':
        showError(`${contextPrefix}Player search failed`);
        break;
        
      case 'PLAYER_COUNT_FAILED':
        showError(`${contextPrefix}Failed to get player count`);
        break;
        
      case 'CHANGELOG_RETRIEVAL_FAILED':
        showError(`${contextPrefix}Failed to retrieve changelog`);
        break;
        
      default:
        // Fall back to base error handling
        handleCommonError(error, `Player operation failed: ${error.message}`);
    }
  };

  /**
   * Handle player validation errors with field-specific messages
   */
  const handlePlayerValidationError = (error: ApiError, context?: string) => {
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
        if (error.message.includes('Username')) {
          showError(`${contextPrefix}Username must be 3-50 characters, alphanumeric with underscores and hyphens only`);
        } else if (error.message.includes('Display name')) {
          showError(`${contextPrefix}Display name must be 2-100 characters`);
        } else if (error.message.includes('Email')) {
          showError(`${contextPrefix}Please provide a valid email address`);
        } else if (error.message.includes('Language tag')) {
          showError(`${contextPrefix}Language tag must be in format: en, en-US, etc.`);
        } else if (error.message.includes('Location')) {
          showError(`${contextPrefix}Location must be 2-100 characters`);
        } else if (error.message.includes('Timezone')) {
          showError(`${contextPrefix}Timezone must be 3-50 characters`);
        } else if (error.message.includes('Avatar URL')) {
          showError(`${contextPrefix}Avatar URL must be a valid URL`);
        } else if (error.message.includes('Wallet coins')) {
          showError(`${contextPrefix}Wallet coins must be between 0 and 999,999,999`);
        } else if (error.message.includes('Wallet bonus cash')) {
          showError(`${contextPrefix}Wallet bonus cash must be between 0 and 999,999,999`);
        } else if (error.message.includes('Chat role')) {
          showError(`${contextPrefix}Chat role must be 0 (User), 1 (Mod), or 2 (Admin)`);
        } else if (error.message.includes('Greens in Regulation')) {
          showError(`${contextPrefix}Greens in Regulation must be between 0 and 100`);
        } else if (error.message.includes('Win ratio')) {
          showError(`${contextPrefix}Win ratio must be between 0 and 100`);
        } else if (error.message.includes('Longest drive')) {
          showError(`${contextPrefix}Longest drive must be between 0 and 1000`);
        } else if (error.message.includes('Longest putt')) {
          showError(`${contextPrefix}Longest putt must be between 0 and 1000`);
        } else if (error.message.includes('Longest chip')) {
          showError(`${contextPrefix}Longest chip must be between 0 and 1000`);
        } else if (error.message.includes('Hole in one count')) {
          showError(`${contextPrefix}Hole in one count must be between 0 and 1000`);
        } else if (error.message.includes('Total attempted')) {
          showError(`${contextPrefix}Total attempted must be between 0 and 100,000`);
        } else if (error.message.includes('Speed King')) {
          showError(`${contextPrefix}Speed King count must be between 0 and 1000`);
        } else if (error.message.includes('Putt Master')) {
          showError(`${contextPrefix}Putt Master count must be between 0 and 1000`);
        } else if (error.message.includes('Perfect Round')) {
          showError(`${contextPrefix}Perfect Round count must be between 0 and 1000`);
        } else if (error.message.includes('Sharp Shooter')) {
          showError(`${contextPrefix}Sharp Shooter count must be between 0 and 1000`);
        } else if (error.message.includes('Recovery Master')) {
          showError(`${contextPrefix}Recovery Master count must be between 0 and 1000`);
        } else if (error.message.includes('Earnings ranking')) {
          showError(`${contextPrefix}Earnings ranking must be between 1 and 1,000,000`);
        } else if (error.message.includes('Cash earned')) {
          showError(`${contextPrefix}Cash earned must be between 0 and 999,999,999`);
        } else if (error.message.includes('Coins earned')) {
          showError(`${contextPrefix}Coins earned must be between 0 and 999,999,999`);
        } else if (error.message.includes('Career XP')) {
          showError(`${contextPrefix}Career XP must be between 0 and 999,999,999`);
        } else if (error.message.includes('Career level')) {
          showError(`${contextPrefix}Career level must be between 1 and 1000`);
        } else if (error.message.includes('Career league')) {
          showError(`${contextPrefix}Career league must be between 1 and 100`);
        } else if (error.message.includes('Avatar type')) {
          showError(`${contextPrefix}Avatar type must be between 0 and 100`);
        } else if (error.message.includes('Avatar index')) {
          showError(`${contextPrefix}Avatar index must be between 0 and 1000`);
        } else if (error.message.includes('Change reason')) {
          showError(`${contextPrefix}Change reason must be 5-500 characters`);
        } else if (error.message.includes('Limit')) {
          showError(`${contextPrefix}Limit must be between 1 and 100`);
        } else if (error.message.includes('Skip')) {
          showError(`${contextPrefix}Skip must be 0 or greater`);
        } else if (error.message.includes('Search')) {
          showError(`${contextPrefix}Search term must be 1-50 characters`);
        } else if (error.message.includes('Date')) {
          showError(`${contextPrefix}Please provide a valid date`);
        } else {
          showError(`${contextPrefix}${error.message}`);
        }
        break;
        
      default:
        showError(`${contextPrefix}${error.message}`);
    }
  };

  /**
   * Handle player database errors
   */
  const handlePlayerDatabaseError = (error: ApiError, context?: string) => {
    const contextPrefix = context ? `${context}: ` : '';
    
    // Handle specific database error codes
    switch (error.code) {
      case 'UNIQUE_VIOLATION':
        if (error.message.includes('email')) {
          showError(`${contextPrefix}Email address is already in use`);
        } else if (error.message.includes('username')) {
          showError(`${contextPrefix}Username is already taken`);
        } else {
          showError(`${contextPrefix}Duplicate value violates unique constraint`);
        }
        break;
        
      case 'FOREIGN_KEY_VIOLATION':
        showError(`${contextPrefix}Referenced record does not exist`);
        break;
        
      case 'NOT_NULL_VIOLATION':
        showError(`${contextPrefix}Required field is missing`);
        break;
        
      case 'CHECK_VIOLATION':
        showError(`${contextPrefix}Value does not meet requirements`);
        break;
        
      case 'INVALID_TEXT_REPRESENTATION':
        showError(`${contextPrefix}Invalid data format provided`);
        break;
        
      case 'INVALID_DATETIME_FORMAT':
        showError(`${contextPrefix}Invalid date/time format`);
        break;
        
      case 'INVALID_NUMERIC_VALUE':
        showError(`${contextPrefix}Invalid numeric value provided`);
        break;
        
      default:
        // Fall back to base database error handling
        handleCommonError(error, `Database operation failed: ${error.message}`);
    }
  };

  /**
   * Handle player search and filter errors
   */
  const handlePlayerSearchError = (error: ApiError, context?: string) => {
    const contextPrefix = context ? `${context}: ` : '';
    
    switch (error.code) {
      case 'INVALID_SEARCH_PARAMETER':
        showError(`${contextPrefix}Invalid search parameter provided`);
        break;
        
      case 'INVALID_FILTER_VALUE':
        showError(`${contextPrefix}Invalid filter value provided`);
        break;
        
      case 'INVALID_SORT_PARAMETER':
        showError(`${contextPrefix}Invalid sort parameter provided`);
        break;
        
      case 'INVALID_DATE_RANGE':
        showError(`${contextPrefix}Invalid date range provided`);
        break;
        
      case 'SEARCH_TOO_BROAD':
        showWarning(`${contextPrefix}Search criteria too broad, please refine your search`);
        break;
        
      case 'NO_RESULTS_FOUND':
        showInfo(`${contextPrefix}No players found matching your criteria`);
        break;
        
      default:
        handlePlayerError(error, context);
    }
  };

  /**
   * Handle player update errors
   */
  const handlePlayerUpdateError = (error: ApiError, context?: string) => {
    const contextPrefix = context ? `${context}: ` : '';
    
    switch (error.code) {
      case 'NO_CHANGES_DETECTED':
        showWarning(`${contextPrefix}No changes were made to the player`);
        break;
        
      case 'CHANGE_REASON_REQUIRED':
        showError(`${contextPrefix}Change reason is required for all updates`);
        break;
        
      case 'INVALID_CHANGE_DATA':
        showError(`${contextPrefix}Invalid data provided for update`);
        break;
        
      case 'PLAYER_LOCKED':
        showError(`${contextPrefix}Player is currently locked and cannot be updated`);
        break;
        
      case 'UPDATE_CONFLICT':
        showError(`${contextPrefix}Player was modified by another user, please refresh and try again`);
        break;
        
      default:
        handlePlayerError(error, context);
    }
  };

  /**
   * Handle changelog-related errors
   */
  const handleChangelogError = (error: ApiError, context?: string) => {
    const contextPrefix = context ? `${context}: ` : '';
    
    switch (error.code) {
      case 'CHANGELOG_NOT_FOUND':
        showError(`${contextPrefix}Changelog entry not found`);
        break;
        
      case 'INVALID_CHANGELOG_QUERY':
        showError(`${contextPrefix}Invalid changelog query parameters`);
        break;
        
      case 'CHANGELOG_CREATION_FAILED':
        showError(`${contextPrefix}Failed to create changelog entry`);
        break;
        
      case 'CHANGELOG_RETRIEVAL_FAILED':
        showError(`${contextPrefix}Failed to retrieve changelog entries`);
        break;
        
      default:
        handlePlayerError(error, context);
    }
  };

  /**
   * Generic player error handler that routes to appropriate handlers
   */
  const handleError = (error: ApiError, context?: string) => {
    console.log('usePlayersErrorHandler.handleError called with:', error, context);
    // Route to appropriate handler based on error type
    if (error.code?.includes('VALIDATION') || error.code === 'INVALID_INPUT') {
      handlePlayerValidationError(error, context);
    } else if (error.code?.includes('DATABASE') || error.code?.includes('DB_')) {
      handlePlayerDatabaseError(error, context);
    } else if (error.code?.includes('SEARCH') || error.code?.includes('FILTER')) {
      handlePlayerSearchError(error, context);
    } else if (error.code?.includes('UPDATE') || error.code?.includes('MODIFY')) {
      handlePlayerUpdateError(error, context);
    } else if (error.code?.includes('CHANGELOG')) {
      handleChangelogError(error, context);
    } else {
      handlePlayerError(error, context);
    }
  };

  return {
    handlePlayerError,
    handlePlayerValidationError,
    handlePlayerDatabaseError,
    handlePlayerSearchError,
    handlePlayerUpdateError,
    handleChangelogError,
    handleError
  };
}
