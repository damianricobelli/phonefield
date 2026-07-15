import {
	AsYouType,
	type CountryCode,
	getCountries,
	getCountryCallingCode,
	parsePhoneNumberFromString,
} from "libphonenumber-js/min";
import type {
	PhoneFieldCountry,
	PhoneFieldCountryCode,
	PhoneFieldCountryMap,
	PhoneFieldFormValue,
	PhoneFieldLang,
	PhoneFieldParseOptions,
	PhoneFieldValue,
} from "./types.js";

function createRegionNames(locale: string) {
	if (typeof Intl === "undefined" || typeof Intl.DisplayNames === "undefined") {
		return null;
	}

	try {
		return new Intl.DisplayNames([locale], { type: "region" });
	} catch {
		return null;
	}
}

function createRegionCollator(locale: string) {
	if (typeof Intl === "undefined" || typeof Intl.Collator === "undefined") {
		return null;
	}

	try {
		return new Intl.Collator(locale);
	} catch {
		return null;
	}
}

const fallbackRegionNames = createRegionNames("en");
const allCountries = getCountries();
const MAX_CACHED_LOCALES = 16;

class ReadonlyMapView<K, V> implements ReadonlyMap<K, V> {
	readonly #map: Map<K, V>;

	constructor(map: Map<K, V>) {
		this.#map = map;
	}

	get size() {
		return this.#map.size;
	}

	get(key: K) {
		return this.#map.get(key);
	}

	has(key: K) {
		return this.#map.has(key);
	}

	entries() {
		return this.#map.entries();
	}

	keys() {
		return this.#map.keys();
	}

	values() {
		return this.#map.values();
	}

	forEach(
		callback: (value: V, key: K, map: ReadonlyMap<K, V>) => void,
		thisArg?: unknown,
	) {
		for (const [key, value] of this.#map) {
			callback.call(thisArg, value, key, this);
		}
	}

	[Symbol.iterator]() {
		return this.#map[Symbol.iterator]();
	}
}

function countryName(iso2: CountryCode, regionNames: Intl.DisplayNames | null) {
	return regionNames?.of(iso2) ?? fallbackRegionNames?.of(iso2) ?? iso2;
}

function countryFlag(iso2: CountryCode) {
	return iso2
		.toUpperCase()
		.replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397));
}

/**
 * Normalizes a BCP 47 locale (string or array) to a single canonical locale string. Returns `"en"` when missing or invalid.
 */
export function normalizeLang(lang?: PhoneFieldLang): string {
	if (!lang) {
		return "en";
	}

	try {
		return Intl.getCanonicalLocales(lang)[0] ?? "en";
	} catch {
		return "en";
	}
}

function buildCountriesMap(lang: string) {
	const regionNames = createRegionNames(lang);
	const collator = createRegionCollator(lang);
	const countries = allCountries
		.map((iso2) =>
			Object.freeze({
				iso2,
				name: countryName(iso2, regionNames),
				dialCode: `+${getCountryCallingCode(iso2)}`,
				flag: countryFlag(iso2),
			}),
		)
		.sort((a, b) =>
			collator
				? collator.compare(a.name, b.name)
				: a.name.localeCompare(b.name, lang),
		);

	return new ReadonlyMapView<CountryCode, PhoneFieldCountry>(
		new Map(countries.map((country) => [country.iso2, country])),
	);
}

const countriesMapByLang = new Map<string, PhoneFieldCountryMap>();

/**
 * Returns a cached map of ISO2 → PhoneFieldCountry for the given locale. Used for country names and sorting.
 */
export function getCountriesMap(lang?: PhoneFieldLang) {
	const normalizedLang = normalizeLang(lang);
	const cached = countriesMapByLang.get(normalizedLang);
	if (cached) {
		countriesMapByLang.delete(normalizedLang);
		countriesMapByLang.set(normalizedLang, cached);
		return cached;
	}

	const countriesMap = buildCountriesMap(normalizedLang);
	if (countriesMapByLang.size >= MAX_CACHED_LOCALES) {
		const oldestLocale = countriesMapByLang.keys().next().value;
		if (oldestLocale) {
			countriesMapByLang.delete(oldestLocale);
		}
	}
	countriesMapByLang.set(normalizedLang, countriesMap);
	return countriesMap;
}

/** Default country code used when none is specified (e.g. "US"). */
export const DEFAULT_COUNTRY: CountryCode = "US";

/** Returns the default countries map for locale "en". */
export function getDefaultCountriesMap() {
	return getCountriesMap("en");
}

/** Strips all non-digit characters from a string. */
export function onlyDigits(value: string) {
	return value.replace(/\D+/g, "");
}

/** Parses a strict international input while preserving ordinary national input behavior. */
export function parseInternationalInput(value: string) {
	const trimmedValue = value.trim();
	return trimmedValue.startsWith("+")
		? parsePhoneNumberFromString(trimmedValue, { extract: false })
		: undefined;
}

/**
 * Filters a countries map to the given ISO2 codes, or returns all countries if none provided.
 * @throws If the resulting list is empty.
 */
export function toAvailableCountries(
	countriesMap: PhoneFieldCountryMap,
	countries?: readonly PhoneFieldCountryCode[],
) {
	if (!countries?.length) {
		const entries = Array.from(countriesMap.values());
		if (entries.length === 0) {
			throw new Error(
				"PhoneField.Root requires at least one valid country code.",
			);
		}
		return entries;
	}

	const selectedCodes = countries;
	const seen = new Set<CountryCode>();
	const entries: PhoneFieldCountry[] = [];

	for (const code of selectedCodes) {
		if (seen.has(code)) {
			continue;
		}
		seen.add(code);

		const country = countriesMap.get(code);
		if (country) {
			entries.push(country);
		}
	}

	if (entries.length === 0) {
		throw new Error(
			"PhoneField.Root requires at least one valid country code.",
		);
	}

	return entries;
}

/**
 * Resolves an ISO2 code to a country from the available list. Falls back to US if present, else first country.
 * @throws If availableCountries is empty.
 */
export function resolveCountry(
	availableCountries: readonly PhoneFieldCountry[],
	iso2?: CountryCode,
) {
	if (availableCountries.length === 0) {
		throw new Error("PhoneField.Root requires at least one available country.");
	}

	let fallbackCountry = availableCountries[0];

	for (const country of availableCountries) {
		if (country.iso2 === DEFAULT_COUNTRY) {
			fallbackCountry = country;
		}

		if (iso2 && country.iso2 === iso2) {
			return country;
		}
	}

	return fallbackCountry;
}

/**
 * Builds a PhoneFieldValue from country, raw national number string, and formatOnType flag.
 * When formatOnType is true, national number is formatted as-you-type.
 */
export function buildValue(
	country: PhoneFieldCountry,
	rawNumber: string,
	formatOnType: boolean,
): PhoneFieldValue {
	const internationalNumber = parseInternationalInput(rawNumber);
	if (
		rawNumber.trimStart().startsWith("+") &&
		internationalNumber?.country !== country.iso2
	) {
		return {
			countryIso2: country.iso2,
			countryDialCode: country.dialCode,
			nationalNumber: rawNumber,
			e164: null,
			isValid: false,
		};
	}
	const normalizedNumber =
		internationalNumber?.country === country.iso2
			? formatOnType
				? internationalNumber.formatNational()
				: internationalNumber.nationalNumber
			: rawNumber;
	const nationalDigits = onlyDigits(normalizedNumber);
	const formatter = new AsYouType(country.iso2);
	const formattedNumber = nationalDigits ? formatter.input(nationalDigits) : "";
	const nationalNumber = formatOnType ? formattedNumber : normalizedNumber;
	const countryDialCode = country.dialCode;
	const parsed = formatter.getNumber();

	return {
		countryIso2: country.iso2,
		countryDialCode,
		nationalNumber,
		e164: formatter.getNumberValue() ?? null,
		isValid: parsed?.country === country.iso2 && parsed.isValid(),
	};
}

/** Default search text for a country (name, iso2, dialCode) used by the combobox. */
export function defaultCountrySearchText(country: PhoneFieldCountry) {
	return `${country.name} ${country.iso2} ${country.dialCode}`;
}

/**
 * Parses a PhoneFieldValue or E.164 string into a libphonenumber PhoneNumber.
 * Use for formatNational(), formatInternational(), getURI(). Options.defaultCountry for national-number strings.
 */
export function parsePhoneField(
	value: string | PhoneFieldValue,
	options?: PhoneFieldParseOptions,
) {
	if (typeof value === "string") {
		return parsePhoneNumberFromString(value, {
			defaultCountry: options?.defaultCountry,
			extract: options?.extract ?? false,
		});
	}

	const country = getDefaultCountriesMap().get(value.countryIso2);
	if (!country) {
		return undefined;
	}

	return parsePhoneNumberFromString(onlyDigits(value.nationalNumber), {
		defaultCountry: country.iso2,
		extract: false,
	});
}

/**
 * Returns whether the value is a valid phone number. Accepts PhoneFieldValue or E.164 string.
 * Options.defaultCountry for national-number strings.
 */
export function isValidPhoneField(
	value: string | PhoneFieldValue,
	options?: PhoneFieldParseOptions,
) {
	const parsed = parsePhoneField(value, options);
	return (
		parsed?.isValid() === true &&
		(typeof value === "string" || parsed.country === value.countryIso2)
	);
}

/** Type guard: true if the value has the PhoneFieldValue shape. */
export function isPhoneFieldValue(value: unknown): value is PhoneFieldValue {
	if (!value || typeof value !== "object") {
		return false;
	}

	const candidate = value as Partial<PhoneFieldValue>;
	if (
		typeof candidate.countryIso2 !== "string" ||
		typeof candidate.countryDialCode !== "string" ||
		typeof candidate.nationalNumber !== "string" ||
		(typeof candidate.e164 !== "string" && candidate.e164 !== null) ||
		typeof candidate.isValid !== "boolean"
	) {
		return false;
	}

	const country = getDefaultCountriesMap().get(
		candidate.countryIso2 as CountryCode,
	);
	if (!country) {
		return false;
	}

	const canonical = buildValue(country, candidate.nationalNumber, false);
	return (
		candidate.countryDialCode === canonical.countryDialCode &&
		candidate.e164 === canonical.e164 &&
		candidate.isValid === canonical.isValid
	);
}

/** Returns the minimal payload written to a hidden form control. */
export function toFormValue(value: PhoneFieldValue): PhoneFieldFormValue {
	return {
		countryIso2: value.countryIso2,
		nationalNumber: value.nationalNumber,
	};
}

const MAX_FORM_PHONE_LENGTH = 250;
const MAX_FORM_PAYLOAD_LENGTH = 1_000;

/**
 * Validates a minimal serialized form payload and rebuilds a canonical PhoneFieldValue.
 * Legacy full-value JSON is accepted, but client-supplied derived fields are ignored.
 */
export function fromFormData(formData: FormData, name: string) {
	const raw = formData.get(name);
	if (typeof raw !== "string" || raw.length > MAX_FORM_PAYLOAD_LENGTH) {
		return null;
	}

	try {
		const parsed: unknown = JSON.parse(raw);
		if (!parsed || typeof parsed !== "object") {
			return null;
		}

		const candidate = parsed as Partial<PhoneFieldFormValue>;
		if (
			typeof candidate.countryIso2 !== "string" ||
			typeof candidate.nationalNumber !== "string" ||
			candidate.nationalNumber.length > MAX_FORM_PHONE_LENGTH
		) {
			return null;
		}

		const country = getDefaultCountriesMap().get(
			candidate.countryIso2 as CountryCode,
		);
		return country ? buildValue(country, candidate.nationalNumber, true) : null;
	} catch {
		return null;
	}
}
