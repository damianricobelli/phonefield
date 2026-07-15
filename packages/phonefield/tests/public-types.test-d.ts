import type * as API from "../src/index.js";

export type SupportedStandaloneType = API.PhoneFieldCountryCode;
export type SupportedNamespaceType = API.PhoneField.CountryCode;

// @ts-expect-error Deprecated standalone alias must not be published.
export type RemovedCountryCodeValue = API.PhoneFieldCountryCodeValue;
// @ts-expect-error Deprecated standalone alias must not be published.
export type RemovedCountryName = API.PhoneFieldCountryName;

// @ts-expect-error Deprecated namespace alias must not be published.
export type RemovedNSCode = API.PhoneField.CountryCodeValue;
// @ts-expect-error Deprecated namespace alias must not be published.
export type RemovedNSName = API.PhoneField.CountryName;
