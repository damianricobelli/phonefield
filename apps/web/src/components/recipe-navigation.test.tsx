import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DocSection } from "@/components/doc-section";
import { FeaturedRecipesSection } from "@/components/featured-recipes-section";
import { recipeCategories, recipes } from "@/components/recipe-catalog";

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

describe("documentation recipe browser", () => {
	it("renders every recipe in the document flow behind native anchor links", () => {
		render(<DocSection />);
		expect(
			screen.getByRole("heading", { name: "Inline country select" }),
		).toBeTruthy();
		expect(
			screen.getByRole("heading", { name: "React Hook Form + Zod" }),
		).toBeTruthy();
		expect(document.querySelectorAll("#recipes [id^=recipe-]")).toHaveLength(
			recipes.length + recipeCategories.length,
		);
		expect(
			screen
				.getAllByRole("link", { name: "React Hook Form" })[0]
				?.getAttribute("href"),
		).toBe("#recipe-react-hook-form");
	});
});
