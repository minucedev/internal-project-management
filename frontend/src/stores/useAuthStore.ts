import { create } from 'zustand';
import type { User, AuthState } from '@/features/auth/types';
import { storage, STORAGE_KEYS } from '@/shared/utils/storage';
import { isTokenExpired } from '@/features/auth/utils/token';

interface AuthStore extends AuthState {
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setLoading: (isLoading: boolean) => void;
  initializeAuth: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user: User, token: string) => {
    storage.setToken(token);
    storage.setItem(STORAGE_KEYS.USER, user);
    set({
      user,
      token,
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
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  initializeAuth: () => {
    const token = storage.getToken();
    const user = storage.getItem<User>(STORAGE_KEYS.USER);

    if (token && user && !isTokenExpired(token)) {
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      set({
        user: null,
        token: null,
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
}));
