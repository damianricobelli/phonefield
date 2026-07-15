import { CopyButton } from "@/components/copy-button";

type TokenType = "plain" | "keyword" | "string" | "comment" | "type" | "tag";

type TokenPart = {
	type: TokenType;
	text: string;
};

const KEYWORDS = new Set([
	"import",
	"from",
	"const",
	"let",
	"var",
	"return",
	"function",
	"if",
	"else",
	"true",
	"false",
	"null",
	"undefined",
	"type",
	"interface",
	"export",
	"default",
	"new",
	"as",
	"useState",
]);

const KNOWN_TYPES = new Set([
	"React",
	"PhoneField",
	"Field",
	"Combobox",
	"CountryCode",
	"Value",
]);

const TYPE_PATTERN = /^[A-Z][A-Za-z0-9._]*$/;

function classifyToken(token: string): TokenType {
	if (token.startsWith("//")) return "comment";
	if (/^["'`]/.test(token)) return "string";
	if (token.startsWith("<")) return "tag";
	if (KEYWORDS.has(token)) return "keyword";
	if (KNOWN_TYPES.has(token) || TYPE_PATTERN.test(token)) return "type";
	return "plain";
}

function tokenizeLine(line: string): TokenPart[] {
	const pattern =
		/(\/\/.*$|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|`(?:\\.|[^`])*`|<\/?[A-Za-z][\w.]*(?=[\s/>])|\b[A-Za-z_][A-Za-z0-9._]*\b)/g;

	const parts: TokenPart[] = [];
	let cursor = 0;

	for (const match of line.matchAll(pattern)) {
		const token = match[0];
		const index = match.index ?? 0;

		if (index > cursor) {
			parts.push({ type: "plain", text: line.slice(cursor, index) });
		}

		parts.push({ type: classifyToken(token), text: token });
		cursor = index + token.length;
	}

	if (cursor < line.length) {
		parts.push({ type: "plain", text: line.slice(cursor) });
	}

	if (parts.length === 0) {
		return [{ type: "plain", text: "" }];
	}

	return parts;
}

function tokenClass(type: TokenType) {
	if (type === "keyword") {
		return "text-sky-300";
	}
	if (type === "string") {
		return "text-amber-300";
	}
	if (type === "comment") {
		return "text-emerald-300";
	}
	if (type === "type") {
		return "text-violet-300";
	}
	if (type === "tag") {
		return "text-cyan-300";
	}
	return "text-slate-100";
}

export function HighlightedCode({
	code,
	lineNumbers = true,
	className = "",
}: {
	code: string;
	lineNumbers?: boolean;
	className?: string;
}) {
	const lines = code.replace(/\n$/, "").split("\n");
	return (
		<pre
			className={`code-scrollbar max-h-[32rem] overflow-auto rounded-b-xl bg-slate-950 p-4 text-xs leading-6 sm:text-[13px] ${className}`}
		>
			<code className="block w-max min-w-full">
				{lines.map((line, lineIndex) => (
					<span
						key={lineIndex}
						className={
							lineNumbers ? "grid grid-cols-[1.5rem_1fr] gap-3" : "block"
						}
					>
						{lineNumbers && (
							<span className="mr-1 select-none text-right text-[11px] text-slate-600">
								{lineIndex + 1}
							</span>
						)}
						<span className="whitespace-pre">
							{tokenizeLine(line).map((part, partIndex) => (
								<span key={partIndex} className={tokenClass(part.type)}>
									{part.text}
								</span>
							))}
						</span>
					</span>
				))}
			</code>
		</pre>
	);
}

export function DocBlock({
	title,
	description,
	code,
}: {
	title: string;
	description: string;
	code: string;
}) {
	return (
		<article className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40">
			<div className="px-5 pt-5 pb-4 sm:px-7 sm:pt-7">
				<h3 className="text-lg font-semibold tracking-tight text-slate-950 md:text-xl">
					{title}
				</h3>
				<p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
					{description}
				</p>
			</div>

			<div className="border-t border-slate-200 bg-slate-950">
				<div className="flex h-11 items-center justify-between border-b border-white/10 px-4">
					<span className="font-mono text-[11px] font-medium text-slate-500">
						TSX · {code.replace(/\n$/, "").split("\n").length} lines
					</span>
					<CopyButton
						text={code}
						className="border-white/10 bg-white/10 text-slate-300 shadow-none hover:bg-white/15 hover:text-white"
					/>
				</div>
				<HighlightedCode code={code} className="rounded-none border-0" />
			</div>
		</article>
	);
}
