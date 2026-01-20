export interface ApiResponse<T> {
  success: boolean;
  data: T;
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
