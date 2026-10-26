import { getExampleNumber as getLibExampleNumber } from "libphonenumber-js/min/es6";
import mobileExamples from "libphonenumber-js/mobile/examples";
import type { PhoneFieldCountryCode } from "./types.js";

/**
 * Returns an example mobile number for a country, formatted nationally by
 * default. Useful as an input placeholder.
 */
export function getExampleNumber(
	countryIso2: PhoneFieldCountryCode,
	format: "national" | "international" = "national",
) {
	const example = getLibExampleNumber(countryIso2, mobileExamples);
	if (!example) return undefined;
	return format === "international"
		? example.formatInternational()
		: example.formatNational();
}
