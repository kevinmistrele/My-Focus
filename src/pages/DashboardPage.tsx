"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"

interface DashboardPageProps {
    onNavigate: (path: string) => void
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
    const [greeting, setGreeting] = useState(() => {
        const hour = new Date().getHours()
        if (hour < 12) return "Bom dia"
        if (hour < 18) return "Boa tarde"
        return "Boa noite"
    })

    // Mock data - em um app real viria de uma API/estado global
    const stats = {
        tasksCompleted: 12,
        tasksTotal: 18,
        pomodoroSessions: 8,
        focusTime: 240, // minutes
        streak: 5,
        weeklyGoal: 75, // percentage
    }

    const recentTasks = [
        { id: 1, title: "Revisar código do projeto", completed: true, priority: "high" },
        { id: 2, title: "Preparar apresentação", completed: false, priority: "medium" },
        { id: 3, title: "Responder emails", completed: true, priority: "low" },
    ]

    const todayHabits = [
        { id: 1, name: "Exercitar-se", completed: true, streak: 12 },
        { id: 2, name: "Ler 30 min", completed: false, streak: 8 },
        { id: 3, name: "Meditar", completed: true, streak: 5 },
    ]

    const quickActions = [
        { icon: "⏰", label: "Iniciar Pomodoro", action: "/pomodoro" },
        { icon: "✅", label: "Nova Tarefa", action: "/tasks" },
        { icon: "🎯", label: "Ver Metas", action: "/goals" },
        { icon: "📝", label: "Anotação Rápida", action: "/notes" },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">{greeting}! 👋</h1>
                    <p className="text-secondary mt-1">Vamos manter o foco hoje</p>
                </div>
            </div>

            {/* Quick Actions */}
            <Card>
                <h2 className="text-lg font-semibold text-primary mb-4">Ações Rápidas</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {quickActions.map((action, index) => (
                        <Button
                            key={index}
                            variant="ghost"
                            className="h-20 flex-col space-y-2 hover:bg-primary hover:bg-opacity-10 hover:border-primary border border-transparent"
                            onClick={() => onNavigate(action.action)}
                        >
                            <span className="text-2xl">{action.icon}</span>
                            <span className="text-sm">{action.label}</span>
                        </Button>
                    ))}
                </div>
            </Card>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card padding="sm" className="text-center">
                    <div className="text-3xl font-bold text-primary">
                        {stats.tasksCompleted}/{stats.tasksTotal}
                    </div>
                    <div className="text-sm text-secondary">Tarefas Hoje</div>
                    <div className="w-full bg-surface-light rounded-full h-2 mt-2">
                        <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(stats.tasksCompleted / stats.tasksTotal) * 100}%` }}
                        />
                    </div>
                </Card>

                <Card padding="sm" className="text-center">
                    <div className="text-3xl font-bold text-green-500">{stats.pomodoroSessions}</div>
                    <div className="text-sm text-secondary">Pomodoros</div>
                    <div className="text-xs text-muted mt-1">
                        {Math.floor(stats.focusTime / 60)}h {stats.focusTime % 60}m focado
                    </div>
                </Card>

                <Card padding="sm" className="text-center">
                    <div className="text-3xl font-bold text-yellow-500">{stats.streak}</div>
                    <div className="text-sm text-secondary">Dias Consecutivos</div>
                    <div className="text-xs text-muted mt-1">🔥 Você está em chamas!</div>
                </Card>

                <Card padding="sm" className="text-center">
                    <div className="text-3xl font-bold text-purple-500">{stats.weeklyGoal}%</div>
                    <div className="text-sm text-secondary">Meta Semanal</div>
                    <div className="w-full bg-surface-light rounded-full h-2 mt-2">
                        <div
                            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${stats.weeklyGoal}%` }}
                        />
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Tasks */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-primary">Tarefas Recentes</h2>
                        <Button variant="ghost" size="sm" onClick={() => onNavigate("/tasks")}>
                            Ver todas
                        </Button>
                    </div>
                    <div className="space-y-3">
                        {recentTasks.map((task) => (
                            <div
                                key={task.id}
                                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-surface-light transition-colors"
                            >
                                <div
                                    className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                        task.completed ? "bg-primary border-primary" : "border-custom-light"
                                    }`}
                                >
                                    {task.completed && (
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className={`font-medium ${task.completed ? "line-through text-muted" : "text-primary"}`}>
                                        {task.title}
                                    </div>
                                </div>
                                <div
                                    className={`w-2 h-2 rounded-full ${
                                        task.priority === "high"
                                            ? "bg-red-500"
                                            : task.priority === "medium"
                                                ? "bg-yellow-500"
                                                : "bg-green-500"
                                    }`}
                                />
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Today's Habits */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-primary">Hábitos de Hoje</h2>
                        <Button variant="ghost" size="sm" onClick={() => onNavigate("/habits")}>
                            Ver todos
                        </Button>
                    </div>
                    <div className="space-y-3">
                        {todayHabits.map((habit) => (
                            <div
                                key={habit.id}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-light transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <div
                                        className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                            habit.completed ? "bg-primary border-primary" : "border-custom-light"
                                        }`}
                                    >
                                        {habit.completed && (
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                    <span className={`font-medium ${habit.completed ? "text-muted" : "text-primary"}`}>{habit.name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-secondary">{habit.streak} dias</span>
                                    <span className="text-orange-500">🔥</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}
