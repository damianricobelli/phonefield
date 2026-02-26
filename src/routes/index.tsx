import { Field } from "@base-ui/react/field";
import { SiGithub as Github } from "@icons-pack/react-simple-icons";
import { createFileRoute } from "@tanstack/react-router";
import { PhoneField } from "phonefield";
import { PhoneFieldUtils } from "phonefield/utils";
import * as React from "react";
import { InstallTabs } from "@/components/install-tabs";

export const Route = createFileRoute("/")({ component: App });

const quickStartSnippet = `import { PhoneField } from "phonefield";

export function SignupPhone() {
  return (
    <PhoneField.Root defaultCountry="US" lang="en">
      <PhoneField.Country />
      <PhoneField.Input />
    </PhoneField.Root>
  );
}`;

const controlledSnippet = `import * as React from "react";
import { PhoneField } from "phonefield";

export function CheckoutPhone() {
  const [phone, setPhone] = React.useState<PhoneField.Value>({
    countryIso2: "US",
    countryDialCode: "1",
    nationalNumber: "",
    e164: null,
    isValid: false,
  });

  return (
    <PhoneField.Root value={phone} onValueChange={setPhone}>
      <PhoneField.Country />
      <PhoneField.Input />
    </PhoneField.Root>
  );
}`;

const formDataSnippet = `import { PhoneField } from "phonefield";
import { PhoneFieldUtils } from "phonefield/utils";

// Uncontrolled is the default: omit \`value\` and \`onValueChange\`.
<form
  onSubmit={(event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const phone = PhoneFieldUtils.fromFormData(formData, "phone");
    // phone -> PhoneField.Value | null
  }}
>
  <PhoneField.Root name="phone" defaultCountry="US">
    <PhoneField.Country />
    <PhoneField.Input />
  </PhoneField.Root>
</form>

// Server side:
const formData = await request.formData();
const phone = PhoneFieldUtils.fromFormData(formData, "phone");`;

const subsetSnippet = `<PhoneField.Root countries={["US", "CA", "MX"]}>
  <PhoneField.Country />
  <PhoneField.Input />
</PhoneField.Root>
`;

const partsSnippet = `const countrySlots: PhoneField.CountrySlots = {
  trigger: "h-10 rounded-md border border-gray-200 px-3",
  popup: "rounded-lg shadow-lg",
  item:
    "px-3 py-2 data-[highlighted]:bg-slate-900 data-[highlighted]:text-white",
};

<PhoneField.Root className="flex items-center gap-2">
  <PhoneField.Country slots={countrySlots} />
  <PhoneField.Input className="h-10 rounded-md border border-gray-200 px-3" />
</PhoneField.Root>`;

const validitySnippet = `import { Field } from "@base-ui/react/field";

const hasNumber = value.nationalNumber.trim().length > 0;
const showError = hasNumber && !value.isValid;

<Field.Root invalid={showError} className="space-y-2">
  <Field.Label>Phone</Field.Label>

  <PhoneField.Root value={value} onValueChange={setValue}>
    <PhoneField.Country />
    <PhoneField.Input className="data-invalid:border-red-500 data-valid:border-emerald-500" />
  </PhoneField.Root>

  <Field.Error match={showError}>Invalid phone number</Field.Error>
</Field.Root>`;

const formatAndUtilsSnippet = `import { PhoneFieldUtils } from "phonefield/utils";

const parsed = PhoneFieldUtils.parse(value);

const output = {
  isValid: PhoneFieldUtils.isValid(value),
  e164: value.e164,
  national: parsed?.formatNational(),
  international: parsed?.formatInternational(),
};

// Frontend or backend:
PhoneFieldUtils.isValid("+14155552671");
PhoneFieldUtils.fromFormData(formData, "phone");
PhoneFieldUtils.getCountries("es-AR"); // Map<iso2, country>`;

function App() {
  const [value, setValue] = React.useState<PhoneField.Value>({
    countryIso2: "US",
    countryDialCode: "1",
    nationalNumber: "",
    e164: null,
    isValid: false,
  });
  const [phoneTouched, setPhoneTouched] = React.useState(false);

  const parsed = PhoneFieldUtils.parse(value);
  const hasNumber = value.nationalNumber.trim().length > 0;
  const requiredError = phoneTouched && !hasNumber;
  const invalidError = phoneTouched && hasNumber && !value.isValid;
  const showPhoneError = requiredError || invalidError;
  const phoneErrorText = requiredError
    ? "Phone is required"
    : "Invalid phone number";

  const formatPreview = [
    { label: "National", value: parsed?.formatNational() ?? "-" },
    { label: "International", value: parsed?.formatInternational() ?? "-" },
    { label: "E.164", value: value.e164 ?? "-" },
    { label: "RFC3966 URI", value: parsed?.getURI() ?? "-" },
    {
      label: "Meta",
      value: `${parsed?.country ?? "-"} | +${parsed?.countryCallingCode ?? "-"}`,
    },
  ] as const;
  const liveCountrySlots: PhoneField.CountrySlots = {
    root: "shrink-0",
    trigger:
      "inline-flex bg-[canvas] h-10 items-center justify-between gap-2 rounded-xl border border-gray-200 pr-2.5 pl-3 text-base text-gray-900 select-none hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 data-[popup-open]:bg-gray-100 cursor-default whitespace-nowrap",
    value: "whitespace-nowrap",
    icon: "flex",
    popup:
      "[--input-container-height:3rem] origin-[var(--transform-origin)] min-w-[16rem] max-w-[var(--available-width)] max-h-[24rem] rounded-xl bg-[canvas] shadow-lg shadow-gray-200 text-gray-900 outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0",
    searchInput:
      "m-2 h-10 w-[calc(100%-1rem)] font-normal rounded-lg border border-gray-200 pl-3.5 text-base text-gray-900 focus:outline focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800",
    empty: "p-4 text-[0.925rem] leading-4 text-gray-600 empty:m-0 empty:p-0",
    list: "overflow-y-auto scroll-py-2 py-2 overscroll-contain max-h-[min(calc(24rem-var(--input-container-height)),calc(var(--available-height)-var(--input-container-height)))] empty:p-0",
    item: "grid min-w-[max(16rem,var(--anchor-width))] cursor-default grid-cols-[minmax(0,1fr)_auto] items-center gap-2 py-2.5 pr-4 pl-4 text-base leading-5 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-2 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-lg data-[highlighted]:before:bg-gray-900",
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(1200px_500px_at_10%_-20%,#dbeafe_0%,transparent_50%),radial-gradient(900px_450px_at_90%_-15%,#fef3c7_0%,transparent_45%),#f8fafc] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-20 size-72 rounded-full bg-blue-300/25 blur-3xl" />
        <div className="absolute -right-24 top-32 size-64 rounded-full bg-amber-300/30 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-6xl px-6 pb-10 pt-16 md:pt-24">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="flex items-center gap-3">
              <p className="text-xs font-semibold tracking-[0.22em] text-slate-500">
                PHONEFIELD
              </p>
              <a
                href="https://github.com/damianricobelli/phonefield"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-700 hover:text-slate-900"
                aria-label="PhoneField GitHub repository"
              >
                <Github className="size-4" aria-hidden="true" />
              </a>
            </div>
            <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight md:text-6xl">
              A primitive phone input for design systems.
            </h1>
            <p className="mt-5 max-w-2xl text-base text-slate-600 md:text-lg">
              Compose country picker + number input with Base UI, while keeping
              parsing and validation aligned with libphonenumber-js through a
              clean primitive API.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              <Pill>Composable Primitive</Pill>
              <Pill>Built with Base UI</Pill>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-slate-700/70 bg-[linear-gradient(155deg,#0f172a_0%,#111827_50%,#1e293b_100%)] p-5 text-slate-100 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.95)]">
            <div className="pointer-events-none absolute -right-14 -top-14 size-44 rounded-full bg-sky-400/15 blur-3xl" />
            <div className="pointer-events-none absolute -left-8 bottom-0 size-32 rounded-full bg-amber-300/15 blur-2xl" />

            <p className="text-[11px] font-semibold tracking-[0.2em] text-slate-300">
              PRIMITIVE COMPOSITION
            </p>

            <div className="relative mt-3 rounded-xl border border-slate-700/70 bg-slate-950/70 p-3">
              <div className="mb-2 flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-rose-400/90" />
                <span className="size-2 rounded-full bg-amber-300/90" />
                <span className="size-2 rounded-full bg-emerald-300/90" />
              </div>
              <pre className="overflow-auto rounded-lg bg-slate-900/80 p-4 text-xs text-slate-100 ring-1 ring-slate-800/80">
                {`<PhoneField.Root value={value} onValueChange={setValue}>
  <PhoneField.Country />
  <PhoneField.Input />
</PhoneField.Root>`}
              </pre>
            </div>

            <div className="relative mt-3 rounded-xl border border-slate-700/70 bg-slate-900/60 p-3">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-slate-400">
                EMITTED VALUE
              </p>
              <pre className="mt-2 overflow-auto rounded-md bg-slate-950/80 p-3 text-[11px] text-slate-100 ring-1 ring-slate-800/80">
                {`{
  countryIso2: "US",
  countryDialCode: "1",
  nationalNumber: "(201) 555-0123",
  e164: "+12015550123",
  isValid: true
}`}
              </pre>
              <p className="mt-2 text-xs text-slate-300">
                This kind of payload is what you can store, validate, and submit.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 pb-16">
        <article className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur md:p-8">
          <h2 className="text-xl font-semibold">Live Playground</h2>
          <p className="mt-1 text-sm text-slate-600">
            Base UI-like motion and popup behavior, while using the PhoneField
            primitive API.
          </p>

          <div className="mt-6">
            <Field.Root
              touched={phoneTouched}
              dirty={phoneTouched && hasNumber}
              invalid={showPhoneError}
              className="space-y-2"
            >
              <Field.Label className="text-sm font-medium text-slate-700">
                Phone number
              </Field.Label>

              <PhoneField.Root
                value={value}
                onValueChange={setValue}
                className="space-y-0"
                renderCountryValue={(country) =>
                  `${country.flag ?? ""} ${country.dialCode}`
                }
                renderCountryItem={(country) => (
                  <>
                    <span className="truncate">
                      {country.flag ? `${country.flag} ` : ""}
                      {country.name}
                    </span>
                    <span className="text-xs opacity-70">
                      {country.dialCode}
                    </span>
                  </>
                )}
              >
                <div className="flex items-center gap-2">
                  <PhoneField.Country
                    inputPlaceholder="e.g. United Kingdom"
                    slots={liveCountrySlots}
                  />
                  <div className="min-w-0 flex-1">
                    <PhoneField.Input
                      className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-base text-gray-900 outline-none focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800 data-invalid:border-red-500 data-valid:border-emerald-500"
                      onBlur={() => setPhoneTouched(true)}
                      onValueChange={() => setPhoneTouched(true)}
                    />
                  </div>
                </div>
              </PhoneField.Root>

              <Field.Error
                match={showPhoneError}
                className="text-sm text-red-600"
              >
                {phoneErrorText}
              </Field.Error>
              <p className="text-xs text-slate-500">
                Input states are exposed via <code>data-valid</code> and{" "}
                <code>data-invalid</code>.
              </p>
            </Field.Root>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-900">
              Number Format Lens
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              Real-time outputs from <code>PhoneFieldUtils.parse</code> and{" "}
              <code>PhoneFieldUtils.isValid</code>.
            </p>
            <div className="mt-3 space-y-2">
              {formatPreview.map((row) => (
                <FormatRow
                  key={row.label}
                  label={row.label}
                  value={row.value}
                />
              ))}
              <FormatRow
                label="Validity"
                value={`${PhoneFieldUtils.isValid(value)} (value) | ${PhoneFieldUtils.isValid(
                  value.e164 ?? "",
                )} (raw)`}
              />
            </div>
          </div>
        </article>
      </section>

      <section className="relative mx-auto max-w-6xl space-y-10 px-6 pb-20">
        <article>
          <div className="flex items-center justify-between py-3">
            <h2 className="text-2xl font-black tracking-tight md:text-3xl">
              Installation
            </h2>
          </div>
          <p className="mb-4 max-w-3xl text-sm text-slate-600 md:text-base">
            Install the package with your preferred manager and copy the command
            instantly.
          </p>
          <InstallTabs className="max-w-3xl" packageName="phonefield" />
        </article>

        <DocBlock
          title="Quick Start"
          description="Minimal setup. Root can run uncontrolled by default, gives normalized output, and Input placeholder adapts to the selected country."
          code={quickStartSnippet}
        />
        <DocBlock
          title="Controlled Mode"
          description="Use this when your form or global state owns the value and you need full control over updates."
          code={controlledSnippet}
        />
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600 shadow-sm">
          Use <strong>uncontrolled</strong> for simple forms. Switch to{" "}
          <strong>controlled</strong> when external state needs to orchestrate
          validation, steps, or async flows.
        </div>
        <DocBlock
          title="Uncontrolled + FormData (Client / Server)"
          description="Set Root name to serialize the full PhoneField.Value as JSON in a hidden input. Then read it from FormData in client or server."
          code={formDataSnippet}
        />
        <DocBlock
          title="Country Subset (Type-safe IntelliSense)"
          description="Limit the available countries from Root using ISO codes."
          code={subsetSnippet}
        />
        <DocBlock
          title="Styling With Country Slots"
          description="Country styling lives in PhoneField.Country via slots, while Root and Input keep standard className styling."
          code={partsSnippet}
        />
        <DocBlock
          title="Validity States (data-valid / data-invalid)"
          description="Pair PhoneField with Base UI Field to show invalid states on the input and render clear error messages."
          code={validitySnippet}
        />
        <DocBlock
          title="Formatting + Utils"
          description="Validate and format consistently in frontend or backend through the PhoneField helper utils."
          code={formatAndUtilsSnippet}
        />
      </section>

      <footer className="relative border-t border-slate-200/80 bg-white/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm text-slate-600">
          <span>PhoneField</span>
          <a
            href="https://github.com/damianricobelli/phonefield"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700"
          >
            <Github className="size-4" aria-hidden="true" />
            GitHub
          </a>
        </div>
      </footer>
    </main>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-slate-300 bg-white/80 px-3 py-1 text-xs font-medium text-slate-700">
      {children}
    </span>
  );
}

function FormatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 break-all font-mono text-sm text-slate-900">{value}</p>
    </div>
  );
}

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

function classifyToken(token: string): TokenType {
  if (token.startsWith("//")) {
    return "comment";
  }
  if (token.startsWith('"') || token.startsWith("'") || token.startsWith("`")) {
    return "string";
  }
  if (token.startsWith("<")) {
    return "tag";
  }
  if (KEYWORDS.has(token)) {
    return "keyword";
  }
  if (KNOWN_TYPES.has(token) || /^[A-Z][A-Za-z0-9._]*$/.test(token)) {
    return "type";
  }
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

function DocBlock({
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
    <article>
      <div className="flex items-center justify-between py-3">
        <h2 className="text-2xl font-black tracking-tight md:text-3xl">
          {title}
        </h2>
      </div>
      <p className="mb-4 max-w-3xl text-sm text-slate-600 md:text-base">
        {description}
      </p>

      <pre className="overflow-auto p-4 text-sm bg-slate-950 rounded-2xl border border-slate-200 shadow-sm">
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
