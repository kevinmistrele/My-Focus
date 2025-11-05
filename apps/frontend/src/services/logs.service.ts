import {api} from "../lib/api.ts";

interface PaginationParams {
    page?: number
    limit?: number
}

// Serviço para lidar com logs de atividades do sistema
export const LogsService = {
    /**
     * Retorna todos os logs do sistema (admin)
     */
    getAll: ({ page = 1, limit = 20 }: PaginationParams = {}) => {
        const url = `/activities?page=${page}&limit=${limit}`
        return api.get(url)
    },


    /**
     * Retorna logs apenas de um usuário específico (admin)
     * @param userId ID do usuário
     */
    getByUser: (userId: string) => api.get(`/activities/${userId}`),
}
