import { useForm } from "@tanstack/react-form";
import { PhoneField } from "phonefield/radix";
import * as React from "react";
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

export function PhoneInputTanStackForm() {
	const [submitted, setSubmitted] = React.useState<string | null>(null);
	const form = useForm({
		defaultValues: { phone: emptyPhone },
		validators: { onChange: phoneSchema },
		onSubmit: ({ value }) => setSubmitted(value.phone.e164),
	});

	return (
		<form
			className="w-full max-w-md"
			onSubmit={(event) => {
				event.preventDefault();
				form.handleSubmit();
			}}
		>
			<form.Field
				name="phone"
				children={(field) => (
					<PhoneField.Root
						asChild
						countries={["US"]}
						value={field.state.value}
						onValueChange={field.handleChange}
						invalid={!field.state.meta.isValid}
					>
						<Field>
							<PhoneField.Label
								asChild
								className="data-invalid:text-destructive"
							>
								<FieldLabel>Phone number</FieldLabel>
							</PhoneField.Label>
							<PhoneField.Group
								asChild
								className="h-10 bg-background shadow-sm"
							>
								<InputGroup>
									<InputGroupAddon align="inline-start" className="pr-2">
										<span aria-hidden>🇺🇸</span> +1
									</InputGroupAddon>
									<PhoneField.Input
										asChild
										onBlur={field.handleBlur}
										placeholder="(202) 555-0123"
										className="h-full px-3"
									>
										<InputGroupInput />
									</PhoneField.Input>
									<InputGroupAddon align="inline-end">
										<form.Subscribe
											selector={(state) => [
												state.canSubmit,
												state.isSubmitting,
											]}
											children={([canSubmit, isSubmitting]) => (
												<InputGroupButton
													type="submit"
													variant="default"
													size="sm"
													disabled={!canSubmit || isSubmitting}
												>
													Save
												</InputGroupButton>
											)}
										/>
									</InputGroupAddon>
								</InputGroup>
							</PhoneField.Group>
							<PhoneField.Error asChild>
								<FieldError>{field.state.meta.errors[0]?.message}</FieldError>
							</PhoneField.Error>
							<PhoneField.Description
								asChild
								className="truncate font-mono text-xs"
							>
								<FieldDescription>
									{submitted ?? "TanStack Form + Zod"}
								</FieldDescription>
							</PhoneField.Description>
						</Field>
					</PhoneField.Root>
				)}
			/>
		</form>
	);
}
