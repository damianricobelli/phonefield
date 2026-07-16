import { ClipboardPasteIcon } from "lucide-react";
import { PhoneField } from "phonefield";
import { getCountries } from "phonefield/utils";
import * as React from "react";

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
		<div className="w-full max-w-md space-y-2">
			<label htmlFor="paste-phone" className="text-sm font-medium">
				Paste an international number
			</label>
			<PhoneField.Root
				value={value}
				onValueChange={setValue}
				className="flex h-10 overflow-hidden rounded-lg border border-input bg-background shadow-sm focus-within:ring-2 focus-within:ring-ring/50"
			>
				<span className="flex min-w-20 shrink-0 items-center gap-2 border-r border-input bg-muted/50 px-3 text-sm">
					<span aria-hidden>{country?.flag}</span>
					<span>{country?.dialCode}</span>
				</span>
				<PhoneField.Input
					id="paste-phone"
					placeholder="Try +54 11 4321 1234"
					className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
				/>
			</PhoneField.Root>
			<div className="flex items-center gap-2 text-xs text-muted-foreground">
				<ClipboardPasteIcon className="size-3.5" />
				{value.nationalNumber ? (
					<span>
						Detected {value.countryIso2} · {value.e164 ?? "Incomplete"}
					</span>
				) : (
					<span>The country updates from a pasted + prefix.</span>
				)}
			</div>
		</div>
	);
}
