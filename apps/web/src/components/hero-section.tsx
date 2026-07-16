import { ArrowRight, Braces, Globe2, ShieldCheck } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { HighlightedCode } from "@/components/doc-block";

const snippet = `import { PhoneField } from "phonefield";

export function App() {
  return (
    <PhoneField.Root>
      <PhoneField.Country />
      <PhoneField.Input aria-label="Phone number" />
    </PhoneField.Root>
  );
}`;

export function HeroSection() {
	return (
		<section className="relative mx-auto max-w-6xl px-5 pb-16 pt-14 sm:px-6 md:pb-24 md:pt-20 lg:pt-28">
			<div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
				<div className="flex min-w-0 flex-col justify-center">
					<p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
						<span className="size-1.5 rounded-full bg-sky-500" />
						Composable React primitive
					</p>

					<h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.04] tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-[4rem]">
						A phone field that fits your design system.
					</h1>

					<p className="mt-6 max-w-xl text-base leading-7 text-slate-600 md:text-lg md:leading-8">
						Accessible Base UI primitives, canonical libphonenumber output, and
						complete styling control—without inheriting somebody else&apos;s UI.
					</p>

					<div className="mt-8 flex flex-wrap items-center gap-3">
						<a
							href="#playground"
							className="ui-pressable inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition-colors duration-150 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
						>
							Try the playground
							<ArrowRight className="size-4" aria-hidden="true" />
						</a>
						<a
							href="/docs"
							className="ui-pressable inline-flex h-11 items-center rounded-xl border border-slate-300 bg-white/85 px-5 text-sm font-semibold text-slate-700 shadow-sm transition-colors duration-150 hover:border-slate-400 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
						>
							Read docs
						</a>
					</div>

					<div className="mt-9 grid max-w-xl grid-cols-3 gap-4 border-t border-slate-200 pt-6">
						{[
							{ icon: Braces, label: "Composable", detail: "3 primitives" },
							{ icon: ShieldCheck, label: "Canonical", detail: "E.164 output" },
							{ icon: Globe2, label: "Localized", detail: "Global metadata" },
						].map(({ icon: Icon, label, detail }) => (
							<div key={label} className="min-w-0">
								<Icon className="size-4 text-slate-500" aria-hidden="true" />
								<p className="mt-2 text-xs font-semibold text-slate-900 sm:text-sm">
									{label}
								</p>
								<p className="mt-0.5 truncate text-[11px] text-slate-500 sm:text-xs">
									{detail}
								</p>
							</div>
						))}
					</div>
				</div>

				<div className="relative min-w-0">
					<div className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-2xl shadow-slate-900/15 lg:rounded-3xl">
						<div className="flex h-11 items-center justify-between border-b border-white/10 px-4">
							<div className="flex gap-1.5" aria-hidden="true">
								<span className="size-2.5 rounded-full bg-slate-700" />
								<span className="size-2.5 rounded-full bg-slate-700" />
								<span className="size-2.5 rounded-full bg-slate-700" />
							</div>
							<span className="font-mono text-[11px] text-slate-400">
								app.tsx
							</span>
						</div>
						<div className="relative bg-slate-950">
							<CopyButton
								text={snippet}
								className="absolute right-3 top-3 z-10 border-white/10 bg-white/10 text-slate-200 shadow-none hover:bg-white/15 hover:text-white"
							/>
							<HighlightedCode
								code={snippet}
								className="max-h-none rounded-none border-0 pr-24 shadow-none"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
