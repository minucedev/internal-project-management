import { AxiosError } from 'axios';
import type { BackendErrorResponse } from '../../types';
import { ERROR_MESSAGES } from '../../constants/error-codes.constants';

/**
 * Extract user-friendly error message from various error types
 * Prioritizes backend error codes with Vietnamese translations
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const response = error.response?.data as BackendErrorResponse;

    // Handle backend error response with error codes
    if (response?.code) {
      // Return user-friendly Vietnamese message if available
      const userFriendlyMessage = ERROR_MESSAGES[response.code];
      if (userFriendlyMessage) {
        return userFriendlyMessage;
      }
      // Fall back to backend message
      return response.message || 'Đã xảy ra lỗi';
    }

    // Handle legacy error format
    if (error.response?.data?.error?.message) {
      return error.response.data.error.message;
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Đã xảy ra lỗi không xác định';
};

/**
 * Extract error code from backend error response
 */
export const getErrorCode = (error: unknown): string | null => {
  if (error instanceof AxiosError) {
    const response = error.response?.data as BackendErrorResponse;
    return response?.code || null;
  }
  return null;
};

export const isNetworkError = (error: unknown): boolean => {
  return error instanceof AxiosError && error.code === 'ERR_NETWORK';
};
