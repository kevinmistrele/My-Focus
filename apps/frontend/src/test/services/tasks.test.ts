import {beforeEach, describe, expect, it, type Mock, vi} from "vitest";
import {TaskService} from "../../services";
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

describe("TaskService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // -------------------------------------------------
    // getAll
    // -------------------------------------------------
    it("getAll: usa page/limit padrão quando nada é passado", async () => {
        const fakeResponse = {
            data: [],
            total: 0,
        };

        (api.get as Mock).mockResolvedValueOnce(fakeResponse);

        const res = await TaskService.getAll();

        expect(api.get).toHaveBeenCalledWith("/tasks?page=1&limit=10");
        expect(res).toEqual(fakeResponse);
    });

    it("getAll: usa page/limit customizados", async () => {
        const fakeResponse = {
            data: [
                {
                    id: "t1",
                    title: "Task 1",
                    completed: false,
                },
            ],
            total: 1,
        };

        (api.get as Mock).mockResolvedValueOnce(fakeResponse);

        const res = await TaskService.getAll({page: 3, limit: 50});

        expect(api.get).toHaveBeenCalledWith("/tasks?page=3&limit=50");
        expect(res).toEqual(fakeResponse);
    });

    // -------------------------------------------------
    // getTodaySummary
    // -------------------------------------------------
    it("getTodaySummary: chama endpoint correto e retorna resumo", async () => {
        const summary = {
            completed: 5,
            total: 10,
            pomodoros: 8,
            focusedMinutes: 250,
            recentTasks: [
                {
                    id: "t1",
                    title: "Estudar React",
                    completed: true,
                },
            ],
        };

        (api.get as Mock).mockResolvedValueOnce(summary);

        const res = await TaskService.getTodaySummary();

        expect(api.get).toHaveBeenCalledWith("/tasks/today-summary");
        expect(res).toEqual(summary);
    });

    it("getTodaySummary: propaga erro quando API falha", async () => {
        (api.get as Mock).mockRejectedValueOnce(new Error("500"));

        await expect(TaskService.getTodaySummary()).rejects.toThrow("500");
    });

    // -------------------------------------------------
    // getById
    // -------------------------------------------------
    it("getById: busca tarefa pelo ID correto", async () => {
        const fakeTask = {
            id: "task-123",
            title: "Fazer TCC",
            completed: false,
        };

        (api.get as Mock).mockResolvedValueOnce(fakeTask);

        const res = await TaskService.getById("task-123");

        expect(api.get).toHaveBeenCalledWith("/tasks/task-123");
        expect(res).toEqual(fakeTask);
    });

    // -------------------------------------------------
    // create
    // -------------------------------------------------
    it("create: envia payload correto para criar tarefa", async () => {
        const payload = {
            title: "Nova tarefa",
            description: "Detalhes da tarefa",
            dueDate: "2025-11-20",
            priority: "high" as const,
            tags: ["estudo", "importante"],
        };

        (api.post as Mock).mockResolvedValueOnce({id: "new-task", ...payload});

        const res = await TaskService.create(payload);

        expect(api.post).toHaveBeenCalledWith("/tasks", payload);
        expect(res).toEqual({id: "new-task", ...payload});
    });

    // -------------------------------------------------
    // update
    // -------------------------------------------------
    it("update: envia dados parciais para a task correta", async () => {
        const partial = {
            title: "Atualizada",
            completed: true,
        };

        (api.put as Mock).mockResolvedValueOnce({ok: true});

        const res = await TaskService.update("task-999", partial);

        expect(api.put).toHaveBeenCalledWith("/tasks/task-999", partial);
        expect(res).toEqual({ok: true});
    });

    // -------------------------------------------------
    // delete
    // -------------------------------------------------
    it("delete: remove tarefa pelo ID", async () => {
        (api.delete as Mock).mockResolvedValueOnce({deleted: true});

        const res = await TaskService.delete("task-del");

        expect(api.delete).toHaveBeenCalledWith("/tasks/task-del");
        expect(res).toEqual({deleted: true});
    });
});
