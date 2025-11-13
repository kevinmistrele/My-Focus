import {beforeEach, describe, expect, it, type Mock, vi} from "vitest";
import {api} from "../../lib/api";
import {AdminService} from "../../services/admin.service.ts";

// 🔹 Mocka o módulo api para isolar a requisição
vi.mock("@/lib/api", () => ({
    api: {
        get: vi.fn(),
    },
}));

describe("AdminService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("getStats: chama o endpoint correto e retorna os dados", async () => {
        const fakeStats = {
            totalUsers: 10,
            totalTasks: 25,
            totalPomodoroSessions: 50,
            activeUsers: 7,
            newUsersThisMonth: 3,
            completedTasksToday: 4,
        };

        (api.get as Mock).mockResolvedValueOnce(fakeStats);

        const res = await AdminService.getStats();

        expect(api.get).toHaveBeenCalledWith("/admin/stats");
        expect(res).toEqual(fakeStats);
    });

    it("getStats: retorna null em caso de erro", async () => {
        (api.get as Mock).mockRejectedValueOnce(new Error("500 Internal Error"));

        await expect(AdminService.getStats()).rejects.toThrow("500 Internal Error");
    });
});
