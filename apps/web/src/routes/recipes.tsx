import { createFileRoute } from "@tanstack/react-router";
import { DocumentationShell } from "@/components/documentation-shell";
import { RecipesSection, recipeNavigation } from "@/components/recipes-section";
import { SitePage } from "@/components/site-page";

export const Route = createFileRoute("/recipes")({
	component: RecipesPage,
	head: () => ({
		meta: [
			{ title: "Recipes — PhoneField" },
			{
				name: "description",
				content:
					"Copy-paste PhoneField recipes for forms, verification, mobile flows, and localization.",
			},
		],
	}),
});

function RecipesPage() {
	return (
		<SitePage>
			<DocumentationShell
				header={{
					eyebrow: "Copy-paste",
					title: "Recipes",
					description:
						"Production-ready PhoneField patterns composed from the same primitives and shadcn components used by the playground.",
				}}
				navigation={recipeNavigation}
				mobileNavigation={{
					label: "Browse recipes",
					title: "Recipes",
					description:
						"Choose a pattern by use case and copy its complete source.",
				}}
			>
				<RecipesSection />
			</DocumentationShell>
		</SitePage>
	);
}
