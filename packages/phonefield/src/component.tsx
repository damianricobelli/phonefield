"use client";

import type { Combobox } from "@base-ui/react/combobox";
import type { Input as BaseInput } from "@base-ui/react/input";
import type { useRender } from "@base-ui/react/use-render";
import type React from "react";
import type { PhoneFieldCountryLabels } from "./context.js";
import {
	Country,
	CountryEmpty,
	CountryIcon,
	CountryItem,
	CountryItemIndicator,
	CountryList,
	CountryPopup,
	CountryPortal,
	CountryPositioner,
	CountrySearch,
	CountryTrigger,
	CountryValue,
} from "./country.js";
import { Description, ErrorMessage, Group, Label } from "./field.js";
import { Input } from "./input.js";
import { Root } from "./root.js";
import type {
	PhoneFieldChangeDetails,
	PhoneFieldChangeReason,
	PhoneFieldCountry,
	PhoneFieldCountryCode,
	PhoneFieldCountryMap,
	PhoneFieldFormValue,
	PhoneFieldInputValue,
	PhoneFieldLang,
	PhoneFieldParseOptions,
	PhoneFieldState,
	PhoneFieldValue,
} from "./types.js";

export const PhoneField = {
	Root,
	Label,
	Group,
	Input,
	Description,
	Error: ErrorMessage,
	Country,
	CountryTrigger,
	CountryValue,
	CountryIcon,
	CountryPortal,
	CountryPositioner,
	CountryPopup,
	CountrySearch,
	CountryEmpty,
	CountryList,
	CountryItem,
	CountryItemIndicator,
};

type ClassName<State> = string | ((state: State) => string | undefined);
type Style<State> =
	| React.CSSProperties
	| ((state: State) => React.CSSProperties | undefined);

export namespace PhoneField {
	/** Country descriptor: iso2, name, dialCode, flag. */
	export type Country = PhoneFieldCountry;
	/** Read-only map of ISO2 to country. */
	export type CountryMap = PhoneFieldCountryMap;
	/** ISO2 country code (e.g. "US", "GB"). */
	export type CountryCode = PhoneFieldCountryCode;
	/** BCP 47 locale for country names and sorting. */
	export type Lang = PhoneFieldLang;
	/** Complete emitted value: countryIso2, countryDialCode, nationalNumber, e164, isValid. */
	export type Value = PhoneFieldValue;
	/** Source fields accepted by `value` and `defaultValue`; derived fields are rebuilt. */
	export type InputValue = PhoneFieldInputValue;
	/** Minimal untrusted payload serialized into forms. */
	export type FormValue = PhoneFieldFormValue;
	/** Options for strict string parsing and opt-in extraction. */
	export type ParseOptions = PhoneFieldParseOptions;
	/** Field state. Every key is mirrored as a `data-*` attribute on Root. */
	export type State = PhoneFieldState;
	/** Why `onValueChange` fired. */
	export type ChangeReason = PhoneFieldChangeReason;
	/** Second argument of `onValueChange`. */
	export type ChangeDetails = PhoneFieldChangeDetails;

	/**
	 * Props for `PhoneField.Root`. Use `value`/`onValueChange` for controlled mode,
	 * or `defaultValue`/`defaultCountry` for uncontrolled. Defaults are only read on mount.
	 */
	export type RootProps = Omit<
		useRender.ComponentProps<"div", State>,
		"className" | "style" | "defaultValue" | "onChange"
	> & {
		value?: InputValue | Value;
		defaultValue?: InputValue | Value;
		onValueChange?: (value: Value, details: ChangeDetails) => void;
		/** Initial country when no value is provided. Defaults to `"US"` or the first available country. */
		defaultCountry?: CountryCode;
		/** Restricts the list and international-paste detection to these countries, in this order. */
		countries?: readonly CountryCode[];
		/** Pinned to the top of the list, in this order. */
		preferredCountries?: readonly CountryCode[];
		/** Locale for country names, sorting, and search. */
		lang?: Lang;
		/** Serializes `{ countryIso2, nationalNumber }` into one FormData entry. */
		name?: string;
		/** Associates the serialized value with a form outside Root. */
		form?: string;
		/** Formats the number as the user types. @default true */
		formatOnType?: boolean;
		/** Blocks digits beyond the longest possible number for the country. @default true */
		limitMaxLength?: boolean;
		disabled?: boolean;
		readOnly?: boolean;
		required?: boolean;
		/**
		 * Marks the field invalid, e.g. for a server or form-library error. Automatic
		 * validation still applies when `false`.
		 */
		invalid?: boolean;
		className?: ClassName<State>;
		style?: Style<State>;
	};

	/** Props for `PhoneField.Input`. The value is owned by `PhoneField.Root`. */
	export type InputProps = Omit<
		BaseInput.Props,
		"defaultValue" | "name" | "onValueChange" | "value" | "placeholder"
	> & {
		/** A string, or a function of the selected country (see `getExampleNumber`). */
		placeholder?: string | ((country: Country) => string | undefined);
	};

	/** Props for `PhoneField.Country`: Base UI Combobox behavior; selection is managed by Root. */
	export type CountryProps = Omit<
		Combobox.Root.Props<Country, false>,
		| "children"
		| "defaultValue"
		| "isItemEqualToValue"
		| "itemToStringLabel"
		| "itemToStringValue"
		| "items"
		| "filteredItems"
		| "multiple"
		| "onValueChange"
		| "value"
	> & {
		/** Compose `Country*` parts. Omit for the default picker. */
		children?: React.ReactNode;
		/** Default copy for CountrySearch and CountryEmpty, e.g. for translations. */
		labels?: CountryLabels;
	};

	/** Default copy used by the country picker parts. */
	export type CountryLabels = PhoneFieldCountryLabels;

	export type GroupProps = Omit<
		useRender.ComponentProps<"div", State>,
		"className" | "style"
	> & { className?: ClassName<State>; style?: Style<State> };
	export type LabelProps = Omit<
		useRender.ComponentProps<"label", State>,
		"className" | "style" | "htmlFor"
	> & { className?: ClassName<State>; style?: Style<State> };
	export type DescriptionProps = Omit<
		useRender.ComponentProps<"p", State>,
		"className" | "style"
	> & { className?: ClassName<State>; style?: Style<State> };
	export type ErrorProps = Omit<
		useRender.ComponentProps<"p", State>,
		"className" | "style" | "children"
	> & {
		className?: ClassName<State>;
		style?: Style<State>;
		/** Message, or a function of the field state. Defaults to a generic English message. */
		children?: React.ReactNode | ((state: State) => React.ReactNode);
	};

	export type CountryTriggerProps = Combobox.Trigger.Props;
	export type CountryValueProps = {
		/** Content, or a function of the selected country. Defaults to flag and dial code. */
		children?: React.ReactNode | ((country: Country) => React.ReactNode);
	};
	export type CountryIconProps = Combobox.Icon.Props;
	export type CountryPortalProps = Combobox.Portal.Props;
	export type CountryPositionerProps = Combobox.Positioner.Props;
	export type CountryPopupProps = Combobox.Popup.Props;
	export type CountrySearchProps = Combobox.Input.Props;
	export type CountryEmptyProps = Combobox.Empty.Props;
	export type CountryListProps = Omit<Combobox.List.Props, "children"> & {
		/** Renders each country. Defaults to `<PhoneField.CountryItem country={country} />`. */
		children?: (country: Country) => React.ReactNode;
	};
	export type CountryItemProps = Omit<Combobox.Item.Props, "value"> & {
		country: Country;
	};
	export type CountryItemIndicatorProps = Combobox.ItemIndicator.Props;
}
