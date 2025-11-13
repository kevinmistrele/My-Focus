import {beforeEach, describe, expect, it, type Mock, vi} from "vitest";
import {LogsService} from "../../services";
import {api} from "../../lib/api";

// Mock do módulo api
vi.mock("@/lib/api", () => ({
    api: {
        get: vi.fn(),
    },
}));

describe("LogsService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // -----------------------------------------------------
    // getAll
    // -----------------------------------------------------
    it("getAll: chama endpoint com paginação padrão quando nada é passado", async () => {
        const fakeData = {items: [], total: 0};

        (api.get as Mock).mockResolvedValueOnce(fakeData);

        const res = await LogsService.getAll();

        expect(api.get).toHaveBeenCalledWith("/activities?page=1&limit=20");
        expect(res).toEqual(fakeData);
    });

    it("getAll: usa page e limit customizados", async () => {
        const fakeData = {items: [{id: "1"}], total: 1};

        (api.get as Mock).mockResolvedValueOnce(fakeData);

        const res = await LogsService.getAll({page: 3, limit: 50});

        expect(api.get).toHaveBeenCalledWith("/activities?page=3&limit=50");
        expect(res).toEqual(fakeData);
    });

    // -----------------------------------------------------
    // getByUser
    // -----------------------------------------------------
    it("getByUser: chama endpoint correto com userId", async () => {
        const fakeLogs = [
            {id: "log1", action: "LOGIN", userId: "u1"},
            {id: "log2", action: "CREATE_TASK", userId: "u1"},
        ];

        (api.get as Mock).mockResolvedValueOnce(fakeLogs);

        const res = await LogsService.getByUser("u1");

        expect(api.get).toHaveBeenCalledWith("/activities/u1");
        expect(res).toEqual(fakeLogs);
    });

    it("getByUser: propaga erro quando API falha", async () => {
        (api.get as Mock).mockRejectedValueOnce(new Error("500"));

        await expect(LogsService.getByUser("u1")).rejects.toThrow("500");
    });
});
