import * as React from "react";
import { BlockCard } from "@/components/block-card";
import { getRecipeVariant, type Recipe } from "@/components/recipe-catalog";
import { getPrimitive, type Primitive } from "@/lib/primitives";

export function RecipeBrowser({
	recipe,
	primitive,
}: {
	recipe: Recipe;
	primitive: Primitive;
}) {
	const { component: Preview, loadCode } = getRecipeVariant(recipe, primitive);
	const requires = [getPrimitive(primitive).packageName, ...recipe.requires];

	return (
		<div
			id={`doc-recipe-${recipe.id}`}
			data-doc-anchor={`recipe-${recipe.id}`}
			className="scroll-mt-24 space-y-4"
		>
			<BlockCard
				// A new adapter means new source; reset the loaded code with it.
				key={`${recipe.id}-${primitive}`}
				title={recipe.title}
				description={recipe.description}
				labels={recipe.labels}
				code={loadCode}
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
						{requires.join(" · ")}
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
