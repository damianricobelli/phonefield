import { SiGithub as Github } from "@icons-pack/react-simple-icons";

export function PageFooter() {
  return (
    <footer className="relative border-t border-slate-200/80 bg-white/50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm text-slate-600">
        <span>PhoneField</span>
        <a
          href="https://github.com/damianricobelli/phonefield"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700"
        >
          <Github className="size-4" aria-hidden="true" />
          GitHub
        </a>
      </div>
    </footer>
  );
}
