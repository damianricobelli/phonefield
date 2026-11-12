import React from "react";
import type {
	PhoneFieldChangeDetails,
	PhoneFieldChangeReason,
	PhoneFieldCountry,
	PhoneFieldCountryCode,
	PhoneFieldInputValue,
	PhoneFieldLang,
	PhoneFieldState,
	PhoneFieldValue,
} from "../types.js";
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
} from "../utils.js";
import { useIsomorphicLayoutEffect } from "./compat.js";
import {
	PhoneFieldCountryContext,
	type PhoneFieldCountryContextValue,
	PhoneFieldInputContext,
	type PhoneFieldInputContextValue,
	PhoneFieldStateContext,
	type PhoneFieldStateContextValue,
} from "./context.js";
import {
	type PhoneFieldEditKind,
	PhoneFieldHistory,
	type PhoneFieldInputSelection,
	toInputValue,
} from "./history.js";
import { mergeRefs } from "./merge-refs.js";

declare const process: { env: { NODE_ENV?: string } } | undefined;

/** Root props shared by every adapter. Each adapter adds its own rendering props. */
export type PhoneFieldRootOptions = {
	value?: PhoneFieldInputValue | PhoneFieldValue;
	defaultValue?: PhoneFieldInputValue | PhoneFieldValue;
	onValueChange?: (
		value: PhoneFieldValue,
		details: PhoneFieldChangeDetails,
	) => void;
	/** Initial country when no value is provided. Defaults to `"US"` or the first available country. */
	defaultCountry?: PhoneFieldCountryCode;
	/** Restricts the list and international-paste detection to these countries, in this order. */
	countries?: readonly PhoneFieldCountryCode[];
	/** Pinned to the top of the list, in this order. */
	preferredCountries?: readonly PhoneFieldCountryCode[];
	/** Locale for country names, sorting, and search. */
	lang?: PhoneFieldLang;
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
	 * validation still applies when `false`, unless `autoInvalid` is `false`.
	 */
	invalid?: boolean;
	/**
	 * Marks the field invalid on its own once it is touched: an incomplete
	 * number, or an empty required field. Set to `false` when a form library
	 * owns validation, so only `invalid` marks the field invalid.
	 * @default true
	 */
	autoInvalid?: boolean;
};

/** Focus callbacks for the whole field. */
type RootFocusHandlers = {
	/**
	 * Called when focus enters the field. Moving between the input, the
	 * country trigger, and the country popup does not call it again.
	 */
	onFocus?: React.FocusEventHandler<HTMLElement>;
	/**
	 * Called when focus leaves the field, after it has settled outside the
	 * input, the country trigger, and the country popup. Runs after the event
	 * is dispatched, so `event.currentTarget` is `null`; use `event.target`.
	 */
	onBlur?: React.FocusEventHandler<HTMLElement>;
};

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

export type PhoneFieldRootReturnValue = {
	state: PhoneFieldState;
	rootRef: React.RefObject<HTMLDivElement | null>;
	/** `rootRef` merged with the forwarded ref, for adapters that render the element. */
	mergedRootRef: React.RefCallback<HTMLDivElement>;
	/** Hidden input that serializes the value when `name` is set. */
	hiddenInput: React.ReactNode;
	focusHandlers: {
		onFocus: React.FocusEventHandler<HTMLElement>;
		onBlur: React.FocusEventHandler<HTMLElement>;
	};
	/** Wraps the rendered root in the field's context providers. */
	provide: (element: React.ReactNode) => React.ReactNode;
};

/**
 * Owns the phone value, field state, history, and form serialization. Every
 * adapter renders its own root element around the returned `provide` wrapper.
 */
export function usePhoneFieldRoot(
	options: PhoneFieldRootOptions & RootFocusHandlers,
	forwardedRef?: React.Ref<HTMLDivElement>,
): PhoneFieldRootReturnValue {
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
		autoInvalid = true,
		onFocus,
		onBlur,
	} = options;

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
		(iso2: string) => countryIndex.get(iso2 as PhoneFieldCountryCode),
		[countryIndex],
	);
	const fallbackCountry = React.useMemo(
		() => resolveCountry(availableCountries),
		[availableCountries],
	);
	const findCountry = React.useCallback(
		(iso2: string | undefined) =>
			(iso2 ? countryIndex.get(iso2 as PhoneFieldCountryCode) : undefined) ??
			fallbackCountry,
		[countryIndex, fallbackCountry],
	);

	const [internalValue, setInternalValue] =
		React.useState<PhoneFieldInputValue>(
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
	// in the same task means focus stayed inside the field. onFocus and onBlur
	// fire only when focus enters or leaves the whole field, like a native input.
	const [focused, setFocused] = React.useState(false);
	const [touched, setTouched] = React.useState(false);
	const focusWithinRef = React.useRef(false);
	const blurTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);
	React.useEffect(() => () => clearTimeout(blurTimeoutRef.current), []);
	const focusCallbacksRef = React.useRef({ onFocus, onBlur });
	useIsomorphicLayoutEffect(() => {
		focusCallbacksRef.current = { onFocus, onBlur };
	});
	const handleFocus = React.useCallback(
		(event: React.FocusEvent<HTMLElement>) => {
			clearTimeout(blurTimeoutRef.current);
			if (focusWithinRef.current) return;
			focusWithinRef.current = true;
			setFocused(true);
			focusCallbacksRef.current.onFocus?.(event);
		},
		[],
	);
	const handleBlur = React.useCallback(
		(event: React.FocusEvent<HTMLElement>) => {
			clearTimeout(blurTimeoutRef.current);
			blurTimeoutRef.current = setTimeout(() => {
				focusWithinRef.current = false;
				setFocused(false);
				setTouched(true);
				focusCallbacksRef.current.onBlur?.(event);
			}, 0);
		},
		[],
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
	useIsomorphicLayoutEffect(() => {
		onValueChangeRef.current = onValueChange;
	});
	const applyValue = React.useCallback(
		(nextValue: PhoneFieldValue, reason: PhoneFieldChangeReason) => {
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
			nextCountry: PhoneFieldCountry,
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

	const inputRef = React.useRef<HTMLInputElement>(null);
	const focusInput = React.useCallback(() => {
		const input = inputRef.current;
		if (!input?.isConnected || input.disabled) return false;
		input.focus();
		// getRootNode() also covers an input rendered inside a shadow root.
		const root = input.getRootNode() as Document | ShadowRoot;
		if (root.activeElement !== input) return false;
		// Continue typing after the digits already entered. `selectionStart` is
		// null for input types without a caret, such as `type="number"`.
		if (input.selectionStart !== null) {
			const end = input.value.length;
			input.setSelectionRange(end, end);
		}
		return true;
	}, []);

	const setCountry = React.useCallback(
		(country: PhoneFieldCountry) => {
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
	const state = React.useMemo<PhoneFieldState>(
		() => ({
			country: normalizedValue.countryIso2,
			valid: normalizedValue.isValid,
			invalid:
				!!invalid ||
				(autoInvalid &&
					touched &&
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
			autoInvalid,
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
			focusInput,
		}),
		[
			availableCountries,
			disabled,
			focusInput,
			getCountry,
			groups,
			locale,
			readOnly,
			selectedCountry,
			setCountry,
		],
	);
	const stateContextValue = React.useMemo<PhoneFieldStateContextValue>(
		() => ({
			state,
			controlId,
			setControlId,
			descriptionId,
			setDescriptionId,
			errorId,
			setErrorId,
			markTouched,
		}),
		[controlId, descriptionId, errorId, markTouched, state],
	);
	const inputContextValue = React.useMemo<PhoneFieldInputContextValue>(
		() => ({
			value: normalizedValue,
			inputRef,
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
			normalizedValue,
			redo,
			rememberSelection,
			setNumber,
			undo,
		],
	);

	// Behave like a native form control: submitting reveals errors on an
	// untouched field, and resetting restores the initial value.
	const rootRef = React.useRef<HTMLDivElement>(null);
	const mergedRootRef = React.useCallback(
		(element: HTMLDivElement | null) =>
			mergeRefs<HTMLDivElement>(forwardedRef, rootRef)(element),
		[forwardedRef],
	);
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

	const hiddenInput = name ? (
		<input
			type="hidden"
			name={name}
			form={form}
			disabled={disabled}
			value={JSON.stringify(toFormValue(normalizedValue))}
			data-slot="phone-field-hidden-input"
		/>
	) : null;

	const provide = (element: React.ReactNode) => (
		<PhoneFieldCountryContext.Provider value={countryContextValue}>
			<PhoneFieldStateContext.Provider value={stateContextValue}>
				<PhoneFieldInputContext.Provider value={inputContextValue}>
					{element}
				</PhoneFieldInputContext.Provider>
			</PhoneFieldStateContext.Provider>
		</PhoneFieldCountryContext.Provider>
	);

	return {
		state,
		rootRef,
		mergedRootRef,
		hiddenInput,
		focusHandlers: { onFocus: handleFocus, onBlur: handleBlur },
		provide,
	};
}

/** Splits the shared Root options from the props an adapter renders. */
export function splitRootProps<
	T extends PhoneFieldRootOptions & RootFocusHandlers,
>(props: T) {
	const {
		value,
		defaultValue,
		onValueChange,
		defaultCountry,
		countries,
		preferredCountries,
		lang,
		name,
		form,
		formatOnType,
		limitMaxLength,
		disabled,
		readOnly,
		required,
		invalid,
		autoInvalid,
		onFocus,
		onBlur,
		...elementProps
	} = props;
	return {
		options: {
			value,
			defaultValue,
			onValueChange,
			defaultCountry,
			countries,
			preferredCountries,
			lang,
			name,
			form,
			formatOnType,
			limitMaxLength,
			disabled,
			readOnly,
			required,
			invalid,
			autoInvalid,
			onFocus,
			onBlur,
		},
		elementProps,
	};
}
