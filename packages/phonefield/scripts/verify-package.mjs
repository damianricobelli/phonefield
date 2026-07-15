import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const dist = resolve(scriptDirectory, "../dist");
const clientEntry = readFileSync(resolve(dist, "index.js"), "utf8");
const utilitiesEntry = readFileSync(resolve(dist, "utils.js"), "utf8");

assert.match(
	clientEntry,
	/^"use client";/,
	"dist/index.js must preserve the React client boundary",
);
assert.doesNotMatch(
	utilitiesEntry,
	/^"use client";/,
	"dist/utils.js must remain importable from server code",
);

for (const file of [
	"index.js",
	"index.js.map",
	"index.d.ts",
	"utils.js",
	"utils.js.map",
	"utils.d.ts",
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
