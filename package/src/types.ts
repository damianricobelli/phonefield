import type { CountryCode } from "libphonenumber-js/min";

export type PhoneFieldCountry = {
  iso2: CountryCode;
  name: string;
  dialCode: string;
  flag?: string;
};

export type PhoneFieldCountryMap = ReadonlyMap<CountryCode, PhoneFieldCountry>;
export type PhoneFieldCountryCodeValue = CountryCode;
export type PhoneFieldCountryName = CountryCode;
export type PhoneFieldLang = string | readonly string[];

export type PhoneFieldValue = {
  countryIso2: CountryCode;
  countryDialCode: string;
  nationalNumber: string;
  e164: string | null;
  isValid: boolean;
};
