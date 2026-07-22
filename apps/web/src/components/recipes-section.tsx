import type { DocumentationNavGroup } from "@/components/documentation-shell";
import { RecipeBrowser } from "@/components/recipe-browser";
import { recipeCategories, recipes } from "@/components/recipe-catalog";

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

export function RecipesSection() {
	return (
		<div className="space-y-16 md:space-y-20">
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
								<RecipeBrowser key={recipe.id} recipe={recipe} />
							))}
					</section>
				);
			})}
		</div>
	);
}
