import * as React from "react";
import { BlockCard } from "@/components/block-card";
import type { Recipe } from "@/components/recipe-catalog";

export function RecipeBrowser({ recipe }: { recipe: Recipe }) {
	const Preview = recipe.component;

	return (
		<div id={`recipe-${recipe.id}`} className="scroll-mt-24 space-y-4">
			<BlockCard
				key={recipe.id}
				title={recipe.title}
				description={recipe.description}
				labels={recipe.labels}
				code={recipe.loadCode}
			>
				<React.Suspense
					fallback={
						<div role="status" className="text-sm text-slate-500">
							Loading preview…
						</div>
					}
				>
					<Preview />
				</React.Suspense>
			</BlockCard>

			<div className="grid overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-3">
				<div className="bg-white p-4">
					<p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
						Use when
					</p>
					<p className="mt-2 text-sm leading-6 text-slate-700">
						{recipe.useWhen}
					</p>
				</div>
				<div className="border-slate-200 bg-white p-4 sm:border-x">
					<p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
						Requires
					</p>
					<p className="mt-2 font-mono text-xs leading-6 text-slate-700">
						{recipe.requires.join(" · ")}
					</p>
				</div>
				<div className="bg-white p-4">
					<p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
						Accessibility
					</p>
					<p className="mt-2 text-sm leading-6 text-slate-700">
						{recipe.accessibility}
					</p>
				</div>
			</div>
		</div>
	);
}
