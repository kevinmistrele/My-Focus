"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { GoalModal } from "../components/goals/GoalModal"

interface Goal {
    id: string
    title: string
    description: string
    type: "short" | "long"
    category: string
    targetDate: Date
    progress: number
    completed: boolean
    createdAt: Date
}

export const GoalsPage: React.FC = () => {
    const [goals, setGoals] = useState<Goal[]>([
        {
            id: "1",
            title: "Ler 12 livros este ano",
            description: "Desenvolver o hábito de leitura regular",
            type: "long",
            category: "Desenvolvimento Pessoal",
            targetDate: new Date("2024-12-31"),
            progress: 25,
            completed: false,
            createdAt: new Date(),
        },
        {
            id: "2",
            title: "Completar curso de React",
            description: "Finalizar todas as aulas e projetos práticos",
            type: "short",
            category: "Carreira",
            targetDate: new Date("2024-02-15"),
            progress: 75,
            completed: false,
            createdAt: new Date(),
        },
    ])

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
    const [filter, setFilter] = useState<"all" | "short" | "long">("all")

    const filteredGoals = goals.filter((goal) => filter === "all" || goal.type === filter)

    const handleSaveGoal = (goalData: Goal) => {
        if (editingGoal) {
            setGoals(goals.map((goal) => (goal.id === goalData.id ? goalData : goal)))
        } else {
            setGoals([goalData, ...goals])
        }
        setEditingGoal(null)
    }

    const handleEditGoal = (goal: Goal) => {
        setEditingGoal(goal)
        setIsModalOpen(true)
    }

    const handleAddGoal = () => {
        setEditingGoal(null)
        setIsModalOpen(true)
    }

    const stats = {
        total: goals.length,
        completed: goals.filter((g) => g.completed).length,
        inProgress: goals.filter((g) => !g.completed).length,
        avgProgress: goals.length > 0 ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length) : 0,
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Metas</h1>
                    <p className="text-secondary mt-1">Defina e acompanhe seus objetivos</p>
                </div>
                <Button onClick={handleAddGoal} className="shadow-purple">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nova Meta
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card padding="sm" className="text-center">
                    <div className="text-2xl font-bold text-primary">{stats.total}</div>
                    <div className="text-sm text-secondary">Total de Metas</div>
                </Card>
                <Card padding="sm" className="text-center">
                    <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
                    <div className="text-sm text-secondary">Concluídas</div>
                </Card>
                <Card padding="sm" className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">{stats.inProgress}</div>
                    <div className="text-sm text-secondary">Em Progresso</div>
                </Card>
                <Card padding="sm" className="text-center">
                    <div className="text-2xl font-bold text-purple-500">{stats.avgProgress}%</div>
                    <div className="text-sm text-secondary">Progresso Médio</div>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <div className="flex space-x-2">
                    {[
                        { key: "all", label: "Todas" },
                        { key: "short", label: "Curto Prazo" },
                        { key: "long", label: "Longo Prazo" },
                    ].map((filterOption) => (
                        <Button
                            key={filterOption.key}
                            variant={filter === filterOption.key ? "primary" : "ghost"}
                            size="sm"
                            onClick={() => setFilter(filterOption.key as any)}
                        >
                            {filterOption.label}
                        </Button>
                    ))}
                </div>
            </Card>

            {/* Goals List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredGoals.map((goal) => (
                    <Card key={goal.id} className="hover:shadow-xl transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                    <h3 className="text-lg font-semibold text-primary">{goal.title}</h3>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs ${
                                            goal.type === "short" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"
                                        }`}
                                    >
                    {goal.type === "short" ? "Curto Prazo" : "Longo Prazo"}
                  </span>
                                </div>
                                <p className="text-secondary text-sm mb-3">{goal.description}</p>
                                <div className="flex items-center space-x-4 text-xs text-muted">
                                    <span>📂 {goal.category}</span>
                                    <span>📅 {goal.targetDate.toLocaleDateString("pt-BR")}</span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-secondary">Progresso</span>
                                <span className="text-sm font-medium text-primary">{goal.progress}%</span>
                            </div>
                            <div className="w-full bg-surface-light rounded-full h-2">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${goal.progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 bg-transparent"
                                onClick={() => handleEditGoal(goal)}
                            >
                                Editar
                            </Button>
                            <Button variant="ghost" size="sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {filteredGoals.length === 0 && (
                <Card>
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🎯</div>
                        <h3 className="text-lg font-medium text-secondary mb-2">Nenhuma meta encontrada</h3>
                        <p className="text-muted mb-4">Comece definindo seus objetivos e acompanhe seu progresso</p>
                        <Button onClick={() => setIsModalOpen(true)}>Criar primeira meta</Button>
                    </div>
                </Card>
            )}

            {/* Goal Modal */}
            <GoalModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setEditingGoal(null)
                }}
                onSave={handleSaveGoal}
                goal={editingGoal}
            />
        </div>
    )
}
