import { SiGithub as Github } from "@icons-pack/react-simple-icons";
import { Link } from "@tanstack/react-router";

const nav = [
	{ label: "Playground", to: "/", hash: "playground" },
	{ label: "Recipes", to: "/recipes", hash: undefined },
	{ label: "Documentation", to: "/docs", hash: undefined },
] as const;

export function PageHeader() {
	return (
		<header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
			<div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-6">
				<a
					href="/"
					className="ui-pressable inline-flex items-center gap-2.5 rounded-lg text-sm font-semibold tracking-tight text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600"
				>
					<img
						src="/favicon.ico"
						alt=""
						className="size-7"
						aria-hidden="true"
					/>
					PhoneField
				</a>
				<nav
					className="flex items-center gap-0.5"
					aria-label="Primary navigation"
				>
					{nav.map(({ label, to, hash }) => (
						<Link
							key={to}
							to={to}
							hash={hash}
							viewTransition
							activeOptions={{ exact: true, includeHash: false }}
							activeProps={{ className: "text-slate-950" }}
							inactiveProps={{
								className:
									"text-slate-600 hover:bg-slate-100 hover:text-slate-950",
							}}
							className="ui-pressable relative isolate hidden overflow-hidden rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-sky-600 sm:inline-flex"
						>
							{({ isActive }) => (
								<>
									{isActive && (
										<span
											className="primary-nav-indicator absolute inset-0 -z-10 rounded-lg bg-slate-100 shadow-[inset_0_0_0_1px_rgb(226_232_240/0.8)]"
											data-testid="primary-nav-indicator"
											aria-hidden="true"
										/>
									)}
									<span className="relative z-10">{label}</span>
								</>
							)}
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
