import { MenuIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { useDocumentationScrollSpy } from "@/hooks/use-documentation-scroll-spy";
import { cn } from "@/lib/utils";

export type DocumentationNavItem = {
	hash: string;
	label: string;
};

export type DocumentationNavGroup = {
	label: string;
	items: readonly DocumentationNavItem[];
};

type DocumentationHeader = {
	description: string;
	eyebrow: string;
	title: string;
};

type MobileNavigationCopy = {
	description: string;
	label: string;
	title: string;
};

const ACTIVE_NAV_CLASS = "bg-sky-50 font-semibold text-sky-800";

function isPlainLeftClick(event: React.MouseEvent<HTMLAnchorElement>) {
	return (
		event.button === 0 &&
		!event.altKey &&
		!event.ctrlKey &&
		!event.metaKey &&
		!event.shiftKey
	);
}

function DocumentationNav({
	currentHash,
	groups,
	onNavigate,
}: {
	currentHash: string;
	groups: readonly DocumentationNavGroup[];
	onNavigate: (hash: string) => void;
}) {
	return (
		<nav aria-label="Page sections" className="space-y-5">
			{groups.map((group) => (
				<div key={group.label}>
					<p className="px-3 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
						{group.label}
					</p>
					<div className="mt-2 space-y-0.5">
						{group.items.map((item) => (
							<a
								key={item.hash}
								href={`#${item.hash}`}
								aria-current={
									currentHash === item.hash ? "location" : undefined
								}
								onClick={(event) => {
									if (isPlainLeftClick(event)) onNavigate(item.hash);
								}}
								className={cn(
									"ui-pressable block rounded-lg px-3 py-1.5 text-sm text-slate-600 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sky-600",
									currentHash === item.hash && ACTIVE_NAV_CLASS,
								)}
							>
								{item.label}
							</a>
						))}
					</div>
				</div>
			))}
		</nav>
	);
}

function MobileDocumentationNav({
	currentHash,
	description,
	groups,
	label,
	onNavigate,
	onOpenIntent,
	onOpenChange,
	open,
	title,
}: {
	currentHash: string;
	description: string;
	groups: readonly DocumentationNavGroup[];
	label: string;
	onNavigate: (hash: string) => void;
	onOpenIntent: () => void;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	title: string;
}) {
	return (
		<div className="lg:hidden" onClickCapture={onOpenIntent}>
			<Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
				<DrawerTrigger
					render={
						<Button
							type="button"
							variant="outline"
							className="w-full justify-between"
						/>
					}
				>
					<span className="truncate">{label}</span>
					<MenuIcon className="size-4 text-slate-500" />
				</DrawerTrigger>
				<DrawerContent className="mx-auto max-w-xl">
					<DrawerHeader className="border-b px-5 pb-4 text-left">
						<DrawerTitle>{title}</DrawerTitle>
						<DrawerDescription>{description}</DrawerDescription>
					</DrawerHeader>
					<div className="min-h-0 flex-1 overflow-y-auto p-4">
						<DocumentationNav
							currentHash={currentHash}
							groups={groups}
							onNavigate={(hash) => {
								onNavigate(hash);
								onOpenChange(false);
							}}
						/>
					</div>
				</DrawerContent>
			</Drawer>
		</div>
	);
}

export function DocumentationShell({
	children,
	header,
	headingLevel = 1,
	mobileNavigation,
	navigation,
}: {
	children: React.ReactNode;
	header: DocumentationHeader;
	headingLevel?: 1 | 2;
	mobileNavigation: MobileNavigationCopy;
	navigation: readonly DocumentationNavGroup[];
}) {
	const Heading = headingLevel === 1 ? "h1" : "h2";
	const [mobileNavigationOpen, setMobileNavigationOpen] = React.useState(false);
	const hashes = React.useMemo(
		() => navigation.flatMap((group) => group.items.map((item) => item.hash)),
		[navigation],
	);
	const { currentHash, beginHashNavigation, pauseScrollSpy } =
		useDocumentationScrollSpy(hashes, mobileNavigationOpen);

	return (
		<section className="relative border-t border-slate-200 bg-white">
			<div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 md:py-20">
				<header className="max-w-3xl">
					<p className="text-xs font-semibold tracking-[0.14em] text-sky-700 uppercase">
						{header.eyebrow}
					</p>
					<Heading className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
						{header.title}
					</Heading>
					<p className="mt-3 text-base leading-7 text-slate-600">
						{header.description}
					</p>
				</header>

				<div className="mt-10">
					<MobileDocumentationNav
						currentHash={currentHash}
						description={mobileNavigation.description}
						groups={navigation}
						label={mobileNavigation.label}
						onNavigate={beginHashNavigation}
						onOpenIntent={pauseScrollSpy}
						onOpenChange={setMobileNavigationOpen}
						open={mobileNavigationOpen}
						title={mobileNavigation.title}
					/>
				</div>

				<div className="mt-6 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-12 lg:mt-12 lg:grid-cols-[14rem_minmax(0,1fr)] lg:items-start">
					<aside className="code-scrollbar hidden max-h-[calc(100dvh-7rem)] min-w-0 overflow-y-auto pr-2 lg:sticky lg:top-24 lg:block lg:self-start">
						<DocumentationNav
							currentHash={currentHash}
							groups={navigation}
							onNavigate={beginHashNavigation}
						/>
					</aside>

					<div className="min-w-0 space-y-16 md:space-y-20">{children}</div>
				</div>
			</div>
		</section>
	);
}

export function DocumentationSection({
	anchor,
	children,
	description,
	title,
}: {
	anchor: string;
	children: React.ReactNode;
	description: string;
	title: string;
}) {
	return (
		<section
			id={`doc-${anchor}`}
			data-doc-anchor={anchor}
			className="min-w-0 scroll-mt-24 space-y-8"
		>
			<header className="border-b border-slate-200 pb-5">
				<h2 className="text-xl font-semibold tracking-tight text-slate-950 md:text-2xl">
					{title}
				</h2>
				<p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
					{description}
				</p>
			</header>
			<div className="space-y-8">{children}</div>
		</section>
	);
}
