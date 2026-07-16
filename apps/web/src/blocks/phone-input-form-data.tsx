import { ChevronDownIcon } from "lucide-react";
import { PhoneField } from "phonefield";
import { fromFormData } from "phonefield/utils";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const countryClassNames = {
	trigger:
		"group/phone-country-trigger flex h-full w-fit shrink-0 items-center gap-2 border-r border-input px-3 text-sm outline-none transition-colors duration-150 hover:bg-accent focus-visible:bg-accent data-popup-open:bg-accent",
	icon: "text-muted-foreground transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-popup-open/phone-country-trigger:rotate-180 motion-reduce:transition-none",
	positioner: "isolate z-50",
	popup:
		"group/phone-country w-72 max-w-[var(--available-width)] origin-[var(--transform-origin)] overflow-hidden rounded-xl border bg-popover shadow-xl transition-[transform,opacity] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] data-ending-style:[transform:scale(0.97)] data-ending-style:opacity-0 data-starting-style:[transform:scale(0.97)] data-starting-style:opacity-0 motion-reduce:transform-none motion-reduce:transition-none",
	searchInputContainer: "border-b p-2",
	searchInput:
		"h-9 w-full rounded-lg bg-muted px-3 text-sm outline-none focus:ring-2 focus:ring-ring",
	list: "max-h-64 overflow-y-auto p-1",
	item: "flex cursor-default items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none data-highlighted:bg-accent data-selected:bg-accent",
	empty:
		"hidden justify-center px-3 py-6 text-sm text-muted-foreground group-data-empty/phone-country:flex",
} satisfies PhoneField.CountryClassNames;

export function PhoneInputFormData() {
	const [submitted, setSubmitted] = React.useState<PhoneField.Value | null>();

	return (
		<form
			className="w-full max-w-md space-y-2"
			onSubmit={(event) => {
				event.preventDefault();
				setSubmitted(fromFormData(new FormData(event.currentTarget), "phone"));
			}}
		>
			<FieldGroup className="gap-3">
				<Field className="gap-1">
					<FieldLabel htmlFor="form-data-phone">Contact phone</FieldLabel>
					<ButtonGroup className="w-full">
						<PhoneField.Root
							defaultCountry="US"
							name="phone"
							className="flex h-10 min-w-0 flex-1 overflow-hidden rounded-lg border border-input bg-background shadow-sm focus-within:ring-2 focus-within:ring-ring/50"
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
							<PhoneField.Input
								render={<Input />}
								id="form-data-phone"
								placeholder="(202) 555-0123"
								className="h-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-3 shadow-none focus-visible:ring-0 dark:bg-transparent"
							/>
						</PhoneField.Root>
						<Button type="submit" size="lg" className="h-10 px-4">
							Submit
						</Button>
					</ButtonGroup>
					<FieldDescription className="truncate font-mono text-xs">
						{submitted === undefined
							? "FormData → canonical value"
							: (submitted?.e164 ?? "Invalid or empty value")}
					</FieldDescription>
				</Field>
				<Field className="gap-1">
					<FieldLabel htmlFor="contact-note">Note (optional)</FieldLabel>
					<Textarea
						id="contact-note"
						name="note"
						placeholder="Best time to call"
						className="h-12 min-h-12 resize-none"
					/>
				</Field>
			</FieldGroup>
		</form>
	);
}

// The same helper can run in a server action.
export function parseSubmittedPhone(formData: FormData) {
	return fromFormData(formData, "phone");
}
