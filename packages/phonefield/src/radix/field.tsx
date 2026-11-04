import * as LabelPrimitive from "radix-ui/label";
import * as Slot from "radix-ui/slot";
import { usePhoneFieldStateContext } from "../core/context.js";
import {
	getStateDataAttributes,
	renderErrorChildren,
	useDescriptionId,
	useErrorId,
} from "../core/field.js";
import type { PhoneField } from "./component.js";

/**
 * Visual shell for the country trigger and input. Mirrors Root's state as
 * data attributes, so Root can stay a plain wrapper around Label, Group, and Error.
 */
export function Group({ asChild, ...props }: PhoneField.GroupProps) {
	const { state } = usePhoneFieldStateContext("PhoneField.Group");
	const Component = asChild ? Slot.Root : "div";
	return (
		<Component
			role="group"
			{...props}
			{...getStateDataAttributes(state)}
			data-slot="phone-field-group"
		/>
	);
}

/** Radix Label for the phone input. `htmlFor` follows the input's id automatically. */
export function Label(props: PhoneField.LabelProps) {
	const { state, controlId } = usePhoneFieldStateContext("PhoneField.Label");
	return (
		<LabelPrimitive.Root
			{...props}
			{...getStateDataAttributes(state)}
			htmlFor={controlId}
			data-slot="phone-field-label"
		/>
	);
}

/** Help text, linked to the input with `aria-describedby`. */
export function Description({
	asChild,
	id: idProp,
	...props
}: PhoneField.DescriptionProps) {
	const { state } = usePhoneFieldStateContext("PhoneField.Description");
	const id = useDescriptionId(idProp);
	const Component = asChild ? Slot.Root : "p";
	return (
		<Component
			{...props}
			{...getStateDataAttributes(state)}
			id={id}
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
	asChild,
	id: idProp,
	children,
	...props
}: PhoneField.ErrorProps) {
	const { state } = usePhoneFieldStateContext("PhoneField.Error");
	const id = useErrorId(idProp);
	const Component = asChild ? Slot.Root : "p";
	return (
		<Component
			{...props}
			{...getStateDataAttributes(state)}
			id={id}
			data-slot="phone-field-error"
		>
			{renderErrorChildren(children, state)}
		</Component>
	);
}
