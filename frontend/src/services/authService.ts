/**
 * Authentication Service
 * 
 * Handles all authentication-related API calls:
 * - User registration
 * - User login
 * - Token validation
 * 
 * Uses configured Axios instance for automatic token injection
 * and error handling via interceptors.
 */

import axiosInstance from './api';
import type { LoginCredentials, RegisterData, AuthResponse } from '../types/auth.types';
import env from '../config/env';

/**
 * Register a new user account
 * 
 * @param registerData - User registration information
 * @returns Promise with AuthResponse (user + token)
 * @throws ApiError on validation errors or server errors
 * 
 * API Endpoint: POST /api/auth/register
 * Success: 201 Created with { user, token, expiresIn }
 * Errors:
 *   - 400: Validation errors (username/email taken, invalid format)
 *   - 500: Server error
 */
export const register = async (registerData: RegisterData): Promise<AuthResponse> => {
  try {
    if (env.isDevelopment) {
      console.log('[authService.register] Registering user:', registerData.username);
    }

    const response = await axiosInstance.post<AuthResponse>(
      '/auth/register',
      registerData
    );

    if (env.isDevelopment) {
      console.log('[authService.register] ✅ Registration successful:', response.data.user.username);
    }

    return response.data;
  } catch (error: unknown) {
    if (env.isDevelopment) {
      console.error('[authService.register] ❌ Registration failed:', error);
    }
    throw error;
  }
};

/**
 * Login with username and password
 * 
 * @param credentials - Username and password
 * @returns Promise with AuthResponse (user + token)
 * @throws ApiError on invalid credentials or server errors
 * 
 * API Endpoint: POST /api/auth/login
 * Success: 200 OK with { user, token, expiresIn }
 * Errors:
 *   - 401: Invalid credentials
 *   - 500: Server error
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    if (env.isDevelopment) {
      console.log('[authService.login] Logging in user:', credentials.username);
    }

    const response = await axiosInstance.post<AuthResponse>(
      '/auth/login',
      credentials
    );

    if (env.isDevelopment) {
      console.log('[authService.login] ✅ Login successful:', response.data.user.username);
    }

    return response.data;
  } catch (error: unknown) {
    if (env.isDevelopment) {
      console.error('[authService.login] ❌ Login failed:', error);
    }
    throw error;
  }
};

/**
 * Logout user (client-side only)
 * 
 * Note: Backend doesn't have a logout endpoint since JWT is stateless.
 * Logout is performed by clearing localStorage and Redux state.
 * 
 * In future, this could call a backend endpoint to:
 * - Blacklist the token
 * - Update last activity timestamp
 * - Audit log the logout event
 */
export const logout = (): void => {
  if (env.isDevelopment) {
    console.log('[authService.logout] Logging out user (client-side only)');
  }
  // Logout is handled by clearing localStorage in tokenService
  // No backend call needed for JWT-based auth
};

/**
 * Default export of all auth service methods
 */
export default {
  register,
  login,
  logout,
};
