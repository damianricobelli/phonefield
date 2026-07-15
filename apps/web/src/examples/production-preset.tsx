import { ChevronDownIcon } from "lucide-react";
import { PhoneField } from "phonefield";
import { inputClassName } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const defaultCountryClassNames = {
	trigger:
		"group/phone-country-trigger flex h-full w-fit shrink-0 cursor-default items-center gap-2 border-input border-r bg-transparent px-3 text-left text-sm outline-none select-none transition-colors duration-150 hover:bg-accent/50 focus-visible:bg-accent/50 data-popup-open:bg-accent/50",
	icon: "shrink-0 text-muted-foreground transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-popup-open/phone-country-trigger:rotate-180 motion-reduce:transition-none",
	positioner: "isolate z-50",
	popup:
		"max-h-(--available-height) w-72 max-w-(--available-width) origin-(--transform-origin) overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-2xl ring-1 ring-foreground/5 transition-[transform,opacity] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none",
	searchInputContainer: "p-1",
	searchInput: inputClassName,
	list: "max-h-72 scroll-py-1 overflow-y-auto overscroll-contain p-1",
	item: "flex cursor-default items-center rounded-lg px-3 py-2 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-selected:bg-accent data-selected:text-accent-foreground",
	empty: "p-6 text-center text-sm text-muted-foreground",
} satisfies PhoneField.CountryClassNames;

const defaultCountryIcon = <ChevronDownIcon aria-hidden className="size-4" />;

function renderCountryItem(country: PhoneField.Country) {
	return (
		<span className="flex min-w-0 flex-1 items-center gap-2.5">
			<span aria-hidden className="shrink-0">
				{country.flag}
			</span>
			<span className="min-w-0 flex-1 truncate">{country.name}</span>
			<span className="shrink-0 text-muted-foreground">{country.dialCode}</span>
		</span>
	);
}

function renderCountryValue(country: PhoneField.Country) {
	return (
		<span className="flex min-w-0 items-center gap-2">
			<span aria-hidden>{country.flag}</span>
			<span>{country.dialCode}</span>
			<span className="sr-only">{country.name}</span>
		</span>
	);
}

type ProductionPhoneFieldProps = Omit<PhoneField.RootProps, "children"> & {
	countryClassNames?: PhoneField.CountryClassNames;
	countryProps?: Omit<PhoneField.CountryProps, "classNames">;
	inputClassName?: string;
	inputProps?: Omit<PhoneField.InputProps, "className">;
};

export function ProductionPhoneField({
	className,
	countryClassNames = defaultCountryClassNames,
	countryProps,
	defaultCountry = "US",
	inputClassName: inputClassNameOverride,
	inputProps,
	...props
}: ProductionPhoneFieldProps) {
	const {
		icon = defaultCountryIcon,
		renderCountryItem: countryItemRenderer = renderCountryItem,
		renderCountryValue: countryValueRenderer = renderCountryValue,
		slotProps,
		...resolvedCountryProps
	} = countryProps ?? {};
	const { trigger: countryTriggerProps, ...resolvedCountrySlotProps } =
		slotProps ?? {};
	const {
		"aria-label": inputAriaLabel = "Phone number",
		...resolvedInputProps
	} = inputProps ?? {};

	return (
		<PhoneField.Root
			{...props}
			className={cn(
				"flex h-10 min-w-0 overflow-hidden rounded-lg border border-input bg-background shadow-sm transition-[border-color,box-shadow] duration-150",
				"focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/50",
				"has-data-popup-open:border-ring has-data-popup-open:ring-2 has-data-popup-open:ring-ring/50",
				"has-aria-invalid:border-destructive has-aria-invalid:ring-2 has-aria-invalid:ring-destructive/20",
				className,
			)}
			defaultCountry={defaultCountry}
		>
			<PhoneField.Country
				{...resolvedCountryProps}
				classNames={countryClassNames}
				icon={icon}
				renderCountryItem={countryItemRenderer}
				renderCountryValue={countryValueRenderer}
				slotProps={{
					...resolvedCountrySlotProps,
					trigger: {
						"aria-label": "Country",
						...countryTriggerProps,
					},
				}}
			/>
			<PhoneField.Input
				{...resolvedInputProps}
				aria-label={inputAriaLabel}
				className={cn(
					inputClassName,
					"h-full w-auto min-w-0 flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0",
					inputClassNameOverride,
				)}
			/>
		</PhoneField.Root>
	);
}
