import { Group as AriaGroup } from "react-aria-components/Group";
import { Label as AriaLabel } from "react-aria-components/Label";
import { Text } from "react-aria-components/Text";
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
export function Group({
	className,
	style,
	children,
	...props
}: PhoneField.GroupProps) {
	const { state } = usePhoneFieldStateContext("PhoneField.Group");
	return (
		<AriaGroup
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
			data-slot="phone-field-group"
		>
			{typeof children === "function"
				? (renderProps) => children({ ...renderProps, ...state })
				: children}
		</AriaGroup>
	);
}

/** React Aria Label for the phone input. `htmlFor` follows the input's id automatically. */
export function Label({ className, style, ...props }: PhoneField.LabelProps) {
	const { state, controlId } = usePhoneFieldStateContext("PhoneField.Label");
	return (
		<AriaLabel
			{...props}
			{...getStateDataAttributes(state)}
			className={resolve(className, state)}
			style={resolve(style, state)}
			htmlFor={controlId}
			data-slot="phone-field-label"
		/>
	);
}

/** Help text, linked to the input with `aria-describedby`. */
export function Description({
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
			{...props}
			{...getStateDataAttributes(state)}
			id={id}
			className={resolve(className, state)}
			style={resolve(style, state)}
			data-slot="phone-field-description"
		/>
	);
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
			{...props}
			{...getStateDataAttributes(state)}
			id={id}
			className={resolve(className, state)}
			style={resolve(style, state)}
			data-slot="phone-field-error"
		>
			{renderErrorChildren(children, state)}
		</Text>
	);
}
