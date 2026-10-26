import { useRender } from "@base-ui/react/use-render";
import React from "react";
import type { PhoneField } from "./component.js";
import { usePhoneFieldInputContext } from "./context.js";

function resolve<State, Value>(
	value: Value | ((state: State) => Value),
	state: State,
): Value {
	return typeof value === "function"
		? (value as (state: State) => Value)(state)
		: value;
}

/**
 * Visual shell for the country trigger and input. Mirrors Root's state as
 * data attributes, so Root can stay a plain wrapper around Label, Group, and Error.
 */
export function Group({
	render,
	className,
	style,
	...props
}: PhoneField.GroupProps) {
	const { state } = usePhoneFieldInputContext("PhoneField.Group");
	const ownProps: React.ComponentProps<"div"> & { "data-slot": string } = {
		role: "group",
		className: resolve(className, state),
		style: resolve(style, state),
		"data-slot": "phone-field-group",
	};
	return useRender({
		defaultTagName: "div",
		render,
		state,
		props: { ...props, ...ownProps },
	});
}

/** Label for the phone input. `htmlFor` follows the input's id automatically. */
export function Label({
	render,
	className,
	style,
	...props
}: PhoneField.LabelProps) {
	const { state, controlId } = usePhoneFieldInputContext("PhoneField.Label");
	const ownProps: React.ComponentProps<"label"> & { "data-slot": string } = {
		htmlFor: controlId,
		className: resolve(className, state),
		style: resolve(style, state),
		"data-slot": "phone-field-label",
	};
	return useRender({
		defaultTagName: "label",
		render,
		state,
		props: { ...props, ...ownProps },
	});
}

/** Help text, linked to the input with `aria-describedby`. */
export function Description({
	render,
	className,
	style,
	id: idProp,
	...props
}: PhoneField.DescriptionProps) {
	const { state, setDescriptionId } = usePhoneFieldInputContext(
		"PhoneField.Description",
	);
	const generatedId = React.useId();
	const id = idProp ?? generatedId;
	React.useLayoutEffect(() => {
		setDescriptionId(id);
		return () => setDescriptionId(undefined);
	}, [id, setDescriptionId]);
	const ownProps: React.ComponentProps<"p"> & { "data-slot": string } = {
		id,
		className: resolve(className, state),
		style: resolve(style, state),
		"data-slot": "phone-field-description",
	};
	return useRender({
		defaultTagName: "p",
		render,
		state,
		props: { ...props, ...ownProps },
	});
}

function defaultErrorMessage(state: PhoneField.State) {
	return state.filled ? "Enter a valid phone number." : "Enter a phone number.";
}

/**
 * Error message, rendered only while the field is invalid and linked to the
 * input with `aria-describedby`. Pass a function child to pick the message
 * from the field state.
 */
export function ErrorMessage(props: PhoneField.ErrorProps) {
	const { state } = usePhoneFieldInputContext("PhoneField.Error");
	return state.invalid ? <VisibleError {...props} /> : null;
}

function VisibleError({
	render,
	className,
	style,
	id: idProp,
	children,
	...props
}: PhoneField.ErrorProps) {
	const { state, setErrorId } = usePhoneFieldInputContext("PhoneField.Error");
	const generatedId = React.useId();
	const id = idProp ?? generatedId;
	React.useLayoutEffect(() => {
		setErrorId(id);
		return () => setErrorId(undefined);
	}, [id, setErrorId]);
	const ownProps: React.ComponentProps<"p"> & { "data-slot": string } = {
		id,
		className: resolve(className, state),
		style: resolve(style, state),
		"data-slot": "phone-field-error",
		children:
			typeof children === "function"
				? children(state)
				: (children ?? defaultErrorMessage(state)),
	};
	return useRender({
		defaultTagName: "p",
		render,
		state,
		props: { ...props, ...ownProps },
	});
}
