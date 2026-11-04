import { ClipboardPasteIcon } from "lucide-react";
import { PhoneField, usePhoneField } from "phonefield/radix";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";

export function PhoneInputPaste() {
	return (
		<PhoneField.Root asChild defaultCountry="US" className="w-full max-w-md">
			<Field>
				<PhoneField.Label asChild>
					<FieldLabel>Paste an international number</FieldLabel>
				</PhoneField.Label>
				<PhoneField.Group asChild className="h-10 bg-background shadow-sm">
					<InputGroup>
						<InputGroupAddon align="inline-start" className="min-w-20 pr-2">
							<SelectedCountry />
						</InputGroupAddon>
						<PhoneField.Input
							asChild
							placeholder="Try +54 11 4321 1234"
							className="h-full px-3"
						>
							<InputGroupInput />
						</PhoneField.Input>
					</InputGroup>
				</PhoneField.Group>
				<PhoneField.Description
					asChild
					className="flex items-center gap-2 text-xs"
				>
					<FieldDescription>
						<ClipboardPasteIcon className="size-3.5" />
						<PasteStatus />
					</FieldDescription>
				</PhoneField.Description>
			</Field>
		</PhoneField.Root>
	);
}

function SelectedCountry() {
	const { country } = usePhoneField();

	return (
		<>
			<span aria-hidden>{country.flag}</span>
			<span>{country.dialCode}</span>
		</>
	);
}

function PasteStatus() {
	const { value, state } = usePhoneField();

	return state.filled ? (
		<span>
			Detected {value.countryIso2} · {value.e164 ?? "Incomplete"}
		</span>
	) : (
		<span>The country updates from a pasted + prefix.</span>
	);
}
