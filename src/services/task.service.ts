import { apiService } from "./api"
import type { Task, CreateTaskRequest, UpdateTaskRequest, TaskFilters } from "../types/task"
import type { PaginatedResponse, PaginationParams } from "../types/api"

class TaskService {
  async getTasks(filters?: TaskFilters, pagination?: PaginationParams): Promise<PaginatedResponse<Task>> {
    const params = { ...filters, ...pagination }
    const response = await apiService.get<PaginatedResponse<Task>>("/tasks", params)
    return response.data
  }

  async getTask(id: string): Promise<Task> {
    const response = await apiService.get<Task>(`/tasks/${id}`)
    return response.data
  }

  async createTask(task: CreateTaskRequest): Promise<Task> {
    const response = await apiService.post<Task>("/tasks", task)
    return response.data
  }

  async updateTask(id: string, updates: UpdateTaskRequest): Promise<Task> {
    const response = await apiService.patch<Task>(`/tasks/${id}`, updates)
    return response.data
  }

  async deleteTask(id: string): Promise<void> {
    await apiService.delete(`/tasks/${id}`)
  }

  async completeTask(id: string): Promise<Task> {
    const response = await apiService.patch<Task>(`/tasks/${id}/complete`, {})
    return response.data
  }

  async duplicateTask(id: string): Promise<Task> {
    const response = await apiService.post<Task>(`/tasks/${id}/duplicate`, {})
    return response.data
  }
}

export const taskService = new TaskService()
