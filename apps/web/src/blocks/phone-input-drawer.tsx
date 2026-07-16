import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import { PhoneField } from "phonefield";
import { getCountries } from "phonefield/utils";
import * as React from "react";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";

const countries = Array.from(getCountries().values());

export function PhoneInputDrawer() {
	const [open, setOpen] = React.useState(false);
	const [query, setQuery] = React.useState("");
	const [value, setValue] = React.useState<PhoneField.InputValue>({
		countryIso2: "US",
		nationalNumber: "",
	});
	const selectedCountry =
		countries.find((country) => country.iso2 === value.countryIso2) ??
		countries[0];
	const normalizedQuery = query.trim().toLocaleLowerCase();
	const filteredCountries = normalizedQuery
		? countries.filter((country) =>
				`${country.name} ${country.dialCode}`
					.toLocaleLowerCase()
					.includes(normalizedQuery),
			)
		: countries;

	return (
		<div className="w-full max-w-md space-y-2">
			<label htmlFor="drawer-phone" className="text-sm font-medium">
				Mobile number
			</label>
			<PhoneField.Root
				value={value}
				onValueChange={setValue}
				className="flex h-11 overflow-hidden rounded-xl border border-input bg-background shadow-sm focus-within:ring-2 focus-within:ring-ring/50"
			>
				<Drawer open={open} onOpenChange={setOpen} showSwipeHandle>
					<DrawerTrigger
						render={
							<button
								type="button"
								className="flex h-full shrink-0 items-center gap-2 border-r border-input px-3 text-sm outline-none hover:bg-accent focus-visible:bg-accent"
								aria-label="Choose country"
							/>
						}
					>
						<span aria-hidden>{selectedCountry?.flag}</span>
						<span>{selectedCountry?.dialCode}</span>
						<ChevronDownIcon className="size-4 text-muted-foreground" />
					</DrawerTrigger>
					<DrawerContent className="mx-auto max-w-2xl">
						<DrawerHeader className="border-b px-5 pb-4 text-left">
							<DrawerTitle>Choose your country</DrawerTitle>
							<DrawerDescription>
								Search by country name or dialing code.
							</DrawerDescription>
						</DrawerHeader>
						<div className="min-h-0 flex-1 px-4 pb-5">
							<label className="sticky top-0 z-10 block bg-popover py-3">
								<span className="sr-only">Search countries</span>
								<span className="relative block">
									<SearchIcon className="pointer-events-none absolute top-2.5 left-3 size-4 text-muted-foreground" />
									<input
										value={query}
										onChange={(event) => setQuery(event.target.value)}
										placeholder="Search countries"
										className="h-10 w-full rounded-lg border border-input bg-background pr-3 pl-9 text-sm outline-none focus:ring-2 focus:ring-ring"
									/>
								</span>
							</label>
							<div className="max-h-[min(55dvh,28rem)] overflow-y-auto">
								{filteredCountries.map((country) => (
									<button
										key={country.iso2}
										type="button"
										onClick={() => {
											setValue((current) => ({
												...current,
												countryIso2: country.iso2,
											}));
											setOpen(false);
											setQuery("");
										}}
										className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
									>
										<span aria-hidden className="text-lg">
											{country.flag}
										</span>
										<span className="min-w-0 flex-1 truncate">
											{country.name}
										</span>
										<span className="text-muted-foreground">
											{country.dialCode}
										</span>
										{country.iso2 === value.countryIso2 ? (
											<CheckIcon className="size-4" />
										) : null}
									</button>
								))}
							</div>
						</div>
					</DrawerContent>
				</Drawer>
				<PhoneField.Input
					id="drawer-phone"
					placeholder="(202) 555-0123"
					className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
				/>
			</PhoneField.Root>
			<p className="text-xs text-muted-foreground">
				A thumb-friendly country picker for mobile flows.
			</p>
		</div>
	);
}
