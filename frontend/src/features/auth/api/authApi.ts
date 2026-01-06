import { axiosInstance } from '@/shared/utils/api';
import { API_ENDPOINTS } from '@/shared/constants';
import type { ApiResponse } from '@/shared/types';
import type { LoginRequest, RegisterRequest, LoginResponse } from '../types';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data.data;
  },

  register: async (data: Omit<RegisterRequest, 'confirmPassword'>): Promise<void> => {
    await axiosInstance.post<ApiResponse<string>>(API_ENDPOINTS.AUTH.REGISTER, data);
  },

  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
};
