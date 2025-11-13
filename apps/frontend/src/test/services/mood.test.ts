import {beforeEach, describe, expect, it, type Mock, vi} from "vitest";
import {api} from "../../lib/api";
import {MoodService} from "../../services/mood.service.ts";

// Mock do wrapper da API
vi.mock("@/lib/api", () => ({
    api: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

describe("MoodService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // -----------------------------------------------------
    // getAll
    // -----------------------------------------------------
    it("getAll: busca todas as entradas de humor + estatísticas", async () => {
        const fakeData = {
            moods: [
                {id: "1", mood: "happy", note: "Bom dia!", date: "2025-01-01"},
                {id: "2", mood: "sad", date: "2025-01-02"},
            ],
            stats: {happy: 1, neutral: 0, sad: 1, total: 2},
        };

        (api.get as Mock).mockResolvedValueOnce(fakeData);

        const res = await MoodService.getAll();

        expect(api.get).toHaveBeenCalledWith("/moods");
        expect(res).toEqual(fakeData);
    });

    // -----------------------------------------------------
    // create
    // -----------------------------------------------------
    it("create: envia payload correto ao criar mood", async () => {
        const payload = {mood: "happy" as const, note: "Dia top"};

        (api.post as Mock).mockResolvedValueOnce({id: "m1", ...payload});

        const res = await MoodService.create(payload);

        expect(api.post).toHaveBeenCalledWith("/moods", payload);
        expect(res).toEqual({id: "m1", ...payload});
    });

    // -----------------------------------------------------
    // update
    // -----------------------------------------------------
    it("update: envia as alterações corretas para o mood específico", async () => {
        const payload = {mood: "sad" as const, note: "Dia ruim"};

        (api.put as Mock).mockResolvedValueOnce({ok: true});

        const res = await MoodService.update("mood-123", payload);

        expect(api.put).toHaveBeenCalledWith("/moods/mood-123", payload);
        expect(res).toEqual({ok: true});
    });

    // -----------------------------------------------------
    // delete
    // -----------------------------------------------------
    it("delete: chama endpoint correto para excluir mood", async () => {
        (api.delete as Mock).mockResolvedValueOnce({deleted: true});

        const res = await MoodService.delete("mood-xyz");

        expect(api.delete).toHaveBeenCalledWith("/moods/mood-xyz");
        expect(res).toEqual({deleted: true});
    });
});
