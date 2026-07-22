import { cleanup, render, screen } from "@testing-library/react";
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
		expect(
			screen.getByRole("link", { name: "Recipes" }).getAttribute("href"),
		).toBe("/recipes");
	});

	it("sends featured recipes to their dedicated page", () => {
		render(<FeaturedRecipesSection />);
		expect(
			screen
				.getByRole("link", { name: /React Hook Form/ })
				.getAttribute("href"),
		).toBe("/recipes#recipe-react-hook-form");
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
