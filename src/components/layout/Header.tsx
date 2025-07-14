"use client"

import type React from "react"

interface HeaderProps {
    user?: { name: string; avatar?: string }
    onMenuClick?: () => void
}

export const Header: React.FC<HeaderProps> = ({ user, onMenuClick }) => {
    return (
        <header className="bg-surface border-b border-custom px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button onClick={onMenuClick} className="lg:hidden text-secondary hover:text-primary transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h1 className="text-2xl font-bold text-primary">MyFocus</h1>
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
