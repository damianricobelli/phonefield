import { PhoneField } from "phonefield";

export function AccountPhone() {
	return (
		<PhoneField.Root name="phone" required>
			<PhoneField.Label>Phone</PhoneField.Label>
			<PhoneField.Group>
				<PhoneField.Country />
				<PhoneField.Input />
			</PhoneField.Group>
			<PhoneField.Description>Used for sign-in codes.</PhoneField.Description>
			<PhoneField.Error />
		</PhoneField.Root>
	);
}
