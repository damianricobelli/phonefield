import * as React from "react";
import { CopyButton } from "@/components/copy-button";
import { HighlightedCode } from "@/components/doc-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhoneInput } from "@/examples/production-preset";
import presetSource from "@/examples/production-preset.tsx?raw";
import { PillPhoneField } from "@/examples/variants/pill";
import pillSource from "@/examples/variants/pill.tsx?raw";
import { SplitPhoneField } from "@/examples/variants/split";
import splitSource from "@/examples/variants/split.tsx?raw";
import { UnderlinePhoneField } from "@/examples/variants/underline";
import underlineSource from "@/examples/variants/underline.tsx?raw";
import { UnstyledPhoneField } from "@/examples/variants/unstyled";
import unstyledSource from "@/examples/variants/unstyled.tsx?raw";
import { cn } from "@/lib/utils";

const VARIANTS = [
	{
		id: "unstyled",
		label: "Zero config",
		note: "Country without children renders a complete, accessible picker. It's unstyled; this preview only restores browser-like borders.",
		file: "unstyled.tsx",
		code: unstyledSource,
		preview: <UnstyledPhoneField />,
		surface: "bg-white",
	},
	{
		id: "shadcn",
		label: "shadcn",
		note: "Group is the shell: data-focused and data-invalid drive the ring, while Label and Error are wired for you. Copy it into your components folder.",
		file: "phone-input.tsx",
		code: presetSource,
		preview: <PhoneInput defaultCountry="US" className="max-w-sm" />,
		surface: "bg-white",
	},
	{
		id: "pill",
		label: "Pill",
		note: "A rounded, chip-style trigger. Same parts, different classes.",
		file: "pill.tsx",
		code: pillSource,
		preview: <PillPhoneField />,
		surface: "bg-zinc-50",
	},
	{
		id: "underline",
		label: "Underline",
		note: "Root's data-focused colors labels through a named group. No extra state.",
		file: "underline.tsx",
		code: underlineSource,
		preview: <UnderlinePhoneField />,
		surface: "bg-white",
	},
	{
		id: "split",
		label: "Split",
		note: "Two separate boxes and pinned preferred countries with a check indicator.",
		file: "split.tsx",
		code: splitSource,
		preview: <SplitPhoneField />,
		surface: "bg-stone-50",
	},
] as const;

type VariantId = (typeof VARIANTS)[number]["id"];

export function CompositionSection() {
	const [active, setActive] = React.useState<VariantId>("shadcn");
	const variant = VARIANTS.find((item) => item.id === active) ?? VARIANTS[1];

	return (
		<section
			id="composition"
			className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-20 sm:px-6 lg:pb-28"
		>
			<div className="max-w-2xl">
				<p className="text-xs font-semibold tracking-[0.18em] text-sky-700 uppercase">
					Composition
				</p>
				<h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
					From zero config to entirely yours.
				</h2>
				<p className="mt-3 text-base leading-7 text-slate-600">
					Every part is a Base UI part: it takes <code>className</code>,{" "}
					<code>render</code>, and its state as data attributes. One API, any
					design.
				</p>
			</div>

			<div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40">
				<Tabs
					value={active}
					onValueChange={(next) => setActive(next as VariantId)}
					className="gap-0"
				>
					<div className="overflow-x-auto border-b border-slate-200 p-2 [scrollbar-width:none]">
						<TabsList aria-label="Design variants">
							{VARIANTS.map((item) => (
								<TabsTrigger key={item.id} value={item.id} className="px-3">
									{item.label}
								</TabsTrigger>
							))}
						</TabsList>
					</div>

					<TabsContent
						value={variant.id}
						className="grid text-base lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
					>
						<div
							className={cn(
								"flex min-h-72 flex-col justify-between gap-8 p-6 md:p-8",
								variant.surface,
							)}
						>
							<div className="flex flex-1 items-center">
								<div
									key={variant.id}
									className={cn(
										"w-full max-w-sm",
										variant.id === "unstyled" && "zero-config",
									)}
								>
									{variant.preview}
								</div>
							</div>
							<p className="max-w-sm text-sm leading-6 text-slate-600">
								{variant.note}
							</p>
						</div>
						<div className="min-w-0 border-t border-slate-800 bg-slate-950 lg:border-t-0 lg:border-l">
							<div className="flex h-11 items-center justify-between border-b border-white/10 px-4">
								<span className="font-mono text-[11px] text-slate-400">
									{variant.file}
								</span>
								<CopyButton
									text={variant.code}
									className="border-white/10 bg-white/10 text-slate-300 shadow-none hover:bg-white/15 hover:text-white"
								/>
							</div>
							<HighlightedCode
								code={variant.code}
								className="max-h-[30rem] rounded-none"
							/>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</section>
	);
}
