import {
	ComponentApiReference,
	UtilitiesApiReference,
} from "@/components/api-reference";
import { DocBlock } from "@/components/doc-block";
import { InstallTabs } from "@/components/install-tabs";
import { MigrationComparison } from "@/components/migration-comparison";
import { useDocumentationScrollSpy } from "@/hooks/use-documentation-scroll-spy";
import { migrationComparisons } from "@/lib/migration";
import {
	controlledSnippet,
	countrySlotsCssSnippet,
	formatAndUtilsSnippet,
	formDataSnippet,
	i18nSnippet,
	quickStartSnippet,
	stylingCountrySelectSnippet,
	subsetSnippet,
	validitySnippet,
} from "@/lib/snippets";
import { cn } from "@/lib/utils";

const DOC_NAV = [
	{ id: "getting-started", label: "Getting started" },
	{ id: "styling", label: "Styling" },
	{ id: "forms", label: "Forms & submission" },
	{ id: "api", label: "Component API" },
	{ id: "utilities", label: "Utilities" },
	{ id: "migration", label: "Migrate to v1" },
] as const;

const DOC_SECTION_IDS = DOC_NAV.map((item) => item.id);

const STYLING_SLOTS = [
	["phone-field", "Root layout"],
	["phone-field-hidden-input", "FormData payload"],
	["phone-field-input", "Telephone input"],
	["phone-field-country-trigger", "Country trigger"],
	["phone-field-country-icon", "Trigger icon"],
	["phone-field-country-positioner", "Popup geometry wrapper"],
	["phone-field-country-popup", "Portaled popup"],
	["phone-field-country-search-container", "Search layout"],
	["phone-field-country-search-input", "Country search"],
	["phone-field-country-list", "Scrollable list"],
	["phone-field-country-item", "Country option"],
	["phone-field-country-empty", "Empty state"],
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
	const { currentHash, beginHashNavigation } =
		useDocumentationScrollSpy(DOC_SECTION_IDS);

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
									aria-current={
										currentHash === item.id ? "location" : undefined
									}
									onClick={(event) => {
										if (
											event.button === 0 &&
											!event.altKey &&
											!event.ctrlKey &&
											!event.metaKey &&
											!event.shiftKey
										) {
											beginHashNavigation(item.id);
										}
									}}
									className={cn(
										"ui-pressable block shrink-0 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap text-slate-600 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sky-600",
										currentHash === item.id && "font-semibold text-slate-950",
									)}
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
									Supported versions: <code>@base-ui/react &gt;=1.6 &lt;2</code>
									, <code>react &gt;=19 &lt;20</code>,{" "}
									<code>react-dom &gt;=19 &lt;20</code>, and Node.js 22 or
									newer.
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
							<div className="rounded-r-xl border-violet-400 border-l-2 bg-violet-50/70 px-4 py-3 text-sm leading-6 text-slate-700">
								<strong>Undo and redo work with formatted values.</strong> While
								the phone input has focus, use <code>Cmd/Ctrl+Z</code> to undo
								and <code>Cmd/Ctrl+Shift+Z</code> or <code>Ctrl+Y</code> to
								redo. PhoneField restores the number, selected country, and
								selection in native-style transactions: a typing run undoes as
								one step, while undoing consecutive deletions restores and
								selects the removed digits. Paste, cut, drop, and country
								changes are independent steps. The last 100 transactions are
								retained; replacing a controlled <code>value</code> starts a new
								history.
							</div>
							<div className="rounded-r-xl border-emerald-400 border-l-2 bg-emerald-50/70 px-4 py-3 text-sm leading-6 text-slate-700">
								Paste an international number beginning with <code>+</code> and
								PhoneField selects its detected country when available, then
								keeps only the nationally formatted number in the input. If the
								detected country is excluded by <code>countries</code>, the
								original text is preserved and emitted as invalid instead of
								being reinterpreted. The <code>+</code> prefix is accepted from
								paste but blocked during direct typing; a preserved prefix can
								still be removed with Backspace. A valid number becomes invalid
								when its detected country differs from the country selected by
								the user, including countries that share a calling code.
							</div>

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
							id="styling"
							title="Styling"
							description="Use the typed class preset for Tailwind and per-instance styles. Use stable data-slot selectors when your design system is CSS-first."
						>
							<div className="grid gap-4 md:grid-cols-2">
								<div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-5">
									<p className="mb-3 text-[11px] font-semibold tracking-[0.12em] text-sky-700 uppercase">
										Recommended
									</p>
									<p className="text-sm font-semibold text-slate-950">
										Using Tailwind or class utilities?
									</p>
									<p className="mt-2 text-sm leading-6 text-slate-600">
										Let <code>Root</code> own the shared border and focus ring.
										Use <code>cn</code> for the input and one hoisted{" "}
										<code>CountryClassNames</code> preset for the trigger and
										popup.
									</p>
								</div>
								<div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
									<p className="mb-3 text-[11px] font-semibold tracking-[0.12em] text-slate-500 uppercase">
										Alternative
									</p>
									<p className="text-sm font-semibold text-slate-950">
										Using CSS or CSS Modules?
									</p>
									<p className="mt-2 text-sm leading-6 text-slate-600">
										Target the stable <code>data-slot</code> anatomy. Popup
										selectors must be global because Base UI renders the popup
										in a portal.
									</p>
								</div>
							</div>

							<div className="rounded-r-xl border-sky-400 border-l-2 bg-sky-50/70 px-4 py-3 text-sm leading-6 text-slate-700">
								Present <code>Root</code> as one visual field, but keep Country
								and Input as separate accessible controls. Named Tailwind{" "}
								<code>group</code> variants are ideal for local state, such as
								rotating the trigger icon. The popup still needs{" "}
								<code>CountryClassNames</code> because it is rendered in a
								portal and is not a Root descendant.
							</div>

							<DocBlock
								title="Production preset"
								description="A reusable wrapper with one border and focus ring around two accessible controls. Root owns field-level state, while CountryClassNames styles the trigger and every portaled popup part."
								code={stylingCountrySelectSnippet}
							/>

							<DocBlock
								title="CSS data slots"
								description="The same grouped presentation works without Tailwind. Root owns the shell; stable data slots target the inline controls and portaled popup. classNames remains available for per-instance classes."
								code={countrySlotsCssSnippet}
								language="CSS"
							/>

							<article className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40 md:p-8">
								<h3 className="text-lg font-semibold tracking-tight text-slate-950">
									Stable anatomy
								</h3>
								<p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
									Base UI state attributes compose with these slots. For
									example, style an open trigger with{" "}
									<code>[data-popup-open]</code> and a focused country with{" "}
									<code>[data-highlighted]</code>.
								</p>
								<dl className="mt-5 grid gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-2">
									{STYLING_SLOTS.map(([slot, purpose]) => (
										<div key={slot} className="min-w-0 bg-slate-50 px-4 py-3">
											<dt className="truncate font-mono text-xs text-sky-800">
												{slot}
											</dt>
											<dd className="mt-1 text-xs text-slate-600">{purpose}</dd>
										</div>
									))}
								</dl>
							</article>
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
								description="Give the phone input a native label, name the country trigger independently, and expose invalid state with aria-invalid. Do not wrap both controls in one Base UI Field: Field represents a single form control."
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

						<DocSubsection
							id="migration"
							title="Migrate from 0.x to v1"
							description="The value model and submitted payload remain compatible. The migration removes overlapping entry points and gives each concern one owner."
						>
							<div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 sm:p-6">
								<div className="flex items-start gap-3">
									<span
										className="mt-1 size-2.5 shrink-0 rounded-full bg-emerald-500"
										aria-hidden="true"
									/>
									<div>
										<h3 className="font-semibold text-emerald-950">
											This is a mechanical migration
										</h3>
										<p className="mt-1 text-sm leading-6 text-emerald-900/80">
											Upgrade the package, apply the five replacements below,
											then run your typecheck. No phone data migration is
											required.
										</p>
										<code className="mt-3 inline-flex rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs text-emerald-950 shadow-sm">
											pnpm add phonefield@^1
										</code>
									</div>
								</div>
							</div>

							{migrationComparisons.map((comparison) => (
								<MigrationComparison key={comparison.title} {...comparison} />
							))}

							<div className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-slate-200 sm:p-6">
								<h3 className="font-semibold text-white">
									Migration checklist
								</h3>
								<ul className="mt-4 grid gap-3 text-sm leading-6 sm:grid-cols-2">
									{[
										"No PhoneFieldUtils facade imports remain",
										"onValueChange and name live on Root",
										"Country classes use classNames",
										"Public types use PhoneField.*",
										"React, Base UI, and Node match supported versions",
										"Typecheck and form submission tests pass",
									].map((item) => (
										<li key={item} className="flex gap-2">
											<span className="text-emerald-400" aria-hidden="true">
												✓
											</span>
											<span>{item}</span>
										</li>
									))}
								</ul>
							</div>
						</DocSubsection>
					</div>
				</div>
			</div>
		</section>
	);
}
