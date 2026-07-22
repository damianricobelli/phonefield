import { FeaturedRecipesSection } from "@/components/featured-recipes-section";
import { HeroSection } from "@/components/hero-section";
import { HomeDocumentationSection } from "@/components/home-documentation-section";
import { LivePlayground } from "@/components/live-playground";
import { SitePage } from "@/components/site-page";

export function HomePage() {
	return (
		<SitePage decorated>
			<HeroSection />

			<section
				id="playground"
				className="relative mx-auto max-w-6xl scroll-mt-24 px-5 pb-20 sm:px-6 lg:pb-28"
			>
				<LivePlayground />
			</section>

			<FeaturedRecipesSection />
			<HomeDocumentationSection />
		</SitePage>
	);
}
