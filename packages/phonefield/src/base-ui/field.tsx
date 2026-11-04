import { useRender } from "@base-ui/react/use-render";
import type React from "react";
import { usePhoneFieldStateContext } from "../core/context.js";
import {
	renderErrorChildren,
	resolveStateProp as resolve,
	useDescriptionId,
	useErrorId,
} from "../core/field.js";
import type { PhoneField } from "./component.js";

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
	const { state } = usePhoneFieldStateContext("PhoneField.Group");
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
	const { state, controlId } = usePhoneFieldStateContext("PhoneField.Label");
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
	const { state } = usePhoneFieldStateContext("PhoneField.Description");
	const id = useDescriptionId(idProp);
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

/**
 * Error message, rendered only while the field is invalid and linked to the
 * input with `aria-describedby`. Pass a function child to pick the message
 * from the field state.
 */
export function ErrorMessage(props: PhoneField.ErrorProps) {
	const { state } = usePhoneFieldStateContext("PhoneField.Error");
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
	const { state } = usePhoneFieldStateContext("PhoneField.Error");
	const id = useErrorId(idProp);
	const ownProps: React.ComponentProps<"p"> & { "data-slot": string } = {
		id,
		className: resolve(className, state),
		style: resolve(style, state),
		"data-slot": "phone-field-error",
		children: renderErrorChildren(children, state),
	};
	return useRender({
		defaultTagName: "p",
		render,
		state,
		props: { ...props, ...ownProps },
	});
}
