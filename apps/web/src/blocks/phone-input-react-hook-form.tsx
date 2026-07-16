import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { PhoneField } from "phonefield";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";

const emptyPhone: PhoneField.Value = {
	countryIso2: "US",
	countryDialCode: "+1",
	nationalNumber: "",
	e164: null,
	isValid: false,
};

const phoneSchema = z.object({
	phone: z.custom<PhoneField.Value>(
		(value) =>
			Boolean(
				value &&
					typeof value === "object" &&
					"isValid" in value &&
					value.isValid,
			),
		"Enter a valid phone number.",
	),
});

export function PhoneInputReactHookForm() {
	const [submitted, setSubmitted] = React.useState<string | null>(null);
	const form = useForm<z.infer<typeof phoneSchema>>({
		defaultValues: { phone: emptyPhone },
		mode: "onChange",
		resolver: standardSchemaResolver(phoneSchema),
	});

	return (
		<form
			className="w-full max-w-md"
			onSubmit={form.handleSubmit(({ phone }) => setSubmitted(phone.e164))}
		>
			<Controller
				name="phone"
				control={form.control}
				render={({ field, fieldState }) => {
					const invalid = fieldState.isDirty && fieldState.invalid;

					return (
						<Field data-invalid={invalid || undefined}>
							<FieldLabel htmlFor="rhf-phone">Phone number</FieldLabel>
							<PhoneField.Root
								countries={["US"]}
								value={field.value}
								onValueChange={field.onChange}
								className="w-full"
							>
								<InputGroup className="h-10 bg-background shadow-sm">
									<PhoneField.Input
										render={<InputGroupInput />}
										id="rhf-phone"
										onBlur={field.onBlur}
										aria-invalid={invalid || undefined}
										placeholder="(202) 555-0123"
										className="h-full px-3"
									/>
									<InputGroupAddon align="inline-start" className="pr-2">
										<span aria-hidden>🇺🇸</span> +1
									</InputGroupAddon>
									<InputGroupAddon align="inline-end">
										<InputGroupButton
											type="submit"
											variant="default"
											size="sm"
											disabled={!form.formState.isValid}
										>
											Save
										</InputGroupButton>
									</InputGroupAddon>
								</InputGroup>
							</PhoneField.Root>
							{invalid ? (
								<FieldError errors={[fieldState.error]} />
							) : (
								<FieldDescription className="truncate font-mono text-xs">
									{submitted ?? "React Hook Form + Zod"}
								</FieldDescription>
							)}
						</Field>
					);
				}}
			/>
		</form>
	);
}
