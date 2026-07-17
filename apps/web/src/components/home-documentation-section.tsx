import { DocumentationContent } from "@/components/documentation-content";

export function HomeDocumentationSection() {
	return (
		<section id="documentation" className="scroll-mt-20">
			<DocumentationContent headingLevel={2} />
		</section>
	);
}
