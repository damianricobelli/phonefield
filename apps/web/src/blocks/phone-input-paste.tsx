import { ClipboardPasteIcon } from "lucide-react";
import { PhoneField } from "phonefield";
import { getCountries } from "phonefield/utils";
import * as React from "react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";

const countries = getCountries();

export function PhoneInputPaste() {
	const [value, setValue] = React.useState<PhoneField.Value>({
		countryIso2: "US",
		countryDialCode: "+1",
		nationalNumber: "",
		e164: null,
		isValid: false,
	});
	const country = countries.get(value.countryIso2);

	return (
		<Field className="w-full max-w-md">
			<FieldLabel htmlFor="paste-phone">
				Paste an international number
			</FieldLabel>
			<PhoneField.Root
				value={value}
				onValueChange={setValue}
				className="w-full"
			>
				<InputGroup className="h-10 bg-background shadow-sm">
					<InputGroupAddon className="min-w-20 border-r border-input pr-3">
						<span aria-hidden>{country?.flag}</span>
						<span>{country?.dialCode}</span>
					</InputGroupAddon>
					<PhoneField.Input
						render={<InputGroupInput />}
						id="paste-phone"
						placeholder="Try +54 11 4321 1234"
						className="h-full px-3"
					/>
				</InputGroup>
			</PhoneField.Root>
			<FieldDescription className="flex items-center gap-2 text-xs">
				<ClipboardPasteIcon className="size-3.5" />
				{value.nationalNumber ? (
					<span>
						Detected {value.countryIso2} · {value.e164 ?? "Incomplete"}
					</span>
				) : (
					<span>The country updates from a pasted + prefix.</span>
				)}
			</FieldDescription>
		</Field>
	);
}
