import {beforeEach, describe, expect, it, type Mock, vi} from "vitest";
import {api} from "../../lib/api";
import {NoteService} from "../../services/notes.service.ts";

// mock da API
vi.mock("@/lib/api", () => ({
    api: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

describe("NoteService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // -------------------------------------------------
    // getAll
    // -------------------------------------------------
    it("getAll: retorna todas as notas", async () => {
        const fakeNotes = [
            {id: "1", title: "Teste", content: "abc", color: "#fff", pinned: false},
            {id: "2", title: "Outra", content: "xyz", color: "#000", pinned: true},
        ];

        (api.get as Mock).mockResolvedValueOnce(fakeNotes);

        const res = await NoteService.getAll();

        expect(api.get).toHaveBeenCalledWith("/notes");
        expect(res).toEqual(fakeNotes);
    });

    // -------------------------------------------------
    // create
    // -------------------------------------------------
    it("create: envia payload correto", async () => {
        const payload = {
            title: "Nova nota",
            content: "conteúdo",
            color: "#f00",
            pinned: false,
        };

        (api.post as Mock).mockResolvedValueOnce({id: "n1", ...payload});

        const res = await NoteService.create(payload);

        expect(api.post).toHaveBeenCalledWith("/notes", payload);
        expect(res).toEqual({id: "n1", ...payload});
    });

    // -------------------------------------------------
    // update
    // -------------------------------------------------
    it("update: envia dados modificados para a nota correta", async () => {
        const payload = {title: "Alterada"};

        (api.put as Mock).mockResolvedValueOnce({ok: true});

        const res = await NoteService.update("note-123", payload);

        expect(api.put).toHaveBeenCalledWith("/notes/note-123", payload);
        expect(res).toEqual({ok: true});
    });

    // -------------------------------------------------
    // delete
    // -------------------------------------------------
    it("delete: chama endpoint correto ao excluir nota", async () => {
        (api.delete as Mock).mockResolvedValueOnce({deleted: true});

        const res = await NoteService.delete("note-55");

        expect(api.delete).toHaveBeenCalledWith("/notes/note-55");
        expect(res).toEqual({deleted: true});
    });
});
