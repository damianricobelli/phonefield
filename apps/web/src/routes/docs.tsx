import { createFileRoute } from "@tanstack/react-router";
import { DocumentationContent } from "@/components/documentation-content";
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
			<DocumentationContent />
		</SitePage>
	);
}
