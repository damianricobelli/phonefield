import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { PhoneField } from "phonefield";
import { getExampleNumber } from "phonefield/utils";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function PhoneInputSeparated() {
	return (
		<PhoneField.Root
			defaultCountry="AR"
			name="phone"
			className="grid w-full max-w-lg gap-3 sm:grid-cols-[max-content_minmax(0,1fr)]"
		>
			<Field className="w-fit">
				<FieldLabel htmlFor="separated-country">Country</FieldLabel>
				<PhoneField.Country>
					<PhoneField.CountryTrigger
						id="separated-country"
						className="group/trigger flex h-10 w-fit items-center gap-3 rounded-lg border border-input bg-background px-3 text-sm shadow-sm outline-none transition-[border-color,box-shadow] duration-150 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:border-ring data-popup-open:ring-3 data-popup-open:ring-ring/50"
					>
						<PhoneField.CountryValue>
							{(country) => (
								<span className="flex items-center gap-2">
									<span aria-hidden>{country.flag}</span>
									<span>{country.dialCode}</span>
									<span className="sr-only">{country.name}</span>
								</span>
							)}
						</PhoneField.CountryValue>
						<PhoneField.CountryIcon className="text-muted-foreground transition-transform duration-150 ease-out group-data-popup-open/trigger:rotate-180 motion-reduce:transition-none">
							<ChevronDownIcon className="size-4" />
						</PhoneField.CountryIcon>
					</PhoneField.CountryTrigger>
					<PhoneField.CountryPortal>
						<PhoneField.CountryPositioner
							className="isolate z-50"
							sideOffset={6}
						>
							<PhoneField.CountryPopup className="flex max-h-[min(22rem,var(--available-height))] w-(--anchor-width) min-w-64 max-w-(--available-width) origin-(--transform-origin) flex-col overflow-hidden rounded-xl bg-popover text-popover-foreground shadow-xl ring-1 ring-foreground/10 transition-[transform,opacity] duration-150 ease-out data-ending-style:scale-[0.97] data-ending-style:opacity-0 data-starting-style:scale-[0.97] data-starting-style:opacity-0 motion-reduce:transition-none">
								<div className="border-b p-1.5">
									<PhoneField.CountrySearch className="h-8 w-full rounded-md bg-muted/60 px-2.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50" />
								</div>
								<PhoneField.CountryEmpty className="px-3 py-6 text-center text-sm text-muted-foreground empty:hidden" />
								<PhoneField.CountryList className="min-h-0 flex-1 scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0">
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
			</Field>

			<Field>
				<PhoneField.Label render={<FieldLabel />}>
					Phone number
				</PhoneField.Label>
				<PhoneField.Input
					render={<Input />}
					placeholder={(country) => getExampleNumber(country.iso2)}
					className="h-10 bg-background px-3 shadow-sm"
				/>
			</Field>
		</PhoneField.Root>
	);
}
