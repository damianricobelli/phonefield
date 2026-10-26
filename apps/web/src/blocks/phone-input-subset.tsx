import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { PhoneField } from "phonefield";
import { getExampleNumber } from "phonefield/utils";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";

const LATAM_COUNTRIES = [
	"AR",
	"BO",
	"BR",
	"CL",
	"CO",
	"CR",
	"DO",
	"EC",
	"GT",
	"HN",
	"MX",
	"NI",
	"PA",
	"PE",
	"PY",
	"SV",
	"UY",
] as const;
const PREFERRED_COUNTRIES = ["AR", "BR", "MX"] as const;

export function PhoneInputSubset() {
	return (
		<PhoneField.Root
			countries={LATAM_COUNTRIES}
			preferredCountries={PREFERRED_COUNTRIES}
			defaultCountry="AR"
			lang="es-AR"
			name="phone"
			render={<Field />}
			className="w-full max-w-md"
		>
			<PhoneField.Label render={<FieldLabel />}>
				Teléfono de contacto
			</PhoneField.Label>
			<PhoneField.Group
				render={<InputGroup />}
				className="h-10 overflow-hidden bg-background shadow-sm"
			>
				<CountrySelect />
				<PhoneField.Input
					render={<InputGroupInput />}
					placeholder={(country) => getExampleNumber(country.iso2)}
					className="h-full px-3"
				/>
			</PhoneField.Group>
			<PhoneField.Description render={<FieldDescription />} className="text-xs">
				Mercados acotados, destacados arriba y nombres en español.
			</PhoneField.Description>
		</PhoneField.Root>
	);
}

function CountrySelect() {
	return (
		<PhoneField.Country
			labels={{ search: "Buscar país", empty: "Sin resultados" }}
		>
			<PhoneField.CountryTrigger className="group/trigger flex h-full shrink-0 items-center gap-2 border-input border-r px-3 text-sm outline-none transition-colors duration-150 hover:bg-accent focus-visible:bg-accent data-popup-open:bg-accent">
				<PhoneField.CountryValue>
					{(country) => (
						<>
							<span aria-hidden>{country.flag}</span>
							<span>{country.dialCode}</span>
						</>
					)}
				</PhoneField.CountryValue>
				<PhoneField.CountryIcon className="text-muted-foreground transition-transform duration-150 ease-out group-data-popup-open/trigger:rotate-180 motion-reduce:transition-none">
					<ChevronDownIcon className="size-4" />
				</PhoneField.CountryIcon>
			</PhoneField.CountryTrigger>
			<PhoneField.CountryPortal>
				<PhoneField.CountryPositioner className="isolate z-50" sideOffset={6}>
					<PhoneField.CountryPopup className="flex max-h-[min(22rem,var(--available-height))] w-72 max-w-(--available-width) origin-(--transform-origin) flex-col overflow-hidden rounded-xl bg-popover text-popover-foreground shadow-xl ring-1 ring-foreground/10 transition-[transform,opacity] duration-150 ease-out data-ending-style:scale-[0.97] data-ending-style:opacity-0 data-starting-style:scale-[0.97] data-starting-style:opacity-0 motion-reduce:transition-none">
						<div className="border-b p-1.5">
							<PhoneField.CountrySearch className="h-8 w-full rounded-md bg-muted/60 px-2.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50" />
						</div>
						<PhoneField.CountryEmpty className="px-3 py-6 text-center text-sm text-muted-foreground empty:hidden" />
						<PhoneField.CountryList className="min-h-0 flex-1 scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0 [&_[data-preferred]]:mb-1 [&_[data-preferred]]:border-b [&_[data-preferred]]:pb-1">
							{(country) => (
								<PhoneField.CountryItem
									country={country}
									className="flex cursor-default items-center gap-2 rounded-md px-2.5 py-1.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
								>
									<span aria-hidden>{country.flag}</span>
									<span className="min-w-0 flex-1 truncate">
										{country.name}
									</span>
									<span className="text-muted-foreground">
										{country.dialCode}
									</span>
									<PhoneField.CountryItemIndicator>
										<CheckIcon className="size-4" />
									</PhoneField.CountryItemIndicator>
								</PhoneField.CountryItem>
							)}
						</PhoneField.CountryList>
					</PhoneField.CountryPopup>
				</PhoneField.CountryPositioner>
			</PhoneField.CountryPortal>
		</PhoneField.Country>
	);
}
