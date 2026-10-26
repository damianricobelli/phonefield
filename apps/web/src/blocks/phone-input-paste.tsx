import { ClipboardPasteIcon } from "lucide-react";
import { PhoneField, usePhoneField } from "phonefield";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";

export function PhoneInputPaste() {
	return (
		<PhoneField.Root
			defaultCountry="US"
			render={<Field />}
			className="w-full max-w-md"
		>
			<PhoneField.Label render={<FieldLabel />}>
				Paste an international number
			</PhoneField.Label>
			<PhoneField.Group
				render={<InputGroup />}
				className="h-10 bg-background shadow-sm"
			>
				<InputGroupAddon align="inline-start" className="min-w-20 pr-2">
					<SelectedCountry />
				</InputGroupAddon>
				<PhoneField.Input
					render={<InputGroupInput />}
					placeholder="Try +54 11 4321 1234"
					className="h-full px-3"
				/>
			</PhoneField.Group>
			<PhoneField.Description
				render={<FieldDescription />}
				className="flex items-center gap-2 text-xs"
			>
				<ClipboardPasteIcon className="size-3.5" />
				<PasteStatus />
			</PhoneField.Description>
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
