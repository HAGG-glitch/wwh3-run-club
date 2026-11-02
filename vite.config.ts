import { fileURLToPath, URL } from "node:url";
import netlify from "@netlify/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  /* Vite reads `.env` for the client but does not put those values on
     `process.env`, which is where the Netlify function emulator looks. */
  const fileEnv = loadEnv(mode, process.cwd(), "");
  for (const [key, value] of Object.entries(fileEnv)) {
    process.env[key] ??= value;
  }

  return {
    /* The Netlify plugin emulates functions, Blobs, env vars and redirects in
       `npm run dev`, so local development does not need `netlify dev` (whose
       SPA rewrite otherwise intercepts Vite's module requests). */
    plugins: [
      react(),
      tailwindcss(),
      netlify({
        /* We only need functions, Blobs, redirects and env vars locally. The
           other emulators pull in extra binaries that this site never uses. */
        edgeFunctions: { enabled: false },
        database: { enabled: false },
        geolocation: { enabled: false },
        images: { enabled: false },
        aiGateway: { enabled: false },
      }),
    ],
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
  };
});
