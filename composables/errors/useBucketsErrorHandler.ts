import { useBaseErrorHandler } from './useBaseErrorHandler';
import type { ApiError } from '~/types/api';

export const useBucketsErrorHandler = () => {
  const { handleCommonError } = useBaseErrorHandler();

  const handleBucketsFetchError = (error: ApiError): string => {
    switch (error.code) {
      case 'UNAUTHORIZED':
        return 'You are not authorized to view buckets';
      case 'FORBIDDEN':
        return 'Access to buckets is forbidden';
      case 'NOT_FOUND':
        return 'Buckets not found';
      case 'VALIDATION_ERROR':
        return 'Invalid bucket query parameters';
      case 'INTERNAL_ERROR':
        return 'Failed to fetch buckets due to server error';
      default:
        return handleCommonError(error);
    }
  };

  const handleBucketFetchError = (error: ApiError): string => {
    switch (error.code) {
      case 'UNAUTHORIZED':
        return 'You are not authorized to view this bucket';
      case 'FORBIDDEN':
        return 'Access to this bucket is forbidden';
      case 'NOT_FOUND':
        return 'Bucket not found';
      case 'INTERNAL_ERROR':
        return 'Failed to fetch bucket due to server error';
      default:
        return handleCommonError(error);
    }
  };

  const handleBucketCreateError = (error: ApiError): string => {
    switch (error.code) {
      case 'UNAUTHORIZED':
        return 'You are not authorized to create buckets';
      case 'FORBIDDEN':
        return 'Only administrators can create buckets';
      case 'VALIDATION_ERROR':
        return 'Invalid bucket data. Please check your input.';
      case 'UNIQUE_VIOLATION':
        return 'A bucket with this name already exists for this week';
      case 'INTERNAL_ERROR':
        return 'Failed to create bucket due to server error';
      default:
        return handleCommonError(error);
    }
  };

  const handleBucketUpdateError = (error: ApiError): string => {
    switch (error.code) {
      case 'UNAUTHORIZED':
        return 'You are not authorized to update buckets';
      case 'FORBIDDEN':
        return 'Only administrators can update buckets';
      case 'NOT_FOUND':
        return 'Bucket not found';
      case 'VALIDATION_ERROR':
        return 'Invalid bucket update data. Please check your input.';
      case 'UNIQUE_VIOLATION':
        return 'A bucket with this name already exists for this week';
      case 'INTERNAL_ERROR':
        return 'Failed to update bucket due to server error';
      default:
        return handleCommonError(error);
    }
  };

  const handleBucketDeleteError = (error: ApiError): string => {
    switch (error.code) {
      case 'UNAUTHORIZED':
        return 'You are not authorized to delete buckets';
      case 'FORBIDDEN':
        return 'Only administrators can delete buckets';
      case 'NOT_FOUND':
        return 'Bucket not found';
      case 'CONSTRAINT_VIOLATION':
        return 'Cannot delete bucket - it is being used by other entities';
      case 'INTERNAL_ERROR':
        return 'Failed to delete bucket due to server error';
      default:
        return handleCommonError(error);
    }
  };

  const handleBucketValidationError = (error: ApiError): string => {
    switch (error.code) {
      case 'UNAUTHORIZED':
        return 'You are not authorized to validate buckets';
      case 'FORBIDDEN':
        return 'Access to bucket validation is forbidden';
      case 'NOT_FOUND':
        return 'Season or week not found for validation';
      case 'VALIDATION_ERROR':
        return 'Invalid validation parameters';
      case 'INTERNAL_ERROR':
        return 'Failed to validate buckets due to server error';
      default:
        return handleCommonError(error);
    }
  };

  return {
    handleBucketsFetchError,
    handleBucketFetchError,
    handleBucketCreateError,
    handleBucketUpdateError,
    handleBucketDeleteError,
    handleBucketValidationError
  };
};
