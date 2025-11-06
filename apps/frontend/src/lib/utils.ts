import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

// Função para combinar classes CSS com suporte ao Tailwind CSS
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Função para formatar datas no formato "dd/mm/yyyy"
export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date)
}

// Função para formatar tempo em segundos para "mm:ss"
export function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

// Função para gerar um ID aleatório de 9 caracteres
export function generateId(): string {
    return Math.random().toString(36).slice(2, 11)
}

// Função debounce para limitar a frequência de execução de uma função
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait)
    }
}

export const toInputDate = (d: Date) => {
    const z = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    return z.toISOString().slice(0, 10); // YYYY-MM-DD
};
export const addDays = (d: Date, n: number) => {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
};
export const addMonths = (d: Date, n: number) => {
    const x = new Date(d);
    x.setMonth(x.getMonth() + n);
    return x;
};
export const isBefore = (a: Date, b: Date) => +new Date(a.getFullYear(), a.getMonth(), a.getDate()) < +new Date(b.getFullYear(), b.getMonth(), b.getDate());
export const isAfter = (a: Date, b: Date) => +new Date(a.getFullYear(), a.getMonth(), a.getDate()) > +new Date(b.getFullYear(), b.getMonth(), b.getDate());
