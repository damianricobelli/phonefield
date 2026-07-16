import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PhoneInputFormData } from "@/blocks/phone-input-form-data";

afterEach(cleanup);

describe("PhoneInputFormData", () => {
	it("places submit in the trailing InputGroup addon", () => {
		render(<PhoneInputFormData />);

		const submit = screen.getByRole("button", { name: "Submit" });
		const addon = submit.closest('[data-slot="input-group-addon"]');

		expect(addon?.getAttribute("data-align")).toBe("inline-end");
		expect(addon?.closest('[data-slot="input-group"]')).toBeTruthy();
		expect(
			screen.queryByRole("textbox", { name: "Note (optional)" }),
		).toBeNull();
	});
});
