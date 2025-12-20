/**
 * Redux Store Configuration
 * 
 * Configures the global Redux store with:
 * - Redux Toolkit's configureStore
 * - Auth slice reducer
 * - Redux DevTools integration (development only)
 * - Type-safe hooks for TypeScript
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import env from '../config/env';

/**
 * Configure Redux store with all reducers
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add more reducers here as the app grows
  },
  devTools: env.development.enableReduxDevtools && env.isDevelopment,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore actions that contain non-serializable values
        // (e.g., functions, promises, etc.)
        ignoredActions: ['auth/login/pending', 'auth/register/pending'],
      },
    }),
});

/**
 * Type definitions for TypeScript
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/**
 * Type-safe hooks for use throughout the app
 * Use these instead of plain `useDispatch` and `useSelector`
 */
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
