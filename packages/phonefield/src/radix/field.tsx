import { Label as LabelPrimitive, Slot } from "radix-ui";
import { withRef } from "../core/compat.js";
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
export const Group = withRef(function Group({
	asChild,
	...props
}: PhoneField.GroupProps) {
	const { state } = usePhoneFieldStateContext("PhoneField.Group");
	const Component = asChild ? Slot.Root : "div";
	return (
		<Component
			role="group"
			data-slot="phone-field-group"
			{...props}
			{...getStateDataAttributes(state)}
		/>
	);
});

/** Radix Label for the phone input. `htmlFor` follows the input's id automatically. */
export const Label = withRef(function Label(props: PhoneField.LabelProps) {
	const { state, controlId } = usePhoneFieldStateContext("PhoneField.Label");
	return (
		<LabelPrimitive.Root
			data-slot="phone-field-label"
			{...props}
			{...getStateDataAttributes(state)}
			htmlFor={controlId}
		/>
	);
});

/** Help text, linked to the input with `aria-describedby`. */
export const Description = withRef(function Description({
	asChild,
	id: idProp,
	...props
}: PhoneField.DescriptionProps) {
	const { state } = usePhoneFieldStateContext("PhoneField.Description");
	const id = useDescriptionId(idProp);
	const Component = asChild ? Slot.Root : "p";
	return (
		<Component
			data-slot="phone-field-description"
			{...props}
			{...getStateDataAttributes(state)}
			id={id}
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
			data-slot="phone-field-error"
			{...props}
			{...getStateDataAttributes(state)}
			id={id}
		>
			{renderErrorChildren(children, state)}
		</Component>
	);
});
