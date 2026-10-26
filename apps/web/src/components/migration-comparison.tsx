import { HighlightedCode } from "@/components/doc-block";
import type { MigrationStep } from "@/lib/migration";

export function MigrationComparison({
	title,
	description,
	before,
	after,
	behaviorChange = false,
}: MigrationStep) {
	return (
		<article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40">
			<div className="px-5 pt-5 pb-4 sm:px-7 sm:pt-7">
				{behaviorChange ? (
					<p className="mb-2 inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-amber-800 uppercase">
						Behavior change
					</p>
				) : null}
				<h3 className="text-lg font-semibold tracking-tight text-slate-950 md:text-xl">
					{title}
				</h3>
				<p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
					{description}
				</p>
			</div>

			<div className="grid border-t border-slate-200 lg:grid-cols-2">
				<div className="min-w-0 bg-red-950 lg:border-r lg:border-slate-700">
					<div className="flex h-11 items-center gap-2 border-b border-red-400/15 bg-red-500/10 px-4">
						<span
							className="size-2 rounded-full bg-red-400"
							aria-hidden="true"
						/>
						<span className="font-mono text-[11px] font-semibold tracking-wide text-red-200 uppercase">
							v1 · before
						</span>
					</div>
					<HighlightedCode
						code={before}
						className="max-h-none rounded-none border-0 bg-red-950/95"
					/>
				</div>

				<div className="min-w-0 bg-emerald-950">
					<div className="flex h-11 items-center gap-2 border-b border-emerald-400/15 bg-emerald-500/10 px-4">
						<span
							className="size-2 rounded-full bg-emerald-400"
							aria-hidden="true"
						/>
						<span className="font-mono text-[11px] font-semibold tracking-wide text-emerald-200 uppercase">
							v2 · after
						</span>
					</div>
					<HighlightedCode
						code={after}
						className="max-h-none rounded-none border-0 bg-emerald-950/95"
					/>
				</div>
			</div>
		</article>
	);
}
