"use client";

import { useRender } from "@base-ui/react/use-render";
import React from "react";
import type { PhoneField } from "./component.js";
import {
	PhoneFieldCountryContext,
	type PhoneFieldCountryContextValue,
	PhoneFieldInputContext,
	type PhoneFieldInputContextValue,
} from "./context.js";
import {
	type PhoneFieldEditKind,
	PhoneFieldHistory,
	type PhoneFieldInputSelection,
	toInputValue,
} from "./history.js";
import type { PhoneFieldChangeReason } from "./types.js";
import {
	buildValue,
	getCountriesMap,
	isTooLong,
	normalizeLang,
	onlyDigits,
	parseInternationalInput,
	resolveCountry,
	toAvailableCountries,
	toCountryGroups,
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

function toChangeReason(editKind: PhoneFieldEditKind): PhoneFieldChangeReason {
	if (editKind === "paste") return "paste";
	if (editKind === "country") return "country";
	return "input";
}

/** Keeps an array prop referentially stable while its contents are unchanged. */
function useStableList<T>(list: readonly T[] | undefined) {
	const [stable, setStable] = React.useState(list);
	const same =
		stable === list ||
		(stable !== undefined &&
			list !== undefined &&
			stable.length === list.length &&
			stable.every((item, index) => item === list[index]));
	if (!same) setStable(list);
	return same ? stable : list;
}

function isGrowingEdit(editKind: PhoneFieldEditKind) {
	return (
		editKind !== "delete-backward" &&
		editKind !== "delete-forward" &&
		editKind !== "cut"
	);
}

/**
 * Owns the phone value, field state, history, and form serialization.
 * Renders a `<div>` by default; use `render` to compose your own field shell.
 */
export function Root(props: PhoneField.RootProps) {
	const {
		value,
		defaultValue,
		onValueChange,
		defaultCountry,
		countries: countriesProp,
		preferredCountries: preferredCountriesProp,
		lang,
		name,
		form,
		formatOnType = true,
		limitMaxLength = true,
		disabled = false,
		readOnly = false,
		required = false,
		invalid,
		render,
		className,
		style,
		children,
		onFocus,
		onBlur,
		...elementProps
	} = props;

	const countries = useStableList(countriesProp);
	const preferredCountries = useStableList(preferredCountriesProp);
	const countriesMap = React.useMemo(() => getCountriesMap(lang), [lang]);
	const locale = React.useMemo(() => normalizeLang(lang), [lang]);
	const availableCountries = React.useMemo(
		() => toAvailableCountries(countriesMap, countries),
		[countriesMap, countries],
	);
	const groups = React.useMemo(
		() => toCountryGroups(availableCountries, preferredCountries),
		[availableCountries, preferredCountries],
	);
	// O(1) lookups for the hot paths (every keystroke resolves a country).
	const countryIndex = React.useMemo(
		() => new Map(availableCountries.map((country) => [country.iso2, country])),
		[availableCountries],
	);
	const getCountry = React.useCallback(
		(iso2: string) => countryIndex.get(iso2 as PhoneField.CountryCode),
		[countryIndex],
	);
	const fallbackCountry = React.useMemo(
		() => resolveCountry(availableCountries),
		[availableCountries],
	);
	const findCountry = React.useCallback(
		(iso2: string | undefined) =>
			(iso2 ? countryIndex.get(iso2 as PhoneField.CountryCode) : undefined) ??
			fallbackCountry,
		[countryIndex, fallbackCountry],
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
		() => findCountry(currentValue.countryIso2),
		[currentValue.countryIso2, findCountry],
	);
	const normalizedValue = React.useMemo(
		() =>
			buildValue(selectedCountry, currentValue.nationalNumber, formatOnType),
		[currentValue.nationalNumber, formatOnType, selectedCountry],
	);
	const isControlled = value !== undefined;
	useControlledModeWarning(isControlled);
	const currentValueRef = React.useRef(normalizedValue);
	const [initialValue] = React.useState(() => toInputValue(normalizedValue));
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

	// Focus can move between the input, the trigger, and the portaled popup.
	// React focus events bubble through portals, so a blur followed by a focus
	// in the same task means focus stayed inside the field.
	const [focused, setFocused] = React.useState(false);
	const [touched, setTouched] = React.useState(false);
	const blurTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);
	React.useEffect(() => () => clearTimeout(blurTimeoutRef.current), []);
	const handleFocus = React.useCallback(
		(event: React.FocusEvent<HTMLDivElement>) => {
			onFocus?.(event);
			clearTimeout(blurTimeoutRef.current);
			setFocused(true);
		},
		[onFocus],
	);
	const handleBlur = React.useCallback(
		(event: React.FocusEvent<HTMLDivElement>) => {
			onBlur?.(event);
			clearTimeout(blurTimeoutRef.current);
			blurTimeoutRef.current = setTimeout(() => {
				setFocused(false);
				setTouched(true);
			}, 0);
		},
		[onBlur],
	);

	const markTouched = React.useCallback(() => setTouched(true), []);
	const baseId = React.useId();
	const [customControlId, setControlId] = React.useState<string>();
	const [descriptionId, setDescriptionId] = React.useState<string>();
	const [errorId, setErrorId] = React.useState<string>();
	const controlId = customControlId ?? `${baseId}-input`;

	// Read the latest callback through a ref so actions keep their identity
	// even when the parent passes an inline onValueChange.
	const onValueChangeRef = React.useRef(onValueChange);
	React.useLayoutEffect(() => {
		onValueChangeRef.current = onValueChange;
	});
	const applyValue = React.useCallback(
		(nextValue: PhoneField.Value, reason: PhoneFieldChangeReason) => {
			if (!isControlled) {
				setInternalValue(nextValue);
				currentValueRef.current = nextValue;
			}
			onValueChangeRef.current?.(nextValue, { reason });
			return nextValue;
		},
		[isControlled],
	);

	const commitValue = React.useCallback(
		(
			nextCountry: PhoneField.Country,
			nextNumber: string,
			editKind: PhoneFieldEditKind,
		) => {
			const currentInputValue = toInputValue(currentValueRef.current);
			const nextValue = buildValue(nextCountry, nextNumber, formatOnType);
			historyRef.current.record(
				currentInputValue,
				toInputValue(nextValue),
				selectionRef.current,
				editKind,
			);
			return applyValue(nextValue, toChangeReason(editKind));
		},
		[applyValue, formatOnType],
	);

	const accepts = React.useCallback(
		(number: string) => {
			if (!limitMaxLength) return true;
			const current = currentValueRef.current;
			const country = findCountry(current.countryIso2);
			if (!isTooLong(country, number)) return true;
			// Never trap the user: edits that do not add digits stay allowed even
			// when the current number is already too long (e.g. after a country switch).
			return (
				onlyDigits(number).length <= onlyDigits(current.nationalNumber).length
			);
		},
		[findCountry, limitMaxLength],
	);

	const setCountry = React.useCallback(
		(country: PhoneField.Country) => {
			commitValue(country, currentValueRef.current.nationalNumber, "country");
		},
		[commitValue],
	);
	const setNumber = React.useCallback(
		(number: string, editKind: PhoneFieldEditKind = "unknown") => {
			if (isGrowingEdit(editKind) && !accepts(number)) return false;
			// Read the latest committed country, not the last render's, so
			// back-to-back calls (setCountry then setNumber) compose.
			const currentCountry = findCountry(currentValueRef.current.countryIso2);
			const internationalCountry = parseInternationalInput(number)?.country;
			const nextCountry =
				(internationalCountry && getCountry(internationalCountry)) ||
				currentCountry;
			const nextValue = commitValue(nextCountry, number, editKind);
			// Keep back-to-back uncontrolled events synchronous. Controlled values
			// are synchronized only after the parent accepts the update.
			if (!isControlled) currentValueRef.current = nextValue;
			return true;
		},
		[accepts, commitValue, findCountry, getCountry, isControlled],
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
			const currentInputValue = toInputValue(currentValueRef.current);
			const target = historyRef.current[direction](
				currentInputValue,
				selectionRef.current,
			);
			if (!target) return undefined;

			const targetCountry = findCountry(target.value.countryIso2);
			const nextValue = buildValue(
				targetCountry,
				target.value.nationalNumber,
				formatOnType,
			);
			selectionRef.current = target.selection;
			applyValue(nextValue, direction);
			return target;
		},
		[applyValue, findCountry, formatOnType],
	);
	const undo = React.useCallback(
		() => restoreHistory("undo"),
		[restoreHistory],
	);
	const redo = React.useCallback(
		() => restoreHistory("redo"),
		[restoreHistory],
	);

	const filled = onlyDigits(normalizedValue.nationalNumber).length > 0;
	const dirty =
		initialValue.countryIso2 !== normalizedValue.countryIso2 ||
		initialValue.nationalNumber !== normalizedValue.nationalNumber;
	const state = React.useMemo<PhoneField.State>(
		() => ({
			country: normalizedValue.countryIso2,
			valid: normalizedValue.isValid,
			invalid:
				invalid ||
				(touched &&
					((filled && !normalizedValue.isValid) || (required && !filled))),
			filled,
			dirty,
			touched,
			focused,
			disabled,
			readOnly,
			required,
		}),
		[
			dirty,
			disabled,
			filled,
			focused,
			invalid,
			normalizedValue.countryIso2,
			normalizedValue.isValid,
			readOnly,
			required,
			touched,
		],
	);

	const countryContextValue = React.useMemo<PhoneFieldCountryContextValue>(
		() => ({
			selectedCountry,
			availableCountries,
			groups,
			locale,
			disabled,
			readOnly,
			setCountry,
			getCountry,
		}),
		[
			availableCountries,
			disabled,
			getCountry,
			groups,
			locale,
			readOnly,
			selectedCountry,
			setCountry,
		],
	);
	const inputContextValue = React.useMemo<PhoneFieldInputContextValue>(
		() => ({
			value: normalizedValue,
			state,
			controlId,
			setControlId,
			descriptionId,
			setDescriptionId,
			errorId,
			setErrorId,
			markTouched,
			setNumber,
			accepts,
			rememberSelection,
			breakHistoryGroup,
			undo,
			redo,
		}),
		[
			accepts,
			breakHistoryGroup,
			controlId,
			descriptionId,
			errorId,
			markTouched,
			normalizedValue,
			redo,
			rememberSelection,
			setNumber,
			state,
			undo,
		],
	);

	// Behave like a native form control: submitting reveals errors on an
	// untouched field, and resetting restores the initial value.
	const rootRef = React.useRef<HTMLElement>(null);
	const resetField = React.useCallback(() => {
		setTouched(false);
		if (isControlled) return;
		const country = findCountry(initialValue.countryIso2);
		const resetValue = buildValue(
			country,
			initialValue.nationalNumber,
			formatOnType,
		);
		setInternalValue(resetValue);
		currentValueRef.current = resetValue;
		historyRef.current = new PhoneFieldHistory(toInputValue(resetValue));
	}, [findCountry, formatOnType, initialValue, isControlled]);
	React.useEffect(() => {
		const owner = form
			? rootRef.current?.ownerDocument.getElementById(form)
			: rootRef.current?.closest("form");
		if (!(owner instanceof HTMLFormElement)) return;
		const onReset = () => resetField();
		owner.addEventListener("submit", markTouched);
		owner.addEventListener("reset", onReset);
		return () => {
			owner.removeEventListener("submit", markTouched);
			owner.removeEventListener("reset", onReset);
		};
	}, [form, markTouched, resetField]);

	const ownProps: React.ComponentProps<"div"> & { "data-slot": string } = {
		className: typeof className === "function" ? className(state) : className,
		style: typeof style === "function" ? style(state) : style,
		"data-slot": "phone-field",
		children: (
			<>
				{children}
				{name ? (
					<input
						type="hidden"
						name={name}
						form={form}
						disabled={disabled}
						value={JSON.stringify(toFormValue(normalizedValue))}
						data-slot="phone-field-hidden-input"
					/>
				) : null}
			</>
		),
	};

	const element = useRender({
		defaultTagName: "div",
		render,
		ref: rootRef,
		state,
		props: {
			...elementProps,
			...ownProps,
			onFocus: handleFocus,
			onBlur: handleBlur,
		},
	});

	return (
		<PhoneFieldCountryContext.Provider value={countryContextValue}>
			<PhoneFieldInputContext.Provider value={inputContextValue}>
				{element}
			</PhoneFieldInputContext.Provider>
		</PhoneFieldCountryContext.Provider>
	);
}
