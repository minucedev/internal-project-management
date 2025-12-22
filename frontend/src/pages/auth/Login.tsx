/**
 * Login Page Component - Full Screen Web Layout
 * 
 * Architecture:
 * - Split into HeroSection (left) and LoginForm (right) components
 * - Responsive design: 2-column on desktop, single column on mobile
 * - Redux integration for authentication state management
 * - Return URL preservation for protected route redirects
 * 
 * Features:
 * - Auto-redirect after successful login
 * - Error handling with alerts
 * - Loading states
 * - Mobile responsive (hide hero section)
 */
import React, { useEffect } from 'react';
import { CheckCircleFilled } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { message } from 'antd';
import { useAppDispatch, useAppSelector } from '../../store';
import { loginUser, clearError } from '../../store/slices/authSlice';
import HeroSection from '../../components/auth/HeroSection';
import LoginForm from '../../components/auth/LoginForm';
import type { LoginFormValues } from '../../components/auth/LoginForm';

/**
 * Login Page Component
 */
const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const { isLoading, error, token } = useAppSelector((state) => state.auth);

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
  const handleSubmit = async (values: LoginFormValues) => {
    try {
      // Clear any previous errors
      dispatch(clearError());

      // Dispatch loginUser thunk
      const credentials = {
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

  /**
   * Handle clear error
   */
  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 relative overflow-hidden">
      {/* Left Side - Hero Section */}
      <HeroSection />

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-8 bg-gradient-to-br from-neutral-50 to-white relative overflow-y-auto">
        {/* Mobile Logo */}
        <div className="absolute top-8 left-8 lg:hidden">
          <div className="inline-flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-primary">
              <CheckCircleFilled className="text-xl text-white" />
            </div>
            <span className="text-xl font-bold text-neutral-900">TaskFlow</span>
          </div>
        </div>

        {/* Login Form Component */}
        <LoginForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
          onClearError={handleClearError}
        />
      </div>
    </div>
  );
};

export default Login;
