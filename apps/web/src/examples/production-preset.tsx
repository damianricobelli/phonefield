import { PhoneField } from "phonefield";

const countryClassNames = {
	trigger:
		"group flex h-10 shrink-0 cursor-default items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none select-none focus-visible:ring-2 focus-visible:ring-sky-600",
	icon:
		"text-slate-500 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-popup-open:rotate-180 motion-reduce:transition-none",
	positioner: "z-50",
	popup:
		"max-h-[var(--available-height)] w-72 origin-[var(--transform-origin)] overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-slate-950/10 transition-[transform,opacity] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none",
	searchInputContainer: "p-2",
	searchInput:
		"h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-600",
	list: "max-h-64 overflow-y-auto p-1",
	item: "flex cursor-default items-center rounded-lg px-3 py-2 text-sm outline-none data-highlighted:bg-slate-100",
	empty: "p-6 text-center text-sm text-slate-500",
} satisfies PhoneField.CountryClassNames;

export function ProductionPhoneField() {
	return (
		<PhoneField.Root className="flex min-w-0 gap-2" defaultCountry="US">
			<PhoneField.Country classNames={countryClassNames} />
			<PhoneField.Input
				aria-label="Phone number"
				className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 px-3 outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
			/>
		</PhoneField.Root>
	);
}
