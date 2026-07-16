import { Code2Icon, EyeIcon } from "lucide-react";
import * as React from "react";
import { CopyButton } from "@/components/copy-button";
import { HighlightedCode } from "@/components/doc-block";
import { cn } from "@/lib/utils";

type BlockCardProps = {
	title: string;
	description: string;
	code: string;
	children: React.ReactNode;
	labels: readonly string[];
};

export function BlockCard({
	title,
	description,
	code,
	children,
	labels,
}: BlockCardProps) {
	const [view, setView] = React.useState<"preview" | "code">("preview");
	const previewId = React.useId();
	const codeId = React.useId();

	return (
		<article className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50">
			<header className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6">
				<div className="min-w-0">
					<div className="flex flex-wrap items-center gap-2">
						<h3 className="text-base font-semibold tracking-tight text-slate-950">
							{title}
						</h3>
						{labels.map((label) => (
							<span
								key={label}
								className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-medium text-slate-600"
							>
								{label}
							</span>
						))}
					</div>
					<p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-600">
						{description}
					</p>
				</div>

				<div
					role="tablist"
					aria-label={`${title} view`}
					className="flex w-fit shrink-0 rounded-lg bg-slate-100 p-1"
				>
					<button
						type="button"
						role="tab"
						aria-selected={view === "preview"}
						aria-controls={previewId}
						onClick={() => setView("preview")}
						className={cn(
							"ui-pressable inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-slate-500 outline-none transition focus-visible:ring-2 focus-visible:ring-sky-500",
							view === "preview" &&
								"bg-white text-slate-950 shadow-sm ring-1 ring-slate-200",
						)}
					>
						<EyeIcon className="size-3.5" aria-hidden="true" />
						Preview
					</button>
					<button
						type="button"
						role="tab"
						aria-selected={view === "code"}
						aria-controls={codeId}
						onClick={() => setView("code")}
						className={cn(
							"ui-pressable inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-slate-500 outline-none transition focus-visible:ring-2 focus-visible:ring-sky-500",
							view === "code" &&
								"bg-white text-slate-950 shadow-sm ring-1 ring-slate-200",
						)}
					>
						<Code2Icon className="size-3.5" aria-hidden="true" />
						Code
					</button>
				</div>
			</header>

			{view === "preview" ? (
				<div
					id={previewId}
					role="tabpanel"
					className="flex min-h-80 items-center justify-center bg-slate-50 p-5 sm:p-8"
					style={{
						backgroundImage:
							"linear-gradient(to right, rgb(148 163 184 / 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgb(148 163 184 / 0.1) 1px, transparent 1px)",
						backgroundSize: "24px 24px",
					}}
				>
					{children}
				</div>
			) : (
				<div id={codeId} role="tabpanel" className="bg-slate-950">
					<div className="flex h-11 items-center justify-between border-b border-white/10 px-4">
						<span className="font-mono text-[11px] text-slate-500">
							component.tsx
						</span>
						<CopyButton
							text={code}
							className="border-white/10 bg-white/10 text-slate-300 shadow-none hover:bg-white/15 hover:text-white"
						/>
					</div>
					<HighlightedCode code={code} className="max-h-80 rounded-none" />
				</div>
			)}
		</article>
	);
}
