import { useBaseErrorHandler } from './useBaseErrorHandler';
import type { ApiError } from '~/types/api';

export function useSeasonsErrorHandler() {
  const { error, errorMessage, handleCommonError, formatValidationErrors, clearError, isErrorCode, ErrorCodes } = useBaseErrorHandler();

  function handleSeasonsFetchError(apiError: ApiError | undefined, defaultMessage = 'Failed to load seasons'): string | null {
    if (!apiError) {
      errorMessage.value = defaultMessage;
      return defaultMessage;
    }

    switch (apiError.code) {
      case ErrorCodes.UNAUTHORIZED:
        errorMessage.value = 'You must be logged in to view seasons';
        break;
      case ErrorCodes.FORBIDDEN:
        errorMessage.value = 'You do not have permission to view these seasons';
        break;
      case ErrorCodes.VALIDATION_ERROR:
        errorMessage.value = 'Invalid search or filter parameters';
        break;
      case ErrorCodes.NOT_FOUND:
        errorMessage.value = 'Seasons not found';
        break;
      case ErrorCodes.INTERNAL_ERROR:
        errorMessage.value = 'Server error while loading seasons';
        break;
      default:
        handleCommonError(apiError, defaultMessage);
    }

    return errorMessage.value;
  }

  function handleSeasonFetchError(apiError: ApiError | undefined, defaultMessage = 'Failed to load season'): string | null {
    if (!apiError) {
      errorMessage.value = defaultMessage;
      return defaultMessage;
    }

    switch (apiError.code) {
      case ErrorCodes.UNAUTHORIZED:
        errorMessage.value = 'You must be logged in to view this season';
        break;
      case ErrorCodes.FORBIDDEN:
        errorMessage.value = 'You do not have permission to view this season';
        break;
      case ErrorCodes.NOT_FOUND:
        errorMessage.value = 'Season not found';
        break;
      case ErrorCodes.INTERNAL_ERROR:
        errorMessage.value = 'Server error while loading season';
        break;
      default:
        handleCommonError(apiError, defaultMessage);
    }

    return errorMessage.value;
  }

  function handleSeasonCreateError(apiError: ApiError | undefined, defaultMessage = 'Failed to create season'): string | null {
    if (!apiError) {
      errorMessage.value = defaultMessage;
      return defaultMessage;
    }

    switch (apiError.code) {
      case ErrorCodes.UNAUTHORIZED:
        errorMessage.value = 'You must be logged in to create seasons';
        break;
      case ErrorCodes.FORBIDDEN:
        errorMessage.value = 'You do not have permission to create seasons';
        break;
      case ErrorCodes.VALIDATION_ERROR:
        if (apiError.details?.errors) {
          const validationErrors = formatValidationErrors(apiError.details.errors);
          errorMessage.value = `Validation errors: ${validationErrors}`;
        } else {
          errorMessage.value = 'Please check your season data and try again';
        }
        break;
      case ErrorCodes.ALREADY_EXISTS:
        errorMessage.value = 'A season with this title already exists';
        break;
      case ErrorCodes.UNIQUE_VIOLATION:
        errorMessage.value = 'Season title must be unique';
        break;
      case ErrorCodes.INTERNAL_ERROR:
        errorMessage.value = 'Server error while creating season';
        break;
      default:
        handleCommonError(apiError, defaultMessage);
    }

    return errorMessage.value;
  }

  function handleSeasonUpdateError(apiError: ApiError | undefined, defaultMessage = 'Failed to update season'): string | null {
    if (!apiError) {
      errorMessage.value = defaultMessage;
      return defaultMessage;
    }

    switch (apiError.code) {
      case ErrorCodes.UNAUTHORIZED:
        errorMessage.value = 'You must be logged in to update seasons';
        break;
      case ErrorCodes.FORBIDDEN:
        errorMessage.value = 'You do not have permission to update this season';
        break;
      case ErrorCodes.NOT_FOUND:
        errorMessage.value = 'Season not found';
        break;
      case ErrorCodes.VALIDATION_ERROR:
        if (apiError.details?.errors) {
          const validationErrors = formatValidationErrors(apiError.details.errors);
          errorMessage.value = `Validation errors: ${validationErrors}`;
        } else {
          errorMessage.value = 'Please check your season data and try again';
        }
        break;
      case ErrorCodes.INTERNAL_ERROR:
        errorMessage.value = 'Server error while updating season';
        break;
      default:
        handleCommonError(apiError, defaultMessage);
    }

    return errorMessage.value;
  }

  function handleSeasonPublishError(apiError: ApiError | undefined, defaultMessage = 'Failed to publish season'): string | null {
    if (!apiError) {
      errorMessage.value = defaultMessage;
      return defaultMessage;
    }

    switch (apiError.code) {
      case ErrorCodes.UNAUTHORIZED:
        errorMessage.value = 'You must be logged in to publish seasons';
        break;
      case ErrorCodes.FORBIDDEN:
        errorMessage.value = 'You do not have permission to publish this season';
        break;
      case ErrorCodes.NOT_FOUND:
        errorMessage.value = 'Season not found';
        break;
      case ErrorCodes.VALIDATION_ERROR:
        errorMessage.value = 'Season validation failed. Please check all requirements before publishing.';
        break;
      case ErrorCodes.INTERNAL_ERROR:
        errorMessage.value = 'Server error while publishing season';
        break;
      default:
        handleCommonError(apiError, defaultMessage);
    }

    return errorMessage.value;
  }

  function handleSeasonDeleteError(apiError: ApiError | undefined, defaultMessage = 'Failed to delete season'): string | null {
    if (!apiError) {
      errorMessage.value = defaultMessage;
      return defaultMessage;
    }

    switch (apiError.code) {
      case ErrorCodes.UNAUTHORIZED:
        errorMessage.value = 'You must be logged in to delete seasons';
        break;
      case ErrorCodes.FORBIDDEN:
        errorMessage.value = 'You do not have permission to delete this season';
        break;
      case ErrorCodes.NOT_FOUND:
        errorMessage.value = 'Season not found';
        break;
      case ErrorCodes.VALIDATION_ERROR:
        errorMessage.value = 'Cannot delete published seasons';
        break;
      case ErrorCodes.INTERNAL_ERROR:
        errorMessage.value = 'Server error while deleting season';
        break;
      default:
        handleCommonError(apiError, defaultMessage);
    }

    return errorMessage.value;
  }

  return {
    error,
    errorMessage,
    clearError,
    handleSeasonsFetchError,
    handleSeasonFetchError,
    handleSeasonCreateError,
    handleSeasonUpdateError,
    handleSeasonPublishError,
    handleSeasonDeleteError
  };
}
