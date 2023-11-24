import { defineConfig } from "vite";

export default defineConfig({
  clearScreen: false,
  root: "./src",
  publicDir: "../public",
  build: {
    outDir: "../dist",
  },
  server: {
    host: true,
  },
});
