/**
 * Register Page Component
 * 
 * User registration form with:
 * - Username input (min 3 characters)
 * - Email input (valid email format)
 * - Password input (min 6 characters)
 * - Client-side validation
 * - Loading state during registration
 * - Error handling with field-specific messages
 * - Auto-login after successful registration
 * - Redirect to dashboard on success
 * 
 * Integrates with Redux authSlice for state management
 */

import React, { useEffect } from 'react';
import { Form, Input, Button, Typography, Card, Alert, Space, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../../store/slices/authSlice';
import type { RegisterData } from '../../types/auth.types';
import type { AppDispatch, RootState } from '../../store';

const { Title, Text } = Typography;

/**
 * Register Page Component
 */
const Register: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { isLoading, error, token } = useSelector((state: RootState) => state.auth);

  /**
   * Auto-redirect to dashboard after successful registration
   * Token is set in Redux state after registerUser.fulfilled
   */
  useEffect(() => {
    if (token) {
      // Show success message
      message.success('Account created successfully! Welcome aboard! 🎉');
      console.log('✅ Registration successful, redirecting to dashboard...');
      navigate('/dashboard', { replace: true });
    }
  }, [token, navigate]);

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
  const handleSubmit = async (values: RegisterData) => {
    try {
      // Clear any previous errors
      dispatch(clearError());

      // Dispatch registerUser thunk
      const result = await dispatch(registerUser(values)).unwrap();
      
      // Success: user and token are automatically saved to Redux state
      // Auto-redirect will happen via useEffect above
      console.log('Registration successful:', result.user.username);
    } catch (err) {
      // Error is handled by Redux slice and displayed via error state
      console.error('Registration failed:', err);
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
              Create Account
            </Title>
            <Text type="secondary">
              Join our project management system
            </Text>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert
              message="Registration Failed"
              description={error}
              type="error"
              closable
              onClose={() => dispatch(clearError())}
              showIcon
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
          >
            {/* Username Field */}
            <Form.Item
              name="username"
              label="Username"
              rules={[
                { required: true, message: 'Please enter your username' },
                { min: 3, message: 'Username must be at least 3 characters' },
                { max: 50, message: 'Username must not exceed 50 characters' },
                {
                  pattern: /^[a-zA-Z0-9_-]+$/,
                  message: 'Username can only contain letters, numbers, underscores and hyphens',
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your username"
                disabled={isLoading}
              />
            </Form.Item>

            {/* Email Field */}
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email address' },
                { max: 100, message: 'Email must not exceed 100 characters' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Enter your email"
                type="email"
                disabled={isLoading}
              />
            </Form.Item>

            {/* Password Field */}
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please enter your password' },
                { min: 6, message: 'Password must be at least 6 characters' },
                { max: 100, message: 'Password must not exceed 100 characters' },
              ]}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </Form.Item>

            {/* Confirm Password Field */}
            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={['password']}
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
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm your password"
                disabled={isLoading}
              />
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
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </Form.Item>
          </Form>

          {/* Login Link */}
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">
              Already have an account?{' '}
              <Link to="/login" style={{ fontWeight: 500 }}>
                Sign in
              </Link>
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default Register;
