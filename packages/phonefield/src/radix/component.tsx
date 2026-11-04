"use client";

import type * as LabelPrimitive from "radix-ui/label";
import type * as Popover from "radix-ui/popover";
import type React from "react";
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
	CountryContent,
	CountryEmpty,
	CountryIcon,
	CountryItem,
	CountryItemIndicator,
	CountryList,
	CountryPortal,
	CountrySearch,
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
	CountryPortal,
	CountryContent,
	CountrySearch,
	CountryEmpty,
	CountryList,
	CountryItem,
	CountryItemIndicator,
};

type AsChild = {
	/** Merge PhoneField's props and behavior into the single child element. */
	asChild?: boolean;
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
		"defaultValue" | "onChange"
	> &
		PhoneFieldRootOptions &
		AsChild;

	/** Props for `PhoneField.Input`. The value is owned by `PhoneField.Root`. */
	export type InputProps = Omit<
		React.ComponentProps<"input">,
		"defaultValue" | "name" | "value" | "placeholder"
	> &
		AsChild & {
			/** A string, or a function of the selected country (see `getExampleNumber`). */
			placeholder?: string | ((country: Country) => string | undefined);
		};

	/** Props for `PhoneField.Country`: Radix Popover root; selection is managed by Root. */
	export type CountryProps = Omit<Popover.PopoverProps, "children"> & {
		/** Compose `Country*` parts. Omit for the default picker. */
		children?: React.ReactNode;
		/** Default copy for CountrySearch and CountryEmpty, e.g. for translations. */
		labels?: CountryLabels;
		/** Prevents opening the picker. */
		disabled?: boolean;
		/** The picker opens, but the selection cannot change. */
		readOnly?: boolean;
	};

	/** Default copy used by the country picker parts. */
	export type CountryLabels = PhoneFieldCountryLabels;

	export type GroupProps = React.ComponentProps<"div"> & AsChild;
	export type LabelProps = Omit<
		React.ComponentProps<typeof LabelPrimitive.Root>,
		"htmlFor"
	>;
	export type DescriptionProps = React.ComponentProps<"p"> & AsChild;
	export type ErrorProps = Omit<React.ComponentProps<"p">, "children"> &
		AsChild & {
			/** Message, or a function of the field state. Defaults to a generic English message. */
			children?: React.ReactNode | ((state: State) => React.ReactNode);
		};

	export type CountryTriggerProps = Popover.PopoverTriggerProps &
		React.RefAttributes<HTMLButtonElement>;
	export type CountryValueProps = {
		/** Content, or a function of the selected country. Defaults to flag and dial code. */
		children?: React.ReactNode | ((country: Country) => React.ReactNode);
	};
	export type CountryIconProps = React.ComponentProps<"span"> & AsChild;
	export type CountryPortalProps = Popover.PopoverPortalProps;
	export type CountryContentProps = Popover.PopoverContentProps &
		React.RefAttributes<HTMLDivElement>;
	export type CountrySearchProps = Omit<
		React.ComponentProps<"input">,
		"value" | "defaultValue"
	> &
		AsChild;
	export type CountryEmptyProps = React.ComponentProps<"div"> & AsChild;
	export type CountryListProps = Omit<
		React.ComponentProps<"div">,
		"children"
	> & {
		/** Renders each country. Defaults to `<PhoneField.CountryItem country={country} />`. */
		children?: (country: Country) => React.ReactNode;
	};
	export type CountryItemProps = React.ComponentProps<"div"> &
		AsChild & {
			country: Country;
			/** Skipped by keyboard navigation and cannot be selected. */
			disabled?: boolean;
		};
	export type CountryItemIndicatorProps = React.ComponentProps<"span"> &
		AsChild;
}
