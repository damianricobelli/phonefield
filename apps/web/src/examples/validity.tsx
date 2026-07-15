import { Field } from "@base-ui/react/field";
import { PhoneField } from "phonefield";
import * as React from "react";

export function ValidatedPhone() {
	const [value, setValue] = React.useState<PhoneField.InputValue>({
		countryIso2: "US",
		nationalNumber: "",
	});
	const [isValid, setIsValid] = React.useState(true);

	return (
		<Field.Root invalid={!isValid} className="space-y-2">
			<Field.Label>Phone</Field.Label>
			<PhoneField.Root
				value={value}
				onValueChange={(nextValue) => {
					setValue(nextValue);
					setIsValid(!nextValue.nationalNumber || nextValue.isValid);
				}}
			>
				<PhoneField.Country />
				<PhoneField.Input className="data-invalid:border-red-500" />
			</PhoneField.Root>
			<Field.Error match={!isValid}>Invalid phone number</Field.Error>
		</Field.Root>
	);
}
