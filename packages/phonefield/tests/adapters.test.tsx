// @vitest-environment jsdom

import {
	act,
	cleanup,
	fireEvent,
	render,
	screen,
} from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as BaseUI from "../src/base-ui/index.js";
import { PhoneFieldStateContext } from "../src/core/context.js";
import * as Radix from "../src/radix/index.js";
import * as ReactAria from "../src/react-aria/index.js";

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});

type AnyPhoneField = typeof BaseUI.PhoneField;

type Adapter = {
	name: string;
	PhoneField: AnyPhoneField;
	/** Every Country part, composed explicitly. */
	ComposedCountry: () => React.ReactElement;
	triggerRole: "combobox" | "button";
	searchRole: "combobox" | "searchbox";
};

const adapters: Adapter[] = [
	{
		name: "base-ui",
		PhoneField: BaseUI.PhoneField,
		triggerRole: "combobox",
		searchRole: "combobox",
		ComposedCountry: () => {
			const P = BaseUI.PhoneField;
			return (
				<P.Country>
					<P.CountryTrigger>
						<P.CountryValue />
						<P.CountryIcon />
					</P.CountryTrigger>
					<P.CountryPortal>
						<P.CountryPositioner>
							<P.CountryPopup>
								<P.CountrySearch />
								<P.CountryEmpty />
								<P.CountryList>
									{(country) => (
										<P.CountryItem country={country}>
											{country.name}
											<P.CountryItemIndicator />
										</P.CountryItem>
									)}
								</P.CountryList>
							</P.CountryPopup>
						</P.CountryPositioner>
					</P.CountryPortal>
				</P.Country>
			);
		},
	},
	{
		name: "radix",
		PhoneField: Radix.PhoneField as unknown as AnyPhoneField,
		triggerRole: "combobox",
		searchRole: "combobox",
		ComposedCountry: () => {
			const P = Radix.PhoneField;
			return (
				<P.Country>
					<P.CountryTrigger>
						<P.CountryValue />
						<P.CountryIcon />
					</P.CountryTrigger>
					<P.CountryPortal>
						<P.CountryContent>
							<P.CountrySearch />
							<P.CountryEmpty />
							<P.CountryList>
								{(country) => (
									<P.CountryItem country={country}>
										{country.name}
										<P.CountryItemIndicator />
									</P.CountryItem>
								)}
							</P.CountryList>
						</P.CountryContent>
					</P.CountryPortal>
				</P.Country>
			);
		},
	},
	{
		name: "react-aria",
		PhoneField: ReactAria.PhoneField as unknown as AnyPhoneField,
		triggerRole: "button",
		searchRole: "searchbox",
		ComposedCountry: () => {
			const P = ReactAria.PhoneField;
			return (
				<P.Country>
					<P.CountryTrigger>
						<P.CountryValue />
						<P.CountryIcon />
					</P.CountryTrigger>
					<P.CountryPopover>
						<P.CountrySearch />
						<P.CountryList>
							{(country) => (
								<P.CountryItem country={country}>
									{country.name}
									<P.CountryItemIndicator />
								</P.CountryItem>
							)}
						</P.CountryList>
					</P.CountryPopover>
				</P.Country>
			);
		},
	},
];

// Every adapter exports the same hook, so custom parts work with any of them.
const usePhoneField = BaseUI.usePhoneField;

function UseArgentina() {
	const { setCountry, setNumber, state } = usePhoneField();
	return (
		<button
			type="button"
			onClick={() => {
				setCountry("AR");
				setNumber("1143211234");
			}}
		>
			{state.valid ? "valid" : "invalid"}
		</button>
	);
}

async function flush() {
	await act(async () => {
		await new Promise((resolve) => setTimeout(resolve, 20));
	});
}

describe.each(adapters)("$name adapter", (adapter) => {
	const { PhoneField, ComposedCountry, triggerRole, searchRole } = adapter;

	async function openPicker(name: string | RegExp) {
		const trigger = screen.getByRole(triggerRole, { name });
		fireEvent.click(trigger);
		await flush();
		return screen.findByRole(searchRole, { name: "Search country" });
	}

	it("renders a complete picker with zero configuration", async () => {
		render(
			<PhoneField.Root defaultCountry="AR">
				<PhoneField.Country />
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);
		const trigger = screen.getByRole(triggerRole, { name: "Argentina (+54)" });
		expect(trigger.textContent).toContain("🇦🇷 +54");
		expect(trigger.dataset.slot).toBe("phone-field-country-trigger");

		const search = await openPicker("Argentina (+54)");
		expect(search.getAttribute("placeholder")).toBe("Search country");
		expect(
			screen.getByRole("option", { name: /United States/ }).textContent,
		).toBe("🇺🇸 United States (+1)");
		const selected = screen.getByRole("option", { name: /Argentina/ });
		expect(selected.getAttribute("aria-selected")).toBe("true");
	});

	it("moves focus to the search box on open and back to the trigger on Escape", async () => {
		render(
			<PhoneField.Root defaultCountry="AR" countries={["AR", "US"]}>
				<PhoneField.Country />
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);
		const search = await openPicker("Argentina (+54)");
		await vi.waitFor(() => expect(document.activeElement).toBe(search));

		fireEvent.keyDown(search, { key: "Escape" });
		await flush();
		expect(screen.queryByRole("listbox")).toBeNull();
		await vi.waitFor(() =>
			expect(document.activeElement).toBe(
				screen.getByRole(triggerRole, { name: "Argentina (+54)" }),
			),
		);
	});

	it("selects a country with the pointer and keeps the typed number", async () => {
		const onValueChange = vi.fn();
		render(
			<PhoneField.Root
				countries={["US", "AR"]}
				defaultCountry="US"
				onValueChange={onValueChange}
			>
				<PhoneField.Country />
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);
		fireEvent.change(screen.getByRole("textbox", { name: "Phone number" }), {
			target: { value: "2025550123" },
		});
		await openPicker("United States (+1)");
		fireEvent.click(screen.getByRole("option", { name: /Argentina/ }));
		await flush();

		const [value, details] = onValueChange.mock.lastCall ?? [];
		expect(value?.countryIso2).toBe("AR");
		expect(value?.nationalNumber.replace(/\D/g, "")).toBe("2025550123");
		expect(details).toEqual({ reason: "country" });
		expect(screen.queryByRole("listbox")).toBeNull();
		expect(
			screen.getByRole(triggerRole, { name: "Argentina (+54)" }),
		).toBeTruthy();
	});

	it("filters by name, ISO2 code, and dial code, ignoring accents", async () => {
		render(
			<PhoneField.Root lang="es" countries={["PE", "AR", "US"]}>
				<PhoneField.Country />
				<PhoneField.Input aria-label="Teléfono" />
			</PhoneField.Root>,
		);
		const search = await openPicker(/Estados Unidos/);
		const visible = () =>
			screen
				.queryAllByRole("option")
				.map((option) => option.dataset.country)
				.filter(Boolean);

		fireEvent.change(search, { target: { value: "peru" } });
		await flush();
		expect(visible()).toEqual(["PE"]);
		fireEvent.change(search, { target: { value: "ar" } });
		await flush();
		expect(visible()).toEqual(["AR"]);
		fireEvent.change(search, { target: { value: "+1" } });
		await flush();
		expect(visible()).toEqual(["US"]);
	});

	it("shows translated empty copy when nothing matches", async () => {
		render(
			<PhoneField.Root>
				<PhoneField.Country
					labels={{ search: "Buscar país", empty: "Sin resultados" }}
				/>
				<PhoneField.Input aria-label="Teléfono" />
			</PhoneField.Root>,
		);
		fireEvent.click(screen.getByRole(triggerRole, { name: /United States/ }));
		await flush();
		const search = await screen.findByRole(searchRole, { name: "Buscar país" });
		fireEvent.change(search, { target: { value: "zzz" } });
		await flush();
		const empty = await screen.findByText("Sin resultados");
		expect(
			empty.closest('[data-slot="phone-field-country-empty"]'),
		).toBeTruthy();
	});

	it("selects the first match with the keyboard", async () => {
		const onValueChange = vi.fn();
		render(
			<PhoneField.Root
				countries={["US", "AR", "UY"]}
				defaultCountry="US"
				onValueChange={onValueChange}
			>
				<PhoneField.Country />
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);
		const search = await openPicker("United States (+1)");
		fireEvent.change(search, { target: { value: "urug" } });
		await flush();
		const option = screen.getByRole("option", { name: /Uruguay/ });
		expect(search.getAttribute("aria-activedescendant")).toBe(option.id);
		fireEvent.keyDown(search, { key: "Enter" });
		await flush();
		expect(onValueChange).toHaveBeenLastCalledWith(
			expect.objectContaining({ countryIso2: "UY" }),
			{ reason: "country" },
		);
	});

	it("moves the highlight with the arrow keys", async () => {
		render(
			<PhoneField.Root countries={["AR", "UY", "US"]} defaultCountry="AR">
				<PhoneField.Country />
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);
		const search = await openPicker("Argentina (+54)");
		const options = screen.getAllByRole("option");
		const activeOption = () =>
			document.getElementById(
				search.getAttribute("aria-activedescendant") ?? "",
			);

		await vi.waitFor(() => expect(activeOption()).toBe(options[0]));
		fireEvent.keyDown(search, { key: "ArrowDown" });
		await flush();
		expect(activeOption()).toBe(options[1]);
		fireEvent.keyDown(search, { key: "ArrowUp" });
		await flush();
		expect(activeOption()).toBe(options[0]);
	});

	it("pins preferred countries to the top without repeating them", async () => {
		render(
			<PhoneField.Root
				countries={["AR", "BR", "US", "UY"]}
				preferredCountries={["US", "UY"]}
			>
				<PhoneField.Country />
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);
		await openPicker("United States (+1)");
		const groups = document.querySelectorAll<HTMLElement>(
			'[data-slot="phone-field-country-group"]',
		);
		expect(groups).toHaveLength(2);
		expect(groups[0]?.hasAttribute("data-preferred")).toBe(true);
		const codes = (group: HTMLElement | undefined) =>
			Array.from(group?.querySelectorAll('[role="option"]') ?? []).map(
				(option) => (option as HTMLElement).dataset.country,
			);
		expect(codes(groups[0])).toEqual(["US", "UY"]);
		expect(codes(groups[1])).toEqual(["AR", "BR"]);
	});

	it("renders every composed part with stable data slots", async () => {
		const { container } = render(
			<PhoneField.Root name="phone" countries={["US", "AR"]}>
				<PhoneField.Group>
					<ComposedCountry />
					<PhoneField.Input aria-label="Phone number" />
				</PhoneField.Group>
			</PhoneField.Root>,
		);
		expect(container.querySelector('[data-slot="phone-field"]')).toBeTruthy();
		expect(
			container
				.querySelector('[data-slot="phone-field-group"]')
				?.getAttribute("role"),
		).toBe("group");
		expect(
			container.querySelector('[data-slot="phone-field-hidden-input"]'),
		).toBeTruthy();
		await openPicker("United States (+1)");
		for (const slot of [
			"phone-field-input",
			"phone-field-country-trigger",
			"phone-field-country-icon",
			"phone-field-country-search",
			"phone-field-country-list",
			"phone-field-country-item",
		]) {
			expect(
				document.querySelector(`[data-slot="${slot}"]`),
				`Expected ${slot} to be rendered`,
			).toBeTruthy();
		}
		const selected = screen.getByRole("option", { name: /United States/ });
		expect(selected.textContent).toBe("United States");
		expect(
			selected.querySelector(
				'[data-slot="phone-field-country-item-indicator"]',
			),
		).toBeTruthy();
		const other = screen.getByRole("option", { name: /Argentina/ });
		expect(
			other.querySelector('[data-slot="phone-field-country-item-indicator"]'),
		).toBeNull();
	});

	it("selects by typing on the closed trigger", async () => {
		const onValueChange = vi.fn();
		render(
			<PhoneField.Root
				countries={["AR", "UY", "US"]}
				defaultCountry="AR"
				onValueChange={onValueChange}
			>
				<PhoneField.Country />
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);
		// Base UI registers items for typeahead the first time the popup opens.
		const search = await openPicker("Argentina (+54)");
		fireEvent.keyDown(search, { key: "Escape" });
		await flush();

		const trigger = screen.getByRole(triggerRole, { name: "Argentina (+54)" });
		act(() => trigger.focus());
		fireEvent.keyDown(trigger, { key: "u" });
		await flush();
		expect(onValueChange.mock.lastCall?.[0]?.countryIso2).toBe("UY");
		expect(screen.queryByRole("listbox")).toBeNull();
	});

	it("keeps the selection when the field is read-only", async () => {
		const onValueChange = vi.fn();
		render(
			<PhoneField.Root
				readOnly
				countries={["US", "AR"]}
				onValueChange={onValueChange}
			>
				<PhoneField.Country />
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);
		await openPicker("United States (+1)");
		fireEvent.click(screen.getByRole("option", { name: /Argentina/ }));
		await flush();
		expect(onValueChange).not.toHaveBeenCalled();
		expect(
			(
				screen.getByRole("textbox", {
					name: "Phone number",
				}) as HTMLInputElement
			).readOnly,
		).toBe(true);
	});

	it("disables the trigger, input, and serialized value", () => {
		render(
			<PhoneField.Root disabled name="phone">
				<PhoneField.Country />
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);
		const trigger = screen.getByRole(triggerRole, { name: /United States/ });
		expect((trigger as HTMLButtonElement).disabled).toBe(true);
		expect(
			(
				screen.getByRole("textbox", {
					name: "Phone number",
				}) as HTMLInputElement
			).disabled,
		).toBe(true);
		expect(
			(
				document.querySelector(
					'[data-slot="phone-field-hidden-input"]',
				) as HTMLInputElement
			).disabled,
		).toBe(true);
		const root = document.querySelector<HTMLElement>(
			'[data-slot="phone-field"]',
		);
		expect(root?.hasAttribute("data-disabled")).toBe(true);
	});

	it("formats, serializes, and validates like every other adapter", async () => {
		render(
			<form data-testid="form" onSubmit={(event) => event.preventDefault()}>
				<PhoneField.Root name="phone" defaultCountry="US" required>
					<PhoneField.Label>Mobile</PhoneField.Label>
					<PhoneField.Group>
						<PhoneField.Country />
						<PhoneField.Input />
					</PhoneField.Group>
					<PhoneField.Description>We text a code.</PhoneField.Description>
					<PhoneField.Error />
				</PhoneField.Root>
			</form>,
		);
		const input = screen.getByRole<HTMLInputElement>("textbox", {
			name: "Mobile",
		});
		const description = screen.getByText("We text a code.");
		expect(input.getAttribute("aria-describedby")).toBe(description.id);

		fireEvent.focus(input);
		fireEvent.change(input, { target: { value: "202" } });
		fireEvent.blur(input);
		const error = await screen.findByText("Enter a valid phone number.");
		expect(input.getAttribute("aria-invalid")).toBe("true");
		expect(input.getAttribute("aria-describedby")).toBe(
			`${description.id} ${error.id}`,
		);
		const group = document.querySelector<HTMLElement>(
			'[data-slot="phone-field-group"]',
		);
		expect(group?.hasAttribute("data-invalid")).toBe(true);

		fireEvent.change(input, { target: { value: "2025550123" } });
		expect(input.value).toBe("(202) 555-0123");
		const formData = new FormData(
			screen.getByTestId("form") as HTMLFormElement,
		);
		expect(JSON.parse(String(formData.get("phone")))).toEqual({
			countryIso2: "US",
			nationalNumber: "(202) 555-0123",
		});
		await vi.waitFor(() =>
			expect(screen.queryByText("Enter a valid phone number.")).toBeNull(),
		);
	});

	it("undoes typing and country changes in one history", async () => {
		const onValueChange = vi.fn();
		render(
			<PhoneField.Root countries={["US", "AR"]} onValueChange={onValueChange}>
				<PhoneField.Country />
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);
		const input = screen.getByRole("textbox", { name: "Phone number" });
		fireEvent.change(input, { target: { value: "202" } });
		await openPicker("United States (+1)");
		fireEvent.click(screen.getByRole("option", { name: /Argentina/ }));
		await flush();
		fireEvent.keyDown(input, { key: "z", ctrlKey: true });
		expect(onValueChange).toHaveBeenLastCalledWith(
			expect.objectContaining({ countryIso2: "US" }),
			{ reason: "undo" },
		);
	});

	it("lets usePhoneField drive the field from a custom part", () => {
		render(
			<PhoneField.Root countries={["US", "AR"]}>
				<UseArgentina />
				<PhoneField.Input aria-label="Phone number" />
			</PhoneField.Root>,
		);
		fireEvent.click(screen.getByRole("button", { name: "invalid" }));
		expect(screen.getByRole("button", { name: "valid" })).toBeTruthy();
	});
});

let fieldPartRenders = 0;

/** Reads only the field state, like Label, Group, Description, and Error. */
function FieldPart() {
	React.use(PhoneFieldStateContext);
	fieldPartRenders++;
	return null;
}

describe("render performance", () => {
	it("keeps field parts still while typing", () => {
		fieldPartRenders = 0;
		render(
			<BaseUI.PhoneField.Root defaultCountry="US">
				<FieldPart />
				<BaseUI.PhoneField.Input aria-label="Phone number" />
			</BaseUI.PhoneField.Root>,
		);
		const input = screen.getByRole("textbox", { name: "Phone number" });
		// The first digit flips `filled` and `dirty`; later digits change nothing parts show.
		fireEvent.change(input, { target: { value: "2" } });
		const afterFirstDigit = fieldPartRenders;
		fireEvent.change(input, { target: { value: "20" } });
		fireEvent.change(input, { target: { value: "202" } });
		expect(fieldPartRenders).toBe(afterFirstDigit);
	});

	it("radix: moving the highlight re-renders only the two affected items", async () => {
		const committed = new Set<string>();
		const P = Radix.PhoneField;
		render(
			<P.Root defaultCountry="US">
				<P.Country defaultOpen>
					<P.CountryTrigger />
					<P.CountryPortal>
						<P.CountryContent>
							<P.CountrySearch />
							<P.CountryList>
								{(country) => (
									<React.Profiler
										id={country.iso2}
										onRender={(id) => committed.add(id)}
									>
										<P.CountryItem country={country} />
									</React.Profiler>
								)}
							</P.CountryList>
						</P.CountryContent>
					</P.CountryPortal>
				</P.Country>
			</P.Root>,
		);
		await flush();
		const search = screen.getByRole("combobox", { name: "Search country" });
		committed.clear();
		fireEvent.keyDown(search, { key: "ArrowDown" });
		expect(committed.size).toBe(2);
	});
});

describe("adapter-specific composition", () => {
	it("shares one usePhoneField across adapters", () => {
		expect(Radix.usePhoneField).toBe(BaseUI.usePhoneField);
		expect(ReactAria.usePhoneField).toBe(BaseUI.usePhoneField);
	});

	it("base-ui: renders Root through render", () => {
		const { container } = render(
			<BaseUI.PhoneField.Root render={<section />}>
				<BaseUI.PhoneField.Input aria-label="Phone number" />
			</BaseUI.PhoneField.Root>,
		);
		expect(
			container.querySelector('section[data-slot="phone-field"]'),
		).toBeTruthy();
	});

	it("radix: merges Root and parts into the child with asChild", () => {
		const { container } = render(
			<Radix.PhoneField.Root asChild name="phone" defaultCountry="AR">
				<section className="shell">
					<Radix.PhoneField.Group asChild>
						<fieldset />
					</Radix.PhoneField.Group>
					<Radix.PhoneField.Input aria-label="Phone number" />
				</section>
			</Radix.PhoneField.Root>,
		);
		const root = container.querySelector<HTMLElement>("section.shell");
		expect(root?.dataset.slot).toBe("phone-field");
		expect(root?.dataset.country).toBe("AR");
		expect(
			root?.querySelector('[data-slot="phone-field-hidden-input"]'),
		).toBeTruthy();
		expect(container.querySelector("fieldset")?.dataset.slot).toBe(
			"phone-field-group",
		);
	});

	it("react-aria: keeps the trigger in Group's layout unless Country is styled", () => {
		const { container, rerender } = render(
			<ReactAria.PhoneField.Root>
				<ReactAria.PhoneField.Country />
			</ReactAria.PhoneField.Root>,
		);
		const wrapper = () =>
			container.querySelector<HTMLElement>('[data-slot="phone-field-country"]');
		expect(wrapper()?.style.display).toBe("contents");
		rerender(
			<ReactAria.PhoneField.Root>
				<ReactAria.PhoneField.Country className="flex" />
			</ReactAria.PhoneField.Root>,
		);
		expect(wrapper()?.style.display).toBe("");
		expect(wrapper()?.className).toBe("flex");
	});

	it("react-aria: lays out the value's content directly in the trigger", () => {
		const { container } = render(
			<ReactAria.PhoneField.Root>
				<ReactAria.PhoneField.Country />
			</ReactAria.PhoneField.Root>,
		);
		const value = container.querySelector<HTMLElement>(
			'[data-slot="phone-field-country-value"]',
		);
		expect(value?.style.display).toBe("contents");
	});

	it("react-aria: passes field state to render props", () => {
		const { container } = render(
			<ReactAria.PhoneField.Root
				defaultCountry="AR"
				className={(state) => `root-${state.country}`}
				render={(props) => <section {...props} />}
			>
				<ReactAria.PhoneField.Group
					className={({ isDisabled, filled }) =>
						`group ${isDisabled ? "off" : "on"} ${filled ? "filled" : "empty"}`
					}
				>
					<ReactAria.PhoneField.Input aria-label="Phone number" />
				</ReactAria.PhoneField.Group>
			</ReactAria.PhoneField.Root>,
		);
		expect(container.querySelector("section")?.className).toBe("root-AR");
		expect(
			container.querySelector('[data-slot="phone-field-group"]')?.className,
		).toBe("group on empty");
	});
});

describe("server rendering", () => {
	it("react-aria: leaves country names out of the server HTML", async () => {
		const { renderToString } = await import("react-dom/server");
		const html = renderToString(
			<ReactAria.PhoneField.Root defaultCountry="AR">
				<ReactAria.PhoneField.Country />
				<ReactAria.PhoneField.Input aria-label="Phone number" />
			</ReactAria.PhoneField.Root>,
		);
		// Intl.DisplayNames output differs between Node and browsers.
		expect(html).not.toContain("Falkland");
		expect(html).not.toContain('<option value="US"');
	});
});
