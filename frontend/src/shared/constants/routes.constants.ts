export const APP_ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
  },
  DASHBOARD: {
    ROOT: '/dashboard',
    PROJECTS: '/dashboard/projects',
    PROJECT_DETAIL: (id: string) => `/dashboard/projects/${id}`,
    TASKS: '/dashboard/tasks',
    CALENDAR: '/dashboard/calendar',
    SETTINGS: '/dashboard/settings',
  },
  NOT_FOUND: '*',
};
