/**
 * Token Storage Service
 * 
 * Manages JWT token and user data persistence in localStorage.
 * Provides abstraction layer for token storage operations.
 * 
 * Security Note: Using localStorage for MVP (accepts XSS risk).
 * Future enhancement: Migrate to httpOnly cookies for better security.
 */

import env from '../config/env';
import type { User } from '../types/auth.types';

/**
 * Token Service - localStorage operations for authentication
 */
export const tokenService = {
  /**
   * Retrieve JWT token from localStorage
   * @returns Token string or null if not found
   */
  getToken(): string | null {
    try {
      return localStorage.getItem(env.auth.tokenStorageKey);
    } catch (error) {
      console.error('Failed to get token from localStorage:', error);
      return null;
    }
  },

  /**
   * Store JWT token in localStorage
   * @param token - JWT token string to store
   */
  setToken(token: string): void {
    try {
      localStorage.setItem(env.auth.tokenStorageKey, token);
    } catch (error) {
      console.error('Failed to set token in localStorage:', error);
    }
  },

  /**
   * Remove JWT token from localStorage
   */
  removeToken(): void {
    try {
      localStorage.removeItem(env.auth.tokenStorageKey);
    } catch (error) {
      console.error('Failed to remove token from localStorage:', error);
    }
  },

  /**
   * Retrieve user data from localStorage
   * @returns User object or null if not found/invalid
   */
  getUser(): User | null {
    try {
      const userJson = localStorage.getItem(env.auth.userStorageKey);
      if (!userJson) return null;
      
      return JSON.parse(userJson) as User;
    } catch (error) {
      console.error('Failed to get user from localStorage:', error);
      return null;
    }
  },

  /**
   * Store user data in localStorage
   * @param user - User object to store
   */
  setUser(user: User): void {
    try {
      localStorage.setItem(env.auth.userStorageKey, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to set user in localStorage:', error);
    }
  },

  /**
   * Remove user data from localStorage
   */
  removeUser(): void {
    try {
      localStorage.removeItem(env.auth.userStorageKey);
    } catch (error) {
      console.error('Failed to remove user from localStorage:', error);
    }
  },

  /**
   * Clear all authentication data from localStorage
   * Use this on logout or when token expires
   */
  clearAuth(): void {
    this.removeToken();
    this.removeUser();
  },

  /**
   * Check if user is authenticated (has valid token)
   * Note: This only checks presence, not expiry
   * @returns true if token exists
   */
  hasToken(): boolean {
    return this.getToken() !== null;
  },

  /**
   * Validate token expiry (basic check)
   * @returns true if token exists and is not expired
   * Note: Full validation happens on backend
   */
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Decode JWT payload (basic validation)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000; // Convert to milliseconds
      
      return Date.now() < expiryTime;
    } catch (error) {
      console.error('Failed to validate token:', error);
      return false;
    }
  },
};
