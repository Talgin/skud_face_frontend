import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { TanStackRouterRspack } from "@tanstack/router-plugin/rspack";
import { pluginSass } from "@rsbuild/plugin-sass";

import { loadEnv } from "@rsbuild/core";

// By default, `publicVars` are variables prefixed with `PUBLIC_`
const { publicVars } = loadEnv();

export default defineConfig({
  plugins: [pluginReact(), pluginSass()],
  source: {
    entry: { index: "./src/app/appEntry.tsx" },
    alias: {
      "@/": "./src",
    },
    define: publicVars,
  },
  server: {
    proxy: {
      "/api/v1": {
        target: "http://85.159.27.224:9000",
        changeOrigin: true,
        secure: false,
      },
      "/api/monitoring": {
        target: "http://85.159.27.224:50008",
        changeOrigin: true,
        secure: false,
        ws: false,
        pathRewrite: (path) => path.replace(/^\/api\/monitoring/, ""),
        proxyTimeout: 0,
        timeout: 0,
      },
      "/api/events": {
        target: "http://85.159.27.224:50002",
        changeOrigin: true,
        secure: false,
        ws: false,
        pathRewrite: (path) => path.replace(/^\/api\/events/, ""),
        proxyTimeout: 0,
        timeout: 0,
      },
    },
  },
  tools: {
    rspack: {
      plugins: [
        TanStackRouterRspack({
          routesDirectory: "./src/app/routes",
        }),
      ],
    },
  },
  html: {
    title: "Nception Monitoring",
    favicon: "./src/shared/assets/favicon.svg",
    meta: { "theme-color": "#0b1220" },
  },
});
