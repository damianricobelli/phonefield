import { describe, expect, it } from "vitest";
import { getExampleNumber } from "../src/public-utils";
import { buildValue, getDefaultCountriesMap, isTooLong } from "../src/utils";

describe("example numbers", () => {
	const countries = Array.from(getDefaultCountriesMap().values());

	it("can always be typed digit by digit and form a valid number", () => {
		const failures: string[] = [];
		for (const country of countries) {
			const example = getExampleNumber(country.iso2);
			if (!example) continue;
			const digits = example.replace(/\D/g, "");
			let typed = "";
			for (const digit of digits) {
				typed += digit;
				if (isTooLong(country, typed)) {
					failures.push(`${country.iso2}: blocked at "${typed}" (${example})`);
					break;
				}
			}
			const value = buildValue(country, digits, true);
			if (!value.isValid)
				failures.push(`${country.iso2}: invalid (${example})`);
		}
		expect(failures).toEqual([]);
	});
});
