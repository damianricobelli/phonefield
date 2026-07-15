import { PhoneField } from "phonefield";

export function SignupPhone() {
	return (
		<PhoneField.Root defaultCountry="US" lang="en">
			<PhoneField.Country />
			<PhoneField.Input aria-label="Phone number" />
		</PhoneField.Root>
	);
}
