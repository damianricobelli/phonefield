import { ArrowRightIcon } from "lucide-react";

export type FeaturedLink = {
	description: string;
	href: string;
	title: string;
};

export function FeaturedLinksSection({
	browseHref,
	browseLabel,
	eyebrow,
	items,
	title,
}: {
	browseHref: string;
	browseLabel: string;
	eyebrow: string;
	items: readonly FeaturedLink[];
	title: string;
}) {
	return (
		<section className="border-t border-slate-200 bg-white">
			<div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 md:py-16">
				<div className="flex items-end justify-between gap-6">
					<div>
						<p className="text-xs font-semibold tracking-[0.14em] text-sky-700 uppercase">
							{eyebrow}
						</p>
						<h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
							{title}
						</h2>
					</div>
					<a
						href={browseHref}
						className="ui-pressable hidden items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-sky-700 hover:bg-sky-50 sm:inline-flex"
					>
						{browseLabel} <ArrowRightIcon className="size-4" />
					</a>
				</div>

				<div className="mt-7 grid gap-3 md:grid-cols-3">
					{items.map((item) => (
						<a
							key={item.href}
							href={item.href}
							className="ui-pressable group rounded-xl border border-slate-200 bg-slate-50 p-5 transition-[border-color,background-color] duration-150 hover:border-sky-200 hover:bg-sky-50/60 focus-visible:outline-2 focus-visible:outline-sky-600"
						>
							<div className="flex items-start justify-between gap-4">
								<span className="font-semibold text-slate-950">
									{item.title}
								</span>
								<ArrowRightIcon className="mt-0.5 size-4 shrink-0 text-slate-400 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 group-hover:text-sky-600 motion-reduce:transition-none" />
							</div>
							<p className="mt-2 text-sm leading-6 text-slate-600">
								{item.description}
							</p>
						</a>
					))}
				</div>
			</div>
		</section>
	);
}
