"use client"

import type React from "react"
import { cn } from "../../lib/utils"
import { routes, adminRoutes } from "../../lib/router"
import type { User } from "../../lib/types"

interface SidebarProps {
    isOpen: boolean
    currentPath: string
    onNavigate: (path: string) => void
    user?: User
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, currentPath, onNavigate, user }) => {
    const isAdmin = user?.type === "admin"

    return (
        <aside
            className={cn(
                "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-surface border-r border-custom transform transition-transform duration-300 ease-in-out",
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
            )}
        >
            <nav className="mt-8 px-4">
                {/* Regular Routes */}
                <ul className="space-y-2">
                    {routes.map((route) => (
                        <li key={route.path}>
                            <button
                                onClick={() => onNavigate(route.path)}
                                className={cn(
                                    "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                                    currentPath === route.path
                                        ? "bg-primary text-white shadow-purple"
                                        : "text-secondary hover:text-primary hover:bg-surface-light",
                                )}
                            >
                                <span className="text-xl">{route.icon}</span>
                                <span className="font-medium">{route.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>

                {/* Admin Routes */}
                {isAdmin && (
                    <>
                        <div className="mt-8 mb-4">
                            <div className="px-4 py-2">
                                <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Administração</h3>
                            </div>
                        </div>
                        <ul className="space-y-2">
                            {adminRoutes.map((route) => (
                                <li key={route.path}>
                                    <button
                                        onClick={() => onNavigate(route.path)}
                                        className={cn(
                                            "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                                            currentPath === route.path
                                                ? "bg-primary text-white shadow-purple"
                                                : "text-secondary hover:text-primary hover:bg-surface-light",
                                        )}
                                    >
                                        <span className="text-xl">{route.icon}</span>
                                        <span className="font-medium">{route.label}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </nav>
        </aside>
    )
}
