import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import * as React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { getRecipeVariant, recipes } from "@/components/recipe-catalog";
import { RecipesSection } from "@/components/recipes-section";
import { primitives } from "@/lib/primitives";

afterEach(cleanup);

const variants = recipes.flatMap((recipe) =>
	primitives.map((primitive) => ({
		name: `${primitive.label} · ${recipe.title}`,
		recipe,
		primitive,
	})),
);

describe("recipe variants", () => {
	it.each(variants)("renders $name", async ({ recipe, primitive }) => {
		const { component: Preview } = getRecipeVariant(recipe, primitive.value);
		render(
			<React.Suspense fallback={<p>Loading preview</p>}>
				<Preview />
			</React.Suspense>,
		);
		await waitFor(() =>
			expect(screen.queryByText("Loading preview")).toBeNull(),
		);
		expect(screen.getAllByRole("textbox").length).toBeGreaterThan(0);
	});

	it.each(
		variants,
	)("writes $name for its own library", async ({ recipe, primitive }) => {
		const code = await getRecipeVariant(recipe, primitive.value).loadCode();
		expect(code).toContain(`from "${primitive.entry}"`);
		if (primitive.value === "radix") {
			expect(code).not.toMatch(/render=\{</);
		}
		if (primitive.value === "react-aria") {
			expect(code).not.toMatch(/render=\{</);
			expect(code).not.toContain("CountryPositioner");
		}
	});
});

describe("primitive picker", () => {
	it("switches every recipe to the chosen library", async () => {
		render(<RecipesSection />);
		expect(screen.getByText("phonefield")).toBeTruthy();

		fireEvent.click(screen.getByRole("tab", { name: "Radix UI" }));
		expect(screen.getByText("phonefield/radix")).toBeTruthy();
		expect(
			screen.getAllByText(/^radix-ui · /, { selector: "p" }).length,
		).toBe(recipes.length);

		fireEvent.click(screen.getByRole("tab", { name: "React Aria" }));
		expect(screen.getByText("phonefield/react-aria")).toBeTruthy();
	});
});
