"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "../../components/ui/Card"

interface AdminStats {
    totalUsers: number
    totalTasks: number
    totalPomodoroSessions: number
    activeUsers: number
    newUsersThisMonth: number
    tasksCompletedToday: number
}

export const AdminDashboardPage: React.FC = () => {
    const [stats, setStats] = useState<AdminStats>({
        totalUsers: 0,
        totalTasks: 0,
        totalPomodoroSessions: 0,
        activeUsers: 0,
        newUsersThisMonth: 0,
        tasksCompletedToday: 0,
    })

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setStats({
                totalUsers: 1247,
                totalTasks: 8934,
                totalPomodoroSessions: 15672,
                activeUsers: 342,
                newUsersThisMonth: 89,
                tasksCompletedToday: 156,
            })
            setIsLoading(false)
        }, 1000)
    }, [])

    const recentActivity = [
        {
            id: 1,
            user: "João Silva",
            action: "Criou uma nova tarefa",
            time: "2 minutos atrás",
            type: "task" as const,
        },
        {
            id: 2,
            user: "Maria Santos",
            action: "Completou sessão Pomodoro",
            time: "5 minutos atrás",
            type: "pomodoro" as const,
        },
        {
            id: 3,
            user: "Pedro Costa",
            action: "Fez login no sistema",
            time: "8 minutos atrás",
            type: "user" as const,
        },
        {
            id: 4,
            user: "Ana Oliveira",
            action: "Concluiu 5 tarefas",
            time: "12 minutos atrás",
            type: "task" as const,
        },
        {
            id: 5,
            user: "Carlos Lima",
            action: "Criou nova meta",
            time: "15 minutos atrás",
            type: "goal" as const,
        },
    ]

    const getActivityIcon = (type: string) => {
        switch (type) {
            case "task":
                return "📝"
            case "pomodoro":
                return "⏰"
            case "user":
                return "👤"
            case "goal":
                return "🎯"
            default:
                return "📊"
        }
    }

    const getActivityColor = (type: string) => {
        switch (type) {
            case "task":
                return "text-blue-500"
            case "pomodoro":
                return "text-green-500"
            case "user":
                return "text-purple-500"
            case "goal":
                return "text-yellow-500"
            default:
                return "text-gray-500"
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-primary">Dashboard Administrativo</h1>
                        <p className="text-secondary mt-1">Visão geral do sistema</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <div className="h-20 bg-surface-light rounded"></div>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Dashboard Administrativo</h1>
                    <p className="text-secondary mt-1">Visão geral do sistema</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>Atualizado agora</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-secondary">Total de Usuários</p>
                            <p className="text-3xl font-bold text-primary">{stats.totalUsers.toLocaleString()}</p>
                            <p className="text-sm text-green-500 mt-1">+{stats.newUsersThisMonth} este mês</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                />
                            </svg>
                        </div>
                    </div>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-secondary">Usuários Ativos</p>
                            <p className="text-3xl font-bold text-primary">{stats.activeUsers}</p>
                            <p className="text-sm text-muted mt-1">Últimas 24h</p>
                        </div>
                        <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                    </div>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-secondary">Total de Tarefas</p>
                            <p className="text-3xl font-bold text-primary">{stats.totalTasks.toLocaleString()}</p>
                            <p className="text-sm text-blue-500 mt-1">{stats.tasksCompletedToday} concluídas hoje</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                                />
                            </svg>
                        </div>
                    </div>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-secondary">Sessões Pomodoro</p>
                            <p className="text-3xl font-bold text-primary">{stats.totalPomodoroSessions.toLocaleString()}</p>
                            <p className="text-sm text-muted mt-1">Total completadas</p>
                        </div>
                        <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                    </div>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-secondary">Taxa de Engajamento</p>
                            <p className="text-3xl font-bold text-primary">87%</p>
                            <p className="text-sm text-green-500 mt-1">+5% vs mês anterior</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                    </div>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-secondary">Tempo Médio de Foco</p>
                            <p className="text-3xl font-bold text-primary">42min</p>
                            <p className="text-sm text-muted mt-1">Por sessão</p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                />
                            </svg>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-primary">Atividade Recente</h2>
                    <button className="text-sm text-primary hover:text-primary-dark transition-colors">Ver todos os logs</button>
                </div>

                <div className="space-y-4">
                    {recentActivity.map((activity) => (
                        <div
                            key={activity.id}
                            className="flex items-center space-x-4 p-3 hover:bg-surface-light rounded-lg transition-colors"
                        >
                            <div className={`text-2xl ${getActivityColor(activity.type)}`}>{getActivityIcon(activity.type)}</div>
                            <div className="flex-1">
                                <p className="text-primary font-medium">{activity.user}</p>
                                <p className="text-secondary text-sm">{activity.action}</p>
                            </div>
                            <div className="text-muted text-sm">{activity.time}</div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="text-center p-6">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-primary mb-2">Gerenciar Usuários</h3>
                        <p className="text-secondary text-sm">Visualizar e gerenciar todos os usuários do sistema</p>
                    </div>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="text-center p-6">
                        <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-primary mb-2">Relatórios</h3>
                        <p className="text-secondary text-sm">Gerar relatórios detalhados de uso e performance</p>
                    </div>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="text-center p-6">
                        <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-primary mb-2">Configurações</h3>
                        <p className="text-secondary text-sm">Configurar parâmetros globais do sistema</p>
                    </div>
                </Card>
            </div>
        </div>
    )
}
