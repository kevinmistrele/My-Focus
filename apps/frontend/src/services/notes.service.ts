import { api } from "../lib/api"
import type {Note} from "../lib/types.ts";

export interface NotePayload {
    title: string
    content: string
    color: string
    pinned: boolean
}

export const NoteService = {
    getAll: () => api.get<Note[]>("/notes"),

    create: (data: NotePayload) => api.post("/notes", data),

    update: (id: string, data: Partial<NotePayload>) =>
        api.put(`/notes/${id}`, data),

    delete: (id: string) => api.delete(`/notes/${id}`),
}
