import {
  AsYouType,
  type CountryCode,
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js/min";
import type {
  PhoneFieldCountry,
  PhoneFieldCountryCodeValue,
  PhoneFieldCountryMap,
  PhoneFieldLang,
  PhoneFieldValue,
} from "./types";

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
export function normalizeLang(lang?: PhoneFieldLang) {
  if (!lang) {
    return "en";
  }

  try {
    return Intl.getCanonicalLocales(lang)[0] ?? "en";
  } catch {
    if (Array.isArray(lang)) {
      return lang[0] ?? "en";
    }
    return lang;
  }
}

function buildCountriesMap(lang: string) {
  const regionNames = createRegionNames(lang);
  const collator = createRegionCollator(lang);
  const countries = allCountries
    .map((iso2) => ({
      iso2,
      name: countryName(iso2, regionNames),
      dialCode: `+${getCountryCallingCode(iso2)}`,
      flag: countryFlag(iso2),
    }))
    .sort((a, b) =>
      collator
        ? collator.compare(a.name, b.name)
        : a.name.localeCompare(b.name, lang),
    );

  return new Map<CountryCode, PhoneFieldCountry>(
    countries.map((country) => [country.iso2, country]),
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
    return cached;
  }

  const countriesMap = buildCountriesMap(normalizedLang);
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

function dialCodeDigits(country: PhoneFieldCountry) {
  return onlyDigits(country.dialCode);
}

/**
 * Filters a countries map to the given ISO2 codes, or returns all countries if none provided.
 * @throws If the resulting list is empty.
 */
export function toAvailableCountries(
  countriesMap: PhoneFieldCountryMap,
  countries?: readonly PhoneFieldCountryCodeValue[],
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
  const nationalDigits = onlyDigits(rawNumber);
  const nationalNumber = formatOnType
    ? nationalDigits
      ? new AsYouType(country.iso2).input(nationalDigits)
      : ""
    : rawNumber;
  const countryDialCode = dialCodeDigits(country);
  const e164 = nationalDigits
    ? `+${countryDialCode}${nationalDigits}`
    : null;
  const parsed = e164 ? parsePhoneNumberFromString(e164) : undefined;

  return {
    countryIso2: country.iso2,
    countryDialCode,
    nationalNumber,
    e164,
    isValid: parsed?.isValid() ?? false,
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
  options?: { defaultCountry?: CountryCode },
) {
  if (typeof value === "string") {
    return parsePhoneNumberFromString(value, options?.defaultCountry);
  }

  const byE164 = value.e164
    ? parsePhoneNumberFromString(value.e164)
    : undefined;
  if (byE164) {
    return byE164;
  }

  const raw = `+${value.countryDialCode}${onlyDigits(value.nationalNumber)}`;
  return parsePhoneNumberFromString(raw, value.countryIso2);
}

/**
 * Returns whether the value is a valid phone number. Accepts PhoneFieldValue or E.164 string.
 * Options.defaultCountry for national-number strings.
 */
export function isValidPhoneField(
  value: string | PhoneFieldValue,
  options?: { defaultCountry?: CountryCode },
) {
  return parsePhoneField(value, options)?.isValid() ?? false;
}

/** Type guard: true if the value has the PhoneFieldValue shape. */
export function isPhoneFieldValue(value: unknown): value is PhoneFieldValue {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<PhoneFieldValue>;
  return (
    typeof candidate.countryIso2 === "string" &&
    typeof candidate.countryDialCode === "string" &&
    typeof candidate.nationalNumber === "string" &&
    (typeof candidate.e164 === "string" || candidate.e164 === null) &&
    typeof candidate.isValid === "boolean"
  );
}

/**
 * Reads a serialized PhoneField.Value from FormData (JSON string). Returns null if missing or invalid.
 */
export function fromFormData(formData: FormData, name: string) {
  const raw = formData.get(name);
  if (typeof raw !== "string") {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    return isPhoneFieldValue(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Helper facade for parse, isValid, fromFormData, getCountries, and default countries map.
 * Use from "phonefield/utils" on client or server.
 */
export const PhoneFieldUtils = {
  parse: parsePhoneField,
  isValid: isValidPhoneField,
  fromFormData,
  getCountries: getCountriesMap,
  get countries() {
    return getDefaultCountriesMap();
  },
};
