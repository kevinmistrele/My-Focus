export interface PomodoroSession {
  id: string
  taskId?: string
  duration: number // em segundos
  type: "work" | "short-break" | "long-break"
  startedAt: string
  completedAt?: string
  isCompleted: boolean
  userId: string
}

export interface PomodoroSettings {
  workDuration: number // em minutos
  shortBreakDuration: number // em minutos
  longBreakDuration: number // em minutos
  sessionsUntilLongBreak: number
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
  soundEnabled: boolean
}

export interface PomodoroStats {
  totalSessions: number
  completedSessions: number
  totalFocusTime: number // em minutos
  averageSessionLength: number // em minutos
  streakDays: number
  todaySessions: number
}

export interface CreatePomodoroRequest {
  taskId?: string
  duration: number
  type: "work" | "short-break" | "long-break"
}
