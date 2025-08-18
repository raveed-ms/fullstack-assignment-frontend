import { useBaseErrorHandler } from './useBaseErrorHandler';
import type { ApiError } from '~/types/api';

export function useWeeksErrorHandler() {
  const { error, errorMessage, handleCommonError, formatValidationErrors, clearError, isErrorCode, ErrorCodes } = useBaseErrorHandler();

  function handleWeeksFetchError(apiError: ApiError | undefined, defaultMessage = 'Failed to load weeks'): string | null {
    if (!apiError) {
      errorMessage.value = defaultMessage;
      return defaultMessage;
    }

    switch (apiError.code) {
      case ErrorCodes.UNAUTHORIZED:
        errorMessage.value = 'You must be logged in to view weeks';
        break;
      case ErrorCodes.FORBIDDEN:
        errorMessage.value = 'You do not have permission to view these weeks';
        break;
      case ErrorCodes.VALIDATION_ERROR:
        errorMessage.value = 'Invalid search or filter parameters';
        break;
      case ErrorCodes.NOT_FOUND:
        errorMessage.value = 'Weeks not found';
        break;
      case ErrorCodes.INTERNAL_ERROR:
        errorMessage.value = 'Server error while loading weeks';
        break;
      default:
        handleCommonError(apiError, defaultMessage);
    }

    return errorMessage.value;
  }

  function handleWeekFetchError(apiError: ApiError | undefined, defaultMessage = 'Failed to load week'): string | null {
    if (!apiError) {
      errorMessage.value = defaultMessage;
      return defaultMessage;
    }

    switch (apiError.code) {
      case ErrorCodes.UNAUTHORIZED:
        errorMessage.value = 'You must be logged in to view this week';
        break;
      case ErrorCodes.FORBIDDEN:
        errorMessage.value = 'You do not have permission to view this week';
        break;
      case ErrorCodes.NOT_FOUND:
        errorMessage.value = 'Week not found';
        break;
      case ErrorCodes.INTERNAL_ERROR:
        errorMessage.value = 'Server error while loading week';
        break;
      default:
        handleCommonError(apiError, defaultMessage);
    }

    return errorMessage.value;
  }

  function handleWeekCreateError(apiError: ApiError | undefined, defaultMessage = 'Failed to create week'): string | null {
    if (!apiError) {
      errorMessage.value = defaultMessage;
      return defaultMessage;
    }

    switch (apiError.code) {
      case ErrorCodes.UNAUTHORIZED:
        errorMessage.value = 'You must be logged in to create weeks';
        break;
      case ErrorCodes.FORBIDDEN:
        errorMessage.value = 'You do not have permission to create weeks';
        break;
      case ErrorCodes.VALIDATION_ERROR:
        if (apiError.details?.errors) {
          const validationErrors = formatValidationErrors(apiError.details.errors);
          errorMessage.value = `Validation errors: ${validationErrors}`;
        } else {
          errorMessage.value = 'Please check your week data and try again';
        }
        break;
      case ErrorCodes.ALREADY_EXISTS:
        errorMessage.value = 'A week with this number already exists for this season';
        break;
      case ErrorCodes.INTERNAL_ERROR:
        errorMessage.value = 'Server error while creating week';
        break;
      default:
        handleCommonError(apiError, defaultMessage);
    }

    return errorMessage.value;
  }

  function handleWeekUpdateError(apiError: ApiError | undefined, defaultMessage = 'Failed to update week'): string | null {
    if (!apiError) {
      errorMessage.value = defaultMessage;
      return defaultMessage;
    }

    switch (apiError.code) {
      case ErrorCodes.UNAUTHORIZED:
        errorMessage.value = 'You must be logged in to update weeks';
        break;
      case ErrorCodes.FORBIDDEN:
        errorMessage.value = 'You do not have permission to update this week';
        break;
      case ErrorCodes.NOT_FOUND:
        errorMessage.value = 'Week not found';
        break;
      case ErrorCodes.VALIDATION_ERROR:
        if (apiError.details?.errors) {
          const validationErrors = formatValidationErrors(apiError.details.errors);
          errorMessage.value = `Validation errors: ${validationErrors}`;
        } else {
          errorMessage.value = 'Please check your week data and try again';
        }
        break;
      case ErrorCodes.INTERNAL_ERROR:
        errorMessage.value = 'Server error while updating week';
        break;
      default:
        handleCommonError(apiError, defaultMessage);
    }

    return errorMessage.value;
  }

  function handleWeekDeleteError(apiError: ApiError | undefined, defaultMessage = 'Failed to delete week'): string | null {
    if (!apiError) {
      errorMessage.value = defaultMessage;
      return defaultMessage;
    }

    switch (apiError.code) {
      case ErrorCodes.UNAUTHORIZED:
        errorMessage.value = 'You must be logged in to delete weeks';
        break;
      case ErrorCodes.FORBIDDEN:
        errorMessage.value = 'You do not have permission to delete this week';
        break;
      case ErrorCodes.NOT_FOUND:
        errorMessage.value = 'Week not found';
        break;
      case ErrorCodes.VALIDATION_ERROR:
        errorMessage.value = 'Cannot delete week - it may have associated data';
        break;
      case ErrorCodes.INTERNAL_ERROR:
        errorMessage.value = 'Server error while deleting week';
        break;
      default:
        handleCommonError(apiError, defaultMessage);
    }

    return errorMessage.value;
  }

  function handleWeeksBySeasonError(apiError: ApiError | undefined, defaultMessage = 'Failed to load weeks for season'): string | null {
    if (!apiError) {
      errorMessage.value = defaultMessage;
      return defaultMessage;
    }

    switch (apiError.code) {
      case ErrorCodes.UNAUTHORIZED:
        errorMessage.value = 'You must be logged in to view season weeks';
        break;
      case ErrorCodes.FORBIDDEN:
        errorMessage.value = 'You do not have permission to view these weeks';
        break;
      case ErrorCodes.NOT_FOUND:
        errorMessage.value = 'Season not found';
        break;
      case ErrorCodes.INTERNAL_ERROR:
        errorMessage.value = 'Server error while loading season weeks';
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
    handleWeeksFetchError,
    handleWeekFetchError,
    handleWeekCreateError,
    handleWeekUpdateError,
    handleWeekDeleteError,
    handleWeeksBySeasonError
  };
}
