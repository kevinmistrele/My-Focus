"use client"

import type React from "react"
import { Modal } from "./Modal"
import { Button } from "./Button"
import type { ConfirmModalProps } from "../../types/ui"

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
}) => {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const iconColors = {
    danger: "text-red-600",
    warning: "text-yellow-600",
    info: "text-blue-600",
  }

  const icons = {
    danger: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
    ),
    warning: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
    ),
    info: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 ${iconColors[variant]}`}>{icons[variant]}</div>
        <div className="flex-1">
          <p className="text-sm text-gray-700 mb-6">{message}</p>
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={onClose}>
              {cancelText}
            </Button>
            <Button variant={variant} onClick={handleConfirm}>
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
