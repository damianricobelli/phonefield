import { DocBlock } from "@/components/doc-block";
import { InstallTabs } from "@/components/install-tabs";
import {
	controlledSnippet,
	countryPropsSnippet,
	formatAndUtilsSnippet,
	formDataSnippet,
	partsSnippet,
	quickStartSnippet,
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
				<span className="h-px flex-1 bg-gradient-to-r from-slate-300 to-transparent" />
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
						<h3 className="text-lg font-semibold tracking-tight text-slate-900">
							Installation
						</h3>
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
				</DocSubsection>

				<DocSubsection title="Customization">
					<DocBlock
						title="Country Subset"
						description="Limit the available countries from Root using ISO codes."
						code={subsetSnippet}
					/>
					<DocBlock
						title="Styling With Country Slots"
						description="PhoneField.Country slots map to Base UI Combobox parts (trigger, popup, list, item, etc.). Each slot accepts that part's props, and styles are passed with className."
						code={partsSnippet}
					/>
					<DocBlock
						title="Country Component Props"
						description="PhoneField.Country supports props for UX copy and icon customization, in addition to slots for per-part props."
						code={countryPropsSnippet}
					/>
					<DocBlock
						title="Validity States"
						description="Pair PhoneField with Base UI Field to show invalid states and clear error messages using data-valid and data-invalid attributes."
						code={validitySnippet}
					/>
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
							<table className="w-full min-w-[32rem] border-collapse text-sm">
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
