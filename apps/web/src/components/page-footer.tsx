import { SiGithub as Github } from "@icons-pack/react-simple-icons";

const links: readonly {
	label: string;
	href: string;
	external?: boolean;
}[] = [
	{ label: "Try it", href: "#playground" },
	{ label: "Docs", href: "#docs" },
	{
		label: "GitHub",
		href: "https://github.com/damianricobelli/phonefield",
		external: true,
	},
];

export function PageFooter() {
	return (
		<footer className="relative border-t border-slate-200 bg-white">
			<div className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
				<div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
					<span className="text-sm font-semibold text-slate-800">
						PhoneField
					</span>
					<nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm">
						{links.map(({ label, href, external }) => (
							<a
								key={href}
								href={href}
								{...(external ? { target: "_blank", rel: "noreferrer" } : {})}
								className="ui-pressable flex items-center gap-1.5 rounded-md text-slate-600 transition-colors duration-150 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600"
							>
								{label}
								{external && (
									<Github className="size-3.5 opacity-70" aria-hidden="true" />
								)}
							</a>
						))}
					</nav>
				</div>
				<p className="mt-4 text-center text-xs text-slate-500 sm:text-left">
					React phone input primitive for design systems. Built with Base UI and
					libphonenumber.
				</p>
			</div>
		</footer>
	);
}
