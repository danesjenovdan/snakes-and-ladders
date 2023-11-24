import { defineConfig } from "vite";

export default defineConfig({
  clearScreen: false,
  publicDir: "../public",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  server: {
    host: true,
  },
});
