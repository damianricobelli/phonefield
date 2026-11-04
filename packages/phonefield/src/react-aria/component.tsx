"use client";

import type React from "react";
import type { ButtonProps } from "react-aria-components/Button";
import type {
	GroupProps as AriaGroupProps,
	GroupRenderProps,
} from "react-aria-components/Group";
import type { InputProps as AriaInputProps } from "react-aria-components/Input";
import type { LabelProps as AriaLabelProps } from "react-aria-components/Label";
import type {
	ListBoxItemProps,
	ListBoxProps,
} from "react-aria-components/ListBox";
import type { PopoverProps } from "react-aria-components/Popover";
import type { SearchFieldProps } from "react-aria-components/SearchField";
import type {
	SelectProps,
	SelectValueProps,
} from "react-aria-components/Select";
import type { SelectionIndicatorProps } from "react-aria-components/SelectionIndicator";
import type { PhoneFieldCountryLabels } from "../core/context.js";
import type { PhoneFieldRootOptions } from "../core/root.js";
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
} from "../types.js";
import {
	Country,
	CountryEmpty,
	CountryIcon,
	CountryItem,
	CountryItemIndicator,
	CountryList,
	CountryPopover,
	CountrySearch,
	CountrySearchInput,
	CountryTrigger,
	CountryValue,
} from "./country.js";
import { Description, ErrorMessage, Group, Label } from "./field.js";
import { Input } from "./input.js";
import { Root } from "./root.js";

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
	CountryPopover,
	CountrySearch,
	CountrySearchInput,
	CountryEmpty,
	CountryList,
	CountryItem,
	CountryItemIndicator,
};

type ClassName<State> = string | ((state: State) => string | undefined);
type Style<State> =
	| React.CSSProperties
	| ((state: State) => React.CSSProperties | undefined);

/** React Aria render props: `className` and `style` may be functions of state. */
type StateRenderProps<State> = {
	className?: ClassName<State>;
	style?: Style<State>;
};

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
		React.ComponentProps<"div">,
		"className" | "style" | "children" | "defaultValue" | "onChange"
	> &
		PhoneFieldRootOptions &
		StateRenderProps<State> & {
			/** Renders a custom element. Pass through `props`, including `ref`. */
			render?: (
				props: React.ComponentProps<"div">,
				state: State,
			) => React.ReactElement;
			children?: React.ReactNode | ((state: State) => React.ReactNode);
		};

	/** Props for `PhoneField.Input`: React Aria's Input. The value is owned by `PhoneField.Root`. */
	export type InputProps = Omit<
		AriaInputProps,
		"defaultValue" | "name" | "value" | "placeholder"
	> &
		React.RefAttributes<HTMLInputElement> & {
			/** A string, or a function of the selected country (see `getExampleNumber`). */
			placeholder?: string | ((country: Country) => string | undefined);
		};

	/** Props for `PhoneField.Country`: React Aria Select; selection is managed by Root. */
	export type CountryProps = Omit<
		SelectProps<Country>,
		| "children"
		| "value"
		| "defaultValue"
		| "onChange"
		| "selectedKey"
		| "defaultSelectedKey"
		| "onSelectionChange"
		| "selectionMode"
		| "items"
		| "name"
		| "form"
	> & {
		/** Compose `Country*` parts. Omit for the default picker. */
		children?: React.ReactNode;
		/** Default copy for CountrySearch and CountryEmpty, e.g. for translations. */
		labels?: CountryLabels;
	};

	/** Default copy used by the country picker parts. */
	export type CountryLabels = PhoneFieldCountryLabels;

	/** Render props of `PhoneField.Group`: React Aria's group state plus the field state. */
	export type GroupRenderProps = AriaGroupRenderProps & State;
	export type GroupProps = Omit<
		AriaGroupProps,
		| "className"
		| "style"
		| "children"
		| "isDisabled"
		| "isInvalid"
		| "isReadOnly"
	> & {
		className?: ClassName<GroupRenderProps>;
		style?: Style<GroupRenderProps>;
		children?: React.ReactNode | ((state: GroupRenderProps) => React.ReactNode);
	};
	export type LabelProps = Omit<
		AriaLabelProps,
		"className" | "style" | "htmlFor"
	> &
		StateRenderProps<State>;
	export type DescriptionProps = Omit<
		React.ComponentProps<"p">,
		"className" | "style"
	> &
		StateRenderProps<State>;
	export type ErrorProps = Omit<
		React.ComponentProps<"p">,
		"className" | "style" | "children"
	> &
		StateRenderProps<State> & {
			/** Message, or a function of the field state. Defaults to a generic English message. */
			children?: React.ReactNode | ((state: State) => React.ReactNode);
		};

	export type CountryTriggerProps = ButtonProps &
		React.RefAttributes<HTMLButtonElement>;
	export type CountryValueProps = Omit<
		SelectValueProps<Country>,
		"children"
	> & {
		/** Content, or a function of the selected country. Defaults to flag and dial code. */
		children?: React.ReactNode | ((country: Country) => React.ReactNode);
	};
	export type CountryIconProps = React.ComponentProps<"span">;
	export type CountryPopoverProps = PopoverProps &
		React.RefAttributes<HTMLElement>;
	export type CountrySearchProps = SearchFieldProps;
	export type CountrySearchInputProps = AriaInputProps &
		React.RefAttributes<HTMLInputElement>;
	export type CountryEmptyProps = React.ComponentProps<"div">;
	export type CountryListProps = Omit<
		ListBoxProps<Country>,
		"children" | "items" | "selectionMode"
	> & {
		/** Renders each country. Defaults to `<PhoneField.CountryItem country={country} />`. */
		children?: (country: Country) => React.ReactNode;
	};
	export type CountryItemProps = Omit<
		ListBoxItemProps<Country>,
		"id" | "value"
	> & {
		country: Country;
	};
	export type CountryItemIndicatorProps = SelectionIndicatorProps;
}

type AriaGroupRenderProps = GroupRenderProps;
