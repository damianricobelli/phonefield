import { ArrowDownToLineIcon, BlocksIcon, SmartphoneIcon } from "lucide-react";
import { PhoneInputDrawer } from "@/blocks/phone-input-drawer";
import { PhoneInputFixedCountry } from "@/blocks/phone-input-fixed-country";
import { PhoneInputFormData } from "@/blocks/phone-input-form-data";
import { PhoneInputInline } from "@/blocks/phone-input-inline";
import { PhoneInputOtp } from "@/blocks/phone-input-otp";
import { PhoneInputPaste } from "@/blocks/phone-input-paste";
import { PhoneInputSeparated } from "@/blocks/phone-input-separated";
import { PhoneInputSubset } from "@/blocks/phone-input-subset";
import { PhoneInputValidation } from "@/blocks/phone-input-validation";
import { PhoneInputVerification } from "@/blocks/phone-input-verification";
import { BlockCard } from "@/components/block-card";

const loadInlineCode = () =>
	import("@/blocks/phone-input-inline.tsx?raw").then(
		(module) => module.default,
	);
const loadSeparatedCode = () =>
	import("@/blocks/phone-input-separated.tsx?raw").then(
		(module) => module.default,
	);
const loadValidationCode = () =>
	import("@/blocks/phone-input-validation.tsx?raw").then(
		(module) => module.default,
	);
const loadFixedCountryCode = () =>
	import("@/blocks/phone-input-fixed-country.tsx?raw").then(
		(module) => module.default,
	);
const loadPasteCode = () =>
	import("@/blocks/phone-input-paste.tsx?raw").then((module) => module.default);
const loadFormDataCode = () =>
	import("@/blocks/phone-input-form-data.tsx?raw").then(
		(module) => module.default,
	);
const loadVerificationCode = () =>
	import("@/blocks/phone-input-verification.tsx?raw").then(
		(module) => module.default,
	);
const loadOtpCode = () =>
	import("@/blocks/phone-input-otp.tsx?raw").then((module) => module.default);
const loadSubsetCode = () =>
	import("@/blocks/phone-input-subset.tsx?raw").then(
		(module) => module.default,
	);
const loadDrawerCode = () =>
	import("@/blocks/phone-input-drawer.tsx?raw").then(
		(module) => module.default,
	);

export function BlocksSection() {
	return (
		<section
			id="blocks"
			className="relative scroll-mt-16 border-t border-slate-200 bg-slate-100/70"
		>
			<div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 md:py-24">
				<header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
					<div className="max-w-3xl">
						<div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-sky-700 uppercase">
							<BlocksIcon className="size-4" aria-hidden="true" />
							Shadcn blocks
						</div>
						<h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
							Copy. Paste. Make it yours.
						</h2>
						<p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
							Production-ready compositions for common product flows. Every
							preview is interactive and its source is the exact code you copy.
						</p>
					</div>

					<div className="grid shrink-0 grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 text-xs text-slate-600">
						<div className="flex items-center gap-2 bg-white px-3 py-2.5">
							<ArrowDownToLineIcon className="size-4 text-sky-600" />
							Copy-paste
						</div>
						<div className="flex items-center gap-2 bg-white px-3 py-2.5">
							<SmartphoneIcon className="size-4 text-sky-600" />
							Responsive
						</div>
					</div>
				</header>

				<div className="mt-10 grid min-w-0 gap-5 lg:grid-cols-2">
					<BlockCard
						title="Inline country select"
						description="One visual control with two accessible inputs. A sensible default for account settings and contact forms."
						labels={["shadcn", "desktop"]}
						code={loadInlineCode}
					>
						<PhoneInputInline />
					</BlockCard>

					<BlockCard
						title="Separated country select"
						description="Country and phone number keep their own visual boundaries. Ideal for checkout and data-heavy forms."
						labels={["checkout", "responsive"]}
						code={loadSeparatedCode}
					>
						<PhoneInputSeparated />
					</BlockCard>

					<BlockCard
						title="Validated field"
						description="Required and invalid states composed with the shadcn Field primitives and accessible error messaging."
						labels={["field", "validation"]}
						code={loadValidationCode}
					>
						<PhoneInputValidation />
					</BlockCard>

					<BlockCard
						title="Fixed country"
						description="Removes the picker when the product already knows the market, while keeping canonical phone parsing."
						labels={["single market", "simple"]}
						code={loadFixedCountryCode}
					>
						<PhoneInputFixedCountry />
					</BlockCard>

					<BlockCard
						title="International paste detection"
						description="Pasting an international + prefix updates the selected country and exposes the normalized E.164 value."
						labels={["paste", "e.164"]}
						code={loadPasteCode}
					>
						<PhoneInputPaste />
					</BlockCard>

					<BlockCard
						title="Native FormData"
						description="Serializes the minimal source value and rebuilds trusted derived fields at the form boundary."
						labels={["server action", "form"]}
						code={loadFormDataCode}
					>
						<PhoneInputFormData />
					</BlockCard>

					<BlockCard
						title="Verification card"
						description="A controlled composition with a purpose-built call to action for OTP and onboarding flows."
						labels={["controlled", "dark"]}
						code={loadVerificationCode}
					>
						<PhoneInputVerification />
					</BlockCard>

					<BlockCard
						title="Phone to OTP flow"
						description="A complete two-step interaction that validates the phone before revealing the one-time-code input."
						labels={["otp", "multi-step"]}
						code={loadOtpCode}
					>
						<PhoneInputOtp />
					</BlockCard>

					<BlockCard
						title="Localized country subset"
						description="Limits the picker to supported markets and localizes country names, search, and empty-state copy."
						labels={["i18n", "subset"]}
						code={loadSubsetCode}
					>
						<PhoneInputSubset />
					</BlockCard>

					<BlockCard
						title="Country select in a Drawer"
						description="A mobile-first picker built with the shadcn Drawer. It uses controlled state and the public getCountries() utility."
						labels={["drawer", "mobile"]}
						code={loadDrawerCode}
					>
						<PhoneInputDrawer />
					</BlockCard>
				</div>

				<div className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-600">
					<strong className="font-semibold text-slate-950">
						Before pasting:
					</strong>{" "}
					install <code>phonefield</code> and add the shadcn components imported
					by that recipe. Across this collection they are <code>button</code>,{" "}
					<code>button-group</code>, <code>card</code>, <code>drawer</code>,{" "}
					<code>field</code>, <code>input</code>, <code>input-group</code>,{" "}
					<code>input-otp</code>, <code>separator</code>, <code>tabs</code>, and{" "}
					<code>textarea</code>.
				</div>
			</div>
		</section>
	);
}
