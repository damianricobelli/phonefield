import type * as API from "../src/index.js";

export type SupportedNamespaceType = API.PhoneField.CountryCode;

// @ts-expect-error Standalone aliases are not part of the canonical public interface.
export type RemovedStandaloneType = API.PhoneFieldCountryCode;

// @ts-expect-error Root owns form serialization; Input must not publish a name prop.
const _inputWithName: API.PhoneField.InputProps = { name: "phone" };

const _inputWithValueChange: API.PhoneField.InputProps = {
	// @ts-expect-error Root owns domain value changes; Input exposes native events only.
	onValueChange: () => undefined,
};

const _triggerWithClassName: API.PhoneField.CountrySlotProps["trigger"] = {
	// @ts-expect-error classNames is the only styling seam for Country parts.
	className: "trigger",
};

const _positionerWithSide: API.PhoneField.CountrySlotProps["positioner"] = {
	// @ts-expect-error positioning is the only geometry seam for the popup.
	side: "top",
};

// @ts-expect-error Deprecated standalone alias must not be published.
export type RemovedCountryCodeValue = API.PhoneFieldCountryCodeValue;
// @ts-expect-error Deprecated standalone alias must not be published.
export type RemovedCountryName = API.PhoneFieldCountryName;

// @ts-expect-error Deprecated namespace alias must not be published.
export type RemovedNSCode = API.PhoneField.CountryCodeValue;
// @ts-expect-error Deprecated namespace alias must not be published.
export type RemovedNSName = API.PhoneField.CountryName;
