import { Combobox } from "@base-ui/react/combobox";
import React from "react";
import { withRef } from "../core/compat.js";
import {
	PhoneFieldCountryLabelsContext,
	usePhoneFieldCountryContext,
} from "../core/context.js";
import {
	CheckIcon,
	ChevronUpDownIcon,
	EMPTY_LABELS,
	getCountryItemText,
	getCountryTriggerLabel,
	getCountryValueText,
	hasExplicitLabel,
	useCountryLabels,
} from "../core/country.js";
import { defaultCountrySearchText } from "../utils.js";
import type { PhoneField } from "./component.js";

function toIso2(country: PhoneField.Country) {
	return country.iso2;
}

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

/**
 * Lets `CountryPopup` decide where focus goes on close: to the phone input
 * after a country is picked, otherwise back to the trigger.
 */
const CountryFinalFocusContext = React.createContext<
	(() => boolean) | undefined
>(undefined);

function CountryComponent({
	children,
	labels,
	focusInputOnSelect = true,
	onOpenChange,
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
		focusInput,
	} = usePhoneFieldCountryContext();
	const focusInputOnCloseRef = React.useRef(false);
	const focusInputOnClose = React.useCallback(() => {
		if (!focusInputOnCloseRef.current) return false;
		focusInputOnCloseRef.current = false;
		return focusInput();
	}, [focusInput]);

	return (
		<Combobox.Root
			autoHighlight
			locale={locale}
			{...props}
			onOpenChange={(open, eventDetails) => {
				// Picking a country closes with "item-press", by pointer or Enter.
				if (open) focusInputOnCloseRef.current = false;
				else if (focusInputOnSelect && eventDetails.reason === "item-press") {
					focusInputOnCloseRef.current = true;
				}
				onOpenChange?.(open, eventDetails);
			}}
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
			<CountryFinalFocusContext.Provider value={focusInputOnClose}>
				<PhoneFieldCountryLabelsContext.Provider value={labels ?? EMPTY_LABELS}>
					{children ?? <DefaultCountryAnatomy />}
				</PhoneFieldCountryLabelsContext.Provider>
			</CountryFinalFocusContext.Provider>
		</Combobox.Root>
	);
}

/**
 * Country picker state. Without children it renders a complete, unstyled
 * picker; compose the `Country*` parts to customize any piece of it.
 */
export const Country = React.memo(CountryComponent);

/** Button that opens the picker. Defaults to the selected flag, dial code, and an icon. */
export const CountryTrigger = withRef(function CountryTrigger({
	children,
	...props
}: PhoneField.CountryTriggerProps) {
	const { selectedCountry } = usePhoneFieldCountryContext(
		"PhoneField.CountryTrigger",
	);
	return (
		<Combobox.Trigger
			aria-label={
				hasExplicitLabel(props)
					? undefined
					: getCountryTriggerLabel(selectedCountry)
			}
			data-slot="phone-field-country-trigger"
			{...props}
		>
			{children ?? (
				<>
					<CountryValue />
					<CountryIcon />
				</>
			)}
		</Combobox.Trigger>
	);
});

/** Selected country text. Pass a function child to render it yourself. */
export function CountryValue({ children }: PhoneField.CountryValueProps) {
	return (
		<Combobox.Value>
			{(country: PhoneField.Country | null) => {
				if (!country) return null;
				if (typeof children === "function") return children(country);
				return children ?? getCountryValueText(country);
			}}
		</Combobox.Value>
	);
}

/** Decorative trigger icon. Defaults to an up/down chevron. */
export const CountryIcon = withRef(function CountryIcon({
	children,
	...props
}: PhoneField.CountryIconProps) {
	return (
		<Combobox.Icon data-slot="phone-field-country-icon" {...props}>
			{children ?? <ChevronUpDownIcon />}
		</Combobox.Icon>
	);
});

/** Portals the popup to `document.body`. */
export const CountryPortal = withRef(function CountryPortal(
	props: PhoneField.CountryPortalProps,
) {
	return <Combobox.Portal {...props} />;
});

/** Positions the popup. Defaults to `side="bottom"`, `align="start"`, `sideOffset={4}`. */
export const CountryPositioner = withRef(function CountryPositioner(
	props: PhoneField.CountryPositionerProps,
) {
	return (
		<Combobox.Positioner
			side="bottom"
			align="start"
			sideOffset={4}
			data-slot="phone-field-country-positioner"
			{...props}
		/>
	);
});

/**
 * Popup container. After a country is picked, focus moves to the phone input
 * on close; otherwise it returns to the trigger. Pass `finalFocus` to override.
 */
export const CountryPopup = withRef(function CountryPopup(
	props: PhoneField.CountryPopupProps,
) {
	const focusInputOnClose = React.useContext(CountryFinalFocusContext);
	return (
		<Combobox.Popup
			data-slot="phone-field-country-popup"
			// Returning false tells Base UI that focus is already handled.
			finalFocus={() => !focusInputOnClose?.()}
			{...props}
		/>
	);
});

/** Search box that filters by name, ISO2 code, or dial code. */
export const CountrySearch = withRef(function CountrySearch({
	placeholder: placeholderProp,
	...props
}: PhoneField.CountrySearchProps) {
	const labels = useCountryLabels();
	const placeholder = placeholderProp ?? labels.search;
	return (
		<Combobox.Input
			placeholder={placeholder}
			aria-label={props["aria-labelledby"] ? undefined : placeholder}
			data-slot="phone-field-country-search"
			{...props}
		/>
	);
});

/** Shown when the search has no matches. */
export const CountryEmpty = withRef(function CountryEmpty({
	children,
	...props
}: PhoneField.CountryEmptyProps) {
	const labels = useCountryLabels();
	return (
		<Combobox.Empty data-slot="phone-field-country-empty" {...props}>
			{children ?? labels.empty}
		</Combobox.Empty>
	);
});

/**
 * Filtered country list. Pass a function child to render each country; keys
 * are handled for you. With `preferredCountries`, pinned countries render in
 * a separate `data-slot="phone-field-country-group"` with `data-preferred`.
 */
export const CountryList = withRef(function CountryList({
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
		<Combobox.List data-slot="phone-field-country-list" {...props}>
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
});

/** One selectable country. Defaults to flag, name, and dial code. */
export const CountryItem = withRef(function CountryItem({
	country,
	children,
	...props
}: PhoneField.CountryItemProps) {
	return (
		<Combobox.Item
			data-slot="phone-field-country-item"
			{...props}
			value={country}
			data-country={country.iso2}
		>
			{children ?? getCountryItemText(country)}
		</Combobox.Item>
	);
});

/** Rendered inside an item only while it is selected. Defaults to a check mark. */
export const CountryItemIndicator = withRef(function CountryItemIndicator({
	children,
	...props
}: PhoneField.CountryItemIndicatorProps) {
	return (
		<Combobox.ItemIndicator
			data-slot="phone-field-country-item-indicator"
			{...props}
		>
			{children ?? <CheckIcon />}
		</Combobox.ItemIndicator>
	);
});
