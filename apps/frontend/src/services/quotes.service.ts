import {api} from "../lib/api.ts"

export interface Quote {
    id: string
    text: string
    author?: string
    userId?: string | null
    createdAt: string
}

export interface QuotePayload {
    text: string
    author?: string
}

// Serviço para gerenciar citações (quotes)
export const QuotesService = {
    getAll: () => api.get<Quote[]>("/quotes"),

    create: (data: QuotePayload) => api.post("/quotes", data),

    update: (id: string, data: Partial<QuotePayload>) =>
        api.put(`/quotes/${id}`, data),

    delete: (id: string) => api.delete(`/quotes/${id}`),
}
