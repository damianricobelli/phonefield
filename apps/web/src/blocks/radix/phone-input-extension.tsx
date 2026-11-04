import { PhoneField } from "phonefield/radix";
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
				<PhoneField.Root asChild countries={["US"]} name="phone">
					<Field>
						<PhoneField.Label asChild>
							<FieldLabel>Phone number</FieldLabel>
						</PhoneField.Label>
						<PhoneField.Group asChild className="h-10 bg-background shadow-sm">
							<InputGroup>
								<InputGroupAddon align="inline-start" className="pr-2">
									<span aria-hidden>🇺🇸</span> +1
								</InputGroupAddon>
								<PhoneField.Input
									asChild
									placeholder="(202) 555-0123"
									className="h-full px-3"
								>
									<InputGroupInput />
								</PhoneField.Input>
							</InputGroup>
						</PhoneField.Group>
					</Field>
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
