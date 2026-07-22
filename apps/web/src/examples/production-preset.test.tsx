import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LivePlayground } from "@/components/live-playground";
import { ProductionPhoneField } from "./production-preset";

afterEach(cleanup);

async function openCountryPopup() {
	fireEvent.click(screen.getByRole("combobox", { name: "Country" }));

	return waitFor(() => {
		const popup = document.querySelector<HTMLElement>(
			'[data-slot="phone-field-country-popup"]',
		);
		expect(popup).not.toBeNull();
		return popup as HTMLElement;
	});
}

function expectInterruptiblePopupMotion(popup: HTMLElement) {
	expect(popup.className).toContain(
		"data-starting-style:[transform:scale(0.97)]",
	);
	expect(popup.className).toContain(
		"data-ending-style:[transform:scale(0.97)]",
	);
	expect(popup.className).not.toMatch(
		/data-(?:\[)?(?:starting|ending)-style(?:\])?:scale-/,
	);
}

describe("ProductionPhoneField", () => {
	it("groups two independently named controls in one visual shell", () => {
		const { container } = render(<ProductionPhoneField />);

		const country = screen.getByRole("combobox", { name: "Country" });
		const phone = screen.getByRole("textbox", { name: "Phone number" });
		const root = container.querySelector('[data-slot="phone-field"]');
		const inputGroup = container.querySelector('[data-slot="input-group"]');

		expect(root).not.toBeNull();
		expect(inputGroup).not.toBeNull();
		expect(inputGroup?.className).toContain("overflow-hidden");
		expect(inputGroup?.className).toContain(
			"has-aria-invalid:border-destructive",
		);
		expect(phone.hasAttribute("data-input-group-control")).toBe(true);
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

	it("animates popup scale through the declared transform transition", async () => {
		render(<ProductionPhoneField />);

		expectInterruptiblePopupMotion(await openCountryPopup());
	});
});

describe("LivePlayground", () => {
	it("does not move the country trigger while it is pressed", () => {
		const { container } = render(<LivePlayground />);

		expect(
			screen.getByRole("combobox", { name: "Country" }).className,
		).toContain("border-r");
		expect(
			screen.getByRole("combobox", { name: "Country" }).className,
		).toContain("border-input");
		expect(
			screen.getByRole("combobox", { name: "Country" }).className,
		).not.toContain("ui-pressable");
		expect(container.querySelector('[data-slot="input-group"]')).toBeTruthy();
		expect(
			container.querySelector('[data-slot="input-group"]')?.className,
		).toContain("h-10");
		expect(
			screen
				.getByRole("textbox", { name: "Phone number" })
				.hasAttribute("data-input-group-control"),
		).toBe(true);
	});

	it("uses the same interruptible popup motion as the production preset", async () => {
		render(<LivePlayground />);

		expectInterruptiblePopupMotion(await openCountryPopup());
	});
});
