import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
    resolve: {
        alias: {
            $: path.resolve("test/stubs/monkey.js"),
        },
    },
    test: {
        environment: "jsdom",
        setupFiles: ["./test/setup.js"],
    },
});
