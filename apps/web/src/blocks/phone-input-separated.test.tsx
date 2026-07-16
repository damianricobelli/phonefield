import {
	cleanup,
	fireEvent,
	render,
	screen,
	within,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PhoneInputSeparated } from "@/blocks/phone-input-separated";

afterEach(cleanup);

describe("PhoneInputSeparated", () => {
	it("shows the dialing code instead of the country name in the trigger", () => {
		render(<PhoneInputSeparated />);

		const trigger = screen.getByRole("combobox");
		expect(trigger.textContent).toContain("+54");
		expect(within(trigger).getByText("Argentina").className).toContain(
			"sr-only",
		);
	});

	it("does not reserve empty-state space while countries are available", () => {
		render(<PhoneInputSeparated />);
		fireEvent.click(screen.getByRole("combobox"));

		const emptyState = document.querySelector<HTMLElement>(
			'[data-slot="phone-field-country-empty"]',
		);
		expect(emptyState).not.toBeNull();
		expect(emptyState?.className).toContain("hidden");
		expect(emptyState?.className).toContain(
			"group-data-empty/phone-country:flex",
		);
	});
});
