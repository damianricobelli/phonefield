import { SiGithub as Github } from "@icons-pack/react-simple-icons";
import { Pill } from "@/components/pill";

export function HeroSection() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 pb-10 pt-16 md:pt-24">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="flex items-center gap-3">
            <p className="text-xs font-semibold tracking-[0.22em] text-slate-500">
              PHONEFIELD
            </p>
            <a
              href="https://github.com/damianricobelli/phonefield"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-700 hover:text-slate-900"
              aria-label="PhoneField GitHub repository"
            >
              <Github className="size-4" aria-hidden="true" />
            </a>
          </div>
          <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight md:text-6xl">
            A primitive phone input for design systems.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-slate-600 md:text-lg">
            Compose country picker + number input with Base UI, while keeping
            parsing and validation aligned with libphonenumber-js through a
            clean primitive API.
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            <Pill>Composable Primitive</Pill>
            <Pill>Built with Base UI</Pill>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-slate-700/70 bg-[linear-gradient(155deg,#0f172a_0%,#111827_50%,#1e293b_100%)] p-5 text-slate-100 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.95)]">
          <div className="pointer-events-none absolute -right-14 -top-14 size-44 rounded-full bg-sky-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-8 bottom-0 size-32 rounded-full bg-amber-300/15 blur-2xl" />

          <p className="text-[11px] font-semibold tracking-[0.2em] text-slate-300">
            PRIMITIVE COMPOSITION
          </p>

          <div className="relative mt-3 rounded-xl border border-slate-700/70 bg-slate-950/70 p-3">
            <div className="mb-2 flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-rose-400/90" />
              <span className="size-2 rounded-full bg-amber-300/90" />
              <span className="size-2 rounded-full bg-emerald-300/90" />
            </div>
            <pre className="overflow-auto rounded-lg bg-slate-900/80 p-4 text-xs text-slate-100 ring-1 ring-slate-800/80">
              {`<PhoneField.Root value={value} onValueChange={setValue}>
  <PhoneField.Country />
  <PhoneField.Input />
</PhoneField.Root>`}
            </pre>
          </div>

          <div className="relative mt-3 rounded-xl border border-slate-700/70 bg-slate-900/60 p-3">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-slate-400">
              EMITTED VALUE
            </p>
            <pre className="mt-2 overflow-auto rounded-md bg-slate-950/80 p-3 text-[11px] text-slate-100 ring-1 ring-slate-800/80">
              {`{
  countryIso2: "US",
  countryDialCode: "1",
  nationalNumber: "(201) 555-0123",
  e164: "+12015550123",
  isValid: true
}`}
            </pre>
            <p className="mt-2 text-xs text-slate-300">
              This kind of payload is what you can store, validate, and submit.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
