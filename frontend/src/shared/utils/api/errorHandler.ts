import { AxiosError } from 'axios';
import type { ApiResponse } from '../../types';

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const response = error.response?.data as ApiResponse<any>;
    // Backend returns error in response.error.message
    if (response?.error?.message) {
      return response.error.message;
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const isNetworkError = (error: unknown): boolean => {
  return error instanceof AxiosError && error.code === 'ERR_NETWORK';
};
