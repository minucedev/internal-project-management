import { LoginForm } from '../components';
import { AuthLayout } from '@/layouts';

export default function LoginPage() {
  return (
    <AuthLayout
      title="Đăng nhập"
      subtitle="Chào mừng bạn trở lại! Vui lòng đăng nhập để tiếp tục."
    >
      <LoginForm />
    </AuthLayout>
  );
}
