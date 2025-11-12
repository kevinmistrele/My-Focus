// vitest.config.ts
/// <reference types="vitest" />
import {defineConfig} from "vitest/config"
import react from "@vitejs/plugin-react"
import {resolve} from "node:path"

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {"@": resolve(__dirname, "src")},
    },
    test: {
        environment: "jsdom",
        setupFiles: ["./src/test/setup.ts"],
        globals: true,
        css: true,
        pool: "threads",
        coverage: {
            provider: "v8",
            reporter: ["text", "lcov", "html"],
            reportsDirectory: "./coverage",
            thresholds: {lines: 80, functions: 80, branches: 75, statements: 80},
        },
    },
})
