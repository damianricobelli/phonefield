import {
	ComponentApiReference,
	UtilitiesApiReference,
} from "@/components/api-reference";
import { DocBlock } from "@/components/doc-block";
import {
	DocumentationSection as DocSubsection,
	type DocumentationNavGroup,
} from "@/components/documentation-shell";
import { InstallTabs } from "@/components/install-tabs";
import { MigrationComparison } from "@/components/migration-comparison";
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

export const documentationNavigation = [
	{
		label: "Guides & reference",
		items: [
			{ hash: "getting-started", label: "Getting started" },
			{ hash: "styling", label: "Styling" },
			{ hash: "forms", label: "Forms & submission" },
			{ hash: "api", label: "Component API" },
			{ hash: "utilities", label: "Utilities" },
			{ hash: "migration", label: "Migrate to v1" },
		],
	},
] as const satisfies readonly DocumentationNavGroup[];

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

export function DocSection() {
	return (
		<>
			<DocSubsection
				anchor="getting-started"
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
							<span className="font-mono text-xs text-sky-700">{number}</span>
							<p className="mt-2 text-sm font-semibold text-slate-950">
								{label}
							</p>
							<p className="mt-1 text-xs leading-5 text-slate-600">{detail}</p>
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
					<InstallTabs className="min-w-0 max-w-3xl" packageName="phonefield" />
					<p className="mt-4 max-w-3xl text-sm text-slate-600">
						Supported versions: <code>@base-ui/react &gt;=1.6 &lt;2</code>,{" "}
						<code>react &gt;=19 &lt;20</code>,{" "}
						<code>react-dom &gt;=19 &lt;20</code>, and Node.js 22 or newer.
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
					Keep the root controlled or uncontrolled for its complete lifetime.{" "}
					<code>defaultValue</code> and <code>defaultCountry</code> are initial
					values and do not reset the field after mount. Controlled inputs may
					provide only <code>PhoneField.InputValue</code>; derived fields are
					rebuilt and <code>onValueChange</code> always emits the complete{" "}
					<code>PhoneField.Value</code>.
				</div>
				<div className="rounded-r-xl border-violet-400 border-l-2 bg-violet-50/70 px-4 py-3 text-sm leading-6 text-slate-700">
					<strong>Undo and redo work with formatted values.</strong> While the
					phone input has focus, use <code>Cmd/Ctrl+Z</code> to undo and{" "}
					<code>Cmd/Ctrl+Shift+Z</code> or <code>Ctrl+Y</code> to redo.
					PhoneField restores the number, selected country, and selection in
					native-style transactions: a typing run undoes as one step, while
					undoing consecutive deletions restores and selects the removed digits.
					Paste, cut, drop, and country changes are independent steps. The last
					100 transactions are retained; replacing a controlled{" "}
					<code>value</code> starts a new history.
				</div>
				<div className="rounded-r-xl border-emerald-400 border-l-2 bg-emerald-50/70 px-4 py-3 text-sm leading-6 text-slate-700">
					Paste an international number beginning with <code>+</code> and
					PhoneField selects its detected country when available, then keeps
					only the nationally formatted number in the input. If the detected
					country is excluded by <code>countries</code>, the original text is
					preserved and emitted as invalid instead of being reinterpreted. The{" "}
					<code>+</code> prefix is accepted from paste but blocked during direct
					typing; a preserved prefix can still be removed with Backspace. A
					valid number becomes invalid when its detected country differs from
					the country selected by the user, including countries that share a
					calling code.
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

				<div className="rounded-r-xl border-sky-400 border-l-2 bg-sky-50/70 px-4 py-3 text-sm leading-6 text-slate-700">
					<strong>SSR-safe country defaults.</strong> Resolve the account or
					tenant country on the server and pass it through{" "}
					<code>defaultCountry</code>. Do not replace it after mount from a
					browser-only locale lookup: defaults are intentionally read once, and
					replacing them can overwrite a user's selection.
				</div>
			</DocSubsection>

			<DocSubsection
				anchor="styling"
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
							Let <code>Root</code> own the shared border and focus ring. Use{" "}
							<code>cn</code> for the input and one hoisted{" "}
							<code>CountryClassNames</code> preset for the trigger and popup.
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
							Target the stable <code>data-slot</code> anatomy. Popup selectors
							must be global because Base UI renders the popup in a portal.
						</p>
					</div>
				</div>

				<div className="rounded-r-xl border-sky-400 border-l-2 bg-sky-50/70 px-4 py-3 text-sm leading-6 text-slate-700">
					Present <code>Root</code> as one visual field, but keep Country and
					Input as separate accessible controls. Named Tailwind{" "}
					<code>group</code> variants are ideal for local state, such as
					rotating the trigger icon. The popup still needs{" "}
					<code>CountryClassNames</code> because it is rendered in a portal and
					is not a Root descendant.
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
						Base UI state attributes compose with these slots. For example,
						style an open trigger with <code>[data-popup-open]</code> and a
						focused country with <code>[data-highlighted]</code>.
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
				anchor="forms"
				title="Forms & submission"
				description="Choose the state model that matches your form and rebuild trusted values at the boundary."
			>
				<div className="rounded-r-xl border-amber-400 border-l-2 bg-amber-50/70 px-4 py-3 text-sm leading-6 text-slate-700">
					Use <strong>uncontrolled</strong> for simple forms. Switch to{" "}
					<strong>controlled</strong> when external state needs to orchestrate
					validation, steps, or async flows.
				</div>
				<div className="rounded-r-xl border-slate-400 border-l-2 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
					<strong>Validate again on the server.</strong> Treat submitted country
					and national-number fields as untrusted. Use <code>fromFormData</code>{" "}
					at the server boundary to rebuild E.164 and validity instead of
					accepting derived client values.
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
				anchor="api"
				title="Component API"
				description="Props for the root state container, country picker, and phone input."
			>
				<ComponentApiReference />
			</DocSubsection>

			<DocSubsection
				anchor="utilities"
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
				anchor="migration"
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
								Upgrade the package, apply the five replacements below, then run
								your typecheck. No phone data migration is required.
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
					<h3 className="font-semibold text-white">Migration checklist</h3>
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
		</>
	);
}
