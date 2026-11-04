import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import { PhoneField, usePhoneField } from "phonefield";
import { getExampleNumber } from "phonefield/utils";
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

export function PhoneInputDrawer() {
	return (
		<PhoneField.Root
			defaultCountry="US"
			render={<Field />}
			className="w-full max-w-md"
		>
			<PhoneField.Label render={<FieldLabel />}>Mobile number</PhoneField.Label>
			<PhoneField.Group
				render={<InputGroup />}
				className="h-10 overflow-hidden bg-background shadow-sm"
			>
				<CountryDrawer />
				<PhoneField.Input
					render={<InputGroupInput />}
					placeholder={(country) => getExampleNumber(country.iso2)}
					className="h-full px-3"
				/>
			</PhoneField.Group>
			<PhoneField.Description render={<FieldDescription />} className="text-xs">
				A thumb-friendly country picker for mobile flows.
			</PhoneField.Description>
		</PhoneField.Root>
	);
}

// Any picker can drive the field: usePhoneField() exposes the
// available countries, the selected one, and a setter.
function CountryDrawer() {
	const { country: selected, countries, setCountry } = usePhoneField();
	const [open, setOpen] = React.useState(false);
	const [query, setQuery] = React.useState("");
	const normalizedQuery = query.trim().toLocaleLowerCase();
	const results = normalizedQuery
		? countries.filter((country) =>
				`${country.name} ${country.dialCode}`
					.toLocaleLowerCase()
					.includes(normalizedQuery),
			)
		: countries;

	return (
		<Drawer open={open} onOpenChange={setOpen} showSwipeHandle>
			<DrawerTrigger
				render={
					<Button
						type="button"
						variant="ghost"
						className="h-full shrink-0 rounded-none border-0 border-r border-input bg-transparent px-3 shadow-none focus-visible:border-r focus-visible:ring-0"
						aria-label={`Country: ${selected.name}`}
					/>
				}
			>
				<span aria-hidden>{selected.flag}</span>
				<span>{selected.dialCode}</span>
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
						<FieldLabel htmlFor="drawer-country-search" className="sr-only">
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
						{results.map((country) => (
							<Button
								key={country.iso2}
								type="button"
								variant="ghost"
								size="lg"
								onClick={() => {
									setCountry(country.iso2);
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
								{country.iso2 === selected.iso2 ? (
									<CheckIcon className="size-4" />
								) : null}
							</Button>
						))}
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
