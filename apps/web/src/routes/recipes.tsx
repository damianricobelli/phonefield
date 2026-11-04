import { createFileRoute } from "@tanstack/react-router";
import { DocumentationShell } from "@/components/documentation-shell";
import { RecipesSection, recipeNavigation } from "@/components/recipes-section";
import { SitePage } from "@/components/site-page";
import {
	DEFAULT_PRIMITIVE,
	isPrimitive,
	type Primitive,
} from "@/lib/primitives";
import { pageSeo } from "@/lib/seo";

type RecipesSearch = {
	/** Library the recipes are written for. Omitted for the default, Base UI. */
	primitive?: Primitive;
};

export const Route = createFileRoute("/recipes")({
	component: RecipesPage,
	validateSearch: (search: Record<string, unknown>): RecipesSearch =>
		isPrimitive(search.primitive) && search.primitive !== DEFAULT_PRIMITIVE
			? { primitive: search.primitive }
			: {},
	head: () =>
		pageSeo({
			title: "Recipes — PhoneField React phone input examples",
			description:
				"Copy-paste React phone input recipes: shadcn/ui, React Hook Form, TanStack Form, validation, OTP, paste detection, drawers, and localization.",
			path: "/recipes",
		}),
});

function RecipesPage() {
	const { primitive = DEFAULT_PRIMITIVE } = Route.useSearch();
	const navigate = Route.useNavigate();
	const selectPrimitive = (next: Primitive) => {
		navigate({
			search: next === DEFAULT_PRIMITIVE ? {} : { primitive: next },
			hash: (hash) => hash ?? "",
			replace: true,
			resetScroll: false,
		});
	};

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
				<RecipesSection
					primitive={primitive}
					onPrimitiveChange={selectPrimitive}
				/>
			</DocumentationShell>
		</SitePage>
	);
}
