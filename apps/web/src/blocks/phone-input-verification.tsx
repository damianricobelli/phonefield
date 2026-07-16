import { ChevronDownIcon, LockKeyholeIcon } from "lucide-react";
import { PhoneField } from "phonefield";
import * as React from "react";

const countryClassNames = {
	trigger:
		"group flex h-full shrink-0 items-center gap-1.5 border-r border-slate-700 bg-slate-900 px-3 text-sm text-white outline-none hover:bg-slate-800 focus-visible:bg-slate-800",
	icon: "text-slate-400 transition-transform group-data-popup-open:rotate-180",
	positioner: "z-50",
	popup:
		"w-72 max-w-[var(--available-width)] overflow-hidden rounded-xl border border-slate-700 bg-slate-900 text-white shadow-2xl",
	searchInputContainer: "border-b border-slate-700 p-2",
	searchInput:
		"h-9 w-full rounded-lg bg-slate-800 px-3 text-sm outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500",
	list: "max-h-64 overflow-y-auto p-1",
	item: "flex cursor-default items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none data-highlighted:bg-slate-800 data-selected:bg-slate-800",
	empty: "p-6 text-center text-sm text-slate-400",
} satisfies PhoneField.CountryClassNames;

export function PhoneInputVerification() {
	const [value, setValue] = React.useState<PhoneField.InputValue>({
		countryIso2: "GB",
		nationalNumber: "",
	});

	return (
		<div className="w-full max-w-md rounded-2xl bg-slate-950 p-5 text-white shadow-xl">
			<div className="flex items-center gap-2 text-sm font-medium">
				<LockKeyholeIcon className="size-4 text-emerald-400" />
				Secure verification
			</div>
			<p className="mt-1 text-xs leading-5 text-slate-400">
				We will text a one-time code to this number.
			</p>

			<PhoneField.Root
				value={value}
				onValueChange={setValue}
				className="mt-4 flex h-11 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20"
			>
				<PhoneField.Country
					classNames={countryClassNames}
					icon={<ChevronDownIcon className="size-4" />}
					renderCountryValue={(country) => (
						<>
							<span aria-hidden>{country.flag}</span>
							<span>{country.dialCode}</span>
						</>
					)}
					renderCountryItem={(country) => (
						<>
							<span aria-hidden>{country.flag}</span>
							<span className="min-w-0 flex-1 truncate">{country.name}</span>
							<span className="text-slate-400">{country.dialCode}</span>
						</>
					)}
				/>
				<PhoneField.Input
					aria-label="Phone number"
					placeholder="20 7946 0018"
					className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-slate-500"
				/>
			</PhoneField.Root>

			<button
				type="button"
				disabled={!value.nationalNumber}
				className="mt-3 h-10 w-full rounded-xl bg-white text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
			>
				Send verification code
			</button>
		</div>
	);
}
