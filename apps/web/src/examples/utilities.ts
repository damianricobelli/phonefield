import type { PhoneField } from "phonefield";
import {
	buildValue,
	countries,
	fromFormData,
	getCountries,
	getExampleNumber,
	isValid,
	parse,
	toFormValue,
} from "phonefield/utils";

export function inspectPhone(value: PhoneField.Value, formData: FormData) {
	const unitedStates = getCountries("en").get("US");

	return {
		built: unitedStates ? buildValue(unitedStates, "4155552671", true) : null,
		defaultCountry: countries.get("US"),
		example: getExampleNumber("GB", "international"), // "+44 7400 123456"
		extracted: parse("Call +1 415 555 2671", { extract: true }),
		fromForm: fromFormData(formData, "phone"),
		isValid: isValid(value),
		national: parse("(415) 555-2671", { defaultCountry: "US" }),
		parsed: parse(value),
		serialized: toFormValue(value),
	};
}
