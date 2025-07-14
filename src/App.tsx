"use client"

import { useState } from "react"
import { Header } from "./components/layout/Header"
import { Sidebar } from "./components/layout/Sidebar"
import { Router } from "./components/Router"
import { LoginPage } from "./pages/LoginPage"
import type { User } from "./lib/types"
import type { Route } from "./lib/router"
import "./styles/global.css"

export default function App() {
    const [user, setUser] = useState<User | null>(null)
    const [currentPath, setCurrentPath] = useState<Route>("/dashboard")
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const handleLogin = (userData: { name: string; email: string }) => {
        setUser({
            id: "1",
            name: userData.name,
            email: userData.email,
            type: "admin", // Set as admin for testing - change to "user" for regular user
            createdAt: new Date(),
            preferences: {
                pomodoroWorkTime: 25,
                pomodoroBreakTime: 5,
                pomodoroLongBreakTime: 15,
                theme: "dark",
            },
        })
    }

    const handleNavigate = (path: string) => {
        setCurrentPath(path as Route)
        setSidebarOpen(false)
    }

    if (!user) {
        return <LoginPage onLogin={handleLogin} />
    }

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} currentPath={currentPath} onNavigate={handleNavigate} user={user} />

            {/* Main Content Area */}
            <div
                className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
                    sidebarOpen ? "lg:ml-0" : "lg:ml-0"
                }`}
            >
            <Header user={user} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

                <main className="flex-1 p-6">
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
