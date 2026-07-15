import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
    dedupe: ["react", "react-dom"],
  },
  server: {
    allowedHosts: [".local", ".localcan.dev"],
  },
  plugins: [
    devtools(),
    nitro(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    babel({
      exclude: [/[/\\]node_modules[/\\]/, /^\0rolldown\/runtime\.js$/],
      presets: [reactCompilerPreset()],
    }),
  ],
});

export default config;
