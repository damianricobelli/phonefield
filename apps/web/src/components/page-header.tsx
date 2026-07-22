import { SiGithub as Github } from "@icons-pack/react-simple-icons";
import { Link, linkOptions } from "@tanstack/react-router";

const nav = linkOptions([
	{ label: "Playground", to: "/", hash: "playground" },
	{ label: "Recipes", to: "/recipes" },
]);

export function PageHeader() {
	return (
		<header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
			<div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-6">
				<Link
					to="/"
					className="ui-pressable inline-flex items-center gap-2.5 rounded-lg text-sm font-semibold tracking-tight text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600"
				>
					<img
						src="/favicon.ico"
						alt=""
						className="size-7"
						aria-hidden="true"
					/>
					PhoneField
				</Link>
				<nav
					className="flex items-center gap-0.5"
					aria-label="Primary navigation"
				>
					{nav.map(({ label, ...link }) => (
						<Link
							key={label}
							{...link}
							className="ui-pressable hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-sky-600 sm:inline-flex"
						>
							{label}
						</Link>
					))}
					<a
						href="https://github.com/damianricobelli/phonefield"
						target="_blank"
						rel="noreferrer"
						className="ui-pressable ml-1 inline-flex size-9 items-center justify-center rounded-lg text-slate-600 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-sky-600"
						aria-label="GitHub"
					>
						<Github className="size-5" aria-hidden="true" />
					</a>
				</nav>
			</div>
		</header>
	);
}
