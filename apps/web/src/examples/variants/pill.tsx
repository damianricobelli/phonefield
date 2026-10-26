import { PhoneField } from "phonefield";

export function PillPhoneField() {
	return (
		<PhoneField.Root
			defaultCountry="BR"
			className="flex h-12 items-center gap-1 rounded-full bg-zinc-100 p-1 pr-4 ring-zinc-900/10 transition-shadow data-focused:bg-white data-focused:ring-2 data-invalid:ring-rose-500/60"
		>
			<PhoneField.Country>
				<PhoneField.CountryTrigger className="flex h-full items-center gap-2 rounded-full bg-white px-3.5 text-sm font-medium shadow-sm ring-1 ring-zinc-900/5 outline-none data-popup-open:ring-zinc-900/20">
					<PhoneField.CountryValue>
						{(country) => (
							<>
								<span className="text-lg leading-none">{country.flag}</span>
								{country.dialCode}
							</>
						)}
					</PhoneField.CountryValue>
				</PhoneField.CountryTrigger>
				<PhoneField.CountryPortal>
					<PhoneField.CountryPositioner className="z-50" sideOffset={8}>
						<PhoneField.CountryPopup className="w-64 overflow-hidden rounded-3xl bg-white p-1.5 shadow-2xl ring-1 ring-zinc-900/10">
							<PhoneField.CountrySearch className="mb-1 h-9 w-full rounded-full bg-zinc-100 px-4 text-sm outline-none" />
							<PhoneField.CountryList className="max-h-64 overflow-y-auto">
								{(country) => (
									<PhoneField.CountryItem
										country={country}
										className="flex items-center gap-2 rounded-full px-3 py-2 text-sm outline-none data-highlighted:bg-zinc-100"
									>
										<span>{country.flag}</span>
										<span className="flex-1 truncate">{country.name}</span>
									</PhoneField.CountryItem>
								)}
							</PhoneField.CountryList>
						</PhoneField.CountryPopup>
					</PhoneField.CountryPositioner>
				</PhoneField.CountryPortal>
			</PhoneField.Country>
			<PhoneField.Input
				aria-label="Phone number"
				className="h-full min-w-0 flex-1 bg-transparent px-2 text-base outline-none"
			/>
		</PhoneField.Root>
	);
}
