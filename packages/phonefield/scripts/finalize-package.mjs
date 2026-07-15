import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const dist = resolve(scriptDirectory, "../dist");
const clientEntryPath = resolve(dist, "index.js");
const clientMapPath = resolve(dist, "index.js.map");
const directive = '"use client";\n';
const clientEntry = readFileSync(clientEntryPath, "utf8");

if (!clientEntry.startsWith(directive)) {
	writeFileSync(clientEntryPath, `${directive}${clientEntry}`);

	const sourceMap = JSON.parse(readFileSync(clientMapPath, "utf8"));
	sourceMap.mappings = `;${sourceMap.mappings}`;
	writeFileSync(clientMapPath, JSON.stringify(sourceMap));
}
