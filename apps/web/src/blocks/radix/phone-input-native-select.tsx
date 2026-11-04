import { ChevronDownIcon } from "lucide-react";
import { PhoneField, usePhoneField } from "phonefield/radix";
import { getExampleNumber } from "phonefield/utils";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";

export function PhoneInputNativeSelect() {
	return (
		<PhoneField.Root
			asChild
			defaultCountry="US"
			name="phone"
			className="w-full max-w-md"
		>
			<Field>
				<PhoneField.Label asChild>
					<FieldLabel>Phone number</FieldLabel>
				</PhoneField.Label>
				<PhoneField.Group
					asChild
					className="h-10 overflow-hidden bg-background shadow-sm"
				>
					<InputGroup>
						<NativeCountrySelect />
						<PhoneField.Input
							asChild
							placeholder={(country) => getExampleNumber(country.iso2)}
							className="h-full px-3"
						>
							<InputGroupInput />
						</PhoneField.Input>
					</InputGroup>
				</PhoneField.Group>
				<PhoneField.Description asChild className="text-xs">
					<FieldDescription>
						The operating system's own picker, with no popup to style.
					</FieldDescription>
				</PhoneField.Description>
			</Field>
		</PhoneField.Root>
	);
}

// An invisible <select> covers the flag and dial code, so taps and keyboard
// focus land on the native control while the field keeps its compact look.
function NativeCountrySelect() {
	const { country, countries, setCountry, state } = usePhoneField();

	return (
		<span className="relative flex h-full shrink-0 items-center gap-2 border-input border-r px-3 text-sm transition-colors duration-150 hover:bg-accent has-focus-visible:bg-accent">
			<span aria-hidden>{country.flag}</span>
			<span>{country.dialCode}</span>
			<ChevronDownIcon aria-hidden className="size-4 text-muted-foreground" />
			<select
				aria-label="Country"
				value={country.iso2}
				onChange={(event) => setCountry(event.target.value)}
				disabled={state.disabled || state.readOnly}
				className="absolute inset-0 cursor-pointer appearance-none opacity-0 disabled:cursor-not-allowed"
			>
				{countries.map((option) => (
					// Names come from Intl, whose data can differ between server and browser.
					<option
						key={option.iso2}
						value={option.iso2}
						suppressHydrationWarning
					>
						{`${option.name} (${option.dialCode})`}
					</option>
				))}
			</select>
		</span>
	);
}
