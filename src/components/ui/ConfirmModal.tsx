"use client"

import type React from "react"
import { Modal } from "./Modal"
import { Button } from "./Button"

interface ConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    type?: "danger" | "warning" | "info"
    isLoading?: boolean
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
                                                              isOpen,
                                                              onClose,
                                                              onConfirm,
                                                              title,
                                                              message,
                                                              confirmText = "Confirmar",
                                                              cancelText = "Cancelar",
                                                              type = "info",
                                                              isLoading = false,
                                                          }) => {
    const getIcon = () => {
        switch (type) {
            case "danger":
                return (
                    <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>
                )
            case "warning":
                return (
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>
                )
            default:
                return (
                    <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                )
        }
    }

    const getConfirmButtonVariant = () => {
        switch (type) {
            case "danger":
                return "danger"
            case "warning":
                return "primary"
            default:
                return "primary"
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <div className="text-center">
                {getIcon()}
                <p className="text-secondary mb-6">{message}</p>
                <div className="flex space-x-3">
                    <Button variant="ghost" onClick={onClose} className="flex-1" disabled={isLoading}>
                        {cancelText}
                    </Button>
                    <Button
                        variant={getConfirmButtonVariant()}
                        onClick={onConfirm}
                        className="flex-1"
                        loading={isLoading}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
