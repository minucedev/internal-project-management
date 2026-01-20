import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';
import { storage } from '../storage';
import { getErrorMessage } from './errorHandler';
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
      // Clear token and redirect to login if needed
      // In a real app, you might try to refresh the token here
      storage.clearToken();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Handle Network Errors
    if (error.code === 'ERR_NETWORK') {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    // Handle other errors
    const message = getErrorMessage(error);
    // Optional: Show toast for all errors or let components handle it
    // toast.error(message); 
    
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
