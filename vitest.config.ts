import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// same "@/" alias as rsbuild.config.ts / tsconfig.json
export default defineConfig({
  // e2e/ holds the Playwright browser tests (run against a deployed site, see e2e/README.md)
  test: { exclude: ["**/node_modules/**", "e2e/**"] },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
