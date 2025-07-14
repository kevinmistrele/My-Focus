import type React from "react"
import type { CardProps } from "../../types/ui"

export const Card: React.FC<CardProps> = ({ children, className = "", padding = "md" }) => {
  const baseClasses = "bg-white rounded-lg shadow border border-gray-200"

  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  }

  const classes = [baseClasses, paddingClasses[padding], className].filter(Boolean).join(" ")

  return <div className={classes}>{children}</div>
}
