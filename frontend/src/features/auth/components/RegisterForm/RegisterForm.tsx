import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { FormInput } from '@/shared/components/form';
import { useToggle } from '@/shared/hooks';
import { useRegister } from '../../hooks';
import { registerSchema, type RegisterFormData } from '../../utils/validation';
import { APP_ROUTES } from '@/shared/constants';

export const RegisterForm = () => {
  const [showPassword, togglePassword] = useToggle(false);
  const [showConfirmPassword, toggleConfirmPassword] = useToggle(false);
  const { mutate: register, isPending } = useRegister();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    // Remove confirmPassword before sending to API
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...registerData } = data;
    register(registerData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FormInput
        name="username"
        register={registerField}
        errors={errors}
        label="Tên đăng nhập"
        type="text"
        placeholder="Nhập tên đăng nhập"
        autoFocus
        disabled={isPending}
      />

      <FormInput
        name="email"
        register={registerField}
        errors={errors}
        label="Email"
        type="email"
        placeholder="Nhập địa chỉ email"
        disabled={isPending}
      />

      <FormInput
        name="password"
        register={registerField}
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

      <FormInput
        name="confirmPassword"
        register={registerField}
        errors={errors}
        label="Xác nhận mật khẩu"
        type={showConfirmPassword ? 'text' : 'password'}
        placeholder="Nhập lại mật khẩu"
        disabled={isPending}
        rightIcon={
          <button
            type="button"
            onClick={toggleConfirmPassword}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors cursor-pointer text-gray-500 hover:text-gray-700"
            tabIndex={-1}
            title={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
            aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
          >
            {showConfirmPassword ? (
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
          {isPending ? 'Đang đăng ký...' : 'Đăng ký'}
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
        <span className="text-gray-600">Đã có tài khoản? </span>
        <Link
          to={APP_ROUTES.AUTH.LOGIN}
          className="font-semibold text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline transition-all duration-200"
        >
          Đăng nhập ngay
        </Link>
      </div>
    </form>
  );
};