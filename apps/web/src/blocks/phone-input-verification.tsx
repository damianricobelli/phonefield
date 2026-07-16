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
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";

const countryClassNames = {
	trigger:
		"group/phone-country-trigger flex h-full shrink-0 items-center gap-1.5 border-r border-input px-3 text-sm outline-none transition-colors duration-150 hover:bg-accent focus-visible:bg-accent data-popup-open:bg-accent",
	icon: "text-muted-foreground transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-popup-open/phone-country-trigger:rotate-180 motion-reduce:transition-none",
	positioner: "isolate z-50",
	popup:
		"group/phone-country w-72 max-w-[var(--available-width)] origin-[var(--transform-origin)] overflow-hidden rounded-xl border bg-popover shadow-xl transition-[transform,opacity] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] data-ending-style:[transform:scale(0.97)] data-ending-style:opacity-0 data-starting-style:[transform:scale(0.97)] data-starting-style:opacity-0 motion-reduce:transform-none motion-reduce:transition-none",
	searchInputContainer: "border-b p-2",
	searchInput:
		"h-9 w-full rounded-lg bg-muted px-3 text-sm outline-none focus:ring-2 focus:ring-ring",
	list: "max-h-64 overflow-y-auto p-1",
	item: "flex cursor-default items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none transition-colors duration-100 data-highlighted:bg-accent data-selected:bg-accent",
	empty:
		"hidden w-full justify-center px-3 py-6 text-center text-sm text-muted-foreground group-data-empty/phone-country:flex",
} satisfies PhoneField.CountryClassNames;

export function PhoneInputVerification() {
	const [value, setValue] = React.useState<PhoneField.InputValue>({
		countryIso2: "GB",
		nationalNumber: "",
	});

	return (
		<Card
			size="sm"
			className="w-full max-w-md gap-0 border border-border bg-card py-0 shadow-sm ring-0"
		>
			<CardHeader className="gap-0 px-4 pt-4 pb-3">
				<CardTitle className="flex items-center gap-2 text-sm">
					<LockKeyholeIcon className="size-4 text-muted-foreground" />
					Secure verification
				</CardTitle>
				<CardDescription className="text-xs leading-5">
					We will text a one-time code to this number.
				</CardDescription>
			</CardHeader>
			<Separator />
			<CardContent className="px-4 pt-3">
				<Field>
					<FieldLabel htmlFor="verification-phone" className="sr-only">
						Phone number
					</FieldLabel>
					<PhoneField.Root
						value={value}
						onValueChange={setValue}
						className="w-full"
					>
						<InputGroup className="h-10 overflow-hidden bg-background shadow-sm">
							<PhoneField.Input
								render={<InputGroupInput />}
								id="verification-phone"
								placeholder="20 7946 0018"
								className="h-full px-3"
							/>
							<InputGroupAddon
								align="inline-start"
								className="h-full cursor-default p-0"
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
											<span className="text-muted-foreground">
												{country.dialCode}
											</span>
										</>
									)}
								/>
							</InputGroupAddon>
						</InputGroup>
					</PhoneField.Root>
				</Field>
			</CardContent>
			<CardFooter className="border-0 bg-transparent px-4 pt-2 pb-4">
				<Button
					type="button"
					size="lg"
					disabled={!value.nationalNumber}
					className="w-full"
				>
					Send verification code
				</Button>
			</CardFooter>
		</Card>
	);
}
