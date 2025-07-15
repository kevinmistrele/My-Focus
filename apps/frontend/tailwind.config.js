/** @type {import('tailwindcss').Config} */
const defaultConfig = {
    content: [],
    theme: {
        extend: {},
    },
    plugins: [],
}

module.exports = {
    ...defaultConfig,
    content: [
        ...defaultConfig.content,
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/styles/global.css",
        "*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        ...defaultConfig.theme,
        extend: {
            ...defaultConfig.theme.extend,
            colors: {
                ...defaultConfig.theme.extend?.colors,
                primary: {
                    DEFAULT: "#8b5cf6",
                    dark: "#7c3aed",
                    light: "#a78bfa",
                },
                surface: {
                    DEFAULT: "#111111",
                    dark: "#0a0a0a",
                    light: "#1a1a1a",
                },
                custom: {
                    DEFAULT: "#1f1f23",
                    light: "#27272a",
                },
                success: "#10b981",
                warning: "#f59e0b",
                error: "#ef4444",
                darkBackground: "#0a0a0a",
                text: {
                    primary: "#ffffff",
                    secondary: "#a1a1aa",
                    muted: "#71717a",
                    light: "#ffffff",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
            },
            boxShadow: {
                purple: "0 4px 14px 0 rgb(139 92 246 / 0.4)",
            },
        },
    },
    plugins: [...defaultConfig.plugins, require("tailwindcss-animate")],
}
