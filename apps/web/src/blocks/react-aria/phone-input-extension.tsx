import { PhoneField } from "phonefield/react-aria";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";

export function PhoneInputExtension() {
	return (
		<FieldGroup className="w-full max-w-lg gap-2">
			<div className="grid grid-cols-[minmax(0,1fr)_6.5rem] gap-2">
				<PhoneField.Root
					countries={["US"]}
					name="phone"
					render={(props) => <Field {...props} />}
				>
					<PhoneField.Label render={(props) => <FieldLabel {...props} />}>
						Phone number
					</PhoneField.Label>
					<PhoneField.Group
						render={(props) => <InputGroup {...props} />}
						className="h-10 bg-background shadow-sm"
					>
						<InputGroupAddon align="inline-start" className="pr-2">
							<span aria-hidden>🇺🇸</span> +1
						</InputGroupAddon>
						<PhoneField.Input
							data-slot="input-group-control"
							render={(props) => <InputGroupInput {...props} />}
							placeholder="(202) 555-0123"
							className="h-full px-3"
						/>
					</PhoneField.Group>
				</PhoneField.Root>

				<Field>
					<FieldLabel htmlFor="phone-extension">Extension</FieldLabel>
					<InputGroup className="h-10 bg-background shadow-sm">
						<InputGroupAddon align="inline-start">ext.</InputGroupAddon>
						<InputGroupInput
							id="phone-extension"
							name="extension"
							inputMode="numeric"
							placeholder="123"
							className="h-full"
						/>
					</InputGroup>
				</Field>
			</div>
			<FieldDescription className="text-xs">
				Keep the extension separate from the canonical E.164 phone value.
			</FieldDescription>
		</FieldGroup>
	);
}
