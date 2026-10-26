import { Combobox } from "@base-ui/react/combobox";
import React from "react";
import type { PhoneField } from "./component.js";
import {
	PhoneFieldCountryLabelsContext,
	usePhoneFieldCountryContext,
} from "./context.js";
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

function CheckIcon(props: React.ComponentProps<"svg">) {
	return (
		<svg
			width="10"
			height="10"
			viewBox="0 0 10 10"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			aria-hidden="true"
			{...props}
		>
			<path d="M1 5.5L3.75 8L9 2" />
		</svg>
	);
}

function toIso2(country: PhoneField.Country) {
	return country.iso2;
}

const EMPTY_LABELS = {};

function isSameCountry(a: PhoneField.Country, b: PhoneField.Country) {
	return a.iso2 === b.iso2;
}

function DefaultCountryAnatomy() {
	return (
		<>
			<CountryTrigger />
			<CountryPortal>
				<CountryPositioner>
					<CountryPopup>
						<CountrySearch />
						<CountryEmpty />
						<CountryList />
					</CountryPopup>
				</CountryPositioner>
			</CountryPortal>
		</>
	);
}

function CountryComponent({
	children,
	labels,
	...props
}: PhoneField.CountryProps) {
	const {
		selectedCountry,
		availableCountries,
		groups,
		locale,
		disabled,
		readOnly,
		setCountry,
	} = usePhoneFieldCountryContext();

	return (
		<Combobox.Root
			autoHighlight
			locale={locale}
			{...props}
			disabled={disabled || props.disabled}
			readOnly={readOnly || props.readOnly}
			items={groups ?? availableCountries}
			// Root always resolves the selection from the available countries.
			value={selectedCountry}
			itemToStringLabel={defaultCountrySearchText}
			itemToStringValue={toIso2}
			isItemEqualToValue={isSameCountry}
			onValueChange={(next) => {
				if (next) setCountry(next);
			}}
		>
			<PhoneFieldCountryLabelsContext.Provider value={labels ?? EMPTY_LABELS}>
				{children ?? <DefaultCountryAnatomy />}
			</PhoneFieldCountryLabelsContext.Provider>
		</Combobox.Root>
	);
}

/**
 * Country picker state. Without children it renders a complete, unstyled
 * picker; compose the `Country*` parts to customize any piece of it.
 */
export const Country = React.memo(CountryComponent);

/** Button that opens the picker. Defaults to the selected flag, dial code, and an icon. */
export function CountryTrigger({
	children,
	...props
}: PhoneField.CountryTriggerProps) {
	const { selectedCountry } = usePhoneFieldCountryContext(
		"PhoneField.CountryTrigger",
	);
	// An id usually means a <label htmlFor> names the trigger; keep that label.
	const hasLabel =
		props["aria-label"] !== undefined ||
		props["aria-labelledby"] !== undefined ||
		props.id !== undefined;
	return (
		<Combobox.Trigger
			aria-label={
				hasLabel
					? undefined
					: `${selectedCountry.name} (${selectedCountry.dialCode})`
			}
			{...props}
			data-slot="phone-field-country-trigger"
		>
			{children ?? (
				<>
					<CountryValue />
					<CountryIcon />
				</>
			)}
		</Combobox.Trigger>
	);
}

/** Selected country text. Pass a function child to render it yourself. */
export function CountryValue({ children }: PhoneField.CountryValueProps) {
	return (
		<Combobox.Value>
			{(country: PhoneField.Country | null) => {
				if (!country) return null;
				if (typeof children === "function") return children(country);
				return children ?? `${country.flag ?? ""} ${country.dialCode}`.trim();
			}}
		</Combobox.Value>
	);
}

/** Decorative trigger icon. Defaults to an up/down chevron. */
export function CountryIcon({
	children,
	...props
}: PhoneField.CountryIconProps) {
	return (
		<Combobox.Icon {...props} data-slot="phone-field-country-icon">
			{children ?? <ChevronUpDownIcon />}
		</Combobox.Icon>
	);
}

/** Portals the popup to `document.body`. */
export function CountryPortal(props: PhoneField.CountryPortalProps) {
	return <Combobox.Portal {...props} />;
}

/** Positions the popup. Defaults to `side="bottom"`, `align="start"`, `sideOffset={4}`. */
export function CountryPositioner(props: PhoneField.CountryPositionerProps) {
	return (
		<Combobox.Positioner
			side="bottom"
			align="start"
			sideOffset={4}
			{...props}
			data-slot="phone-field-country-positioner"
		/>
	);
}

/** Popup container. */
export function CountryPopup(props: PhoneField.CountryPopupProps) {
	return <Combobox.Popup {...props} data-slot="phone-field-country-popup" />;
}

/** Search box that filters by name, ISO2 code, or dial code. */
export function CountrySearch({
	placeholder: placeholderProp,
	...props
}: PhoneField.CountrySearchProps) {
	const labels = React.use(PhoneFieldCountryLabelsContext);
	const placeholder = placeholderProp ?? labels.search ?? "Search country";
	return (
		<Combobox.Input
			placeholder={placeholder}
			aria-label={props["aria-labelledby"] ? undefined : placeholder}
			{...props}
			data-slot="phone-field-country-search"
		/>
	);
}

/** Shown when the search has no matches. */
export function CountryEmpty({
	children,
	...props
}: PhoneField.CountryEmptyProps) {
	const labels = React.use(PhoneFieldCountryLabelsContext);
	return (
		<Combobox.Empty {...props} data-slot="phone-field-country-empty">
			{children ?? labels.empty ?? "No countries found"}
		</Combobox.Empty>
	);
}

/**
 * Filtered country list. Pass a function child to render each country; keys
 * are handled for you. With `preferredCountries`, pinned countries render in
 * a separate `data-slot="phone-field-country-group"` with `data-preferred`.
 */
export function CountryList({
	children,
	...props
}: PhoneField.CountryListProps) {
	const { groups } = usePhoneFieldCountryContext("PhoneField.CountryList");
	const renderCountry = (country: PhoneField.Country) => (
		<React.Fragment key={country.iso2}>
			{children ? children(country) : <CountryItem country={country} />}
		</React.Fragment>
	);

	return (
		<Combobox.List {...props} data-slot="phone-field-country-list">
			{groups
				? (group: { id: "preferred" | "all"; items: PhoneField.Country[] }) => (
						<Combobox.Group
							key={group.id}
							items={group.items}
							data-slot="phone-field-country-group"
							data-preferred={group.id === "preferred" ? "" : undefined}
						>
							<Combobox.Collection>{renderCountry}</Combobox.Collection>
						</Combobox.Group>
					)
				: renderCountry}
		</Combobox.List>
	);
}

/** One selectable country. Defaults to flag, name, and dial code. */
export function CountryItem({
	country,
	children,
	...props
}: PhoneField.CountryItemProps) {
	return (
		<Combobox.Item
			{...props}
			value={country}
			data-slot="phone-field-country-item"
			data-country={country.iso2}
		>
			{children ??
				`${country.flag ? `${country.flag} ` : ""}${country.name} (${country.dialCode})`}
		</Combobox.Item>
	);
}

/** Rendered inside an item only while it is selected. Defaults to a check mark. */
export function CountryItemIndicator({
	children,
	...props
}: PhoneField.CountryItemIndicatorProps) {
	return (
		<Combobox.ItemIndicator
			{...props}
			data-slot="phone-field-country-item-indicator"
		>
			{children ?? <CheckIcon />}
		</Combobox.ItemIndicator>
	);
}
