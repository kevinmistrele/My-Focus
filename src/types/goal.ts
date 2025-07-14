export type GoalStatus = "active" | "completed" | "paused" | "cancelled"
export type GoalPriority = "low" | "medium" | "high"

export interface Goal {
  id: string
  title: string
  description?: string
  status: GoalStatus
  priority: GoalPriority
  targetDate?: string
  progress: number // 0-100
  createdAt: string
  updatedAt: string
  userId: string
  milestones?: Milestone[]
}

export interface Milestone {
  id: string
  title: string
  description?: string
  isCompleted: boolean
  dueDate?: string
  goalId: string
}

export interface CreateGoalRequest {
  title: string
  description?: string
  priority: GoalPriority
  targetDate?: string
  milestones?: Omit<Milestone, "id" | "goalId" | "isCompleted">[]
}

export interface UpdateGoalRequest extends Partial<CreateGoalRequest> {
  status?: GoalStatus
  progress?: number
}
