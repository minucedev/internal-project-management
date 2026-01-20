import { type ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Left Column - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[42%] backdrop-blur-sm border-r border-white/20 items-center justify-center relative z-10 px-8 py-12 xl:px-12">
        <div className="max-w-md w-full">
          <div className="mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg flex items-center justify-center mb-6 transform hover:scale-105 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-4xl xl:text-5xl font-extrabold text-gray-900 mb-5 leading-tight">
              Hệ thống Quản lý Dự án
            </h1>
            <p className="text-base xl:text-lg text-gray-600 leading-relaxed">
              Quản lý dự án, nhiệm vụ và cộng tác hiệu quả với đội ngũ của bạn
            </p>
          </div>

          <div className="space-y-5 mb-12">
            <div className="group cursor-pointer">
              <div className="flex items-center space-x-4 p-4 rounded-xl hover:bg-white/50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:shadow-lg transition-all duration-300">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-800 font-semibold text-base">Quản lý dự án trực quan</span>
              </div>
            </div>
            <div className="group cursor-pointer">
              <div className="flex items-center space-x-4 p-4 rounded-xl hover:bg-white/50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:shadow-lg transition-all duration-300">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-800 font-semibold text-base">Theo dõi tiến độ thời gian thực</span>
              </div>
            </div>
            <div className="group cursor-pointer">
              <div className="flex items-center space-x-4 p-4 rounded-xl hover:bg-white/50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-md flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:shadow-lg transition-all duration-300">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-800 font-semibold text-base">Cộng tác nhóm hiệu quả</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-300/50">
            <p className="text-sm text-gray-600 font-medium mb-4">Tìm hiểu thêm:</p>
            <div className="flex gap-5">
              <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline underline-offset-4 transition-all duration-200">
                Điều khoản dịch vụ
              </a>
              <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline underline-offset-4 transition-all duration-200">
                Chính sách bảo mật
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Form Content */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-10 relative z-10">
        <div className="w-full max-w-md">
          {/* Optional Title Section */}
          {title && (
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="text-base text-gray-600 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Form Content */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 p-8 sm:p-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
