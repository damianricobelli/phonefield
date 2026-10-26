import { CheckIcon } from "lucide-react";
import { PhoneField } from "phonefield";

export function SplitPhoneField() {
	return (
		<PhoneField.Root
			defaultCountry="DE"
			preferredCountries={["DE", "AT", "CH"]}
			className="grid grid-cols-[auto_1fr] gap-2"
		>
			<PhoneField.Country>
				<PhoneField.CountryTrigger className="flex h-11 items-center gap-2 rounded-xl border border-stone-300 bg-stone-50 px-3 text-sm outline-none focus-visible:border-amber-600 focus-visible:ring-4 focus-visible:ring-amber-500/15" />
				<PhoneField.CountryPortal>
					<PhoneField.CountryPositioner className="z-50" sideOffset={6}>
						<PhoneField.CountryPopup className="w-72 rounded-xl border border-stone-200 bg-white shadow-lg">
							<PhoneField.CountrySearch className="h-10 w-full rounded-t-xl border-stone-200 border-b px-3 text-sm outline-none" />
							<PhoneField.CountryList className="max-h-64 overflow-y-auto p-1 [&_[data-preferred]]:border-stone-200 [&_[data-preferred]]:border-b [&_[data-preferred]]:pb-1">
								{(country) => (
									<PhoneField.CountryItem
										country={country}
										className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm outline-none data-highlighted:bg-amber-50"
									>
										<span>{country.flag}</span>
										<span className="flex-1 truncate">{country.name}</span>
										<PhoneField.CountryItemIndicator className="text-amber-700">
											<CheckIcon className="size-4" />
										</PhoneField.CountryItemIndicator>
									</PhoneField.CountryItem>
								)}
							</PhoneField.CountryList>
						</PhoneField.CountryPopup>
					</PhoneField.CountryPositioner>
				</PhoneField.CountryPortal>
			</PhoneField.Country>
			<PhoneField.Input
				aria-label="Phone number"
				className="h-11 min-w-0 rounded-xl border border-stone-300 bg-white px-3.5 text-base outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-500/15 aria-invalid:border-rose-500"
			/>
		</PhoneField.Root>
	);
}
