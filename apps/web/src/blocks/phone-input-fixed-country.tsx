import { LockIcon } from "lucide-react";
import { PhoneField } from "phonefield";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";

export function PhoneInputFixedCountry() {
	return (
		<Field className="w-full max-w-md">
			<div className="flex items-center justify-between gap-3">
				<FieldLabel htmlFor="fixed-country-phone">US phone number</FieldLabel>
				<span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
					<LockIcon className="size-3" /> Fixed region
				</span>
			</div>
			<PhoneField.Root
				defaultCountry="US"
				countries={["US"]}
				name="phone"
				className="w-full"
			>
				<InputGroup className="h-10 bg-background shadow-sm">
					<InputGroupAddon className="border-r border-input pr-3">
						<span aria-hidden>🇺🇸</span>
						<span>+1</span>
					</InputGroupAddon>
					<PhoneField.Input
						render={<InputGroupInput />}
						id="fixed-country-phone"
						placeholder="(202) 555-0123"
						className="h-full px-3"
					/>
				</InputGroup>
			</PhoneField.Root>
			<FieldDescription className="text-xs">
				No country picker when the market is already known.
			</FieldDescription>
		</Field>
	);
}
