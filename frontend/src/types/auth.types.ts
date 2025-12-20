/**
 * Authentication TypeScript Interfaces
 * 
 * Defines all type definitions for the authentication domain.
 * These interfaces provide compile-time type safety and serve as
 * contracts between frontend components, Redux state, and backend API.
 */

/**
 * User entity returned from backend API
 * Represents an authenticated user in the system
 */
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt?: string; // ISO 8601 datetime
  updatedAt?: string; // ISO 8601 datetime
}

/**
 * Redux authentication state
 * Manages global auth state across the application
 */
export interface AuthState {
  currentUser: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Login credentials (request payload)
 * Sent to POST /api/auth/login
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Registration data (request payload)
 * Sent to POST /api/auth/register
 */
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: 'USER' | 'ADMIN'; // Optional, defaults to USER on backend
}

/**
 * Authentication response from backend
 * Returned by both login and register endpoints
 */
export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: number; // seconds until token expiry (typically 900 for 15 minutes)
}

/**
 * API error response structure
 * Standardized error format from backend
 */
export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string[]>; // Field-level validation errors
  timestamp?: string; // ISO 8601 datetime when error occurred
}

/**
 * Type guard to check if an object is a valid User
 * Provides runtime type validation for API responses
 */
export function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    typeof (obj as User).id === 'number' &&
    'username' in obj &&
    typeof (obj as User).username === 'string' &&
    'email' in obj &&
    typeof (obj as User).email === 'string' &&
    'role' in obj &&
    ['USER', 'ADMIN'].includes((obj as User).role)
  );
}

/**
 * Type guard to check if an object is a valid AuthResponse
 * Ensures API response matches expected contract
 */
export function isAuthResponse(obj: unknown): obj is AuthResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'user' in obj &&
    isUser((obj as AuthResponse).user) &&
    'token' in obj &&
    typeof (obj as AuthResponse).token === 'string' &&
    'expiresIn' in obj &&
    typeof (obj as AuthResponse).expiresIn === 'number'
  );
}
