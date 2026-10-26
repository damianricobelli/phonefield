import { PhoneField } from "phonefield";

export function UnderlinePhoneField() {
	return (
		<PhoneField.Root
			defaultCountry="JP"
			className="group/phone flex items-end gap-4 border-zinc-300 border-b-2 pb-1.5 transition-colors data-focused:border-indigo-600 data-invalid:border-rose-500"
		>
			<PhoneField.Country>
				<PhoneField.CountryTrigger className="flex flex-col items-start text-left outline-none">
					<span className="text-[10px] font-semibold tracking-widest text-zinc-400 uppercase group-data-focused/phone:text-indigo-600">
						Code
					</span>
					<PhoneField.CountryValue>
						{(country) => (
							<span className="font-mono text-lg">{country.dialCode}</span>
						)}
					</PhoneField.CountryValue>
				</PhoneField.CountryTrigger>
				<PhoneField.CountryPortal>
					<PhoneField.CountryPositioner className="z-50" sideOffset={10}>
						<PhoneField.CountryPopup className="w-60 border-2 border-zinc-900 bg-white shadow-[4px_4px_0_0_rgb(24_24_27)]">
							<PhoneField.CountrySearch className="h-10 w-full border-zinc-900 border-b-2 px-3 font-mono text-sm outline-none" />
							<PhoneField.CountryList className="max-h-60 overflow-y-auto">
								{(country) => (
									<PhoneField.CountryItem
										country={country}
										className="flex justify-between px-3 py-2 font-mono text-sm outline-none data-highlighted:bg-indigo-600 data-highlighted:text-white"
									>
										<span className="truncate">{country.name}</span>
										<span>{country.dialCode}</span>
									</PhoneField.CountryItem>
								)}
							</PhoneField.CountryList>
						</PhoneField.CountryPopup>
					</PhoneField.CountryPositioner>
				</PhoneField.CountryPortal>
			</PhoneField.Country>
			<div className="flex min-w-0 flex-1 flex-col">
				<PhoneField.Label className="text-[10px] font-semibold tracking-widest text-zinc-400 uppercase group-data-focused/phone:text-indigo-600">
					Phone
				</PhoneField.Label>
				<PhoneField.Input className="min-w-0 bg-transparent font-mono text-lg outline-none" />
			</div>
		</PhoneField.Root>
	);
}
