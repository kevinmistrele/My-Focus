export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    REFRESH: "/auth/refresh",
  },
  TASKS: {
    BASE: "/tasks",
    COMPLETE: (id: string) => `/tasks/${id}/complete`,
    DUPLICATE: (id: string) => `/tasks/${id}/duplicate`,
  },
  POMODORO: {
    SESSIONS: "/pomodoro/sessions",
    SETTINGS: "/pomodoro/settings",
    STATS: "/pomodoro/stats",
    COMPLETE: (id: string) => `/pomodoro/sessions/${id}/complete`,
  },
  GOALS: {
    BASE: "/goals",
    PROGRESS: (id: string) => `/goals/${id}/progress`,
    MILESTONE_COMPLETE: (goalId: string, milestoneId: string) => `/goals/${goalId}/milestones/${milestoneId}/complete`,
  },
  HABITS: {
    BASE: "/habits",
    COMPLETE: (id: string) => `/habits/${id}/complete`,
    STATS: "/habits/stats",
  },
  NOTES: {
    BASE: "/notes",
    SEARCH: "/notes/search",
    TOGGLE_PIN: (id: string) => `/notes/${id}/toggle-pin`,
  },
  ADMIN: {
    USERS: "/admin/users",
    LOGS: "/admin/logs",
    STATS: "/admin/stats",
    USER_STATUS: (id: string) => `/admin/users/${id}/status`,
    USER_STATS: (id: string) => `/admin/users/${id}/stats`,
  },
} as const

export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER_PREFERENCES: "user_preferences",
  POMODORO_SETTINGS: "pomodoro_settings",
} as const

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 20,
} as const

export const TASK_PRIORITIES = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const

export const TASK_STATUSES = {
  PENDING: "pending",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
} as const

export const POMODORO_DEFAULTS = {
  WORK_DURATION: 25, // minutos
  SHORT_BREAK: 5, // minutos
  LONG_BREAK: 15, // minutos
  SESSIONS_UNTIL_LONG_BREAK: 4,
} as const
