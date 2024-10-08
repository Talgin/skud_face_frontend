import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
// @ts-ignore
import { TanStackRouterRspack } from '@tanstack/router-plugin/rspack';
import { pluginSass } from '@rsbuild/plugin-sass';

export default defineConfig({
	plugins: [pluginReact(), pluginSass()],
	source: {
		entry: { index: './src/app/appEntry.tsx' },
		alias: {
			'@/': './src',
		},
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
});
