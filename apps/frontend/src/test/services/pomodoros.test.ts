import {beforeEach, describe, expect, it, type Mock, vi} from "vitest";
import {PomodoroService} from "../../services";
import {api} from "../../lib/api";

// Mock da API
vi.mock("@/lib/api", () => ({
    api: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

describe("PomodoroService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // -------------------------------------------------
    // getAll
    // -------------------------------------------------
    it("getAll: retorna lista paginada com page e limit", async () => {
        const fakeResponse = {
            data: [
                {id: "p1", duration: 1500, type: "work", startTime: new Date()},
                {id: "p2", duration: 300, type: "break", startTime: new Date()},
            ],
            total: 2,
        };

        (api.get as Mock).mockResolvedValueOnce(fakeResponse);

        const res = await PomodoroService.getAll({page: 2, limit: 20});

        expect(api.get).toHaveBeenCalledWith("/pomodoros?page=2&limit=20");
        expect(res).toEqual(fakeResponse);
    });

    it("getAll: usa valores padrão quando nenhum parâmetro é passado", async () => {
        (api.get as Mock).mockResolvedValueOnce({data: []});

        await PomodoroService.getAll();

        expect(api.get).toHaveBeenCalledWith("/pomodoros?page=1&limit=10");
    });

    // -------------------------------------------------
    // create
    // -------------------------------------------------
    it("create: envia payload correto", async () => {
        const payload = {
            duration: 1500,
            type: "work" as const,
            startTime: new Date(),
        };

        (api.post as Mock).mockResolvedValueOnce({id: "newPomodoro", ...payload});

        const res = await PomodoroService.create(payload);

        expect(api.post).toHaveBeenCalledWith("/pomodoros", payload);
        expect(res).toEqual({id: "newPomodoro", ...payload});
    });

    // -------------------------------------------------
    // update
    // -------------------------------------------------
    it("update: modifica sessão pomodoro pelo ID", async () => {
        const payload = {duration: 2000};

        (api.put as Mock).mockResolvedValueOnce({ok: true});

        const res = await PomodoroService.update("p123", payload);

        expect(api.put).toHaveBeenCalledWith("/pomodoros/p123", payload);
        expect(res).toEqual({ok: true});
    });

    // -------------------------------------------------
    // delete
    // -------------------------------------------------
    it("delete: remove pomodoro pelo ID", async () => {
        (api.delete as Mock).mockResolvedValueOnce({deleted: true});

        const res = await PomodoroService.delete("p999");

        expect(api.delete).toHaveBeenCalledWith("/pomodoros/p999");
        expect(res).toEqual({deleted: true});
    });

    // -------------------------------------------------
    // summary
    // -------------------------------------------------
    it("getSummary: retorna o resumo das sessões", async () => {
        const summary = {
            totalSessions: 10,
            totalTime: 15000,
            workSessions: 7,
            breakSessions: 3,
        };

        (api.get as Mock).mockResolvedValueOnce(summary);

        const res = await PomodoroService.getSummary();

        expect(api.get).toHaveBeenCalledWith("/pomodoros/pomodoro-sumary");
        expect(res).toEqual(summary);
    });
});
