import { PhoneField } from "phonefield";
import * as React from "react";

export function ValidatedPhone() {
	const phoneInputId = React.useId();
	const phoneErrorId = `${phoneInputId}-error`;
	const [value, setValue] = React.useState<PhoneField.InputValue>({
		countryIso2: "US",
		nationalNumber: "",
	});
	const [isValid, setIsValid] = React.useState(true);

	return (
		<div className="space-y-2">
			<label htmlFor={phoneInputId}>Phone</label>
			<PhoneField.Root
				value={value}
				onValueChange={(nextValue) => {
					setValue(nextValue);
					setIsValid(!nextValue.nationalNumber || nextValue.isValid);
				}}
			>
				<PhoneField.Country
					slotProps={{
						trigger: {
							"aria-label": "Country",
						},
					}}
				/>
				<PhoneField.Input
					aria-describedby={!isValid ? phoneErrorId : undefined}
					aria-invalid={!isValid || undefined}
					id={phoneInputId}
					className="aria-invalid:border-red-500"
				/>
			</PhoneField.Root>
			{!isValid ? (
				<p id={phoneErrorId} role="alert">
					Invalid phone number
				</p>
			) : null}
		</div>
	);
}
