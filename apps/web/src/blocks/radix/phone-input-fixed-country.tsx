import { LockIcon } from "lucide-react";
import { PhoneField } from "phonefield/radix";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";

export function PhoneInputFixedCountry() {
	return (
		<PhoneField.Root
			asChild
			countries={["US"]}
			name="phone"
			className="w-full max-w-md"
		>
			<Field>
				<div className="flex items-center justify-between gap-3">
					<PhoneField.Label asChild>
						<FieldLabel>US phone number</FieldLabel>
					</PhoneField.Label>
					<span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
						<LockIcon className="size-3" /> Fixed region
					</span>
				</div>
				<PhoneField.Group asChild className="h-10 bg-background shadow-sm">
					<InputGroup>
						<InputGroupAddon align="inline-start" className="pr-2">
							<span aria-hidden>🇺🇸</span>
							<span>+1</span>
						</InputGroupAddon>
						<PhoneField.Input
							data-slot="input-group-control"
							asChild
							placeholder="(202) 555-0123"
							className="h-full px-3"
						>
							<InputGroupInput />
						</PhoneField.Input>
					</InputGroup>
				</PhoneField.Group>
				<PhoneField.Description asChild className="text-xs">
					<FieldDescription>
						No country picker when the market is already known.
					</FieldDescription>
				</PhoneField.Description>
			</Field>
		</PhoneField.Root>
	);
}
