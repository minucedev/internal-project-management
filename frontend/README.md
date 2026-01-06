# Auth Module

## 📋 Overview
Brief description of what this module does.

## 🎯 Responsibilities
- User registration
- User login/logout
- Token management
- Protected routes

## 🏗️ Structure
\`\`\`
auth/
├── api/          # API calls
├── components/   # UI components
├── hooks/        # Custom hooks
├── pages/        # Page components
├── stores/       # State management
├── types/        # TypeScript types
└── utils/        # Utilities
\`\`\`

## 🔌 Public API
\`\`\`typescript
// Components
export { LoginForm, RegisterForm } from './components';

// Hooks
export { useAuth, useLogin, useRegister } from './hooks';

// Store
export { useAuthStore } from './stores';

// Types
export type { LoginRequest, RegisterRequest, User } from './types';
\`\`\`

## 🚀 Usage Examples
\`\`\`typescript
// Using login form
import { LoginForm } from '@/features/auth';

function LoginPage() {
  return <LoginForm />;
}

// Using auth hook
import { useAuth } from '@/features/auth';

function Dashboard() {
  const { user, logout } = useAuth();
  
  return <div>Welcome {user.username}</div>;
}
\`\`\`

## 🧪 Testing
How to run tests for this module.

## 📝 Notes
Any important notes or gotchas.