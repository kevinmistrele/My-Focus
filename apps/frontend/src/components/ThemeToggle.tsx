"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/Button"

export const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(false)

    interface ThemeToggleProps {
        initialTheme?: "dark" | "light"
    }

    export const ThemeToggle = ({ initialTheme }: ThemeToggleProps) => {
        const [isDark, setIsDark] = useState(initialTheme === "dark")


        useEffect(() => {
            const savedTheme = localStorage.getItem("theme")
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
            const finalTheme = initialTheme || savedTheme || (prefersDark ? "dark" : "light")

            const isDark = finalTheme === "dark"
            setIsDark(isDark)
            document.documentElement.classList.toggle("dark", isDark)
        }, [initialTheme])

        const toggleTheme = () => {
            const newTheme = !isDark
            setIsDark(newTheme)

            const themeStr = newTheme ? "dark" : "light"
            localStorage.setItem("theme", themeStr)
            document.documentElement.classList.toggle("dark", newTheme)
        }

    return (
        <Button variant="ghost" size="sm" onClick={toggleTheme} className="w-10 h-10 p-0">
            {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                </svg>
            ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                </svg>
            )}
        </Button>
    )
}
