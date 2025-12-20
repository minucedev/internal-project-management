/**
 * Main Application Component
 * 
 * Configures:
 * - React Router with public and protected routes
 * - Authentication initialization from localStorage on mount
 * - Loading state during auth initialization
 * - Expired token handling with auto-redirect
 * - Route structure for login, register, and dashboard
 * - Protected route wrapper to prevent unauthorized access
 * - Smart default redirect (/ → /dashboard if authenticated, else /login)
 */

import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useAppDispatch, useAppSelector } from './store';
import { initializeAuth } from './store/slices/authSlice';
import { tokenService } from './services/tokenService';
import ProtectedRoute from './components/routes/ProtectedRoute';
import Header from './components/layout/Header';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import './App.css';

/**
 * Placeholder components (will be created in user story phases)
 */
const DashboardPage = () => (
  <div>
    <Header />
    <div style={{ padding: '24px' }}>
      <h1>Dashboard Page (To be implemented)</h1>
      <p>Welcome to your dashboard. More features coming soon!</p>
    </div>
  </div>
);

/**
 * Default Route Component
 * Smart redirect based on authentication state:
 * - If authenticated → /dashboard
 * - If not authenticated → /login
 */
const DefaultRoute = () => {
  const { token, currentUser } = useAppSelector((state) => state.auth);
  const isAuthenticated = Boolean(token && currentUser);
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
};

function App() {
  const dispatch = useAppDispatch();
  const [isInitializing, setIsInitializing] = useState(true);

  /**
   * Initialize authentication state on app mount
   * Restores user session from localStorage if token is valid
   * Handles expired token case with auto-logout and redirect
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if token exists in localStorage
        const storedToken = tokenService.getToken();
        
        if (storedToken) {
          // Validate token expiry
          if (tokenService.isTokenValid()) {
            // Token is valid, restore auth state
            dispatch(initializeAuth());
          } else {
            // Token expired, clear storage
            console.warn('⚠️ Token expired during initialization, clearing auth data');
            tokenService.clearAuth();
            // User will be redirected to login by route protection
          }
        } else {
          // No token found, user is not authenticated
          dispatch(initializeAuth()); // Still dispatch to ensure clean state
        }
      } catch (error) {
        console.error('❌ Error during auth initialization:', error);
        // Clear potentially corrupted auth data
        tokenService.clearAuth();
      } finally {
        // Mark initialization complete
        setIsInitializing(false);
      }
    };

    initAuth();
  }, [dispatch]);

  /**
   * Show loading spinner while checking authentication
   * Prevents flash of login page for authenticated users
   */
  if (isInitializing) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}>
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes - Wrapped with ProtectedRoute */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />

        {/* Default Route - Smart redirect based on auth state */}
        <Route path="/" element={<DefaultRoute />} />

        {/* Catch-all: Redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
