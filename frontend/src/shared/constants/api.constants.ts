export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    ME: '/auth/me',
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
  },
  PROJECTS: {
    BASE: '/projects',
    DETAIL: (id: string) => `/projects/${id}`,
    MEMBERS: (id: string) => `/projects/${id}/members`,
    INVITE: (id: string) => `/projects/${id}/members/invite`,
    ACCEPT_INVITE: (id: string, token: string) => `/projects/${id}/members/invites/${token}/accept`,
  },
  TASKS: {
    BASE: '/tasks',
    DETAIL: (id: string) => `/tasks/${id}`,
  },
};
