import type { CountryCode } from "libphonenumber-js/min";

/**
 * Country descriptor used by the country picker: ISO2 code, display name, dial code, and optional flag emoji.
 */
export type PhoneFieldCountry = {
	readonly iso2: CountryCode;
	readonly name: string;
	readonly dialCode: string;
	readonly flag?: string;
};

/** Read-only map of ISO2 country code to `PhoneFieldCountry`. */
export type PhoneFieldCountryMap = ReadonlyMap<CountryCode, PhoneFieldCountry>;

/** ISO2 country code (e.g. `"US"`, `"GB"`). */
export type PhoneFieldCountryCode = CountryCode;

/** @deprecated Use `PhoneFieldCountryCode` or `PhoneField.CountryCode`. */
export type PhoneFieldCountryCodeValue = PhoneFieldCountryCode;

/** @deprecated This type is an ISO2 code, not a country name. Use `PhoneFieldCountryCode`. */
export type PhoneFieldCountryName = PhoneFieldCountryCode;

/** BCP 47 locale string or list of locale strings for country display names and sorting. */
export type PhoneFieldLang = string | readonly string[];

/** Options for parsing phone strings. String extraction is disabled by default. */
export type PhoneFieldParseOptions = {
	defaultCountry?: CountryCode;
	extract?: boolean;
};

/**
 * Complete emitted value: country, national number, E.164, and validity.
 * Derived fields are rebuilt when reading the minimal payload from FormData.
 */
export type PhoneFieldValue = {
	countryIso2: CountryCode;
	countryDialCode: string;
	nationalNumber: string;
	e164: string | null;
	isValid: boolean;
};

/** Source fields accepted by controlled and uncontrolled roots. Derived fields are rebuilt. */
export type PhoneFieldInputValue = Pick<
	PhoneFieldValue,
	"countryIso2" | "nationalNumber"
>;

/** Minimal, untrusted payload serialized into forms. Derived fields are rebuilt when read. */
export type PhoneFieldFormValue = PhoneFieldInputValue;
