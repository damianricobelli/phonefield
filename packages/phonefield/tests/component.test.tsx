// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PhoneField, usePhoneField } from "../src";

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

function CountryPicker({ open }: { open?: boolean }) {
	return (
		<PhoneField.Country open={open}>
			<PhoneField.CountryTrigger aria-label="Country" />
			<PhoneField.CountryPortal>
				<PhoneField.CountryPositioner>
					<PhoneField.CountryPopup>
						<PhoneField.CountrySearch />
						<PhoneField.CountryEmpty />
						<PhoneField.CountryList />
					</PhoneField.CountryPopup>
				</PhoneField.CountryPositioner>
			</PhoneField.CountryPortal>
		</PhoneField.Country>
	);
}

function NativeCountrySelect() {
	const { country, countries, setCountry } = usePhoneField();
	return (
		<select
			aria-label="Country"
			value={country.iso2}
			onChange={(event) => setCountry(event.target.value)}
		>
			{countries.map((option) => (
				<option key={option.iso2} value={option.iso2}>
					{option.name}
				</option>
			))}
		</select>
	);
}

function ResetToCountryButton() {
	const { setCountry, setNumber } = usePhoneField();
	return (
		<button
			type="button"
			onClick={() => {
				setCountry("AR");
				setNumber("1143211234");
			}}
		>
			Use Argentina
		</button>
	);
}

function ValidityMessage() {
	const { value, state } = usePhoneField();
	return (
		<output>{`${value.countryIso2} ${state.valid ? "valid" : "invalid"}`}</output>
	);
}

function typeText(input: HTMLInputElement, text: string) {
	for (const character of text) {
		const nextValue = `${input.value}${character}`;
		input.setSelectionRange(input.value.length, input.value.length);
		fireEvent.keyDown(input, { key: character });
		fireEvent.change(input, { target: { value: nextValue } });
	}
}

function backspace(input: HTMLInputElement, count: number) {
	for (let index = 0; index < count; index++) {
		input.setSelectionRange(input.value.length, input.value.length);
		fireEvent.keyDown(input, { key: "Backspace" });
		fireEvent.change(input, {
			target: { value: input.value.slice(0, -1) },
		});
	}
}

function RejectUndoPhoneField() {
	const [value, setValue] = React.useState<PhoneField.InputValue>({
		countryIso2: "US",
		nationalNumber: "",
	});
	const [, rerender] = React.useReducer((count) => count + 1, 0);
	return (
		<>
			<button type="button" onClick={rerender}>
				Rerender
			</button>
			<PhoneField.Root
				formatOnType={false}
				value={value}
				onValueChange={(nextValue) => {
					if (nextValue.nationalNumber.length >= value.nationalNumber.length) {
						setValue(nextValue);
					}
				}}
			>
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>
		</>
	);
}

function ControlledPhoneField() {
	const [value, setValue] = React.useState<PhoneField.InputValue>({
		countryIso2: "US",
		nationalNumber: "",
	});
	return (
		<PhoneField.Root value={value} onValueChange={setValue}>
			<PhoneField.Input aria-label="Phone number" />
		</PhoneField.Root>
	);
}

function ResettablePhoneField() {
	const [value, setValue] = React.useState<PhoneField.InputValue>({
		countryIso2: "US",
		nationalNumber: "",
	});
	return (
		<>
			<button
				type="button"
				onClick={() => setValue({ countryIso2: "AR", nationalNumber: "" })}
			>
				Reset
			</button>
			<PhoneField.Root
				countries={["US", "AR"]}
				value={value}
				onValueChange={setValue}
			>
				<CountryPicker />
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>
		</>
	);
}

function ExternallyControlledPhoneField({
	onValueChange,
}: {
	onValueChange: (value: PhoneField.Value) => void;
}) {
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
				<CountryPicker open />
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>
		</>
	);
}

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

		expect(onValueChange.mock.lastCall?.[0]).toEqual({
			countryIso2: "US",
			countryDialCode: "+1",
			nationalNumber: "(415) 555-2671",
			e164: "+14155552671",
			isValid: true,
		});
	});

	it("undoes a continuous typing transaction instead of one character", () => {
		const onValueChange = vi.fn();
		render(
			<PhoneField.Root
				defaultCountry="US"
				formatOnType={false}
				onValueChange={onValueChange}
			>
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);

		const input = screen.getByRole<HTMLInputElement>("textbox", {
			name: "Phone number",
		});
		typeText(input, "12345");
		fireEvent.keyDown(input, { key: "z", ctrlKey: true });

		expect(input.value).toBe("");
		expect(onValueChange.mock.lastCall?.[0]).toEqual(
			expect.objectContaining({ nationalNumber: "" }),
		);
	});

	it("undoes consecutive deletions and selects the restored text", () => {
		render(
			<PhoneField.Root defaultCountry="US" formatOnType={false}>
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);

		const input = screen.getByRole<HTMLInputElement>("textbox", {
			name: "Phone number",
		});
		typeText(input, "12345");
		backspace(input, 2);
		expect(input.value).toBe("123");

		fireEvent.keyDown(input, { key: "z", ctrlKey: true });

		expect(input.value).toBe("12345");
		expect(input.selectionStart).toBe(3);
		expect(input.selectionEnd).toBe(5);

		fireEvent.keyDown(input, { key: "z", ctrlKey: true, shiftKey: true });
		expect(input.value).toBe("123");
		expect(input.selectionStart).toBe(3);
		expect(input.selectionEnd).toBe(3);

		fireEvent.keyDown(input, { key: "z", ctrlKey: true });
		fireEvent.keyDown(input, { key: "z", ctrlKey: true });
		expect(input.value).toBe("");
	});

	it("selects only restored digits when formatting changes during deletion", () => {
		render(
			<PhoneField.Root defaultCountry="US">
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);

		const input = screen.getByRole<HTMLInputElement>("textbox", {
			name: "Phone number",
		});
		typeText(input, "41555");
		backspace(input, 2);
		fireEvent.keyDown(input, { key: "z", ctrlKey: true });

		expect(input.value).toBe("(415) 55");
		expect(
			input.value.slice(input.selectionStart ?? 0, input.selectionEnd ?? 0),
		).toBe("55");
	});

	it("starts a new typing transaction after moving the caret", () => {
		render(
			<PhoneField.Root defaultCountry="US" formatOnType={false}>
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);

		const input = screen.getByRole<HTMLInputElement>("textbox", {
			name: "Phone number",
		});
		typeText(input, "123");
		fireEvent.keyDown(input, { key: "ArrowLeft" });
		input.setSelectionRange(2, 2);
		fireEvent.keyDown(input, { key: "4" });
		fireEvent.change(input, { target: { value: "1243" } });
		fireEvent.keyDown(input, { key: "z", ctrlKey: true });

		expect(input.value).toBe("123");
	});

	it("does not restore a stale selection when controlled undo is rejected", () => {
		render(<RejectUndoPhoneField />);
		const input = screen.getByRole<HTMLInputElement>("textbox", {
			name: "Phone number",
		});
		typeText(input, "12345");
		input.setSelectionRange(5, 5);
		fireEvent.keyDown(input, { key: "z", ctrlKey: true });
		expect(input.value).toBe("12345");

		fireEvent.click(screen.getByRole("button", { name: "Rerender" }));
		expect(input.selectionStart).toBe(5);
		expect(input.selectionEnd).toBe(5);
	});

	it("undoes and redoes an explicit country selection", async () => {
		render(
			<PhoneField.Root
				countries={["US", "AR"]}
				defaultValue={{ countryIso2: "US", nationalNumber: "123" }}
				formatOnType={false}
			>
				<CountryPicker open />
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);

		fireEvent.click(await screen.findByRole("option", { name: /Argentina/ }));
		const trigger = screen.getByRole("combobox", { name: "Country" });
		const input = screen.getByRole<HTMLInputElement>("textbox", {
			name: "Phone number",
		});
		expect(trigger.textContent).toContain("+54");

		fireEvent.keyDown(input, { key: "z", ctrlKey: true });
		expect(trigger.textContent).toContain("+1");
		expect(input.value).toBe("123");

		fireEvent.keyDown(input, { key: "z", ctrlKey: true, shiftKey: true });
		expect(trigger.textContent).toContain("+54");
	});

	it("redoes an undone edit and clears redo after a new edit", () => {
		render(
			<PhoneField.Root defaultCountry="US">
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);

		const input = screen.getByRole<HTMLInputElement>("textbox", {
			name: "Phone number",
		});
		fireEvent.change(input, { target: { value: "415" } });
		fireEvent.change(input, { target: { value: "4155" } });
		fireEvent.keyDown(input, { key: "z", metaKey: true });
		fireEvent.keyDown(input, { key: "z", metaKey: true, shiftKey: true });

		expect(input.value).toBe("(415) 5");

		fireEvent.keyDown(input, { key: "z", ctrlKey: true });
		fireEvent.keyDown(input, { key: "y", ctrlKey: true });
		expect(input.value).toBe("(415) 5");

		fireEvent.keyDown(input, { key: "z", ctrlKey: true });
		fireEvent.change(input, { target: { value: "4156" } });
		fireEvent.keyDown(input, { key: "z", metaKey: true, shiftKey: true });

		expect(input.value).toBe("(415) 6");
	});

	it("restores the country changed by an international edit", () => {
		render(
			<PhoneField.Root countries={["US", "AR"]} defaultCountry="US">
				<CountryPicker />
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);

		const input = screen.getByRole<HTMLInputElement>("textbox", {
			name: "Phone number",
		});
		fireEvent.change(input, { target: { value: "+54 9 11 4321-1234" } });
		fireEvent.keyDown(input, { key: "z", ctrlKey: true });

		expect(input.value).toBe("");
		expect(
			screen.getByRole("combobox", { name: "Country" }).textContent,
		).toContain("+1");
	});

	it("supports undo when a controlled parent accepts each value", () => {
		render(<ControlledPhoneField />);
		const input = screen.getByRole<HTMLInputElement>("textbox", {
			name: "Phone number",
		});
		fireEvent.change(input, { target: { value: "415" } });
		fireEvent.change(input, { target: { value: "4155" } });
		fireEvent.keyDown(input, { key: "z", ctrlKey: true });

		expect(input.value).toBe("(415)");
	});

	it("discards history when a controlled value rejects an edit", () => {
		const onValueChange = vi.fn();
		render(
			<PhoneField.Root value={controlledValue} onValueChange={onValueChange}>
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);

		const input = screen.getByRole<HTMLInputElement>("textbox", {
			name: "Phone number",
		});
		fireEvent.change(input, { target: { value: "415" } });
		fireEvent.keyDown(input, { key: "z", ctrlKey: true });

		expect(input.value).toBe("");
		expect(onValueChange).toHaveBeenCalledTimes(1);
	});

	it("does not undo across an external controlled reset", () => {
		render(<ResettablePhoneField />);
		const input = screen.getByRole<HTMLInputElement>("textbox", {
			name: "Phone number",
		});
		fireEvent.change(input, { target: { value: "415" } });
		fireEvent.click(screen.getByRole("button", { name: "Reset" }));
		fireEvent.keyDown(input, { key: "z", ctrlKey: true });

		expect(input.value).toBe("");
		expect(
			screen.getByRole("combobox", { name: "Country" }).textContent,
		).toContain("+54");
	});

	it("restores the recorded selection after undo", () => {
		render(
			<PhoneField.Root defaultCountry="US">
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);

		const input = screen.getByRole<HTMLInputElement>("textbox", {
			name: "Phone number",
		});
		fireEvent.change(input, { target: { value: "415" } });
		input.setSelectionRange(2, 2);
		fireEvent.select(input);
		fireEvent.change(input, { target: { value: "4155" } });
		fireEvent.keyDown(input, { key: "z", ctrlKey: true });

		expect(input.selectionStart).toBe(2);
		expect(input.selectionEnd).toBe(2);
	});

	it("prevents typing a plus sign", () => {
		const onValueChange = vi.fn();
		render(
			<PhoneField.Root defaultCountry="US" onValueChange={onValueChange}>
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);

		const input = screen.getByRole<HTMLInputElement>("textbox", {
			name: "Phone number",
		});
		const wasNotCanceled = fireEvent.keyDown(input, {
			key: "+",
			shiftKey: true,
		});
		expect(wasNotCanceled).toBe(false);
		expect(input.value).toBe("");
		expect(onValueChange).not.toHaveBeenCalled();
	});

	it("lets Backspace remove a plus sign preserved from paste", () => {
		const onPaste = vi.fn();
		render(
			<PhoneField.Root countries={["US"]} defaultCountry="US">
				<PhoneField.Input aria-label="Phone number" onPaste={onPaste} />
			</PhoneField.Root>,
		);

		const input = screen.getByRole<HTMLInputElement>("textbox", {
			name: "Phone number",
		});
		fireEvent.paste(input, {
			clipboardData: { getData: () => "+54 9 11 4321-1234" },
		});
		fireEvent.change(input, { target: { value: "+54 9 11 4321-1234" } });
		input.setSelectionRange(1, 1);

		const wasNotCanceled = fireEvent.keyDown(input, { key: "Backspace" });

		expect(onPaste).toHaveBeenCalledOnce();
		expect(wasNotCanceled).toBe(true);
		fireEvent.change(input, { target: { value: "54 9 11 4321-1234" } });
		expect(input.value.startsWith("+")).toBe(false);
	});

	it("removes the selected country calling code from an international paste", () => {
		const onValueChange = vi.fn();
		render(
			<PhoneField.Root defaultCountry="US" onValueChange={onValueChange}>
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);

		const input = screen.getByRole<HTMLInputElement>("textbox", {
			name: "Phone number",
		});
		fireEvent.change(input, { target: { value: "  +1 415 555 2671" } });

		expect(input.value).toBe("(415) 555-2671");
		expect(onValueChange.mock.lastCall?.[0]).toEqual({
			countryIso2: "US",
			countryDialCode: "+1",
			nationalNumber: "(415) 555-2671",
			e164: "+14155552671",
			isValid: true,
		});
	});

	it("selects an allowed country detected from an international paste", () => {
		const onValueChange = vi.fn();
		render(
			<PhoneField.Root
				countries={["US", "AR"]}
				defaultCountry="US"
				onValueChange={onValueChange}
			>
				<CountryPicker />
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);

		const input = screen.getByRole<HTMLInputElement>("textbox", {
			name: "Phone number",
		});
		fireEvent.change(input, { target: { value: "+54 9 11 4321-1234" } });

		expect(
			screen.getByRole("combobox", { name: "Country" }).textContent,
		).toContain("+54");
		expect(input.value).toBe("011 15-4321-1234");
		expect(onValueChange.mock.lastCall?.[0]).toEqual({
			countryIso2: "AR",
			countryDialCode: "+54",
			nationalNumber: "011 15-4321-1234",
			e164: "+5491143211234",
			isValid: true,
		});
	});

	it("does not reinterpret a disallowed international country as the selected country", () => {
		const onValueChange = vi.fn();
		render(
			<PhoneField.Root
				countries={["US"]}
				defaultCountry="US"
				onValueChange={onValueChange}
			>
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);

		const input = screen.getByRole<HTMLInputElement>("textbox", {
			name: "Phone number",
		});
		fireEvent.change(input, { target: { value: "+54 9 11 4321-1234" } });

		expect(input.value).toBe("+54 9 11 4321-1234");
		expect(onValueChange.mock.lastCall?.[0]).toEqual({
			countryIso2: "US",
			countryDialCode: "+1",
			nationalNumber: "+54 9 11 4321-1234",
			e164: null,
			isValid: false,
		});
	});

	it("detects countries that share an international calling code", () => {
		const onValueChange = vi.fn();
		render(
			<PhoneField.Root
				countries={["US", "CA"]}
				defaultCountry="US"
				onValueChange={onValueChange}
			>
				<CountryPicker />
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);

		const input = screen.getByRole<HTMLInputElement>("textbox", {
			name: "Phone number",
		});
		fireEvent.change(input, { target: { value: "+1 204 234 5678" } });

		expect(
			document.querySelector<HTMLElement>('[data-slot="phone-field"]')?.dataset
				.country,
		).toBe("CA");
		expect(input.value).toBe("(204) 234-5678");
		expect(onValueChange.mock.lastCall?.[0]).toEqual(
			expect.objectContaining({
				countryIso2: "CA",
				e164: "+12042345678",
				isValid: true,
			}),
		);
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

	it("styles and configures each country part directly", async () => {
		render(
			<PhoneField.Root countries={["US", "AR"]}>
				<PhoneField.Country open>
					<PhoneField.CountryTrigger
						aria-label="Country"
						className={(state) => (state.open ? "trigger-open" : "trigger")}
					/>
					<PhoneField.CountryPortal>
						<PhoneField.CountryPositioner side="top">
							<PhoneField.CountryPopup title="Country options">
								<PhoneField.CountrySearch placeholder="Find country" />
								<PhoneField.CountryList className="api-list">
									{(country) => (
										<PhoneField.CountryItem
											country={country}
											disabled={country.iso2 === "US"}
											className="api-item"
										>
											{country.name}
											<PhoneField.CountryItemIndicator />
										</PhoneField.CountryItem>
									)}
								</PhoneField.CountryList>
							</PhoneField.CountryPopup>
						</PhoneField.CountryPositioner>
					</PhoneField.CountryPortal>
				</PhoneField.Country>
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);

		expect(screen.getByRole("combobox", { name: "Country" }).className).toBe(
			"trigger-open",
		);
		expect(
			await screen.findByRole("combobox", { name: "Find country" }),
		).toBeTruthy();
		expect(document.querySelector('[title="Country options"]')).toBeTruthy();
		const usItem = screen.getByRole("option", { name: "United States" });
		expect(usItem.getAttribute("aria-disabled")).toBe("true");
		expect(usItem.className).toBe("api-item");
		expect(usItem.dataset.country).toBe("US");
		expect(
			usItem.querySelector('[data-slot="phone-field-country-item-indicator"]'),
		).toBeTruthy();
	});

	it("renders a complete picker with zero configuration", async () => {
		render(
			<PhoneField.Root defaultCountry="AR">
				<PhoneField.Country defaultOpen />
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);

		const trigger = screen.getByRole("combobox", { name: "Argentina (+54)" });
		expect(trigger.textContent).toContain("+54");
		expect(
			await screen.findByRole("combobox", { name: "Search country" }),
		).toBeTruthy();
		expect(
			screen.getByRole("option", { name: /United States/ }).textContent,
		).toBe("🇺🇸 United States (+1)");
	});

	it("exposes stable data slots for CSS styling", async () => {
		const { container } = render(
			<PhoneField.Root name="phone" data-slot="consumer-root">
				<CountryPicker open />
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
			name: "Search country",
		});
		expect(searchInput.dataset.slot).toBe("phone-field-country-search");
		expect(
			screen.getByRole("textbox", { name: "Phone number" }).dataset.slot,
		).toBe("phone-field-input");
		expect(
			container
				.querySelector('input[type="hidden"]')
				?.getAttribute("data-slot"),
		).toBe("phone-field-hidden-input");
		for (const slot of [
			"phone-field-country-icon",
			"phone-field-country-positioner",
			"phone-field-country-popup",
			"phone-field-country-list",
			"phone-field-country-item",
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
		render(
			<PhoneField.Root defaultCountry="US">
				<PhoneField.Country>
					<PhoneField.CountryTrigger aria-label="Country">
						<PhoneField.CountryValue>
							{renderCountryValue}
						</PhoneField.CountryValue>
					</PhoneField.CountryTrigger>
				</PhoneField.Country>
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);

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
				<CountryPicker open />
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

	it("invalidates a valid number when its detected country differs from the selection", async () => {
		const onValueChange = vi.fn();
		render(
			<PhoneField.Root
				countries={["CA", "US"]}
				defaultValue={{
					countryIso2: "CA",
					nationalNumber: "4165550199",
				}}
				onValueChange={onValueChange}
			>
				<CountryPicker open />
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);

		fireEvent.click(
			await screen.findByRole("option", { name: /United States/ }),
		);

		expect(onValueChange).toHaveBeenLastCalledWith(
			{
				countryIso2: "US",
				countryDialCode: "+1",
				nationalNumber: "(416) 555-0199",
				e164: "+14165550199",
				isValid: false,
			},
			{ reason: "country" },
		);
	});

	it("keeps externally controlled number updates when the country changes", async () => {
		const onValueChange = vi.fn();

		render(<ExternallyControlledPhoneField onValueChange={onValueChange} />);
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
				<CountryPicker open />
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
			{ reason: "country" },
		);
	});

	describe("field state", () => {
		function getRoot() {
			const root = document.querySelector<HTMLElement>(
				'[data-slot="phone-field"]',
			);
			if (!root) throw new Error("Root not rendered");
			return root;
		}

		it("mirrors value state as data attributes", () => {
			render(
				<PhoneField.Root defaultCountry="US">
					<PhoneField.Input aria-label="Phone number" />
				</PhoneField.Root>,
			);
			const root = getRoot();
			expect(root.dataset.country).toBe("US");
			expect(root.hasAttribute("data-filled")).toBe(false);
			expect(root.hasAttribute("data-dirty")).toBe(false);

			fireEvent.change(screen.getByRole("textbox", { name: "Phone number" }), {
				target: { value: "2025550123" },
			});
			expect(root.hasAttribute("data-filled")).toBe(true);
			expect(root.hasAttribute("data-valid")).toBe(true);
			expect(root.hasAttribute("data-dirty")).toBe(true);
		});

		it("becomes invalid only after focus leaves an incomplete field", async () => {
			render(
				<PhoneField.Root defaultCountry="US">
					<PhoneField.Input aria-label="Phone number" />
				</PhoneField.Root>,
			);
			const root = getRoot();
			const input = screen.getByRole("textbox", { name: "Phone number" });

			fireEvent.focus(input);
			expect(root.hasAttribute("data-focused")).toBe(true);
			fireEvent.change(input, { target: { value: "202" } });
			expect(root.hasAttribute("data-invalid")).toBe(false);
			expect(input.hasAttribute("aria-invalid")).toBe(false);

			fireEvent.blur(input);
			await vi.waitFor(() => {
				expect(root.hasAttribute("data-touched")).toBe(true);
			});
			expect(root.hasAttribute("data-focused")).toBe(false);
			expect(root.hasAttribute("data-invalid")).toBe(true);
			expect(input.getAttribute("aria-invalid")).toBe("true");
		});

		it("treats an empty required field as invalid once touched", async () => {
			render(
				<PhoneField.Root required>
					<PhoneField.Input aria-label="Phone number" />
				</PhoneField.Root>,
			);
			const input = screen.getByRole<HTMLInputElement>("textbox", {
				name: "Phone number",
			});
			expect(input.required).toBe(true);
			fireEvent.focus(input);
			fireEvent.blur(input);
			await vi.waitFor(() => {
				expect(getRoot().hasAttribute("data-invalid")).toBe(true);
			});
		});

		it("lets invalid override the computed state", () => {
			render(
				<PhoneField.Root invalid>
					<PhoneField.Input aria-label="Phone number" />
				</PhoneField.Root>,
			);
			expect(getRoot().hasAttribute("data-invalid")).toBe(true);
			expect(
				screen
					.getByRole("textbox", { name: "Phone number" })
					.getAttribute("aria-invalid"),
			).toBe("true");
		});

		it("passes state to className and supports a render prop", () => {
			render(
				<PhoneField.Root
					defaultValue={{ countryIso2: "US", nationalNumber: "2025550123" }}
					className={(state) => (state.valid ? "is-valid" : "is-pending")}
					render={<section />}
				>
					<PhoneField.Input aria-label="Phone number" />
				</PhoneField.Root>,
			);
			const root = getRoot();
			expect(root.tagName).toBe("SECTION");
			expect(root.className).toBe("is-valid");
		});

		it("disables every part and leaves the value out of FormData", () => {
			const { container } = render(
				<PhoneField.Root disabled name="phone">
					<CountryPicker />
					<PhoneField.Input aria-label="Phone number" />
				</PhoneField.Root>,
			);
			expect(
				screen.getByRole<HTMLInputElement>("textbox", { name: "Phone number" })
					.disabled,
			).toBe(true);
			expect(
				screen
					.getByRole("combobox", { name: "Country" })
					.hasAttribute("data-disabled"),
			).toBe(true);
			expect(
				container.querySelector<HTMLInputElement>('input[type="hidden"]')
					?.disabled,
			).toBe(true);
			expect(getRoot().hasAttribute("data-disabled")).toBe(true);
		});
	});

	describe("max length", () => {
		it("rejects digits beyond the longest number for the country", () => {
			const onValueChange = vi.fn();
			render(
				<PhoneField.Root defaultCountry="US" onValueChange={onValueChange}>
					<PhoneField.Input aria-label="Phone number" />
				</PhoneField.Root>,
			);
			const input = screen.getByRole<HTMLInputElement>("textbox", {
				name: "Phone number",
			});
			fireEvent.change(input, { target: { value: "2025550123" } });
			fireEvent.change(input, { target: { value: "(202) 555-01234" } });

			expect(input.value).toBe("(202) 555-0123");
			expect(onValueChange).toHaveBeenCalledTimes(1);
		});

		it("still allows deleting digits from a number that is already too long", () => {
			render(
				<PhoneField.Root
					defaultValue={{ countryIso2: "US", nationalNumber: "202555012345" }}
				>
					<PhoneField.Input aria-label="Phone number" />
				</PhoneField.Root>,
			);
			const input = screen.getByRole<HTMLInputElement>("textbox", {
				name: "Phone number",
			});
			backspace(input, 1);
			expect(input.value.replace(/\D/g, "")).toBe("20255501234");
		});

		it("can be turned off", () => {
			render(
				<PhoneField.Root defaultCountry="US" limitMaxLength={false}>
					<PhoneField.Input aria-label="Phone number" />
				</PhoneField.Root>,
			);
			const input = screen.getByRole<HTMLInputElement>("textbox", {
				name: "Phone number",
			});
			fireEvent.change(input, { target: { value: "202555012345" } });
			expect(input.value.replace(/\D/g, "")).toBe("202555012345");
		});
	});

	it("pins preferred countries to the top without repeating them", async () => {
		render(
			<PhoneField.Root
				countries={["AR", "BR", "US", "UY"]}
				preferredCountries={["US", "UY"]}
			>
				<CountryPicker open />
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);

		await screen.findByRole("option", { name: /Argentina/ });
		const groups = document.querySelectorAll<HTMLElement>(
			'[data-slot="phone-field-country-group"]',
		);
		expect(groups).toHaveLength(2);
		expect(groups[0]?.hasAttribute("data-preferred")).toBe(true);
		const names = (group: HTMLElement | undefined) =>
			Array.from(group?.querySelectorAll('[role="option"]') ?? []).map(
				(option) => (option as HTMLElement).dataset.country,
			);
		expect(names(groups[0])).toEqual(["US", "UY"]);
		expect(names(groups[1])).toEqual(["AR", "BR"]);
	});

	it("derives the placeholder from the selected country", () => {
		render(
			<PhoneField.Root defaultCountry="AR">
				<PhoneField.Input
					aria-label="Phone number"
					placeholder={(country) => `${country.name} number`}
				/>
			</PhoneField.Root>,
		);
		expect(
			screen
				.getByRole("textbox", { name: "Phone number" })
				.getAttribute("placeholder"),
		).toBe("Argentina number");
	});

	it("reports why the value changed", async () => {
		const onValueChange = vi.fn();
		render(
			<PhoneField.Root countries={["US", "AR"]} onValueChange={onValueChange}>
				<CountryPicker open />
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);
		const input = screen.getByRole<HTMLInputElement>("textbox", {
			name: "Phone number",
		});

		fireEvent.change(input, { target: { value: "202" } });
		expect(onValueChange.mock.lastCall?.[1]).toEqual({ reason: "input" });
		fireEvent.click(await screen.findByRole("option", { name: /Argentina/ }));
		expect(onValueChange.mock.lastCall?.[1]).toEqual({ reason: "country" });
		fireEvent.keyDown(input, { key: "z", ctrlKey: true });
		expect(onValueChange.mock.lastCall?.[1]).toEqual({ reason: "undo" });
	});

	it("lets custom parts read and drive the field with usePhoneField", () => {
		render(
			<PhoneField.Root countries={["US", "AR"]}>
				<NativeCountrySelect />
				<PhoneField.Input aria-label="Phone number" />
				<ValidityMessage />
			</PhoneField.Root>,
		);

		fireEvent.change(screen.getByRole("combobox", { name: "Country" }), {
			target: { value: "AR" },
		});
		fireEvent.change(screen.getByRole("textbox", { name: "Phone number" }), {
			target: { value: "1143211234" },
		});

		expect(screen.getByRole("status").textContent).toBe("AR valid");
	});

	it("composes back-to-back hook updates in one event", () => {
		render(
			<PhoneField.Root countries={["US", "AR"]}>
				<ResetToCountryButton />
				<PhoneField.Input aria-label="Phone number" />
				<ValidityMessage />
			</PhoneField.Root>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Use Argentina" }));
		expect(screen.getByRole("status").textContent).toBe("AR valid");
	});

	it("explains misplaced parts", () => {
		vi.spyOn(console, "error").mockImplementation(() => undefined);
		expect(() => render(<PhoneField.CountryList />)).toThrow(
			"PhoneField.CountryList must be used inside <PhoneField.Root>.",
		);
		expect(() => render(<ValidityMessage />)).toThrow(
			"usePhoneField() must be used inside <PhoneField.Root>.",
		);
	});

	describe("field parts", () => {
		it("wires Label, Description, and Error to the input", async () => {
			render(
				<PhoneField.Root defaultCountry="US">
					<PhoneField.Label>Mobile</PhoneField.Label>
					<PhoneField.Group>
						<PhoneField.Input />
					</PhoneField.Group>
					<PhoneField.Description>We text a code.</PhoneField.Description>
					<PhoneField.Error />
				</PhoneField.Root>,
			);
			const input = screen.getByRole<HTMLInputElement>("textbox", {
				name: "Mobile",
			});
			const description = screen.getByText("We text a code.");
			expect(input.getAttribute("aria-describedby")).toBe(description.id);
			expect(
				document.querySelector('[data-slot="phone-field-error"]'),
			).toBeNull();

			fireEvent.focus(input);
			fireEvent.change(input, { target: { value: "202" } });
			fireEvent.blur(input);
			const error = await screen.findByText("Enter a valid phone number.");
			expect(input.getAttribute("aria-describedby")).toBe(
				`${description.id} ${error.id}`,
			);
			const group = document.querySelector<HTMLElement>(
				'[data-slot="phone-field-group"]',
			);
			expect(group?.hasAttribute("data-invalid")).toBe(true);
			expect(group?.getAttribute("role")).toBe("group");
		});

		it("follows a custom input id and picks messages from state", async () => {
			render(
				<PhoneField.Root required>
					<PhoneField.Label>Phone</PhoneField.Label>
					<PhoneField.Input id="custom-phone" />
					<PhoneField.Error>
						{(state) => (state.filled ? "Invalid" : "Required")}
					</PhoneField.Error>
				</PhoneField.Root>,
			);
			const input = screen.getByLabelText("Phone");
			expect(input.id).toBe("custom-phone");
			fireEvent.focus(input);
			fireEvent.blur(input);
			expect(await screen.findByText("Required")).toBeTruthy();
		});
	});

	describe("form integration", () => {
		it("reveals errors when the form is submitted untouched", async () => {
			render(
				<form noValidate onSubmit={(event) => event.preventDefault()}>
					<PhoneField.Root required name="phone">
						<PhoneField.Input aria-label="Phone number" />
						<PhoneField.Error />
					</PhoneField.Root>
					<button type="submit">Send</button>
				</form>,
			);
			expect(screen.queryByText("Enter a phone number.")).toBeNull();
			fireEvent.click(screen.getByRole("button", { name: "Send" }));
			expect(await screen.findByText("Enter a phone number.")).toBeTruthy();
		});

		it("restores the initial value on form reset", async () => {
			const { container } = render(
				<form>
					<PhoneField.Root
						name="phone"
						defaultValue={{ countryIso2: "US", nationalNumber: "2025550123" }}
					>
						<PhoneField.Input aria-label="Phone number" />
					</PhoneField.Root>
				</form>,
			);
			const input = screen.getByRole<HTMLInputElement>("textbox", {
				name: "Phone number",
			});
			fireEvent.change(input, { target: { value: "415" } });
			expect(input.value).toBe("(415)");
			fireEvent.reset(container.querySelector("form") as HTMLFormElement);
			await vi.waitFor(() => {
				expect(input.value).toBe("(202) 555-0123");
			});
		});
	});

	it("keeps automatic validation when invalid is false", async () => {
		render(
			<PhoneField.Root invalid={false} defaultCountry="US">
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);
		const input = screen.getByRole("textbox", { name: "Phone number" });
		fireEvent.focus(input);
		fireEvent.change(input, { target: { value: "202" } });
		fireEvent.blur(input);
		await vi.waitFor(() => {
			expect(input.getAttribute("aria-invalid")).toBe("true");
		});
	});

	it("translates the default picker copy with labels", async () => {
		render(
			<PhoneField.Root lang="es">
				<PhoneField.Country
					defaultOpen
					labels={{ search: "Buscar país", empty: "Sin resultados" }}
				/>
				<PhoneField.Input aria-label="Teléfono" />
			</PhoneField.Root>,
		);
		const search = await screen.findByRole("combobox", { name: "Buscar país" });
		fireEvent.change(search, { target: { value: "zzz" } });
		expect(await screen.findByText("Sin resultados")).toBeTruthy();
	});

	it("keeps a label associated through the trigger id", () => {
		render(
			<PhoneField.Root>
				<label htmlFor="country">Country</label>
				<PhoneField.Country>
					<PhoneField.CountryTrigger id="country" />
				</PhoneField.Country>
			</PhoneField.Root>,
		);
		expect(screen.getByRole("combobox", { name: "Country" })).toBeTruthy();
	});

	it.each([
		["uncontrolled", undefined, controlledValue],
		["controlled", controlledValue, undefined],
	] as const)(
		"warns when changing from %s to the other control mode",
		(_mode, initialValue, nextValue) => {
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
		},
	);
});
