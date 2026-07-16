import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BlocksSection } from "@/components/blocks-section";

afterEach(cleanup);

const blockTitles = [
	"Inline country select",
	"Separated country select",
	"Validated field",
	"Fixed country",
	"International paste detection",
	"Native FormData",
	"Verification card",
	"Phone to OTP flow",
	"Localized country subset",
	"Country select in a Drawer",
] as const;

describe("BlocksSection", () => {
	it("renders the full copy-paste recipe gallery", () => {
		render(<BlocksSection />);

		for (const title of blockTitles) {
			const heading = screen.getByRole("heading", { name: title });
			const card = heading.closest("article");
			expect(card).toBeTruthy();
			expect(
				card?.querySelector('[data-slot="field"]'),
				`${title} should use the shadcn Field`,
			).toBeTruthy();
			const phoneInput = card?.querySelector('[data-slot="phone-field-input"]');
			expect(
				phoneInput,
				`${title} should render a PhoneField input`,
			).toBeTruthy();
			expect(
				phoneInput?.className,
				`${title} should compose the shadcn Input styles`,
			).toContain("transition-colors");

			const inputGroup = card?.querySelector('[data-slot="input-group"]');
			expect(
				inputGroup,
				`${title} should use the shadcn InputGroup`,
			).toBeTruthy();
			expect(
				phoneInput?.hasAttribute("data-input-group-control"),
				`${title} should participate in InputGroup focus management`,
			).toBe(true);
		}
		expect(document.querySelectorAll("#blocks article")).toHaveLength(10);
		expect(
			document.querySelectorAll('#blocks [data-slot="input-group"]'),
		).toHaveLength(10);
	});
});
