"use client"

import type React from "react"
import type { Route } from "../../lib/router"
import type { User } from "../../lib/types"
import {useAuth} from "../../contexts/AuthContext.tsx";

interface SidebarProps {
    isOpen: boolean
    currentPath: Route
    onNavigate: (path: string) => void
    user: User
}


export const Sidebar: React.FC<SidebarProps> = ({ isOpen, currentPath, onNavigate, user }) => {
    const { logout } = useAuth()
    const menuItems = [
        { path: "/dashboard", label: "Dashboard", icon: "📊" },
        { path: "/tasks", label: "Tarefas", icon: "✅" },
        { path: "/goals", label: "Metas", icon: "🎯" },
        { path: "/mood", label: "Registro de Humor", icon: "😊" },
        { path: "/quotes", label: "Frases Motivacionais", icon: "💭" },
        { path: "/habits", label: "Hábitos", icon: "🔄" },
        { path: "/pomodoro", label: "Pomodoro", icon: "⏰" },
        { path: "/notes", label: "Notas", icon: "📝" },
    ]

    const adminItems = [
        { path: "/admin/dashboard", label: "Admin Dashboard", icon: "⚙️" },
        { path: "/admin/users", label: "Usuários", icon: "👥" },
        { path: "/admin/logs", label: "Logs", icon: "📋" },
    ]

    const profileItems = [
        { path: "/profile", label: "Perfil", icon: "👤" },
    ]

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`transition-all duration-300 ease-in-out w-72 h-screen bg-surface border-r border-custom z-40
    ${isOpen ? "fixed left-0 top-0 translate-x-0" : "-translate-x-full fixed left-0 top-0"}
    ${isOpen ? "lg:translate-x-0 lg:static" : "lg:-translate-x-full lg:fixed"}
  `}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-custom">
                        <h2 className="text-lg font-semibold text-primary mb-1">Navegação</h2>
                        <p className="text-sm text-muted">Organize sua produtividade</p>
                    </div>

                    {/* Navigation Content */}
                    <div className="flex-1 overflow-y-auto py-4">
                        {/* Main Menu */}
                        <nav className="px-4 space-y-2">
                            {menuItems.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => onNavigate(item.path)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                                        currentPath === item.path
                                            ? "bg-primary text-white shadow-purple"
                                            : "text-secondary hover:text-primary hover:bg-surface-light"
                                    }`}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            ))}
                        </nav>

                        {/* Admin Section */}
                        {user.type === "admin" && (
                            <>
                                <div className="px-4 mt-8 mb-4">
                                    <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">Administração</h3>
                                </div>
                                <nav className="px-4 space-y-2">
                                    {adminItems.map((item) => (
                                        <button
                                            key={item.path}
                                            onClick={() => onNavigate(item.path)}
                                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                                                currentPath === item.path
                                                    ? "bg-primary text-white shadow-purple"
                                                    : "text-secondary hover:text-primary hover:bg-surface-light"
                                            }`}
                                        >
                                            <span className="text-lg">{item.icon}</span>
                                            <span className="font-medium">{item.label}</span>
                                        </button>
                                    ))}
                                </nav>
                            </>
                        )}

                        {/* Profile Section */}
                        <div className="px-4 mt-8 mb-4">
                            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">Conta</h3>
                        </div>
                        <nav className="px-4 space-y-2">
                            {profileItems.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => onNavigate(item.path)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                                        currentPath === item.path
                                            ? "bg-primary text-white shadow-purple"
                                            : "text-secondary hover:text-primary hover:bg-surface-light"
                                    }`}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-custom">
                        <button
                            onClick={logout}
                            className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-left text-secondary hover:text-red-500 hover:bg-red-500/10 transition-all"
                        >
                            <span className="text-lg">🚪</span>
                            <span className="font-medium">Sair</span>
                        </button>
                        <div className="flex items-center justify-between text-sm text-muted">
                            <span>MyFocus v1.0</span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}
