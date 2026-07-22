import { cleanup, render, screen, waitFor } from "@testing-library/react";
import type { ComponentProps } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { documentationNavigation } from "@/components/doc-section";
import {
	DocumentationSection,
	DocumentationShell,
} from "@/components/documentation-shell";
import { FeaturedRecipesSection } from "@/components/featured-recipes-section";
import { recipeCategories, recipes } from "@/components/recipe-catalog";
import { RecipesSection, recipeNavigation } from "@/components/recipes-section";

vi.mock("@tanstack/react-router", () => ({
	Link: ({
		hash,
		to,
		...props
	}: Omit<ComponentProps<"a">, "href"> & {
		hash?: string;
		to: string;
	}) => <a {...props} href={`${to}${hash ? `#${hash}` : ""}`} />,
}));

afterEach(() => {
	cleanup();
	window.history.replaceState(null, "", "/");
});

describe("recipe catalog", () => {
	it("groups the consolidated recipe collection by product intent", () => {
		expect(recipes).toHaveLength(13);
		expect(recipeCategories).toEqual([
			"Basics",
			"Forms",
			"Product flows",
			"Mobile & localization",
		]);
		expect(recipes.map((recipe) => recipe.id)).toContain("react-hook-form");
		expect(recipes.map((recipe) => recipe.id)).toContain("tanstack-form");
		expect(
			recipes.filter((recipe) => recipe.id === "verification"),
		).toHaveLength(1);
	});

	it("keeps the landing compact with three featured links", () => {
		render(<FeaturedRecipesSection />);
		expect(screen.getAllByRole("link")).toHaveLength(4);
		expect(screen.getByRole("link", { name: /React Hook Form/ })).toBeTruthy();
	});
});

describe("recipes page", () => {
	it("renders every recipe in its own document flow", () => {
		render(<RecipesSection />);
		expect(
			screen.getByRole("heading", { name: "Inline country select" }),
		).toBeTruthy();
		expect(
			screen.getByRole("heading", { name: "React Hook Form + Zod" }),
		).toBeTruthy();
		expect(
			document.querySelectorAll('[data-doc-anchor^="recipe-"]'),
		).toHaveLength(recipes.length);
		expect(
			recipeNavigation
				.flatMap((group) => group.items)
				.find((item) => item.label === "React Hook Form")?.hash,
		).toBe("recipe-react-hook-form");
	});

	it("uses the shared active style for guides and reference links", async () => {
		window.history.replaceState(null, "", "/#getting-started");
		render(
			<DocumentationShell
				header={{
					eyebrow: "Reference",
					title: "Documentation",
					description: "Reference",
				}}
				navigation={documentationNavigation}
				mobileNavigation={{
					label: "Browse documentation",
					title: "Documentation",
					description: "Reference",
				}}
			>
				<DocumentationSection
					anchor="getting-started"
					title="Getting started"
					description="Start here"
				>
					<div />
				</DocumentationSection>
			</DocumentationShell>,
		);

		await waitFor(() => {
			const link = screen.getByRole("link", { name: "Getting started" });
			expect(link.className).toContain("bg-sky-50");
			expect(link.className).toContain("font-semibold");
			expect(link.className).toContain("text-sky-800");
		});
	});
});
