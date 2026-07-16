import {
	type FeaturedLink,
	FeaturedLinksSection,
} from "@/components/featured-links-section";

const featuredDocumentation = [
	{
		title: "Getting started",
		description:
			"Install PhoneField and compose the root, country picker, and input primitives.",
		href: "/docs#getting-started",
	},
	{
		title: "Forms & submission",
		description:
			"Choose controlled or native FormData flows and validate again on the server.",
		href: "/docs#forms",
	},
	{
		title: "Component API",
		description:
			"Review the props and responsibilities of Root, Country, and Input.",
		href: "/docs#api",
	},
] as const satisfies readonly FeaturedLink[];

export function FeaturedDocumentationSection() {
	return (
		<FeaturedLinksSection
			eyebrow="Documentation"
			title="Understand the primitives before you extend them."
			browseHref="/docs"
			browseLabel="Read the docs"
			items={featuredDocumentation}
		/>
	);
}
