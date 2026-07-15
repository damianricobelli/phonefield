import { PhoneField } from "phonefield";

export function NorthAmericaPhone() {
	return (
		<PhoneField.Root countries={["US", "CA", "MX"]}>
			<PhoneField.Country />
			<PhoneField.Input aria-label="Phone number" />
		</PhoneField.Root>
	);
}
