import { LoaderCircleIcon, LockIcon } from "lucide-react";
import { PhoneField } from "phonefield";
import { Field, FieldLabel } from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";

const savedPhone: PhoneField.InputValue = {
	countryIso2: "US",
	nationalNumber: "2025550123",
};

export function PhoneInputStates() {
	return (
		<div className="grid w-full max-w-2xl gap-3 sm:grid-cols-3">
			<StateField id="state-disabled" label="Disabled" state="disabled" />
			<StateField id="state-readonly" label="Read only" state="readonly" />
			<StateField id="state-loading" label="Saving" state="loading" />
		</div>
	);
}

function StateField({
	id,
	label,
	state,
}: {
	id: string;
	label: string;
	state: "disabled" | "loading" | "readonly";
}) {
	const disabled = state === "disabled";

	return (
		<Field data-disabled={disabled || undefined} className="gap-1">
			<FieldLabel htmlFor={id} className="text-xs">
				{label}
			</FieldLabel>
			<PhoneField.Root
				defaultValue={savedPhone}
				countries={["US"]}
				disabled={disabled}
				readOnly={state === "readonly" || state === "loading"}
				aria-busy={state === "loading" || undefined}
				render={<InputGroup />}
				className="h-9 bg-background shadow-sm"
			>
				<InputGroupAddon align="inline-start" className="pr-2">
					<span aria-hidden>🇺🇸</span> +1
				</InputGroupAddon>
				<PhoneField.Input
					render={<InputGroupInput />}
					id={id}
					className="h-full px-3 text-sm"
				/>
				{state === "loading" && (
					<InputGroupAddon align="inline-end">
						<LoaderCircleIcon className="animate-spin" aria-label="Saving" />
					</InputGroupAddon>
				)}
				{state === "readonly" && (
					<InputGroupAddon align="inline-end">
						<LockIcon aria-hidden />
					</InputGroupAddon>
				)}
			</PhoneField.Root>
		</Field>
	);
}
