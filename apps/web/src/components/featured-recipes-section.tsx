import { FeaturedLinksSection } from "@/components/featured-links-section";
import { featuredRecipeIds, findRecipe } from "@/components/recipe-catalog";

export function FeaturedRecipesSection() {
	const featuredRecipes = featuredRecipeIds.map((id) => {
		const recipe = findRecipe(id);
		return {
			title: recipe.title,
			description: recipe.description,
			href: `/recipes#recipe-${recipe.id}`,
		};
	});

	return (
		<FeaturedLinksSection
			eyebrow="Recipes"
			title="Start from a production pattern."
			browseHref="/recipes#recipe-inline"
			browseLabel="Browse all"
			items={featuredRecipes}
		/>
	);
}
