import { describe, expect, it, vi } from "vitest";
import type {
	PhoneFieldCountry,
	PhoneFieldCountryMap,
	PhoneFieldValue,
} from "../src/types";
import {
	buildValue,
	DEFAULT_COUNTRY,
	defaultCountrySearchText,
	fromFormData,
	getCountriesMap,
	getDefaultCountriesMap,
	isPhoneFieldValue,
	isValidPhoneField,
	normalizeLang,
	onlyDigits,
	PhoneFieldUtils,
	parsePhoneField,
	resolveCountry,
	toAvailableCountries,
} from "../src/utils";

const US: PhoneFieldCountry = {
	iso2: "US",
	name: "United States",
	dialCode: "+1",
	flag: "🇺🇸",
};

const AR: PhoneFieldCountry = {
	iso2: "AR",
	name: "Argentina",
	dialCode: "+54",
	flag: "🇦🇷",
};

const FIXTURE_COUNTRIES_MAP: PhoneFieldCountryMap = new Map([
	[US.iso2, US],
	[AR.iso2, AR],
]);

const VALID_PHONE_FIELD_VALUE: PhoneFieldValue = {
	countryIso2: "US",
	countryDialCode: "+1",
	nationalNumber: "(202) 555-0123",
	e164: "+12025550123",
	isValid: true,
};

describe("normalizeLang", () => {
	it("returns 'en' when no lang is provided", () => {
		expect(normalizeLang()).toBe("en");
	});

	it("canonicalizes locale values", () => {
		expect(normalizeLang("EN-us")).toBe("en-US");
		expect(normalizeLang(["es-ar", "en-US"])).toBe("es-AR");
	});

	it("falls back to English when canonicalization throws", () => {
		const spy = vi.spyOn(Intl, "getCanonicalLocales").mockImplementation(() => {
			throw new RangeError("bad locale");
		});

		expect(normalizeLang("custom-locale")).toBe("en");
		expect(normalizeLang(["x-one", "x-two"])).toBe("en");

		spy.mockRestore();
	});

	it("does not propagate invalid locale tags", () => {
		expect(normalizeLang("not_a_locale")).toBe("en");
		expect(getCountriesMap("not_a_locale")).toBe(getCountriesMap("en"));
	});
});

describe("countries map helpers", () => {
	it("returns a cached map per normalized language", () => {
		const enMapA = getCountriesMap("en-us");
		const enMapB = getCountriesMap("en-US");
		const esMap = getCountriesMap("es");

		expect(enMapA).toBe(enMapB);
		expect(esMap).not.toBe(enMapA);
		expect(enMapA.size).toBeGreaterThan(0);
		expect(enMapA.get(DEFAULT_COUNTRY)?.dialCode).toBe("+1");
	});

	it("returns the default map for english", () => {
		expect(getDefaultCountriesMap()).toBe(getCountriesMap("en"));
	});

	it("does not expose mutable cached maps or country records", () => {
		const countries = getDefaultCountriesMap();
		const us = countries.get("US");

		expect("set" in countries).toBe(false);
		expect("delete" in countries).toBe(false);
		expect(Object.isFrozen(us)).toBe(true);
	});

	it("bounds the localized country-map cache", () => {
		const first = getCountriesMap("en-US");
		for (const locale of [
			"fr",
			"de",
			"es",
			"it",
			"pt",
			"nl",
			"pl",
			"ja",
			"ko",
			"zh",
			"ar",
			"ru",
			"tr",
			"sv",
			"no",
			"da",
			"fi",
		]) {
			getCountriesMap(locale);
		}

		expect(getCountriesMap("en-US")).not.toBe(first);
	});
});

describe("primitive helpers", () => {
	it("keeps only digits", () => {
		expect(onlyDigits(" +54 (11) 5555-5555 ")).toBe("541155555555");
	});

	it("builds country search text", () => {
		expect(defaultCountrySearchText(US)).toBe("United States US +1");
	});
});

describe("toAvailableCountries", () => {
	it("returns all map entries when no country list is provided", () => {
		expect(toAvailableCountries(FIXTURE_COUNTRIES_MAP)).toEqual([US, AR]);
	});

	it("deduplicates selected countries and ignores unknown ones", () => {
		const selected = toAvailableCountries(FIXTURE_COUNTRIES_MAP, [
			"AR",
			"AR",
			"XX",
			"US",
		] as never);

		expect(selected).toEqual([AR, US]);
	});

	it("throws when no valid countries are available", () => {
		expect(() =>
			toAvailableCountries(new Map() as PhoneFieldCountryMap),
		).toThrow("PhoneField.Root requires at least one valid country code.");

		expect(() =>
			toAvailableCountries(FIXTURE_COUNTRIES_MAP, ["ZZ"] as never),
		).toThrow("PhoneField.Root requires at least one valid country code.");
	});
});

describe("resolveCountry", () => {
	it("returns exact match when available", () => {
		expect(resolveCountry([US, AR], "AR")).toBe(AR);
	});

	it("falls back to US when selected country is missing", () => {
		expect(resolveCountry([AR, US], "BR")).toBe(US);
	});

	it("falls back to first country when US is not available", () => {
		expect(resolveCountry([AR], "BR")).toBe(AR);
	});

	it("throws when available list is empty", () => {
		expect(() => resolveCountry([])).toThrow(
			"PhoneField.Root requires at least one available country.",
		);
	});
});

describe("buildValue", () => {
	it("keeps raw number when formatOnType is false", () => {
		const built = buildValue(US, "(202) 555-0123", false);

		expect(built.countryIso2).toBe("US");
		expect(built.countryDialCode).toBe("+1");
		expect(built.nationalNumber).toBe("(202) 555-0123");
		expect(built.e164).toBe("+12025550123");
		expect(built.isValid).toBe(true);
	});

	it("returns empty/null values when number has no digits", () => {
		const built = buildValue(US, "abc", true);

		expect(built.nationalNumber).toBe("");
		expect(built.e164).toBeNull();
		expect(built.isValid).toBe(false);
	});

	it("normalizes dial code and validates generated e164", () => {
		const built = buildValue(US, "2025550123", true);

		expect(built.countryDialCode).toBe("+1");
		expect(onlyDigits(built.nationalNumber)).toBe("2025550123");
		expect(built.e164).toBe("+12025550123");
		expect(built.isValid).toBe(true);
	});

	it("removes national trunk prefixes from canonical E.164 values", () => {
		const countries = getCountriesMap("en");
		const gb = countries.get("GB");
		const ar = countries.get("AR");

		if (!gb || !ar) {
			throw new Error("Expected GB and AR in the default country map");
		}

		expect(buildValue(gb, "020 7946 0018", true)).toMatchObject({
			nationalNumber: "020 7946 0018",
			e164: "+442079460018",
			isValid: true,
		});
		expect(buildValue(ar, "011 4321-1234", true)).toMatchObject({
			nationalNumber: "011 4321-1234",
			e164: "+541143211234",
			isValid: true,
		});
	});
});

describe("parsePhoneField / isValidPhoneField", () => {
	it("parses strings with default country", () => {
		const parsed = parsePhoneField("2025550123", { defaultCountry: "US" });
		expect(parsed?.number).toBe("+12025550123");
	});

	it("rebuilds value objects from their source fields", () => {
		const parsed = parsePhoneField({
			...VALID_PHONE_FIELD_VALUE,
			e164: "+442079460018",
			isValid: false,
		});
		expect(parsed?.number).toBe("+12025550123");
	});

	it("falls back to raw national number when e164 is absent", () => {
		const parsed = parsePhoneField({
			...VALID_PHONE_FIELD_VALUE,
			e164: null,
			isValid: false,
		});

		expect(parsed?.number).toBe("+12025550123");
	});

	it("validates both raw strings and PhoneField values", () => {
		expect(isValidPhoneField("+12025550123")).toBe(true);
		expect(
			isValidPhoneField({
				...VALID_PHONE_FIELD_VALUE,
				e164: null,
				isValid: false,
			}),
		).toBe(true);
		expect(isValidPhoneField("123", { defaultCountry: "US" })).toBe(false);
	});

	it("uses strict string parsing unless extraction is explicitly enabled", () => {
		expect(parsePhoneField("Call +1 202 555 0123")?.number).toBeUndefined();
		expect(
			parsePhoneField("Call +1 202 555 0123", { extract: true })?.number,
		).toBe("+12025550123");
	});
});

describe("isPhoneFieldValue", () => {
	it("accepts a valid PhoneField value shape", () => {
		expect(isPhoneFieldValue(VALID_PHONE_FIELD_VALUE)).toBe(true);
	});

	it("rejects invalid shapes", () => {
		expect(isPhoneFieldValue(null)).toBe(false);
		expect(isPhoneFieldValue({})).toBe(false);
		expect(
			isPhoneFieldValue({
				...VALID_PHONE_FIELD_VALUE,
				isValid: "yes",
			}),
		).toBe(false);
	});

	it("rejects values whose derived fields are inconsistent", () => {
		expect(
			isPhoneFieldValue({
				...VALID_PHONE_FIELD_VALUE,
				e164: "+442079460018",
				isValid: true,
			}),
		).toBe(false);
		expect(
			isPhoneFieldValue({
				...VALID_PHONE_FIELD_VALUE,
				countryIso2: "ZZ",
			}),
		).toBe(false);
	});
});

describe("fromFormData", () => {
	it("parses valid JSON payloads", () => {
		const formData = new FormData();
		formData.set("phone", JSON.stringify(VALID_PHONE_FIELD_VALUE));

		expect(fromFormData(formData, "phone")).toEqual(VALID_PHONE_FIELD_VALUE);
	});

	it("returns null for missing, invalid or non-string payloads", () => {
		const invalidJson = new FormData();
		invalidJson.set("phone", "{");

		const invalidShape = new FormData();
		invalidShape.set("phone", JSON.stringify({ test: true }));

		const nonString = new FormData();
		nonString.set("phone", new File(["file"], "phone.txt"));

		expect(fromFormData(new FormData(), "phone")).toBeNull();
		expect(fromFormData(invalidJson, "phone")).toBeNull();
		expect(fromFormData(invalidShape, "phone")).toBeNull();
		expect(fromFormData(nonString, "phone")).toBeNull();
	});

	it("rejects oversized JSON before parsing derived or extra fields", () => {
		const formData = new FormData();
		formData.set(
			"phone",
			JSON.stringify({
				countryIso2: "US",
				nationalNumber: "2025550123",
				ignored: "x".repeat(2_000),
			}),
		);

		expect(fromFormData(formData, "phone")).toBeNull();
	});

	it("rebuilds derived fields from the submitted country and national number", () => {
		const formData = new FormData();
		formData.set(
			"phone",
			JSON.stringify({
				countryIso2: "GB",
				nationalNumber: "020 7946 0018",
				countryDialCode: "evil",
				e164: "+12025550123",
				isValid: false,
			}),
		);

		expect(fromFormData(formData, "phone")).toEqual({
			countryIso2: "GB",
			countryDialCode: "+44",
			nationalNumber: "020 7946 0018",
			e164: "+442079460018",
			isValid: true,
		});
	});

	it("accepts the minimal serialized shape and rejects unknown countries", () => {
		const minimal = new FormData();
		minimal.set(
			"phone",
			JSON.stringify({ countryIso2: "US", nationalNumber: "2025550123" }),
		);
		expect(fromFormData(minimal, "phone")).toMatchObject({
			countryIso2: "US",
			e164: "+12025550123",
			isValid: true,
		});

		const unknown = new FormData();
		unknown.set(
			"phone",
			JSON.stringify({ countryIso2: "ZZ", nationalNumber: "2025550123" }),
		);
		expect(fromFormData(unknown, "phone")).toBeNull();
	});
});

describe("PhoneFieldUtils facade", () => {
	it("exposes parse and validation helpers", () => {
		expect(PhoneFieldUtils.parse("+12025550123")?.number).toBe("+12025550123");
		expect(PhoneFieldUtils.isValid("+12025550123")).toBe(true);
	});

	it("exposes form-data and country helpers", () => {
		const formData = new FormData();
		formData.set("phone", JSON.stringify(VALID_PHONE_FIELD_VALUE));

		expect(PhoneFieldUtils.fromFormData(formData, "phone")).toEqual(
			VALID_PHONE_FIELD_VALUE,
		);
		expect(PhoneFieldUtils.toFormValue(VALID_PHONE_FIELD_VALUE)).toEqual({
			countryIso2: "US",
			nationalNumber: "(202) 555-0123",
		});
		expect(PhoneFieldUtils.getCountries("en")).toBe(getCountriesMap("en"));
		expect(PhoneFieldUtils.countries).toBe(getDefaultCountriesMap());
	});
});
