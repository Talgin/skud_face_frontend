import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
// @ts-ignore
import { TanStackRouterRspack } from '@tanstack/router-plugin/rspack';
import { pluginSass } from '@rsbuild/plugin-sass';

import { loadEnv } from '@rsbuild/core';

// By default, `publicVars` are variables prefixed with `PUBLIC_`
const { publicVars } = loadEnv();

export default defineConfig({
	plugins: [pluginReact(), pluginSass()],
	source: {
		entry: { index: './src/app/appEntry.tsx' },
		alias: {
			'@/': './src',
		},
		define: publicVars,
	},
	tools: {
		rspack: {
			plugins: [
				TanStackRouterRspack({
					routesDirectory: './src/app/routes',
				}),
			],
		},
	},
	html: {
		title: 'Face detection',
	},
});
