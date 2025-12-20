// src/config/env.ts
/**
 * Environment Configuration
 * Centralized access to environment variables with type safety and validation
 * Note: Vite uses import.meta.env instead of process.env
 */

interface EnvConfig {
  api: {
    baseURL: string;
    timeout: number;
  };
  auth: {
    tokenStorageKey: string;
    userStorageKey: string;
    tokenExpiryMinutes: number;
  };
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    databaseURL: string;
  };
  app: {
    name: string;
    version: string;
  };
  features: {
    enableChat: boolean;
    enablePresence: boolean;
    enableNotifications: boolean;
  };
  development: {
    enableReduxDevtools: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  };
  isDevelopment: boolean;
  isProduction: boolean;
}

const env: EnvConfig = {
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  },
  auth: {
    tokenStorageKey: import.meta.env.VITE_TOKEN_STORAGE_KEY || 'pms_auth_token',
    userStorageKey: import.meta.env.VITE_USER_STORAGE_KEY || 'pms_auth_user',
    tokenExpiryMinutes: Number(import.meta.env.VITE_TOKEN_EXPIRY_MINUTES) || 15,
  },
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || '',
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Project Management System',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },
  features: {
    enableChat: import.meta.env.VITE_ENABLE_CHAT === 'true',
    enablePresence: import.meta.env.VITE_ENABLE_PRESENCE === 'true',
    enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS !== 'false', // Default true
  },
  development: {
    enableReduxDevtools: import.meta.env.VITE_ENABLE_REDUX_DEVTOOLS !== 'false', // Default true in dev
    logLevel: (import.meta.env.VITE_LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error') || 'info',
  },
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

/**
 * Validate environment configuration
 * Checks critical variables are present and valid
 */
const validateEnv = () => {
  const errors: string[] = [];

  // Validate API Base URL
  if (!env.api.baseURL) {
    errors.push('VITE_API_BASE_URL is required');
  } else {
    try {
      new URL(env.api.baseURL);
    } catch {
      errors.push(`Invalid API Base URL format: ${env.api.baseURL}`);
    }
  }

  // Validate API timeout
  if (env.api.timeout <= 0) {
    errors.push(`API timeout must be positive: ${env.api.timeout}`);
  }

  // Validate token expiry
  if (env.auth.tokenExpiryMinutes <= 0) {
    errors.push(`Token expiry must be positive: ${env.auth.tokenExpiryMinutes}`);
  }

  // Firebase validation (optional for authentication feature)
  if (env.firebase.apiKey && !env.firebase.projectId) {
    errors.push('VITE_FIREBASE_PROJECT_ID is required when Firebase is configured');
  }

  if (errors.length > 0) {
    console.error('❌ Environment configuration errors:', errors);
    throw new Error(`Invalid environment configuration:\n${errors.join('\n')}`);
  }
};

// Run validation in production
if (env.isProduction) {
  validateEnv();
}

// Log configuration in development (without sensitive data)
if (env.isDevelopment) {
  console.log('✅ Environment configuration loaded:', {
    api: { baseURL: env.api.baseURL, timeout: env.api.timeout },
    auth: { tokenExpiryMinutes: env.auth.tokenExpiryMinutes },
    app: { name: env.app.name, version: env.app.version },
    features: env.features,
    development: env.development,
  });
}

export default env;