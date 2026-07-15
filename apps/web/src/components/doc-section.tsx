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

							<DocBlock
								title="Styling country select"
								description="PhoneField.Country is unstyled by default. Map each part to your design-system tokens through classNames."
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
							<article className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40 md:p-8">
								<h3 className="text-lg font-semibold tracking-tight text-slate-900">
									PhoneField.Root props
								</h3>
								<p className="mt-1 max-w-3xl text-sm text-slate-600">
									Root state and serialization API. Also accepts every{" "}
									<code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">
										div
									</code>{" "}
									prop except <code>defaultValue</code>.
								</p>
								<div className="code-scrollbar mt-4 overflow-x-auto rounded-xl border border-slate-200">
									<table className="w-full min-w-lg border-collapse text-sm">
										<thead>
											<tr className="border-b border-slate-200 bg-slate-50/80">
												<th className="px-4 py-3 text-left font-semibold text-slate-700">
													Prop
												</th>
												<th className="px-4 py-3 text-left font-semibold text-slate-700">
													Type
												</th>
												<th className="px-4 py-3 text-left font-semibold text-slate-700">
													Default
												</th>
												<th className="px-4 py-3 text-left font-semibold text-slate-700">
													Description
												</th>
											</tr>
										</thead>
										<tbody className="text-slate-600">
											<tr className="border-b border-slate-100">
												<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
													value
												</td>
												<td className="px-4 py-2.5 font-mono text-xs">
													PhoneField.Value
												</td>
												<td className="px-4 py-2.5">-</td>
												<td className="px-4 py-2.5">
													Controlled value for the full phone object.
												</td>
											</tr>
											<tr className="border-b border-slate-100">
												<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
													defaultValue
												</td>
												<td className="px-4 py-2.5 font-mono text-xs">
													PhoneField.Value
												</td>
												<td className="px-4 py-2.5">-</td>
												<td className="px-4 py-2.5">
													Initial value for uncontrolled usage.
												</td>
											</tr>
											<tr className="border-b border-slate-100">
												<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
													onValueChange
												</td>
												<td className="px-4 py-2.5 font-mono text-xs">
													(value: PhoneField.Value) =&gt; void
												</td>
												<td className="px-4 py-2.5">-</td>
												<td className="px-4 py-2.5">
													Callback fired when country or number changes.
												</td>
											</tr>
											<tr className="border-b border-slate-100">
												<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
													defaultCountry
												</td>
												<td className="px-4 py-2.5 font-mono text-xs">
													PhoneField.CountryCode
												</td>
												<td className="px-4 py-2.5">
													"US" if available, otherwise first available
												</td>
												<td className="px-4 py-2.5">
													Initial country when no value is provided.
												</td>
											</tr>
											<tr className="border-b border-slate-100">
												<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
													countries
												</td>
												<td className="px-4 py-2.5 font-mono text-xs">
													readonly PhoneField.CountryCode[]
												</td>
												<td className="px-4 py-2.5">all supported</td>
												<td className="px-4 py-2.5">
													Restricts the country list to a subset.
												</td>
											</tr>
											<tr className="border-b border-slate-100">
												<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
													lang
												</td>
												<td className="px-4 py-2.5 font-mono text-xs">
													PhoneField.Lang
												</td>
												<td className="px-4 py-2.5">"en"</td>
												<td className="px-4 py-2.5">
													Locale used for country labels and sorting.
												</td>
											</tr>
											<tr className="border-b border-slate-100">
												<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
													name
												</td>
												<td className="px-4 py-2.5 font-mono text-xs">
													string
												</td>
												<td className="px-4 py-2.5">-</td>
												<td className="px-4 py-2.5">
													Serializes only countryIso2 and nationalNumber as JSON
													for FormData.
												</td>
											</tr>
											<tr className="border-b border-slate-100">
												<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
													formatOnType
												</td>
												<td className="px-4 py-2.5 font-mono text-xs">
													boolean
												</td>
												<td className="px-4 py-2.5">true</td>
												<td className="px-4 py-2.5">
													Formats as you type based on selected country.
												</td>
											</tr>
											<tr>
												<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
													...divProps
												</td>
												<td className="px-4 py-2.5 font-mono text-xs">
													React.ComponentPropsWithoutRef&lt;"div"&gt;
												</td>
												<td className="px-4 py-2.5">-</td>
												<td className="px-4 py-2.5">
													Includes <code>children</code>, <code>className</code>
													, events, and ARIA attributes.
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</article>

							<article className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40 md:p-8">
								<h3 className="text-lg font-semibold tracking-tight text-slate-900">
									PhoneField.Country props
								</h3>
								<p className="mt-1 max-w-3xl text-sm text-slate-600">
									Country picker copy, rendering, and popup customization props.
								</p>
								<div className="code-scrollbar mt-4 overflow-x-auto rounded-xl border border-slate-200">
									<table className="w-full min-w-lg border-collapse text-sm">
										<thead>
											<tr className="border-b border-slate-200 bg-slate-50/80">
												<th className="px-4 py-3 text-left font-semibold text-slate-700">
													Prop
												</th>
												<th className="px-4 py-3 text-left font-semibold text-slate-700">
													Type
												</th>
												<th className="px-4 py-3 text-left font-semibold text-slate-700">
													Default
												</th>
												<th className="px-4 py-3 text-left font-semibold text-slate-700">
													Description
												</th>
											</tr>
										</thead>
										<tbody className="text-slate-600">
											<tr className="border-b border-slate-100">
												<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
													placeholder
												</td>
												<td className="px-4 py-2.5 font-mono text-xs">
													React.ReactNode
												</td>
												<td className="px-4 py-2.5">"Select country"</td>
												<td className="px-4 py-2.5">
													Placeholder shown in the trigger when no country is
													selected.
												</td>
											</tr>
											<tr className="border-b border-slate-100">
												<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
													noResultsText
												</td>
												<td className="px-4 py-2.5 font-mono text-xs">
													React.ReactNode
												</td>
												<td className="px-4 py-2.5">"No countries found"</td>
												<td className="px-4 py-2.5">
													Message displayed when search has no matches.
												</td>
											</tr>
											<tr className="border-b border-slate-100">
												<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
													inputPlaceholder
												</td>
												<td className="px-4 py-2.5 font-mono text-xs">
													string
												</td>
												<td className="px-4 py-2.5">"Search country"</td>
												<td className="px-4 py-2.5">
													Placeholder for the popup search input.
												</td>
											</tr>
											<tr className="border-b border-slate-100">
												<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
													icon
												</td>
												<td className="px-4 py-2.5 font-mono text-xs">
													React.ReactNode
												</td>
												<td className="px-4 py-2.5">ChevronUpDown</td>
												<td className="px-4 py-2.5">
													Replaces the default trigger icon.
												</td>
											</tr>
											<tr className="border-b border-slate-100">
												<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
													classNames
												</td>
												<td className="px-4 py-2.5 font-mono text-xs">
													PhoneField.CountryClassNames
												</td>
												<td className="px-4 py-2.5">-</td>
												<td className="px-4 py-2.5">
													Part-level classes: trigger, icon, popup, positioner,
													searchInput, searchInputContainer, list, item, empty.
												</td>
											</tr>
											<tr className="border-b border-slate-100">
												<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
													slotProps
												</td>
												<td className="px-4 py-2.5 font-mono text-xs">
													PhoneField.CountrySlotProps
												</td>
												<td className="px-4 py-2.5">-</td>
												<td className="px-4 py-2.5">
													Forwards native and Base UI props to each rendered
													part; item may be a per-country callback.
												</td>
											</tr>
											<tr className="border-b border-slate-100">
												<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
													positioning
												</td>
												<td className="px-4 py-2.5 font-mono text-xs">
													PhoneField.CountryPositioning
												</td>
												<td className="px-4 py-2.5">
													side: "bottom", align: "start", sideOffset: 4
												</td>
												<td className="px-4 py-2.5">
													Popup placement and collision behavior options.
												</td>
											</tr>
											<tr className="border-b border-slate-100">
												<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
													renderCountryItem
												</td>
												<td className="px-4 py-2.5 font-mono text-xs">
													(country: PhoneField.Country) =&gt; React.ReactNode
												</td>
												<td className="px-4 py-2.5">-</td>
												<td className="px-4 py-2.5">
													Custom renderer for each dropdown country row.
												</td>
											</tr>
											<tr>
												<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
													renderCountryValue
												</td>
												<td className="px-4 py-2.5 font-mono text-xs">
													(country: PhoneField.Country) =&gt; React.ReactNode
												</td>
												<td className="px-4 py-2.5">-</td>
												<td className="px-4 py-2.5">
													Custom renderer for the selected country in the
													trigger.
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</article>

							<article className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40 md:p-8">
								<h3 className="text-lg font-semibold tracking-tight text-slate-900">
									PhoneField.Input props
								</h3>
								<p className="mt-1 max-w-3xl text-sm text-slate-600">
									Input forwards{" "}
									<code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">
										Omit&lt;BaseInput.Props, "value" | "defaultValue"&gt;
									</code>{" "}
									surface from{" "}
									<code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">
										@base-ui/react/input
									</code>
									.
								</p>
								<div className="code-scrollbar mt-4 overflow-x-auto rounded-xl border border-slate-200">
									<table className="w-full min-w-lg border-collapse text-sm">
										<thead>
											<tr className="border-b border-slate-200 bg-slate-50/80">
												<th className="px-4 py-3 text-left font-semibold text-slate-700">
													Prop
												</th>
												<th className="px-4 py-3 text-left font-semibold text-slate-700">
													Type
												</th>
												<th className="px-4 py-3 text-left font-semibold text-slate-700">
													Default
												</th>
												<th className="px-4 py-3 text-left font-semibold text-slate-700">
													Description
												</th>
											</tr>
										</thead>
										<tbody className="text-slate-600">
											<tr className="border-b border-slate-100">
												<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
													type
												</td>
												<td className="px-4 py-2.5 font-mono text-xs">
													React.HTMLInputTypeAttribute
												</td>
												<td className="px-4 py-2.5">"tel"</td>
												<td className="px-4 py-2.5">
													Telephone-friendly default; consumers may override it.
												</td>
											</tr>
											<tr className="border-b border-slate-100">
												<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
													onValueChange
												</td>
												<td className="px-4 py-2.5 font-mono text-xs">
													BaseInput.Props["onValueChange"]
												</td>
												<td className="px-4 py-2.5">-</td>
												<td className="px-4 py-2.5">
													Called with the updated national number.
												</td>
											</tr>
											<tr className="border-b border-slate-100">
												<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
													className
												</td>
												<td className="px-4 py-2.5 font-mono text-xs">
													BaseInput.Props["className"]
												</td>
												<td className="px-4 py-2.5">-</td>
												<td className="px-4 py-2.5">
													Styles the underlying input element.
												</td>
											</tr>
											<tr>
												<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
													...baseInputProps
												</td>
												<td className="px-4 py-2.5 font-mono text-xs">
													BaseInput.Props
												</td>
												<td className="px-4 py-2.5">-</td>
												<td className="px-4 py-2.5">
													Includes standard input props like <code>name</code>,{" "}
													<code>id</code>, <code>placeholder</code>,{" "}
													<code>disabled</code>, <code>required</code>, events,
													and ARIA attributes, except controlled value props.
													Defaults to inputMode="tel" and
													autoComplete="tel-national" without a forced pattern.
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</article>
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

							<article className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40 md:p-8">
								<h3 className="text-lg font-semibold tracking-tight text-slate-900">
									PhoneFieldUtils API
								</h3>
								<p className="mt-1 max-w-3xl text-sm text-slate-600">
									Reference for{" "}
									<code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">
										phonefield/utils
									</code>
									. Same helpers on client and server.
								</p>
								<div className="code-scrollbar mt-4 overflow-x-auto rounded-xl border border-slate-200">
									<table className="w-full min-w-lg border-collapse text-sm">
										<thead>
											<tr className="border-b border-slate-200 bg-slate-50/80">
												<th className="px-4 py-3 text-left font-semibold text-slate-700">
													Method / property
												</th>
												<th className="px-4 py-3 text-left font-semibold text-slate-700">
													Description
												</th>
											</tr>
										</thead>
										<tbody className="text-slate-600">
											<tr className="border-b border-slate-100">
												<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
													parse(value, options?)
												</td>
												<td className="px-4 py-2.5">
													Parse <code>Value</code> or a strict phone string →
													libphonenumber <code>PhoneNumber</code>{" "}
													(formatNational, formatInternational, getURI).{" "}
													<code>options.defaultCountry</code> handles national
													numbers;
													<code>options.extract</code> opts into extraction from
													text.
												</td>
											</tr>
											<tr className="border-b border-slate-100">
												<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
													isValid(value, options?)
												</td>
												<td className="px-4 py-2.5">
													Validate <code>Value</code> or raw string. Same
													options as parse.
												</td>
											</tr>
											<tr className="border-b border-slate-100">
												<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
													fromFormData(formData, name)
												</td>
												<td className="px-4 py-2.5">
													Validate countryIso2 and nationalNumber from FormData,
													then rebuild a canonical Value or return null.
												</td>
											</tr>
											<tr className="border-b border-slate-100">
												<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
													toFormValue(value)
												</td>
												<td className="px-4 py-2.5">
													Return the minimal serializable payload: countryIso2
													and nationalNumber.
												</td>
											</tr>
											<tr className="border-b border-slate-100">
												<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
													getCountries(locale?)
												</td>
												<td className="px-4 py-2.5">
													Runtime-immutable map ISO2 → country (name, dialCode,
													flag). Locale controls display names and sorting.
												</td>
											</tr>
											<tr className="border-b border-slate-100">
												<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
													countries
												</td>
												<td className="px-4 py-2.5">
													Default countries map (en). Getter, no locale
													argument.
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</article>
						</DocSubsection>
					</div>
				</div>
			</div>
		</section>
	);
}
