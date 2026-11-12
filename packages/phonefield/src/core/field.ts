import React from "react";
import type { PhoneFieldState } from "../types.js";
import { useIsomorphicLayoutEffect } from "./compat.js";
import { usePhoneFieldStateContext } from "./context.js";

export type DataAttributes = { [key: `data-${string}`]: string | undefined };

/**
 * Mirrors the field state as data attributes: `data-country="US"`, and an
 * empty attribute for each true flag (`data-valid`, `data-readonly`, …).
 */
export function getStateDataAttributes(state: PhoneFieldState): DataAttributes {
	const attributes: DataAttributes = {};
	for (const [key, value] of Object.entries(state)) {
		const name = `data-${key.toLowerCase()}` as const;
		if (typeof value === "string") attributes[name] = value;
		else if (value) attributes[name] = "";
	}
	return attributes;
}

export function resolveStateProp<State, Value>(
	value: Value | ((state: State) => Value),
	state: State,
): Value {
	return typeof value === "function"
		? (value as (state: State) => Value)(state)
		: value;
}

/** Links a Description to the input with `aria-describedby`. */
export function useDescriptionId(idProp: string | undefined) {
	const { setDescriptionId } = usePhoneFieldStateContext(
		"PhoneField.Description",
	);
	const generatedId = React.useId();
	const id = idProp ?? generatedId;
	useIsomorphicLayoutEffect(() => {
		setDescriptionId(id);
		return () => setDescriptionId(undefined);
	}, [id, setDescriptionId]);
	return id;
}

/** Links a visible Error to the input with `aria-describedby`. */
export function useErrorId(idProp: string | undefined) {
	const { setErrorId } = usePhoneFieldStateContext("PhoneField.Error");
	const generatedId = React.useId();
	const id = idProp ?? generatedId;
	useIsomorphicLayoutEffect(() => {
		setErrorId(id);
		return () => setErrorId(undefined);
	}, [id, setErrorId]);
	return id;
}

export function defaultErrorMessage(state: PhoneFieldState) {
	return state.filled ? "Enter a valid phone number." : "Enter a phone number.";
}

export function renderErrorChildren(
	children: React.ReactNode | ((state: PhoneFieldState) => React.ReactNode),
	state: PhoneFieldState,
) {
	return typeof children === "function"
		? children(state)
		: (children ?? defaultErrorMessage(state));
}
