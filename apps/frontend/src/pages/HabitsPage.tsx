"use client"

import React, {useEffect} from "react"
import { useState } from "react"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { HabitModal } from "../components/habits/HabitModal"
import type { Habit } from "../lib/types"
import {HabitService} from "../services";
import {toast} from "sonner";


export const HabitsPage: React.FC = () => {
    const [habits, setHabits] = useState<Habit[]>([])
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const fetchHabits = async () => {
            try {
                const data = await HabitService.getAll()
                setHabits(data)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                toast.error("Erro ao buscar hábitos.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchHabits()
    }, [])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
    const toggleHabit = async (id: string) => {
        try {
            await HabitService.checkin(id)

            // Recarrega todos os hábitos com status atualizado do backend
            const updatedHabits = await HabitService.getAll()
            setHabits(updatedHabits)
            toast.success("Hábito atualizado!")
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Erro ao marcar hábito.")
        }
    }




    const handleDeleteHabit = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este hábito?")) return;

        try {
            await HabitService.delete(id);
            setHabits(habits.filter(h => h.id !== id));
            toast.success("Hábito excluído com sucesso.")
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            toast.error("Erro ao excluir hábito.")
        }
    };

    const stats = {
        totalHabits: habits.length,
        completedToday: habits.filter((h) => h.completedToday).length,
        longestStreak: Math.max(...habits.map((h) => h.streak), 0),
        weeklyCompletion:
            habits.length > 0
                ? Math.round((habits.reduce((acc, h) => acc + h.weeklyProgress / h.weeklyGoal, 0) / habits.length) * 100)
                : 0,
    }

    const handleSaveHabit = async (habitData: Habit) => {
        try {
            if (editingHabit) {
                const updated = await HabitService.update(habitData.id, habitData)
                setHabits(habits.map((habit) => (habit.id === habitData.id ? updated : habit)))
                toast.success("Hábito atualizado com sucesso.")
            } else {
                const created = await HabitService.create(habitData)
                setHabits([created, ...habits])
                toast.success("Hábito criado com sucesso.")
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            toast.error("Erro ao salvar hábito.")
        } finally {
            setEditingHabit(null)
        }
    }

    const handleAddHabit = () => {
        setEditingHabit(null)
        setIsModalOpen(true)
    }

    // Generate week days for streak visualization
    const getWeekDays = () => {
        const days = []
        for (let i = 6; i >= 0; i--) {
            const date = new Date()
            date.setDate(date.getDate() - i)
            days.push(date)
        }
        return days
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Hábitos</h1>
                    <p className="text-secondary mt-1">Construa rotinas positivas</p>
                </div>
                <Button
                    onClick={handleAddHabit}
                    className="shadow-purple"
                    disabled={habits.length >= 10}
                    title={habits.length >= 10 ? "Limite de 10 hábitos atingido" : ""}
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Novo Hábito
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card padding="sm" className="text-center">
                    <div className="text-2xl font-bold text-primary">
                        {stats.completedToday}/{stats.totalHabits}
                    </div>
                    <div className="text-sm text-secondary">Hoje</div>
                </Card>
                <Card padding="sm" className="text-center">
                    <div className="text-2xl font-bold text-orange-500">{stats.longestStreak}</div>
                    <div className="text-sm text-secondary">Maior Sequência</div>
                </Card>
                <Card padding="sm" className="text-center">
                    <div className="text-2xl font-bold text-green-500">{stats.weeklyCompletion}%</div>
                    <div className="text-sm text-secondary">Meta Semanal</div>
                </Card>
                <Card padding="sm" className="text-center">
                    <div className="text-2xl font-bold text-purple-500">{stats.totalHabits}</div>
                    <div className="text-sm text-secondary">Hábitos Ativos</div>
                </Card>
            </div>

            {/* Habits List */}
            <div className="space-y-4">
                {habits.map((habit) => (
                    <Card key={habit.id} className="hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 flex-1">
                                <button
                                    onClick={() => toggleHabit(habit.id)}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                                        habit.completedToday
                                            ? "bg-purple-500 shadow-lg"
                                            : "bg-surface-light border-2 border-custom-light hover:border-primary"
                                    }`}
                                >
                                    {habit.completedToday ? (
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    ) : (
                                        <div className="w-6 h-6 border-2 border-custom-light rounded" />
                                    )}
                                </button>

                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-1">
                                        <h3 className="text-lg font-semibold text-primary">{habit.name}</h3>
                                        <span className="px-2 py-1 bg-surface-light text-xs rounded-full text-secondary">
                      {habit.category}
                    </span>

                                        <button
                                            onClick={() => handleDeleteHabit(habit.id)}
                                            className="text-red-500 hover:text-red-700 text-sm ml-2"
                                            title="Excluir hábito"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                    <p className="text-secondary text-sm mb-2">{habit.description}</p>

                                    {/* Week Progress */}
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs text-muted">Esta semana:</span>
                                        <div className="flex space-x-1">
                                            {getWeekDays().map((day, index) => (
                                                <div
                                                    key={index}
                                                    className={`w-3 h-3 rounded-sm ${
                                                        index < habit.weeklyProgress ? "bg-purple-500" : "bg-surface-light"
                                                    }`}
                                                    title={day.toLocaleDateString("pt-BR", { weekday: "short" })}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs text-muted">
                      {habit.weeklyProgress}/{habit.weeklyGoal}
                    </span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="flex items-center space-x-2 mb-1">
                                    <span className="text-orange-500">🔥</span>
                                    <span className="text-lg font-bold text-primary">{habit.streak}</span>
                                </div>
                                <div className="text-xs text-muted">Melhor: {habit.bestStreak}</div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {habits.length === 0 && (
                <Card>
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🎯</div>
                        <h3 className="text-lg font-medium text-secondary mb-2">Nenhum hábito criado</h3>
                        <p className="text-muted mb-4">Comece criando hábitos positivos para sua rotina</p>
                        <Button>Criar primeiro hábito</Button>
                    </div>
                </Card>
            )}

            {/* Habit Modal */}
            <HabitModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setEditingHabit(null)
                }}
                onSave={handleSaveHabit}
                habit={editingHabit}
            />
        </div>
    )
}
