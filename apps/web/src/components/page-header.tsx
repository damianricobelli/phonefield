import { SiGithub as Github } from "@icons-pack/react-simple-icons";

const nav = [
  { label: "Try it", href: "#playground" },
  { label: "Docs", href: "#docs" },
] as const;

export function PageHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <a href="/" className="text-lg font-bold tracking-tight text-slate-900">
          PhoneField
        </a>
        <nav className="flex items-center gap-1">
          {nav.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {label}
            </a>
          ))}
          <a
            href="https://github.com/damianricobelli/phonefield"
            target="_blank"
            rel="noreferrer"
            className="ml-2 inline-flex size-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            aria-label="GitHub"
          >
            <Github className="size-5" aria-hidden="true" />
          </a>
        </nav>
      </div>
    </header>
  );
}
