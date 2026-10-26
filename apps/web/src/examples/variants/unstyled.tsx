import { PhoneField } from "phonefield";

export function UnstyledPhoneField() {
	return (
		<PhoneField.Root defaultCountry="CA">
			<PhoneField.Country />
			<PhoneField.Input aria-label="Phone number" />
		</PhoneField.Root>
	);
}
