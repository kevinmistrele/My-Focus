import {api} from "../lib/api.ts";
import type {Task} from "../lib/types.ts";

export type TaskPriority = "low" | "medium" | "high"

export interface TaskPayload {
    title: string
    description?: string
    dueDate?: string
    priority?: TaskPriority
    completed?: boolean
    tags?: string[]
}

export interface TaskSummary {
    completed: number
    total: number
    pomodoros: number
    focusedMinutes: number
    recentTasks: Task[]
}

export const TaskService = {
    /**
     * Lista todas as tarefas do usuário autenticado
     */
    getAll: (params: { page?: number; limit?: number } = {}) => {
        const { page = 1, limit = 10 } = params
        return api.get(`/tasks?page=${page}&limit=${limit}`)
    },



    getTodaySummary: async (): Promise<TaskSummary | null> => {
        return api.get<TaskSummary>("/tasks/today-summary")
    },
    /**
     * Retorna uma tarefa específica por ID
     */
    getById: (id: string) => api.get(`/tasks/${id}`),

    /**
     * Cria uma nova tarefa
     */
    create: (data: TaskPayload) => api.post("/tasks", data),

    /**
     * Atualiza uma tarefa existente
     */
    update: (id: string, data: Partial<TaskPayload>) =>
        api.put(`/tasks/${id}`, data),

    /**
     * Deleta uma tarefa
     */
    delete: (id: string) => api.delete(`/tasks/${id}`),
}
