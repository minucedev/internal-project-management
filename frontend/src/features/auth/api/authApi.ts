import { axiosInstance } from '@/shared/utils/api';
import { API_ENDPOINTS } from '@/shared/constants';
import type { ApiResponse } from '@/shared/types';
import type { LoginRequest, RegisterRequest, LoginResponse } from '../types';
import { storage } from '@/shared/utils/storage';

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data.data!;
  },

  register: async (data: Omit<RegisterRequest, 'confirmPassword'>): Promise<void> => {
    await axiosInstance.post<ApiResponse<string>>(API_ENDPOINTS.AUTH.REGISTER, data);
  },

  logout: async (): Promise<void> => {
    try {
      const refreshToken = storage.getRefreshToken();
      if (refreshToken) {
        await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await axiosInstance.post<ApiResponse<RefreshTokenResponse>>(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN,
      { refreshToken }
    );
    return response.data.data!;
  },
};

