import airbnbConfig from 'eslint-config-airbnb';
import typescriptEslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

export default [
	airbnbConfig,
	typescriptEslint.configs,
	importPlugin.flatConfigs.recommended,
	{
		files: ['**/*.{js,mjs,cjs}'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
		},
		rules: {
			'no-unused-vars': 'off',
			'import/no-dynamic-require': 'warn',
			'import/no-nodejs-modules': 'warn',
		},
	},
];
