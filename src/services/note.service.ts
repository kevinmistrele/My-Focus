import { apiService } from "./api"
import type { Note, CreateNoteRequest, UpdateNoteRequest, NoteFilters } from "../types/note"

class NoteService {
  async getNotes(filters?: NoteFilters): Promise<Note[]> {
    const response = await apiService.get<Note[]>("/notes", filters)
    return response.data
  }

  async getNote(id: string): Promise<Note> {
    const response = await apiService.get<Note>(`/notes/${id}`)
    return response.data
  }

  async createNote(note: CreateNoteRequest): Promise<Note> {
    const response = await apiService.post<Note>("/notes", note)
    return response.data
  }

  async updateNote(id: string, updates: UpdateNoteRequest): Promise<Note> {
    const response = await apiService.patch<Note>(`/notes/${id}`, updates)
    return response.data
  }

  async deleteNote(id: string): Promise<void> {
    await apiService.delete(`/notes/${id}`)
  }

  async togglePin(id: string): Promise<Note> {
    const response = await apiService.patch<Note>(`/notes/${id}/toggle-pin`, {})
    return response.data
  }

  async searchNotes(query: string): Promise<Note[]> {
    const response = await apiService.get<Note[]>("/notes/search", { q: query })
    return response.data
  }
}

export const noteService = new NoteService()
