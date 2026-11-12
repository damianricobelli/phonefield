import React from "react";
import { Autocomplete } from "react-aria-components/Autocomplete";
import { Button, ButtonContext } from "react-aria-components/Button";
import { Input } from "react-aria-components/Input";
import {
	Collection,
	type Key,
	ListBox,
	ListBoxItem,
	ListBoxSection,
} from "react-aria-components/ListBox";
import { Popover } from "react-aria-components/Popover";
import { SearchField } from "react-aria-components/SearchField";
import { Select, SelectValue } from "react-aria-components/Select";
import { SelectionIndicator } from "react-aria-components/SelectionIndicator";
import { useSlottedContext } from "react-aria-components/slots";
import { withRef } from "../core/compat.js";
import {
	type PhoneFieldCountryGroup,
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
	useCountryLabels,
	useCountryMatcher,
} from "../core/country.js";
import type { PhoneFieldCountry } from "../types.js";
import { defaultCountrySearchText } from "../utils.js";
import type { PhoneField } from "./component.js";

function DefaultCountryAnatomy() {
	return (
		<>
			<CountryTrigger />
			<CountryPopover>
				<CountrySearch />
				<CountryList />
			</CountryPopover>
		</>
	);
}

const DISPLAY_CONTENTS = { display: "contents" } as const;

function CountryComponent({
	children,
	labels,
	isDisabled,
	...props
}: PhoneField.CountryProps) {
	const { selectedCountry, disabled, readOnly, setCountry, getCountry } =
		usePhoneFieldCountryContext();
	const hasLabel =
		props["aria-label"] !== undefined || props["aria-labelledby"] !== undefined;

	return (
		<Select<PhoneFieldCountry>
			aria-label={
				hasLabel ? undefined : getCountryTriggerLabel(selectedCountry)
			}
			// Select wraps its button in a <div>. Unless you style that wrapper,
			// let the trigger sit directly in Group's layout, like the other adapters.
			style={
				props.className === undefined && props.style === undefined
					? DISPLAY_CONTENTS
					: undefined
			}
			data-slot="phone-field-country"
			{...props}
			isDisabled={disabled || isDisabled}
			// Root always resolves the selection from the available countries.
			value={selectedCountry.iso2}
			onChange={(key: Key | null) => {
				const next = key == null ? undefined : getCountry(String(key));
				if (next && !readOnly) setCountry(next);
			}}
			data-readonly={readOnly || undefined}
		>
			<PhoneFieldCountryLabelsContext.Provider value={labels ?? EMPTY_LABELS}>
				{children ?? <DefaultCountryAnatomy />}
			</PhoneFieldCountryLabelsContext.Provider>
		</Select>
	);
}

/**
 * Country picker state, built on React Aria's Select. Without children it
 * renders a complete, unstyled picker; compose the `Country*` parts to customize it.
 */
export const Country = React.memo(CountryComponent);

/** Button that opens the picker. Defaults to the selected flag, dial code, and an icon. */
export const CountryTrigger = withRef(function CountryTrigger({
	children,
	...props
}: PhoneField.CountryTriggerProps) {
	// Select labels the button with its value plus the Select's label. Name it
	// by the Select label (the selected country) alone, like a native picker.
	const button = useSlottedContext(ButtonContext);
	const labelledBy =
		props["aria-labelledby"] ?? (button as { id?: string } | null)?.id;
	return (
		<Button
			data-slot="phone-field-country-trigger"
			{...props}
			aria-labelledby={labelledBy}
		>
			{children ?? (
				<>
					<CountryValue />
					<CountryIcon />
				</>
			)}
		</Button>
	);
});

/** Selected country text. Pass a function child to render it yourself. */
export const CountryValue = withRef(function CountryValue({
	children,
	...props
}: PhoneField.CountryValueProps) {
	const { selectedCountry } = usePhoneFieldCountryContext(
		"PhoneField.CountryValue",
	);
	return (
		<SelectValue<PhoneFieldCountry>
			// SelectValue wraps the value in a <span>. Unless you style it, let its
			// content sit directly in the trigger's layout, like the other adapters.
			style={
				props.className === undefined && props.style === undefined
					? DISPLAY_CONTENTS
					: undefined
			}
			data-slot="phone-field-country-value"
			{...props}
		>
			{typeof children === "function"
				? children(selectedCountry)
				: (children ?? getCountryValueText(selectedCountry))}
		</SelectValue>
	);
});

/** Decorative trigger icon. Defaults to an up/down chevron. */
export const CountryIcon = withRef(function CountryIcon({
	children,
	...props
}: PhoneField.CountryIconProps) {
	return (
		<span aria-hidden="true" data-slot="phone-field-country-icon" {...props}>
			{children ?? <ChevronUpDownIcon />}
		</span>
	);
});

/**
 * Popover with a search Autocomplete. Defaults to `placement="bottom start"`
 * and `offset={4}`; it is portaled and positioned by React Aria.
 */
export const CountryPopover = withRef(function CountryPopover({
	children,
	...props
}: PhoneField.CountryPopoverProps) {
	const matcher = useCountryMatcher();
	return (
		<Popover offset={4} data-slot="phone-field-country-popover" {...props}>
			{(renderProps) => (
				<Autocomplete filter={matcher}>
					{typeof children === "function" ? children(renderProps) : children}
				</Autocomplete>
			)}
		</Popover>
	);
});

/**
 * Search field that filters by name, ISO2 code, or dial code. Focused when
 * the picker opens. Pass a `CountrySearchInput` (or any React Aria `Input`)
 * as children to style the input.
 */
export const CountrySearch = withRef(function CountrySearch({
	children,
	...props
}: PhoneField.CountrySearchProps) {
	const labels = useCountryLabels();
	return (
		<SearchField
			autoFocus
			aria-label={props["aria-labelledby"] ? undefined : labels.search}
			data-slot="phone-field-country-search-field"
			{...props}
		>
			{children ?? <CountrySearchInput />}
		</SearchField>
	);
});

/** Input of `CountrySearch`. Defaults its placeholder to `labels.search`. */
export const CountrySearchInput = withRef(function CountrySearchInput({
	placeholder,
	...props
}: PhoneField.CountrySearchInputProps) {
	const labels = useCountryLabels();
	return (
		<Input
			placeholder={placeholder ?? labels.search}
			data-slot="phone-field-country-search"
			{...props}
		/>
	);
});

/** Shown when the search has no matches. Render it from `CountryList`'s `renderEmptyState`. */
export const CountryEmpty = withRef(function CountryEmpty({
	children,
	...props
}: PhoneField.CountryEmptyProps) {
	const labels = useCountryLabels();
	return (
		<div data-slot="phone-field-country-empty" {...props}>
			{children ?? labels.empty}
		</div>
	);
});

const NO_ITEMS: readonly PhoneFieldCountry[] = [];

function subscribeToNothing() {
	return () => {};
}

/** False on the server and during hydration, true afterwards. */
function useIsHydrated() {
	return React.useSyncExternalStore(
		subscribeToNothing,
		() => true,
		() => false,
	);
}

function renderDefaultEmptyState() {
	return <CountryEmpty />;
}

/**
 * Filtered country list. Pass a function child to render each country; keys
 * are handled for you. With `preferredCountries`, pinned countries render in
 * a separate `data-slot="phone-field-country-group"` section with `data-preferred`.
 */
export const CountryList = withRef(function CountryList({
	children,
	renderEmptyState = renderDefaultEmptyState,
	...props
}: PhoneField.CountryListProps) {
	const context = usePhoneFieldCountryContext("PhoneField.CountryList");
	// Select mirrors its items into a hidden native <select> for autofill.
	// Country names come from Intl.DisplayNames and differ between Node and
	// browsers, so add the items only after hydration to keep SSR stable.
	const hydrated = useIsHydrated();
	const availableCountries = hydrated ? context.availableCountries : NO_ITEMS;
	const groups = hydrated ? context.groups : null;
	const renderCountry = (country: PhoneFieldCountry) =>
		children ? children(country) : <CountryItem country={country} />;

	if (groups) {
		return (
			<ListBox<PhoneFieldCountryGroup>
				data-slot="phone-field-country-list"
				{...props}
				items={groups}
				dependencies={[children, ...(props.dependencies ?? [])]}
				renderEmptyState={renderEmptyState}
			>
				{(group) => (
					<ListBoxSection
						id={group.id}
						data-slot="phone-field-country-group"
						data-preferred={group.id === "preferred" ? "" : undefined}
					>
						<Collection
							items={group.items}
							dependencies={[children, ...(props.dependencies ?? [])]}
						>
							{renderCountry}
						</Collection>
					</ListBoxSection>
				)}
			</ListBox>
		);
	}

	return (
		<ListBox<PhoneFieldCountry>
			data-slot="phone-field-country-list"
			{...props}
			items={availableCountries}
			dependencies={[children, ...(props.dependencies ?? [])]}
			renderEmptyState={renderEmptyState}
		>
			{renderCountry}
		</ListBox>
	);
});

/** One selectable country. Defaults to flag, name, and dial code. */
export const CountryItem = withRef(function CountryItem({
	country,
	children,
	textValue,
	...props
}: PhoneField.CountryItemProps) {
	return (
		<ListBoxItem<PhoneFieldCountry>
			data-slot="phone-field-country-item"
			{...props}
			id={country.iso2}
			value={country}
			textValue={textValue ?? defaultCountrySearchText(country)}
			data-country={country.iso2}
		>
			{children ?? getCountryItemText(country)}
		</ListBoxItem>
	);
});

/** Rendered inside an item only while it is selected. Defaults to a check mark. */
export const CountryItemIndicator = withRef(function CountryItemIndicator({
	children,
	...props
}: PhoneField.CountryItemIndicatorProps) {
	return (
		<SelectionIndicator
			data-slot="phone-field-country-item-indicator"
			{...props}
		>
			{children ?? <CheckIcon />}
		</SelectionIndicator>
	);
});
