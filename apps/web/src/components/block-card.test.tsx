import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BlockCard } from "@/components/block-card";

afterEach(cleanup);

describe("BlockCard", () => {
	it("top-aligns the preview so compact blocks do not get blank space above", () => {
		render(
			<BlockCard
				title="Inline country select"
				description="A phone input block."
				labels={["shadcn"]}
				code="export function Example() {}"
			>
				<div>Interactive phone preview</div>
			</BlockCard>,
		);

		const preview = screen.getByRole("tabpanel");
		expect(preview.className).toContain("items-start");
		expect(preview.className).not.toContain("items-center");
		expect(preview.className).toContain("min-h-52");
		expect(preview.className).not.toContain("min-h-80");

		const card = preview.closest("article");
		expect(card?.className).toContain("h-full");
		expect(card?.querySelector("header")?.className).toContain("lg:h-44");
		expect(card?.querySelector('[data-slot="card"]')).toBeTruthy();
		expect(card?.querySelector('[data-slot="tabs"]')).toBeTruthy();
		expect(card?.querySelector('[data-slot="tabs-list"]')).toBeTruthy();
	});

	it("switches from the live preview to copyable source code", () => {
		render(
			<BlockCard
				title="Inline country select"
				description="A phone input block."
				labels={["shadcn"]}
				code={
					'export function Example() { return <div data-example="phone" />; }'
				}
			>
				<div>Interactive phone preview</div>
			</BlockCard>,
		);

		expect(screen.getByText("Interactive phone preview")).toBeTruthy();

		fireEvent.click(screen.getByRole("tab", { name: "Code" }));

		expect(screen.getByText("component.tsx")).toBeTruthy();
		expect(screen.queryByText("Interactive phone preview")).toBeNull();
		expect(
			screen.getByRole("tab", { name: "Code" }).getAttribute("aria-selected"),
		).toBe("true");
		expect(document.querySelector("pre")?.className).toContain("max-h-40");
		expect(document.querySelector("pre")?.className).not.toContain(
			"max-h-[32rem]",
		);
	});

	it("loads source only when the code tab is opened", async () => {
		const loadCode = vi
			.fn()
			.mockResolvedValue("export const lazySource = true;");

		render(
			<BlockCard
				title="Lazy block"
				description="A lazily loaded source file."
				labels={["lazy"]}
				code={loadCode}
			>
				<div>Preview</div>
			</BlockCard>,
		);

		expect(loadCode).not.toHaveBeenCalled();
		fireEvent.click(screen.getByRole("tab", { name: "Code" }));
		expect(loadCode).toHaveBeenCalledOnce();

		await waitFor(() => {
			expect(document.querySelector("pre")?.textContent).toContain(
				"lazySource",
			);
		});
		expect(
			screen
				.getByRole("button", { name: "Copy code" })
				.hasAttribute("disabled"),
		).toBe(false);
	});
});
