import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { PhoneField } from "phonefield/radix";

export function RadixPhone() {
	return (
		<PhoneField.Root name="phone" defaultCountry="US" className="grid gap-1.5">
			<PhoneField.Label className="text-sm font-medium">Phone</PhoneField.Label>
			<PhoneField.Group className="flex h-10 overflow-hidden rounded-lg border bg-background data-focused:ring-3 data-focused:ring-ring/40 data-invalid:border-destructive">
				<PhoneField.Country>
					<PhoneField.CountryTrigger className="flex items-center gap-1.5 border-r px-3 text-sm outline-none hover:bg-accent/60 data-[state=open]:bg-accent">
						<PhoneField.CountryValue />
						<PhoneField.CountryIcon asChild>
							<ChevronDownIcon className="size-3.5 opacity-60" />
						</PhoneField.CountryIcon>
					</PhoneField.CountryTrigger>
					<PhoneField.CountryPortal>
						<PhoneField.CountryContent
							sideOffset={6}
							className="z-50 flex max-h-80 w-72 flex-col overflow-hidden rounded-xl bg-popover shadow-xl ring-1 ring-foreground/10"
						>
							<PhoneField.CountrySearch className="m-1.5 h-8 rounded-md bg-muted/60 px-2.5 text-sm outline-none" />
							<PhoneField.CountryEmpty className="px-3 py-6 text-center text-sm text-muted-foreground empty:hidden" />
							<PhoneField.CountryList className="min-h-0 flex-1 overflow-y-auto p-1">
								{(country) => (
									<PhoneField.CountryItem
										country={country}
										className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm data-highlighted:bg-accent"
									>
										<span className="flex-1 truncate">
											{country.flag} {country.name}
										</span>
										<span className="text-muted-foreground">
											{country.dialCode}
										</span>
										<PhoneField.CountryItemIndicator asChild>
											<CheckIcon className="size-3.5" />
										</PhoneField.CountryItemIndicator>
									</PhoneField.CountryItem>
								)}
							</PhoneField.CountryList>
						</PhoneField.CountryContent>
					</PhoneField.CountryPortal>
				</PhoneField.Country>
				<PhoneField.Input className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" />
			</PhoneField.Group>
			<PhoneField.Error className="text-sm text-destructive" />
		</PhoneField.Root>
	);
}
