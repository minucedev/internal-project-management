import { useEffect } from 'react';
import { useAuthStore } from '@/stores';
import AppRoutes from './routes';

export default function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  // Initialize authentication on app mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return <AppRoutes />;
}
