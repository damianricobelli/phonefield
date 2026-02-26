import type { CountryCode } from "libphonenumber-js/min";

/**
 * Country descriptor used by the country picker: ISO2 code, display name, dial code, and optional flag emoji.
 */
export type PhoneFieldCountry = {
  iso2: CountryCode;
  name: string;
  dialCode: string;
  flag?: string;
};

/** Read-only map of ISO2 country code to `PhoneFieldCountry`. */
export type PhoneFieldCountryMap = ReadonlyMap<CountryCode, PhoneFieldCountry>;

/** ISO2 country code (e.g. `"US"`, `"GB"`). */
export type PhoneFieldCountryCodeValue = CountryCode;

/** Alias for ISO2 country code. */
export type PhoneFieldCountryName = CountryCode;

/** BCP 47 locale string or list of locale strings for country display names and sorting. */
export type PhoneFieldLang = string | readonly string[];

/**
 * Emitted and controlled value shape: country, national number, E.164, and validity.
 * Used as the value/onValueChange payload and when reading from FormData.
 */
export type PhoneFieldValue = {
  countryIso2: CountryCode;
  countryDialCode: string;
  nationalNumber: string;
  e164: string | null;
  isValid: boolean;
};
