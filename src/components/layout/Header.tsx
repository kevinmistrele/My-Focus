"use client"

import type React from "react"
import { useAuth } from "../../hooks/useAuth"
import { Button } from "../ui/Button"

export const Header: React.FC = () => {
  const { authState, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">MyFocus</h1>
          </div>

          <div className="flex items-center space-x-4">
            {authState.user && (
              <>
                <span className="text-sm text-gray-700">Welcome, {authState.user.name}</span>
                <Button variant="ghost" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
