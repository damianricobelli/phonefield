import {
	ComponentApiReference,
	UtilitiesApiReference,
} from "@/components/api-reference";
import { DocBlock } from "@/components/doc-block";
import { InstallTabs } from "@/components/install-tabs";
import {
	controlledSnippet,
	formatAndUtilsSnippet,
	formDataSnippet,
	i18nSnippet,
	quickStartSnippet,
	stylingCountrySelectSnippet,
	subsetSnippet,
	validitySnippet,
} from "@/lib/snippets";

const DOC_NAV = [
	{ id: "getting-started", label: "Getting started" },
	{ id: "forms", label: "Forms & submission" },
	{ id: "api", label: "Component API" },
	{ id: "utilities", label: "Utilities" },
] as const;

function DocSubsection({
	id,
	title,
	description,
	children,
}: {
	id: string;
	title: string;
	description: string;
	children: React.ReactNode;
}) {
	return (
		<section id={id} className="min-w-0 scroll-mt-24 space-y-8">
			<header className="border-b border-slate-200 pb-5">
				<h2 className="text-xl font-semibold tracking-tight text-slate-950 md:text-2xl">
					{title}
				</h2>
				<p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
					{description}
				</p>
			</header>
			<div className="space-y-8">{children}</div>
		</section>
	);
}

export function DocSection() {
	return (
		<section className="relative border-t border-slate-200 bg-white">
			<div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 md:py-20">
				<header className="max-w-3xl">
					<p className="text-xs font-semibold tracking-[0.14em] text-sky-700 uppercase">
						Reference
					</p>
					<h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
						Documentation
					</h2>
					<p className="mt-3 text-base leading-7 text-slate-600">
						Installation, usage patterns, and API reference. Everything you need
						to integrate PhoneField into your design system.
					</p>
				</header>

				<div className="mt-12 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[13rem_minmax(0,1fr)] lg:items-start">
					<aside className="min-w-0 lg:sticky lg:top-24 lg:h-fit lg:self-start">
						<p className="mb-3 hidden text-xs font-semibold tracking-wide text-slate-500 uppercase lg:block">
							On this page
						</p>
						<nav
							aria-label="Documentation sections"
							className="code-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1 pb-2 lg:mx-0 lg:block lg:space-y-1 lg:overflow-visible lg:px-0 lg:pb-0"
						>
							{DOC_NAV.map((item) => (
								<a
									key={item.id}
									href={`#${item.id}`}
									className="ui-pressable block shrink-0 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap text-slate-600 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sky-600"
								>
									{item.label}
								</a>
							))}
						</nav>
					</aside>

					<div className="min-w-0 space-y-16 md:space-y-20">
						<DocSubsection
							id="getting-started"
							title="Getting started"
							description="Install the package, compose the primitives, and tailor them to your product."
						>
							<ol className="grid overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 sm:grid-cols-3">
								{[
									["01", "Install", "Add the package and peer dependencies."],
									["02", "Compose", "Render Root, Country, and Input."],
									["03", "Integrate", "Read Value or submit through FormData."],
								].map(([number, label, detail]) => (
									<li
										key={number}
										className="border-b border-slate-200 p-4 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0"
									>
										<span className="font-mono text-xs text-sky-700">
											{number}
										</span>
										<p className="mt-2 text-sm font-semibold text-slate-950">
											{label}
										</p>
										<p className="mt-1 text-xs leading-5 text-slate-600">
											{detail}
										</p>
									</li>
								))}
							</ol>

							<article className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40 md:p-8">
								<h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
									Installation
								</h2>
								<p className="mt-1 mb-5 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
									Install with your preferred manager. Copy the command with one
									click.
								</p>
								<InstallTabs
									className="min-w-0 max-w-3xl"
									packageName="phonefield"
								/>
								<p className="mt-4 max-w-3xl text-sm text-slate-600">
									Peer dependencies: <code>@base-ui/react &gt;=1.2 &lt;2</code>,{" "}
									<code>react &gt;=18 &lt;20</code>, and{" "}
									<code>react-dom &gt;=18 &lt;20</code>.
								</p>
							</article>

							<DocBlock
								title="Quick start"
								description="Minimal setup. Root can run uncontrolled by default and gives a normalized PhoneField.Value output."
								code={quickStartSnippet}
							/>

							<DocBlock
								title="Controlled mode"
								description="Use when your form or global state owns the value and you need full control over updates."
								code={controlledSnippet}
							/>
							<div className="rounded-r-xl border-sky-400 border-l-2 bg-sky-50/70 px-4 py-3 text-sm leading-6 text-slate-700">
								Keep the root controlled or uncontrolled for its complete
								lifetime. <code>defaultValue</code> and{" "}
								<code>defaultCountry</code> are initial values and do not reset
								the field after mount. Controlled inputs may provide only{" "}
								<code>PhoneField.InputValue</code>; derived fields are rebuilt
								and <code>onValueChange</code> always emits the complete{" "}
								<code>PhoneField.Value</code>.
							</div>

							<DocBlock
								title="Production preset"
								description="A complete, typechecked preset for the first production integration. Replace the classes with your design-system tokens."
								code={stylingCountrySelectSnippet}
							/>

							<DocBlock
								title="Country subset"
								description="Limit the available countries from Root using ISO codes."
								code={subsetSnippet}
							/>

							<DocBlock
								title="Internationalization"
								description="Localize country names and sorting with the lang prop."
								code={i18nSnippet}
							/>
						</DocSubsection>

						<DocSubsection
							id="forms"
							title="Forms & submission"
							description="Choose the state model that matches your form and rebuild trusted values at the boundary."
						>
							<div className="rounded-r-xl border-amber-400 border-l-2 bg-amber-50/70 px-4 py-3 text-sm leading-6 text-slate-700">
								Use <strong>uncontrolled</strong> for simple forms. Switch to{" "}
								<strong>controlled</strong> when external state needs to
								orchestrate validation, steps, or async flows.
							</div>
							<DocBlock
								title="Uncontrolled + FormData (Client / Server)"
								description="Set Root name to submit only countryIso2 and nationalNumber. fromFormData validates those untrusted source fields and rebuilds the derived value on client or server."
								code={formDataSnippet}
							/>
							<DocBlock
								title="Validity states"
								description="Pair PhoneField with Base UI Field to show invalid states and clear error messages using data-valid and data-invalid attributes."
								code={validitySnippet}
							/>
						</DocSubsection>

						<DocSubsection
							id="api"
							title="Component API"
							description="Props for the root state container, country picker, and phone input."
						>
							<ComponentApiReference />
						</DocSubsection>

						<DocSubsection
							id="utilities"
							title="Utilities"
							description="Parse, validate, format, and serialize the same way on the client and server."
						>
							<DocBlock
								title="Formatting and utilities"
								description="Validate and format on frontend or backend. parse() returns libphonenumber's PhoneNumber. String parsing is strict by default; pass { defaultCountry } for national numbers or opt into { extract: true } for arbitrary text."
								code={formatAndUtilsSnippet}
							/>

							<UtilitiesApiReference />
						</DocSubsection>
					</div>
				</div>
			</div>
		</section>
	);
}
