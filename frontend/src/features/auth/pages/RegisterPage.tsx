import { RegisterForm } from '../components';
import { AuthLayout } from '@/layouts';

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Đăng ký tài khoản"
      subtitle="Tạo tài khoản mới để bắt đầu sử dụng hệ thống quản lý dự án."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
