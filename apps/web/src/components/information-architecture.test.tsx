import { cleanup, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DocSection } from "@/components/doc-section";
import { FeaturedRecipesSection } from "@/components/featured-recipes-section";
import { HeroSection } from "@/components/hero-section";
import { HomePage } from "@/components/home-page";
import { PageFooter } from "@/components/page-footer";
import { PageHeader } from "@/components/page-header";

vi.mock("@/components/live-playground", () => ({
	LivePlayground: () => null,
}));

vi.mock("@tanstack/react-router", () => ({
	linkOptions: <T,>(options: T) => options,
	Link: ({
		hash,
		to,
		...props
	}: Omit<ComponentProps<"a">, "href"> & {
		hash?: string;
		to: string;
	}) => (
		<a
			{...props}
			data-router-link="true"
			href={`${to}${hash ? `#${hash}` : ""}`}
		/>
	),
}));

afterEach(cleanup);

describe("site information architecture", () => {
	it("renders the complete documentation on the home page and out of the header", () => {
		render(<HomePage />);
		expect(
			screen.getByRole("heading", { name: "Getting started" }),
		).toBeTruthy();
		expect(screen.getByRole("heading", { name: "Component API" })).toBeTruthy();
		expect(screen.queryByRole("link", { name: "Documentation" })).toBeNull();
	});

	it("keeps recipes in the primary navigation", () => {
		render(<PageHeader />);
		const recipesLink = screen.getByRole("link", { name: "Recipes" });
		expect(recipesLink.getAttribute("href")).toBe("/recipes");
		expect(recipesLink.getAttribute("data-router-link")).toBe("true");
		expect(
			screen
				.getByRole("link", { name: "Playground" })
				.getAttribute("data-router-link"),
		).toBe("true");
		expect(
			screen
				.getByRole("link", { name: "PhoneField" })
				.getAttribute("data-router-link"),
		).toBe("true");
		expect(
			screen
				.getByRole("link", { name: "GitHub" })
				.hasAttribute("data-router-link"),
		).toBe(false);
	});

	it("sends featured recipes to their dedicated page", () => {
		render(<FeaturedRecipesSection />);
		const recipeLink = screen.getByRole("link", { name: /React Hook Form/ });
		expect(recipeLink.getAttribute("href")).toBe(
			"/recipes#recipe-react-hook-form",
		);
		expect(recipeLink.getAttribute("data-router-link")).toBe("true");
		expect(
			screen
				.getByRole("link", { name: "Browse all" })
				.getAttribute("data-router-link"),
		).toBe("true");
	});

	it("links documentation entry points back to the home section", () => {
		render(<HeroSection />);
		expect(
			screen.getByRole("link", { name: "Read docs" }).getAttribute("href"),
		).toBe("/#documentation");

		cleanup();
		render(<PageFooter />);
		expect(
			screen.getByRole("link", { name: "Docs" }).getAttribute("href"),
		).toBe("/#documentation");
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
