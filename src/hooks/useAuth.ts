"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { authService } from "../services/auth.service"
import type { LoginCredentials, RegisterCredentials, AuthState } from "../types/auth"

const AuthContext = createContext<{
  authState: AuthState
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
} | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function useAuthProvider() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      if (token) {
        const user = await authService.getCurrentUser()
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        })
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }))
      }
    } catch (error) {
      console.error("Failed to initialize auth:", error)
      localStorage.removeItem("auth_token")
      setAuthState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  const login = async (credentials: LoginCredentials) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))
    try {
      const { user, token } = await authService.login(credentials)
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))
    try {
      const { user, token } = await authService.register(credentials)
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } finally {
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  }

  const refreshUser = async () => {
    try {
      const user = await authService.getCurrentUser()
      setAuthState((prev) => ({ ...prev, user }))
    } catch (error) {
      console.error("Failed to refresh user:", error)
    }
  }

  return {
    authState,
    login,
    register,
    logout,
    refreshUser,
  }
}

export { AuthContext }
