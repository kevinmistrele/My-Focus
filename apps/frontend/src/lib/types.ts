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
    loginStreak?: number
}


export interface AdminStats {
    totalUsers: number
    totalTasks: number
    totalPomodoroSessions: number
    activeUsers: number
    newUsersThisMonth: number
    tasksCompletedToday: number
    averageFocusTime: number
    engagementRate: number
    recentActivity: Activity[]
}

export interface Activity {
    id: string
    userName: string
    action: string
    timestamp: string
    type: string
}
export interface Note {
    id: string
    title: string
    content: string
    color: string
    pinned: boolean
    createdAt: Date // <-- muda aqui
    updatedAt: Date // <-- e aqui
}

export interface AdminStats {
    totalUsers: number
    totalTasks: number
    totalPomodoroSessions: number
    activeUsers: number
    newUsersThisMonth: number
    tasksCompletedToday: number
}

export interface Habit {
    id: string;
    name: string;
    description: string;
    category: string;
    streak: number;
    bestStreak: number;
    completedToday: boolean;
    weeklyGoal: number;
    weeklyProgress: number;
    color: string;
    createdAt: Date;
}

export interface Goal {
    id: string
    title: string
    description: string
    type: "short" | "long"
    category: string
    targetDate: Date | null // <--- aqui
    progress: number
    completed: boolean
    createdAt: Date
}
export interface RawGoal {
    id: string
    title: string
    description: string
    type: "short" | "long"
    category: string
    targetDate: string | null
    createdAt: string
    progress: number
    completed: boolean
}

export type ActivityLog = {
    id: string
    userId: string
    userName: string
    action: string
    details: string
    timestamp: Date
    type: "user" | "task" | "pomodoro" | "system" | "goal"
}

export interface RawGoal {
    id: string
    title: string
    description: string
    type: "short" | "long"
    category: string
    targetDate: string | null
    progress: number
    completed: boolean
    createdAt: string
}

export const mapGoal = (raw: RawGoal): Goal => ({
    ...raw,
    createdAt: new Date(raw.createdAt),
    targetDate: raw.targetDate ? new Date(raw.targetDate) : null,
})


export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger"
export type ButtonSize = "sm" | "md" | "lg"
export type InputVariant = "default" | "error" | "success"

export interface NavigationProps {
    onNavigate: (path: string) => void
}
