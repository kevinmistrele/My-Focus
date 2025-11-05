import {api} from "../lib/api"
import type {Note} from "../lib/types.ts";

export interface NotePayload {
    title: string
    content: string
    color: string
    pinned: boolean
}

// Serviço para gerenciar notas do usuário
export const NoteService = {
    // Buscar todas as notas
    getAll: () => api.get<Note[]>("/notes"),

    // Buscar uma nota por ID
    create: (data: NotePayload) => api.post("/notes", data),

    // Atualizar uma nota por ID
    update: (id: string, data: Partial<NotePayload>) =>
        api.put(`/notes/${id}`, data),

    // Deletar uma nota por ID
    delete: (id: string) => api.delete(`/notes/${id}`),
}
