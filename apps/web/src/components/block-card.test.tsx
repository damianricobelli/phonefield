import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BlockCard } from "@/components/block-card";

describe("BlockCard", () => {
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
	});
});
