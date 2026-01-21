import { create } from 'zustand';
import type { User, AuthState } from '@/features/auth/types';
import { storage, STORAGE_KEYS } from '@/shared/utils/storage';
import { isTokenExpired } from '@/features/auth/utils/token';

interface AuthStore extends AuthState {
  setAuth: (user: User, token: string, refreshToken: string) => void;
  clearAuth: () => void;
  setLoading: (isLoading: boolean) => void;
  initializeAuth: () => void;
  updateUser: (updates: Partial<User>) => void;
  updateTokens: (accessToken: string, refreshToken?: string) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user: User, token: string, refreshToken: string) => {
    storage.setToken(token);
    storage.setRefreshToken(refreshToken);
    storage.setItem(STORAGE_KEYS.USER, user);
    set({
      user,
      token,
      refreshToken,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  clearAuth: () => {
    storage.clearToken();
    storage.removeItem(STORAGE_KEYS.USER);
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  initializeAuth: () => {
    const token = storage.getToken();
    const refreshToken = storage.getRefreshToken();
    const user = storage.getItem<User>(STORAGE_KEYS.USER);

    if (token && user && !isTokenExpired(token)) {
      set({
        user,
        token,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } else if (refreshToken && user) {
      // Access token expired but we have refresh token - still consider authenticated
      // The axios interceptor will handle token refresh on next API call
      set({
        user,
        token,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  updateUser: (updates: Partial<User>) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...updates };
      storage.setItem(STORAGE_KEYS.USER, updatedUser);
      return { user: updatedUser };
    });
  },

  updateTokens: (accessToken: string, refreshToken?: string) => {
    storage.setToken(accessToken);
    if (refreshToken) {
      storage.setRefreshToken(refreshToken);
    }
    set((state) => ({
      token: accessToken,
      refreshToken: refreshToken ?? state.refreshToken,
    }));
  },
}));

