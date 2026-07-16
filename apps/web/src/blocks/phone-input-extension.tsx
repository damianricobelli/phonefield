import { PhoneField } from "phonefield";
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
				<Field>
					<FieldLabel htmlFor="extension-phone">Phone number</FieldLabel>
					<PhoneField.Root
						defaultCountry="US"
						countries={["US"]}
						name="phone"
						className="w-full"
					>
						<InputGroup className="h-10 bg-background shadow-sm">
							<PhoneField.Input
								render={<InputGroupInput />}
								id="extension-phone"
								placeholder="(202) 555-0123"
								className="h-full px-3"
							/>
							<InputGroupAddon align="inline-start" className="pr-2">
								<span aria-hidden>🇺🇸</span> +1
							</InputGroupAddon>
						</InputGroup>
					</PhoneField.Root>
				</Field>

				<Field>
					<FieldLabel htmlFor="phone-extension">Extension</FieldLabel>
					<InputGroup className="h-10 bg-background shadow-sm">
						<InputGroupInput
							id="phone-extension"
							name="extension"
							inputMode="numeric"
							placeholder="123"
							className="h-full"
						/>
						<InputGroupAddon align="inline-start">ext.</InputGroupAddon>
					</InputGroup>
				</Field>
			</div>
			<FieldDescription className="text-xs">
				Keep the extension separate from the canonical E.164 phone value.
			</FieldDescription>
		</FieldGroup>
	);
}
