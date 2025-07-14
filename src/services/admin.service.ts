import { apiService } from "./api"
import type { AdminUser, AdminLog, SystemStats, UserStats } from "../types/admin"
import type { PaginatedResponse, PaginationParams } from "../types/api"

class AdminService {
  async getUsers(pagination?: PaginationParams): Promise<PaginatedResponse<AdminUser>> {
    const response = await apiService.get<PaginatedResponse<AdminUser>>("/admin/users", pagination)
    return response.data
  }

  async getUser(id: string): Promise<AdminUser> {
    const response = await apiService.get<AdminUser>(`/admin/users/${id}`)
    return response.data
  }

  async updateUserStatus(id: string, isActive: boolean): Promise<AdminUser> {
    const response = await apiService.patch<AdminUser>(`/admin/users/${id}/status`, { isActive })
    return response.data
  }

  async deleteUser(id: string): Promise<void> {
    await apiService.delete(`/admin/users/${id}`)
  }

  async getLogs(pagination?: PaginationParams): Promise<PaginatedResponse<AdminLog>> {
    const response = await apiService.get<PaginatedResponse<AdminLog>>("/admin/logs", pagination)
    return response.data
  }

  async getSystemStats(): Promise<SystemStats> {
    const response = await apiService.get<SystemStats>("/admin/stats")
    return response.data
  }

  async getUserStats(id: string): Promise<UserStats> {
    const response = await apiService.get<UserStats>(`/admin/users/${id}/stats`)
    return response.data
  }
}

export const adminService = new AdminService()
