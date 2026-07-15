import { defineConfig } from "tsup";

export default defineConfig({
	entry: { index: "src/index.ts", utils: "src/public-utils.ts" },
	format: ["esm"],
	dts: false,
	sourcemap: true,
	clean: true,
	minify: false,
	treeshake: true,
	splitting: true,
	tsconfig: "tsconfig.json",
	onSuccess: "node scripts/finalize-package.mjs",
});
