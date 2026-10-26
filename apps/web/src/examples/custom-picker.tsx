import { PhoneField, usePhoneField } from "phonefield";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

// Any part can read and drive Root. Here, shadcn's Select replaces Country.
function CountrySelect() {
	const { country, countries, setCountry, state } = usePhoneField();
	const items = countries.map((option) => ({
		value: option.iso2,
		label: `${option.flag} ${option.dialCode}`,
	}));

	return (
		<Select
			items={items}
			value={country.iso2}
			disabled={state.disabled}
			onValueChange={(iso2) => {
				if (iso2) setCountry(iso2);
			}}
		>
			<SelectTrigger aria-label={`Country: ${country.name}`}>
				<SelectValue />
			</SelectTrigger>
			<SelectContent alignItemWithTrigger={false}>
				{countries.map((option) => (
					<SelectItem key={option.iso2} value={option.iso2}>
						{option.flag} {option.name} ({option.dialCode})
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

export function CompactPhone() {
	return (
		<PhoneField.Root defaultCountry="US">
			<PhoneField.Group className="flex gap-2">
				<CountrySelect />
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Group>
		</PhoneField.Root>
	);
}
