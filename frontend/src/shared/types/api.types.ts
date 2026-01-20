/**
 * Backend error response format
 * Matches the ErrorResponse class from backend
 */
export interface BackendErrorResponse {
  code: string;
  message: string;
  timestamp: string;
}

/**
 * Generic API response wrapper
 * Supports both success responses and backend error format
 */
export interface ApiResponse<T> {
  // Success response fields
  success?: boolean;
  data?: T;
  // Backend error response fields
  code?: string;
  message?: string;
  timestamp?: string;
  // Legacy error format (kept for backwards compatibility)
  error?: {
    message: string;
    status: number;
    errors?: Record<string, string[]>;
    timestamp?: string;
  };
}

export interface ApiErrorResponse {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

