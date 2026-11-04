import type * as Radix from "../src/radix/index.js";
import type * as ReactAria from "../src/react-aria/index.js";

// Radix: composition through asChild, Popover props on Country.
const _radixRoot: Radix.PhoneField.RootProps = {
	asChild: true,
	defaultCountry: "AR",
	onValueChange: (value, details) => {
		const _e164: string | null = value.e164;
		const _reason: Radix.PhoneField.ChangeReason = details.reason;
	},
};

const _radixCountry: Radix.PhoneField.CountryProps = {
	modal: true,
	onOpenChange: (_open: boolean) => undefined,
	labels: { search: "Buscar país" },
};

const _radixContent: Radix.PhoneField.CountryContentProps = {
	side: "top",
	sideOffset: 8,
	collisionPadding: 8,
};

const _radixItem: Radix.PhoneField.CountryItemProps = {
	country: { iso2: "US", name: "United States", dialCode: "+1" },
	disabled: true,
};

const _radixRootWithStateClassName: Radix.PhoneField.RootProps = {
	// @ts-expect-error Radix parts style through data attributes, not state functions.
	className: () => "root",
};

// @ts-expect-error Radix positions the popup through Content, not a Positioner part.
export type RadixPositioner = (typeof Radix.PhoneField)["CountryPositioner"];

// React Aria: render props and React Aria prop names on wrapped components.
const _ariaRoot: ReactAria.PhoneField.RootProps = {
	className: (state) => (state.invalid ? "invalid" : "valid"),
	render: (props) => props as never,
	children: (state) => state.country,
};

const _ariaGroup: ReactAria.PhoneField.GroupProps = {
	className: ({ isFocusWithin, invalid }) =>
		isFocusWithin && invalid ? "ring-red" : "ring",
};

const _ariaCountry: ReactAria.PhoneField.CountryProps = {
	isOpen: true,
	onOpenChange: (_isOpen: boolean) => undefined,
	labels: { empty: "Sin resultados" },
};

const _ariaCountryWithValue: ReactAria.PhoneField.CountryProps = {
	// @ts-expect-error Root owns the selected country.
	value: "US",
};

const _ariaPopover: ReactAria.PhoneField.CountryPopoverProps = {
	placement: "top start",
	offset: 8,
};

const _ariaItem: ReactAria.PhoneField.CountryItemProps = {
	country: { iso2: "US", name: "United States", dialCode: "+1" },
	isDisabled: true,
};

const _ariaList: ReactAria.PhoneField.CountryListProps = {
	renderEmptyState: () => "Nothing",
	children: (country) => country.name,
};

export type SharedHook = ReturnType<typeof ReactAria.usePhoneField>["country"];
