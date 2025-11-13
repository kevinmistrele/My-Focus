import {beforeEach, describe, expect, it, type Mock, vi} from "vitest";
import {api} from "../../lib/api";
import {UserService} from "../../services";

// mock global para o wrapper HTTP
vi.mock("@/lib/api", () => ({
    api: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

describe("UserService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // -------------------------------------------------
    // getAll
    // -------------------------------------------------
    it("getAll: usa page/limit padrão", async () => {
        const fakeRes = {data: [], total: 0};

        (api.get as Mock).mockResolvedValueOnce(fakeRes);

        const res = await UserService.getAll();

        expect(api.get).toHaveBeenCalledWith("/users?page=1&limit=10");
        expect(res).toEqual(fakeRes);
    });

    it("getAll: usa paginação customizada", async () => {
        const fake = {data: [{id: "u1"}], total: 1};

        (api.get as Mock).mockResolvedValueOnce(fake);

        const res = await UserService.getAll({page: 3, limit: 50});

        expect(api.get).toHaveBeenCalledWith("/users?page=3&limit=50");
        expect(res).toEqual(fake);
    });

    // -------------------------------------------------
    // getById
    // -------------------------------------------------
    it("getById: chama API com o id correto", async () => {
        const fake = {id: "123", name: "Kevin"};
        (api.get as Mock).mockResolvedValueOnce(fake);

        const res = await UserService.getById("123");

        expect(api.get).toHaveBeenCalledWith("/users/123");
        expect(res).toEqual(fake);
    });

    // -------------------------------------------------
    // create
    // -------------------------------------------------
    it("create: envia payload correto", async () => {
        const payload = {
            name: "Kevin",
            email: "k@k.com",
            password: "123456",
            type: "user" as const,
        };

        (api.post as Mock).mockResolvedValueOnce({id: "new-user", ...payload});

        const res = await UserService.create(payload);

        expect(api.post).toHaveBeenCalledWith("/users", payload);
        expect(res).toEqual({id: "new-user", ...payload});
    });

    // -------------------------------------------------
    // update
    // -------------------------------------------------
    it("update: faz PUT com dados parciais", async () => {
        const partial = {name: "Novo Nome"};

        (api.put as Mock).mockResolvedValueOnce({ok: true});

        const res = await UserService.update("42", partial);

        expect(api.put).toHaveBeenCalledWith("/users/42", partial);
        expect(res).toEqual({ok: true});
    });

    // -------------------------------------------------
    // delete
    // -------------------------------------------------
    it("delete: remove o usuário", async () => {
        (api.delete as Mock).mockResolvedValueOnce({deleted: true});

        const res = await UserService.delete("77");

        expect(api.delete).toHaveBeenCalledWith("/users/77");
        expect(res).toEqual({deleted: true});
    });

    // -------------------------------------------------
    // getCurrent
    // -------------------------------------------------
    it("getCurrent: busca dados do próprio usuário", async () => {
        const fake = {id: "me", name: "Kevin"};

        (api.get as Mock).mockResolvedValueOnce(fake);

        const res = await UserService.getCurrent();

        expect(api.get).toHaveBeenCalledWith("/users/me");
        expect(res).toEqual(fake);
    });

    // -------------------------------------------------
    // updateCurrent
    // -------------------------------------------------
    it("updateCurrent: atualiza o próprio usuário", async () => {
        const partial = {name: "Atualizado"};

        (api.put as Mock).mockResolvedValueOnce({ok: true});

        const res = await UserService.updateCurrent(partial);

        expect(api.put).toHaveBeenCalledWith("/users/me", partial);
        expect(res).toEqual({ok: true});
    });

    // -------------------------------------------------
    // deleteCurrent
    // -------------------------------------------------
    it("deleteCurrent: deleta o próprio usuário", async () => {
        (api.delete as Mock).mockResolvedValueOnce({deleted: true});

        const res = await UserService.deleteCurrent();

        expect(api.delete).toHaveBeenCalledWith("/users/me");
        expect(res).toEqual({deleted: true});
    });

    // -------------------------------------------------
    // changePassword
    // -------------------------------------------------
    it("changePassword: envia currentPassword e newPassword", async () => {
        const body = {
            currentPassword: "old",
            newPassword: "new",
        };

        (api.put as Mock).mockResolvedValueOnce({ok: true});

        const res = await UserService.changePassword(body);

        expect(api.put).toHaveBeenCalledWith("/users/me/password", body);
        expect(res).toEqual({ok: true});
    });

    // -------------------------------------------------
    // getStats
    // -------------------------------------------------
    it("getStats: chama endpoint correto", async () => {
        const stats = {
            tasksCompleted: 10,
            pomodoros: 20,
            focusedMinutes: 300,
        };

        (api.get as Mock).mockResolvedValueOnce(stats);

        const res = await UserService.getStats();

        expect(api.get).toHaveBeenCalledWith("/users/me/stats");
        expect(res).toEqual(stats);
    });
});
