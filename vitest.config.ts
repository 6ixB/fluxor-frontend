/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "src/lib/**/*.{ts,tsx}",
        "src/hooks/**/*.{ts,tsx}",
        "src/api/**/*.{ts,tsx}",
        "src/types/**/*.{ts,tsx}",
      ],
      exclude: ["src/**/*.d.ts"],
    },
  },
});
