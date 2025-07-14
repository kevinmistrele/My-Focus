"use client"

import type React from "react"
import type { Route } from "../../lib/router"
import type { User } from "../../lib/types"

interface SidebarProps {
    isOpen: boolean
    currentPath: Route
    onNavigate: (path: string) => void
    user: User
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, currentPath, onNavigate, user }) => {
    const menuItems = [
        { path: "/dashboard", label: "Dashboard", icon: "📊" },
        { path: "/tasks", label: "Tarefas", icon: "✅" },
        { path: "/goals", label: "Metas", icon: "🎯" },
        { path: "/habits", label: "Hábitos", icon: "🔄" },
        { path: "/pomodo", label: "Pomodoro", icon: "⏰" },
        { path: "/notes", label: "Notas", icon: "📝" },
    ]

    const adminItems = [
        { path: "/admin/dashboard", label: "Admin Dashboard", icon: "⚙️" },
        { path: "/admin/users", label: "Usuários", icon: "👥" },
        { path: "/admin/logs", label: "Logs", icon: "📋" },
    ]

    const profileItems = [
        { path: "/profile", label: "Perfil", icon: "👤" },
        { path: "/preferences", label: "Preferências", icon: "⚙️" },
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
                        <div className="flex items-center justify-between text-sm text-muted">
                            <span>MyFocus v1.0</span>
                            <button className="p-2 rounded-lg hover:bg-surface-light transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}
