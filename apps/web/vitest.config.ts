import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    viteReact(),
  ],
  test: {
    environment: "jsdom",
  },
});
