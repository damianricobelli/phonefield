// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PhoneField } from "../src";

afterEach(cleanup);

describe("PhoneField", () => {
	it("serializes only submitted source fields and uses national phone semantics", () => {
		const { container } = render(
			<PhoneField.Root defaultCountry="GB" name="phone">
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);

		const input = screen.getByRole("textbox", { name: "Phone number" });
		fireEvent.change(input, { target: { value: "02079460018" } });

		expect(input.getAttribute("type")).toBe("tel");
		expect(input.getAttribute("inputmode")).toBe("tel");
		expect(input.getAttribute("autocomplete")).toBe("tel-national");
		expect(input.hasAttribute("pattern")).toBe(false);

		const hidden = container.querySelector<HTMLInputElement>(
			'input[type="hidden"][name="phone"]',
		);
		if (!hidden) {
			throw new Error("Expected PhoneField.Root to render its hidden input");
		}
		expect(JSON.parse(hidden.value)).toEqual({
			countryIso2: "GB",
			nationalNumber: "020 7946 0018",
		});
	});

	it("forwards refs to the root and input elements", () => {
		const rootRef = React.createRef<HTMLDivElement>();
		const inputRef = React.createRef<HTMLInputElement>();

		render(
			<PhoneField.Root ref={rootRef}>
				<PhoneField.Input ref={inputRef} aria-label="Phone number" />
			</PhoneField.Root>,
		);

		expect(rootRef.current).toBeInstanceOf(HTMLDivElement);
		expect(inputRef.current).toBe(
			screen.getByRole("textbox", { name: "Phone number" }),
		);
	});

	it("allows native input defaults to be overridden", () => {
		render(
			<PhoneField.Root>
				<PhoneField.Input
					aria-label="Phone number"
					type="text"
					inputMode="numeric"
					autoComplete="off"
					pattern="[0-9]+"
				/>
			</PhoneField.Root>,
		);

		const input = screen.getByRole("textbox", { name: "Phone number" });
		expect(input.getAttribute("type")).toBe("text");
		expect(input.getAttribute("inputmode")).toBe("numeric");
		expect(input.getAttribute("autocomplete")).toBe("off");
		expect(input.getAttribute("pattern")).toBe("[0-9]+");
	});

	it("forwards country slot props and applies classNames precedence", async () => {
		const itemSlot = vi.fn((country: PhoneField.Country) => ({
			"data-country-slot": country.iso2,
			className: "slot-item",
		}));

		render(
			<PhoneField.Root>
				<PhoneField.Country
					classNames={{ trigger: "api-trigger", item: "api-item" }}
					slotProps={{
						root: { open: true },
						trigger: {
							"aria-label": "Country",
							className: "slot-trigger",
						},
						value: { placeholder: "Choose country" },
						popup: { className: "slot-popup" },
						searchInput: { "aria-label": "Find country" },
						item: itemSlot,
					}}
				/>
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);

		const trigger = screen.getByRole("combobox", { name: "Country" });
		expect(trigger.className).toBe("api-trigger");
		expect(
			await screen.findByRole("combobox", { name: "Find country" }),
		).toBeTruthy();
		expect(document.querySelector(".slot-popup")).toBeTruthy();
		expect(itemSlot).toHaveBeenCalled();

		const usItem = document.querySelector('[data-country-slot="US"]');
		expect(usItem?.className).toContain("api-item");
		expect(usItem?.className).not.toContain("slot-item");
	});

	it("does not rerender the country picker while the number changes", () => {
		const renderCountryValue = vi.fn(
			(country: PhoneField.Country) => country.dialCode,
		);
		const initialValue: PhoneField.Value = {
			countryIso2: "US",
			countryDialCode: "+1",
			nationalNumber: "",
			e164: null,
			isValid: false,
		};
		function ControlledHarness() {
			const [value, setValue] = React.useState(initialValue);
			return (
				<PhoneField.Root value={value} onValueChange={setValue}>
					<PhoneField.Country renderCountryValue={renderCountryValue} />
					<PhoneField.Input aria-label="Phone number" />
				</PhoneField.Root>
			);
		}
		render(<ControlledHarness />);

		const initialRenderCount = renderCountryValue.mock.calls.length;
		fireEvent.change(screen.getByRole("textbox", { name: "Phone number" }), {
			target: { value: "2025550123" },
		});

		expect(renderCountryValue).toHaveBeenCalledTimes(initialRenderCount);
	});
});
