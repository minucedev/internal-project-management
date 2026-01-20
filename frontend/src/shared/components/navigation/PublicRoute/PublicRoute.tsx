import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { APP_ROUTES } from '@/shared/constants';

export default function PublicRoute() {
  const { isAuthenticated } = useAuth();

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to={APP_ROUTES.DASHBOARD.ROOT} replace />;
  }

  // Render child routes if not authenticated
  return <Outlet />;
}
