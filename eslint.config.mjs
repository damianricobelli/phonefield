import tsParser from "@typescript-eslint/parser";
import reactHooks from "eslint-plugin-react-hooks";

const reactHooksRecommended = reactHooks.configs.flat["recommended-latest"];

export default [
	{
		ignores: ["**/dist/**", "**/node_modules/**", "**/routeTree.gen.ts"],
	},
	{
		files: [
			"apps/web/src/**/*.{ts,tsx}",
			"packages/phonefield/src/**/*.{ts,tsx}",
		],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaFeatures: { jsx: true },
				sourceType: "module",
			},
		},
		plugins: reactHooksRecommended.plugins,
		rules: reactHooksRecommended.rules,
	},
];
