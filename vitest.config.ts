import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Aligné sur `paths` du tsconfig ("@/*" -> "./*"). Sans cet alias, tout
      // fichier testé important via "@/..." échouait à la résolution — le
      // premier à le faire cassait sa suite de tests.
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    pool: "forks",
  },
});
