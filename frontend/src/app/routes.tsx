import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, RegisterPage } from '@/features/auth';
import { ProtectedRoute, PublicRoute } from '@/shared/components/navigation';
import { APP_ROUTES } from '@/shared/constants';

// Placeholder Dashboard component
function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Dashboard content coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}

// 404 Not Found component
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">
          Trang không tồn tại
        </h2>
        <p className="text-gray-600 mb-8">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Về trang chủ
        </a>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Root redirect to dashboard */}
      <Route path="/" element={<Navigate to={APP_ROUTES.DASHBOARD.ROOT} replace />} />

      {/* Public routes - redirect to dashboard if authenticated */}
      <Route element={<PublicRoute />}>
        <Route path={APP_ROUTES.AUTH.LOGIN} element={<LoginPage />} />
        <Route path={APP_ROUTES.AUTH.REGISTER} element={<RegisterPage />} />
      </Route>

      {/* Protected routes - require authentication */}
      <Route element={<ProtectedRoute />}>
        <Route path={APP_ROUTES.DASHBOARD.ROOT} element={<Dashboard />} />
        {/* Add more protected routes here */}
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
