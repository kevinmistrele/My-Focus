import React, {useEffect, useState} from "react"
import {Card} from "../components/ui/Card"
import {Button} from "../components/ui/Button"
import {Input} from "../components/ui/Input"
import {ForgotPasswordPage} from "./ForgotPasswordPage"
import {ResetPasswordPage} from "./ResetPasswordPage"
import {AuthService} from "../services"
import type {User} from "../lib/types"
import {toast} from "sonner"
import {Modal} from "../components/ui/Modal"

interface LoginPageProps {
    onLogin: (user: User, token: string) => void
}

type AuthView = "login" | "register" | "forgot-password" | "reset-password"

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [currentView, setCurrentView] = useState<AuthView>("login")
    const [isLogin, setIsLogin] = useState(true)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const [resetToken, setResetToken] = useState<string | null>(null)

    const [showTermsModal, setShowTermsModal] = useState(false)
    const [showPrivacyModal, setShowPrivacyModal] = useState(false)

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get("token")
        if (token) {
            setResetToken(token)
            setCurrentView("reset-password")
        }
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            if (isLogin) {
                const res = await AuthService.login(formData.email, formData.password)
                if (!res) {
                    toast.error("Erro ao fazer login. Tente novamente.")
                    return
                }
                localStorage.setItem("token", res.token)
                onLogin(res.user, res.token)
                toast.success("Login realizado com sucesso!")
            } else {
                if (formData.password !== formData.confirmPassword) {
                    toast.error("As senhas não coincidem.")
                    return
                }
                await AuthService.register(formData.name, formData.email, formData.password)
                toast.success("Conta criada com sucesso! Faça login.")
                setIsLogin(true)
            }
        } catch (error: any) {
            toast.error(error.message || "Erro desconhecido.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleForgotPassword = () => setCurrentView("forgot-password")
    const handleBackToLogin = () => {
        setCurrentView("login")
        setResetToken(null)
    }
    const handlePasswordResetSuccess = () => {
        setCurrentView("login")
        setResetToken(null)
        alert("Senha redefinida com sucesso! Faça login com sua nova senha.")
    }

    const features = [
        { icon: "🎯", title: "Foco Total", description: "Timer Pomodoro personalizado para manter sua concentração" },
        { icon: "✅", title: "Gestão de Tarefas", description: "Organize suas atividades com prioridades e tags" },
        { icon: "🏆", title: "Metas & Hábitos", description: "Defina objetivos e acompanhe seus hábitos diários" },
        { icon: "📊", title: "Relatórios", description: "Visualize seu progresso e produtividade" },
    ]

    if (currentView === "forgot-password") {
        return <ForgotPasswordPage onBackToLogin={handleBackToLogin} features={features} />
    }

    if (currentView === "reset-password") {
        return (
            <ResetPasswordPage
                token={resetToken}
                onSuccess={handlePasswordResetSuccess}
                onBackToLogin={handleBackToLogin}
                features={features}
            />
        )
    }

    return (
        <div className="min-h-screen dark-gradient-bg relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/30 via-black/50 to-black" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary opacity-20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600 opacity-15 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary opacity-10 rounded-full blur-2xl" />
            </div>

            <div className="relative z-10 flex min-h-screen">
                {/* Left */}
                <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12">
                    <div className="max-w-lg">
                        <div className="flex items-center mb-8">
                            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mr-4 shadow-purple">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h1 className="text-4xl font-bold text-primary">MyFocus</h1>
                        </div>

                        <h2 className="text-3xl font-bold text-primary mb-4">Transforme sua produtividade</h2>
                        <p className="text-xl text-secondary mb-12">
                            A plataforma completa para organizar tarefas, manter o foco e alcançar seus objetivos com eficiência.
                        </p>

                        <div className="space-y-6">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-start space-x-4 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
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

                {/* Right */}
                <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
                    <div className="w-full max-w-md">
                        <div className="lg:hidden text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-purple">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-primary mb-2">MyFocus</h1>
                            <p className="text-secondary">Sua produtividade em foco</p>
                        </div>

                        <Card variant="glass" className="backdrop-blur-xl border-custom-light">
                            {/* Toggle */}
                            <div className="flex bg-surface-light rounded-xl p-1 mb-6">
                                <button
                                    onClick={() => setIsLogin(true)}
                                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                                        isLogin ? "bg-primary text-white shadow-purple" : "text-secondary hover:text-primary"
                                    }`}
                                >
                                    Entrar
                                </button>
                                <button
                                    onClick={() => setIsLogin(false)}
                                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                                        !isLogin ? "bg-primary text-white shadow-purple" : "text-secondary hover:text-primary"
                                    }`}
                                >
                                    Criar conta
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {!isLogin && (
                                    <Input
                                        type="text"
                                        label="Nome completo"
                                        placeholder="Como você gostaria de ser chamado?"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        required
                                        icon={
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        }
                                    />
                                )}

                                <Input
                                    type="email"
                                    label="Email"
                                    placeholder="seu.email@exemplo.com"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
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

                                <Input
                                    type="password"
                                    label="Senha"
                                    placeholder="Mínimo 8 caracteres"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange("password", e.target.value)}
                                    required
                                    icon={
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    }
                                />

                                {!isLogin && (
                                    <Input
                                        type="password"
                                        label="Confirmar senha"
                                        placeholder="Digite a senha novamente"
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                        required
                                        icon={
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        }
                                    />
                                )}

                                <Button type="submit" className="w-full" size="lg" loading={isLoading}>
                                    {isLogin ? "Entrar na minha conta" : "Criar minha conta"}
                                </Button>
                            </form>

                            {isLogin && (
                                <div className="mt-6 text-center">
                                    <button onClick={handleForgotPassword} className="text-primary hover:text-primary-dark transition-colors text-sm">
                                        Esqueceu sua senha?
                                    </button>
                                </div>
                            )}

                            {!isLogin && (
                                <div className="mt-6 text-center">
                                    <p className="text-xs text-muted">
                                        Ao criar uma conta, você concorda com nossos{" "}
                                        <button className="text-primary hover:underline" onClick={() => setShowTermsModal(true)}>
                                            Termos de Uso
                                        </button>{" "}
                                        e{" "}
                                        <button className="text-primary hover:underline" onClick={() => setShowPrivacyModal(true)}>
                                            Política de Privacidade
                                        </button>
                                    </p>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>

            {/* ⬇️ MODAL: TERMOS DE USO */}
            <Modal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} title="Termos de Uso" size="lg">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    <div className="prose prose-sm text-secondary">
                        <h3 className="text-primary font-semibold">1. Aceitação dos Termos</h3>
                        <p>Ao utilizar o MyFocus, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar, não use o serviço.</p>
                        <h3 className="text-primary font-semibold">2. Descrição do Serviço</h3>
                        <p>O MyFocus oferece ferramentas para gerenciamento de tarefas, Pomodoro, hábitos e metas pessoais.</p>
                        <h3 className="text-primary font-semibold">3. Conta do Usuário</h3>
                        <p>Você é responsável por manter a confidencialidade da sua conta e senha.</p>
                        <h3 className="text-primary font-semibold">4. Uso Aceitável</h3>
                        <p>Use o serviço apenas para fins legais e de acordo com estes Termos.</p>
                        <h3 className="text-primary font-semibold">5. Propriedade Intelectual</h3>
                        <p>O conteúdo do serviço é propriedade do MyFocus e protegido por lei.</p>
                        <h3 className="text-primary font-semibold">6. Limitação de Responsabilidade</h3>
                        <p>O MyFocus não se responsabiliza por danos indiretos ou consequenciais decorrentes do uso.</p>
                        <h3 className="text-primary font-semibold">7. Modificações</h3>
                        <p>Podemos modificar estes Termos a qualquer momento, com efeito imediato após publicação.</p>
                    </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-custom">
                    <Button onClick={() => setShowTermsModal(false)}>Fechar</Button>
                </div>
            </Modal>

            {/* ⬇️ MODAL: POLÍTICA DE PRIVACIDADE */}
            <Modal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} title="Política de Privacidade" size="lg">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    <div className="prose prose-sm text-secondary">
                        <h3 className="text-primary font-semibold">1. Informações que Coletamos</h3>
                        <p>Coletamos informações que você nos fornece diretamente, como nome, email e dados de uso.</p>
                        <h3 className="text-primary font-semibold">2. Como Usamos suas Informações</h3>
                        <ul className="list-disc list-inside ml-4">
                            <li>Fornecer e aprimorar nossos serviços</li>
                            <li>Personalizar sua experiência</li>
                            <li>Comunicar atualizações e novidades</li>
                            <li>Garantir a segurança da plataforma</li>
                        </ul>
                        <h3 className="text-primary font-semibold">3. Compartilhamento de Informações</h3>
                        <p>Não vendemos seus dados; compartilhamos apenas quando necessário ou exigido por lei.</p>
                        <h3 className="text-primary font-semibold">4. Segurança dos Dados</h3>
                        <p>Adotamos medidas para proteger suas informações de acessos não autorizados.</p>
                        <h3 className="text-primary font-semibold">5. Cookies e Tecnologias Similares</h3>
                        <p>Usamos cookies para melhorar a experiência, analisar uso e personalizar conteúdo.</p>
                        <h3 className="text-primary font-semibold">6. Seus Direitos</h3>
                        <p>Você pode acessar, corrigir ou excluir seus dados. Fale conosco para exercer estes direitos.</p>
                        <h3 className="text-primary font-semibold">7. Alterações na Política</h3>
                        <p>Podemos atualizar esta política periodicamente e notificaremos mudanças significativas.</p>
                    </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-custom">
                    <Button onClick={() => setShowPrivacyModal(false)}>Fechar</Button>
                </div>
            </Modal>
        </div>
    )
}
