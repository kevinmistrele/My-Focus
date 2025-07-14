"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"

interface ForgotPasswordPageProps {
    onBackToLogin: () => void
    features: Array<{
        icon: string
        title: string
        description: string
    }>
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onBackToLogin, features }) => {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isEmailSent, setIsEmailSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim()) return

        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            setIsEmailSent(true)
        }, 2000)
    }

    const handleResendEmail = () => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            // Show success message
            alert("Email reenviado com sucesso!")
        }, 1500)
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
                        <h2 className="text-3xl font-bold text-primary mb-4">Recupere seu acesso</h2>
                        <p className="text-xl text-secondary mb-12">
                            Não se preocupe, isso acontece com todos nós. Digite seu email e enviaremos um link para redefinir sua
                            senha.
                        </p>

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

                {/* Right Side - Forgot Password Form */}
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
                            <p className="text-secondary">Recupere seu acesso</p>
                        </div>

                        <Card variant="glass" className="backdrop-blur-xl border-custom-light">
                            {!isEmailSent ? (
                                <>
                                    {/* Header */}
                                    <div className="text-center mb-6">
                                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                />
                                            </svg>
                                        </div>
                                        <h2 className="text-2xl font-bold text-primary mb-2">Esqueceu sua senha?</h2>
                                        <p className="text-secondary text-sm">
                                            Digite seu email e enviaremos um link para redefinir sua senha
                                        </p>
                                    </div>

                                    {/* Form */}
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <Input
                                            type="email"
                                            label="Email"
                                            placeholder="seu.email@exemplo.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            icon={
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                                    />
                                                </svg>
                                            }
                                        />

                                        <Button type="submit" className="w-full" size="lg" loading={isLoading}>
                                            Enviar link de recuperação
                                        </Button>
                                    </form>
                                </>
                            ) : (
                                <>
                                    {/* Success State */}
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                        <h2 className="text-2xl font-bold text-primary mb-2">Email enviado!</h2>
                                        <p className="text-secondary text-sm mb-6">
                                            Enviamos um link de recuperação para <strong className="text-primary">{email}</strong>
                                        </p>

                                        <div className="bg-surface-light rounded-lg p-4 mb-6">
                                            <div className="flex items-start space-x-3">
                                                <svg
                                                    className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                <div className="text-sm">
                                                    <p className="text-secondary">
                                                        Verifique sua caixa de entrada e spam. O link expira em 15 minutos.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Button
                                                onClick={handleResendEmail}
                                                variant="outline"
                                                className="w-full bg-transparent"
                                                loading={isLoading}
                                            >
                                                Reenviar email
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}

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
