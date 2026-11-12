import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { PhoneField } from "phonefield/radix";
import { isValid, parse } from "phonefield/utils";
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

const emptyPhone: PhoneField.InputValue = {
	countryIso2: "US",
	nationalNumber: "",
};

const phoneSchema = z.object({
	phone: z
		.custom<PhoneField.InputValue>()
		.refine((phone) => isValid(phone), "Enter a valid phone number."),
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
			onSubmit={form.handleSubmit(({ phone }) =>
				setSubmitted(parse(phone)?.number ?? null),
			)}
		>
			<Controller
				name="phone"
				control={form.control}
				render={({ field, fieldState }) => (
					<PhoneField.Root
						asChild
						countries={["US"]}
						value={field.value}
						onValueChange={field.onChange}
						onBlur={field.onBlur}
						invalid={fieldState.invalid}
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
										ref={field.ref}
										placeholder="(202) 555-0123"
										className="h-full px-3"
									>
										<InputGroupInput />
									</PhoneField.Input>
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
							</PhoneField.Group>
							<PhoneField.Error asChild>
								<FieldError>{fieldState.error?.message}</FieldError>
							</PhoneField.Error>
							<PhoneField.Description
								asChild
								className="truncate font-mono text-xs"
							>
								<FieldDescription>
									{submitted ?? "React Hook Form + Zod"}
								</FieldDescription>
							</PhoneField.Description>
						</Field>
					</PhoneField.Root>
				)}
			/>
		</form>
	);
}
