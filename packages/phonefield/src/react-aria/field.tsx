import { Group as AriaGroup } from "react-aria-components/Group";
import { Label as AriaLabel } from "react-aria-components/Label";
import { Text } from "react-aria-components/Text";
import { withRef } from "../core/compat.js";
import { usePhoneFieldStateContext } from "../core/context.js";
import {
	getStateDataAttributes,
	renderErrorChildren,
	resolveStateProp as resolve,
	useDescriptionId,
	useErrorId,
} from "../core/field.js";
import type { PhoneField } from "./component.js";

/**
 * Visual shell for the country trigger and input, built on React Aria's Group.
 * Render props receive Group's state (`isHovered`, `isFocusWithin`, …) and the
 * field state (`valid`, `invalid`, `filled`, …).
 */
export const Group = withRef(function Group({
	className,
	style,
	children,
	...props
}: PhoneField.GroupProps) {
	const { state } = usePhoneFieldStateContext("PhoneField.Group");
	return (
		<AriaGroup
			data-slot="phone-field-group"
			{...props}
			{...getStateDataAttributes(state)}
			isDisabled={state.disabled}
			isInvalid={state.invalid}
			isReadOnly={state.readOnly}
			className={
				typeof className === "function"
					? (renderProps) => className({ ...renderProps, ...state }) ?? ""
					: className
			}
			style={
				typeof style === "function"
					? (renderProps) => style({ ...renderProps, ...state })
					: style
			}
		>
			{typeof children === "function"
				? (renderProps) => children({ ...renderProps, ...state })
				: children}
		</AriaGroup>
	);
});

/** React Aria Label for the phone input. `htmlFor` follows the input's id automatically. */
export const Label = withRef(function Label({
	className,
	style,
	...props
}: PhoneField.LabelProps) {
	const { state, controlId } = usePhoneFieldStateContext("PhoneField.Label");
	return (
		<AriaLabel
			data-slot="phone-field-label"
			{...props}
			{...getStateDataAttributes(state)}
			className={resolve(className, state)}
			style={resolve(style, state)}
			htmlFor={controlId}
		/>
	);
});

/** Help text, linked to the input with `aria-describedby`. */
export const Description = withRef(function Description({
	className,
	style,
	id: idProp,
	...props
}: PhoneField.DescriptionProps) {
	const { state } = usePhoneFieldStateContext("PhoneField.Description");
	const id = useDescriptionId(idProp);
	return (
		<Text
			elementType="p"
			data-slot="phone-field-description"
			{...props}
			{...getStateDataAttributes(state)}
			id={id}
			className={resolve(className, state)}
			style={resolve(style, state)}
		/>
	);
});

/**
 * Error message, rendered only while the field is invalid and linked to the
 * input with `aria-describedby`. Pass a function child to pick the message
 * from the field state.
 */
export const ErrorMessage = withRef(function ErrorMessage(
	props: PhoneField.ErrorProps,
) {
	const { state } = usePhoneFieldStateContext("PhoneField.Error");
	return state.invalid ? <VisibleError {...props} /> : null;
});

const VisibleError = withRef(function VisibleError({
	className,
	style,
	id: idProp,
	children,
	...props
}: PhoneField.ErrorProps) {
	const { state } = usePhoneFieldStateContext("PhoneField.Error");
	const id = useErrorId(idProp);
	return (
		<Text
			elementType="p"
			data-slot="phone-field-error"
			{...props}
			{...getStateDataAttributes(state)}
			id={id}
			className={resolve(className, state)}
			style={resolve(style, state)}
		>
			{renderErrorChildren(children, state)}
		</Text>
	);
});
