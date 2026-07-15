"use client";

import type { Combobox } from "@base-ui/react/combobox";
import type { Input as BaseInput } from "@base-ui/react/input";
import React from "react";
import {
	PhoneFieldCountryContext,
	type PhoneFieldCountryContextValue,
	PhoneFieldInputContext,
	type PhoneFieldInputContextValue,
} from "./context.js";
import { Country } from "./country.js";
import {
	type PhoneFieldEditKind,
	PhoneFieldHistory,
	type PhoneFieldInputSelection,
	toInputValue,
} from "./history.js";
import { Input } from "./input.js";
import type {
	PhoneFieldCountry,
	PhoneFieldCountryCode,
	PhoneFieldCountryMap,
	PhoneFieldFormValue,
	PhoneFieldInputValue,
	PhoneFieldLang,
	PhoneFieldParseOptions,
	PhoneFieldValue,
} from "./types.js";
import {
	buildValue,
	getCountriesMap,
	parseInternationalInput,
	resolveCountry,
	toAvailableCountries,
	toFormValue,
} from "./utils.js";

declare const process: { env: { NODE_ENV?: string } } | undefined;

function isProductionEnvironment() {
	return (
		typeof process !== "undefined" && process.env.NODE_ENV === "production"
	);
}

function useControlledModeWarning(isControlled: boolean) {
	const initialIsControlled = React.useRef(isControlled);
	const didWarn = React.useRef(false);

	React.useEffect(() => {
		if (
			isProductionEnvironment() ||
			didWarn.current ||
			initialIsControlled.current === isControlled
		) {
			return;
		}

		didWarn.current = true;
		console.error(
			"PhoneField.Root cannot switch between controlled and uncontrolled usage. " +
				"Choose value/onValueChange or defaultValue/defaultCountry for the component's lifetime.",
		);
	}, [isControlled]);
}

/**
 * Root container for the phone field. Provides context to Country and Input.
 * Supports controlled and uncontrolled usage, optional FormData serialization via `name`, and country subset.
 */
const Root = React.forwardRef<HTMLDivElement, PhoneField.RootProps>(
	function Root(
		{
			value,
			defaultValue,
			onValueChange,
			defaultCountry,
			countries,
			lang,
			name,
			formatOnType = true,
			children,
			className,
			...props
		},
		ref,
	) {
		const countriesMap = React.useMemo(() => getCountriesMap(lang), [lang]);
		const availableCountries = React.useMemo(
			() => toAvailableCountries(countriesMap, countries),
			[countriesMap, countries],
		);

		const [internalValue, setInternalValue] =
			React.useState<PhoneField.InputValue>(
				() =>
					defaultValue ??
					buildValue(
						resolveCountry(availableCountries, defaultCountry),
						"",
						formatOnType,
					),
			);

		const currentValue = value ?? internalValue;
		const selectedCountry = React.useMemo(
			() => resolveCountry(availableCountries, currentValue.countryIso2),
			[availableCountries, currentValue.countryIso2],
		);
		const normalizedValue = React.useMemo(
			() =>
				buildValue(selectedCountry, currentValue.nationalNumber, formatOnType),
			[currentValue.nationalNumber, formatOnType, selectedCountry],
		);
		const isControlled = value !== undefined;
		useControlledModeWarning(isControlled);
		const currentValueRef = React.useRef(normalizedValue);
		const historyRef = React.useRef(
			new PhoneFieldHistory(toInputValue(normalizedValue)),
		);
		const selectionRef = React.useRef<PhoneFieldInputSelection>({
			start: normalizedValue.nationalNumber.length,
			end: normalizedValue.nationalNumber.length,
		});
		// Country's context stays stable while typing, so its callback reads the
		// latest value through a ref synchronized after every committed render.
		React.useEffect(() => {
			currentValueRef.current = normalizedValue;
		}, [normalizedValue]);

		const applyValue = React.useCallback(
			(nextValue: PhoneField.Value) => {
				if (!isControlled) {
					setInternalValue(nextValue);
					currentValueRef.current = nextValue;
				}
				onValueChange?.(nextValue);
				return nextValue;
			},
			[isControlled, onValueChange],
		);

		const commitValue = React.useCallback(
			(
				nextCountry: PhoneField.Country,
				nextNumber: string,
				editKind: PhoneFieldEditKind,
			) => {
				const currentValue = currentValueRef.current;
				const currentInputValue = toInputValue(currentValue);
				const nextValue = buildValue(nextCountry, nextNumber, formatOnType);
				historyRef.current.record(
					currentInputValue,
					toInputValue(nextValue),
					selectionRef.current,
					editKind,
				);
				return applyValue(nextValue);
			},
			[applyValue, formatOnType],
		);

		const setCountry = React.useCallback(
			(country: PhoneField.Country) =>
				commitValue(country, currentValueRef.current.nationalNumber, "country"),
			[commitValue],
		);
		const setNumber = React.useCallback(
			(number: string, editKind: PhoneFieldEditKind = "unknown") => {
				const internationalCountry = parseInternationalInput(number)?.country;
				const nextCountry = internationalCountry
					? (availableCountries.find(
							(country) => country.iso2 === internationalCountry,
						) ?? selectedCountry)
					: selectedCountry;
				const nextValue = commitValue(nextCountry, number, editKind);
				// Keep back-to-back uncontrolled events synchronous. Controlled values
				// are synchronized only after the parent accepts the update.
				if (!isControlled) currentValueRef.current = nextValue;
			},
			[availableCountries, commitValue, isControlled, selectedCountry],
		);
		const rememberSelection = React.useCallback(
			(selection: PhoneFieldInputSelection) => {
				selectionRef.current = selection;
			},
			[],
		);
		const breakHistoryGroup = React.useCallback(() => {
			historyRef.current.breakGroup();
		}, []);
		const restoreHistory = React.useCallback(
			(direction: "undo" | "redo") => {
				const currentValue = currentValueRef.current;
				const currentInputValue = toInputValue(currentValue);
				const target = historyRef.current[direction](
					currentInputValue,
					selectionRef.current,
				);
				if (!target) return undefined;

				const targetCountry = resolveCountry(
					availableCountries,
					target.value.countryIso2,
				);
				const nextValue = buildValue(
					targetCountry,
					target.value.nationalNumber,
					formatOnType,
				);
				selectionRef.current = target.selection;
				applyValue(nextValue);
				return target;
			},
			[applyValue, availableCountries, formatOnType],
		);
		const undo = React.useCallback(
			() => restoreHistory("undo"),
			[restoreHistory],
		);
		const redo = React.useCallback(
			() => restoreHistory("redo"),
			[restoreHistory],
		);

		const countryContextValue = React.useMemo<PhoneFieldCountryContextValue>(
			() => ({
				selectedCountry,
				availableCountries,
				setCountry,
			}),
			[availableCountries, selectedCountry, setCountry],
		);
		const inputContextValue = React.useMemo<PhoneFieldInputContextValue>(
			() => ({
				value: normalizedValue,
				setNumber,
				rememberSelection,
				breakHistoryGroup,
				undo,
				redo,
			}),
			[
				breakHistoryGroup,
				normalizedValue,
				redo,
				rememberSelection,
				setNumber,
				undo,
			],
		);

		return (
			<PhoneFieldCountryContext.Provider value={countryContextValue}>
				<PhoneFieldInputContext.Provider value={inputContextValue}>
					<div
						{...props}
						ref={ref}
						className={className}
						data-slot="phone-field"
					>
						{children}
						{name ? (
							<input
								type="hidden"
								name={name}
								value={JSON.stringify(toFormValue(normalizedValue))}
								data-slot="phone-field-hidden-input"
							/>
						) : null}
					</div>
				</PhoneFieldInputContext.Provider>
			</PhoneFieldCountryContext.Provider>
		);
	},
);

export const PhoneField = {
	Root,
	Country,
	Input,
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

	/** Renders a single country in the dropdown list. */
	export type RenderCountryItem = (country: Country) => React.ReactNode;
	/** Renders the selected country in the trigger. */
	export type RenderCountryValue = (country: Country) => React.ReactNode;

	/**
	 * Styling API for `PhoneField.Country` parts.
	 * `PhoneField.Country` is unstyled by default. This is the recommended seam
	 * for class utilities and per-instance styles. Stable `data-slot` attributes
	 * are also available for global CSS.
	 */
	export type CountryClassNames = {
		trigger?: Combobox.Trigger.Props["className"];
		icon?: Combobox.Icon.Props["className"];
		popup?: Combobox.Popup.Props["className"];
		positioner?: Combobox.Positioner.Props["className"];
		searchInput?: Combobox.Input.Props["className"];
		searchInputContainer?: React.HTMLAttributes<HTMLDivElement>["className"];
		list?: Combobox.List.Props["className"];
		item?: Combobox.Item.Props["className"];
		empty?: Combobox.Empty.Props["className"];
	};

	/** Props forwarded to the Base UI parts rendered by `PhoneField.Country`. */
	export type CountrySlotProps = {
		root?: Omit<
			Combobox.Root.Props<Country, false>,
			| "children"
			| "defaultValue"
			| "isItemEqualToValue"
			| "itemToStringLabel"
			| "items"
			| "onValueChange"
			| "value"
		>;
		trigger?: Omit<Combobox.Trigger.Props, "children" | "className">;
		value?: Omit<
			Combobox.Value.Props,
			"children" | "className" | "placeholder"
		>;
		icon?: Omit<Combobox.Icon.Props, "children" | "className">;
		portal?: Omit<Combobox.Portal.Props, "children">;
		positioner?: Omit<
			Combobox.Positioner.Props,
			"children" | "className" | keyof CountryPositioning
		>;
		popup?: Omit<Combobox.Popup.Props, "children" | "className">;
		searchInputContainer?: Omit<
			React.HTMLAttributes<HTMLDivElement>,
			"className"
		>;
		searchInput?: Omit<Combobox.Input.Props, "className" | "placeholder">;
		empty?: Omit<Combobox.Empty.Props, "children" | "className">;
		list?: Omit<Combobox.List.Props, "children" | "className">;
		item?:
			| Omit<Combobox.Item.Props, "children" | "className" | "value">
			| ((
					country: Country,
			  ) => Omit<Combobox.Item.Props, "children" | "className" | "value">);
	};

	/**
	 * Positioning options for `PhoneField.Country` popup.
	 * Mirrors common Combobox.Positioner settings while keeping a focused API.
	 */
	export type CountryPositioning = Pick<
		Combobox.Positioner.Props,
		| "align"
		| "alignOffset"
		| "anchor"
		| "collisionAvoidance"
		| "collisionBoundary"
		| "collisionPadding"
		| "disableAnchorTracking"
		| "positionMethod"
		| "side"
		| "sideOffset"
		| "sticky"
	>;

	/**
	 * Props for `PhoneField.Root`. Extends div. Use `value`/`onValueChange` for controlled mode,
	 * or `defaultValue`/`defaultCountry` for uncontrolled. Defaults are only read on mount;
	 * do not switch modes during the component's lifetime. Set `name` to serialize into FormData.
	 */
	export type RootProps = Omit<
		React.ComponentPropsWithoutRef<"div">,
		"defaultValue"
	> & {
		value?: InputValue | Value;
		defaultValue?: InputValue | Value;
		onValueChange?: (value: Value) => void;
		defaultCountry?: CountryCode;
		countries?: readonly CountryCode[];
		lang?: Lang;
		name?: string;
		formatOnType?: boolean;
	};

	/** Props for `PhoneField.Country`: copy, icon, styling, and popup positioning controls. */
	export type CountryProps = {
		placeholder?: React.ReactNode;
		noResultsText?: React.ReactNode;
		inputPlaceholder?: string;
		icon?: React.ReactNode;
		classNames?: CountryClassNames;
		positioning?: CountryPositioning;
		renderCountryItem?: RenderCountryItem;
		renderCountryValue?: RenderCountryValue;
		slotProps?: CountrySlotProps;
	};

	/** Props for `PhoneField.Input`. Value and defaultValue are managed by `PhoneField.Root`. */
	export type InputProps = Omit<
		BaseInput.Props,
		"defaultValue" | "name" | "onValueChange" | "value"
	>;
}
