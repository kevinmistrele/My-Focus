import {api} from "../lib/api.ts";

export type PomodoroType = "work" | "break" | "longBreak"

export interface PomodoroPayload {
    duration: number
    type: PomodoroType
    startTime?: Date
}

export const PomodoroService = {
    /**
     * Lista todas as sessões Pomodoro do usuário autenticado
     */
    getAll: (params: { page?: number; limit?: number } = {}) => {
        const { page = 1, limit = 10 } = params
        return api.get(`/pomodoros?page=${page}&limit=${limit}`)
    },

    /**
     * Cria uma nova sessão Pomodoro
     */
    create: (data: PomodoroPayload) => api.post("/pomodoros", data),

    /**
     * Atualiza uma sessão Pomodoro
     */
    update: (id: string, data: Partial<PomodoroPayload>) =>
        api.put(`/pomodoros/${id}`, data),

    /**
     * Deleta uma sessão Pomodoro
     */
    delete: (id: string) => api.delete(`/pomodoros/${id}`),

    getSummary: () => api.get("/pomodoros/pomodoro-sumary"),
}
