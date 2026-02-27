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

function DocSubsection({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div className="space-y-8">
			<div className="flex items-center gap-4">
				<h2 className="text-lg font-bold tracking-tight text-slate-800 md:text-xl">
					{title}
				</h2>
				<span className="h-px flex-1 bg-linear-to-r from-slate-300 to-transparent" />
			</div>
			<div className="space-y-8">{children}</div>
		</div>
	);
}

export function DocSection() {
	return (
		<section className="relative border-t border-slate-200/80 bg-slate-50/40">
			<div className="mx-auto max-w-6xl space-y-16 px-6 py-16 md:py-20">
				<header className="max-w-3xl">
					<h2 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
						Documentation
					</h2>
					<p className="mt-3 text-sm text-slate-600 md:text-base">
						Installation, usage patterns, and API reference. Everything you need
						to integrate PhoneField into your design system.
					</p>
				</header>

				<DocSubsection title="Getting started">
					<article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
						<h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
							Installation
						</h2>
						<p className="mt-1 mb-4 max-w-3xl text-sm text-slate-600 md:text-base">
							Install with your preferred manager. Copy the command with one
							click.
						</p>
						<InstallTabs className="max-w-3xl" packageName="phonefield" />
					</article>

					<DocBlock
						title="Quick Start"
						description="Minimal setup. Root can run uncontrolled by default and gives a normalized PhoneField.Value output."
						code={quickStartSnippet}
					/>

					<DocBlock
						title="Controlled Mode"
						description="Use when your form or global state owns the value and you need full control over updates."
						code={controlledSnippet}
					/>

					<DocBlock
						title="Styling country select"
						description="PhoneField.Country has no styles by default. So you can style it as you want following your design system rules."
						code={stylingCountrySelectSnippet}
					/>

					<DocBlock
						title="Country Subset"
						description="Limit the available countries from Root using ISO codes."
						code={subsetSnippet}
					/>

					<DocBlock
						title="Internationalization"
						description="Localize country names/sorting with lang"
						code={i18nSnippet}
					/>
				</DocSubsection>

				<DocSubsection title="Forms & submission">
					<div className="rounded-2xl border border-amber-200/80 bg-amber-50/60 p-4 text-sm text-slate-700 md:p-5">
						Use <strong>uncontrolled</strong> for simple forms. Switch to{" "}
						<strong>controlled</strong> when external state needs to orchestrate
						validation, steps, or async flows.
					</div>
					<DocBlock
						title="Uncontrolled + FormData (Client / Server)"
						description="Set Root name to serialize the full PhoneField.Value as JSON in a hidden input. Read it from FormData on client or server."
						code={formDataSnippet}
					/>
					<DocBlock
						title="Validity States"
						description="Pair PhoneField with Base UI Field to show invalid states and clear error messages using data-valid and data-invalid attributes."
						code={validitySnippet}
					/>
				</DocSubsection>

				<DocSubsection title="API">
					<article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
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
						<div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
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
											PhoneField.CountryCodeValue
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
											readonly PhoneField.CountryCodeValue[]
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
										<td className="px-4 py-2.5 font-mono text-xs">string</td>
										<td className="px-4 py-2.5">-</td>
										<td className="px-4 py-2.5">
											Serializes the value as JSON in a hidden input for
											FormData.
										</td>
									</tr>
									<tr className="border-b border-slate-100">
										<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
											formatOnType
										</td>
										<td className="px-4 py-2.5 font-mono text-xs">boolean</td>
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
											Includes <code>children</code>, <code>className</code>,
											events, and ARIA attributes.
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</article>

					<article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
						<h3 className="text-lg font-semibold tracking-tight text-slate-900">
							PhoneField.Country props
						</h3>
						<p className="mt-1 max-w-3xl text-sm text-slate-600">
							Country picker copy, rendering, and popup customization props.
						</p>
						<div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
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
										<td className="px-4 py-2.5 font-mono text-xs">string</td>
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
											Custom renderer for the selected country in the trigger.
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</article>

					<article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
						<h3 className="text-lg font-semibold tracking-tight text-slate-900">
							PhoneField.Input props
						</h3>
						<p className="mt-1 max-w-3xl text-sm text-slate-600">
							Input forwards the full{" "}
							<code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">
								BaseInput.Props
							</code>{" "}
							surface from{" "}
							<code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">
								@base-ui/react/input
							</code>
							.
						</p>
						<div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
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
										<td className="px-4 py-2.5">"text"</td>
										<td className="px-4 py-2.5">
											Input type passed to Base UI Input.
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
											<code>disabled</code>, <code>required</code>, events, and
											ARIA attributes.
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</article>
				</DocSubsection>

				<DocSubsection title="Reference">
					<DocBlock
						title="Formatting + Utils"
						description="Validate and format on frontend or backend. parse() returns libphonenumber's PhoneNumber (formatNational, formatInternational, getURI). isValid and parse accept Value or E.164 string; optional { defaultCountry } for national-number strings."
						code={formatAndUtilsSnippet}
					/>

					<article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
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
						<div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
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
											Parse <code>Value</code> or E.164 → libphonenumber{" "}
											<code>PhoneNumber</code> (formatNational,
											formatInternational, getURI).{" "}
											<code>options.defaultCountry</code> for national numbers.
										</td>
									</tr>
									<tr className="border-b border-slate-100">
										<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
											isValid(value, options?)
										</td>
										<td className="px-4 py-2.5">
											Validate <code>Value</code> or raw string. Same options as
											parse.
										</td>
									</tr>
									<tr className="border-b border-slate-100">
										<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
											fromFormData(formData, name)
										</td>
										<td className="px-4 py-2.5">
											Read serialized <code>PhoneField.Value</code> from
											FormData → Value | null.
										</td>
									</tr>
									<tr className="border-b border-slate-100">
										<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
											getCountries(locale?)
										</td>
										<td className="px-4 py-2.5">
											Map ISO2 → country (name, dialCode, flag). Locale for
											display names.
										</td>
									</tr>
									<tr className="border-b border-slate-100">
										<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
											countries
										</td>
										<td className="px-4 py-2.5">
											Default countries map (en). Getter, no locale argument.
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</article>
				</DocSubsection>
			</div>
		</section>
	);
}
