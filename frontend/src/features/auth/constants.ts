export const AUTH_ROLES = {
  USER: 1,
  ADMIN: 2,
} as const;

export const PASSWORD_VISIBILITY = {
  SHOW: 'text',
  HIDE: 'password',
} as const;

export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful! Welcome back.',
  REGISTER_SUCCESS: 'Registration successful! Please login with your credentials.',
  LOGOUT_SUCCESS: 'You have been logged out successfully.',
  LOGIN_ERROR: 'Invalid username or password.',
  REGISTER_ERROR: 'Registration failed. Please try again.',
  TOKEN_EXPIRED: 'Your session has expired. Please login again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
} as const;
