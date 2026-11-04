import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const dist = resolve(scriptDirectory, "../dist");
const directive = '"use client";\n';
const clientEntries = ["index", "base-ui", "radix", "react-aria"];

for (const entry of clientEntries) {
	const entryPath = resolve(dist, `${entry}.js`);
	const mapPath = resolve(dist, `${entry}.js.map`);
	const source = readFileSync(entryPath, "utf8");
	if (source.startsWith(directive)) continue;

	writeFileSync(entryPath, `${directive}${source}`);
	const sourceMap = JSON.parse(readFileSync(mapPath, "utf8"));
	sourceMap.mappings = `;${sourceMap.mappings}`;
	writeFileSync(mapPath, JSON.stringify(sourceMap));
}
