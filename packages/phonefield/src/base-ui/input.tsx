import { Input as BaseInput } from "@base-ui/react/input";
import { withRef } from "../core/compat.js";
import { usePhoneFieldInput } from "../core/input.js";
import type { PhoneField } from "./component.js";

/** Number input bound to the selected country. */
export const Input = withRef(function Input(props: PhoneField.InputProps) {
	return <BaseInput {...usePhoneFieldInput(props)} />;
});
