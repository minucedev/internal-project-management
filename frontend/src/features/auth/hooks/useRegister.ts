import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { toast } from '@/shared/components/feedback';
import { APP_ROUTES } from '@/shared/constants';
import { getErrorMessage } from '@/shared/utils/api';
import { AUTH_MESSAGES } from '../constants';
import type { RegisterRequest } from '../types';

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: Omit<RegisterRequest, 'confirmPassword'>) => authApi.register(data),
    onSuccess: () => {
      toast.success(AUTH_MESSAGES.REGISTER_SUCCESS);
      navigate(APP_ROUTES.AUTH.LOGIN);
    },
    onError: (error: Error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};
