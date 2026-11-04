import * as React from "react";
import type { DocumentationNavGroup } from "@/components/documentation-shell";
import { PrimitivePicker } from "@/components/primitive-picker";
import { RecipeBrowser } from "@/components/recipe-browser";
import { recipeCategories, recipes } from "@/components/recipe-catalog";
import { DEFAULT_PRIMITIVE, type Primitive } from "@/lib/primitives";

export const recipeNavigation = recipeCategories.map((category) => ({
	label: category,
	items: recipes
		.filter((recipe) => recipe.category === category)
		.map((recipe) => ({
			hash: `recipe-${recipe.id}`,
			label: recipe.shortTitle,
		})),
})) satisfies readonly DocumentationNavGroup[];

function categoryHeadingId(category: string) {
	return `recipe-category-${category
		.toLowerCase()
		.replaceAll("&", "and")
		.replaceAll(" ", "-")}`;
}

export function RecipesSection({
	primitive: primitiveProp,
	onPrimitiveChange,
}: {
	/** Library every recipe is shown for. Uncontrolled when omitted. */
	primitive?: Primitive;
	onPrimitiveChange?: (primitive: Primitive) => void;
}) {
	const [uncontrolledPrimitive, setUncontrolledPrimitive] =
		React.useState<Primitive>(DEFAULT_PRIMITIVE);
	const primitive = primitiveProp ?? uncontrolledPrimitive;
	const setPrimitive = (next: Primitive) => {
		setUncontrolledPrimitive(next);
		onPrimitiveChange?.(next);
	};

	return (
		<div className="space-y-16 md:space-y-20">
			<PrimitivePicker value={primitive} onValueChange={setPrimitive} />
			{recipeCategories.map((category) => {
				const headingId = categoryHeadingId(category);
				return (
					<section
						key={category}
						aria-labelledby={headingId}
						className="space-y-10"
					>
						<h2
							id={headingId}
							className="text-sm font-semibold tracking-wide text-slate-500 uppercase"
						>
							{category}
						</h2>
						{recipes
							.filter((recipe) => recipe.category === category)
							.map((recipe) => (
								<RecipeBrowser
									key={recipe.id}
									recipe={recipe}
									primitive={primitive}
								/>
							))}
					</section>
				);
			})}
		</div>
	);
}
