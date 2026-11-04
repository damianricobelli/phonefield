import { CopyButton } from "@/components/copy-button";
import { HighlightedCode } from "@/components/doc-block";
import { InstallTabs } from "@/components/install-tabs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BaseUiPhone } from "@/examples/primitives/base-ui";
import { RadixPhone } from "@/examples/primitives/radix";
import { ReactAriaPhone } from "@/examples/primitives/react-aria";
import {
	baseUiPrimitivesSnippet,
	radixPrimitivesSnippet,
	reactAriaPrimitivesSnippet,
} from "@/lib/snippets";

const PRIMITIVES = [
	{
		value: "base-ui",
		label: "Base UI",
		packages: "phonefield @base-ui/react",
		entry: "phonefield",
		summary:
			"Country is a Base UI Combobox with its input inside the popup. Compose with render, and style state with Base UI data attributes such as data-popup-open and data-highlighted.",
		Demo: BaseUiPhone,
		code: baseUiPrimitivesSnippet,
	},
	{
		value: "react-aria",
		label: "React Aria",
		packages: "phonefield react-aria-components",
		entry: "phonefield/react-aria",
		summary:
			"Country is a React Aria Select with an Autocomplete, SearchField, and ListBox inside its Popover. Parts take React Aria props and render props; items expose data-focused and data-selected.",
		Demo: ReactAriaPhone,
		code: reactAriaPrimitivesSnippet,
	},
	{
		value: "radix",
		label: "Radix UI",
		packages: "phonefield radix-ui",
		entry: "phonefield/radix",
		summary:
			"Country is a Radix Popover with a searchable listbox, the pattern shadcn/ui uses for comboboxes. Compose with asChild; the popup is CountryContent, and items expose data-highlighted and data-state.",
		Demo: RadixPhone,
		code: radixPrimitivesSnippet,
	},
] as const;

/** Install command, live demo, and composed code for each primitives library. */
export function PrimitivesSection() {
	return (
		<article className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40">
			<div className="px-5 pt-5 pb-4 sm:px-7 sm:pt-7">
				<h3 className="text-lg font-semibold tracking-tight text-slate-950 md:text-xl">
					Choose your primitives
				</h3>
				<p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
					PhoneField ships one adapter per headless library. Value, formatting,
					validation, undo, FormData, data slots, and field state are shared and
					behave the same; only the Country picker parts follow each library's
					own composition model. Install only the library you use.
				</p>
			</div>
			<Tabs defaultValue="base-ui" className="min-w-0 gap-0">
				<div className="px-5 pb-4 sm:px-7">
					<TabsList variant="line">
						{PRIMITIVES.map((primitive) => (
							<TabsTrigger key={primitive.value} value={primitive.value}>
								{primitive.label}
							</TabsTrigger>
						))}
					</TabsList>
				</div>
				{PRIMITIVES.map(
					({ value, label, packages, entry, summary, Demo, code }) => (
						<TabsContent
							key={value}
							value={value}
							className="grid min-w-0 gap-0"
						>
							<div className="grid min-w-0 gap-4 px-5 pb-5 sm:px-7">
								<p className="max-w-3xl text-sm leading-6 text-slate-600">
									Import from <code>{entry}</code>. {summary}
								</p>
								<InstallTabs
									className="min-w-0 max-w-3xl"
									packageName={packages}
								/>
								<div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 sm:px-6">
									<section
										className="mx-auto max-w-sm"
										aria-label={`${label} demo`}
									>
										<Demo />
									</section>
								</div>
							</div>
							<div className="min-w-0 border-t border-slate-200 bg-slate-950">
								<div className="flex h-11 items-center justify-between border-b border-white/10 px-4">
									<span className="font-mono text-[11px] font-medium text-slate-500">
										TSX · {entry}
									</span>
									<CopyButton
										text={code}
										className="border-white/10 bg-white/10 text-slate-300 shadow-none hover:bg-white/15 hover:text-white"
									/>
								</div>
								<HighlightedCode
									code={code}
									className="rounded-none border-0"
								/>
							</div>
						</TabsContent>
					),
				)}
			</Tabs>
		</article>
	);
}
