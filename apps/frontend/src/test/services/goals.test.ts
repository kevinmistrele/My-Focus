import {beforeEach, describe, expect, it, type Mock, vi} from "vitest";
import {GoalService} from "../../services";
import {api} from "../../lib/api";

// Mock do wrapper API
vi.mock("@/lib/api", () => ({
    api: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

describe("GoalService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // --------------------------------------------
    // 📌 GET ALL
    // --------------------------------------------
    it("getAll: chama o endpoint correto e retorna a lista de metas", async () => {
        const fakeGoals = [
            {
                id: "1",
                title: "Ler 12 livros",
                type: "long",
                category: "Educação",
                targetDate: "2025-12-31",
                progress: 0,
                completed: false,
                createdAt: "2025-01-01",
            },
        ];

        (api.get as Mock).mockResolvedValueOnce(fakeGoals);

        const res = await GoalService.getAll();

        expect(api.get).toHaveBeenCalledWith("/goals");
        expect(res).toEqual(fakeGoals);
    });

    // --------------------------------------------
    // 📌 CREATE
    // --------------------------------------------
    it("create: envia os dados da nova meta para o endpoint correto", async () => {
        const payload = {
            title: "Correr 200km",
            description: "Meta de corrida",
            type: "short" as const,
            category: "Saúde",
            targetDate: "2025-03-10",
        };

        (api.post as Mock).mockResolvedValueOnce({id: "new1", ...payload});

        const res = await GoalService.create(payload);

        expect(api.post).toHaveBeenCalledWith("/goals", payload);
        expect(res).toEqual({id: "new1", ...payload});
    });

    // --------------------------------------------
    // 📌 UPDATE
    // --------------------------------------------
    it("update: chama o endpoint correto com id e payload parcial", async () => {
        const partial = {title: "Título Atualizado"};

        (api.put as Mock).mockResolvedValueOnce({ok: true});

        const res = await GoalService.update("goal123", partial);

        expect(api.put).toHaveBeenCalledWith("/goals/goal123", partial);
        expect(res).toEqual({ok: true});
    });

    // --------------------------------------------
    // 📌 DELETE
    // --------------------------------------------
    it("delete: chama o endpoint correto", async () => {
        (api.delete as Mock).mockResolvedValueOnce({success: true});

        const res = await GoalService.delete("goal10");

        expect(api.delete).toHaveBeenCalledWith("/goals/goal10");
        expect(res).toEqual({success: true});
    });
});
