import { ChevronDownIcon, LockKeyholeIcon } from "lucide-react";
import { PhoneField } from "phonefield";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const countryClassNames = {
	trigger:
		"group/phone-country-trigger flex h-full shrink-0 items-center gap-1.5 border-r border-slate-700 bg-slate-900 px-3 text-sm text-white outline-none transition-colors duration-150 hover:bg-slate-800 focus-visible:bg-slate-800 data-popup-open:bg-slate-800",
	icon: "text-slate-400 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-popup-open/phone-country-trigger:rotate-180 motion-reduce:transition-none",
	positioner: "isolate z-50",
	popup:
		"group/phone-country w-72 max-w-[var(--available-width)] origin-[var(--transform-origin)] overflow-hidden rounded-xl border border-slate-700 bg-slate-900 text-white shadow-2xl transition-[transform,opacity] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] data-ending-style:[transform:scale(0.97)] data-ending-style:opacity-0 data-starting-style:[transform:scale(0.97)] data-starting-style:opacity-0 motion-reduce:transform-none motion-reduce:transition-none",
	searchInputContainer: "border-b border-slate-700 p-2",
	searchInput:
		"h-9 w-full rounded-lg bg-slate-800 px-3 text-sm outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500",
	list: "max-h-64 overflow-y-auto p-1",
	item: "flex cursor-default items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none transition-colors duration-100 data-highlighted:bg-slate-800 data-selected:bg-slate-800",
	empty:
		"hidden w-full justify-center px-3 py-6 text-center text-sm text-slate-400 group-data-empty/phone-country:flex",
} satisfies PhoneField.CountryClassNames;

export function PhoneInputVerification() {
	const [value, setValue] = React.useState<PhoneField.InputValue>({
		countryIso2: "GB",
		nationalNumber: "",
	});

	return (
		<Card
			size="sm"
			className="w-full max-w-md gap-0 bg-slate-950 py-3.5 text-white shadow-xl ring-1 ring-slate-800"
		>
			<CardHeader className="gap-0 px-3.5">
				<CardTitle className="flex items-center gap-2 text-sm text-white">
					<LockKeyholeIcon className="size-4 text-emerald-400" />
					Secure verification
				</CardTitle>
				<CardDescription className="text-xs leading-5 text-slate-400">
					We will text a one-time code to this number.
				</CardDescription>
			</CardHeader>
			<Separator className="bg-slate-800" />
			<CardContent className="px-3.5">
				<Field>
					<FieldLabel htmlFor="verification-phone" className="sr-only">
						Phone number
					</FieldLabel>
					<PhoneField.Root
						value={value}
						onValueChange={setValue}
						className="flex h-10 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20"
					>
						<PhoneField.Country
							classNames={countryClassNames}
							icon={<ChevronDownIcon className="size-4" />}
							slotProps={{ trigger: { "aria-label": "Country" } }}
							renderCountryValue={(country) => (
								<>
									<span aria-hidden>{country.flag}</span>
									<span>{country.dialCode}</span>
								</>
							)}
							renderCountryItem={(country) => (
								<>
									<span aria-hidden>{country.flag}</span>
									<span className="min-w-0 flex-1 truncate">
										{country.name}
									</span>
									<span className="text-slate-400">{country.dialCode}</span>
								</>
							)}
						/>
						<PhoneField.Input
							render={<Input />}
							id="verification-phone"
							placeholder="20 7946 0018"
							className="h-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-3 text-white shadow-none placeholder:text-slate-500 focus-visible:ring-0 dark:bg-transparent"
						/>
					</PhoneField.Root>
				</Field>
			</CardContent>
			<CardFooter className="border-0 bg-transparent px-3.5 pt-2 pb-0">
				<Button
					type="button"
					size="lg"
					disabled={!value.nationalNumber}
					className="w-full bg-white text-slate-950 hover:bg-slate-200"
				>
					Send verification code
				</Button>
			</CardFooter>
		</Card>
	);
}
