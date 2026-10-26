import React from "react";
import type {
	PhoneFieldEditKind,
	PhoneFieldHistorySnapshot,
	PhoneFieldInputSelection,
} from "./history.js";
import type {
	PhoneFieldCountry,
	PhoneFieldCountryCode,
	PhoneFieldState,
	PhoneFieldValue,
} from "./types.js";

export type PhoneFieldCountryGroup = {
	readonly id: "preferred" | "all";
	readonly items: readonly PhoneFieldCountry[];
};

/** Stable while the user types, so the country picker does not re-render per keystroke. */
export type PhoneFieldCountryContextValue = {
	selectedCountry: PhoneFieldCountry;
	availableCountries: readonly PhoneFieldCountry[];
	/** Present only when `preferredCountries` pins countries to the top. */
	groups: readonly PhoneFieldCountryGroup[] | null;
	locale: string;
	disabled: boolean;
	readOnly: boolean;
	setCountry: (country: PhoneFieldCountry) => void;
};

export type PhoneFieldInputContextValue = {
	value: PhoneFieldValue;
	state: PhoneFieldState;
	/** id of the phone input, used by Label. */
	controlId: string;
	setControlId: (id: string | undefined) => void;
	descriptionId: string | undefined;
	setDescriptionId: (id: string | undefined) => void;
	errorId: string | undefined;
	setErrorId: (id: string | undefined) => void;
	markTouched: () => void;
	setNumber: (number: string, editKind?: PhoneFieldEditKind) => boolean;
	accepts: (number: string) => boolean;
	rememberSelection: (selection: PhoneFieldInputSelection) => void;
	breakHistoryGroup: () => void;
	undo: () => PhoneFieldHistorySnapshot | undefined;
	redo: () => PhoneFieldHistorySnapshot | undefined;
};

export type PhoneFieldCountryLabels = {
	/** Search placeholder and accessible name. @default "Search country" */
	search?: string;
	/** Shown when the search has no matches. @default "No countries found" */
	empty?: React.ReactNode;
};

export const PhoneFieldCountryLabelsContext =
	React.createContext<PhoneFieldCountryLabels>({});

export const PhoneFieldCountryContext =
	React.createContext<PhoneFieldCountryContextValue | null>(null);
export const PhoneFieldInputContext =
	React.createContext<PhoneFieldInputContextValue | null>(null);

export function usePhoneFieldCountryContext(part = "PhoneField.Country") {
	const context = React.useContext(PhoneFieldCountryContext);
	if (!context) {
		throw new Error(`${part} must be used inside <PhoneField.Root>.`);
	}
	return context;
}

export function usePhoneFieldInputContext(part = "PhoneField.Input") {
	const context = React.useContext(PhoneFieldInputContext);
	if (!context) {
		throw new Error(`${part} must be used inside <PhoneField.Root>.`);
	}
	return context;
}

/** Everything a custom part needs: the value, field state, countries, and setters. */
export type UsePhoneFieldReturnValue = {
	value: PhoneFieldValue;
	state: PhoneFieldState;
	country: PhoneFieldCountry;
	countries: readonly PhoneFieldCountry[];
	/** Select a country by ISO2 code. Unknown or unavailable codes are ignored. */
	setCountry: (country: PhoneFieldCountryCode | (string & {})) => void;
	/** Replace the number as if the user typed it. National or `+` international text. */
	setNumber: (number: string) => void;
};

/**
 * Read and drive the nearest `PhoneField.Root` from a custom part, such as a
 * native `<select>`, a drawer, or a validation message.
 */
export function usePhoneField(): UsePhoneFieldReturnValue {
	const countryContext = usePhoneFieldCountryContext("usePhoneField()");
	const inputContext = usePhoneFieldInputContext("usePhoneField()");
	const { availableCountries, selectedCountry, setCountry } = countryContext;
	const { setNumber, state, value } = inputContext;

	return React.useMemo(
		() => ({
			value,
			state,
			country: selectedCountry,
			countries: availableCountries,
			setCountry: (iso2: string) => {
				const next = availableCountries.find(
					(country) => country.iso2 === iso2,
				);
				if (next) setCountry(next);
			},
			setNumber: (number: string) => {
				setNumber(number, "replace");
			},
		}),
		[availableCountries, selectedCountry, setCountry, setNumber, state, value],
	);
}
