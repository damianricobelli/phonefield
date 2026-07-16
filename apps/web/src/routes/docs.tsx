import { createFileRoute } from "@tanstack/react-router";
import { DocSection, documentationNavigation } from "@/components/doc-section";
import { DocumentationShell } from "@/components/documentation-shell";
import { SitePage } from "@/components/site-page";

export const Route = createFileRoute("/docs")({
	component: DocsPage,
	head: () => ({
		meta: [
			{ title: "Documentation — PhoneField" },
			{
				name: "description",
				content:
					"Installation, styling, forms, utilities, and API reference for PhoneField.",
			},
		],
	}),
});

function DocsPage() {
	return (
		<SitePage>
			<DocumentationShell
				header={{
					eyebrow: "Reference",
					title: "Documentation",
					description:
						"Installation, usage patterns, and API reference. Everything you need to integrate PhoneField into your design system.",
				}}
				navigation={documentationNavigation}
				mobileNavigation={{
					label: "Browse documentation",
					title: "Documentation",
					description: "Integration guides, utilities, and API reference.",
				}}
			>
				<DocSection />
			</DocumentationShell>
		</SitePage>
	);
}
