"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Modal } from "../ui/Modal"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"

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

interface GoalModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (goal: Goal) => void
    goal?: Goal | null
}

export const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose, onSave, goal }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "short" as "short" | "long",
        category: "",
        targetDate: "",
    })

    useEffect(() => {
        if (goal) {
            setFormData({
                title: goal.title,
                description: goal.description,
                type: goal.type,
                category: goal.category,
                targetDate: goal.targetDate.toISOString().split("T")[0],
            })
        } else {
            setFormData({
                title: "",
                description: "",
                type: "short",
                category: "",
                targetDate: "",
            })
        }
    }, [goal, isOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.title.trim() || !formData.targetDate) return

        const goalData: Goal = {
            id: goal?.id || Date.now().toString(),
            title: formData.title.trim(),
            description: formData.description.trim(),
            type: formData.type,
            category: formData.category.trim() || "Geral",
            targetDate: new Date(formData.targetDate),
            progress: goal?.progress || 0,
            completed: goal?.completed || false,
            createdAt: goal?.createdAt || new Date(),
        }

        onSave(goalData)
        onClose()
    }

    const categories = [
        "Carreira",
        "Desenvolvimento Pessoal",
        "Saúde",
        "Financeiro",
        "Relacionamentos",
        "Hobbies",
        "Educação",
        "Geral",
    ]

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={goal ? "Editar Meta" : "Nova Meta"} size="lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Título da Meta"
                    placeholder="Ex: Ler 12 livros este ano"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    required
                />

                <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Descrição</label>
                    <textarea
                        placeholder="Descreva sua meta em detalhes..."
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 bg-surface text-primary rounded-lg border border-custom focus:border-primary transition-colors duration-200 focus-ring resize-none"
                        rows={3}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Tipo de Meta</label>
                    <div className="flex space-x-2">
                        {[
                            { value: "short", label: "Curto Prazo", description: "Até 3 meses" },
                            { value: "long", label: "Longo Prazo", description: "Mais de 3 meses" },
                        ].map((type) => (
                            <button
                                key={type.value}
                                type="button"
                                onClick={() => setFormData((prev) => ({ ...prev, type: type.value as any }))}
                                className={`flex-1 p-4 rounded-lg border transition-all ${
                                    formData.type === type.value
                                        ? "border-primary bg-primary bg-opacity-10 text-primary"
                                        : "border-custom hover:border-custom-light text-secondary hover:text-primary"
                                }`}
                            >
                                <div className="font-medium">{type.label}</div>
                                <div className="text-xs opacity-75">{type.description}</div>
                            </button>
                        ))}
                    </div>
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

                <Input
                    label="Data Alvo"
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, targetDate: e.target.value }))}
                    required
                />

                <div className="flex justify-end space-x-4 pt-4">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit">{goal ? "Salvar Alterações" : "Criar Meta"}</Button>
                </div>
            </form>
        </Modal>
    )
}
