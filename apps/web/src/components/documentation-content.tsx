import { DocSection, documentationNavigation } from "@/components/doc-section";
import { DocumentationShell } from "@/components/documentation-shell";

export function DocumentationContent({
	headingLevel = 1,
}: {
	headingLevel?: 1 | 2;
}) {
	return (
		<DocumentationShell
			headingLevel={headingLevel}
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
	);
}
