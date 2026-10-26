import { PhoneField } from "phonefield";
import { getExampleNumber } from "phonefield/utils";

export function ComposedPhone() {
	return (
		<PhoneField.Root defaultCountry="US" className="phone">
			<PhoneField.Label className="phone-label">Phone</PhoneField.Label>
			<PhoneField.Group className="phone-group">
				<PhoneField.Country>
					<PhoneField.CountryTrigger className="phone-trigger">
						<PhoneField.CountryValue>
							{(country) => `${country.flag} ${country.iso2}`}
						</PhoneField.CountryValue>
						<PhoneField.CountryIcon className="phone-trigger-icon" />
					</PhoneField.CountryTrigger>
					<PhoneField.CountryPortal>
						<PhoneField.CountryPositioner sideOffset={8}>
							<PhoneField.CountryPopup className="phone-popup">
								<PhoneField.CountrySearch className="phone-search" />
								<PhoneField.CountryEmpty className="phone-empty" />
								<PhoneField.CountryList className="phone-list">
									{(country) => (
										<PhoneField.CountryItem
											country={country}
											className="phone-item"
										>
											{country.flag} {country.name}
											<PhoneField.CountryItemIndicator />
										</PhoneField.CountryItem>
									)}
								</PhoneField.CountryList>
							</PhoneField.CountryPopup>
						</PhoneField.CountryPositioner>
					</PhoneField.CountryPortal>
				</PhoneField.Country>
				<PhoneField.Input
					className="phone-input"
					placeholder={(country) => getExampleNumber(country.iso2)}
				/>
			</PhoneField.Group>
			<PhoneField.Error className="phone-error" />
		</PhoneField.Root>
	);
}
