import { LockIcon } from "lucide-react";
import { PhoneField } from "phonefield";

export function PhoneInputFixedCountry() {
	return (
		<div className="w-full max-w-md space-y-2">
			<div className="flex items-center justify-between gap-3">
				<label htmlFor="fixed-country-phone" className="text-sm font-medium">
					US phone number
				</label>
				<span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
					<LockIcon className="size-3" /> Fixed region
				</span>
			</div>
			<PhoneField.Root
				defaultCountry="US"
				countries={["US"]}
				name="phone"
				className="flex h-10 overflow-hidden rounded-lg border border-input bg-background shadow-sm focus-within:ring-2 focus-within:ring-ring/50"
			>
				<span className="flex shrink-0 items-center gap-2 border-r border-input bg-muted/50 px-3 text-sm">
					<span aria-hidden>🇺🇸</span>
					<span>+1</span>
				</span>
				<PhoneField.Input
					id="fixed-country-phone"
					placeholder="(202) 555-0123"
					className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
				/>
			</PhoneField.Root>
			<p className="text-xs text-muted-foreground">
				No country picker when the market is already known.
			</p>
		</div>
	);
}
