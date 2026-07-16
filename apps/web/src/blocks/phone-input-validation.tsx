import { ChevronDownIcon } from "lucide-react";
import { PhoneField } from "phonefield";
import * as React from "react";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";

const countryClassNames = {
	trigger:
		"group/phone-country-trigger flex h-full w-fit shrink-0 items-center gap-2 border-r border-input px-3 text-sm outline-none transition-colors duration-150 hover:bg-accent focus-visible:bg-accent data-popup-open:bg-accent",
	icon: "text-muted-foreground transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-popup-open/phone-country-trigger:rotate-180 motion-reduce:transition-none",
	positioner: "isolate z-50",
	popup:
		"group/phone-country w-72 max-w-[var(--available-width)] origin-[var(--transform-origin)] overflow-hidden rounded-xl border bg-popover shadow-xl transition-[transform,opacity] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] data-ending-style:[transform:scale(0.97)] data-ending-style:opacity-0 data-starting-style:[transform:scale(0.97)] data-starting-style:opacity-0 motion-reduce:transform-none motion-reduce:transition-none",
	searchInputContainer: "border-b p-2",
	searchInput:
		"h-9 w-full rounded-lg bg-muted px-3 text-sm outline-none focus:ring-2 focus:ring-ring",
	list: "max-h-64 overflow-y-auto p-1",
	item: "flex cursor-default items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none data-highlighted:bg-accent data-selected:bg-accent",
	empty:
		"hidden justify-center px-3 py-6 text-sm text-muted-foreground group-data-empty/phone-country:flex",
} satisfies PhoneField.CountryClassNames;

export function PhoneInputValidation() {
	const inputId = React.useId();
	const errorId = `${inputId}-error`;
	const [touched, setTouched] = React.useState(false);
	const [value, setValue] = React.useState<PhoneField.Value>({
		countryIso2: "US",
		countryDialCode: "+1",
		nationalNumber: "",
		e164: null,
		isValid: false,
	});
	const invalid =
		touched && (!value.nationalNumber.trim().length || !value.isValid);

	return (
		<Field data-invalid={invalid || undefined} className="w-full max-w-md">
			<FieldLabel htmlFor={inputId}>Phone number</FieldLabel>
			<PhoneField.Root
				value={value}
				onValueChange={setValue}
				className="flex h-10 overflow-hidden rounded-lg border border-input bg-background shadow-sm focus-within:ring-2 focus-within:ring-ring/50 has-aria-invalid:border-destructive has-aria-invalid:ring-2 has-aria-invalid:ring-destructive/20"
			>
				<PhoneField.Country
					classNames={countryClassNames}
					icon={<ChevronDownIcon className="size-4" />}
					slotProps={{ trigger: { "aria-label": "Country" } }}
					renderCountryValue={(country) => (
						<>
							<span aria-hidden>{country.flag}</span>
							<span>{country.dialCode}</span>
						</>
					)}
					renderCountryItem={(country) => (
						<>
							<span aria-hidden>{country.flag}</span>
							<span className="min-w-0 flex-1 truncate">{country.name}</span>
							<span className="text-muted-foreground">{country.dialCode}</span>
						</>
					)}
				/>
				<PhoneField.Input
					id={inputId}
					aria-describedby={invalid ? errorId : undefined}
					aria-invalid={invalid || undefined}
					onBlur={() => setTouched(true)}
					placeholder="(202) 555-0123"
					className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
				/>
			</PhoneField.Root>
			{invalid ? (
				<FieldError id={errorId}>
					{value.nationalNumber ? "Enter a valid number" : "Phone is required"}
				</FieldError>
			) : (
				<FieldDescription>Used for delivery updates.</FieldDescription>
			)}
		</Field>
	);
}
