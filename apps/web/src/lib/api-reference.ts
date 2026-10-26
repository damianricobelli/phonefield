import type { PhoneField, UsePhoneFieldReturnValue } from "phonefield";
import type React from "react";

export type ApiProperty<Name extends string = string> = {
	name: Name;
	type: string;
	defaultValue: string;
	description: string;
};

export type StateAttribute = {
	key: keyof PhoneField.State;
	attribute: `data-${string}`;
	description: string;
};

type FieldPartName = "Label" | "Group" | "Description" | "Error";
type CountryPartName = Exclude<
	keyof typeof PhoneField,
	"Root" | "Input" | "Country" | FieldPartName
>;

export type FieldPart = {
	name: FieldPartName;
	element: string;
	slot: string;
	behavior: string;
};

export type CountryPart = {
	name: CountryPartName;
	wraps: string;
	slot: string;
	defaults: string;
};

type Equal<Left, Right> =
	(<Value>() => Value extends Left ? 1 : 2) extends <
		Value,
	>() => Value extends Right ? 1 : 2
		? true
		: false;
type Assert<Value extends true> = Value;
/** True when every key in `Keys` is documented. */
type Covers<Keys, Documented> = [Exclude<Keys, Documented>] extends [never]
	? true
	: false;

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
		description: "Initial uncontrolled value. Read once on mount.",
	},
	{
		name: "onValueChange",
		type: "(value: PhoneField.Value, details: { reason }) => void",
		defaultValue: "-",
		description:
			'Fires when the country or number changes. reason is "input", "paste", "country", "undo", or "redo".',
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
			"Restricts the list and international-paste detection to these countries, in this order.",
	},
	{
		name: "preferredCountries",
		type: "readonly PhoneField.CountryCode[]",
		defaultValue: "-",
		description:
			"Pinned to the top of the list in a group with data-preferred.",
	},
	{
		name: "lang",
		type: "PhoneField.Lang",
		defaultValue: '"en"',
		description: "Locale for country names, sorting, and search.",
	},
	{
		name: "name",
		type: "string",
		defaultValue: "-",
		description:
			"Serializes { countryIso2, nationalNumber } into one FormData entry.",
	},
	{
		name: "form",
		type: "string",
		defaultValue: "-",
		description: "Associates the serialized value with a form outside Root.",
	},
	{
		name: "formatOnType",
		type: "boolean",
		defaultValue: "true",
		description: "Formats the number as the user types.",
	},
	{
		name: "limitMaxLength",
		type: "boolean",
		defaultValue: "true",
		description:
			"Blocks digits beyond the longest possible number for the selected country.",
	},
	{
		name: "disabled",
		type: "boolean",
		defaultValue: "false",
		description:
			"Disables Input and Country. A disabled field is not submitted.",
	},
	{
		name: "readOnly",
		type: "boolean",
		defaultValue: "false",
		description: "Makes Input and Country read-only.",
	},
	{
		name: "required",
		type: "boolean",
		defaultValue: "false",
		description:
			"Sets required on Input. An empty field becomes invalid once touched or submitted.",
	},
	{
		name: "invalid",
		type: "boolean",
		defaultValue: "false",
		description:
			"Marks the field invalid, e.g. invalid={!!serverError}. Automatic validation still applies when false.",
	},
	{
		name: "className",
		type: "string | (state: PhoneField.State) => string",
		defaultValue: "-",
		description: "Classes for the root element, or a function of field state.",
	},
	{
		name: "style",
		type: "CSSProperties | (state: PhoneField.State) => CSSProperties",
		defaultValue: "-",
		description: "Inline styles, or a function of field state.",
	},
	{
		name: "render",
		type: "ReactElement | (props, state) => ReactElement",
		defaultValue: "<div />",
		description: "Replaces the root element, e.g. render={<fieldset />}.",
	},
	{
		name: "...divProps",
		type: 'React.ComponentProps<"div">',
		defaultValue: "-",
		description: "Children, ref, events, and ARIA attributes.",
	},
] satisfies readonly ApiProperty<keyof PhoneField.RootProps | "...divProps">[];
export type RootDocumentationIsComplete = Assert<
	Covers<
		Exclude<keyof PhoneField.RootProps, keyof React.ComponentProps<"div">>,
		(typeof rootProperties)[number]["name"]
	>
>;

export const rootStateAttributes = [
	{
		key: "country",
		attribute: "data-country",
		description: 'Selected ISO2 code, e.g. data-country="US".',
	},
	{
		key: "valid",
		attribute: "data-valid",
		description: "The number is complete and valid for the selected country.",
	},
	{
		key: "invalid",
		attribute: "data-invalid",
		description:
			"Touched and the number is incomplete or invalid, or required and empty. Also set by the invalid prop.",
	},
	{
		key: "filled",
		attribute: "data-filled",
		description: "The number contains at least one digit.",
	},
	{
		key: "dirty",
		attribute: "data-dirty",
		description: "The value differs from the value at mount.",
	},
	{
		key: "touched",
		attribute: "data-touched",
		description:
			"Focus has left the field once, or its form was submitted. Cleared by form reset.",
	},
	{
		key: "focused",
		attribute: "data-focused",
		description: "Focus is inside the field, including the country popup.",
	},
	{
		key: "disabled",
		attribute: "data-disabled",
		description: "The disabled prop is set.",
	},
	{
		key: "readOnly",
		attribute: "data-readonly",
		description: "The readOnly prop is set.",
	},
	{
		key: "required",
		attribute: "data-required",
		description: "The required prop is set.",
	},
] as const satisfies readonly StateAttribute[];
export type StateDocumentationIsComplete = Assert<
	Equal<(typeof rootStateAttributes)[number]["key"], keyof PhoneField.State>
>;

export const inputProperties = [
	{
		name: "placeholder",
		type: "string | (country: PhoneField.Country) => string | undefined",
		defaultValue: "-",
		description:
			"A string, or a function of the selected country. Pair with getExampleNumber.",
	},
	{
		name: "type",
		type: "React.HTMLInputTypeAttribute",
		defaultValue: '"tel"',
		description: "Telephone input type.",
	},
	{
		name: "inputMode",
		type: 'React.HTMLAttributes<HTMLInputElement>["inputMode"]',
		defaultValue: '"tel"',
		description: "Requests a telephone keypad on touch devices.",
	},
	{
		name: "autoComplete",
		type: "string",
		defaultValue: '"tel-national"',
		description: "National-number autofill.",
	},
	{
		name: "aria-invalid",
		type: "boolean",
		defaultValue: "state.invalid",
		description: "Set automatically from Root state. Pass a value to override.",
	},
	{
		name: "disabled",
		type: "boolean",
		defaultValue: "Root",
		description: "Inherited from Root; pass a value to override.",
	},
	{
		name: "readOnly",
		type: "boolean",
		defaultValue: "Root",
		description: "Inherited from Root; pass a value to override.",
	},
	{
		name: "required",
		type: "boolean",
		defaultValue: "Root",
		description: "Inherited from Root; pass a value to override.",
	},
	{
		name: "className",
		type: "string | (state) => string",
		defaultValue: "-",
		description:
			"Classes for the input. The function receives Base UI Input state.",
	},
	{
		name: "render",
		type: "ReactElement | (props, state) => ReactElement",
		defaultValue: "<input />",
		description: "Render your design system's input element.",
	},
	{
		name: "...inputProps",
		type: "Input.Props",
		defaultValue: "-",
		description:
			"Base UI Input props, ref, events, and ARIA, except value, defaultValue, name, and onValueChange.",
	},
] satisfies readonly ApiProperty<
	keyof PhoneField.InputProps | "...inputProps"
>[];

export const countryProperties = [
	{
		name: "children",
		type: "React.ReactNode",
		defaultValue: "default anatomy",
		description:
			"Compose Country* parts. Omit for a complete, unstyled picker.",
	},
	{
		name: "open",
		type: "boolean",
		defaultValue: "-",
		description: "Controlled popup open state.",
	},
	{
		name: "defaultOpen",
		type: "boolean",
		defaultValue: "false",
		description: "Initial popup open state.",
	},
	{
		name: "onOpenChange",
		type: "(open: boolean, details) => void",
		defaultValue: "-",
		description: "Fires when the popup opens or closes.",
	},
	{
		name: "modal",
		type: "boolean",
		defaultValue: "false",
		description:
			"Locks page scroll and outside pointer interactions while open.",
	},
	{
		name: "autoHighlight",
		type: "boolean",
		defaultValue: "true",
		description: "Highlights the first match while searching.",
	},
	{
		name: "disabled",
		type: "boolean",
		defaultValue: "Root",
		description: "Disables only the picker. Root disabled always applies.",
	},
	{
		name: "labels",
		type: "{ search?: string; empty?: ReactNode }",
		defaultValue: "English copy",
		description:
			"Default text for CountrySearch and CountryEmpty, in the zero-config picker or composed parts. Props on the parts win.",
	},
	{
		name: "...comboboxProps",
		type: "Combobox.Root.Props",
		defaultValue: "-",
		description:
			"Other Combobox.Root props. Value, items, and filtering are owned by Root.",
	},
] satisfies readonly ApiProperty<
	keyof PhoneField.CountryProps | "...comboboxProps"
>[];

export const countryParts = [
	{
		name: "CountryTrigger",
		wraps: "Combobox.Trigger",
		slot: "phone-field-country-trigger",
		defaults:
			'Children: CountryValue + CountryIcon. aria-label "United States (+1)" unless you pass aria-label, aria-labelledby, or id.',
	},
	{
		name: "CountryValue",
		wraps: "Combobox.Value",
		slot: "- (text only)",
		defaults:
			'Children: node or (country) => node. Default "🇺🇸 +1". Renders no element.',
	},
	{
		name: "CountryIcon",
		wraps: "Combobox.Icon",
		slot: "phone-field-country-icon",
		defaults: "Children: up/down chevron.",
	},
	{
		name: "CountryPortal",
		wraps: "Combobox.Portal",
		slot: "-",
		defaults: "Portals to document.body. Pass container to change.",
	},
	{
		name: "CountryPositioner",
		wraps: "Combobox.Positioner",
		slot: "phone-field-country-positioner",
		defaults: 'side="bottom" align="start" sideOffset={4}.',
	},
	{
		name: "CountryPopup",
		wraps: "Combobox.Popup",
		slot: "phone-field-country-popup",
		defaults: "Popup container.",
	},
	{
		name: "CountrySearch",
		wraps: "Combobox.Input",
		slot: "phone-field-country-search",
		defaults:
			'placeholder and aria-label: labels.search or "Search country". Matches name, ISO2, and dial code.',
	},
	{
		name: "CountryEmpty",
		wraps: "Combobox.Empty",
		slot: "phone-field-country-empty",
		defaults: 'Children: labels.empty or "No countries found".',
	},
	{
		name: "CountryList",
		wraps: "Combobox.List",
		slot: "phone-field-country-list",
		defaults:
			"Children: (country) => node; keys are handled. Default renders CountryItem.",
	},
	{
		name: "CountryItem",
		wraps: "Combobox.Item",
		slot: "phone-field-country-item",
		defaults:
			'Requires country. Children: "🇺🇸 United States (+1)". Adds data-country.',
	},
	{
		name: "CountryItemIndicator",
		wraps: "Combobox.ItemIndicator",
		slot: "phone-field-country-item-indicator",
		defaults: "Renders only when selected. Children: check mark.",
	},
] as const satisfies readonly CountryPart[];
export type CountryPartsDocumentationIsComplete = Assert<
	Equal<(typeof countryParts)[number]["name"], CountryPartName>
>;

export const fieldParts = [
	{
		name: "Label",
		element: "<label>",
		slot: "phone-field-label",
		behavior:
			"htmlFor follows the Input id automatically, including a custom id.",
	},
	{
		name: "Group",
		element: '<div role="group">',
		slot: "phone-field-group",
		behavior:
			"Visual shell for Country and Input. Mirrors Root's state attributes.",
	},
	{
		name: "Description",
		element: "<p>",
		slot: "phone-field-description",
		behavior: "Help text, linked to the Input with aria-describedby.",
	},
	{
		name: "Error",
		element: "<p>",
		slot: "phone-field-error",
		behavior:
			'Renders only while invalid; linked with aria-describedby. Children: node or (state) => node. Default: "Enter a valid phone number." or "Enter a phone number."',
	},
] as const satisfies readonly FieldPart[];
export type FieldPartsDocumentationIsComplete = Assert<
	Equal<(typeof fieldParts)[number]["name"], FieldPartName>
>;
/** Field parts and Country parts together cover every PhoneField part. */
export type PartsDocumentationIsComplete = Assert<
	Equal<
		FieldPartName | CountryPartName | "Root" | "Input" | "Country",
		keyof typeof PhoneField
	>
>;

export const hookProperties = [
	{
		name: "value",
		type: "PhoneField.Value",
		defaultValue: "-",
		description: "The current canonical value.",
	},
	{
		name: "state",
		type: "PhoneField.State",
		defaultValue: "-",
		description: "Field state: the same keys Root mirrors as data attributes.",
	},
	{
		name: "country",
		type: "PhoneField.Country",
		defaultValue: "-",
		description: "The selected country.",
	},
	{
		name: "countries",
		type: "readonly PhoneField.Country[]",
		defaultValue: "-",
		description: "Available countries, already localized and sorted.",
	},
	{
		name: "setCountry",
		type: "(iso2: string) => void",
		defaultValue: "-",
		description:
			"Selects a country by ISO2 code. Unknown or unavailable codes are ignored.",
	},
	{
		name: "setNumber",
		type: "(number: string) => void",
		defaultValue: "-",
		description:
			"Replaces the number as if typed. A + prefix selects the detected country.",
	},
] satisfies readonly ApiProperty<keyof UsePhoneFieldReturnValue>[];
export type HookDocumentationIsComplete = Assert<
	Equal<(typeof hookProperties)[number]["name"], keyof UsePhoneFieldReturnValue>
>;

type UtilityExport = keyof typeof import("phonefield/utils");

export const utilityProperties = [
	{
		key: "parse",
		name: "parse(value, options?)",
		type: "(string | Value, ParseOptions?) => PhoneNumber | undefined",
		defaultValue: "-",
		description:
			"Parse a strict string or Value into libphonenumber's PhoneNumber.",
	},
	{
		key: "isValid",
		name: "isValid(value, options?)",
		type: "(string | Value, ParseOptions?) => boolean",
		defaultValue: "-",
		description:
			"Validate a strict string, or a Value against its selected country.",
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
		name: "getCountries(lang?)",
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
	{
		key: "getExampleNumber",
		name: "getExampleNumber(iso2, format?)",
		type: '(CountryCode, "national" | "international"?) => string | undefined',
		defaultValue: '"national"',
		description:
			"Example mobile number for a country. Use it as a placeholder.",
	},
] satisfies readonly (ApiProperty & { key: UtilityExport })[];
export type UtilityDocumentationIsComplete = Assert<
	Equal<(typeof utilityProperties)[number]["key"], UtilityExport>
>;
