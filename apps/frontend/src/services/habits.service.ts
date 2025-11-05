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

    //  
    getAll: (): Promise<Habit[] | null> => api.get("/habits"),

    getTodaySummary: (): Promise<HabitSummary | null> => {
        return api.get("/habits/today-summary");
    },

    create: (data: HabitPayload) => api.post("/habits", data),

    update: (id: string, data: Partial<HabitPayload>) =>
        api.put(`/habits/${id}`, data),

    checkin: (id: string) => api.post(`/habits/${id}/checkin`),

    delete: (id: string) => api.delete(`/habits/${id}`),
};
