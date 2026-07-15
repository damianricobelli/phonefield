"use client";

import { Combobox } from "@base-ui/react/combobox";
import { Input as BaseInput } from "@base-ui/react/input";
import React from "react";
import type {
	PhoneFieldCountry,
	PhoneFieldCountryCode,
	PhoneFieldCountryCodeValue,
	PhoneFieldCountryMap,
	PhoneFieldCountryName,
	PhoneFieldFormValue,
	PhoneFieldLang,
	PhoneFieldParseOptions,
	PhoneFieldValue,
} from "./types.js";
import {
	buildValue,
	defaultCountrySearchText,
	getCountriesMap,
	resolveCountry,
	toAvailableCountries,
	toFormValue,
} from "./utils.js";

type PhoneFieldCountryContextValue = {
	selectedCountry: PhoneFieldCountry;
	availableCountries: readonly PhoneFieldCountry[];
	setCountry: (country: PhoneFieldCountry) => void;
};

type PhoneFieldInputContextValue = {
	value: PhoneFieldValue;
	setNumber: (number: string) => void;
};

const PhoneFieldCountryContext =
	React.createContext<PhoneFieldCountryContextValue | null>(null);
const PhoneFieldInputContext =
	React.createContext<PhoneFieldInputContextValue | null>(null);

function usePhoneFieldCountryContext() {
	const ctx = React.useContext(PhoneFieldCountryContext);
	if (!ctx) {
		throw new Error(
			"PhoneField.Country must be used inside <PhoneField.Root>.",
		);
	}
	return ctx;
}

function usePhoneFieldInputContext() {
	const ctx = React.useContext(PhoneFieldInputContext);
	if (!ctx) {
		throw new Error("PhoneField.Input must be used inside <PhoneField.Root>.");
	}
	return ctx;
}

function ChevronUpDownIcon(props: React.ComponentProps<"svg">) {
	return (
		<svg
			width="8"
			height="12"
			viewBox="0 0 8 12"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			aria-hidden="true"
			{...props}
		>
			<path d="M0.5 4.5L4 1.5L7.5 4.5" />
			<path d="M0.5 7.5L4 10.5L7.5 7.5" />
		</svg>
	);
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

		const [internalValue, setInternalValue] = React.useState<PhoneField.Value>(
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
		const currentNumberRef = React.useRef(normalizedValue.nationalNumber);
		React.useEffect(() => {
			currentNumberRef.current = normalizedValue.nationalNumber;
		}, [normalizedValue.nationalNumber]);

		const commitValue = React.useCallback(
			(nextCountry: PhoneField.Country, nextNumber: string) => {
				const nextValue = buildValue(nextCountry, nextNumber, formatOnType);
				if (!isControlled) {
					setInternalValue(nextValue);
				}
				onValueChange?.(nextValue);
			},
			[formatOnType, isControlled, onValueChange],
		);

		const setCountry = React.useCallback(
			(country: PhoneField.Country) =>
				commitValue(country, currentNumberRef.current),
			[commitValue],
		);
		const setNumber = React.useCallback(
			(number: string) => commitValue(selectedCountry, number),
			[commitValue, selectedCountry],
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
			() => ({ value: normalizedValue, setNumber }),
			[normalizedValue, setNumber],
		);

		return (
			<PhoneFieldCountryContext.Provider value={countryContextValue}>
				<PhoneFieldInputContext.Provider value={inputContextValue}>
					<div ref={ref} className={className} {...props}>
						{children}
						{name ? (
							<input
								type="hidden"
								name={name}
								value={JSON.stringify(toFormValue(normalizedValue))}
							/>
						) : null}
					</div>
				</PhoneFieldInputContext.Provider>
			</PhoneFieldCountryContext.Provider>
		);
	},
);

/**
 * Country combobox.
 * Intentionally unstyled by default; use `classNames` for visuals and `positioning` for placement.
 */
function CountryComponent({
	placeholder = "Select country",
	noResultsText = "No countries found",
	inputPlaceholder = "Search country",
	icon,
	classNames,
	positioning,
	renderCountryItem,
	renderCountryValue,
	slotProps,
}: PhoneField.CountryProps) {
	const { selectedCountry, availableCountries, setCountry } =
		usePhoneFieldCountryContext();

	const selectedInList =
		availableCountries.find(
			(country) => country.iso2 === selectedCountry.iso2,
		) ?? availableCountries[0];

	const resolvedPositioning = {
		side: "bottom" as const,
		align: "start" as const,
		sideOffset: 4,
		...positioning,
	};

	return (
		<Combobox.Root
			{...slotProps?.root}
			items={availableCountries}
			value={selectedInList}
			itemToStringLabel={defaultCountrySearchText}
			onValueChange={(next) => {
				if (!next) {
					return;
				}
				setCountry(next);
			}}
			isItemEqualToValue={(a, b) => a.iso2 === b.iso2}
		>
			<Combobox.Trigger
				{...slotProps?.trigger}
				className={classNames?.trigger ?? slotProps?.trigger?.className}
			>
				<Combobox.Value placeholder={placeholder} {...slotProps?.value}>
					{(country: PhoneField.Country | null) => {
						return country
							? (renderCountryValue?.(country) ??
									`${country.flag ? `${country.flag} ` : ""}${country.name} (${country.dialCode})`)
							: placeholder;
					}}
				</Combobox.Value>
				<Combobox.Icon
					{...slotProps?.icon}
					className={classNames?.icon ?? slotProps?.icon?.className}
				>
					{icon ?? <ChevronUpDownIcon />}
				</Combobox.Icon>
			</Combobox.Trigger>

			<Combobox.Portal {...slotProps?.portal}>
				<Combobox.Positioner
					{...slotProps?.positioner}
					{...resolvedPositioning}
					className={classNames?.positioner ?? slotProps?.positioner?.className}
				>
					<Combobox.Popup
						{...slotProps?.popup}
						className={classNames?.popup ?? slotProps?.popup?.className}
					>
						<div
							{...slotProps?.searchInputContainer}
							className={
								classNames?.searchInputContainer ??
								slotProps?.searchInputContainer?.className
							}
						>
							<Combobox.Input
								{...slotProps?.searchInput}
								className={
									classNames?.searchInput ?? slotProps?.searchInput?.className
								}
								placeholder={inputPlaceholder}
								aria-label={
									slotProps?.searchInput?.["aria-label"] ?? inputPlaceholder
								}
							/>
						</div>
						<Combobox.Empty
							{...slotProps?.empty}
							className={classNames?.empty ?? slotProps?.empty?.className}
						>
							{noResultsText}
						</Combobox.Empty>
						<Combobox.List
							{...slotProps?.list}
							className={classNames?.list ?? slotProps?.list?.className}
						>
							{(country: PhoneField.Country) => {
								const itemProps =
									typeof slotProps?.item === "function"
										? slotProps.item(country)
										: slotProps?.item;
								return (
									<Combobox.Item
										{...itemProps}
										key={country.iso2}
										value={country}
										className={classNames?.item ?? itemProps?.className}
									>
										{renderCountryItem?.(country) ??
											`${country.flag ? `${country.flag} ` : ""}${country.name} (${country.dialCode})`}
									</Combobox.Item>
								);
							}}
						</Combobox.List>
					</Combobox.Popup>
				</Combobox.Positioner>
			</Combobox.Portal>
		</Combobox.Root>
	);
}

const Country = React.memo(CountryComponent);

function mergeRefs<T>(
	...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
	return (value) => {
		for (const ref of refs) {
			if (!ref) continue;

			if (typeof ref === "function") {
				ref(value);
			} else {
				(ref as React.RefObject<T | null>).current = value;
			}
		}
	};
}

function removeCharAt(value: string, index: number) {
	return value.slice(0, index) + value.slice(index + 1);
}

function findPrevDigitIndex(value: string, from: number) {
	let i = from;
	while (i > 0 && /\D/.test(value[i - 1] ?? "")) {
		i--;
	}
	return i - 1;
}

/**
 * Number input bound to the selected country. Exposes `data-valid` / `data-invalid` from Base UI Input.
 */
const Input = React.forwardRef<HTMLInputElement, PhoneField.InputProps>(
	function Input(
		{
			className,
			onValueChange,
			type = "tel",
			inputMode = "tel",
			autoComplete = "tel-national",
			onKeyDown,
			...props
		},
		forwardedRef,
	) {
		const { value, setNumber } = usePhoneFieldInputContext();
		const inputRef = React.useRef<HTMLInputElement>(null);
		const mergedRef = React.useMemo(
			() => mergeRefs(forwardedRef, inputRef),
			[forwardedRef],
		);

		return (
			<BaseInput
				{...props}
				ref={mergedRef}
				type={type}
				inputMode={inputMode}
				autoComplete={autoComplete}
				className={className}
				value={value.nationalNumber}
				onKeyDown={(e) => {
					onKeyDown?.(e);
					if (e.defaultPrevented) {
						return;
					}

					if (e.key === "Backspace") {
						const el = inputRef.current;
						if (!el) return;

						const pos = el.selectionStart ?? 0;
						const end = el.selectionEnd ?? 0;

						if (pos === end && pos > 0) {
							const prevChar = el.value[pos - 1];

							if (prevChar && /\D/.test(prevChar)) {
								e.preventDefault();

								const digitIndex = findPrevDigitIndex(el.value, pos);
								if (digitIndex >= 0) {
									const next = removeCharAt(el.value, digitIndex);
									setNumber(next);

									requestAnimationFrame(() => {
										const newPos = digitIndex;
										el.setSelectionRange(newPos, newPos);
									});
								}
							}
						}
					}
				}}
				onValueChange={(nextValue, eventDetails) => {
					setNumber(nextValue);
					onValueChange?.(nextValue, eventDetails);
				}}
			/>
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
	/** @deprecated Use `PhoneField.CountryCode`. */
	export type CountryCodeValue = PhoneFieldCountryCodeValue;
	/** @deprecated This is an ISO2 code, not a country name. Use `PhoneField.CountryCode`. */
	export type CountryName = PhoneFieldCountryName;
	/** BCP 47 locale for country names and sorting. */
	export type Lang = PhoneFieldLang;
	/** Emitted/controlled value: countryIso2, countryDialCode, nationalNumber, e164, isValid. */
	export type Value = PhoneFieldValue;
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
	 * `PhoneField.Country` is unstyled by default; use this to style each part.
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
		trigger?: Omit<Combobox.Trigger.Props, "children">;
		value?: Omit<Combobox.Value.Props, "children">;
		icon?: Omit<Combobox.Icon.Props, "children">;
		portal?: Omit<Combobox.Portal.Props, "children">;
		positioner?: Omit<Combobox.Positioner.Props, "children">;
		popup?: Omit<Combobox.Popup.Props, "children">;
		searchInputContainer?: React.HTMLAttributes<HTMLDivElement>;
		searchInput?: Combobox.Input.Props;
		empty?: Omit<Combobox.Empty.Props, "children">;
		list?: Omit<Combobox.List.Props, "children">;
		item?:
			| Omit<Combobox.Item.Props, "children" | "value">
			| ((country: Country) => Omit<Combobox.Item.Props, "children" | "value">);
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
	 * or `defaultValue`/`defaultCountry` for uncontrolled. Set `name` to serialize value into FormData.
	 */
	export type RootProps = Omit<
		React.ComponentPropsWithoutRef<"div">,
		"defaultValue"
	> & {
		value?: Value;
		defaultValue?: Value;
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
	export type InputProps = Omit<BaseInput.Props, "defaultValue" | "value">;
}
