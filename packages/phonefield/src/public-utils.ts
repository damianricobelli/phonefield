import type { PhoneNumber } from "libphonenumber-js/min/es6";
import { getExampleNumber as getExamplePhoneNumber } from "./examples.js";
import type { PhoneField } from "./shared-types.js";
import {
	buildValue as buildPhoneFieldValue,
	getCountriesMap,
	getDefaultCountriesMap,
	isValidPhoneField,
	parsePhoneField,
	fromFormData as parsePhoneFieldFormData,
	toFormValue as serializePhoneFieldValue,
} from "./utils.js";

/**
 * Parse a strict phone string, or a value's `countryIso2` and `nationalNumber`,
 * into libphonenumber data. Accepts `PhoneField.Value` and `PhoneField.InputValue`.
 */
export function parse(
	value: string | PhoneField.Value | PhoneField.InputValue,
	options?: PhoneField.ParseOptions,
): PhoneNumber | undefined {
	return parsePhoneField(value, options);
}

/**
 * Validate a strict phone string, or a value against its selected country.
 * Accepts `PhoneField.Value` and `PhoneField.InputValue` (`{ countryIso2,
 * nationalNumber }`), and revalidates instead of trusting `isValid`.
 */
export function isValid(
	value: string | PhoneField.Value | PhoneField.InputValue,
	options?: PhoneField.ParseOptions,
): boolean {
	return isValidPhoneField(value, options);
}

/** Build a canonical value from country metadata and a national or international number. */
export function buildValue(
	country: PhoneField.Country,
	nationalNumber: string,
	formatOnType: boolean,
): PhoneField.Value {
	return buildPhoneFieldValue(country, nationalNumber, formatOnType);
}

/** Validate submitted source fields and rebuild a canonical value. */
export function fromFormData(
	formData: FormData,
	name: string,
): PhoneField.Value | null {
	return parsePhoneFieldFormData(formData, name);
}

/** Return the minimal source fields serialized by PhoneField.Root. */
export function toFormValue(value: PhoneField.Value): PhoneField.FormValue {
	return serializePhoneFieldValue(value);
}

/** Return localized, runtime-immutable country metadata. */
export function getCountries(lang?: PhoneField.Lang): PhoneField.CountryMap {
	return getCountriesMap(lang);
}

/** Default English country metadata. */
export const countries: PhoneField.CountryMap = getDefaultCountriesMap();

/**
 * Example mobile number for a country, formatted nationally by default.
 * Pair it with `PhoneField.Input`'s function placeholder.
 */
export function getExampleNumber(
	country: PhoneField.CountryCode,
	format: "national" | "international" = "national",
): string | undefined {
	return getExamplePhoneNumber(country, format);
}
