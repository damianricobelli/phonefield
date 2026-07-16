import { REGEXP_ONLY_DIGITS } from "input-otp";
import { ArrowLeftIcon, CheckCircle2Icon, ShieldCheckIcon } from "lucide-react";
import { PhoneField } from "phonefield";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp";

const US_ONLY = ["US"] as const;

export function PhoneInputOtp() {
	const [step, setStep] = React.useState<"phone" | "code" | "done">("phone");
	const [code, setCode] = React.useState("");
	const [phone, setPhone] = React.useState<PhoneField.Value>({
		countryIso2: "US",
		countryDialCode: "+1",
		nationalNumber: "",
		e164: null,
		isValid: false,
	});

	return (
		<Card className="w-full max-w-md py-4 ring-0">
			<CardContent>
				{step === "done" ? (
					<div className="flex items-center gap-3">
						<CheckCircle2Icon className="size-5 shrink-0 text-muted-foreground" />
						<div>
							<p className="text-sm font-semibold">Phone verified</p>
							<p className="text-xs text-muted-foreground">{phone.e164}</p>
						</div>
					</div>
				) : step === "code" ? (
					<Field>
						<Button
							type="button"
							variant="ghost"
							size="xs"
							onClick={() => setStep("phone")}
							className="w-fit text-muted-foreground"
						>
							<ArrowLeftIcon className="size-3.5" /> {phone.e164}
						</Button>
						<div className="space-y-2">
							<FieldLabel htmlFor="otp-code">Enter the 6-digit code</FieldLabel>
							<InputOTP
								id="otp-code"
								maxLength={6}
								pattern={REGEXP_ONLY_DIGITS}
								value={code}
								onChange={setCode}
								inputMode="numeric"
								containerClassName="w-full"
							>
								<InputOTPGroup className="flex-1">
									{Array.from({ length: 3 }, (_, index) => (
										<InputOTPSlot
											key={index}
											index={index}
											className="h-10 flex-1"
										/>
									))}
								</InputOTPGroup>
								<InputOTPSeparator />
								<InputOTPGroup className="flex-1">
									{Array.from({ length: 3 }, (_, index) => (
										<InputOTPSlot
											key={index + 3}
											index={index + 3}
											className="h-10 flex-1"
										/>
									))}
								</InputOTPGroup>
							</InputOTP>
						</div>
						<Button
							type="button"
							size="lg"
							disabled={code.length !== 6}
							onClick={() => setStep("done")}
							className="w-full"
						>
							Verify code
						</Button>
					</Field>
				) : (
					<Field>
						<FieldLabel htmlFor="otp-phone" className="flex items-center gap-2">
							<ShieldCheckIcon className="size-4 text-muted-foreground" />
							Verify your phone
						</FieldLabel>
						<PhoneField.Root
							countries={US_ONLY}
							value={phone}
							onValueChange={setPhone}
							className="w-full"
						>
							<InputGroup className="h-10 bg-background shadow-sm">
								<PhoneField.Input
									render={<InputGroupInput />}
									id="otp-phone"
									placeholder="(202) 555-0123"
									className="h-full px-3"
								/>
								<InputGroupAddon align="inline-start" className="pr-2">
									<span aria-hidden>🇺🇸</span> +1
								</InputGroupAddon>
							</InputGroup>
						</PhoneField.Root>
						<Button
							type="button"
							size="lg"
							disabled={!phone.isValid}
							onClick={() => setStep("code")}
							className="w-full"
						>
							Send verification code
						</Button>
					</Field>
				)}
			</CardContent>
		</Card>
	);
}
