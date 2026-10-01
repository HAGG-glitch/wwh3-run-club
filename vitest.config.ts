/// <reference types="vitest/config" />
import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
    restoreMocks: true,
    /* jsdom renders a full page shell per test and these files run in parallel,
       so the default 5s per test is not enough headroom once the suite grew
       past a dozen files. Raised rather than relying on retries. */
    testTimeout: 20_000,
    hookTimeout: 20_000,
  },
});
