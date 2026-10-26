import { PhoneField } from "phonefield";

export function SignupPhone() {
	return (
		<PhoneField.Root defaultCountry="US">
			<PhoneField.Country />
			<PhoneField.Input aria-label="Phone number" />
		</PhoneField.Root>
	);
}
