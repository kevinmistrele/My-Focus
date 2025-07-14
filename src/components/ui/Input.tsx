"use client"

import type React from "react"
import type { InputProps } from "../../types/ui"

export const Input: React.FC<InputProps> = ({
  type = "text",
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  label,
  required = false,
  className = "",
}) => {
  const baseClasses = "block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm"
  const normalClasses = "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
  const errorClasses = "border-red-300 focus:ring-red-500 focus:border-red-500"
  const disabledClasses = "bg-gray-50 text-gray-500 cursor-not-allowed"

  const inputClasses = [baseClasses, error ? errorClasses : normalClasses, disabled && disabledClasses, className]
    .filter(Boolean)
    .join(" ")

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={inputClasses}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
