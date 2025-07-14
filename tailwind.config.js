/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // 👈 ATIVAR modo escuro via classe
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/styles/global.css",
        "*.{js,ts,jsx,tsx,mdx}"
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#8b5cf6",
                    dark: "#7c3aed",
                    light: "#a78bfa",
                },
                surface: {
                    DEFAULT: "#ffffff",      // claro
                    dark: "#1a1a1a",
                    darklight: "#27272a",// escuro
                    light: "#f4f4f5",         // opcional claro extra
                },
                custom: {
                    DEFAULT: "#27272a",
                    light: "#3f3f46",
                },
                success: "#10b981",
                warning: "#f59e0b",
                error: "#ef4444",
                background: "#ffffff",
                darkBackground: "#0f0f0f",
                text: {
                    primary: "#000000",
                    secondary: "#4b5563",
                    muted: "#6b7280",
                    light: "#ffffff",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
            },
            boxShadow: {
                purple: "0 4px 14px 0 rgb(139 92 246 / 0.3)",
            },
            borderRadius: {
                lg: "var(--radius-lg)",
                md: "var(--radius-md)",
                sm: "var(--radius-sm)",
            },
        },
    },
    plugins: [
        require("tailwindcss-animate")
    ],
}
