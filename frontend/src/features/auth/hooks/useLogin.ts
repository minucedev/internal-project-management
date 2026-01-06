import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { useAuth } from './useAuth';
import { toast } from '@/shared/components/feedback';
import { APP_ROUTES } from '@/shared/constants';
import { getErrorMessage } from '@/shared/utils/api';
import { AUTH_MESSAGES } from '../constants';
import type { LoginRequest, LoginResponse } from '../types';

export const useLogin = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (response: LoginResponse) => {
      // Create user object from response
      const user = {
        userId: response.userId,
        username: response.username,
        email: response.email,
      };
      
      setAuth(user, response.accessToken);
      toast.success(AUTH_MESSAGES.LOGIN_SUCCESS);
      navigate(APP_ROUTES.DASHBOARD.ROOT);
    },
    onError: (error: Error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};
