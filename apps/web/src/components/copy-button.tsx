import { Check, Copy } from "lucide-react";
import * as React from "react";

export function CopyButton({
	text,
	className = "",
	...props
}: {
	text: string;
	className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
	const [copied, setCopied] = React.useState(false);
	const resetTimerRef = React.useRef<number | null>(null);

	React.useEffect(
		() => () => {
			if (resetTimerRef.current) {
				window.clearTimeout(resetTimerRef.current);
			}
		},
		[],
	);

	const handleCopy = React.useCallback(async () => {
		if (!navigator.clipboard) return;

		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			if (resetTimerRef.current) {
				window.clearTimeout(resetTimerRef.current);
			}
			resetTimerRef.current = window.setTimeout(() => setCopied(false), 1600);
		} catch {
			setCopied(false);
		}
	}, [text]);

	return (
		<button
			type="button"
			onClick={handleCopy}
			className={`ui-pressable inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-medium text-slate-600 shadow-sm transition-colors duration-150 hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${className}`}
			aria-label={copied ? "Copied" : "Copy code"}
			{...props}
		>
			{copied ? (
				<Check className="size-3.5 text-emerald-600" aria-hidden="true" />
			) : (
				<Copy className="size-3.5" aria-hidden="true" />
			)}
			<span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
		</button>
	);
}
