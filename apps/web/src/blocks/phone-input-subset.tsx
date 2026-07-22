import { ChevronDownIcon } from "lucide-react";
import { PhoneField } from "phonefield";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";

const LATAM_COUNTRIES = ["AR", "BR", "CL", "CO", "MX", "US"] as const;

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

export function PhoneInputSubset() {
	return (
		<Field className="w-full max-w-md">
			<FieldLabel htmlFor="latam-phone">Teléfono de contacto</FieldLabel>
			<PhoneField.Root
				countries={LATAM_COUNTRIES}
				defaultCountry="AR"
				lang="es-AR"
				name="phone"
				className="w-full"
			>
				<InputGroup className="h-10 overflow-hidden bg-background shadow-sm">
					<PhoneField.Input
						render={<InputGroupInput />}
						id="latam-phone"
						placeholder="11 4321-1234"
						className="h-full px-3"
					/>
					<InputGroupAddon
						align="inline-start"
						className="h-full cursor-default p-0"
					>
						<PhoneField.Country
							inputPlaceholder="Buscar país"
							noResultsText="Sin resultados"
							classNames={countryClassNames}
							icon={<ChevronDownIcon className="size-4" />}
							slotProps={{ trigger: { "aria-label": "País" } }}
							renderCountryValue={(country) => (
								<>
									<span aria-hidden>{country.flag}</span>
									<span>{country.dialCode}</span>
								</>
							)}
							renderCountryItem={(country) => (
								<>
									<span aria-hidden>{country.flag}</span>
									<span className="min-w-0 flex-1 truncate">
										{country.name}
									</span>
									<span className="text-muted-foreground">
										{country.dialCode}
									</span>
								</>
							)}
						/>
					</InputGroupAddon>
				</InputGroup>
			</PhoneField.Root>
			<FieldDescription className="text-xs">
				Lista acotada y nombres localizados en español.
			</FieldDescription>
		</Field>
	);
}
