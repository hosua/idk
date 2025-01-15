import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/idk/",
  plugins: [react()],
  resolve: {
    alias: {
      "@pages": "/src/pages",
      "@components": "/src/components",
    },
  },
  server: {
    proxy: {
      "/duck/": {
        target: "https://random-d.uk",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/duck/, ""),
      },
    },
  },
});
