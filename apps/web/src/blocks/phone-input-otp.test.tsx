import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PhoneInputOtp } from "@/blocks/phone-input-otp";

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
});

describe("PhoneInputOtp", () => {
	it("keeps every verification step in one neutral card", () => {
		vi.stubGlobal(
			"ResizeObserver",
			class {
				observe() {}
				unobserve() {}
				disconnect() {}
			},
		);
		render(<PhoneInputOtp />);
		expect(document.querySelector('[data-slot="card"]')).toBeTruthy();
		const addon = document.querySelector('[data-slot="input-group-addon"]');
		expect(addon).toBeTruthy();
		expect(addon?.className).not.toContain("border-r");

		fireEvent.change(
			screen.getByRole("textbox", { name: "Verify your phone" }),
			{
				target: { value: "2025550123" },
			},
		);
		fireEvent.click(
			screen.getByRole("button", { name: "Send verification code" }),
		);

		const slots = document.querySelectorAll('[data-slot="input-otp-slot"]');
		expect(slots).toHaveLength(6);
		for (const slot of slots) {
			expect(slot.className).toContain("bg-background");
		}

		fireEvent.change(
			screen.getByRole("textbox", { name: "Enter the 6-digit code" }),
			{ target: { value: "123456" } },
		);
		fireEvent.click(screen.getByRole("button", { name: "Verify code" }));

		expect(screen.getByText("Phone verified")).toBeTruthy();
		const card = document.querySelector('[data-slot="card"]');
		expect(card).toBeTruthy();
		expect(card?.className).not.toContain("emerald");
	});
});
