import * as Slot from "radix-ui/slot";
import { usePhoneFieldInput } from "../core/input.js";
import type { PhoneField } from "./component.js";

/** Number input bound to the selected country. */
export function Input({ asChild, ...props }: PhoneField.InputProps) {
	const Component = asChild ? Slot.Root : "input";
	return <Component {...usePhoneFieldInput(props)} />;
}
