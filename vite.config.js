import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/aviation-api": {
        target: "https://api.aviationapi.com/v1",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/aviation-api/, ""),
      },
    },
  },
});
