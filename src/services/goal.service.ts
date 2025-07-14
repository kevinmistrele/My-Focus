import { apiService } from "./api"
import type { Goal, CreateGoalRequest, UpdateGoalRequest, Milestone } from "../types/goal"

class GoalService {
  async getGoals(): Promise<Goal[]> {
    const response = await apiService.get<Goal[]>("/goals")
    return response.data
  }

  async getGoal(id: string): Promise<Goal> {
    const response = await apiService.get<Goal>(`/goals/${id}`)
    return response.data
  }

  async createGoal(goal: CreateGoalRequest): Promise<Goal> {
    const response = await apiService.post<Goal>("/goals", goal)
    return response.data
  }

  async updateGoal(id: string, updates: UpdateGoalRequest): Promise<Goal> {
    const response = await apiService.patch<Goal>(`/goals/${id}`, updates)
    return response.data
  }

  async deleteGoal(id: string): Promise<void> {
    await apiService.delete(`/goals/${id}`)
  }

  async updateProgress(id: string, progress: number): Promise<Goal> {
    const response = await apiService.patch<Goal>(`/goals/${id}/progress`, { progress })
    return response.data
  }

  async completeMilestone(goalId: string, milestoneId: string): Promise<Milestone> {
    const response = await apiService.patch<Milestone>(`/goals/${goalId}/milestones/${milestoneId}/complete`, {})
    return response.data
  }
}

export const goalService = new GoalService()
