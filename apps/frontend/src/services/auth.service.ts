import {api} from "../lib/api.ts";
import type {User} from "../lib/types.ts";

interface LoginResponse {
    user: User
    token: string
}

export const AuthService = {
    /**
     * Login do usuário
     */
    login: async (email: string, password: string): Promise<LoginResponse> => {
        return api.post<LoginResponse>("/auth/login", {email, password})
    },


    /**
     * Registro de novo usuário
     */
    register: (name: string, email: string, password: string) =>
        api.post("/auth/register", {name, email, password}),

    /**
     * Solicita link de redefinição de senha
     */
    forgotPassword: (email: string) =>
        api.post("/auth/forgot-password", {email}),

    /**
     * Redefine senha com token JWT
     */
    resetPassword: (token: string, newPassword: string) =>
        api.post("/auth/reset-password", {token, newPassword}),

    getCurrentUser: async (): Promise<User> => {
        return await api.get<User>("/auth/me");
    }
}
