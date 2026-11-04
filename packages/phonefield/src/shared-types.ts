import type {
	PhoneFieldChangeDetails,
	PhoneFieldChangeReason,
	PhoneFieldCountry,
	PhoneFieldCountryCode,
	PhoneFieldCountryMap,
	PhoneFieldFormValue,
	PhoneFieldInputValue,
	PhoneFieldLang,
	PhoneFieldParseOptions,
	PhoneFieldState,
	PhoneFieldValue,
} from "./types.js";

/** Value types shared by every adapter and by `phonefield/utils`. */
export namespace PhoneField {
	/** Country descriptor: iso2, name, dialCode, flag. */
	export type Country = PhoneFieldCountry;
	/** Read-only map of ISO2 to country. */
	export type CountryMap = PhoneFieldCountryMap;
	/** ISO2 country code (e.g. "US", "GB"). */
	export type CountryCode = PhoneFieldCountryCode;
	/** BCP 47 locale for country names and sorting. */
	export type Lang = PhoneFieldLang;
	/** Complete emitted value: countryIso2, countryDialCode, nationalNumber, e164, isValid. */
	export type Value = PhoneFieldValue;
	/** Source fields accepted by `value` and `defaultValue`; derived fields are rebuilt. */
	export type InputValue = PhoneFieldInputValue;
	/** Minimal untrusted payload serialized into forms. */
	export type FormValue = PhoneFieldFormValue;
	/** Options for strict string parsing and opt-in extraction. */
	export type ParseOptions = PhoneFieldParseOptions;
	/** Field state. Every key is mirrored as a `data-*` attribute on Root. */
	export type State = PhoneFieldState;
	/** Why `onValueChange` fired. */
	export type ChangeReason = PhoneFieldChangeReason;
	/** Second argument of `onValueChange`. */
	export type ChangeDetails = PhoneFieldChangeDetails;
}
