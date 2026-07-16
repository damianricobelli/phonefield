import { ArrowLeftIcon, CheckCircle2Icon, ShieldCheckIcon } from "lucide-react";
import { PhoneField } from "phonefield";
import * as React from "react";
import {
	InputOTP,
	InputOTPGroup,
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

	if (step === "done") {
		return (
			<div className="flex w-full max-w-md items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
				<CheckCircle2Icon className="size-5 shrink-0" />
				<div>
					<p className="text-sm font-semibold">Phone verified</p>
					<p className="text-xs text-emerald-700">{phone.e164}</p>
				</div>
			</div>
		);
	}

	if (step === "code") {
		return (
			<div className="w-full max-w-md space-y-3">
				<button
					type="button"
					onClick={() => setStep("phone")}
					className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
				>
					<ArrowLeftIcon className="size-3.5" /> {phone.e164}
				</button>
				<div>
					<label htmlFor="otp-code" className="text-sm font-medium">
						Enter the 6-digit code
					</label>
					<InputOTP
						id="otp-code"
						maxLength={6}
						value={code}
						onChange={setCode}
						inputMode="numeric"
						containerClassName="mt-2"
					>
						<InputOTPGroup className="w-full">
							{Array.from({ length: 6 }, (_, index) => (
								<InputOTPSlot
									key={index}
									index={index}
									className="h-10 flex-1"
								/>
							))}
						</InputOTPGroup>
					</InputOTP>
				</div>
				<button
					type="button"
					disabled={code.length !== 6}
					onClick={() => setStep("done")}
					className="h-9 w-full rounded-lg bg-primary text-sm font-medium text-primary-foreground disabled:opacity-40"
				>
					Verify code
				</button>
			</div>
		);
	}

	return (
		<div className="w-full max-w-md space-y-3">
			<div className="flex items-center gap-2 text-sm font-medium">
				<ShieldCheckIcon className="size-4 text-sky-600" />
				Verify your phone
			</div>
			<PhoneField.Root
				countries={US_ONLY}
				value={phone}
				onValueChange={setPhone}
				className="flex h-10 overflow-hidden rounded-lg border border-input bg-background shadow-sm focus-within:ring-2 focus-within:ring-ring/50"
			>
				<span className="flex shrink-0 items-center gap-2 border-r border-input bg-muted/50 px-3 text-sm">
					<span aria-hidden>🇺🇸</span> +1
				</span>
				<PhoneField.Input
					aria-label="Phone number"
					placeholder="(202) 555-0123"
					className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
				/>
			</PhoneField.Root>
			<button
				type="button"
				disabled={!phone.isValid}
				onClick={() => setStep("code")}
				className="h-9 w-full rounded-lg bg-primary text-sm font-medium text-primary-foreground disabled:opacity-40"
			>
				Send verification code
			</button>
		</div>
	);
}
