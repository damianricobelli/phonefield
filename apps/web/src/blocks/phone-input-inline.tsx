import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { PhoneField } from "phonefield";

const countryClassNames = {
	trigger:
		"group flex h-full shrink-0 items-center gap-2 border-r border-input px-3 text-sm outline-none transition-colors hover:bg-accent focus-visible:bg-accent data-popup-open:bg-accent",
	icon: "text-muted-foreground transition-transform group-data-popup-open:rotate-180",
	positioner: "z-50",
	popup:
		"w-72 max-w-[var(--available-width)] overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-xl",
	searchInputContainer: "border-b p-2",
	searchInput:
		"h-9 w-full rounded-lg bg-muted px-3 text-sm outline-none focus:ring-2 focus:ring-ring",
	list: "max-h-64 overflow-y-auto p-1",
	item: "group flex cursor-default items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none data-highlighted:bg-accent data-selected:bg-accent",
	empty: "p-6 text-center text-sm text-muted-foreground",
} satisfies PhoneField.CountryClassNames;

export function PhoneInputInline() {
	return (
		<div className="w-full max-w-md space-y-2">
			<label htmlFor="inline-phone" className="text-sm font-medium">
				Phone number
			</label>
			<PhoneField.Root
				defaultCountry="US"
				name="phone"
				className="flex h-10 overflow-hidden rounded-lg border border-input bg-background shadow-sm transition focus-within:ring-2 focus-within:ring-ring/50 has-data-popup-open:ring-2 has-data-popup-open:ring-ring/50"
			>
				<PhoneField.Country
					classNames={countryClassNames}
					icon={<ChevronDownIcon className="size-4" />}
					slotProps={{ trigger: { "aria-label": "Country" } }}
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
							<CheckIcon className="hidden size-4 group-data-selected:block" />
						</>
					)}
				/>
				<PhoneField.Input
					id="inline-phone"
					placeholder="(202) 555-0123"
					className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
				/>
			</PhoneField.Root>
			<p className="text-xs text-muted-foreground">
				Best for settings, profiles, and compact forms.
			</p>
		</div>
	);
}
