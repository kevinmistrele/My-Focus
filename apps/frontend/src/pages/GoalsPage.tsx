"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { GoalModal } from "../components/goals/GoalModal"
import type {Goal} from "../lib/types.ts";
import {GoalService} from "../services";
import {toast} from "sonner";


export const GoalsPage: React.FC = () => {
    const [goals, setGoals] = useState<Goal[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
    const [filter, setFilter] = useState<"all" | "short" | "long">("all")
    const hasReachedLimit = goals.length >= 8
    const [isSaving, setIsSaving] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [updatingId, setUpdatingId] = useState<string | null>(null)



    const fetchGoals = async () => {
        try {
            const res = await GoalService.getAll()

            const parsed: Goal[] = Array.isArray(res)
                ? res
                    .filter((goal) => goal && goal.targetDate)
                    .map((goal) => {
                        return {
                            ...goal,
                            targetDate: goal?.targetDate ? new Date(goal.targetDate) : null,
                            createdAt: goal?.createdAt ? new Date(goal.createdAt) : new Date(),
                        }
                    })
                : []
            setGoals(parsed)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            toast.error("Erro ao carregar metas.")
        }
    }

    useEffect(() => {
        fetchGoals()
    }, [])

    const handleProgressChange = async (goalId: string, newProgress: number) => {
        setUpdatingId(goalId)
        try {
            await GoalService.update(goalId, { progress: newProgress })
            setGoals((prev) =>
                prev.map((g) =>
                    g.id === goalId ? { ...g, progress: newProgress } : g
                )
            )
            toast.success("Progresso atualizado!")
        } catch (err) {
            toast.error("Erro ao atualizar progresso.")
        } finally {
            setUpdatingId(null)
        }
    }






    const handleSaveGoal = async (goalData: Goal) => {
        setIsSaving(true)
        try {
            if (editingGoal) {
                const updated = await GoalService.update(goalData.id, {
                    ...goalData,
                    targetDate: goalData.targetDate?.toISOString().split("T")[0] ?? "",
                })
                setGoals((prev) =>
                    prev.map((g) => (g.id === goalData.id ? { ...updated.data, targetDate: new Date(updated.data.targetDate) } : g))
                )
                toast.success("Meta atualizada com sucesso!")
            } else {
                await GoalService.create({
                    ...goalData,
                    targetDate: goalData.targetDate?.toISOString().split("T")[0] ?? "",
                })
                await fetchGoals()
                toast.success("Meta criada com sucesso!")
            }
        } catch (err) {
            toast.error("Erro ao salvar meta.")
        } finally {
            setIsSaving(false)
            setEditingGoal(null)
            setIsModalOpen(false)
        }
    }


    const handleDelete = async (goalId: string) => {
        setDeletingId(goalId)
        try {
            await GoalService.delete(goalId)
            setGoals((prev) => prev.filter((g) => g.id !== goalId))
            toast.success("Meta excluída com sucesso!")
        } catch (err) {
            toast.error("Erro ao excluir meta.")
        } finally {
            setDeletingId(null)
        }
    }



    const filteredGoals = goals.filter((goal) => filter === "all" || goal.type === filter)

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
                <Button
                    onClick={() => !hasReachedLimit && setIsModalOpen(true)}
                    disabled={hasReachedLimit}
                    className="shadow-purple"
                >

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

            {/* Filtros */}
            <Card>
                <div className="flex space-x-2">
                    {[
                        { key: "all", label: "Todas" },
                        { key: "short", label: "Curto Prazo" },
                        { key: "long", label: "Longo Prazo" },
                    ].map((f) => (
                        <Button
                            key={f.key}
                            variant={filter === f.key ? "primary" : "ghost"}
                            size="sm"
                            onClick={() => setFilter(f.key as any)}
                        >
                            {f.label}
                        </Button>
                    ))}
                </div>
            </Card>

            {/* Lista de metas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredGoals.filter(g => g && g.targetDate !== undefined).map((goal) => (
                    <Card key={goal.id} className="hover:shadow-xl transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                    <h3 className="text-lg font-semibold text-primary">{goal.title}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        goal.type === "short"
                                            ? "bg-blue-500/20 text-blue-400"
                                            : "bg-purple-500/20 text-purple-400"
                                    }`}>
                                        {goal.type === "short" ? "Curto Prazo" : "Longo Prazo"}
                                    </span>
                                </div>
                                <p className="text-secondary text-sm mb-3">{goal.description}</p>
                                <div className="flex items-center space-x-4 text-xs text-muted">
                                    <span>📂 {goal.category}</span>
                                    <span>
  📅 {goal.targetDate
                                        ? new Date(goal.targetDate).toLocaleDateString("pt-BR")
                                        : "Sem data"}
</span>
                                </div>
                            </div>
                        </div>

                        {/* Progresso */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-secondary">Progresso</span>
                                <span className="text-sm font-medium text-primary">{goal.progress}%</span>
                            </div>
                            <div className="w-full bg-surface-light rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: `${goal.progress}%` }} />
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleProgressChange(goal.id, Math.max(0, goal.progress - 10))}
                                disabled={goal.progress <= 0}
                                loading={updatingId === goal.id}
                            >
                                -10%
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleProgressChange(goal.id, Math.min(100, goal.progress + 10))}
                                disabled={goal.progress >= 100}
                                loading={updatingId === goal.id}
                            >
                                +10%
                            </Button>
                        </div>


                        {/* Ações */}
                        <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="flex-1" onClick={() => {
                                setEditingGoal(goal)
                                setIsModalOpen(true)
                            }}>
                                Editar
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(goal.id)}
                                loading={deletingId === goal.id}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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

            <GoalModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setEditingGoal(null)
                }}
                onSave={handleSaveGoal}
                goal={editingGoal}
                isLoading={isSaving}
            />
        </div>
    )
}
