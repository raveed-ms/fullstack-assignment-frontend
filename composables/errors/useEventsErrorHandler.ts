import { useBaseErrorHandler } from './useBaseErrorHandler';
import type { ApiError } from '~/types/api';

export function useEventsErrorHandler() {
  const { error, errorMessage, handleCommonError, formatValidationErrors, clearError, isErrorCode, ErrorCodes } = useBaseErrorHandler();

  function handleEventsFetchError(apiError: ApiError | undefined, defaultMessage = 'Failed to load events'): string | null {
    if (!apiError) {
      errorMessage.value = defaultMessage;
      return defaultMessage;
    }

    switch (apiError.code) {
      case ErrorCodes.UNAUTHORIZED:
        errorMessage.value = 'You must be logged in to view events';
        break;
      case ErrorCodes.FORBIDDEN:
        errorMessage.value = 'You do not have permission to view these events';
        break;
      case ErrorCodes.VALIDATION_ERROR:
        errorMessage.value = 'Invalid search or filter parameters';
        break;
      case ErrorCodes.NOT_FOUND:
        errorMessage.value = 'Events not found';
        break;
      case ErrorCodes.INTERNAL_ERROR:
        errorMessage.value = 'Server error while loading events';
        break;
      default:
        handleCommonError(apiError, defaultMessage);
    }

    return errorMessage.value;
  }

  function handleEventFetchError(apiError: ApiError | undefined, defaultMessage = 'Failed to load event'): string | null {
    if (!apiError) {
      errorMessage.value = defaultMessage;
      return errorMessage.value;
    }

    switch (apiError.code) {
      case ErrorCodes.UNAUTHORIZED:
        errorMessage.value = 'You must be logged in to view this event';
        break;
      case ErrorCodes.FORBIDDEN:
        errorMessage.value = 'You do not have permission to view this event';
        break;
      case ErrorCodes.NOT_FOUND:
        errorMessage.value = 'Event not found';
        break;
      case ErrorCodes.INTERNAL_ERROR:
        errorMessage.value = 'Server error while loading event';
        break;
      default:
        handleCommonError(apiError, defaultMessage);
    }

    return errorMessage.value;
  }

  function handleEventCreateError(apiError: ApiError | undefined, defaultMessage = 'Failed to create event'): string | null {
    if (!apiError) {
      errorMessage.value = defaultMessage;
      return errorMessage.value;
    }

    switch (apiError.code) {
      case ErrorCodes.UNAUTHORIZED:
        errorMessage.value = 'You must be logged in to create events';
        break;
      case ErrorCodes.FORBIDDEN:
        errorMessage.value = 'You do not have permission to create events';
        break;
      case ErrorCodes.VALIDATION_ERROR:
        if (apiError.details?.errors) {
          const validationErrors = formatValidationErrors(apiError.details.errors);
          errorMessage.value = `Validation errors: ${validationErrors}`;
        } else {
          errorMessage.value = 'Please check your event data and try again';
        }
        break;
      case ErrorCodes.ALREADY_EXISTS:
        errorMessage.value = 'An event with this name already exists';
        break;
      case ErrorCodes.UNIQUE_VIOLATION:
        errorMessage.value = 'Event name must be unique';
        break;
      case ErrorCodes.INTERNAL_ERROR:
        errorMessage.value = 'Server error while creating event';
        break;
      default:
        handleCommonError(apiError, defaultMessage);
    }

    return errorMessage.value;
  }

  function handleEventUpdateError(apiError: ApiError | undefined, defaultMessage = 'Failed to update event'): string | null {
    if (!apiError) {
      errorMessage.value = defaultMessage;
      return errorMessage.value;
    }

    switch (apiError.code) {
      case ErrorCodes.UNAUTHORIZED:
        errorMessage.value = 'You must be logged in to update events';
        break;
      case ErrorCodes.FORBIDDEN:
        errorMessage.value = 'You do not have permission to update this event';
        break;
      case ErrorCodes.NOT_FOUND:
        errorMessage.value = 'Event not found';
        break;
      case ErrorCodes.VALIDATION_ERROR:
        if (apiError.details?.errors) {
          const validationErrors = formatValidationErrors(apiError.details.errors);
          errorMessage.value = `Validation errors: ${validationErrors}`;
        } else {
          errorMessage.value = 'Please check your event data and try again';
        }
        break;
      case ErrorCodes.ALREADY_EXISTS:
        errorMessage.value = 'An event with this name already exists';
        break;
      case ErrorCodes.UNIQUE_VIOLATION:
        errorMessage.value = 'Event name must be unique';
        break;
      case ErrorCodes.INTERNAL_ERROR:
        errorMessage.value = 'Server error while updating event';
        break;
      default:
        handleCommonError(apiError, defaultMessage);
    }

    return errorMessage.value;
  }

  function handleEventPublishError(apiError: ApiError | undefined, defaultMessage = 'Failed to publish event'): string | null {
    if (!apiError) {
      errorMessage.value = defaultMessage;
      return errorMessage.value;
    }

    switch (apiError.code) {
      case ErrorCodes.UNAUTHORIZED:
        errorMessage.value = 'You must be logged in to publish events';
        break;
      case ErrorCodes.FORBIDDEN:
        errorMessage.value = 'Only administrators can publish events';
        break;
      case ErrorCodes.NOT_FOUND:
        errorMessage.value = 'Event not found';
        break;
      case ErrorCodes.VALIDATION_ERROR:
        errorMessage.value = 'Only draft events can be published';
        break;
      case ErrorCodes.INTERNAL_ERROR:
        errorMessage.value = 'Server error while publishing event';
        break;
      default:
        handleCommonError(apiError, defaultMessage);
    }

    return errorMessage.value;
  }

  function handleEventArchiveError(apiError: ApiError | undefined, defaultMessage = 'Failed to archive event'): string | null {
    if (!apiError) {
      errorMessage.value = defaultMessage;
      return errorMessage.value;
    }

    switch (apiError.code) {
      case ErrorCodes.UNAUTHORIZED:
        errorMessage.value = 'You must be logged in to archive events';
        break;
      case ErrorCodes.FORBIDDEN:
        errorMessage.value = 'Only administrators can archive events';
        break;
      case ErrorCodes.NOT_FOUND:
        errorMessage.value = 'Event not found';
        break;
      case ErrorCodes.VALIDATION_ERROR:
        errorMessage.value = 'Only published events can be archived';
        break;
      case ErrorCodes.INTERNAL_ERROR:
        errorMessage.value = 'Server error while archiving event';
        break;
      default:
        handleCommonError(apiError, defaultMessage);
    }

    return errorMessage.value;
  }

  function handleEventDeleteError(apiError: ApiError | undefined, defaultMessage = 'Failed to delete event'): string | null {
    if (!apiError) {
      errorMessage.value = defaultMessage;
      return errorMessage.value;
    }

    switch (apiError.code) {
      case ErrorCodes.UNAUTHORIZED:
        errorMessage.value = 'You must be logged in to delete events';
        break;
      case ErrorCodes.FORBIDDEN:
        errorMessage.value = 'Only administrators can delete events';
        break;
      case ErrorCodes.NOT_FOUND:
        errorMessage.value = 'Event not found';
        break;
      case ErrorCodes.VALIDATION_ERROR:
        errorMessage.value = 'Only draft events can be deleted';
        break;
      case ErrorCodes.INTERNAL_ERROR:
        errorMessage.value = 'Server error while deleting event';
        break;
      default:
        handleCommonError(apiError, defaultMessage);
    }

    return errorMessage.value;
  }

  return {
    error,
    errorMessage,
    handleEventsFetchError,
    handleEventFetchError,
    handleEventCreateError,
    handleEventUpdateError,
    handleEventPublishError,
    handleEventArchiveError,
    handleEventDeleteError,
    clearError,
    isErrorCode,
    ErrorCodes
  };
}
