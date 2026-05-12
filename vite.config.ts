import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("plotly")) return "plotly";
          if (id.includes("three") || id.includes("@react-three")) return "three";
          if (id.includes("recharts") || id.includes("d3")) return "recharts";
          if (id.includes("@radix-ui")) return "radix";
          if (id.includes("katex") || id.includes("react-katex")) return "katex";
          if (id.includes("motion") || id.includes("framer-motion")) return "motion";
          if (id.includes("zod")) return "zod";
          if (id.includes("@tanstack")) return "tanstack";
        },
      },
    },
  },
});
