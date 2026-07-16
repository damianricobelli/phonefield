import { ChevronDownIcon } from "lucide-react";
import { PhoneField } from "phonefield";

const countryClassNames = {
	trigger:
		"group flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 text-sm shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring/50 data-popup-open:ring-2 data-popup-open:ring-ring/50",
	icon: "text-muted-foreground transition-transform group-data-popup-open:rotate-180",
	positioner: "z-50",
	popup:
		"w-[var(--anchor-width)] min-w-64 max-w-[var(--available-width)] overflow-hidden rounded-xl border bg-popover shadow-xl",
	searchInputContainer: "border-b p-2",
	searchInput:
		"h-9 w-full rounded-lg bg-muted px-3 text-sm outline-none focus:ring-2 focus:ring-ring",
	list: "max-h-64 overflow-y-auto p-1",
	item: "flex cursor-default items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none data-highlighted:bg-accent data-selected:bg-accent",
	empty: "p-6 text-center text-sm text-muted-foreground",
} satisfies PhoneField.CountryClassNames;

export function PhoneInputSeparated() {
	return (
		<PhoneField.Root
			defaultCountry="AR"
			name="phone"
			className="grid w-full max-w-lg gap-3 sm:grid-cols-[12rem_1fr]"
		>
			<div className="space-y-2">
				<span className="text-sm font-medium">Country</span>
				<PhoneField.Country
					classNames={countryClassNames}
					icon={<ChevronDownIcon className="size-4" />}
					renderCountryValue={(country) => (
						<span className="flex items-center gap-2">
							<span aria-hidden>{country.flag}</span>
							<span className="truncate">{country.name}</span>
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
			</div>

			<div className="space-y-2">
				<label htmlFor="separated-phone" className="text-sm font-medium">
					Phone number
				</label>
				<PhoneField.Input
					id="separated-phone"
					placeholder="11 4321-1234"
					className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring/50"
				/>
			</div>
		</PhoneField.Root>
	);
}
