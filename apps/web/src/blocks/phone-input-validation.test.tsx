import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PhoneInputValidation } from "@/blocks/phone-input-validation";

afterEach(cleanup);

describe("PhoneInputValidation", () => {
	it("waits for blur, then updates the error while the user types", async () => {
		render(<PhoneInputValidation />);

		const input = screen.getByRole("textbox", { name: "Phone number" });
		fireEvent.change(input, { target: { value: "2" } });
		expect(screen.queryByRole("alert")).toBeNull();

		fireEvent.blur(input);
		await waitFor(() => {
			expect(screen.getByRole("alert").textContent).toBe(
				"Enter a valid number",
			);
		});
		expect(input.getAttribute("aria-invalid")).toBe("true");
		expect(input.getAttribute("aria-describedby")?.split(" ")).toContain(
			screen.getByRole("alert").id,
		);

		fireEvent.change(input, { target: { value: "2025550123" } });
		expect(screen.queryByRole("alert")).toBeNull();
		expect(input.hasAttribute("aria-invalid")).toBe(false);
	});

	it("reports a required field left empty", async () => {
		render(<PhoneInputValidation />);

		const input = screen.getByRole("textbox", { name: "Phone number" });
		fireEvent.focus(input);
		fireEvent.blur(input);

		await waitFor(() => {
			expect(screen.getByRole("alert").textContent).toBe("Phone is required");
		});
	});
});
