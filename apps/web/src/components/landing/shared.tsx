import { type PhoneField, usePhoneField } from "phonefield";
import * as React from "react";
import { cn } from "@/lib/utils";

export type FieldSnapshot = {
	value: PhoneField.Value;
	state: PhoneField.State;
};

/** Reports the nearest Root's value and state to a parent. Renders nothing. */
export function FieldReporter({
	onChange,
}: {
	onChange: (snapshot: FieldSnapshot) => void;
}) {
	const { value, state } = usePhoneField();
	React.useEffect(() => {
		onChange({ value, state });
	}, [onChange, state, value]);
	return null;
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
	if (typeof window === "undefined" || !window.matchMedia) return () => {};
	const query = window.matchMedia(REDUCED_MOTION);
	query.addEventListener("change", onChange);
	return () => query.removeEventListener("change", onChange);
}

export function usePrefersReducedMotion() {
	return React.useSyncExternalStore(
		subscribeReducedMotion,
		() => window.matchMedia?.(REDUCED_MOTION).matches ?? false,
		() => false,
	);
}

const STATE_KEYS = [
	"filled",
	"valid",
	"invalid",
	"focused",
	"touched",
	"dirty",
] as const satisfies readonly (keyof PhoneField.State)[];

export function StateAttributes({
	state,
	className,
	tone = "light",
}: {
	state: PhoneField.State | null;
	className?: string;
	tone?: "light" | "dark";
}) {
	return (
		<ul
			className={cn("flex flex-wrap gap-1.5 font-mono text-[11px]", className)}
			aria-label="Root data attributes"
		>
			<li
				className={cn(
					"rounded-md px-2 py-1 ring-1 ring-inset",
					tone === "dark"
						? "bg-sky-400/10 text-sky-200 ring-sky-400/25"
						: "bg-sky-50 text-sky-800 ring-sky-200",
				)}
			>
				data-country="{state?.country ?? "US"}"
			</li>
			{STATE_KEYS.map((key) => {
				const on = Boolean(state?.[key]);
				const onClass =
					key === "invalid"
						? tone === "dark"
							? "bg-rose-400/15 text-rose-200 ring-rose-400/30"
							: "bg-rose-50 text-rose-700 ring-rose-200"
						: key === "valid"
							? tone === "dark"
								? "bg-emerald-400/15 text-emerald-200 ring-emerald-400/30"
								: "bg-emerald-50 text-emerald-700 ring-emerald-200"
							: tone === "dark"
								? "bg-white/10 text-white ring-white/20"
								: "bg-slate-900 text-white ring-slate-900";
				return (
					<li
						key={key}
						data-on={on || undefined}
						className={cn(
							"rounded-md px-2 py-1 ring-1 ring-inset transition-[background-color,color,box-shadow,opacity] duration-200",
							on
								? onClass
								: tone === "dark"
									? "text-slate-500 opacity-70 ring-white/10"
									: "text-slate-400 ring-slate-200",
						)}
					>
						data-{key}
					</li>
				);
			})}
		</ul>
	);
}

function JsonValue({ value }: { value: unknown }) {
	if (value === null) return <span className="text-violet-300">null</span>;
	if (typeof value === "boolean")
		return (
			<span className={value ? "text-emerald-300" : "text-amber-300"}>
				{String(value)}
			</span>
		);
	return <span className="text-sky-300">"{String(value)}"</span>;
}

export function ValuePreview({
	value,
	className,
}: {
	value: PhoneField.Value | null;
	className?: string;
}) {
	const entries = value
		? (Object.entries(value) as [keyof PhoneField.Value, unknown][])
		: [];
	return (
		<pre
			className={cn(
				"overflow-x-auto font-mono text-[12px] leading-6 text-slate-300",
				className,
			)}
		>
			<code>
				<span className="text-slate-500">{"{"}</span>
				{entries.map(([key, entry]) => (
					<span key={key} className="block pl-4">
						<span className="text-slate-400">{key}</span>
						<span className="text-slate-500">: </span>
						<JsonValue value={entry} />
						<span className="text-slate-500">,</span>
					</span>
				))}
				<span className="text-slate-500">{"}"}</span>
			</code>
		</pre>
	);
}
