# Login Page Documentation

## Overview

Trang Login cho ứng dụng Project Management với thiết kế hiện đại, responsive và component-based architecture.

## Component Structure

```
pages/auth/
├── Login.tsx              (Main container - orchestrates HeroSection + LoginForm)
└── Register.tsx          (Future)

components/auth/
├── HeroSection.tsx       (Left side hero section)
└── LoginForm.tsx         (Right side login form)
```

## Component Breakdown

### 1. **Login.tsx** (Page Container)
**Responsibilities:**
- Redux state management (auth slice)
- Navigation logic (redirect after login)
- Return URL preservation
- Error state orchestration
- Connecting HeroSection + LoginForm

**Props:** None (uses Redux hooks)

**State Management:**
- `isLoading` - từ Redux auth slice
- `error` - từ Redux auth slice
- `token` - từ Redux auth slice
- Auto-redirect khi token có giá trị

### 2. **HeroSection.tsx** (Reusable)
**Responsibilities:**
- Display branding (logo, tagline)
- Hero heading & description
- Feature highlights (3 items)
- Animated background circles (3 blur circles)
- Footer copyright

**Props:** None (purely presentational)

**Styling:**
- `bg-gradient-primary` - gradient background
- `hidden lg:flex` - ẩn trên mobile
- Animated circles với `animate-pulse-soft` và staggered delays
- z-index layering (circles z-0, content z-10)

### 3. **LoginForm.tsx** (Reusable)
**Responsibilities:**
- Form validation (username min 3 chars, password required)
- Form submission handling
- Error display (Alert component)
- Loading states
- Links (Forgot password, Register, Terms, Privacy)

**Props:**
```typescript
interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onClearError: () => void;
}

interface LoginFormValues {
  username: string;
  password: string;
  remember?: boolean;
}
```

**Features:**
- Ant Design Form với layout vertical
- Username input với UserOutlined icon
- Password input với LockOutlined icon
- Remember me checkbox
- Forgot password link
- Submit button với loading state và ArrowRightOutlined icon
- Error alert với closable
- Registration link
- Terms & Privacy footer

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Desktop (lg: ≥1024px):                                │
│  ┌──────────────────┬──────────────────┐               │
│  │                  │                  │               │
│  │  HeroSection     │  LoginForm       │               │
│  │  (50%)           │  (50%)           │               │
│  │                  │                  │               │
│  │  - Logo          │  - Mobile Logo   │               │
│  │  - Hero Content  │  - Form Header   │               │
│  │  - Features      │  - Error Alert   │               │
│  │  - Footer        │  - Input Fields  │               │
│  │                  │  - Submit Button │               │
│  │                  │  - Links         │               │
│  └──────────────────┴──────────────────┘               │
│                                                         │
│  Mobile (< lg):                                        │
│  ┌──────────────────────────────┐                      │
│  │  Logo (top-left)             │                      │
│  │                              │                      │
│  │  LoginForm                   │                      │
│  │  (full width)                │                      │
│  │                              │                      │
│  └──────────────────────────────┘                      │
└─────────────────────────────────────────────────────────┘
```

## Color System (Tailwind Config)

**Primary Colors:**
```css
primary-50:  #f0f9ff
primary-100: #e0f2fe
primary-200: #bae6fd
primary-300: #7dd3fc
primary-400: #38bdf8
primary-500: #0ea5e9  ← Main primary
primary-600: #0284c7
primary-700: #0369a1
primary-800: #075985
primary-900: #0c4a6e
```

**Neutral Colors:**
```css
neutral-50:  #fafafa
neutral-100: #f5f5f5
neutral-200: #e5e5e5
neutral-300: #d4d4d4  ← Borders
neutral-400: #a3a3a3  ← Icons
neutral-500: #737373
neutral-600: #525252  ← Text secondary
neutral-700: #404040  ← Labels
neutral-800: #262626
neutral-900: #171717  ← Text primary
```

**Status Colors:**
```css
error-50:  #fef2f2
error-200: #fecaca
error-600: #dc2626
```

**Gradients:**
```css
bg-gradient-primary: linear-gradient(135deg, primary-600 0%, primary-700 100%)
```

## Spacing System

**Form Spacing:**
- Container: `space-y-6` (24px)
- Form items: `mb-3`, `mb-4`, `mb-5` (12px, 16px, 20px)
- Input height: `h-11` (44px)
- Button height: `h-11` (44px)

**Hero Section:**
- Padding: `p-12` (48px)
- Content spacing: `space-y-6` (24px)

**Mobile:**
- Padding: `p-8` (32px)
- Logo top-left: `top-8 left-8`

## Responsive Breakpoints

```css
sm: 640px   (Mobile landscape)
md: 768px   (Tablet)
lg: 1024px  (Desktop - Split screen activates here)
xl: 1280px  (Large desktop)
2xl: 1536px (Extra large)
```

## Animations

**Pulse Soft (for blur circles):**
```css
@keyframes pulse-soft {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.15; }
}

animation: pulse-soft 4s ease-in-out infinite;
```

**Staggered Delays:**
- Circle 1: 0s
- Circle 2: 1.5s
- Circle 3: 3s

**Button Hover Effects:**
```css
hover:shadow-xl
hover:scale-[1.02]
active:scale-[0.98]
transition-all duration-200
```

## Redux Integration

**Auth Slice Actions:**
```typescript
loginUser(credentials: { username, password })  // Async thunk
clearError()                                     // Sync action
```

**Selectors:**
```typescript
state.auth.isLoading  // Boolean
state.auth.error      // string | null
state.auth.token      // string | null
state.auth.currentUser // User | null
```

## Flow Diagram

```
User enters credentials
    ↓
LoginForm validates input
    ↓
onSubmit prop called
    ↓
Login.tsx handleSubmit
    ↓
dispatch(loginUser(credentials))
    ↓
authSlice async thunk
    ↓
API call to backend
    ↓
Success → save token + user to Redux
    ↓
useEffect detects token change
    ↓
Navigate to returnUrl (or /dashboard)
    ↓
Protected route allows access
```

## Usage Example

```typescript
// pages/auth/Login.tsx
import HeroSection from '../../components/auth/HeroSection';
import LoginForm from '../../components/auth/LoginForm';

const Login = () => {
  const handleSubmit = async (values: LoginFormValues) => {
    await dispatch(loginUser(values));
  };

  return (
    <div className="grid lg:grid-cols-2">
      <HeroSection />
      <LoginForm 
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        onClearError={() => dispatch(clearError())}
      />
    </div>
  );
};
```

## Testing Checklist

- [ ] Desktop view (split screen 50-50)
- [ ] Mobile view (full width form, no hero)
- [ ] Tablet view (similar to mobile)
- [ ] Form validation (username min 3 chars)
- [ ] Error display (incorrect credentials)
- [ ] Loading state (button disabled + spinner)
- [ ] Remember me checkbox
- [ ] Forgot password link
- [ ] Register link
- [ ] Return URL preservation
- [ ] Auto-redirect after success
- [ ] Animations (blur circles, button hover)
- [ ] Accessibility (keyboard navigation, screen readers)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS 12+)
- Chrome Mobile (Android)

## Dependencies

```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-router-dom": "^7.1.3",
  "@reduxjs/toolkit": "^2.5.0",
  "react-redux": "^9.2.0",
  "antd": "^5.28.0",
  "@ant-design/icons": "^5.6.0",
  "tailwindcss": "^3.4.17"
}
```

## Future Enhancements

1. **Social Login** (Google, GitHub)
2. **2FA Support** (OTP input)
3. **Biometric Login** (Face ID, Touch ID)
4. **Dark Mode** (theme toggle)
5. **Internationalization** (i18n)
6. **Password Strength Meter**
7. **CAPTCHA Integration**
8. **Session Management** (auto-logout)

## Performance Notes

- Components are React.memo wrapped if needed
- Lazy load HeroSection on mobile (not rendered)
- Form validation is client-side first
- API calls use debouncing for username check
- Images use lazy loading
- Animations use CSS transforms (GPU accelerated)

## Security Considerations

- No password stored in browser (cleared on logout)
- Token stored in httpOnly cookie (if backend supports)
- XSS protection via React's automatic escaping
- CSRF token in API calls
- Rate limiting on login attempts
- Password minimum length enforced
