import { apiService } from "./api"
import type { Habit, CreateHabitRequest, UpdateHabitRequest, HabitCompletion, HabitStats } from "../types/habit"

class HabitService {
  async getHabits(): Promise<Habit[]> {
    const response = await apiService.get<Habit[]>("/habits")
    return response.data
  }

  async getHabit(id: string): Promise<Habit> {
    const response = await apiService.get<Habit>(`/habits/${id}`)
    return response.data
  }

  async createHabit(habit: CreateHabitRequest): Promise<Habit> {
    const response = await apiService.post<Habit>("/habits", habit)
    return response.data
  }

  async updateHabit(id: string, updates: UpdateHabitRequest): Promise<Habit> {
    const response = await apiService.patch<Habit>(`/habits/${id}`, updates)
    return response.data
  }

  async deleteHabit(id: string): Promise<void> {
    await apiService.delete(`/habits/${id}`)
  }

  async completeHabit(id: string, count = 1, notes?: string): Promise<HabitCompletion> {
    const response = await apiService.post<HabitCompletion>(`/habits/${id}/complete`, { count, notes })
    return response.data
  }

  async getStats(): Promise<HabitStats> {
    const response = await apiService.get<HabitStats>("/habits/stats")
    return response.data
  }
}

export const habitService = new HabitService()
