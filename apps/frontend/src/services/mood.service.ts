import { api } from "../lib/api.ts"

export interface MoodEntry {
    id: string
    mood: "happy" | "neutral" | "sad"
    note?: string
    date: string
}

export interface MoodStats {
    happy: number
    neutral: number
    sad: number
    total: number
}

export interface MoodPayload {
    mood: "happy" | "neutral" | "sad"
    note?: string
}

export const MoodService = {
    getAll: () => api.get<{ moods: MoodEntry[]; stats: MoodStats }>("/moods"),
    create: (data: MoodPayload) => api.post("/moods", data),
    update: (id: string, data: MoodPayload) => api.put(`/moods/${id}`, data),
    delete: (id: string) => api.delete(`/moods/${id}`),
}
