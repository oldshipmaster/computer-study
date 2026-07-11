import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const pagesBase = process.env.GITHUB_PAGES_BASE_PATH ?? "/";

export default defineConfig({
  root: "github-pages",
  base: pagesBase,
  publicDir: "../public",
  plugins: [react()],
  resolve: {
    alias: {
      "@": projectRoot,
    },
  },
  build: {
    outDir: "../out-pages",
    emptyOutDir: true,
  },
});
