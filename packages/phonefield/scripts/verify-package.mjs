import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const dist = resolve(scriptDirectory, "../dist");
const clientEntry = readFileSync(resolve(dist, "index.js"), "utf8");
const utilitiesEntry = readFileSync(resolve(dist, "utils.js"), "utf8");
const utilitiesDeclarations = readFileSync(
	resolve(dist, "public-utils.d.ts"),
	"utf8",
);
const utilitiesModule = await import(
	pathToFileURL(resolve(dist, "utils.js")).href
);
const publicDeclarations = ["index.d.ts", "component.d.ts", "types.d.ts"]
	.map((file) => readFileSync(resolve(dist, file), "utf8"))
	.join("\n");

assert.match(
	clientEntry,
	/^"use client";/,
	"dist/index.js must preserve the React client boundary",
);
assert.deepEqual(
	Object.keys(utilitiesModule).sort(),
	[
		"buildValue",
		"countries",
		"fromFormData",
		"getCountries",
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
	/\b(?:buildValue|countries|fromFormData|getCountries|isValid|parse|toFormValue)\b/,
	"phonefield/utils must expose only the documented named helpers",
);

for (const file of [
	"index.js",
	"index.js.map",
	"index.d.ts",
	"utils.js",
	"utils.js.map",
	"public-utils.d.ts",
	"component.d.ts",
	"types.d.ts",
]) {
	assert.ok(existsSync(resolve(dist, file)), `dist/${file} is missing`);
}

const typecheck = spawnSync(
	"tsc",
	["-p", resolve(scriptDirectory, "tsconfig.verify.json")],
	{ stdio: "inherit", shell: process.platform === "win32" },
);
assert.equal(
	typecheck.status,
	0,
	"published declarations must support NodeNext",
);
