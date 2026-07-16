import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PhoneInputValidation } from "@/blocks/phone-input-validation";

afterEach(cleanup);

describe("PhoneInputValidation", () => {
	it("validates while the user types without waiting for blur", () => {
		render(<PhoneInputValidation />);

		const input = screen.getByRole("textbox", { name: "Phone number" });
		fireEvent.change(input, { target: { value: "2" } });

		expect(screen.getByText("Enter a valid number")).toBeTruthy();
		expect(input.getAttribute("aria-invalid")).toBe("true");
	});
});
