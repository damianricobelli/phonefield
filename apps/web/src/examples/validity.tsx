import { PhoneField } from "phonefield";

export function ValidatedPhone({ serverError }: { serverError?: string }) {
	return (
		<PhoneField.Root
			name="phone"
			required
			invalid={!!serverError}
			className="space-y-1.5"
		>
			<PhoneField.Label>Phone</PhoneField.Label>
			<PhoneField.Group className="flex rounded-lg border data-focused:ring-2 data-invalid:border-red-500">
				<PhoneField.Country />
				<PhoneField.Input />
			</PhoneField.Group>
			<PhoneField.Description>We'll text you a code.</PhoneField.Description>
			<PhoneField.Error className="text-sm text-red-600">
				{(state) =>
					serverError ??
					(state.filled ? "Enter a valid number." : "Phone is required.")
				}
			</PhoneField.Error>
		</PhoneField.Root>
	);
}
