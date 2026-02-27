import { SiGithub as Github } from "@icons-pack/react-simple-icons";
import { CopyButton } from "@/components/copy-button";
import { HighlightedCode } from "@/components/doc-block";

const snippet = `import { PhoneField } from "phonefield";

export function App() {
  return (
    <PhoneField.Root>
      <PhoneField.Country />
      <PhoneField.Input />
    </PhoneField.Root>
  );
}`;

export function HeroSection() {
	return (
		<section className="relative mx-auto max-w-6xl px-6 pb-16 pt-12 md:pb-20 md:pt-20 lg:pt-28">
			<div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 items-center">
				<div className="flex flex-col justify-center">
					<div className="flex items-center gap-3">
						<span className="rounded-full bg-slate-900/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
							PhoneField
						</span>
						<a
							href="https://github.com/damianricobelli/phonefield"
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center gap-1.5 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-200/50 hover:text-slate-800"
							aria-label="PhoneField on GitHub"
						>
							<Github className="size-4" aria-hidden="true" />
						</a>
					</div>

					<h1 className="mt-6 text-4xl font-black leading-[1.1] tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
						<span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
							Phone field
						</span>
						<br />
						<span className="bg-gradient-to-r from-blue-600 via-sky-500 to-blue-700 bg-clip-text text-transparent">
							for design systems
						</span>
					</h1>

					<p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
						Compose country picker + number input with Base UI. Parsing and
						validation stay aligned with libphonenumber via a minimal primitive
						API.
					</p>

					<div className="mt-8 flex flex-wrap items-center gap-3">
						<a
							href="#playground"
							className="inline-flex items-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition hover:bg-slate-800 active:scale-[0.98]"
						>
							Try it
						</a>
						<a
							href="#docs"
							className="inline-flex items-center rounded-xl border border-slate-300 bg-white/90 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-white"
						>
							Read docs
						</a>
					</div>
				</div>

				<div className="relative">
					<div className="sticky top-24 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/50 backdrop-blur-sm lg:rounded-3xl">
						<div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 to-white/80" />
						<div className="relative">
							<CopyButton
								text={snippet}
								className="absolute right-3 top-3 z-10"
							/>
							<HighlightedCode code={snippet} className="pr-24" />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
