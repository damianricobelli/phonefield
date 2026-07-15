import type { PhoneField } from "phonefield";
import {
	buildValue,
	countries,
	fromFormData,
	getCountries,
	isValid,
	parse,
	toFormValue,
} from "phonefield/utils";

export function inspectPhone(value: PhoneField.Value, formData: FormData) {
	const parsed = parse(value);
	const extracted = parse("Call +1 415 555 2671", { extract: true });
	const unitedStates = getCountries("en").get("US");

	return {
		built: unitedStates ? buildValue(unitedStates, "4155552671", true) : null,
		defaultCountry: countries.get("US"),
		extracted,
		fromForm: fromFormData(formData, "phone"),
		isValid: isValid(value),
		parsed,
		serialized: toFormValue(value),
	};
}
