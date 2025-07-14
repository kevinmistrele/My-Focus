export type TaskPriority = "low" | "medium" | "high"
export type TaskStatus = "pending" | "in-progress" | "completed"

export interface Task {
  id: string
  title: string
  description?: string
  priority: TaskPriority
  status: TaskStatus
  dueDate?: string
  createdAt: string
  updatedAt: string
  userId: string
  tags?: string[]
  estimatedTime?: number // em minutos
  actualTime?: number // em minutos
}

export interface CreateTaskRequest {
  title: string
  description?: string
  priority: TaskPriority
  dueDate?: string
  tags?: string[]
  estimatedTime?: number
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  status?: TaskStatus
  actualTime?: number
}

export interface TaskFilters {
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string
  tags?: string[]
}
