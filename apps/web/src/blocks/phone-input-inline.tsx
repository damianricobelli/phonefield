import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { PhoneField } from "phonefield";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const countryClassNames = {
	trigger:
		"group/phone-country-trigger flex h-full shrink-0 items-center gap-2 border-r border-input px-3 text-sm outline-none transition-colors duration-150 hover:bg-accent focus-visible:bg-accent data-popup-open:bg-accent",
	icon: "text-muted-foreground transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-popup-open/phone-country-trigger:rotate-180 motion-reduce:transition-none",
	positioner: "isolate z-50",
	popup:
		"group/phone-country w-72 max-w-[var(--available-width)] origin-[var(--transform-origin)] overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-xl transition-[transform,opacity] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] data-ending-style:[transform:scale(0.97)] data-ending-style:opacity-0 data-starting-style:[transform:scale(0.97)] data-starting-style:opacity-0 motion-reduce:transform-none motion-reduce:transition-none",
	searchInputContainer: "border-b p-2",
	searchInput:
		"h-9 w-full rounded-lg bg-muted px-3 text-sm outline-none focus:ring-2 focus:ring-ring",
	list: "max-h-64 overflow-y-auto p-1",
	item: "group flex cursor-default items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none transition-colors duration-100 data-highlighted:bg-accent data-selected:bg-accent",
	empty:
		"hidden w-full justify-center px-3 py-6 text-center text-sm text-muted-foreground group-data-empty/phone-country:flex",
} satisfies PhoneField.CountryClassNames;

export function PhoneInputInline() {
	return (
		<Field className="w-full max-w-md">
			<FieldLabel htmlFor="inline-phone">Phone number</FieldLabel>
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
					render={<Input />}
					id="inline-phone"
					placeholder="(202) 555-0123"
					className="h-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-3 shadow-none focus-visible:ring-0 dark:bg-transparent"
				/>
			</PhoneField.Root>
			<FieldDescription className="text-xs">
				Best for settings, profiles, and compact forms.
			</FieldDescription>
		</Field>
	);
}
