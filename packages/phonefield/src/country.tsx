import { Combobox } from "@base-ui/react/combobox";
import React from "react";
import type { PhoneField } from "./component.js";
import { usePhoneFieldCountryContext } from "./context.js";
import { defaultCountrySearchText } from "./utils.js";

function ChevronUpDownIcon(props: React.ComponentProps<"svg">) {
	return (
		<svg
			width="8"
			height="12"
			viewBox="0 0 8 12"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			aria-hidden="true"
			{...props}
		>
			<path d="M0.5 4.5L4 1.5L7.5 4.5" />
			<path d="M0.5 7.5L4 10.5L7.5 7.5" />
		</svg>
	);
}

function CountryComponent({
	placeholder = "Select country",
	noResultsText = "No countries found",
	inputPlaceholder = "Search country",
	icon,
	classNames,
	positioning,
	renderCountryItem,
	renderCountryValue,
	slotProps,
}: PhoneField.CountryProps) {
	const { selectedCountry, availableCountries, setCountry } =
		usePhoneFieldCountryContext();

	const selectedInList =
		availableCountries.find(
			(country) => country.iso2 === selectedCountry.iso2,
		) ?? availableCountries[0];

	const resolvedPositioning = {
		side: "bottom" as const,
		align: "start" as const,
		sideOffset: 4,
		...positioning,
	};

	return (
		<Combobox.Root
			{...slotProps?.root}
			items={availableCountries}
			value={selectedInList}
			itemToStringLabel={defaultCountrySearchText}
			onValueChange={(next) => {
				if (next) setCountry(next);
			}}
			isItemEqualToValue={(a, b) => a.iso2 === b.iso2}
		>
			<Combobox.Trigger {...slotProps?.trigger} className={classNames?.trigger}>
				<Combobox.Value placeholder={placeholder} {...slotProps?.value}>
					{(country: PhoneField.Country | null) =>
						country
							? (renderCountryValue?.(country) ??
								`${country.flag ? `${country.flag} ` : ""}${country.name} (${country.dialCode})`)
							: placeholder
					}
				</Combobox.Value>
				<Combobox.Icon {...slotProps?.icon} className={classNames?.icon}>
					{icon ?? <ChevronUpDownIcon />}
				</Combobox.Icon>
			</Combobox.Trigger>

			<Combobox.Portal {...slotProps?.portal}>
				<Combobox.Positioner
					{...slotProps?.positioner}
					{...resolvedPositioning}
					className={classNames?.positioner}
				>
					<Combobox.Popup {...slotProps?.popup} className={classNames?.popup}>
						<div
							{...slotProps?.searchInputContainer}
							className={classNames?.searchInputContainer}
						>
							<Combobox.Input
								{...slotProps?.searchInput}
								className={classNames?.searchInput}
								placeholder={inputPlaceholder}
								aria-label={
									slotProps?.searchInput?.["aria-label"] ?? inputPlaceholder
								}
							/>
						</div>
						<Combobox.Empty {...slotProps?.empty} className={classNames?.empty}>
							{noResultsText}
						</Combobox.Empty>
						<Combobox.List {...slotProps?.list} className={classNames?.list}>
							{(country: PhoneField.Country) => {
								const itemProps =
									typeof slotProps?.item === "function"
										? slotProps.item(country)
										: slotProps?.item;
								return (
									<Combobox.Item
										{...itemProps}
										key={country.iso2}
										value={country}
										className={classNames?.item}
									>
										{renderCountryItem?.(country) ??
											`${country.flag ? `${country.flag} ` : ""}${country.name} (${country.dialCode})`}
									</Combobox.Item>
								);
							}}
						</Combobox.List>
					</Combobox.Popup>
				</Combobox.Positioner>
			</Combobox.Portal>
		</Combobox.Root>
	);
}

/** Country picker isolated from number-input updates. */
export const Country = React.memo(CountryComponent);
