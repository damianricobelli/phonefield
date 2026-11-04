import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { PhoneField } from "phonefield/react-aria";
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
				<FieldLabel id="separated-country-label">Country</FieldLabel>
				<PhoneField.Country>
					<PhoneField.CountryTrigger
						aria-labelledby="separated-country-label"
						className="group/trigger flex h-10 w-fit items-center gap-3 rounded-lg border border-input bg-background px-3 text-sm shadow-sm outline-none transition-[border-color,box-shadow] duration-150 data-focus-visible:border-ring data-focus-visible:ring-3 data-focus-visible:ring-ring/50 data-pressed:border-ring data-pressed:ring-3 data-pressed:ring-ring/50"
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
						<PhoneField.CountryIcon className="text-muted-foreground transition-transform duration-150 ease-out group-data-pressed/trigger:rotate-180 motion-reduce:transition-none">
							<ChevronDownIcon className="size-4" />
						</PhoneField.CountryIcon>
					</PhoneField.CountryTrigger>
					<PhoneField.CountryPopover
						offset={6}
						className="z-50 flex w-(--trigger-width) min-w-64 flex-col overflow-hidden rounded-xl bg-popover text-popover-foreground shadow-xl ring-1 ring-foreground/10 data-entering:animate-in data-entering:fade-in-0 data-entering:zoom-in-95 data-exiting:animate-out data-exiting:fade-out-0 data-exiting:zoom-out-95"
					>
						<PhoneField.CountrySearch className="border-b p-1.5">
							<PhoneField.CountrySearchInput className="h-8 w-full rounded-md bg-muted/60 px-2.5 text-sm outline-none placeholder:text-muted-foreground data-focus-visible:ring-2 data-focus-visible:ring-ring/50 [&::-webkit-search-cancel-button]:hidden" />
						</PhoneField.CountrySearch>
						<PhoneField.CountryList
							className="max-h-80 min-h-0 flex-1 scroll-py-1 overflow-y-auto overscroll-contain p-1 outline-none"
							renderEmptyState={() => (
								<PhoneField.CountryEmpty className="px-3 py-6 text-center text-sm text-muted-foreground" />
							)}
						>
							{(country) => (
								<PhoneField.CountryItem
									country={country}
									className="flex cursor-default items-center gap-2 rounded-md px-2.5 py-1.5 text-sm outline-none select-none data-focused:bg-accent data-focused:text-accent-foreground"
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
					</PhoneField.CountryPopover>
				</PhoneField.Country>
			</Field>

			<Field>
				<PhoneField.Label render={(props) => <FieldLabel {...props} />}>
					Phone number
				</PhoneField.Label>
				<PhoneField.Input
					render={(props) => <Input {...props} />}
					placeholder={(country) => getExampleNumber(country.iso2)}
					className="h-10 bg-background px-3 shadow-sm"
				/>
			</Field>
		</PhoneField.Root>
	);
}
