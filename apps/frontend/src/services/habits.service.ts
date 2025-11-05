import {api} from "../lib/api.ts";
import type {Habit} from "../lib/types"

export interface HabitPayload {
    name: string;
    description?: string;
    color?: string;
    category?: string;
    streak?: number;
    bestStreak?: number;
    weeklyGoal?: number;
    weeklyProgress?: number;
}


export interface HabitSummary {
    streak: number
    weeklyGoal: number
    todayHabits: {
        id: string
        name: string
        completed: boolean
        streak: number
    }[]
}

// Serviço para gerenciar hábitos
export const HabitService = {

    //  Pegar todos os hábitos do usuário
    getAll: (): Promise<Habit[] | null> => api.get("/habits"),

    // Pegar resumo dos hábitos do dia
    getTodaySummary: (): Promise<HabitSummary | null> => {
        return api.get("/habits/today-summary");
    },

    // Criar um novo hábito do usuário
    create: (data: HabitPayload) => api.post("/habits", data),

    // Atualizar um hábito do usuário
    update: (id: string, data: Partial<HabitPayload>) =>
        api.put(`/habits/${id}`, data),

    // Marcar hábito como concluído para o dia
    checkin: (id: string) => api.post(`/habits/${id}/checkin`),

    // Deletar um hábito do usuário
    delete: (id: string) => api.delete(`/habits/${id}`),
};
