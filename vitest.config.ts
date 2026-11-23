import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// same "@/" alias as rsbuild.config.ts / tsconfig.json
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
