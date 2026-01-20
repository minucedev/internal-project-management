export const VALIDATION_MESSAGES = {
  REQUIRED: 'Trường này là bắt buộc',
  EMAIL_INVALID: 'Email không hợp lệ',
  PASSWORD_MIN_LENGTH: 'Mật khẩu phải có ít nhất 6 ký tự',
  PASSWORD_MATCH: 'Mật khẩu không khớp',
  USERNAME_MIN_LENGTH: 'Tên đăng nhập phải có ít nhất 4 ký tự',
  USERNAME_MAX_LENGTH: 'Tên đăng nhập không được vượt quá 20 ký tự',
  USERNAME_PATTERN: 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới',
};

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,  // Matches backend: @Size(min = 6)
  USERNAME_MIN_LENGTH: 4,  // Matches backend: @Size(min = 4)
  USERNAME_MAX_LENGTH: 20, // Matches backend: @Size(max = 20)
};
