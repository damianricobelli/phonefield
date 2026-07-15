import { PhoneField } from "phonefield";
import { fromFormData } from "phonefield/utils";

export function ContactForm() {
	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				const phone = fromFormData(new FormData(event.currentTarget), "phone");
				console.log(phone);
			}}
		>
			<PhoneField.Root name="phone" defaultCountry="US">
				<PhoneField.Country />
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>
			<button type="submit">Continue</button>
		</form>
	);
}

// The same helper is server-compatible.
export function parseSubmittedPhone(formData: FormData) {
	return fromFormData(formData, "phone");
}
