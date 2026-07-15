import type { PhoneNumber } from "libphonenumber-js";
import type { PhoneField } from "./component.js";
import {
	buildValue as buildPhoneFieldValue,
	getCountriesMap,
	getDefaultCountriesMap,
	isValidPhoneField,
	parsePhoneField,
	fromFormData as parsePhoneFieldFormData,
	toFormValue as serializePhoneFieldValue,
} from "./utils.js";

/** Parse a strict phone string or PhoneField value into libphonenumber data. */
export function parse(
	value: string | PhoneField.Value,
	options?: PhoneField.ParseOptions,
): PhoneNumber | undefined {
	return parsePhoneField(value, options);
}

/** Validate a strict phone string or PhoneField value. */
export function isValid(
	value: string | PhoneField.Value,
	options?: PhoneField.ParseOptions,
): boolean {
	return isValidPhoneField(value, options);
}

/** Build a canonical value from country metadata and a national number. */
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
