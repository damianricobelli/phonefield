"use client";

import { Tabs } from "@base-ui/react/tabs";
import { Check, Copy } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

const MANAGERS = [
	{ value: "pnpm", label: "pnpm" },
	{ value: "npm", label: "npm" },
	{ value: "yarn", label: "yarn" },
	{ value: "bun", label: "bun" },
] as const;

type Manager = (typeof MANAGERS)[number]["value"];

function defaultCommand(manager: Manager, packageName: string) {
	if (manager === "pnpm") {
		return `pnpm add ${packageName}`;
	}
	if (manager === "npm") {
		return `npm install ${packageName}`;
	}
	if (manager === "yarn") {
		return `yarn add ${packageName}`;
	}
	return `bun add ${packageName}`;
}

export function InstallTabs({
	packageName = "phonefield",
	defaultValue = "pnpm",
	commands,
	className,
}: InstallTabs.Props) {
	const [copiedManager, setCopiedManager] = React.useState<Manager | null>(
		null,
	);
	const resetTimerRef = React.useRef<number | null>(null);

	const resolvedCommands = React.useMemo(
		() =>
			MANAGERS.reduce<Record<Manager, string>>(
				(acc, manager) => {
					acc[manager.value] =
						commands?.[manager.value] ??
						defaultCommand(manager.value, packageName);
					return acc;
				},
				{} as Record<Manager, string>,
			),
		[commands, packageName],
	);

	const copyCommand = async (manager: Manager) => {
		if (typeof navigator === "undefined" || !navigator.clipboard) {
			return;
		}

		try {
			await navigator.clipboard.writeText(resolvedCommands[manager]);
			setCopiedManager(manager);
			if (resetTimerRef.current) {
				window.clearTimeout(resetTimerRef.current);
			}
			resetTimerRef.current = window.setTimeout(() => {
				setCopiedManager(null);
			}, 1600);
		} catch {
			setCopiedManager(null);
		}
	};

	return (
		<Tabs.Root
			className={cn(
				"min-w-0 overflow-hidden rounded-xl border border-white/10 bg-slate-950 shadow-sm",
				className,
			)}
			defaultValue={defaultValue}
		>
			<Tabs.List className="relative z-0 flex gap-1 border-b border-white/10 bg-slate-900 px-2 py-1.5">
				{MANAGERS.map((manager) => (
					<Tabs.Tab
						key={manager.value}
						value={manager.value}
						className="ui-pressable flex h-8 items-center justify-center border-0 px-3 text-sm font-medium whitespace-nowrap text-slate-400 outline-none select-none before:inset-x-0 before:inset-y-1 before:rounded-md before:-outline-offset-1 before:outline-sky-400 hover:text-white focus-visible:relative focus-visible:before:absolute focus-visible:before:outline-2 data-active:text-white"
					>
						{manager.label}
					</Tabs.Tab>
				))}
				<Tabs.Indicator className="absolute top-1/2 left-0 z-[-1] h-7 w-(--active-tab-width) translate-x-(--active-tab-left) -translate-y-1/2 rounded-md bg-white/10 transition-[width,transform] duration-200 [transition-timing-function:var(--ease-in-out-ui)] motion-reduce:transition-none" />
			</Tabs.List>

			{MANAGERS.map((manager) => {
				const isCopied = copiedManager === manager.value;

				return (
					<Tabs.Panel
						key={manager.value}
						value={manager.value}
						className="relative p-3 focus-visible:rounded-md focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-sky-400"
					>
						<div className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-950 p-2">
							<code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap px-2 font-mono text-sm text-slate-50">
								{resolvedCommands[manager.value]}
							</code>
							<button
								type="button"
								onClick={() => copyCommand(manager.value)}
								className="ui-pressable inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-white/10 bg-white/10 px-2.5 text-xs font-medium text-slate-200 transition-colors duration-150 hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-sky-400"
								aria-label={`Copy ${manager.label} install command`}
							>
								{isCopied ? (
									<Check className="size-3.5" aria-hidden="true" />
								) : (
									<Copy className="size-3.5" aria-hidden="true" />
								)}
								{isCopied ? "Copied" : "Copy"}
							</button>
						</div>
					</Tabs.Panel>
				);
			})}
		</Tabs.Root>
	);
}

export namespace InstallTabs {
	export type CommandMap = Partial<Record<Manager, string>>;

	export type Props = {
		packageName?: string;
		defaultValue?: Manager;
		commands?: CommandMap;
		className?: string;
	};
}
