export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  roleID?: number;
}

export interface LoginResponse {
  userId: number;
  username: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

export interface User {
  userId: number;
  username: string;
  email: string;
  role?: {
    id: number;
    name: string;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
