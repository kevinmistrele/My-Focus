"use client"
import { useState } from "react"
import { AuthContext, useAuthProvider } from "./hooks/useAuth"
import { Header } from "./components/layout/Header"
import { Sidebar } from "./components/layout/Sidebar"
import { Router } from "./components/Router"
import { LoginPage } from "./pages/LoginPage"
import type { Route } from "./lib/router"
import { BrowserRouter } from "react-router-dom"
import "./styles/global.css"

function AppContent() {
  const { user, loading } = useAuthProvider()
  const [currentPath, setCurrentPath] = useState<Route>("/dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleNavigate = (path: string) => {
    setCurrentPath(path as Route)
    setSidebarOpen(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-primary">MyFocus</h1>
          <p className="text-secondary mt-2">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} currentPath={currentPath} onNavigate={handleNavigate} user={user} />

        <main className="flex-1 p-6 lg:ml-0">
          <div className="max-w-7xl mx-auto">
            <Router currentPath={currentPath} onNavigate={handleNavigate} user={user} />
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}

export default function App() {
  const authProvider = useAuthProvider()

  return (
    <AuthContext.Provider value={authProvider}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthContext.Provider>
  )
}
