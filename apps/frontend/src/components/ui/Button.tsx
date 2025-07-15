import type React from "react"
import { cn } from "../../lib/utils"
import type { ButtonVariant, ButtonSize } from "../../lib/types"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant
    size?: ButtonSize
    loading?: boolean
    children: React.ReactNode
}

const buttonVariants = {
    primary: "bg-primary hover:bg-primary-dark text-white shadow-purple",
    secondary: "bg-surface hover:bg-surface-light text-primary border border-custom-light",
    outline: "border border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "text-secondary hover:text-primary hover:bg-surface-light",
    danger: "bg-red-600 hover:bg-red-700 text-white",
}

const buttonSizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
}

export const Button: React.FC<ButtonProps> = ({
                                                  variant = "primary",
                                                  size = "md",
                                                  loading = false,
                                                  disabled,
                                                  className,
                                                  children,
                                                  ...props
                                              }) => {
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed",
                buttonVariants[variant],
                buttonSizes[size],
                className,
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {children}
        </button>
    )
}
