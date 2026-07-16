import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PhoneInputVerification } from "@/blocks/phone-input-verification";

afterEach(cleanup);

describe("PhoneInputVerification", () => {
	it("uses the shadcn Card composition", () => {
		render(<PhoneInputVerification />);

		const title = screen.getByText("Secure verification");
		const card = title.closest('[data-slot="card"]');

		expect(card).toBeTruthy();
		expect(card?.querySelector('[data-slot="card-header"]')).toBeTruthy();
		expect(card?.querySelector('[data-slot="card-content"]')).toBeTruthy();
		expect(card?.querySelector('[data-slot="card-footer"]')).toBeTruthy();
	});
});
