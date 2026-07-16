import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PhoneInputSeparated } from "@/blocks/phone-input-separated";

afterEach(cleanup);

describe("PhoneInputSeparated", () => {
	it("sizes the country column and trigger from the selected dial code", () => {
		render(<PhoneInputSeparated />);

		const root = screen
			.getByRole("textbox", { name: "Phone number" })
			.closest('[data-slot="phone-field"]');
		expect(root?.className).toContain(
			"sm:grid-cols-[max-content_minmax(0,1fr)]",
		);

		const countryTrigger = screen.getByRole("combobox", { name: "Country" });
		expect(countryTrigger.className).toContain("w-fit");
		expect(countryTrigger.className).not.toContain("w-full");
		const input = screen.getByRole("textbox", { name: "Phone number" });
		expect(input.className).toContain("bg-background");
		expect(
			screen
				.getByRole("textbox", { name: "Phone number" })
				.closest('[data-slot="input-group"]'),
		).toBeNull();
	});
});
