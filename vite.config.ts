import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  define: {
    "process.env": process.env,
  },

  build: {
    target: "esnext",
    outDir: "dist",
    emptyOutDir: true,
  },

  server: {
    port: 5173,
    open: true,
    proxy:
      mode === "development"
        ? {
            "/api": {
              target: "http://localhost:4000",
              changeOrigin: true,
              secure: false,
            },
          }
        : undefined,
  },
}));
