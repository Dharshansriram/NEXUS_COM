import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: false },
    proxy: {
      "/api": { target: "http://127.0.0.1:3001", changeOrigin: true },
    },
  },
  // Tell the SWC plugin to treat .js files as JSX as well
  plugins: [react({ include: /\.(js|jsx|ts|tsx)$/ })],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
    // Ensure .js extension resolves correctly (JSX in .js files)
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  // Ensure Vite's esbuild pre-bundler also handles JSX in .js files
   //optimizeDeps: {
    //esbuildOptions: {
     // loader: "jsx"
   // },
  //},
  // Handle .js files containing JSX syntax during the build/serve phase
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.js$/,
    exclude: [],
  },
});
