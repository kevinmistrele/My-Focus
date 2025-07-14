export type HabitFrequency = "daily" | "weekly" | "monthly"

export interface Habit {
  id: string
  name: string
  description?: string
  frequency: HabitFrequency
  targetCount: number
  currentStreak: number
  longestStreak: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  userId: string
  completions: HabitCompletion[]
}

export interface HabitCompletion {
  id: string
  habitId: string
  completedAt: string
  count: number
  notes?: string
}

export interface CreateHabitRequest {
  name: string
  description?: string
  frequency: HabitFrequency
  targetCount: number
}

export interface UpdateHabitRequest extends Partial<CreateHabitRequest> {
  isActive?: boolean
}

export interface HabitStats {
  totalHabits: number
  activeHabits: number
  completionRate: number
  currentStreaks: number
  longestStreak: number
}
