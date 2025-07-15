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

export interface NavigationProps {
    onNavigate: (path: string) => void
}
