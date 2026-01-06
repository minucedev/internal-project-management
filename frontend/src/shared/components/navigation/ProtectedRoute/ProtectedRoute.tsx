import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { Spinner } from '@/shared/components/ui';
import { APP_ROUTES } from '@/shared/constants';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate
        to={APP_ROUTES.AUTH.LOGIN}
        state={{ from: location }}
        replace
      />
    );
  }

  // Render child routes if authenticated
  return <Outlet />;
}
