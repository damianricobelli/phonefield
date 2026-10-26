import { PhoneField } from "phonefield";
import * as React from "react";

export function CheckoutPhone() {
	const [phone, setPhone] = React.useState<PhoneField.InputValue>({
		countryIso2: "US",
		nationalNumber: "",
	});

	return (
		<PhoneField.Root
			value={phone}
			onValueChange={(next, { reason }) => {
				setPhone(next);
				if (reason === "paste") console.log("Pasted", next.e164);
			}}
		>
			<PhoneField.Country />
			<PhoneField.Input aria-label="Phone number" />
		</PhoneField.Root>
	);
}
