/**
 * Error codes matching backend ErrorCode enum
 * These codes are returned by the backend API in error responses
 */
export const ERROR_CODES = {
    // Auth/User errors
    USERNAME_ALREADY_EXISTS: 'USERNAME_ALREADY_EXISTS',
    EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    UNAUTHORIZED: 'AUTH_001',
    FORBIDDEN: 'AUTH_002',
    ROLE_NOT_FOUND: 'ROLE_NOT_FOUND',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    // System errors
    INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

/**
 * User-friendly Vietnamese error messages for each error code
 */
export const ERROR_MESSAGES: Record<string, string> = {
    [ERROR_CODES.USERNAME_ALREADY_EXISTS]: 'Tên đăng nhập đã tồn tại',
    [ERROR_CODES.EMAIL_ALREADY_EXISTS]: 'Email đã được sử dụng',
    [ERROR_CODES.INVALID_CREDENTIALS]: 'Tên đăng nhập hoặc mật khẩu không đúng',
    [ERROR_CODES.USER_NOT_FOUND]: 'Không tìm thấy người dùng',
    [ERROR_CODES.UNAUTHORIZED]: 'Bạn chưa đăng nhập',
    [ERROR_CODES.FORBIDDEN]: 'Bạn không có quyền truy cập',
    [ERROR_CODES.ROLE_NOT_FOUND]: 'Vai trò không tồn tại',
    [ERROR_CODES.VALIDATION_ERROR]: 'Dữ liệu không hợp lệ',
    [ERROR_CODES.INTERNAL_ERROR]: 'Lỗi hệ thống, vui lòng thử lại sau',
};

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];
