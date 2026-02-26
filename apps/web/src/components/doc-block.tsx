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

export function DocBlock({
  title,
  description,
  code,
}: {
  title: string;
  description: string;
  code: string;
}) {
  const lines = code.replace(/\n$/, "").split("\n");

  return (
    <article className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur md:p-8">
      <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
        {title}
      </h2>
      <p className="mt-2 mb-4 max-w-3xl text-sm text-slate-600 md:text-base">
        {description}
      </p>

      <pre className="overflow-auto rounded-xl border border-slate-200 bg-slate-950 p-4 text-sm shadow-sm">
        <code>
          {lines.map((line, lineIndex) => (
            <div
              key={`${title}-line-${lineIndex + 1}`}
              className="grid grid-cols-[2.2rem_1fr] gap-3"
            >
              <span className="select-none text-right text-xs text-slate-500">
                {lineIndex + 1}
              </span>
              <span className="whitespace-pre-wrap wrap-break-word">
                {tokenizeLine(line).map((part, partIndex) => (
                  <span
                    key={`${title}-line-${lineIndex + 1}-part-${partIndex + 1}`}
                    className={tokenClass(part.type)}
                  >
                    {part.text}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </code>
      </pre>
    </article>
  );
}
