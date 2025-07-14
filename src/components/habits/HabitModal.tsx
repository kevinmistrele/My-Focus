"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Modal } from "../ui/Modal"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"

interface Habit {
    id: string
    name: string
    description: string
    category: string
    streak: number
    bestStreak: number
    completedToday: boolean
    weeklyGoal: number
    weeklyProgress: number
    color: string
    createdAt: Date
}

interface HabitModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (habit: Habit) => void
    habit?: Habit | null
}

export const HabitModal: React.FC<HabitModalProps> = ({ isOpen, onClose, onSave, habit }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        weeklyGoal: 7,
        color: "bg-purple-500",
    })

    useEffect(() => {
        if (habit) {
            setFormData({
                name: habit.name,
                description: habit.description,
                category: habit.category,
                weeklyGoal: habit.weeklyGoal,
                color: habit.color,
            })
        } else {
            setFormData({
                name: "",
                description: "",
                category: "",
                weeklyGoal: 7,
                color: "bg-purple-500",
            })
        }
    }, [habit, isOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name.trim()) return

        const habitData: Habit = {
            id: habit?.id || Date.now().toString(),
            name: formData.name.trim(),
            description: formData.description.trim(),
            category: formData.category.trim() || "Geral",
            weeklyGoal: formData.weeklyGoal,
            color: formData.color,
            streak: habit?.streak || 0,
            bestStreak: habit?.bestStreak || 0,
            completedToday: habit?.completedToday || false,
            weeklyProgress: habit?.weeklyProgress || 0,
            createdAt: habit?.createdAt || new Date(),
        }

        onSave(habitData)
        onClose()
    }

    const categories = [
        "Saúde",
        "Desenvolvimento",
        "Bem-estar",
        "Produtividade",
        "Relacionamentos",
        "Hobbies",
        "Financeiro",
        "Geral",
    ]

    const colors = [
        "bg-purple-500",
        "bg-blue-500",
        "bg-green-500",
        "bg-yellow-500",
        "bg-red-500",
        "bg-pink-500",
        "bg-indigo-500",
        "bg-orange-500",
    ]

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={habit ? "Editar Hábito" : "Novo Hábito"} size="lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Nome do Hábito"
                    placeholder="Ex: Exercitar-se"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                />

                <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Descrição</label>
                    <textarea
                        placeholder="Descreva seu hábito..."
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 bg-surface text-primary rounded-lg border border-custom focus:border-primary transition-colors duration-200 focus-ring resize-none"
                        rows={3}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Categoria</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 bg-surface text-primary rounded-lg border border-custom focus:border-primary transition-colors duration-200 focus-ring"
                    >
                        <option value="">Selecione uma categoria</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Meta Semanal</label>
                    <div className="flex items-center space-x-3">
                        <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, weeklyGoal: Math.max(1, prev.weeklyGoal - 1) }))}
                            className="w-8 h-8 rounded bg-surface-light hover:bg-surface text-primary flex items-center justify-center"
                        >
                            -
                        </button>
                        <span className="text-lg font-medium text-primary w-16 text-center">{formData.weeklyGoal} dias</span>
                        <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, weeklyGoal: Math.min(7, prev.weeklyGoal + 1) }))}
                            className="w-8 h-8 rounded bg-surface-light hover:bg-surface text-primary flex items-center justify-center"
                        >
                            +
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Cor</label>
                    <div className="flex space-x-2 flex-wrap gap-2">
                        {colors.map((color) => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => setFormData((prev) => ({ ...prev, color }))}
                                className={`w-8 h-8 rounded-full ${color} border-2 ${
                                    formData.color === color ? "border-white shadow-lg" : "border-transparent"
                                } hover:scale-110 transition-transform`}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit">{habit ? "Salvar Alterações" : "Criar Hábito"}</Button>
                </div>
            </form>
        </Modal>
    )
}
