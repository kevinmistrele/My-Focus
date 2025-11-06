export function normalizeEmail(email: string = "") {
    return email.trim().toLowerCase();
}

const LOWER_WORDS = new Set(["da", "das", "de", "do", "dos", "e", "di", "du"]);

export function formatName(name: string = "") {
    return name
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase()
        .split(" ")
        .map((w, i) => (i > 0 && LOWER_WORDS.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
        .join(" ");
}