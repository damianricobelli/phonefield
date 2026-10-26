import { PhoneField } from "phonefield";

// Root is a plain wrapper. Group is the visual shell and mirrors field state
// as data attributes, so no React state is needed.
export function StatefulPhone() {
	return (
		<PhoneField.Root required className="grid gap-1.5">
			<PhoneField.Label>Phone</PhoneField.Label>
			<PhoneField.Group className="flex rounded-lg border data-focused:ring-2 data-invalid:border-red-500 data-disabled:opacity-50">
				<PhoneField.Country />
				<PhoneField.Input className="flex-1 px-3 outline-none" />
			</PhoneField.Group>
			<PhoneField.Error className="text-sm text-red-600" />
		</PhoneField.Root>
	);
}

// className and style also accept a function of PhoneField.State.
export function StatusPhone() {
	return (
		<PhoneField.Root>
			<PhoneField.Group
				className={(state) => (state.valid ? "phone phone--valid" : "phone")}
			>
				<PhoneField.Country />
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Group>
		</PhoneField.Root>
	);
}
