// src/test/helpers/utils.test.ts
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {cn, debounce, formatDate, formatTime, generateId, toInputDate} from "../../lib/utils.ts";
import {addDays, addMonths, isAfter, isBefore} from "date-fns";

// Testes para as funções utilitárias
describe("cn", () => {
    it("mergeia classes Tailwind, mantendo a última vencedora", () => {
        expect(cn("p-2", "p-4")).toBe("p-4");
        expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
        expect(cn("px-2", false && "hidden", "py-1")).toBe("px-2 py-1");
    });
});

describe("formatDate", () => {
    it('formata como "dd/mm/yyyy"', () => {
        const d = new Date(2025, 10, 12); // 12/11/2025 (mês 0-based)
        expect(formatDate(d)).toBe("12/11/2025");
    });
});

describe("formatTime", () => {
    it("90s -> 01:30", () => {
        expect(formatTime(90)).toBe("01:30");
    });

    it("0s -> 00:00", () => {
        expect(formatTime(0)).toBe("00:00");
    });
});

describe("generateId", () => {
    it("tem 9 chars alfanuméricos base36", () => {
        const id = generateId();
        expect(id).toMatch(/^[a-z0-9]{9}$/);
    });

    it("gera valores variados (baixa chance de colisão)", () => {
        const ids = Array.from({length: 100}, () => generateId());
        const uniq = new Set(ids);
        expect(uniq.size).toBeGreaterThan(90);
    });
});

describe("debounce", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("executa apenas após o wait e colapsa chamadas rápidas", () => {
        const fn = vi.fn();
        const deb = debounce(fn, 200);

        deb("a");
        vi.advanceTimersByTime(199);
        expect(fn).not.toHaveBeenCalled();

        deb("b"); // reinicia o timer
        vi.advanceTimersByTime(199);
        expect(fn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1); // 200ms totais desde a última chamada
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenLastCalledWith("b");
    });
});

describe("datas helpers", () => {
    it("toInputDate -> YYYY-MM-DD", () => {
        const d = new Date(2025, 0, 5); // 05/01/2025
        expect(toInputDate(d)).toBe("2025-01-05");
    });

    it("addDays soma dias corretamente", () => {
        const d = new Date(2025, 0, 1);
        expect(toInputDate(addDays(d, 1))).toBe("2025-01-02");
    });

    it("addMonths soma meses corretamente", () => {
        const d = new Date(2025, 0, 31); // 31/01/2025
        const m = addMonths(d, 1);
        expect(m.getMonth()).toBe(1); // fevereiro (0-based)
    });

    it("isBefore / isAfter comparam apenas a data (sem hora)", () => {
        const a = new Date(2025, 0, 1, 23, 59);
        const b = new Date(2025, 0, 2, 0, 0);
        expect(isBefore(a, b)).toBe(true);
        expect(isAfter(b, a)).toBe(true);
    });
});
