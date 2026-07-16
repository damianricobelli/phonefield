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
			expect(screen.getByRole("heading", { name: title })).toBeTruthy();
		}
		expect(document.querySelectorAll("#blocks article")).toHaveLength(10);
	});
});
