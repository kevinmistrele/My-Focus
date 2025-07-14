"use client"

import type React from "react"
import { useEffect } from "react"
import { cn } from "../../lib/utils"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
    size?: "sm" | "md" | "lg" | "xl"
}

const modalSizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = "md" }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }

        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />
            <div
                className={cn(
                    "relative w-full mx-4 bg-surface border border-custom-light rounded-xl shadow-2xl animate-fade-in",
                    modalSizes[size],
                )}
            >
                {title && (
                    <div className="flex items-center justify-between p-6 border-b border-custom">
                        <h2 className="text-xl font-semibold text-primary">{title}</h2>
                        <button onClick={onClose} className="text-muted hover:text-primary transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
                <div className="p-6">{children}</div>
            </div>
        </div>
    )
}
