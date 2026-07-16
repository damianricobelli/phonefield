import { Code2Icon, EyeIcon } from "lucide-react";
import * as React from "react";
import { CopyButton } from "@/components/copy-button";
import { HighlightedCode } from "@/components/doc-block";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type BlockCardProps = {
	title: string;
	description: string;
	code: string | (() => Promise<string>);
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
	const [source, setSource] = React.useState<string | null>(
		typeof code === "string" ? code : null,
	);
	const [sourceError, setSourceError] = React.useState(false);
	const [isLoadingSource, setIsLoadingSource] = React.useState(false);
	const previewId = React.useId();
	const codeId = React.useId();
	const displayedSource = sourceError
		? "// Source could not be loaded."
		: (source ?? "// Loading source…");

	const handleViewChange = (nextView: string | number | null) => {
		if (nextView !== "preview" && nextView !== "code") return;
		setView(nextView);
		if (
			nextView !== "code" ||
			typeof code === "string" ||
			source ||
			isLoadingSource
		) {
			return;
		}

		setIsLoadingSource(true);
		code()
			.then(setSource)
			.catch(() => setSourceError(true))
			.finally(() => setIsLoadingSource(false));
	};

	return (
		<article className="h-full min-w-0 lg:h-[402px]">
			<Card className="h-full gap-0 rounded-2xl border border-slate-200 py-0 shadow-sm shadow-slate-200/50 ring-0">
				<Tabs
					value={view}
					onValueChange={handleViewChange}
					className="h-full min-h-0 gap-0"
				>
					<header className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6 lg:min-h-24 lg:shrink-0">
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

						<TabsList aria-label={`${title} view`} className="h-9 shrink-0 p-1">
							<TabsTrigger value="preview" className="h-7 px-2.5 text-xs">
								<EyeIcon className="size-3.5" aria-hidden="true" />
								Preview
							</TabsTrigger>
							<TabsTrigger value="code" className="h-7 px-2.5 text-xs">
								<Code2Icon className="size-3.5" aria-hidden="true" />
								Code
							</TabsTrigger>
						</TabsList>
					</header>

					<TabsContent
						value="preview"
						id={previewId}
						className="flex min-h-56 flex-1 items-center justify-center bg-slate-50 p-4 sm:p-5"
						style={{
							backgroundImage:
								"linear-gradient(to right, rgb(148 163 184 / 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgb(148 163 184 / 0.1) 1px, transparent 1px)",
							backgroundSize: "24px 24px",
						}}
					>
						{children}
					</TabsContent>
					<TabsContent
						value="code"
						id={codeId}
						className="min-h-56 flex-1 flex-col bg-slate-950 data-active:flex"
					>
						<div className="flex h-11 items-center justify-between border-b border-white/10 px-4">
							<span className="font-mono text-[11px] text-slate-500">
								component.tsx
							</span>
							<CopyButton
								text={displayedSource}
								disabled={!source || sourceError}
								className="border-white/10 bg-white/10 text-slate-300 shadow-none hover:bg-white/15 hover:text-white"
							/>
						</div>
						<HighlightedCode
							code={displayedSource}
							className="max-h-44 rounded-none"
						/>
					</TabsContent>
				</Tabs>
			</Card>
		</article>
	);
}
