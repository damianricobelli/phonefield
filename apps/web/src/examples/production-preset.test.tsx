import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ProductionPhoneField } from "./production-preset";

afterEach(cleanup);

describe("ProductionPhoneField", () => {
	it("groups two independently named controls in one visual shell", () => {
		const { container } = render(<ProductionPhoneField />);

		const country = screen.getByRole("combobox", { name: "Country" });
		const phone = screen.getByRole("textbox", { name: "Phone number" });
		const root = container.querySelector('[data-slot="phone-field"]');

		expect(root).not.toBeNull();
		expect(root?.className).toContain("overflow-hidden");
		expect(root?.className).toContain("has-aria-invalid:border-destructive");
		expect(country.id).not.toBe(phone.id);
	});

	it("preserves consumer accessible names", () => {
		render(
			<ProductionPhoneField
				countryProps={{
					slotProps: { trigger: { "aria-label": "Dialing country" } },
				}}
				inputProps={{ "aria-label": "Mobile number" }}
			/>,
		);

		expect(
			screen.getByRole("combobox", { name: "Dialing country" }),
		).toBeTruthy();
		expect(screen.getByRole("textbox", { name: "Mobile number" })).toBeTruthy();
	});
});
