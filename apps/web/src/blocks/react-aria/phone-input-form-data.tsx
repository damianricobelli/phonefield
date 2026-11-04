import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { PhoneField } from "phonefield/react-aria";
import { fromFormData, getExampleNumber } from "phonefield/utils";
import * as React from "react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";

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
			<PhoneField.Root
				defaultCountry="US"
				name="phone"
				render={(props) => <Field {...props} />}
				className="gap-1"
			>
				<PhoneField.Label render={(props) => <FieldLabel {...props} />}>
					Contact phone
				</PhoneField.Label>
				<PhoneField.Group
					render={(props) => <InputGroup {...props} />}
					className="h-10 overflow-hidden bg-background shadow-sm"
				>
					<CountrySelect />
					<PhoneField.Input
						render={(props) => <InputGroupInput {...props} />}
						placeholder={(country) => getExampleNumber(country.iso2)}
						className="h-full px-3"
					/>
					<InputGroupAddon align="inline-end">
						<InputGroupButton type="submit" variant="default" size="sm">
							Submit
						</InputGroupButton>
					</InputGroupAddon>
				</PhoneField.Group>
				<PhoneField.Description
					render={(props) => <FieldDescription {...props} />}
					className="truncate font-mono text-xs"
				>
					{submitted === undefined
						? "FormData → canonical value"
						: (submitted?.e164 ?? "Invalid or empty value")}
				</PhoneField.Description>
			</PhoneField.Root>
		</form>
	);
}

// The same helper can run in a server action.
export function parseSubmittedPhone(formData: FormData) {
	return fromFormData(formData, "phone");
}

function CountrySelect() {
	return (
		<PhoneField.Country>
			<PhoneField.CountryTrigger className="group/trigger flex h-full shrink-0 items-center gap-2 border-input border-r px-3 text-sm outline-none transition-colors duration-150 data-hovered:bg-accent data-focus-visible:bg-accent data-pressed:bg-accent">
				<PhoneField.CountryValue>
					{(country) => (
						<>
							<span aria-hidden>{country.flag}</span>
							<span>{country.dialCode}</span>
						</>
					)}
				</PhoneField.CountryValue>
				<PhoneField.CountryIcon className="text-muted-foreground transition-transform duration-150 ease-out group-data-pressed/trigger:rotate-180 motion-reduce:transition-none">
					<ChevronDownIcon className="size-4" />
				</PhoneField.CountryIcon>
			</PhoneField.CountryTrigger>
			<PhoneField.CountryPopover
				offset={6}
				className="z-50 flex w-72 flex-col overflow-hidden rounded-xl bg-popover text-popover-foreground shadow-xl ring-1 ring-foreground/10 data-entering:animate-in data-entering:fade-in-0 data-entering:zoom-in-95 data-exiting:animate-out data-exiting:fade-out-0 data-exiting:zoom-out-95"
			>
				<PhoneField.CountrySearch className="border-b p-1.5">
					<PhoneField.CountrySearchInput className="h-8 w-full rounded-md bg-muted/60 px-2.5 text-sm outline-none placeholder:text-muted-foreground data-focus-visible:ring-2 data-focus-visible:ring-ring/50 [&::-webkit-search-cancel-button]:hidden" />
				</PhoneField.CountrySearch>
				<PhoneField.CountryList
					className="max-h-80 min-h-0 flex-1 scroll-py-1 overflow-y-auto overscroll-contain p-1 outline-none"
					renderEmptyState={() => (
						<PhoneField.CountryEmpty className="px-3 py-6 text-center text-sm text-muted-foreground" />
					)}
				>
					{(country) => (
						<PhoneField.CountryItem
							country={country}
							className="flex cursor-default items-center gap-2 rounded-md px-2.5 py-1.5 text-sm outline-none select-none data-focused:bg-accent data-focused:text-accent-foreground"
						>
							<span aria-hidden>{country.flag}</span>
							<span className="min-w-0 flex-1 truncate">{country.name}</span>
							<span className="text-muted-foreground">{country.dialCode}</span>
							<PhoneField.CountryItemIndicator>
								<CheckIcon className="size-4" />
							</PhoneField.CountryItemIndicator>
						</PhoneField.CountryItem>
					)}
				</PhoneField.CountryList>
			</PhoneField.CountryPopover>
		</PhoneField.Country>
	);
}
