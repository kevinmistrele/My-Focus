import type { ApiResponse, ApiRequestConfig } from "../types/api"

class ApiService {
  private baseURL: string
  private token: string | null = null

  constructor() {
    // Usar uma URL padrão se a variável de ambiente não estiver disponível
    this.baseURL = this.getApiUrl()
    this.token = this.getStoredToken()
  }

  private getApiUrl(): string {
    // Verificar se estamos no ambiente de desenvolvimento
    if (typeof window !== "undefined") {
      // Cliente - usar variável de ambiente ou fallback
      return import.meta.env?.VITE_API_URL || "http://localhost:3000/api"
    }
    return "http://localhost:3000/api"
  }

  private getStoredToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token")
    }
    return null
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
    }
  }

  removeToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
  }

  private async request<T>(endpoint: string, config: ApiRequestConfig = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const { method = "GET", headers = {}, body, params } = config

    // Add query parameters
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value))
      })
    }
    const finalUrl = searchParams.toString() ? `${url}?${searchParams}` : url

    // Prepare headers
    const finalHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    }

    if (this.token) {
      finalHeaders.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(finalUrl, {
        method,
        headers: finalHeaders,
        body: body ? JSON.stringify(body) : undefined,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Request failed")
      }

      return data
    } catch (error) {
      console.error("API Request failed:", error)
      throw error
    }
  }

  // Generic CRUD methods
  async get<T>(endpoint: string, params?: Record<string, string | number>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET", params })
  }

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "POST", body })
  }

  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "PUT", body })
  }

  async patch<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "PATCH", body })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

export const apiService = new ApiService()
