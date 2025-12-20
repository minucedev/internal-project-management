/**
 * Login Page Component
 * 
 * User login form with:
 * - Username input (required)
 * - Password input (required)
 * - Client-side validation
 * - Loading state during login
 * - Error handling for invalid credentials
 * - Successful login flow (save token, redirect to dashboard)
 * - Link to registration page
 * - Return URL preservation for protected route redirects
 * 
 * Integrates with Redux authSlice for state management
 */

import React, { useEffect } from 'react';
import { Form, Input, Button, Typography, Card, Alert, Space, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../store/slices/authSlice';
import type { LoginCredentials } from '../../types/auth.types';
import type { AppDispatch, RootState } from '../../store';

const { Title, Text } = Typography;

/**
 * Login Page Component
 */
const Login: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const { isLoading, error, token } = useSelector((state: RootState) => state.auth);

  // Get return URL from query params (for protected route redirects)
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';

  /**
   * Auto-redirect to dashboard (or return URL) after successful login
   * Token is set in Redux state after loginUser.fulfilled
   */
  useEffect(() => {
    if (token) {
      message.success('Welcome back! 👋');
      console.log('✅ Login successful, redirecting to:', returnUrl);
      navigate(returnUrl, { replace: true });
    }
  }, [token, navigate, returnUrl]);

  /**
   * Clear error message when component unmounts
   */
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  /**
   * Handle form submission
   */
  const handleSubmit = async (values: LoginCredentials & { remember?: boolean }) => {
    try {
      // Clear any previous errors
      dispatch(clearError());

      // Dispatch loginUser thunk
      const credentials: LoginCredentials = {
        username: values.username,
        password: values.password,
      };

      const result = await dispatch(loginUser(credentials)).unwrap();
      
      // Success: user and token are automatically saved to Redux state
      // Auto-redirect will happen via useEffect above
      console.log('Login successful:', result.user.username);
    } catch (err) {
      // Error is handled by Redux slice and displayed via error state
      console.error('Login failed:', err);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px 16px',
    }}>
      <Card
        style={{
          width: '100%',
          minWidth: '320px',
          maxWidth: '450px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ marginBottom: 8 }}>
              Welcome Back
            </Title>
            <Text type="secondary">
              Sign in to your account
            </Text>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert
              message="Login Failed"
              description={error}
              type="error"
              closable
              onClose={() => dispatch(clearError())}
              showIcon
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
          >
            {/* Username Field */}
            <Form.Item
              name="username"
              label="Username"
              rules={[
                { required: true, message: 'Please enter your username' },
                { min: 3, message: 'Username must be at least 3 characters' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your username"
                disabled={isLoading}
                autoComplete="username"
              />
            </Form.Item>

            {/* Password Field */}
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please enter your password' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
                disabled={isLoading}
                autoComplete="current-password"
              />
            </Form.Item>

            {/* Remember Me & Forgot Password */}
            <Form.Item style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox disabled={isLoading}>Remember me</Checkbox>
                </Form.Item>
                <Text type="secondary" style={{ fontSize: '14px' }}>
                  {/* Forgot password feature will be added in future phase */}
                  Forgot password?
                </Text>
              </div>
            </Form.Item>

            {/* Submit Button */}
            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                style={{ height: '48px', fontSize: '16px', fontWeight: 500 }}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Form.Item>
          </Form>

          {/* Registration Link */}
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">
              Don't have an account?{' '}
              <Link to="/register" style={{ fontWeight: 500 }}>
                Create one now
              </Link>
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default Login;
