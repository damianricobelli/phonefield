import { describe, expect, it } from "vitest";
import { OG_IMAGE, pageSeo, siteMeta } from "@/lib/seo";

describe("seo", () => {
	it("builds absolute, consistent page tags", () => {
		const { meta, links } = pageSeo({
			title: "Recipes — PhoneField",
			description: "Copy-paste recipes.",
			path: "/recipes",
		});
		const byKey = Object.fromEntries(
			meta.map((tag) => [
				"title" in tag ? "title" : (tag.name ?? tag.property),
				"title" in tag ? tag.title : tag.content,
			]),
		);

		expect(links).toEqual([
			{ rel: "canonical", href: "https://phonefield.vercel.app/recipes" },
		]);
		expect(byKey["og:url"]).toBe("https://phonefield.vercel.app/recipes");
		expect(byKey["og:title"]).toBe(byKey.title);
		expect(byKey["twitter:description"]).toBe(byKey.description);
	});

	it("serves an absolute, correctly sized social image", () => {
		const image = siteMeta.find(
			(tag) => "property" in tag && tag.property === "og:image",
		);
		expect(image && "content" in image ? image.content : "").toMatch(
			/^https:\/\//,
		);
		expect([OG_IMAGE.width, OG_IMAGE.height]).toEqual([1200, 630]);
	});

	it("leaves titles, descriptions, and robots to pages", () => {
		const keys = siteMeta.map((tag) =>
			"title" in tag ? "title" : "name" in tag ? tag.name : undefined,
		);
		expect(keys).not.toContain("title");
		expect(keys).not.toContain("description");
		expect(keys).not.toContain("robots");
	});
});
