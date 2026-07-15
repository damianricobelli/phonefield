import React from "react";
import type { PhoneFieldCountry, PhoneFieldValue } from "./types.js";

export type PhoneFieldCountryContextValue = {
	selectedCountry: PhoneFieldCountry;
	availableCountries: readonly PhoneFieldCountry[];
	setCountry: (country: PhoneFieldCountry) => void;
};

export type PhoneFieldInputContextValue = {
	value: PhoneFieldValue;
	setNumber: (number: string) => void;
};

export const PhoneFieldCountryContext =
	React.createContext<PhoneFieldCountryContextValue | null>(null);
export const PhoneFieldInputContext =
	React.createContext<PhoneFieldInputContextValue | null>(null);

export function usePhoneFieldCountryContext() {
	const context = React.useContext(PhoneFieldCountryContext);
	if (!context) {
		throw new Error(
			"PhoneField.Country must be used inside <PhoneField.Root>.",
		);
	}
	return context;
}

export function usePhoneFieldInputContext() {
	const context = React.useContext(PhoneFieldInputContext);
	if (!context) {
		throw new Error("PhoneField.Input must be used inside <PhoneField.Root>.");
	}
	return context;
}
