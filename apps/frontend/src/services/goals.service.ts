import {api} from "../lib/api.ts";
import type {RawGoal} from "../lib/types.ts";

export interface GoalPayload {
    title: string
    description?: string
    type: "short" | "long"
    category: string
    targetDate: string
    progress?: number
    completed?: boolean
}

// Serviço para gerenciar metas (goals)

export const GoalService = {
    // Buscar todas as metas
    getAll: () => api.get<RawGoal[]>("/goals"),

    // Buscar uma meta por ID
    create: (data: GoalPayload) => api.post("/goals", data),

    // Atualizar uma meta existente
    update: (id: string, data: Partial<GoalPayload>) =>
        api.put(`/goals/${id}`, data),

    // Deletar uma meta
    delete: (id: string) => api.delete(`/goals/${id}`),
}

