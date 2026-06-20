import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Static SPA. Hash-based routing (#projects), so no server rewrites are needed —
// Vercel serves the built `dist/` directly.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    target: "es2018",
  },
});
