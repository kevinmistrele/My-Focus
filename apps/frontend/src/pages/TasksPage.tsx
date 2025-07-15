"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { TaskCard } from "../components/tasks/TaskCard"
import { TaskModal } from "../components/tasks/TaskModal"
import type { Task } from "../lib/types"

export const TasksPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: "1",
            title: "Finalizar projeto React",
            description: "Implementar as últimas funcionalidades do sistema de produtividade",
            completed: false,
            priority: "high",
            dueDate: new Date("2024-01-15"),
            createdAt: new Date(),
            updatedAt: new Date(),
            tags: ["trabalho", "react"],
        },
        {
            id: "2",
            title: "Estudar TypeScript",
            description: "Revisar conceitos avançados de TypeScript",
            completed: true,
            priority: "medium",
            createdAt: new Date(),
            updatedAt: new Date(),
            tags: ["estudo"],
        },
    ])

    const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | null>(null)

    const handleSaveTask = (taskData: Task) => {
        if (editingTask) {
            // Edit existing task
            setTasks(tasks.map((task) => (task.id === taskData.id ? taskData : task)))
        } else {
            // Add new task
            setTasks([taskData, ...tasks])
        }
        setEditingTask(null)
    }

    const handleEditTask = (task: Task) => {
        setEditingTask(task)
        setIsModalOpen(true)
    }

    const handleAddTask = () => {
        setEditingTask(null)
        setIsModalOpen(true)
    }

    const handleToggleTask = (id: string) => {
        setTasks(
            tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed, updatedAt: new Date() } : task)),
        )
    }

    const handleDeleteTask = (id: string) => {
        setTasks(tasks.filter((task) => task.id !== id))
    }

    const filteredTasks = tasks.filter((task) => {
        const matchesFilter =
            filter === "all" || (filter === "active" && !task.completed) || (filter === "completed" && task.completed)

        const matchesSearch =
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

        return matchesFilter && matchesSearch
    })

    const stats = {
        total: tasks.length,
        completed: tasks.filter((t) => t.completed).length,
        active: tasks.filter((t) => !t.completed).length,
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-primary">Tarefas</h1>
                <Button onClick={handleAddTask} className="shadow-purple">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nova Tarefa
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card padding="sm">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{stats.total}</div>
                        <div className="text-sm text-secondary">Total</div>
                    </div>
                </Card>
                <Card padding="sm">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-500">{stats.active}</div>
                        <div className="text-sm text-secondary">Ativas</div>
                    </div>
                </Card>
                <Card padding="sm">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
                        <div className="text-sm text-secondary">Concluídas</div>
                    </div>
                </Card>
            </div>

            {/* Search and Filters */}
            <Card>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                        placeholder="Buscar tarefas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        }
                    />
                    <div className="flex space-x-2">
                        {(["all", "active", "completed"] as const).map((filterType) => (
                            <Button
                                key={filterType}
                                variant={filter === filterType ? "primary" : "ghost"}
                                size="sm"
                                onClick={() => setFilter(filterType)}
                            >
                                {filterType === "all" ? "Todas" : filterType === "active" ? "Ativas" : "Concluídas"}
                            </Button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Tasks List */}
            <div className="space-y-4">
                {filteredTasks.length === 0 ? (
                    <Card>
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">{searchTerm ? "🔍" : filter === "completed" ? "🎉" : "📝"}</div>
                            <h3 className="text-lg font-medium text-secondary mb-2">
                                {searchTerm
                                    ? "Nenhuma tarefa encontrada"
                                    : filter === "all"
                                        ? "Nenhuma tarefa encontrada"
                                        : filter === "active"
                                            ? "Nenhuma tarefa ativa"
                                            : "Nenhuma tarefa concluída"}
                            </h3>
                            <p className="text-muted mb-4">
                                {searchTerm
                                    ? "Tente buscar por outros termos"
                                    : filter === "all"
                                        ? "Comece adicionando sua primeira tarefa!"
                                        : filter === "active"
                                            ? "Todas as suas tarefas estão concluídas!"
                                            : "Você ainda não concluiu nenhuma tarefa."}
                            </p>
                            {!searchTerm && filter === "all" && <Button onClick={handleAddTask}>Criar primeira tarefa</Button>}
                        </div>
                    </Card>
                ) : (
                    filteredTasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onToggle={handleToggleTask}
                            onEdit={handleEditTask}
                            onDelete={handleDeleteTask}
                        />
                    ))
                )}
            </div>

            {/* Task Modal */}
            <TaskModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setEditingTask(null)
                }}
                onSave={handleSaveTask}
                task={editingTask}
            />
        </div>
    )
}
