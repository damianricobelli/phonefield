import { createFileRoute } from "@tanstack/react-router";
import { DocSection } from "@/components/doc-section";
import { HeroSection } from "@/components/hero-section";
import { LivePlayground } from "@/components/live-playground";
import { PageFooter } from "@/components/page-footer";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(1200px_500px_at_10%_-20%,#dbeafe_0%,transparent_50%),radial-gradient(900px_450px_at_90%_-15%,#fef3c7_0%,transparent_45%),#f8fafc] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-20 size-72 rounded-full bg-blue-300/25 blur-3xl" />
        <div className="absolute -right-24 top-32 size-64 rounded-full bg-amber-300/30 blur-3xl" />
      </div>

      <HeroSection />

      <section className="relative mx-auto max-w-6xl px-6 pb-16">
        <LivePlayground />
      </section>

      <DocSection />

      <PageFooter />
    </main>
  );
}
