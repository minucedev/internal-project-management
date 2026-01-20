import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { FormInput } from '@/shared/components/form';
import { useToggle } from '@/shared/hooks';
import { useLogin } from '../../hooks';
import { loginSchema, type LoginFormData } from '../../utils/validation';
import { APP_ROUTES } from '@/shared/constants';

export const LoginForm = () => {
  const [showPassword, togglePassword] = useToggle(false);
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FormInput
        name="username"
        register={register}
        errors={errors}
        label="Tên đăng nhập"
        type="text"
        placeholder="Nhập tên đăng nhập"
        autoFocus
        disabled={isPending}
      />

      <FormInput
        name="password"
        register={register}
        errors={errors}
        label="Mật khẩu"
        type={showPassword ? 'text' : 'password'}
        placeholder="Nhập mật khẩu"
        disabled={isPending}
        rightIcon={
          <button
            type="button"
            onClick={togglePassword}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors cursor-pointer text-gray-500 hover:text-gray-700"
            tabIndex={-1}
            title={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        }
      />

      <div className="pt-1">
        <Button
          type="submit"
          variant="primary"
          isLoading={isPending}
          fullWidth
          disabled={isPending}
        >
          {isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>
      </div>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 font-medium">Hoặc</span>
        </div>
      </div>

      <div className="text-center pt-2">
        <span className="text-gray-600">Chưa có tài khoản? </span>
        <Link
          to={APP_ROUTES.AUTH.REGISTER}
          className="font-semibold text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline transition-all duration-200"
        >
          Đăng ký ngay
        </Link>
      </div>
    </form>
  );
};