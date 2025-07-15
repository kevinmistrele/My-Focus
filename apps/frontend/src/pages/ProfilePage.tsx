"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Modal } from "../components/ui/Modal"

export const ProfilePage: React.FC = () => {
    const [user, setUser] = useState({
        name: "João Silva",
        email: "joao@exemplo.com",
        avatar: "",
        joinDate: new Date("2024-01-15"),
        stats: {
            tasksCompleted: 156,
            pomodoroSessions: 89,
            totalFocusTime: 2340, // minutes
            streak: 12,
        },
    })

    const [isEditing, setIsEditing] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
    })

    const handleSave = () => {
        setUser((prev) => ({ ...prev, ...formData }))
        setIsEditing(false)
    }

    const handleDeleteAccount = () => {
        // Aqui você implementaria a lógica de exclusão
        console.log("Conta excluída")
        setShowDeleteModal(false)
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Perfil</h1>
                    <p className="text-secondary mt-1">Gerencie suas informações pessoais</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <div className="flex items-center space-x-6 mb-6">
                            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                                {user.avatar ? (
                                    <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-20 h-20 rounded-full" />
                                ) : (
                                    <span className="text-2xl font-bold text-white">
                    {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                  </span>
                                )}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-primary">{user.name}</h2>
                                <p className="text-secondary">{user.email}</p>
                                <p className="text-muted text-sm">
                                    Membro desde{" "}
                                    {user.joinDate.toLocaleDateString("pt-BR", {
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                            <Button variant="outline" onClick={() => setIsEditing(true)}>
                                Editar
                            </Button>
                        </div>

                        {isEditing && (
                            <div className="space-y-4 pt-4 border-t border-custom">
                                <Input
                                    label="Nome"
                                    value={formData.name}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                />
                                <Input
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                />
                                <div className="flex space-x-3">
                                    <Button onClick={handleSave}>Salvar</Button>
                                    <Button variant="ghost" onClick={() => setIsEditing(false)}>
                                        Cancelar
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Account Actions */}
                    <Card>
                        <h3 className="text-lg font-semibold text-primary mb-4">Ações da Conta</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-surface-light rounded-lg">
                                <div>
                                    <h4 className="font-medium text-primary">Exportar Dados</h4>
                                    <p className="text-sm text-secondary">Baixe todos os seus dados em formato JSON</p>
                                </div>
                                <Button variant="outline" size="sm">
                                    Exportar
                                </Button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-surface-light rounded-lg">
                                <div>
                                    <h4 className="font-medium text-primary">Alterar Senha</h4>
                                    <p className="text-sm text-secondary">Atualize sua senha de acesso</p>
                                </div>
                                <Button variant="outline" size="sm">
                                    Alterar
                                </Button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <div>
                                    <h4 className="font-medium text-red-400">Excluir Conta</h4>
                                    <p className="text-sm text-red-300">Esta ação não pode ser desfeita</p>
                                </div>
                                <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
                                    Excluir
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Legal */}
                    <Card>
                        <h3 className="text-lg font-semibold text-primary mb-4">Legal</h3>
                        <div className="space-y-3">
                            <button className="flex items-center justify-between w-full p-3 hover:bg-surface-light rounded-lg transition-colors">
                                <span className="text-secondary">Termos de Uso</span>
                                <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                            <button className="flex items-center justify-between w-full p-3 hover:bg-surface-light rounded-lg transition-colors">
                                <span className="text-secondary">Política de Privacidade</span>
                                <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                            <button className="flex items-center justify-between w-full p-3 hover:bg-surface-light rounded-lg transition-colors">
                                <span className="text-secondary">LGPD - Proteção de Dados</span>
                                <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </Card>
                </div>

                {/* Stats Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <h3 className="text-lg font-semibold text-primary mb-4">Suas Estatísticas</h3>
                        <div className="space-y-4">
                            <div className="text-center p-4 bg-surface-light rounded-lg">
                                <div className="text-2xl font-bold text-primary">{user.stats.tasksCompleted}</div>
                                <div className="text-sm text-secondary">Tarefas Concluídas</div>
                            </div>

                            <div className="text-center p-4 bg-surface-light rounded-lg">
                                <div className="text-2xl font-bold text-green-500">{user.stats.pomodoroSessions}</div>
                                <div className="text-sm text-secondary">Sessões Pomodoro</div>
                            </div>

                            <div className="text-center p-4 bg-surface-light rounded-lg">
                                <div className="text-2xl font-bold text-blue-500">
                                    {Math.floor(user.stats.totalFocusTime / 60)}h {user.stats.totalFocusTime % 60}m
                                </div>
                                <div className="text-sm text-secondary">Tempo Focado</div>
                            </div>

                            <div className="text-center p-4 bg-surface-light rounded-lg">
                                <div className="text-2xl font-bold text-orange-500">{user.stats.streak}</div>
                                <div className="text-sm text-secondary">Sequência Atual</div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Delete Account Modal */}
            <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Excluir Conta">
                <div className="space-y-4">
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                            <div>
                                <h4 className="font-medium text-red-400">Atenção!</h4>
                                <p className="text-sm text-red-300">Esta ação não pode ser desfeita.</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-secondary">
                        Ao excluir sua conta, todos os seus dados serão permanentemente removidos, incluindo:
                    </p>

                    <ul className="list-disc list-inside text-sm text-muted space-y-1">
                        <li>Todas as suas tarefas e projetos</li>
                        <li>Histórico de sessões Pomodoro</li>
                        <li>Metas e hábitos criados</li>
                        <li>Anotações e configurações</li>
                    </ul>

                    <div className="flex space-x-3 pt-4">
                        <Button variant="danger" onClick={handleDeleteAccount} className="flex-1">
                            Sim, excluir minha conta
                        </Button>
                        <Button variant="ghost" onClick={() => setShowDeleteModal(false)} className="flex-1">
                            Cancelar
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
