import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PhoneInputNativeSelect } from "@/blocks/phone-input-native-select";

afterEach(cleanup);

describe("PhoneInputNativeSelect", () => {
	it("drives the field's country from a native select", () => {
		render(<PhoneInputNativeSelect />);

		const select = screen.getByRole("combobox", { name: "Country" });
		const root = select.closest('[data-slot="phone-field"]');
		expect(root?.getAttribute("data-country")).toBe("US");

		fireEvent.change(select, { target: { value: "AR" } });

		expect(root?.getAttribute("data-country")).toBe("AR");
		expect(screen.getByText("+54")).toBeTruthy();
		expect(
			screen
				.getByRole("textbox", { name: "Phone number" })
				.getAttribute("placeholder"),
		).toBeTruthy();
	});
});
