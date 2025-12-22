/**
 * ProtectedRoute Component
 * 
 * Wrapper component that protects routes from unauthenticated access.
 * Redirects unauthenticated users to /login with return URL preserved.
 * Shows loading spinner while checking authentication state.
 * 
 * @example
 * <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 */

import { Navigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { useAppSelector } from '../../store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute wrapper component
 * 
 * Checks if user is authenticated before rendering children.
 * If not authenticated, redirects to /login with return URL.
 * Shows loading spinner while checking auth state (during app initialization).
 * 
 * @param {ProtectedRouteProps} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @returns {JSX.Element} Protected content or redirect
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { token, currentUser, isLoading } = useAppSelector((state) => state.auth);
  
  // Derive authentication status from token and user presence
  const isAuthenticated = Boolean(token && currentUser);

  // Show loading spinner while checking authentication state
  // This prevents flashing login page during initial app load
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-primary">
        <Spin size="large" tip="Checking authentication..." />
      </div>
    );
  }

  // If not authenticated, redirect to login with return URL preserved
  // The return URL allows redirecting back after successful login
  if (!isAuthenticated) {
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // User is authenticated, render protected content
  return <>{children}</>;
};

export default ProtectedRoute;
