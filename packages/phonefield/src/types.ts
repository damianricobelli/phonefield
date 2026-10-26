import type { CountryCode } from "libphonenumber-js/min/es6";

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
	/** Whether the number is valid and its detected country matches countryIso2. */
	isValid: boolean;
};

/** Source fields accepted by controlled and uncontrolled roots. Derived fields are rebuilt. */
export type PhoneFieldInputValue = Pick<
	PhoneFieldValue,
	"countryIso2" | "nationalNumber"
>;

/** Minimal, untrusted payload serialized into forms. Derived fields are rebuilt when read. */
export type PhoneFieldFormValue = PhoneFieldInputValue;

/** Why `onValueChange` fired. */
export type PhoneFieldChangeReason =
	| "input"
	| "paste"
	| "country"
	| "undo"
	| "redo";

/** Second argument of `onValueChange`. */
export type PhoneFieldChangeDetails = {
	reason: PhoneFieldChangeReason;
};

/**
 * Field state shared by every part. Each boolean is mirrored as a `data-*`
 * attribute on Root (for example `data-valid`, `data-touched`).
 */
export type PhoneFieldState = {
	/** Selected ISO2 country. Mirrored as `data-country="US"`. */
	country: CountryCode;
	/** The number is complete and valid for the selected country. */
	valid: boolean;
	/**
	 * After the field is touched (blur or form submit): the number is incomplete
	 * or invalid, or it is empty and `required`. Also true when `invalid` is set.
	 */
	invalid: boolean;
	/** The national number contains at least one digit. */
	filled: boolean;
	/** The value changed since mount. */
	dirty: boolean;
	/** Focus has left the field at least once, or its form was submitted. */
	touched: boolean;
	/** Focus is inside the field, including the country popup. */
	focused: boolean;
	disabled: boolean;
	readOnly: boolean;
	required: boolean;
};
