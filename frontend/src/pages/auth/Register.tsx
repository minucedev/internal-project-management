/**
 * Register Page Component - Full Screen Web Layout
 *
 * Architecture:
 * - Split into RegisterHeroSection (left) and RegisterForm (right)
 * - Responsive: 2-column on desktop, single column on mobile
 * - Redux integration for auth (registerUser)
 * - Auto-redirect after successful registration
 */
import React, { useEffect } from 'react';
import { CheckCircleFilled } from '@ant-design/icons';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { registerUser, clearError } from '../../store/slices/authSlice';
import type { RegisterData } from '../../types/auth.types';
import RegisterHeroSection from '../../components/auth/RegisterHeroSection';
import RegisterForm from '../../components/auth/RegisterForm';
import type { RegisterFormValues } from '../../components/auth/RegisterForm';

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isLoading, error, token } = useAppSelector((state) => state.auth);

  // Auto-redirect after successful registration
  useEffect(() => {
    if (token) {
      message.success('Account created successfully! Welcome aboard! 🎉');
      navigate('/dashboard', { replace: true });
    }
  }, [token, navigate]);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      dispatch(clearError());
      const payload: RegisterData = {
        username: values.username,
        email: values.email,
        password: values.password,
      };
      await dispatch(registerUser(payload)).unwrap();
    } catch {
      // Error handled by slice
    }
  };

  const handleClearError = () => dispatch(clearError());

  return (
    <div className="min-h-screen grid lg:grid-cols-2 relative overflow-hidden">
      {/* Left Side - Hero Section */}
      <RegisterHeroSection />

      {/* Right Side - Registration Form */}
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

        <RegisterForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
          onClearError={handleClearError}
        />
      </div>
    </div>
  );
};

export default Register;
