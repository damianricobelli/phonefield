import { useForm } from "@tanstack/react-form";
import { PhoneField } from "phonefield/radix";
import { isValid, parse } from "phonefield/utils";
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

const emptyPhone: PhoneField.InputValue = {
	countryIso2: "US",
	nationalNumber: "",
};

const phoneSchema = z.object({
	phone: z
		.custom<PhoneField.InputValue>()
		.refine((phone) => isValid(phone), "Enter a valid phone number."),
});

export function PhoneInputTanStackForm() {
	const [submitted, setSubmitted] = React.useState<string | null>(null);
	const form = useForm({
		defaultValues: { phone: emptyPhone },
		validators: { onChange: phoneSchema },
		onSubmit: ({ value }) => setSubmitted(parse(value.phone)?.number ?? null),
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
						onBlur={field.handleBlur}
						invalid={!field.state.meta.isValid}
						autoInvalid={false}
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
										data-slot="input-group-control"
										asChild
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
