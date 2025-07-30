// src/contexts/AuthContext.tsx
import React, { createContext, useEffect, useState, useContext } from "react"
import { AuthService } from "../services"
import type {User} from "../lib/types.ts";


interface AuthContextProps {
    user: User | null
    loading: boolean
    login: (user: User, token: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            setLoading(false)
            return
        }

        AuthService.getCurrentUser()
            .then(setUser)
            .catch(() => logout())
            .finally(() => setLoading(false))
    }, [])

    const login = (user: User, token: string) => {
        localStorage.setItem("token", token)
        setUser(user)
    }

    const logout = () => {
        localStorage.removeItem("token")
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth must be used within an AuthProvider")
    return context
}
