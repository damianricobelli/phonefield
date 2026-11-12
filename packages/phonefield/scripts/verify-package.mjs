import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const dist = resolve(scriptDirectory, "../dist");
const clientEntries = ["index", "base-ui", "radix", "react-aria"];
const utilitiesEntry = readFileSync(resolve(dist, "utils.js"), "utf8");
const utilitiesDeclarations = readFileSync(
	resolve(dist, "public-utils.d.ts"),
	"utf8",
);
const utilitiesModule = await import(
	pathToFileURL(resolve(dist, "utils.js")).href
);
const publicDeclarations = [
	"index.d.ts",
	"base-ui/component.d.ts",
	"radix/component.d.ts",
	"react-aria/component.d.ts",
	"types.d.ts",
]
	.map((file) => readFileSync(resolve(dist, file), "utf8"))
	.join("\n");

for (const entry of clientEntries) {
	const source = readFileSync(resolve(dist, `${entry}.js`), "utf8");
	assert.match(
		source,
		/^"use client";/,
		`dist/${entry}.js must preserve the React client boundary`,
	);
	const clientModule = await import(
		pathToFileURL(resolve(dist, `${entry}.js`)).href
	);
	assert.deepEqual(
		Object.keys(clientModule).sort(),
		["PhoneField", "usePhoneField"],
		`phonefield/${entry} must publish exactly PhoneField and usePhoneField`,
	);
	assert.doesNotMatch(
		source,
		/examples\.mobile|"KR":\["/,
		`dist/${entry}.js must not bundle example-number metadata`,
	);
}
/** Bare module specifiers reachable from a dist entry through its chunks. */
function externalImports(file, seen = new Set()) {
	if (seen.has(file)) return new Set();
	seen.add(file);
	const source = readFileSync(resolve(dist, file), "utf8");
	const specifiers = new Set();
	for (const [, specifier] of source.matchAll(
		/(?:from|import)\s*["']([^"']+)["']/g,
	)) {
		if (specifier.startsWith("./")) {
			for (const nested of externalImports(specifier.slice(2), seen)) {
				specifiers.add(nested);
			}
		} else {
			specifiers.add(specifier);
		}
	}
	return specifiers;
}
const adapterImports = {
	"base-ui": /@base-ui\/react/,
	radix: /radix-ui/,
	"react-aria": /react-aria-components/,
};
for (const [entry, pattern] of Object.entries(adapterImports)) {
	const imports = [...externalImports(`${entry}.js`)];
	for (const [other, otherPattern] of Object.entries(adapterImports)) {
		if (other === entry) continue;
		assert.ok(
			!imports.some((specifier) => otherPattern.test(specifier)),
			`phonefield/${entry} must not import ${other}: ${imports.join(", ")}`,
		);
	}
	assert.ok(
		imports.some((specifier) => pattern.test(specifier)),
		`phonefield/${entry} must import its own primitives`,
	);
}
// libphonenumber-js ships two builds: `core` and `min` load `es6/`, while
// `core/es6` and `min/es6` load `es6-modern/`. Mixing them bundles both copies
// (+5.6 KB gzip per entry), so every entry stays on the `es6-modern` family.
const libphonenumberSubpaths =
	/^libphonenumber-js\/(?:core\/es6|min\/es6|min\/metadata|mobile\/examples)$/;
for (const entry of ["index", "base-ui", "radix", "react-aria", "utils"]) {
	const imports = [...externalImports(`${entry}.js`)].filter((specifier) =>
		specifier.startsWith("libphonenumber-js"),
	);
	for (const specifier of imports) {
		assert.match(
			specifier,
			libphonenumberSubpaths,
			`dist/${entry}.js imports ${specifier}, which loads a second libphonenumber-js build`,
		);
	}
}
assert.deepEqual(
	Object.keys(utilitiesModule).sort(),
	[
		"buildValue",
		"countries",
		"fromFormData",
		"getCountries",
		"getExampleNumber",
		"isValid",
		"parse",
		"toFormValue",
	],
	"phonefield/utils must publish exactly the documented named helpers",
);
assert.doesNotMatch(
	utilitiesEntry,
	/^"use client";/,
	"dist/utils.js must remain importable from server code",
);
assert.doesNotMatch(
	publicDeclarations,
	/\b(?:PhoneFieldCountryCodeValue|PhoneFieldCountryName|CountryCodeValue|CountryName)\b/,
	"published declarations must not expose removed deprecated country aliases",
);
assert.doesNotMatch(
	utilitiesDeclarations,
	/\b(?:getCountriesMap|isValidPhoneField|normalizeLang|onlyDigits|parsePhoneField|resolveCountry|PhoneFieldUtils)\b|from\s+["']\.\/utils\.js["']/,
	"phonefield/utils must not expose internal helpers or the removed facade",
);
assert.match(
	utilitiesDeclarations,
	/\b(?:buildValue|countries|fromFormData|getCountries|getExampleNumber|isValid|parse|toFormValue)\b/,
	"phonefield/utils must expose only the documented named helpers",
);

for (const file of [
	"index.js",
	"index.js.map",
	"index.d.ts",
	"base-ui.js",
	"base-ui/index.d.ts",
	"radix.js",
	"radix/index.d.ts",
	"react-aria.js",
	"react-aria/index.d.ts",
	"utils.js",
	"utils.js.map",
	"public-utils.d.ts",
	"types.d.ts",
]) {
	assert.ok(existsSync(resolve(dist, file)), `dist/${file} is missing`);
}

// React Aria's own declarations use ES2022 library types (Intl.Segmenter).
for (const config of [
	"tsconfig.verify.json",
	"tsconfig.verify.react-aria.json",
]) {
	const typecheck = spawnSync("tsc", ["-p", resolve(scriptDirectory, config)], {
		stdio: "inherit",
		shell: process.platform === "win32",
	});
	assert.equal(
		typecheck.status,
		0,
		`published declarations must support NodeNext (${config})`,
	);
}
