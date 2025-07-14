"use client"

import type React from "react"

interface HeaderProps {
    user?: { name: string; avatar?: string }
    onMenuClick?: () => void
    sidebarOpen?: boolean
}

export const Header: React.FC<HeaderProps> = ({ user, onMenuClick, sidebarOpen }) => {
    return (
        <header className="bg-surface border-b border-custom px-6 py-4 lg:border-l-0">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {/* Sidebar Toggle Button */}
                    <button
                        onClick={onMenuClick}
                        className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-surface-light transition-all duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Logo MyFocus */}
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-purple">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-primary">MyFocus</h1>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    {user && (
                        <div className="flex items-center space-x-3">
                            <span className="text-secondary text-sm">Olá, {user.name}</span>
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                {user.avatar ? (
                                    <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-8 h-8 rounded-full" />
                                ) : (
                                    <span className="text-white text-sm font-medium">{user.name.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
