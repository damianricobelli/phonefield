import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import { PhoneField } from "phonefield";
import { getCountries } from "phonefield/utils";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";

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
		<Field className="w-full max-w-md">
			<FieldLabel htmlFor="drawer-phone">Mobile number</FieldLabel>
			<PhoneField.Root
				value={value}
				onValueChange={setValue}
				className="w-full"
			>
				<InputGroup className="h-10 overflow-hidden bg-background shadow-sm">
					<Drawer open={open} onOpenChange={setOpen} showSwipeHandle>
						<DrawerTrigger
							render={
								<Button
									type="button"
									variant="ghost"
									className="h-full rounded-none border-0 border-r border-input bg-transparent px-3 shadow-none focus-visible:border-r focus-visible:ring-0"
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
								<Field className="sticky top-0 z-10 bg-popover py-3">
									<FieldLabel
										htmlFor="drawer-country-search"
										className="sr-only"
									>
										Search countries
									</FieldLabel>
									<span className="relative block">
										<SearchIcon className="pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground" />
										<Input
											id="drawer-country-search"
											value={query}
											onChange={(event) => setQuery(event.target.value)}
											placeholder="Search countries"
											className="h-10 pl-9"
										/>
									</span>
								</Field>
								<div className="max-h-[min(55dvh,28rem)] overflow-y-auto">
									{filteredCountries.map((country) => (
										<Button
											key={country.iso2}
											type="button"
											variant="ghost"
											size="lg"
											onClick={() => {
												setValue((current) => ({
													...current,
													countryIso2: country.iso2,
												}));
												setOpen(false);
												setQuery("");
											}}
											className="w-full justify-start gap-3 px-3"
										>
											<span aria-hidden className="text-lg">
												{country.flag}
											</span>
											<span className="min-w-0 flex-1 truncate text-left">
												{country.name}
											</span>
											<span className="text-muted-foreground">
												{country.dialCode}
											</span>
											{country.iso2 === value.countryIso2 ? (
												<CheckIcon className="size-4" />
											) : null}
										</Button>
									))}
								</div>
							</div>
						</DrawerContent>
					</Drawer>
					<PhoneField.Input
						render={<InputGroupInput />}
						id="drawer-phone"
						placeholder="(202) 555-0123"
						className="h-full px-3"
					/>
				</InputGroup>
			</PhoneField.Root>
			<FieldDescription className="text-xs">
				A thumb-friendly country picker for mobile flows.
			</FieldDescription>
		</Field>
	);
}
