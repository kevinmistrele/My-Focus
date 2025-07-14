"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Modal } from "../ui/Modal"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import type { Task } from "../../lib/types"
import { generateId } from "../../lib/utils"

interface TaskModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (task: Task) => void
    task?: Task | null
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, task }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "medium" as "low" | "medium" | "high",
        tags: [] as string[],
        tagInput: "",
    })

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description || "",
                priority: task.priority,
                tags: [...task.tags],
                tagInput: "",
            })
        } else {
            setFormData({
                title: "",
                description: "",
                priority: "medium",
                tags: [],
                tagInput: "",
            })
        }
    }, [task, isOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.title.trim()) return

        const taskData: Task = {
            id: task?.id || generateId(),
            title: formData.title.trim(),
            description: formData.description.trim(),
            priority: formData.priority,
            tags: formData.tags,
            completed: task?.completed || false,
            createdAt: task?.createdAt || new Date(),
            updatedAt: new Date(),
        }

        onSave(taskData)
        onClose()
    }

    const handleAddTag = () => {
        const newTag = formData.tagInput.trim().toLowerCase()
        if (newTag && !formData.tags.includes(newTag)) {
            setFormData((prev) => ({
                ...prev,
                tags: [...prev.tags, newTag],
                tagInput: "",
            }))
        }
    }

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
        }))
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault()
            handleAddTag()
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={task ? "Editar Tarefa" : "Nova Tarefa"} size="lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Título"
                    placeholder="Digite o título da tarefa..."
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    required
                />

                <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Descrição</label>
                    <textarea
                        placeholder="Descreva sua tarefa (opcional)..."
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 bg-surface text-primary rounded-lg border border-custom focus:border-primary transition-colors duration-200 focus-ring resize-none"
                        rows={3}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Prioridade</label>
                    <div className="flex space-x-2">
                        {[
                            { value: "low", label: "Baixa", color: "bg-green-500" },
                            { value: "medium", label: "Média", color: "bg-yellow-500" },
                            { value: "high", label: "Alta", color: "bg-red-500" },
                        ].map((priority) => (
                            <button
                                key={priority.value}
                                type="button"
                                onClick={() => setFormData((prev) => ({ ...prev, priority: priority.value as any }))}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                                    formData.priority === priority.value
                                        ? "border-primary bg-primary bg-opacity-10 text-primary"
                                        : "border-custom hover:border-custom-light text-secondary hover:text-primary"
                                }`}
                            >
                                <div className={`w-3 h-3 rounded-full ${priority.color}`} />
                                <span>{priority.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Tags</label>
                    <div className="flex space-x-2 mb-3">
                        <Input
                            placeholder="Digite uma tag..."
                            value={formData.tagInput}
                            onChange={(e) => setFormData((prev) => ({ ...prev, tagInput: e.target.value }))}
                            onKeyPress={handleKeyPress}
                            className="flex-1"
                        />
                        <Button type="button" onClick={handleAddTag} variant="outline">
                            Adicionar
                        </Button>
                    </div>

                    {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center px-3 py-1 bg-primary bg-opacity-20 text-primary rounded-full text-sm"
                                >
                  {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="ml-2 text-primary hover:text-primary-dark"
                                    >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit">{task ? "Salvar Alterações" : "Criar Tarefa"}</Button>
                </div>
            </form>
        </Modal>
    )
}
