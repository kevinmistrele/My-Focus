import { api } from "../lib/api"
import type {AdminStats} from "../lib/types.ts";




export const AdminService = {
    getStats: async (): Promise<AdminStats> => {
        return await api.get("/admin/stats") // ou direto: return api.get(...)
    },
}
