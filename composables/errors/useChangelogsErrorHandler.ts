import { useBaseErrorHandler } from './useBaseErrorHandler';
import type { ApiError } from '~/types/api';

export const useChangelogsErrorHandler = () => {
  const { handleCommonError } = useBaseErrorHandler();

  const handleChangelogsFetchError = (error: ApiError): string => {
    switch (error.code) {
      case 'UNAUTHORIZED':
        return 'You are not authorized to view changelogs';
      case 'FORBIDDEN':
        return 'Access to changelogs is forbidden';
      case 'NOT_FOUND':
        return 'Changelogs not found';
      case 'VALIDATION_ERROR':
        return 'Invalid changelog query parameters';
      case 'INTERNAL_ERROR':
        return 'Failed to fetch changelogs due to server error';
      default:
        return handleCommonError(error);
    }
  };





  const handleEntityHistoryError = (error: ApiError): string => {
    switch (error.code) {
      case 'UNAUTHORIZED':
        return 'You are not authorized to view entity history';
      case 'FORBIDDEN':
        return 'Access to entity history is forbidden';
      case 'NOT_FOUND':
        return 'Entity not found';
      case 'VALIDATION_ERROR':
        return 'Invalid entity history query parameters';
      case 'INTERNAL_ERROR':
        return 'Failed to fetch entity history due to server error';
      default:
        return handleCommonError(error);
    }
  };

  const handleUserHistoryError = (error: ApiError): string => {
    switch (error.code) {
      case 'UNAUTHORIZED':
        return 'You are not authorized to view user history';
      case 'FORBIDDEN':
        return 'Access to user history is forbidden';
      case 'NOT_FOUND':
        return 'User not found';
      case 'VALIDATION_ERROR':
        return 'Invalid user history query parameters';
      case 'INTERNAL_ERROR':
        return 'Failed to fetch user history due to server error';
      default:
        return handleCommonError(error);
    }
  };

  const handleDateRangeError = (error: ApiError): string => {
    switch (error.code) {
      case 'UNAUTHORIZED':
        return 'You are not authorized to view date range changelogs';
      case 'FORBIDDEN':
        return 'Access to date range changelogs is forbidden';
      case 'VALIDATION_ERROR':
        return 'Invalid date range parameters. Please check your dates.';
      case 'INTERNAL_ERROR':
        return 'Failed to fetch date range changelogs due to server error';
      default:
        return handleCommonError(error);
    }
  };

  const handleChangelogCountError = (error: ApiError): string => {
    switch (error.code) {
      case 'UNAUTHORIZED':
        return 'You are not authorized to view changelog count';
      case 'FORBIDDEN':
        return 'Access to changelog count is forbidden';
      case 'VALIDATION_ERROR':
        return 'Invalid changelog count query parameters';
      case 'INTERNAL_ERROR':
        return 'Failed to fetch changelog count due to server error';
      default:
        return handleCommonError(error);
    }
  };

  return {
    handleChangelogsFetchError,
    handleEntityHistoryError,
    handleUserHistoryError,
    handleDateRangeError,
    handleChangelogCountError
  };
};
