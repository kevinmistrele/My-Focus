import React, {useEffect, useState} from "react"
import {Card} from "../components/ui/Card"
import {Button} from "../components/ui/Button"
import {Input} from "../components/ui/Input"
import {TaskCard} from "../components/tasks/TaskCard"
import {TaskModal} from "../components/tasks/TaskModal"
import type {Task} from "../lib/types"
import {type TaskPayload, TaskService} from "../services";
import {toast} from "sonner";

export const TasksPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const TASKS_PER_PAGE = 10;


    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await TaskService.getAll({ page: currentPage, limit: TASKS_PER_PAGE })
                if (!Array.isArray(res?.data)) throw new Error("Formato inesperado")
                setTasks(res.data)
                setTotalPages(res.totalPages || 1)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
                toast.error("Erro ao carregar tarefas.")
                setTasks([])
            }
        }

        fetchTasks()
    }, [currentPage])


    const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | null>(null)

    const handleSaveTask = async (taskData: Task) => {
        setIsLoading(true)
        try {
            const payload: TaskPayload = {
                title: taskData.title,
                description: taskData.description,
                dueDate: taskData.dueDate ? taskData.dueDate.toISOString() : undefined,
                priority: taskData.priority,
                tags: taskData.tags ?? [],
            }

            if (editingTask) {
                await TaskService.update(taskData.id, payload)
            } else {
                await TaskService.create(payload)
            }

            const updated = await TaskService.getAll({ page: currentPage, limit: TASKS_PER_PAGE })
            setTasks(updated.data)
            setTotalPages(updated.totalPages || 1)
            toast.success(editingTask ? "Tarefa atualizada!" : "Tarefa criada!")
        } catch (err) {
            toast.error("Erro ao salvar tarefa.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleEditTask = (task: Task) => {
        setEditingTask(task)
        setIsModalOpen(true)
    }

    const handleAddTask = () => {
        setEditingTask(null)
        setIsModalOpen(true)
    }

    const handleToggleTask = async (id: string) => {
        try {
            const task = tasks.find(t => t.id === id)
            if (!task) return

            await TaskService.update(id, { completed: !task.completed })
            const updated = await TaskService.getAll({ page: currentPage, limit: TASKS_PER_PAGE })

            setTasks(updated.data)
            setTotalPages(updated.totalPages || 1)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            toast.error("Erro ao atualizar status da tarefa.")
        }
    }

    const handleDeleteTask = async (id: string) => {
        try {
            await TaskService.delete(id)
            const updated = await TaskService.getAll({ page: currentPage, limit: TASKS_PER_PAGE })
            setTasks(updated.data)
            setTotalPages(updated.totalPages || 1)
            toast.success("Tarefa removida.")
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_err) {
            toast.error("Erro ao deletar tarefa.")
        }
    }

    const filteredTasks = tasks.filter((task) => {
        const matchesFilter =
            filter === "all" || (filter === "active" && !task.completed) || (filter === "completed" && task.completed)

        const matchesSearch =
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (task.description ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (task.tags ?? []).some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

        return matchesFilter && matchesSearch
    })

    const stats = {
        total: Array.isArray(tasks) ? tasks.length : 0,
        completed: Array.isArray(tasks) ? tasks.filter((t) => t.completed).length : 0,
        active: Array.isArray(tasks) ? tasks.filter((t) => !t.completed).length : 0,
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-primary">Tarefas</h1>
                <Button onClick={handleAddTask}  loading={isLoading} className="shadow-purple">
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
                {totalPages > 1 && (
                    <div className="flex justify-between items-center pt-4">
                        <Button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </Button>
                        <span className="text-sm text-muted">
            Página {currentPage} de {totalPages}
        </span>
                        <Button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            loading={isLoading}
                        >
                            Próxima
                        </Button>
                    </div>
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
                isLoading={isLoading}
                task={editingTask}
            />
        </div>
    )
}
