import {beforeEach, describe, expect, it, type Mock, vi} from "vitest";
import {HabitService} from "../../services";
import {api} from "../../lib/api";

// Mock do wrapper da API
vi.mock("@/lib/api", () => ({
    api: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

describe("HabitService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // --------------------------------------------
    // getAll
    // --------------------------------------------
    it("getAll: busca todos os hábitos do usuário", async () => {
        const fakeHabits = [
            {
                id: "h1",
                name: "Estudar",
                description: "Estudar 1h por dia",
                color: "#ff0000",
                category: "Educação",
                streak: 5,
                bestStreak: 10,
                weeklyGoal: 5,
                weeklyProgress: 3,
                createdAt: "2025-01-01",
            },
        ];

        (api.get as Mock).mockResolvedValueOnce(fakeHabits);

        const res = await HabitService.getAll();

        expect(api.get).toHaveBeenCalledWith("/habits");
        expect(res).toEqual(fakeHabits);
    });

    // --------------------------------------------
    // getTodaySummary
    // --------------------------------------------
    it("getTodaySummary: busca resumo dos hábitos do dia", async () => {
        const fakeSummary = {
            streak: 7,
            weeklyGoal: 5,
            todayHabits: [
                {id: "h1", name: "Beber água", completed: true, streak: 3},
                {id: "h2", name: "Estudar", completed: false, streak: 5},
            ],
        };

        (api.get as Mock).mockResolvedValueOnce(fakeSummary);

        const res = await HabitService.getTodaySummary();

        expect(api.get).toHaveBeenCalledWith("/habits/today-summary");
        expect(res).toEqual(fakeSummary);
    });

    // --------------------------------------------
    // create
    // --------------------------------------------
    it("create: envia payload correto para criação de hábito", async () => {
        const payload = {
            name: "Meditar",
            description: "10 minutos por dia",
            color: "#00ff00",
            category: "Saúde",
            weeklyGoal: 7,
        };

        (api.post as Mock).mockResolvedValueOnce({id: "new-habit", ...payload});

        const res = await HabitService.create(payload);

        expect(api.post).toHaveBeenCalledWith("/habits", payload);
        expect(res).toEqual({id: "new-habit", ...payload});
    });

    // --------------------------------------------
    // update
    // --------------------------------------------
    it("update: envia atualização parcial para o endpoint correto", async () => {
        const partial = {name: "Meditar (Atualizado)", color: "#123456"};

        (api.put as Mock).mockResolvedValueOnce({ok: true});

        const res = await HabitService.update("habit-123", partial);

        expect(api.put).toHaveBeenCalledWith("/habits/habit-123", partial);
        expect(res).toEqual({ok: true});
    });

    // --------------------------------------------
    // checkin
    // --------------------------------------------
    it("checkin: marca hábito como concluído no dia", async () => {
        (api.post as Mock).mockResolvedValueOnce({success: true});

        const res = await HabitService.checkin("habit-xyz");

        expect(api.post).toHaveBeenCalledWith("/habits/habit-xyz/checkin");
        expect(res).toEqual({success: true});
    });

    // --------------------------------------------
    // delete
    // --------------------------------------------
    it("delete: remove o hábito do usuário", async () => {
        (api.delete as Mock).mockResolvedValueOnce({deleted: true});

        const res = await HabitService.delete("habit-del");

        expect(api.delete).toHaveBeenCalledWith("/habits/habit-del");
        expect(res).toEqual({deleted: true});
    });
});
