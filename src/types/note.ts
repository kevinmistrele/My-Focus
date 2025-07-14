export interface Note {
  id: string
  title: string
  content: string
  tags?: string[]
  isPinned: boolean
  createdAt: string
  updatedAt: string
  userId: string
}

export interface CreateNoteRequest {
  title: string
  content: string
  tags?: string[]
  isPinned?: boolean
}

export interface UpdateNoteRequest extends Partial<CreateNoteRequest> {}

export interface NoteFilters {
  tags?: string[]
  isPinned?: boolean
  search?: string
}
