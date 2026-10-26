import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LivePlayground } from "@/components/live-playground";
import { PhoneInput } from "./production-preset";

afterEach(cleanup);

async function openCountryPopup(name: RegExp | string = /United States/) {
	fireEvent.click(screen.getByRole("combobox", { name }));

	return waitFor(() => {
		const popup = document.querySelector<HTMLElement>(
			'[data-slot="phone-field-country-popup"]',
		);
		expect(popup).not.toBeNull();
		return popup as HTMLElement;
	});
}

function expectInterruptiblePopupMotion(popup: HTMLElement) {
	// Tailwind's scale-* utilities set the `scale` property, which a
	// transform transition would not animate.
	expect(popup.className).toContain("transition-[transform,opacity]");
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

describe("PhoneInput preset", () => {
	it("uses Group as the visual shell around two independently named controls", () => {
		const { container } = render(
			<PhoneInput label="Phone number" defaultCountry="US" />,
		);

		const country = screen.getByRole("combobox", { name: /United States/ });
		const phone = screen.getByRole("textbox", { name: "Phone number" });
		const group = container.querySelector('[data-slot="phone-field-group"]');

		expect(group?.className).toContain("data-focused:border-ring");
		expect(group?.className).toContain("data-invalid:border-destructive");
		expect(group?.getAttribute("data-country")).toBe("US");
		expect(group?.contains(phone)).toBe(true);
		expect(country.id).not.toBe(phone.id);
	});

	it("preserves consumer accessible names", () => {
		render(<PhoneInput inputProps={{ "aria-label": "Mobile number" }} />);

		expect(screen.getByRole("textbox", { name: "Mobile number" })).toBeTruthy();
	});

	it("renders extra parts inside Root", () => {
		render(
			<PhoneInput>
				<output>extra</output>
			</PhoneInput>,
		);
		expect(
			screen.getByRole("status").closest('[data-slot="phone-field"]'),
		).toBeTruthy();
	});

	it("animates popup scale through the declared transform transition", async () => {
		render(<PhoneInput defaultCountry="US" />);

		expectInterruptiblePopupMotion(await openCountryPopup());
	});
});

describe("LivePlayground", () => {
	it("reflects Root props in the generated code", () => {
		render(<LivePlayground />);

		fireEvent.click(screen.getByRole("switch", { name: "required" }));
		fireEvent.click(screen.getByRole("tab", { name: "Code" }));

		expect(screen.getByRole("tabpanel").textContent).toContain("required");
		expect(
			screen.getByRole("textbox", { name: /Phone number/ }),
		).toHaveProperty("required", true);
	});

	it("uses the preset's interruptible popup motion", async () => {
		render(<LivePlayground />);

		expectInterruptiblePopupMotion(await openCountryPopup());
	});
});
