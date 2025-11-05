import {api} from "../lib/api.ts";

export type UserType = "admin" | "user"

export interface UserPayload {
    name: string
    email: string
    password: string
    type: UserType
    avatar?: string
}


// Serviço para gerenciar usuários
export const UserService = {
    /**
     * Lista todos os usuários (admin)
     */
    getAll: (params: { page?: number; limit?: number } = {}) => {
        const { page = 1, limit = 10 } = params
        return api.get(`/users?page=${page}&limit=${limit}`)
    },


    /**
     * Busca um usuário específico (admin)
     */
    getById: (id: string) => api.get(`/users/${id}`),

    /**
     * Cria um novo usuário (admin)
     */
    create: (data: UserPayload) => api.post("/users", data),

    /**
     * Atualiza um usuário (admin)
     */
    update: (id: string, data: Partial<UserPayload>) =>
        api.put(`/users/${id}`, data),

    /**
     * Deleta um usuário (admin)
     */
    delete: (id: string) => api.delete(`/users/${id}`),

    /**
     * Busca os dados do usuário logado
     */
    getCurrent: () => api.get("/users/me"),

    /**
     * Atualiza os dados do usuário logado
     */
    updateCurrent: (data: Partial<UserPayload>) =>
        api.put("/users/me", data),

    /**
     * Deleta o próprio usuário logado
     */
    deleteCurrent: () => api.delete("/users/me"),

    changePassword: (data: { currentPassword: string; newPassword: string }) =>
        api.put("/users/me/password", data),

    getStats: async () => {
        return api.get("/users/me/stats");
    }


}
