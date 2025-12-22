/**
 * Axios API Client Configuration
 * 
 * Creates a configured Axios instance with:
 * - Base URL and timeout from environment config
 * - Request interceptor for JWT token injection
 * - Response interceptor for global error handling
 * 
 * Error Handling Strategy:
 * - 401 Unauthorized: Auto-logout and redirect to login
 * - 403 Forbidden: Show permission error
 * - 500+ Server Errors: Show generic error message
 * - Network Errors: Show connection error
 */

import axios from 'axios'; 
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import env from '../config/env';
import { tokenService } from './tokenService';
import type { ApiError } from '../types/auth.types';

/**
 * Create Axios instance with base configuration
 */
export const axiosInstance = axios.create({
  baseURL: env.api.baseURL,
  timeout: env.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor: Attach JWT token to all requests
 * 
 * Automatically adds Authorization header with Bearer token
 * if user is authenticated.
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenService.getToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (env.isDevelopment) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor: Global error handling
 * 
 * Handles common error scenarios:
 * - 401: Token expired or invalid → logout + redirect
 * - 403: Permission denied → show error
 * - 500+: Server error → show generic message
 * - Network: Connection issues → show connection error
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (env.isDevelopment) {
      console.log(`[API Response] ${response.config.url}`, response.status);
    }
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Network Error (no response from server)
    if (!error.response) {
      console.error('❌ Network Error:', error.message);
      return Promise.reject({
        message: 'Network error. Please check your connection and try again.',
        code: 'NETWORK_ERROR',
      } as ApiError);
    }

    const { status, data } = error.response;

    // 401 Unauthorized: Token expired or invalid
    if (status === 401) {
      console.warn('⚠️ 401 Unauthorized: Token expired or invalid');
      
      // Clear authentication data
      tokenService.clearAuth();
      
      // Redirect to login (only if not already on login page)
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      
      return Promise.reject({
        message: data?.message || 'Session expired. Please login again.',
        code: 'UNAUTHORIZED',
      } as ApiError);
    }

    // 403 Forbidden: User lacks permission
    if (status === 403) {
      console.error('❌ 403 Forbidden:', data?.message);
      return Promise.reject({
        message: data?.message || 'You do not have permission to access this resource.',
        code: 'FORBIDDEN',
      } as ApiError);
    }

    // 500+ Internal Server Error
    if (status >= 500) {
      console.error('❌ Server Error:', status, data);
      return Promise.reject({
        message: data?.message || 'Server error. Please try again later.',
        code: 'SERVER_ERROR',
      } as ApiError);
    }

    // 400-499 Client Errors (validation, not found, etc.)
    if (status >= 400 && status < 500) {
      return Promise.reject({
        message: data?.message || 'An error occurred with your request.',
        code: data?.code || 'CLIENT_ERROR',
        details: data?.details,
      } as ApiError);
    }

    // Generic error fallback
    return Promise.reject({
      message: data?.message || 'An unexpected error occurred.',
      code: 'UNKNOWN_ERROR',
    } as ApiError);
  }
);

/**
 * Export configured Axios instance
 * Use this for all API calls in the application
 */
export default axiosInstance;
