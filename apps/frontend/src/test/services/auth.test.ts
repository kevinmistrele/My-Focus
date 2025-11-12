import {beforeEach, describe, expect, it, type Mock, vi} from "vitest";
import {AuthService} from "../../services";
import {api} from "../../lib/api.ts";

// Testes para AuthService usando mocks para api
vi.mock("@/lib/api", () => {
    return {
        api: {
            post: vi.fn(),
            get: vi.fn(),
        },
    };
});

describe("AuthService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("login: chama endpoint com email/senha e retorna user+token", async () => {
        const fakeResponse = {
            user: {id: "u1", name: "Kevin", email: "kevin@ex.com", role: "admin"},
            token: "jwt-123",
        };

        (api.post as Mock).mockResolvedValueOnce(fakeResponse);

        const res = await AuthService.login("kevin@ex.com", "123456");

        expect(api.post).toHaveBeenCalledWith("/auth/login", {
            email: "kevin@ex.com",
            password: "123456",
        });
        expect(res).toEqual(fakeResponse);
        expect(res?.token).toBe("jwt-123");
    });

    it("login: propaga erro quando api.post rejeita", async () => {
        (api.post as Mock).mockRejectedValueOnce(new Error("401"));

        await expect(AuthService.login("k@k.com", "bad")).rejects.toThrow("401");
    });

    it("register: chama endpoint correto com payload certo", async () => {
        (api.post as Mock).mockResolvedValueOnce({ok: true});

        await AuthService.register("Kevin", "k@k.com", "123456");

        expect(api.post).toHaveBeenCalledWith("/auth/register", {
            name: "Kevin",
            email: "k@k.com",
            password: "123456",
        });
    });

    it("forgotPassword: chama endpoint correto com email", async () => {
        (api.post as Mock).mockResolvedValueOnce({ok: true});

        await AuthService.forgotPassword("k@k.com");

        expect(api.post).toHaveBeenCalledWith("/auth/forgot-password", {
            email: "k@k.com",
        });
    });

    it("resetPassword: chama endpoint correto com token e nova senha", async () => {
        (api.post as Mock).mockResolvedValueOnce({ok: true});

        await AuthService.resetPassword("jwt-123", "novaSenha!");

        expect(api.post).toHaveBeenCalledWith("/auth/reset-password", {
            token: "jwt-123",
            newPassword: "novaSenha!",
        });
    });

    it("getCurrentUser: retorna o usuário atual", async () => {
        const me = {id: "u1", name: "Kevin", email: "k@k.com", role: "admin"};
        (api.get as Mock).mockResolvedValueOnce(me);

        const res = await AuthService.getCurrentUser();

        expect(api.get).toHaveBeenCalledWith("/auth/me");
        expect(res).toEqual(me);
    });
});
