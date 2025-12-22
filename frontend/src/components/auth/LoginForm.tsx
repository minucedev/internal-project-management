/**
 * LoginForm Component - Reusable Login Form
 * 
 * Features:
 * - Username and password fields with validation
 * - Remember me checkbox
 * - Forgot password link
 * - Loading state during submission
 * - Error alert display
 * - Link to registration page
 * - Terms & Privacy footer
 * - Fully typed with TypeScript
 */

import { Form, Input, Button, Alert, Typography, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

export interface LoginFormValues {
  username: string;
  password: string;
  remember?: boolean;
}

export interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onClearError: () => void;
}

/**
 * LoginForm Component
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading,
  error,
  onClearError,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: LoginFormValues) => {
    await onSubmit(values);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Title level={2} className="!text-neutral-900 !text-3xl !mb-2">
          Welcome Back
        </Title>
        <Text className="text-base text-neutral-600">
          Sign in to continue to your projects
        </Text>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          message="Login Failed"
          description={error}
          type="error"
          closable
          onClose={onClearError}
          showIcon
          className="rounded-xl border-error-200 bg-error-50"
        />
      )}

      {/* Login Form */}
      <Form
        form={form}
        name="login"
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="on"
        size="large"
        initialValues={{ remember: true }}
        className="space-y-1"
      >
        {/* Username Field */}
        <Form.Item
          name="username"
          label={<span className="text-sm font-medium text-neutral-700">Username</span>}
          rules={[
            { required: true, message: 'Please enter your username' },
            { min: 3, message: 'Username must be at least 3 characters' },
          ]}
          className="mb-4"
        >
          <Input
            prefix={<UserOutlined className="text-neutral-400" />}
            placeholder="Enter your username"
            disabled={isLoading}
            autoComplete="username"
            className="h-11 rounded-xl border-neutral-300 hover:border-primary-400 focus:border-primary-500 transition-all"
          />
        </Form.Item>

        {/* Password Field */}
        <Form.Item
          name="password"
          label={<span className="text-sm font-medium text-neutral-700">Password</span>}
          rules={[
            { required: true, message: 'Please enter your password' },
          ]}
          className="mb-3"
        >
          <Input.Password
            prefix={<LockOutlined className="text-neutral-400" />}
            placeholder="Enter your password"
            disabled={isLoading}
            autoComplete="current-password"
            className="h-11 rounded-xl border-neutral-300 hover:border-primary-400 focus:border-primary-500 transition-all"
          />
        </Form.Item>

        {/* Remember Me & Forgot Password */}
        <Form.Item className="mb-5">
          <div className="flex items-center justify-between">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox className="text-sm text-neutral-600">
                Remember me
              </Checkbox>
            </Form.Item>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            disabled={isLoading}
            icon={!isLoading && <ArrowRightOutlined />}
            iconPosition="end"
            className="w-full h-11 bg-gradient-primary border-0 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Form.Item>
      </Form>

      {/* Registration Link */}
      <div className="text-center pt-2">
        <Text className="text-neutral-600 text-sm">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            Sign up for free
          </Link>
        </Text>
      </div>

      {/* Footer Info */}
      <div className="text-center pt-4 border-t border-neutral-200">
        <Text className="text-xs text-neutral-500">
          By signing in, you agree to our{' '}
          <Link to="/terms" className="text-primary-600 hover:text-primary-700 hover:underline">
            Terms of Service
          </Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-primary-600 hover:text-primary-700 hover:underline">
            Privacy Policy
          </Link>
        </Text>
      </div>
    </div>
  );
};

export default LoginForm;
