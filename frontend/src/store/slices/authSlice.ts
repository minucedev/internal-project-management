/**
 * Authentication Redux Slice
 * 
 * Manages global authentication state using Redux Toolkit.
 * Provides actions and reducers for:
 * - User login
 * - User registration
 * - User logout
 * - Session initialization from localStorage
 * 
 * Uses Redux Toolkit's createSlice for automatic action creators
 * and immer-based immutable state updates.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User, LoginCredentials, RegisterData, AuthResponse } from '../../types/auth.types';
import { tokenService } from '../../services/tokenService';
import authService from '../../services/authService';

/**
 * Initial authentication state
 */
const initialState: AuthState = {
  currentUser: null,
  token: null,
  isLoading: false,
  error: null,
};

/**
 * Async thunk for user login
 * Calls authService.login() and handles success/error
 */
export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error: unknown) {
      // Extract error message from API error
      const message = (error as { message?: string })?.message || 'Login failed. Please check your credentials.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Async thunk for user registration
 * Calls authService.register() and handles success/error
 */
export const registerUser = createAsyncThunk<
  AuthResponse,
  RegisterData,
  { rejectValue: string }
>(
  'auth/register',
  async (registerData, { rejectWithValue }) => {
    try {
      const response = await authService.register(registerData);
      return response;
    } catch (error: unknown) {
      // Extract error message from API error
      const message = (error as { message?: string })?.message || 'Registration failed. Please try again.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Authentication slice with reducers and actions
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Initialize auth state from localStorage on app startup
     */
    initializeAuth: (state) => {
      const token = tokenService.getToken();
      const user = tokenService.getUser();

      if (token && user) {
        // Validate token before restoring state
        if (tokenService.isTokenValid()) {
          state.token = token;
          state.currentUser = user;
        } else {
          // Token expired, clear storage
          tokenService.clearAuth();
        }
      }
    },

    /**
     * Clear authentication state and localStorage on logout
     */
    logout: (state) => {
      state.currentUser = null;
      state.token = null;
      state.error = null;
      tokenService.clearAuth();
    },

    /**
     * Clear error message
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Set authentication state manually (for auto-login after registration)
     */
    setAuth: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      
      // Persist to localStorage
      tokenService.setToken(action.payload.token);
      tokenService.setUser(action.payload.user);
    },
  },
  extraReducers: (builder) => {
    // Login thunk reducers
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.currentUser = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        
        // Persist to localStorage
        tokenService.setToken(action.payload.token);
        tokenService.setUser(action.payload.user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
      });

    // Register thunk reducers
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.currentUser = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        
        // Persist to localStorage (auto-login after registration)
        tokenService.setToken(action.payload.token);
        tokenService.setUser(action.payload.user);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Registration failed';
      });
  },
});

// Export actions
export const { initializeAuth, logout, clearError, setAuth } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
