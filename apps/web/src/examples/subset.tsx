import { PhoneField } from "phonefield";

// Only these countries, in this order.
export function NorthAmericaPhone() {
	return (
		<PhoneField.Root countries={["US", "CA", "MX"]}>
			<PhoneField.Country />
			<PhoneField.Input aria-label="Phone number" />
		</PhoneField.Root>
	);
}

// Every country, with these pinned to the top.
export function PinnedPhone() {
	return (
		<PhoneField.Root preferredCountries={["US", "GB"]}>
			<PhoneField.Country />
			<PhoneField.Input aria-label="Phone number" />
		</PhoneField.Root>
	);
}
