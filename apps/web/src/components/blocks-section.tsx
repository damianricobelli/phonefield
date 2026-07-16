import { ArrowDownToLineIcon, BlocksIcon, SmartphoneIcon } from "lucide-react";
import { PhoneInputDrawer } from "@/blocks/phone-input-drawer";
import phoneInputDrawerCode from "@/blocks/phone-input-drawer.tsx?raw";
import { PhoneInputInline } from "@/blocks/phone-input-inline";
import phoneInputInlineCode from "@/blocks/phone-input-inline.tsx?raw";
import { PhoneInputSeparated } from "@/blocks/phone-input-separated";
import phoneInputSeparatedCode from "@/blocks/phone-input-separated.tsx?raw";
import { PhoneInputVerification } from "@/blocks/phone-input-verification";
import phoneInputVerificationCode from "@/blocks/phone-input-verification.tsx?raw";
import { BlockCard } from "@/components/block-card";

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
						code={phoneInputInlineCode}
					>
						<PhoneInputInline />
					</BlockCard>

					<BlockCard
						title="Separated country select"
						description="Country and phone number keep their own visual boundaries. Ideal for checkout and data-heavy forms."
						labels={["checkout", "responsive"]}
						code={phoneInputSeparatedCode}
					>
						<PhoneInputSeparated />
					</BlockCard>

					<BlockCard
						title="Verification card"
						description="A controlled composition with a purpose-built call to action for OTP and onboarding flows."
						labels={["controlled", "dark"]}
						code={phoneInputVerificationCode}
					>
						<PhoneInputVerification />
					</BlockCard>

					<BlockCard
						title="Country select in a Drawer"
						description="A mobile-first picker built with the shadcn Drawer. It uses controlled state and the public getCountries() utility."
						labels={["drawer", "mobile"]}
						code={phoneInputDrawerCode}
					>
						<PhoneInputDrawer />
					</BlockCard>
				</div>

				<div className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-600">
					<strong className="font-semibold text-slate-950">
						Before pasting:
					</strong>{" "}
					install <code>phonefield</code>. The Drawer recipe also expects the
					shadcn <code>drawer</code> component at{" "}
					<code>@/components/ui/drawer</code>.
				</div>
			</div>
		</section>
	);
}
