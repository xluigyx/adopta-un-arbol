import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
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
      minify: "terser",
      sourcemap: isDev,
    },

    server: {
      port: 5173,
      open: true,
      
      // ✅ Proxy para desarrollo
      proxy: isDev
        ? {
            "/api": {
              target: "http://localhost:4000",
              changeOrigin: true,
              secure: false,
              ws: true,
              rewrite: (path) => path,
            },
          }
        : undefined,

      // ✅ Headers de seguridad para desarrollo
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
      },

      // ✅ Middleware para servir con CORS
      middlewareMode: false,
    },
  };
});
