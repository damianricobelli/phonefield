import { Check, Copy } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CopyButton({
	text,
	className = "",
	...props
}: {
	text: string;
	className?: string;
} & Omit<React.ComponentProps<typeof Button>, "children">) {
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

	const handleCopy = async () => {
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
	};

	return (
		<Button
			type="button"
			variant="outline"
			onClick={handleCopy}
			className={cn("ui-pressable text-xs", className)}
			aria-label={copied ? "Copied" : "Copy code"}
			{...props}
		>
			{copied ? (
				<Check className="size-3.5 text-emerald-600" aria-hidden="true" />
			) : (
				<Copy className="size-3.5" aria-hidden="true" />
			)}
			<span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
		</Button>
	);
}
