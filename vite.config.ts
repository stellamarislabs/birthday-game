import { defineConfig } from "vite";
import { devLevelOverridePlugin } from "./devtools/devLevelOverridePlugin";
import { resolveViteBasePath } from "./devtools/viteBasePath";

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  base: resolveViteBasePath(),
  plugins: [devLevelOverridePlugin(), cloudflare()],
  server: {
    host: "127.0.0.1",
    port: 5173
  },
  preview: {
    host: "127.0.0.1",
    port: 4173
  }
});