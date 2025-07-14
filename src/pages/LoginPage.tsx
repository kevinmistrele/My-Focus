"use client"

import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { Input } from "../components/ui/Input"
import { Card } from "../components/ui/Card"
import { validateEmail, validateRequired } from "../utils/validation"
import { handleApiError } from "../utils/errors"
import type { LoginCredentials } from "../types/auth"

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: keyof LoginCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCredentials(prev => ({
      ...prev,
      [field]: e.target.value,
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    const emailError = validateRequired(credentials.email, 'Email')
    if (emailError) {
      newErrors.email = emailError
    } else if (!validateEmail(credentials.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    const passwordError = validateRequired(credentials.password, 'Password')
    if (passwordError) {
      newErrors.password = passwordError
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    
    try {
      await login(credentials)
      navigate('/dashboard')
    } catch (error) {
      setErrors({ general: handleApiError(error) })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to MyFocus
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        
        <Card>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}
            
            <Input
              type="email"
              label="Email address"
              value={credentials.email}
              onChange={handleInputChange('email')}
              error={errors.email}
              required
              disabled={isLoading}
            />
            
            <Input
              type="password"
              label="Password"
              value={credentials.password}
              onChange={handleInputChange('password')}
              error={errors.password}
              required
              \
