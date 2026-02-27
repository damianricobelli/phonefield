import { createFileRoute } from "@tanstack/react-router";
import { DocSection } from "@/components/doc-section";
import { HeroSection } from "@/components/hero-section";
import { LivePlayground } from "@/components/live-playground";
import { PageFooter } from "@/components/page-footer";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(1400px_600px_at_8%_-18%,#dbeafe_0%,transparent_48%),radial-gradient(1000px_500px_at_92%_-12%,#fef3c7_0%,transparent_45%),linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] text-slate-900">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 top-24 size-80 rounded-full bg-blue-300/20 blur-3xl" />
        <div className="absolute -right-28 top-36 size-72 rounded-full bg-amber-300/25 blur-3xl" />
      </div>

      <PageHeader />

      <main className="relative">
        <HeroSection />

        <section id="playground" className="relative mx-auto max-w-6xl scroll-mt-20 px-6 pb-20">
          <LivePlayground />
        </section>

        <section id="docs" className="relative scroll-mt-20">
          <DocSection />
        </section>

        <PageFooter />
      </main>
    </div>
  );
}
