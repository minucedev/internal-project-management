# Frontend Implementation Summary (Internal Project Management)

Tài liệu này tóm tắt cấu trúc và các tính năng đã được triển khai trong dự án frontend nội bộ (`internal-project-management/frontend`).

## 1. Công Nghệ & Kiến Trúc (Tech Stack & Architecture)

### Core Technologies
*   **Framework:** React 19 (Vite)
*   **Language:** TypeScript
*   **State Management:** Redux Toolkit
*   **UI Library:** Ant Design (Antd) + Tailwind CSS
*   **Routing:** React Router DOM v6+

### Project Structure (`src/`)
*   **`pages/`**: Các trang màn hình chính.
    *   `auth/`: Chứa `Login.tsx` và `Register.tsx`.
*   **`components/`**: Các thành phần UI tái sử dụng.
    *   `auth/`: Form đăng nhập (`LoginForm`), đăng ký (`RegisterForm`) và các thành phần giao diện liên quan (`HeroSection`).
    *   `layout/`: Bố cục chung (ví dụ: `Header`).
    *   `routes/`: Các component điều hướng đặc biệt như `ProtectedRoute`.
*   **`services/`**: Xử lý logic nghiệp vụ và gọi API.
    *   `authService.ts`: Các API liên quan đến xác thực (login, register).
    *   `tokenService.ts`: Quản lý lưu trữ và kiểm tra token (JWT) trong LocalStorage.
    *   `api.ts`: Cấu hình Axios instance cơ bản.
*   **`store/`**: Quản lý Global State với Redux.
    *   `slices/authSlice.ts`: Slice quản lý trạng thái đăng nhập, thông tin user và token.
*   **`App.tsx`**: Cấu hình Routing, khởi tạo xác thực (Auth Initialization) và xử lý luồng điều hướng chính.

## 2. Các Tính Năng Đã Triển Khai (Implemented Features)

### A. Hệ Thống Xác Thực (Authentication System)
1.  **Đăng Nhập (Login):**
    *   Giao diện đăng nhập với form nhập liệu.
    *   Tích hợp API đăng nhập thông qua `authService`.
    *   Lưu trữ Token vào LocalStorage sau khi đăng nhập thành công.

2.  **Đăng Ký (Register):**
    *   Giao diện đăng ký tài khoản mới.
    *   Form validation cơ bản.

3.  **Bảo Vệ Route (Protected Routes):**
    *   Component `ProtectedRoute` kiểm tra trạng thái đăng nhập.
    *   Chặn truy cập vào các trang nội bộ (ví dụ: `/dashboard`) nếu chưa đăng nhập.
    *   Tự động chuyển hướng về trang `/login`.

4.  **Quản Lý Phiên (Session Management):**
    *   **Auto-Restore:** Khi tải lại trang (`App.tsx`), hệ thống tự động kiểm tra token trong LocalStorage.
    *   **Token Validation:** Kiểm tra hạn sử dụng của token (`tokenService.isTokenValid()`). Nếu hết hạn, tự động đăng xuất.
    *   **Loading State:** Hiển thị Spinner loading trong khi đang khởi tạo xác thực để tránh "flicker" giao diện.

### B. Giao Diện & Trải Nghiệm (UI/UX)
*   **Dashboard (Placeholder):** Trang Dashboard cơ bản (hiện tại là placeholder) hiển thị sau khi đăng nhập thành công.
*   **Điều hướng thông minh:**
    *   Truy cập `/` sẽ tự động chuyển hướng đến `/dashboard` (nếu đã login) hoặc `/login` (nếu chưa).
*   **Styling:** Sử dụng kết hợp Ant Design Components (Button, Input, Form, Spin) và Tailwind CSS utility classes để tùy biến giao diện.

## 3. Trạng Thái Hiện Tại
*   ✅ **Authentication:** Cơ bản đã hoàn thiện (Login, Register, Protect Route, Token Management).
*   🚧 **Dashboard:** Chưa có chức năng thực tế, đang ở dạng khung sườn.
*   🚧 **API Integration:** Đã thiết lập cấu trúc service, sẵn sàng mở rộng cho các tính năng nghiệp vụ khác.
