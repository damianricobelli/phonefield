import {
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
	RouterProvider,
} from "@tanstack/react-router";
import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DocSection } from "@/components/doc-section";
import { FeaturedDocumentationSection } from "@/components/featured-documentation-section";
import { FeaturedRecipesSection } from "@/components/featured-recipes-section";
import { PageHeader } from "@/components/page-header";

const headerRoutes = [
	{ path: "/", label: "Playground" },
	{ path: "/recipes", label: "Recipes" },
	{ path: "/docs", label: "Documentation" },
] as const;

afterEach(() => {
	cleanup();
	Reflect.deleteProperty(document, "startViewTransition");
});

async function renderHeaderAt(path: string) {
	const rootRoute = createRootRoute({ component: PageHeader });
	const routeTree = rootRoute.addChildren(
		headerRoutes.map(({ path }) =>
			createRoute({ getParentRoute: () => rootRoute, path }),
		),
	);
	const router = createRouter({
		history: createMemoryHistory({ initialEntries: [path] }),
		routeTree,
	});

	await router.load();
	render(<RouterProvider router={router} />);
}

describe("site information architecture", () => {
	it("links the primary navigation to dedicated routes", async () => {
		await renderHeaderAt("/");
		expect(
			screen.getByRole("link", { name: "Recipes" }).getAttribute("href"),
		).toBe("/recipes");
		expect(
			screen.getByRole("link", { name: "Documentation" }).getAttribute("href"),
		).toBe("/docs");
	});

	it.each(headerRoutes)(
		"keeps $path selected in the primary navigation",
		async ({ path, label }) => {
			await renderHeaderAt(path);

			expect(
				screen.getByRole("link", { name: label }).getAttribute("aria-current"),
			).toBe("page");
			expect(screen.getAllByTestId("primary-nav-indicator")).toHaveLength(1);
		},
	);

	it("requests a view transition when changing primary routes", async () => {
		await renderHeaderAt("/");
		const startViewTransition = vi.fn((update: () => void) => {
			update();
			return {} as ViewTransition;
		});
		Object.defineProperty(document, "startViewTransition", {
			configurable: true,
			value: startViewTransition,
		});

		fireEvent.click(screen.getByRole("link", { name: "Recipes" }));

		await waitFor(() => expect(startViewTransition).toHaveBeenCalledOnce());
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
