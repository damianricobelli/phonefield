import type React from "react";
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
import { migrationChecklist, migrationComparisons } from "@/lib/migration";
import {
	anatomySnippet,
	compositionSnippet,
	controlledSnippet,
	countrySlotsCssSnippet,
	customPickerSnippet,
	fieldStateSnippet,
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
			{ hash: "migration", label: "Migrate to v2" },
		],
	},
] as const satisfies readonly DocumentationNavGroup[];

const STYLING_SLOTS = [
	["phone-field", "Root wrapper, with state attributes"],
	["phone-field-label", "Label for the input"],
	["phone-field-group", "Visual shell, with state attributes"],
	["phone-field-input", "Telephone input"],
	["phone-field-description", "Help text"],
	["phone-field-error", "Error message, only while invalid"],
	["phone-field-hidden-input", "FormData payload"],
	["phone-field-country-trigger", "Country trigger"],
	["phone-field-country-icon", "Trigger icon"],
	["phone-field-country-positioner", "Popup geometry wrapper"],
	["phone-field-country-popup", "Portaled popup"],
	["phone-field-country-search", "Country search"],
	["phone-field-country-empty", "Empty state"],
	["phone-field-country-list", "Scrollable list"],
	["phone-field-country-group", "Group; data-preferred when pinned"],
	["phone-field-country-item", "Country option; data-country"],
	["phone-field-country-item-indicator", "Selected check mark"],
] as const;

function Callout({
	tone,
	children,
}: {
	tone: "sky" | "violet" | "emerald" | "amber" | "slate";
	children: React.ReactNode;
}) {
	const tones = {
		sky: "border-sky-400 bg-sky-50/70",
		violet: "border-violet-400 bg-violet-50/70",
		emerald: "border-emerald-400 bg-emerald-50/70",
		amber: "border-amber-400 bg-amber-50/70",
		slate: "border-slate-400 bg-slate-50",
	} as const;
	return (
		<div
			className={`rounded-r-xl border-l-2 px-4 py-3 text-sm leading-6 text-slate-700 ${tones[tone]}`}
		>
			{children}
		</div>
	);
}

export function DocSection() {
	return (
		<>
			<DocSubsection
				anchor="getting-started"
				title="Getting started"
				description="Install the package, render the three primitives, and compose more only where you need it."
			>
				<ol className="grid overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 sm:grid-cols-3">
					{[
						["01", "Install", "Add the package and Base UI."],
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
						Peer dependencies: <code>@base-ui/react &gt;=1.9 &lt;2</code>,{" "}
						<code>react &gt;=19 &lt;20</code>, and{" "}
						<code>react-dom &gt;=19 &lt;20</code>. Building the package requires
						Node.js 22.18 or newer.
					</p>
				</article>

				<DocBlock
					title="Quick start"
					description="Zero config. Country renders a complete, accessible picker with search; Input formats as you type. Root runs uncontrolled and emits a normalized PhoneField.Value."
					code={quickStartSnippet}
				/>

				<DocBlock
					title="Labels & errors"
					description="Root is a plain wrapper. Label targets the input, Group is the visual shell for Country and Input, and Description and Error are linked with aria-describedby. Error renders only while the field is invalid."
					code={anatomySnippet}
				/>

				<DocBlock
					title="Controlled mode"
					description="Use when your form or global state owns the value. The second onValueChange argument says why the value changed."
					code={controlledSnippet}
				/>
				<Callout tone="sky">
					Keep the root controlled or uncontrolled for its complete lifetime.{" "}
					<code>defaultValue</code> and <code>defaultCountry</code> are read
					once on mount. Controlled inputs may provide only{" "}
					<code>PhoneField.InputValue</code>; derived fields are rebuilt and{" "}
					<code>onValueChange</code> always emits the complete{" "}
					<code>PhoneField.Value</code>.
				</Callout>
				<Callout tone="violet">
					<strong>Undo and redo work with formatted values.</strong> While the
					phone input has focus, use <code>Cmd/Ctrl+Z</code> to undo and{" "}
					<code>Cmd/Ctrl+Shift+Z</code> or <code>Ctrl+Y</code> to redo. A typing
					run undoes as one step; paste, cut, drop, and country changes are
					independent steps. The last 100 steps are kept, and replacing a
					controlled <code>value</code> starts a new history.
				</Callout>
				<Callout tone="emerald">
					Paste an international number beginning with <code>+</code> and
					PhoneField selects its country, then keeps only the national number in
					the input. If <code>countries</code> excludes that country, the text
					is preserved and emitted as invalid. Digits beyond the longest
					possible number for the country are blocked; pass{" "}
					<code>limitMaxLength={"{false}"}</code> to allow them. A number is
					invalid when its detected country differs from the selected one,
					including countries that share a calling code.
				</Callout>

				<DocBlock
					title="Compose the parts"
					description="Pass children to Country to customize any piece. Every part maps to one Base UI Combobox part, takes className, style, and render, and has sensible default content you can replace."
					code={compositionSnippet}
				/>

				<DocBlock
					title="Custom parts with usePhoneField"
					description="Read the value, field state, and countries from any component inside Root, and drive it with setCountry and setNumber. Useful for native selects, drawers, and status text."
					code={customPickerSnippet}
				/>

				<DocBlock
					title="Country subset and preferred countries"
					description="countries restricts the list to an ordered subset. preferredCountries pins countries to the top of the full list."
					code={subsetSnippet}
				/>

				<DocBlock
					title="Internationalization"
					description="lang localizes country names, sorting, search, and the trigger's accessible name. labels translates the search placeholder and empty text, with or without composed parts."
					code={i18nSnippet}
				/>

				<Callout tone="sky">
					<strong>SSR-safe country defaults.</strong> Resolve the account or
					tenant country on the server and pass it through{" "}
					<code>defaultCountry</code>. Do not replace it after mount from a
					browser-only locale lookup: defaults are read once, and replacing them
					can overwrite a user's selection.
				</Callout>
				<Callout tone="amber">
					<strong>Hydration and country names.</strong> Names come from{" "}
					<code>Intl.DisplayNames</code>, which can differ between Node and
					browsers for a few regions. The default picker server-renders only the
					selected country's name. Rendering every name on the server (a native{" "}
					<code>select</code>, an always-open list) can cause hydration
					warnings; render those lists on the client.
				</Callout>
			</DocSubsection>

			<DocSubsection
				anchor="styling"
				title="Styling"
				description="Every part is unstyled. Style each one with className; Group is the field shell and carries field state as data attributes."
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
							Pass <code>className</code> to each part. Style the shell on{" "}
							<code>Group</code> with <code>data-focused:</code>,{" "}
							<code>data-invalid:</code>, and <code>data-disabled:</code>.
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
							Target the stable <code>data-slot</code> anatomy and the state
							attributes on Root and Group. Popup selectors must be global
							because the popup is rendered in a portal.
						</p>
					</div>
				</div>

				<Callout tone="sky">
					Present <code>Group</code> as one visual field, but keep Country and
					Input as separate accessible controls. Label, Group, Description, and
					Error all carry the field's state attributes. The popup is portaled
					out of Root: style its parts directly, or read{" "}
					<code>usePhoneField().state</code> in a wrapper when it must react to
					field state.
				</Callout>

				<DocBlock
					title="Field state"
					description="State attributes on Group (and Root, Label, Description, Error) replace manual focus, touched, and validity tracking. className and style also accept a function of PhoneField.State."
					code={fieldStateSnippet}
				/>

				<DocBlock
					title="Production preset"
					description="A reusable shadcn-style wrapper: Label, Description, and Error around a Group with one border and focus ring, and a styled popup composed from the parts."
					code={stylingCountrySelectSnippet}
				/>

				<DocBlock
					title="CSS data slots"
					description="The same presentation without Tailwind. Group state attributes drive the shell; data slots target the controls, the error, and the portaled popup."
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
						highlighted country with <code>[data-highlighted]</code>. Field
						state attributes are listed in the Component API. With{" "}
						<code>render</code>, PhoneField's <code>data-slot</code> replaces
						the rendered component's own.
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
				<Callout tone="amber">
					Use <strong>uncontrolled</strong> for simple forms. Switch to{" "}
					<strong>controlled</strong> when external state needs to orchestrate
					validation, steps, or async flows.
				</Callout>
				<Callout tone="slate">
					<strong>Validate again on the server.</strong> Treat submitted country
					and national-number fields as untrusted. Use <code>fromFormData</code>{" "}
					at the server boundary to rebuild E.164 and validity instead of
					accepting derived client values.
				</Callout>
				<DocBlock
					title="Uncontrolled + FormData (Client / Server)"
					description="Set name on Root to submit one entry with countryIso2 and nationalNumber. Submitting the form marks the field touched, so errors show without a prior blur; resetting it restores an uncontrolled field's initial value. Use form for a form outside Root. A disabled field is not submitted."
					code={formDataSnippet}
				/>
				<DocBlock
					title="Validity states"
					description="After blur or submit, the field is invalid when the number is incomplete or invalid, or required and empty. Input gets aria-invalid, Group gets data-invalid, and Error appears. invalid={!!serverError} adds an external error; automatic validation still applies when it is false."
					code={validitySnippet}
				/>
				<Callout tone="sky">
					<code>required</code> also sets the native attribute on Input, so the
					browser blocks an empty submit. The trigger is named after the
					selected country unless you give it <code>aria-label</code>,{" "}
					<code>aria-labelledby</code>, or an <code>id</code> for your own
					label. Do not wrap both controls in one Base UI <code>Field</code>:
					PhoneField provides its own Label, Description, and Error.
				</Callout>
			</DocSubsection>

			<DocSubsection
				anchor="api"
				title="Component API"
				description="Props, state attributes, and parts for Root, the field parts, Input, and Country, plus the usePhoneField hook."
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
					description="parse() returns libphonenumber's PhoneNumber. String parsing is strict: pass { defaultCountry } for national numbers or { extract: true } for arbitrary text. getExampleNumber() returns a placeholder-ready example."
					code={formatAndUtilsSnippet}
				/>

				<UtilitiesApiReference />
			</DocSubsection>

			<DocSubsection
				anchor="migration"
				title="Migrate from v1 to v2"
				description="The value model and submitted payload are unchanged. Country configuration props became composable parts, and field state, labels, errors, and form submit/reset handling are now built in."
			>
				<div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 sm:p-6">
					<div className="flex items-start gap-3">
						<span
							className="mt-1 size-2.5 shrink-0 rounded-full bg-emerald-500"
							aria-hidden="true"
						/>
						<div>
							<h3 className="font-semibold text-emerald-950">
								Upgrade, then follow the type errors
							</h3>
							<p className="mt-1 text-sm leading-6 text-emerald-900/80">
								Removed Country props fail the typecheck, so most steps are
								found for you. Two steps change behavior without a type error
								and are flagged below. <code>@base-ui/react</code> must be 1.9
								or newer; React 18 remains unsupported. No phone data migration
								is required.
							</p>
							<code className="mt-3 inline-flex rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs text-emerald-950 shadow-sm">
								pnpm add phonefield@^2 @base-ui/react@^1.9
							</code>
						</div>
					</div>
				</div>

				<Callout tone="slate">
					<strong>Upgrading from 0.x?</strong> Follow the{" "}
					<a
						href="https://github.com/damianricobelli/phonefield/blob/main/packages/phonefield/MIGRATION.md#0x-to-v1"
						className="font-medium text-sky-700 underline underline-offset-2 hover:text-sky-900"
					>
						0.x → v1 guide
					</a>{" "}
					first, then this one.
				</Callout>

				{migrationComparisons.map((comparison) => (
					<MigrationComparison key={comparison.title} {...comparison} />
				))}

				<div className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-slate-200 sm:p-6">
					<h3 className="font-semibold text-white">Migration checklist</h3>
					<ul className="mt-4 grid gap-3 text-sm leading-6 sm:grid-cols-2">
						{migrationChecklist.map((item) => (
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
