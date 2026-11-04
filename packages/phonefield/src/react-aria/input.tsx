import { Input as AriaInput } from "react-aria-components/Input";
import { usePhoneFieldInput } from "../core/input.js";
import type { PhoneField } from "./component.js";

/** React Aria Input bound to the selected country. */
export function Input(props: PhoneField.InputProps) {
	return <AriaInput {...usePhoneFieldInput(props)} />;
}
