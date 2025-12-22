/**
 * RegisterForm Component - Reusable registration form
 * - Validation: username, email, password, confirm password
 * - Loading state, error alert, success-ready
 * - Compact spacing, Tailwind color tokens
 */

import { Alert, Button, Form, Input, Typography } from 'antd';
import { ArrowRightOutlined, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import React from 'react';

const { Title, Text } = Typography;

export interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onClearError: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading, error, onClearError }) => {
  const [form] = Form.useForm<RegisterFormValues>();

  const handleSubmit = async (values: RegisterFormValues) => {
    await onSubmit(values);
  };

  return (
    <div className="w-full max-w-md space-y-6 py-8">
      {/* Header */}
      <div className="space-y-1">
        <Title level={2} className="!text-neutral-900 !text-3xl !mb-1">
          Create Account
        </Title>
        <Text className="text-base text-neutral-600">
          Start managing your projects efficiently
        </Text>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          message="Registration Failed"
          description={error}
          type="error"
          closable
          onClose={onClearError}
          showIcon
          className="rounded-xl border-error-200 bg-error-50"
        />
      )}

      {/* Registration Form */}
      <Form
        form={form}
        name="register"
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
        size="large"
        className="space-y-1"
      >
        {/* Username */}
        <Form.Item
          name="username"
          label={<span className="text-sm font-medium text-neutral-700">Username</span>}
          rules={[
            { required: true, message: 'Please enter your username' },
            { min: 3, message: 'Username must be at least 3 characters' },
            { max: 50, message: 'Username must not exceed 50 characters' },
            { pattern: /^[a-zA-Z0-9_-]+$/, message: 'Only letters, numbers, underscores and hyphens are allowed' },
          ]}
          className="mb-3"
        >
          <Input
            prefix={<UserOutlined className="text-neutral-400" />}
            placeholder="Choose a username"
            disabled={isLoading}
            className="h-11 rounded-xl border-neutral-300 hover:border-primary-400 focus:border-primary-500 transition-all"
          />
        </Form.Item>

        {/* Email */}
        <Form.Item
          name="email"
          label={<span className="text-sm font-medium text-neutral-700">Email</span>}
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email address' },
            { max: 100, message: 'Email must not exceed 100 characters' },
          ]}
          className="mb-3"
        >
          <Input
            prefix={<MailOutlined className="text-neutral-400" />}
            placeholder="your@email.com"
            disabled={isLoading}
            className="h-11 rounded-xl border-neutral-300 hover:border-primary-400 focus:border-primary-500 transition-all"
          />
        </Form.Item>

        {/* Password */}
        <Form.Item
          name="password"
          label={<span className="text-sm font-medium text-neutral-700">Password</span>}
          rules={[
            { required: true, message: 'Please enter your password' },
            { min: 6, message: 'Password must be at least 6 characters' },
            { max: 100, message: 'Password must not exceed 100 characters' },
          ]}
          hasFeedback
          className="mb-3"
        >
          <Input.Password
            prefix={<LockOutlined className="text-neutral-400" />}
            placeholder="Create a strong password"
            disabled={isLoading}
            className="h-11 rounded-xl border-neutral-300 hover:border-primary-400 focus:border-primary-500 transition-all"
          />
        </Form.Item>

        {/* Confirm Password */}
        <Form.Item
          name="confirmPassword"
          label={<span className="text-sm font-medium text-neutral-700">Confirm Password</span>}
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: 'Please confirm your password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match'));
              },
            }),
          ]}
          className="mb-4"
        >
          <Input.Password
            prefix={<LockOutlined className="text-neutral-400" />}
            placeholder="Confirm your password"
            disabled={isLoading}
            className="h-11 rounded-xl border-neutral-300 hover:border-primary-400 focus:border-primary-500 transition-all"
          />
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
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </Form.Item>
      </Form>

      {/* Login Link */}
      <div className="text-center pt-2">
        <Text className="text-neutral-600 text-sm">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            Sign in
          </Link>
        </Text>
      </div>

      {/* Footer Info */}
      <div className="text-center pt-4 border-t border-neutral-200">
        <Text className="text-xs text-neutral-500">
          By creating an account, you agree to our{' '}
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

export default RegisterForm;
