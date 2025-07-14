import { apiService } from "./api"
import type { PomodoroSession, PomodoroSettings, PomodoroStats, CreatePomodoroRequest } from "../types/pomodoro"

class PomodoroService {
  async getSessions(limit?: number): Promise<PomodoroSession[]> {
    const params = limit ? { limit } : {}
    const response = await apiService.get<PomodoroSession[]>("/pomodoro/sessions", params)
    return response.data
  }

  async createSession(session: CreatePomodoroRequest): Promise<PomodoroSession> {
    const response = await apiService.post<PomodoroSession>("/pomodoro/sessions", session)
    return response.data
  }

  async completeSession(id: string): Promise<PomodoroSession> {
    const response = await apiService.patch<PomodoroSession>(`/pomodoro/sessions/${id}/complete`, {})
    return response.data
  }

  async getSettings(): Promise<PomodoroSettings> {
    const response = await apiService.get<PomodoroSettings>("/pomodoro/settings")
    return response.data
  }

  async updateSettings(settings: Partial<PomodoroSettings>): Promise<PomodoroSettings> {
    const response = await apiService.patch<PomodoroSettings>("/pomodoro/settings", settings)
    return response.data
  }

  async getStats(): Promise<PomodoroStats> {
    const response = await apiService.get<PomodoroStats>("/pomodoro/stats")
    return response.data
  }
}

export const pomodoroService = new PomodoroService()
