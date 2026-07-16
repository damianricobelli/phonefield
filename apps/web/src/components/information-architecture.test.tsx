import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DocSection } from "@/components/doc-section";
import { FeaturedDocumentationSection } from "@/components/featured-documentation-section";
import { FeaturedRecipesSection } from "@/components/featured-recipes-section";
import { PageHeader } from "@/components/page-header";

afterEach(cleanup);

describe("site information architecture", () => {
	it("links the primary navigation to dedicated routes", () => {
		render(<PageHeader />);
		expect(
			screen.getByRole("link", { name: "Recipes" }).getAttribute("href"),
		).toBe("/recipes");
		expect(
			screen.getByRole("link", { name: "Documentation" }).getAttribute("href"),
		).toBe("/docs");
	});

	it("sends featured recipes to their dedicated page", () => {
		render(<FeaturedRecipesSection />);
		expect(
			screen
				.getByRole("link", { name: /React Hook Form/ })
				.getAttribute("href"),
		).toBe("/recipes#recipe-react-hook-form");
	});

	it("offers documentation entry points below the featured recipes", () => {
		render(<FeaturedDocumentationSection />);
		expect(
			screen
				.getByRole("link", { name: /Getting started/ })
				.getAttribute("href"),
		).toBe("/docs#getting-started");
		expect(
			screen.getByRole("link", { name: /Component API/ }).getAttribute("href"),
		).toBe("/docs#api");
	});

	it("keeps recipes out of the documentation content", () => {
		render(<DocSection />);
		expect(
			screen.queryByRole("heading", { name: "Inline country select" }),
		).toBeNull();
		expect(
			screen.getByRole("heading", { name: "Getting started" }),
		).toBeTruthy();
	});
});
