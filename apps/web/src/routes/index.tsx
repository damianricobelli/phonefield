import { createFileRoute } from "@tanstack/react-router";
import { DocSection } from "@/components/doc-section";
import { FeaturedRecipesSection } from "@/components/featured-recipes-section";
import { HeroSection } from "@/components/hero-section";
import { LivePlayground } from "@/components/live-playground";
import { PageFooter } from "@/components/page-footer";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/")({ component: App });

function App() {
	return (
		<div className="min-h-screen overflow-x-clip bg-slate-50 text-slate-950">
			<div className="docs-grid pointer-events-none absolute inset-x-0 top-0 h-[48rem]" />
			<div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(ellipse_at_top,rgba(186,230,253,0.42),transparent_58%)]" />

			<PageHeader />

			<main className="relative">
				<HeroSection />

				<section
					id="playground"
					className="relative mx-auto max-w-6xl scroll-mt-24 px-5 pb-20 sm:px-6 lg:pb-28"
				>
					<LivePlayground />
				</section>

				<FeaturedRecipesSection />

				<section id="docs" className="relative scroll-mt-20">
					<DocSection />
				</section>

				<PageFooter />
			</main>
		</div>
	);
}
