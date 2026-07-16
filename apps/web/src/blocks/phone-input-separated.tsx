import { ChevronDownIcon } from "lucide-react";
import { PhoneField } from "phonefield";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";

const countryClassNames = {
	trigger:
		"group/phone-country-trigger flex h-10 w-fit items-center justify-between gap-3 rounded-lg border border-input bg-background px-3 text-sm shadow-sm outline-none transition-[border-color,box-shadow] duration-150 focus-visible:ring-2 focus-visible:ring-ring/50 data-popup-open:ring-2 data-popup-open:ring-ring/50",
	icon: "text-muted-foreground transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-popup-open/phone-country-trigger:rotate-180 motion-reduce:transition-none",
	positioner: "isolate z-50",
	popup:
		"group/phone-country w-[var(--anchor-width)] min-w-64 max-w-[var(--available-width)] origin-[var(--transform-origin)] overflow-hidden rounded-xl border bg-popover shadow-xl transition-[transform,opacity] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] data-ending-style:[transform:scale(0.97)] data-ending-style:opacity-0 data-starting-style:[transform:scale(0.97)] data-starting-style:opacity-0 motion-reduce:transform-none motion-reduce:transition-none",
	searchInputContainer: "border-b p-2",
	searchInput:
		"h-9 w-full rounded-lg bg-muted px-3 text-sm outline-none focus:ring-2 focus:ring-ring",
	list: "max-h-64 overflow-y-auto p-1",
	item: "flex cursor-default items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none transition-colors duration-100 data-highlighted:bg-accent data-selected:bg-accent",
	empty:
		"hidden w-full justify-center px-3 py-6 text-center text-sm text-muted-foreground group-data-empty/phone-country:flex",
} satisfies PhoneField.CountryClassNames;

export function PhoneInputSeparated() {
	return (
		<PhoneField.Root
			defaultCountry="AR"
			name="phone"
			className="grid w-full max-w-lg gap-3 sm:grid-cols-[max-content_minmax(0,1fr)]"
		>
			<Field className="w-fit">
				<FieldLabel htmlFor="separated-country">Country</FieldLabel>
				<PhoneField.Country
					classNames={countryClassNames}
					icon={<ChevronDownIcon className="size-4" />}
					slotProps={{
						trigger: { id: "separated-country", "aria-label": "Country" },
					}}
					renderCountryValue={(country) => (
						<span className="flex items-center gap-2">
							<span aria-hidden>{country.flag}</span>
							<span>{country.dialCode}</span>
							<span className="sr-only">{country.name}</span>
						</span>
					)}
					renderCountryItem={(country) => (
						<>
							<span aria-hidden>{country.flag}</span>
							<span className="min-w-0 flex-1 truncate">{country.name}</span>
							<span className="text-muted-foreground">{country.dialCode}</span>
						</>
					)}
				/>
			</Field>

			<Field>
				<FieldLabel htmlFor="separated-phone">Phone number</FieldLabel>
				<InputGroup className="h-10 bg-background shadow-sm">
					<PhoneField.Input
						render={<InputGroupInput />}
						id="separated-phone"
						placeholder="11 4321-1234"
						className="h-full px-3"
					/>
				</InputGroup>
			</Field>
		</PhoneField.Root>
	);
}
