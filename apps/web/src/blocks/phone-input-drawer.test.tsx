import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PhoneInputDrawer } from "@/blocks/phone-input-drawer";

afterEach(cleanup);

describe("PhoneInputDrawer", () => {
	it("removes the trigger's inset border inside the InputGroup", () => {
		render(<PhoneInputDrawer />);

		const trigger = screen.getByRole("button", { name: "Choose country" });
		expect(trigger.className).toContain("border-0");
		expect(trigger.className).toContain("border-r");
	});
});
