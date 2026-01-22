export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user_info',
  THEME: 'theme',
};

export const storage = {
  getItem: <T>(key: string, defaultValue: T | null = null): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch (error) {
      console.error(`Error reading storage key "${key}":`, error);
      return defaultValue;
    }
  },

  setItem: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting storage key "${key}":`, error);
    }
  },

  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing storage key "${key}":`, error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },

  getToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  setToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  clearToken: (): void => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  clearRefreshToken: (): void => {
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  },
};
