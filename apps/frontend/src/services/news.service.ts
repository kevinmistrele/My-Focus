// src/services/news.service.ts
import {api} from "../lib/api"
import type {GetNewsResponse} from "../lib/types"

export const NewsService = {
    async getProductivityNews(
        q?: string,
        page = 1,
        pageSize = 5
    ): Promise<GetNewsResponse> {
        const params = new URLSearchParams({
            page: String(page),
            pageSize: String(pageSize),
        })

        if (q && q.trim()) {
            params.append("q", q.trim())
        }

        const res = await api.get<GetNewsResponse>(`/news/productivity?${params.toString()}`)

        if (!res) {
            throw new Error("Erro ao buscar notícias")
        }

        return res
    },
}
