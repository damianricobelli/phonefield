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
		<PhoneField.Root
			countries={["US"]}
			name="phone"
			render={<Field />}
			className="w-full max-w-md"
		>
			<div className="flex items-center justify-between gap-3">
				<PhoneField.Label render={<FieldLabel />}>
					US phone number
				</PhoneField.Label>
				<span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
					<LockIcon className="size-3" /> Fixed region
				</span>
			</div>
			<PhoneField.Group
				render={<InputGroup />}
				className="h-10 bg-background shadow-sm"
			>
				<InputGroupAddon align="inline-start" className="pr-2">
					<span aria-hidden>🇺🇸</span>
					<span>+1</span>
				</InputGroupAddon>
				<PhoneField.Input
					render={<InputGroupInput />}
					placeholder="(202) 555-0123"
					className="h-full px-3"
				/>
			</PhoneField.Group>
			<PhoneField.Description render={<FieldDescription />} className="text-xs">
				No country picker when the market is already known.
			</PhoneField.Description>
		</PhoneField.Root>
	);
}
