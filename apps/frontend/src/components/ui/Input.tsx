import type React from "react"
import { cn } from "../../lib/utils"
import type { InputVariant } from "../../lib/types"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: InputVariant
    label?: string
    error?: string
    icon?: React.ReactNode
}

const inputVariants = {
    default: "border-custom focus:border-primary",
    error: "border-red-500 focus:border-red-500",
    success: "border-green-500 focus:border-green-500",
}

export const Input: React.FC<InputProps> = ({ variant = "default", label, error, icon, className, ...props }) => {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-secondary mb-2">{label}</label>}
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">{icon}</div>
                )}
                <input
                    className={cn(
                        "w-full px-3 py-2 bg-surface text-primary rounded-lg border transition-colors duration-200 focus-ring",
                        icon && "pl-10",
                        inputVariants[variant],
                        className,
                    )}
                    {...props}
                />
            </div>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    )
}
