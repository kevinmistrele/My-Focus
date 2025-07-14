import type React from "react"
export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: "low" | "medium" | "high"
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
  tags: string[]
}

export interface PomodoroSession {
  id: string
  duration: number
  type: "work" | "break" | "longBreak"
  startTime: Date
  endTime?: Date
  completed: boolean
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  type: "admin" | "user"
  createdAt: Date
  lastLogin?: Date
  preferences: {
    pomodoroWorkTime: number
    pomodoroBreakTime: number
    pomodoroLongBreakTime: number
    theme: "dark" | "light"
  }
}

export interface AdminStats {
  totalUsers: number
  totalTasks: number
  totalPomodoroSessions: number
  activeUsers: number
  newUsersThisMonth: number
  tasksCompletedToday: number
}

export interface ActivityLog {
  id: string
  userId: string
  userName: string
  action: string
  details: string
  timestamp: Date
  type: "user" | "task" | "pomodoro" | "system"
}

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger"
export type ButtonSize = "sm" | "md" | "lg"
export type InputVariant = "default" | "error" | "success"
export type ModalSize = "sm" | "md" | "lg"
export type CardVariant = "default" | "outlined" | "filled"
export type CardPadding = "none" | "small" | "medium" | "large"

export interface NavigationProps {
  onNavigate: (path: string) => void
}

export interface Goal {
  id: string
  title: string
  description?: string
  completed: boolean
  type: "shortTerm" | "longTerm"
  createdAt: Date
  updatedAt?: Date
}

export interface Habit {
  id: string
  title: string
  description?: string
  frequency: number
  unit: "day" | "week" | "month"
  createdAt: Date
  updatedAt?: Date
}

export interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt?: Date
}

export type ApiResponse = {
  status: number
  data: any
}

export type ApiError = {
  status: number
  message: string
}

export type PaginatedResponse = {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  data: any[]
}

export type ApiRequestConfig = {
  headers?: any
  params?: any
  body?: any
}

// Re-export all types for backward compatibility
export * from "../types/auth"
export * from "../types/task"
export * from "../types/pomodoro"
export * from "../types/goal"
export * from "../types/habit"
export * from "../types/note"
export * from "../types/admin"
export * from "../types/ui"
export * from "../types/api"

// Legacy types that might be used in existing components
export interface Route {
  path: string
  component: React.ComponentType
  exact?: boolean
  protected?: boolean
}

export interface NavigationItem {
  label: string
  path: string
  icon?: React.ComponentType
  children?: NavigationItem[]
}
