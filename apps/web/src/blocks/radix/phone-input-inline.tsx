import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { PhoneField } from "phonefield/radix";
import { getExampleNumber } from "phonefield/utils";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";

export function PhoneInputInline() {
	return (
		<PhoneField.Root
			asChild
			defaultCountry="US"
			name="phone"
			className="w-full max-w-md"
		>
			<Field>
				<PhoneField.Label asChild>
					<FieldLabel>Phone number</FieldLabel>
				</PhoneField.Label>
				<PhoneField.Group
					asChild
					className="h-10 overflow-hidden bg-background shadow-sm"
				>
					<InputGroup>
						<PhoneField.Country>
							<PhoneField.CountryTrigger className="group/trigger flex h-full shrink-0 items-center gap-2 border-input border-r px-3 text-sm outline-none transition-colors duration-150 hover:bg-accent focus-visible:bg-accent data-[state=open]:bg-accent">
								<PhoneField.CountryValue>
									{(country) => (
										<>
											<span aria-hidden>{country.flag}</span>
											<span>{country.dialCode}</span>
										</>
									)}
								</PhoneField.CountryValue>
								<PhoneField.CountryIcon className="text-muted-foreground transition-transform duration-150 ease-out group-data-[state=open]/trigger:rotate-180 motion-reduce:transition-none">
									<ChevronDownIcon className="size-4" />
								</PhoneField.CountryIcon>
							</PhoneField.CountryTrigger>
							<PhoneField.CountryPortal>
								<PhoneField.CountryContent
									sideOffset={6}
									className="z-50 flex max-h-[min(22rem,var(--radix-popover-content-available-height))] w-72 max-w-(--radix-popover-content-available-width) origin-(--radix-popover-content-transform-origin) flex-col overflow-hidden rounded-xl bg-popover text-popover-foreground shadow-xl ring-1 ring-foreground/10 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
								>
									<div className="border-b p-1.5">
										<PhoneField.CountrySearch className="h-8 w-full rounded-md bg-muted/60 px-2.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50" />
									</div>
									<PhoneField.CountryEmpty className="px-3 py-6 text-center text-sm text-muted-foreground empty:hidden" />
									<PhoneField.CountryList className="min-h-0 flex-1 scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0">
										{(country) => (
											<PhoneField.CountryItem
												country={country}
												className="flex cursor-default items-center gap-2 rounded-md px-2.5 py-1.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
											>
												<span aria-hidden>{country.flag}</span>
												<span className="min-w-0 flex-1 truncate">
													{country.name}
												</span>
												<span className="text-muted-foreground">
													{country.dialCode}
												</span>
												<PhoneField.CountryItemIndicator>
													<CheckIcon className="size-4" />
												</PhoneField.CountryItemIndicator>
											</PhoneField.CountryItem>
										)}
									</PhoneField.CountryList>
								</PhoneField.CountryContent>
							</PhoneField.CountryPortal>
						</PhoneField.Country>
						<PhoneField.Input
							asChild
							placeholder={(country) => getExampleNumber(country.iso2)}
							className="h-full px-3"
						>
							<InputGroupInput />
						</PhoneField.Input>
					</InputGroup>
				</PhoneField.Group>
				<PhoneField.Description asChild className="text-xs">
					<FieldDescription>
						Best for settings, profiles, and compact forms.
					</FieldDescription>
				</PhoneField.Description>
			</Field>
		</PhoneField.Root>
	);
}
