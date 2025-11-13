import {api} from "../lib/api.ts"
import type {ActivityLog} from "../lib/types"

type LogFilter = "user" | "task" | "pomodoro" | "system" | "goal"

interface GetAllLogsParams {
    page?: number
    limit?: number
    type?: LogFilter
}

export interface GetAllLogsResponse {
    data: ActivityLog[]
    total: number
    page: number
    limit: number
    totalPages: number
    totalByType: {
        user: number
        task: number
        pomodoro: number
        system: number
        goal: number
    }
}

export const LogsService = {
    getAll: async ({
                       page = 1,
                       limit = 20,
                       type,
                   }: GetAllLogsParams = {}): Promise<GetAllLogsResponse> => {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
        })

        if (type) {
            params.append("type", type)
        }

        const response = await api.get<GetAllLogsResponse>(
            `/activities?${params.toString()}`
        )

        if (!response) {
            throw new Error("Erro ao buscar logs de atividade")
        }

        return response
    },

    getByUser: (userId: string) => api.get(`/activities/${userId}`),
}
