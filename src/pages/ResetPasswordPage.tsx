"use client"

import React from "react"
import { useState } from "react"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"

interface ResetPasswordPageProps {
    token: string | null
    onSuccess: () => void
    onBackToLogin: () => void
    features: Array<{
        icon: string
        title: string
        description: string
    }>
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ token, onSuccess, onBackToLogin, features }) => {
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [isTokenValid, setIsTokenValid] = useState(true)

    // Simulate token validation
    React.useEffect(() => {
        if (!token) {
            setIsTokenValid(false)
            return
        }

        // Simulate API call to validate token
        setTimeout(() => {
            // For demo purposes, consider token valid if it's not empty
            setIsTokenValid(token.length > 0)
        }, 1000)
    }, [token])

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {}

        if (!formData.password) {
            newErrors.password = "Senha é obrigatória"
        } else if (formData.password.length < 8) {
            newErrors.password = "Senha deve ter pelo menos 8 caracteres"
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Confirmação de senha é obrigatória"
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Senhas não coincidem"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            onSuccess()
        }, 2000)
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }))
        }
    }

    // Invalid token state
    if (!isTokenValid) {
        return (
            <div className="min-h-screen bg-background relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/20 via-background to-background"></div>
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600 opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
                    <Card variant="glass" className="backdrop-blur-xl border-custom-light max-w-md w-full">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-primary mb-2">Link inválido ou expirado</h2>
                            <p className="text-secondary text-sm mb-6">
                                Este link de recuperação de senha é inválido ou já expirou. Solicite um novo link.
                            </p>

                            <Button onClick={onBackToLogin} className="w-full">
                                Voltar para o login
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/20 via-background to-background"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600 opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary opacity-5 rounded-full blur-2xl"></div>
            </div>

            <div className="relative z-10 flex min-h-screen">
                {/* Left Side - Branding & Features */}
                <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12">
                    <div className="max-w-lg">
                        {/* Logo */}
                        <div className="flex items-center mb-8">
                            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mr-4 shadow-purple">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h1 className="text-4xl font-bold text-primary">MyFocus</h1>
                        </div>

                        {/* Tagline */}
                        <h2 className="text-3xl font-bold text-primary mb-4">Defina sua nova senha</h2>
                        <p className="text-xl text-secondary mb-12">Escolha uma senha forte e segura para proteger sua conta.</p>

                        {/* Features */}
                        <div className="space-y-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-start space-x-4 animate-fade-in"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="text-2xl">{feature.icon}</div>
                                    <div>
                                        <h3 className="font-semibold text-primary mb-1">{feature.title}</h3>
                                        <p className="text-secondary text-sm">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side - Reset Password Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="lg:hidden text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-purple">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-primary mb-2">MyFocus</h1>
                            <p className="text-secondary">Defina sua nova senha</p>
                        </div>

                        <Card variant="glass" className="backdrop-blur-xl border-custom-light">
                            {/* Header */}
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                                        />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-primary mb-2">Redefinir senha</h2>
                                <p className="text-secondary text-sm">Digite sua nova senha abaixo</p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <Input
                                    type="password"
                                    label="Nova senha"
                                    placeholder="Mínimo 8 caracteres"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange("password", e.target.value)}
                                    error={errors.password}
                                    required
                                    icon={
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                            />
                                        </svg>
                                    }
                                />

                                <Input
                                    type="password"
                                    label="Confirmar nova senha"
                                    placeholder="Digite a senha novamente"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                    error={errors.confirmPassword}
                                    required
                                    icon={
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    }
                                />

                                {/* Password Requirements */}
                                <div className="bg-surface-light rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-primary mb-2">Requisitos da senha:</h4>
                                    <ul className="text-xs text-secondary space-y-1">
                                        <li
                                            className={`flex items-center space-x-2 ${formData.password.length >= 8 ? "text-green-500" : ""}`}
                                        >
                                            <svg
                                                className={`w-3 h-3 ${formData.password.length >= 8 ? "text-green-500" : "text-muted"}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span>Pelo menos 8 caracteres</span>
                                        </li>
                                        <li
                                            className={`flex items-center space-x-2 ${/[A-Z]/.test(formData.password) ? "text-green-500" : ""}`}
                                        >
                                            <svg
                                                className={`w-3 h-3 ${/[A-Z]/.test(formData.password) ? "text-green-500" : "text-muted"}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span>Uma letra maiúscula</span>
                                        </li>
                                        <li
                                            className={`flex items-center space-x-2 ${/[0-9]/.test(formData.password) ? "text-green-500" : ""}`}
                                        >
                                            <svg
                                                className={`w-3 h-3 ${/[0-9]/.test(formData.password) ? "text-green-500" : "text-muted"}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span>Um número</span>
                                        </li>
                                    </ul>
                                </div>

                                <Button type="submit" className="w-full" size="lg" loading={isLoading}>
                                    Redefinir senha
                                </Button>
                            </form>

                            {/* Back to Login */}
                            <div className="mt-6 text-center">
                                <button
                                    onClick={onBackToLogin}
                                    className="text-secondary hover:text-primary transition-colors text-sm flex items-center justify-center space-x-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                        />
                                    </svg>
                                    <span>Voltar para o login</span>
                                </button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
