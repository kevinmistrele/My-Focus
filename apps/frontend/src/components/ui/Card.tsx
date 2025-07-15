import type React from "react"
import { cn } from "../../lib/utils"

interface CardProps {
    children: React.ReactNode
    className?: string
    variant?: "default" | "glass"
    padding?: "sm" | "md" | "lg"
}

const cardVariants = {
    default: "bg-surface border border-custom",
    glass: "glass-effect",
}

const cardPadding = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
}

export const Card: React.FC<CardProps> = ({ children, className, variant = "default", padding = "md" }) => {
    return (
        <div className={cn("rounded-xl shadow-lg animate-fade-in", cardVariants[variant], cardPadding[padding], className)}>
            {children}
        </div>
    )
}
