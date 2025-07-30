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

export const GoalService = {
    getAll: () => api.get<RawGoal[]>("/goals"),

    create: (data: GoalPayload) => api.post("/goals", data),

    update: (id: string, data: Partial<GoalPayload>) =>
        api.put(`/goals/${id}`, data),

    delete: (id: string) => api.delete(`/goals/${id}`),
}

