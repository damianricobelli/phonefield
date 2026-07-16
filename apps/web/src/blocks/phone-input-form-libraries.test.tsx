import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PhoneInputReactHookForm } from "@/blocks/phone-input-react-hook-form";
import { PhoneInputTanStackForm } from "@/blocks/phone-input-tanstack-form";

afterEach(cleanup);

describe.each([
	["React Hook Form", PhoneInputReactHookForm],
	["TanStack Form", PhoneInputTanStackForm],
])("%s integration", (_name, Example) => {
	it("keeps the trailing action inset and rounded", () => {
		render(<Example />);
		const save = screen.getByRole("button", { name: "Save" });
		const addon = save.closest('[data-slot="input-group-addon"]');

		expect(addon?.getAttribute("data-align")).toBe("inline-end");
		expect(addon?.className).not.toContain("p-0");
		expect(save.className).not.toContain("h-full");
		expect(save.className).not.toContain("rounded-none");
	});

	it("validates while typing and submits the canonical number", async () => {
		render(<Example />);
		const input = screen.getByRole("textbox", { name: "Phone number" });

		fireEvent.change(input, { target: { value: "123" } });
		await waitFor(() => {
			expect(screen.getByRole("alert").textContent).toContain(
				"Enter a valid phone number.",
			);
		});

		fireEvent.change(input, { target: { value: "2025550123" } });
		await waitFor(() => {
			expect(screen.queryByRole("alert")).toBeNull();
			expect(
				screen.getByRole("button", { name: "Save" }).hasAttribute("disabled"),
			).toBe(false);
		});

		fireEvent.click(screen.getByRole("button", { name: "Save" }));
		await waitFor(() => {
			expect(screen.getByText("+12025550123")).toBeTruthy();
		});
	});
});
