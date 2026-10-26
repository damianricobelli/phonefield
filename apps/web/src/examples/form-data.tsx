import { PhoneField } from "phonefield";
import { fromFormData } from "phonefield/utils";
import { Button } from "@/components/ui/button";

export function ContactForm() {
	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				const phone = fromFormData(new FormData(event.currentTarget), "phone");
				console.log(phone?.e164, phone?.isValid);
			}}
		>
			{/* Submitting shows the error without a prior blur; reset restores the value. */}
			<PhoneField.Root name="phone" defaultCountry="US" required>
				<PhoneField.Label>Phone</PhoneField.Label>
				<PhoneField.Country />
				<PhoneField.Input />
				<PhoneField.Error />
			</PhoneField.Root>
			<Button type="reset" variant="outline">
				Reset
			</Button>
			<Button type="submit">Continue</Button>
		</form>
	);
}

// The same helper runs on the server. Never trust client-derived fields.
export function parseSubmittedPhone(formData: FormData) {
	const phone = fromFormData(formData, "phone");
	return phone?.isValid ? phone.e164 : null;
}
