// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PhoneField } from "../src";

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});

const controlledValue: PhoneField.Value = {
	countryIso2: "US",
	countryDialCode: "+1",
	nationalNumber: "",
	e164: null,
	isValid: false,
};

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

	it("accepts source-only controlled values and emits rebuilt derived fields", () => {
		const onValueChange = vi.fn();
		const value: PhoneField.InputValue = {
			countryIso2: "US",
			nationalNumber: "2025550123",
		};
		render(
			<PhoneField.Root value={value} onValueChange={onValueChange}>
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);

		fireEvent.change(screen.getByRole("textbox", { name: "Phone number" }), {
			target: { value: "4155552671" },
		});

		expect(onValueChange).toHaveBeenLastCalledWith({
			countryIso2: "US",
			countryDialCode: "+1",
			nationalNumber: "(415) 555-2671",
			e164: "+14155552671",
			isValid: true,
		});
	});

	it("treats defaultValue as mount-only initialization", () => {
		const { rerender } = render(
			<PhoneField.Root
				defaultValue={{ countryIso2: "US", nationalNumber: "2025550123" }}
			>
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);

		rerender(
			<PhoneField.Root
				defaultValue={{ countryIso2: "AR", nationalNumber: "1143211234" }}
			>
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);

		expect(
			screen
				.getByRole<HTMLInputElement>("textbox", { name: "Phone number" })
				.value.replace(/\D/g, ""),
		).toBe("2025550123");
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

	it("runs cleanup functions returned by input callback refs", () => {
		const cleanupRef = vi.fn();
		const inputRef = vi.fn((_node: HTMLInputElement | null) => cleanupRef);
		const { unmount } = render(
			<PhoneField.Root>
				<PhoneField.Input ref={inputRef} aria-label="Phone number" />
			</PhoneField.Root>,
		);

		expect(inputRef).toHaveBeenCalledTimes(1);
		unmount();

		expect(cleanupRef).toHaveBeenCalledTimes(1);
		expect(inputRef).toHaveBeenCalledTimes(1);
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

	it("keeps styling in classNames while forwarding behavioral slot props", async () => {
		const itemSlot = vi.fn((country: PhoneField.Country) => ({
			disabled: country.iso2 === "US",
		}));

		render(
			<PhoneField.Root>
				<PhoneField.Country
					classNames={{ trigger: "api-trigger", item: "api-item" }}
					slotProps={{
						root: { open: true },
						trigger: {
							"aria-label": "Country",
						},
						popup: { title: "Country options" },
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
		expect(document.querySelector('[title="Country options"]')).toBeTruthy();
		expect(itemSlot).toHaveBeenCalled();

		const usItem = screen.getByRole("option", { name: /United States/ });
		expect(usItem.getAttribute("aria-disabled")).toBe("true");
		expect(usItem?.className).toContain("api-item");
	});

	it("exposes stable data slots for CSS styling", async () => {
		const { container } = render(
			<PhoneField.Root name="phone" data-slot="consumer-root">
				<PhoneField.Country
					slotProps={{
						root: { open: true },
						trigger: {
							"aria-label": "Country",
						},
						searchInput: { "aria-label": "Find country" },
					}}
				/>
				<PhoneField.Input
					aria-label="Phone number"
					data-slot="consumer-input"
				/>
			</PhoneField.Root>,
		);

		expect(container.querySelector('[data-slot="phone-field"]')).toBeTruthy();
		expect(screen.getByRole("combobox", { name: "Country" }).dataset.slot).toBe(
			"phone-field-country-trigger",
		);
		const searchInput = await screen.findByRole("combobox", {
			name: "Find country",
		});
		expect(searchInput.dataset.slot).toBe("phone-field-country-search-input");
		expect(
			screen.getByRole("textbox", { name: "Phone number" }).dataset.slot,
		).toBe("phone-field-input");
		expect(
			container
				.querySelector('input[type="hidden"]')
				?.getAttribute("data-slot"),
		).toBe("phone-field-hidden-input");
		expect(
			document.querySelectorAll('[data-slot="phone-field-country-item"]')
				.length,
		).toBeGreaterThan(0);

		for (const slot of [
			"phone-field-country-icon",
			"phone-field-country-positioner",
			"phone-field-country-popup",
			"phone-field-country-search-container",
			"phone-field-country-list",
		]) {
			expect(
				document.querySelector(`[data-slot="${slot}"]`),
				`Expected ${slot} to be rendered`,
			).toBeTruthy();
		}

		fireEvent.change(searchInput, { target: { value: "not-a-country" } });
		expect(
			(await screen.findByText("No countries found")).getAttribute("data-slot"),
		).toBe("phone-field-country-empty");
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

	it("keeps the latest typed number when the country changes", async () => {
		const onValueChange = vi.fn();
		render(
			<PhoneField.Root
				countries={["US", "AR"]}
				defaultCountry="US"
				onValueChange={onValueChange}
			>
				<PhoneField.Country
					slotProps={{
						root: { open: true },
						trigger: { "aria-label": "Country" },
					}}
				/>
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);

		fireEvent.change(screen.getByRole("textbox", { name: "Phone number" }), {
			target: { value: "2025550123" },
		});
		fireEvent.click(await screen.findByRole("option", { name: /Argentina/ }));

		const latestValue = onValueChange.mock.lastCall?.[0] as
			| PhoneField.Value
			| undefined;
		expect(latestValue?.countryIso2).toBe("AR");
		expect(latestValue?.nationalNumber.replace(/\D/g, "")).toBe("2025550123");
	});

	it("keeps externally controlled number updates when the country changes", async () => {
		const onValueChange = vi.fn();

		function ControlledHarness() {
			const [value, setValue] = React.useState<PhoneField.InputValue>({
				countryIso2: "US",
				nationalNumber: "",
			});

			return (
				<>
					<button
						type="button"
						onClick={() =>
							setValue({
								countryIso2: "US",
								nationalNumber: "2025550123",
							})
						}
					>
						Set phone externally
					</button>
					<PhoneField.Root
						countries={["US", "AR"]}
						value={value}
						onValueChange={(nextValue) => {
							onValueChange(nextValue);
							setValue(nextValue);
						}}
					>
						<PhoneField.Country
							slotProps={{
								root: { open: true },
								trigger: { "aria-label": "Country" },
							}}
						/>
						<PhoneField.Input aria-label="Phone number" />
					</PhoneField.Root>
				</>
			);
		}

		render(<ControlledHarness />);
		fireEvent.click(
			screen.getByRole("button", { name: "Set phone externally" }),
		);
		fireEvent.click(await screen.findByRole("option", { name: /Argentina/ }));

		const latestValue = onValueChange.mock.lastCall?.[0] as
			| PhoneField.Value
			| undefined;
		expect(latestValue?.countryIso2).toBe("AR");
		expect(latestValue?.nationalNumber.replace(/\D/g, "")).toBe("2025550123");
	});

	it("does not retain number updates rejected by a controlled parent", async () => {
		const onValueChange = vi.fn();
		render(
			<PhoneField.Root
				countries={["US", "AR"]}
				value={{ countryIso2: "US", nationalNumber: "" }}
				onValueChange={onValueChange}
			>
				<PhoneField.Country
					slotProps={{
						root: { open: true },
						trigger: { "aria-label": "Country" },
					}}
				/>
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);

		fireEvent.change(screen.getByRole("textbox", { name: "Phone number" }), {
			target: { value: "2025550123" },
		});
		fireEvent.click(await screen.findByRole("option", { name: /Argentina/ }));

		expect(onValueChange).toHaveBeenLastCalledWith(
			expect.objectContaining({
				countryIso2: "AR",
				nationalNumber: "",
			}),
		);
	});

	it.each([
		["uncontrolled", undefined, controlledValue],
		["controlled", controlledValue, undefined],
	] as const)("warns when changing from %s to the other control mode", (_mode, initialValue, nextValue) => {
		const consoleError = vi
			.spyOn(console, "error")
			.mockImplementation(() => undefined);
		const { rerender } = render(
			<PhoneField.Root value={initialValue}>
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);

		rerender(
			<PhoneField.Root value={nextValue}>
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);

		expect(consoleError).toHaveBeenCalledWith(
			expect.stringContaining(
				"PhoneField.Root cannot switch between controlled and uncontrolled",
			),
		);
	});
});
