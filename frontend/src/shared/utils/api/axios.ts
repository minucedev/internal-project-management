import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';
import { storage } from '../storage';
import { toast } from 'react-hot-toast';

const axiosInstance = axios.create({
  baseURL: env.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      storage.clearToken();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Handle Network Errors
    if (error.code === 'ERR_NETWORK') {
      toast.error('Lỗi kết nối. Vui lòng kiểm tra mạng của bạn.');
      return Promise.reject(error);
    }

    // Let components handle other errors with getErrorMessage
    return Promise.reject(error);
  }
);

export default axiosInstance;
