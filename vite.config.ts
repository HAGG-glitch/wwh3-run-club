import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
  },
  build: {
    rollupOptions: {
      output: {
        /* Split the large, rarely-changing dependencies out of the app bundle.
           These libraries change only when they are upgraded, so separating
           them lets browsers keep caching them across deploys. */
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          motion: ["motion"],
          radix: ["radix-ui"],
          forms: [
            "react-hook-form",
            "@hookform/resolvers",
            "zod",
            "sonner",
          ],
          carousel: ["embla-carousel-react"],
        },
      },
    },
  },
});
