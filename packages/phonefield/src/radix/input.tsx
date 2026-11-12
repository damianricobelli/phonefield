import { Slot } from "radix-ui";
import { withRef } from "../core/compat.js";
import { usePhoneFieldInput } from "../core/input.js";
import type { PhoneField } from "./component.js";

/** Number input bound to the selected country. */
export const Input = withRef(function Input({
	asChild,
	...props
}: PhoneField.InputProps) {
	const Component = asChild ? Slot.Root : "input";
	return <Component {...usePhoneFieldInput(props)} />;
});
