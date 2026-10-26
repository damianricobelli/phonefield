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

const _countryWithClassNames: API.PhoneField.CountryProps = {
	// @ts-expect-error v2 styles each Country part directly; the classNames map is gone.
	classNames: { trigger: "trigger" },
};

const _countryWithSlotProps: API.PhoneField.CountryProps = {
	// @ts-expect-error v2 composes Country parts; slotProps is gone.
	slotProps: {},
};

const _countryWithItems: API.PhoneField.CountryProps = {
	// @ts-expect-error Root owns the country list.
	items: [],
};

const _countryWithBehavior: API.PhoneField.CountryProps = {
	autoHighlight: false,
	modal: true,
	onOpenChange: (_open: boolean) => undefined,
};

const _rootWithStateClassName: API.PhoneField.RootProps = {
	className: (state) => (state.invalid ? "invalid" : undefined),
	onValueChange: (value, details) => {
		const _e164: string | null = value.e164;
		const _reason: "input" | "paste" | "country" | "undo" | "redo" =
			details.reason;
	},
};

const _placeholderFromCountry: API.PhoneField.InputProps = {
	placeholder: (country) => country.dialCode,
};

const _itemNeedsCountry: API.PhoneField.CountryItemProps = {
	// @ts-expect-error CountryItem selects by country, not by an arbitrary value.
	value: "US",
};

const _errorFromState: API.PhoneField.ErrorProps = {
	children: (state) => (state.filled ? "Invalid" : "Required"),
};

const _labelNoHtmlFor: API.PhoneField.LabelProps = {
	// @ts-expect-error Label follows the input id; htmlFor is managed.
	htmlFor: "phone",
};

const _countryLabels: API.PhoneField.CountryProps = {
	labels: { search: "Buscar país", empty: "Sin resultados" },
};

export type HookResult = ReturnType<typeof API.usePhoneField>["state"]["valid"];

// @ts-expect-error Deprecated standalone alias must not be published.
export type RemovedCountryCodeValue = API.PhoneFieldCountryCodeValue;
// @ts-expect-error Deprecated standalone alias must not be published.
export type RemovedCountryName = API.PhoneFieldCountryName;

// @ts-expect-error Deprecated namespace alias must not be published.
export type RemovedNSCode = API.PhoneField.CountryCodeValue;
// @ts-expect-error Deprecated namespace alias must not be published.
export type RemovedNSName = API.PhoneField.CountryName;
