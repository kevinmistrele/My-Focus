export interface AdminUser {
  id: string
  name: string
  email: string
  role: "user" | "admin"
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
  stats: UserStats
}

export interface UserStats {
  totalTasks: number
  completedTasks: number
  totalPomodoroSessions: number
  totalFocusTime: number
  activeGoals: number
  activeHabits: number
}

export interface AdminLog {
  id: string
  action: string
  userId?: string
  adminId: string
  details: Record<string, any>
  timestamp: string
  ipAddress?: string
}

export interface SystemStats {
  totalUsers: number
  activeUsers: number
  totalTasks: number
  totalSessions: number
  systemUptime: number
}
