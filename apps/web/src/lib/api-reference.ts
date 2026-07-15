import type { PhoneField } from "phonefield";

export type ApiProperty<Name extends string = string> = {
	name: Name;
	type: string;
	defaultValue: string;
	description: string;
};

type Equal<Left, Right> =
	(<Value>() => Value extends Left ? 1 : 2) extends <
		Value,
	>() => Value extends Right ? 1 : 2
		? true
		: false;
type Assert<Value extends true> = Value;

export const rootProperties = [
	{
		name: "value",
		type: "PhoneField.InputValue | PhoneField.Value",
		defaultValue: "-",
		description: "Controlled source fields. Derived fields are rebuilt.",
	},
	{
		name: "defaultValue",
		type: "PhoneField.InputValue | PhoneField.Value",
		defaultValue: "-",
		description:
			"Initial uncontrolled source fields; later changes are ignored.",
	},
	{
		name: "onValueChange",
		type: "(value: PhoneField.Value) => void",
		defaultValue: "-",
		description:
			"The only domain callback; fires when country or number changes.",
	},
	{
		name: "defaultCountry",
		type: "PhoneField.CountryCode",
		defaultValue: '"US" or first available',
		description: "Initial country when no value is provided.",
	},
	{
		name: "countries",
		type: "readonly PhoneField.CountryCode[]",
		defaultValue: "all",
		description:
			"Restricts the country list and international-paste auto-selection to a subset.",
	},
	{
		name: "lang",
		type: "PhoneField.Lang",
		defaultValue: '"en"',
		description: "Locale used for country labels and sorting.",
	},
	{
		name: "name",
		type: "string",
		defaultValue: "-",
		description:
			"Serializes countryIso2 and nationalNumber into one FormData entry.",
	},
	{
		name: "formatOnType",
		type: "boolean",
		defaultValue: "true",
		description: "Formats as the user types for the selected country.",
	},
	{
		name: "...divProps",
		type: 'React.ComponentPropsWithoutRef<"div">',
		defaultValue: "-",
		description: "Children, className, events, ref, and ARIA attributes.",
	},
] satisfies readonly ApiProperty<keyof PhoneField.RootProps | "...divProps">[];

export const countryProperties = [
	{
		name: "placeholder",
		type: "React.ReactNode",
		defaultValue: '"Select country"',
		description: "Trigger placeholder when no country is selected.",
	},
	{
		name: "noResultsText",
		type: "React.ReactNode",
		defaultValue: '"No countries found"',
		description: "Message displayed when search has no matches.",
	},
	{
		name: "inputPlaceholder",
		type: "string",
		defaultValue: '"Search country"',
		description: "Placeholder and fallback accessible name for search.",
	},
	{
		name: "icon",
		type: "React.ReactNode",
		defaultValue: "ChevronUpDown",
		description: "Replaces the trigger icon.",
	},
	{
		name: "classNames",
		type: "PhoneField.CountryClassNames",
		defaultValue: "-",
		description:
			"Recommended for Tailwind and per-instance classes. Use data-slot for global CSS.",
	},
	{
		name: "positioning",
		type: "PhoneField.CountryPositioning",
		defaultValue: "bottom / start / 4px",
		description: "The only popup geometry and collision seam.",
	},
	{
		name: "renderCountryItem",
		type: "(country) => React.ReactNode",
		defaultValue: "-",
		description: "Custom country row content.",
	},
	{
		name: "renderCountryValue",
		type: "(country) => React.ReactNode",
		defaultValue: "-",
		description: "Custom selected-country content.",
	},
	{
		name: "slotProps",
		type: "PhoneField.CountrySlotProps",
		defaultValue: "-",
		description:
			"Advanced behavioral and ARIA props. Styling and positioning are intentionally omitted.",
	},
] satisfies readonly ApiProperty<keyof PhoneField.CountryProps>[];
export type CountryDocumentationIsComplete = Assert<
	Equal<
		(typeof countryProperties)[number]["name"],
		keyof PhoneField.CountryProps
	>
>;

export const inputProperties = [
	{
		name: "type",
		type: "React.HTMLInputTypeAttribute",
		defaultValue: '"tel"',
		description: "Telephone-friendly input type; consumers may override it.",
	},
	{
		name: "inputMode",
		type: 'React.HTMLAttributes<HTMLInputElement>["inputMode"]',
		defaultValue: '"tel"',
		description: "Requests a telephone-friendly virtual keyboard.",
	},
	{
		name: "autoComplete",
		type: "string",
		defaultValue: '"tel-national"',
		description: "Uses national-number autocomplete semantics.",
	},
	{
		name: "className",
		type: 'BaseInput.Props["className"]',
		defaultValue: "-",
		description: "Styles the underlying input.",
	},
	{
		name: "...inputProps",
		type: "BaseInput.Props",
		defaultValue: "-",
		description:
			"Native events and ARIA props, excluding value, defaultValue, name, and onValueChange.",
	},
] satisfies readonly ApiProperty<
	keyof PhoneField.InputProps | "...inputProps"
>[];

export const utilityProperties = [
	{
		key: "parse",
		name: "parse(value, options?)",
		type: "(string | Value, ParseOptions?) => PhoneNumber | undefined",
		defaultValue: "-",
		description:
			"Parse a strict string or Value into libphonenumber PhoneNumber.",
	},
	{
		key: "isValid",
		name: "isValid(value, options?)",
		type: "(string | Value, ParseOptions?) => boolean",
		defaultValue: "-",
		description: "Validate a strict string or Value.",
	},
	{
		key: "buildValue",
		name: "buildValue(country, number, format)",
		type: "(Country, string, boolean) => Value",
		defaultValue: "-",
		description:
			"Build a canonical Value from country metadata and a national number.",
	},
	{
		key: "fromFormData",
		name: "fromFormData(formData, name)",
		type: "(FormData, string) => Value | null",
		defaultValue: "-",
		description:
			"Validate submitted source fields and rebuild a canonical Value.",
	},
	{
		key: "toFormValue",
		name: "toFormValue(value)",
		type: "(Value) => FormValue",
		defaultValue: "-",
		description: "Return countryIso2 and nationalNumber for serialization.",
	},
	{
		key: "getCountries",
		name: "getCountries(locale?)",
		type: "(Lang?) => CountryMap",
		defaultValue: "-",
		description: "Return localized, runtime-immutable country metadata.",
	},
	{
		key: "countries",
		name: "countries",
		type: "PhoneField.CountryMap",
		defaultValue: "English map",
		description: "Default country metadata without locale lookup.",
	},
] satisfies readonly (ApiProperty<
	| keyof typeof import("phonefield/utils")
	| "buildValue(country, number, format)"
	| "fromFormData(formData, name)"
	| "getCountries(locale?)"
	| "isValid(value, options?)"
	| "parse(value, options?)"
	| "toFormValue(value)"
> & { key: keyof typeof import("phonefield/utils") })[];
export type UtilityDocumentationIsComplete = Assert<
	Equal<
		(typeof utilityProperties)[number]["key"],
		keyof typeof import("phonefield/utils")
	>
>;
