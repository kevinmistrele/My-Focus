import { apiService } from "./api"
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  User,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "../types/auth"

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>("/auth/login", credentials)

    if (response.success && response.data.token) {
      apiService.setToken(response.data.token)
    }

    return response.data
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>("/auth/register", credentials)

    if (response.success && response.data.token) {
      apiService.setToken(response.data.token)
    }

    return response.data
  }

  async logout(): Promise<void> {
    try {
      await apiService.post("/auth/logout", {})
    } finally {
      apiService.removeToken()
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<User>("/auth/me")
    return response.data
  }

  async forgotPassword(request: ForgotPasswordRequest): Promise<void> {
    await apiService.post("/auth/forgot-password", request)
  }

  async resetPassword(request: ResetPasswordRequest): Promise<void> {
    await apiService.post("/auth/reset-password", request)
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>("/auth/refresh", {})

    if (response.success && response.data.token) {
      apiService.setToken(response.data.token)
    }

    return response.data
  }
}

// Export as named export
export const authService = new AuthService()
