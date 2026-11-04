import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { PhoneField } from "phonefield/react-aria";

export function ReactAriaPhone() {
	return (
		<PhoneField.Root name="phone" defaultCountry="US" className="grid gap-1.5">
			<PhoneField.Label className="text-sm font-medium">Phone</PhoneField.Label>
			<PhoneField.Group
				className={({ isFocusWithin, invalid }) =>
					`flex h-10 overflow-hidden rounded-lg border bg-background ${
						isFocusWithin ? "ring-3 ring-ring/40" : ""
					} ${invalid ? "border-destructive" : ""}`
				}
			>
				<PhoneField.Country>
					<PhoneField.CountryTrigger className="flex items-center gap-1.5 border-r px-3 text-sm outline-none data-hovered:bg-accent/60 data-pressed:bg-accent">
						<PhoneField.CountryValue />
						<PhoneField.CountryIcon>
							<ChevronDownIcon className="size-3.5 opacity-60" />
						</PhoneField.CountryIcon>
					</PhoneField.CountryTrigger>
					<PhoneField.CountryPopover
						offset={6}
						className="flex max-h-80 w-72 flex-col overflow-hidden rounded-xl bg-popover shadow-xl ring-1 ring-foreground/10"
					>
						<PhoneField.CountrySearch className="m-1.5">
							<PhoneField.CountrySearchInput className="h-8 w-full rounded-md bg-muted/60 px-2.5 text-sm outline-none" />
						</PhoneField.CountrySearch>
						<PhoneField.CountryList
							className="min-h-0 flex-1 overflow-y-auto p-1 outline-none"
							renderEmptyState={() => (
								<PhoneField.CountryEmpty className="px-3 py-6 text-center text-sm text-muted-foreground" />
							)}
						>
							{(country) => (
								<PhoneField.CountryItem
									country={country}
									className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm outline-none data-focused:bg-accent"
								>
									<span className="flex-1 truncate">
										{country.flag} {country.name}
									</span>
									<span className="text-muted-foreground">
										{country.dialCode}
									</span>
									<PhoneField.CountryItemIndicator>
										<CheckIcon className="size-3.5" />
									</PhoneField.CountryItemIndicator>
								</PhoneField.CountryItem>
							)}
						</PhoneField.CountryList>
					</PhoneField.CountryPopover>
				</PhoneField.Country>
				<PhoneField.Input className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" />
			</PhoneField.Group>
			<PhoneField.Error className="text-sm text-destructive" />
		</PhoneField.Root>
	);
}
