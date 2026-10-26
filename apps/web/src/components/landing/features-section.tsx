import { ClipboardPaste, Globe2, Ruler, Undo2 } from "lucide-react";
import { PhoneField, usePhoneField } from "phonefield";
import { getCountries, getExampleNumber } from "phonefield/utils";
import * as React from "react";
import {
	FieldReporter,
	type FieldSnapshot,
	StateAttributes,
} from "@/components/landing/shared";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PhoneInput } from "@/examples/production-preset";
import { cn } from "@/lib/utils";

function FeatureCard({
	icon: Icon,
	title,
	description,
	children,
	className,
}: {
	icon?: React.ComponentType<{ className?: string }>;
	title: string;
	description: React.ReactNode;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<article
			className={cn(
				"flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50 sm:p-6",
				className,
			)}
		>
			<div className="flex items-center gap-2">
				{Icon ? (
					<Icon className="size-4 text-sky-600" aria-hidden="true" />
				) : null}
				<h3 className="text-sm font-semibold text-slate-950">{title}</h3>
			</div>
			<p className="mt-1.5 text-sm leading-6 text-slate-600">{description}</p>
			<div className="mt-5 flex flex-1 flex-col justify-end gap-3">
				{children}
			</div>
		</article>
	);
}

/* ------------------------------- Field state ------------------------------ */

function FieldStateDemo() {
	const [snapshot, setSnapshot] = React.useState<FieldSnapshot | null>(null);
	return (
		<FeatureCard
			title="Field state, for free"
			description={
				<>
					Root mirrors its state as data attributes, so validation styling is
					one class away: <code>data-invalid:border-destructive</code>. Type an
					incomplete number, then tab away. The error message is{" "}
					<code>&lt;PhoneField.Error /&gt;</code>.
				</>
			}
			className="md:col-span-2"
		>
			<div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center">
				<PhoneInput
					label="Phone number"
					defaultCountry="GB"
					required
					placeholder={(country) => getExampleNumber(country.iso2)}
					className="min-h-24 content-start"
				>
					<FieldReporter onChange={setSnapshot} />
				</PhoneInput>
				<StateAttributes state={snapshot?.state ?? null} />
			</div>
		</FeatureCard>
	);
}

/* ---------------------------------- Paste --------------------------------- */

const CLIPBOARD = [
	{ label: "+44 20 7946 0018", text: "+44 20 7946 0018" },
	{ label: "+81 90-1234-5678", text: "+81 90-1234-5678" },
	{ label: "+55 11 91234-5678", text: "+55 11 91234-5678" },
] as const;

function PasteButtons() {
	const { setNumber } = usePhoneField();
	return (
		<div className="flex flex-wrap gap-1.5">
			{CLIPBOARD.map((item) => (
				<Button
					key={item.text}
					type="button"
					variant="outline"
					size="xs"
					onClick={() => setNumber(item.text)}
					className="border-dashed font-mono text-[11px]"
				>
					<ClipboardPaste
						data-icon="inline-start"
						className="text-muted-foreground"
						aria-hidden="true"
					/>
					{item.label}
				</Button>
			))}
		</div>
	);
}

function PasteDemo() {
	return (
		<FeatureCard
			icon={ClipboardPaste}
			title="Paste anything"
			description="International numbers pick their country and collapse to national format. Click a clipboard chip."
		>
			<PhoneInput defaultCountry="US">
				{/* Any part inside Root can drive the field with usePhoneField(). */}
				<PasteButtons />
			</PhoneInput>
		</FeatureCard>
	);
}

/* --------------------------------- Length --------------------------------- */

function LengthDemo() {
	const [limit, setLimit] = React.useState(true);
	return (
		<FeatureCard
			icon={Ruler}
			title="Never too long"
			description="Digits past the longest possible number for the country are rejected as you type or paste."
		>
			<PhoneInput
				key={String(limit)}
				defaultValue={{ countryIso2: "US", nationalNumber: "2025550123" }}
				limitMaxLength={limit}
			/>
			<Label className="w-fit cursor-pointer gap-2 font-normal text-xs text-slate-600">
				<Switch size="sm" checked={limit} onCheckedChange={setLimit} />
				<code>limitMaxLength</code>
			</Label>
		</FeatureCard>
	);
}

/* --------------------------------- Locale --------------------------------- */

const LANGS = [
	{ lang: "en", label: "English" },
	{ lang: "es", label: "Español" },
	{ lang: "de", label: "Deutsch" },
	{ lang: "ja", label: "日本語" },
	{ lang: "ar", label: "العربية" },
] as const;

function LocaleDemo() {
	const [lang, setLang] = React.useState<string>("es");
	const preview = React.useMemo(
		() =>
			(["DE", "JP", "US", "ES"] as const).map(
				(iso2) => getCountries(lang).get(iso2)?.name,
			),
		[lang],
	);
	return (
		<FeatureCard
			icon={Globe2}
			title="Speaks every language"
			description={
				<>
					<code>lang</code> localizes names, sorting, and search through{" "}
					<code>Intl</code>. No translation files.
				</>
			}
		>
			<ToggleGroup
				aria-label="Language"
				size="sm"
				variant="outline"
				spacing={1}
				value={[lang]}
				onValueChange={(next) => {
					if (next[0]) setLang(next[0]);
				}}
				className="flex-wrap"
			>
				{LANGS.map((option) => (
					<ToggleGroupItem
						key={option.lang}
						value={option.lang}
						className="text-xs"
					>
						{option.label}
					</ToggleGroupItem>
				))}
			</ToggleGroup>
			<p className="truncate text-xs text-slate-500" dir="auto">
				{preview.join(" · ")}
			</p>
			<PhoneInput lang={lang} defaultCountry="DE" />
		</FeatureCard>
	);
}

/* ---------------------------------- Undo ---------------------------------- */

function Kbd({ children }: { children: React.ReactNode }) {
	return (
		<kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-slate-200 border-b-2 bg-white px-1 font-sans text-[11px] text-slate-600">
			{children}
		</kbd>
	);
}

function UndoDemo() {
	return (
		<FeatureCard
			icon={Undo2}
			title="Undo that"
			description={
				<>
					Native-feeling history over formatted values: <Kbd>⌘</Kbd>
					<Kbd>Z</Kbd> undoes a typing run, a paste, or a country change as one
					step.
				</>
			}
		>
			<PhoneInput
				defaultValue={{ countryIso2: "ES", nationalNumber: "612 34 56 78" }}
			/>
		</FeatureCard>
	);
}

/* ------------------------------ Custom picker ----------------------------- */

function CountrySelect() {
	const { country, countries, setCountry } = usePhoneField();
	const items = React.useMemo(
		() =>
			countries.map((option) => ({
				value: option.iso2,
				label: `${option.flag} ${option.dialCode}`,
			})),
		[countries],
	);
	return (
		<Select
			items={items}
			value={country.iso2}
			onValueChange={(iso2) => {
				if (iso2) setCountry(iso2);
			}}
		>
			<SelectTrigger
				aria-label={`Country: ${country.name}`}
				className="h-full shrink-0 rounded-none border-0 border-input border-r bg-transparent px-3 focus-visible:ring-0 focus-visible:bg-accent"
			>
				<SelectValue />
			</SelectTrigger>
			<SelectContent
				align="start"
				alignItemWithTrigger={false}
				className="max-h-72 w-64"
			>
				{countries.map((option) => (
					<SelectItem key={option.iso2} value={option.iso2}>
						<span aria-hidden>{option.flag}</span>
						<span className="min-w-0 flex-1 truncate">{option.name}</span>
						<span className="text-muted-foreground tabular-nums">
							{option.dialCode}
						</span>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

const CUSTOM_PICKER_SNIPPET = `import { usePhoneField } from "phonefield";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function CountrySelect() {
  const { country, countries, setCountry } = usePhoneField();
  return (
    <Select value={country.iso2} onValueChange={setCountry}>
      <SelectTrigger><SelectValue /></SelectTrigger>
      <SelectContent>
        {countries.map((c) => (
          <SelectItem key={c.iso2} value={c.iso2}>{c.flag} {c.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}`;

function CustomPickerDemo() {
	return (
		<FeatureCard
			title="Bring your own picker"
			description={
				<>
					<code>usePhoneField()</code> gives custom parts the value, state, and
					setters, so any picker can drive the field. Here: shadcn&apos;s{" "}
					<code>Select</code> in place of the built-in combobox.
				</>
			}
			className="md:col-span-2 lg:col-span-3"
		>
			<div className="grid gap-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center">
				<PhoneField.Root
					defaultCountry="FR"
					className="flex h-10 w-full min-w-0 items-stretch overflow-hidden rounded-lg border border-input bg-background shadow-xs transition-[border-color,box-shadow] duration-150 data-focused:border-ring data-focused:ring-3 data-focused:ring-ring/40"
				>
					<CountrySelect />
					<PhoneField.Input
						aria-label="Phone number"
						className="h-full min-w-0 flex-1 bg-transparent px-3 text-base tabular-nums outline-none md:text-sm"
					/>
				</PhoneField.Root>
				<pre className="code-scrollbar overflow-x-auto rounded-xl bg-slate-950 p-4 font-mono text-[11.5px] leading-5 text-slate-300">
					<code>{CUSTOM_PICKER_SNIPPET}</code>
				</pre>
			</div>
		</FeatureCard>
	);
}

/* --------------------------------- Section -------------------------------- */

export function FeaturesSection() {
	return (
		<section
			id="features"
			className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-20 sm:px-6 lg:pb-28"
		>
			<div className="max-w-2xl">
				<p className="text-xs font-semibold tracking-[0.18em] text-sky-700 uppercase">
					What it handles
				</p>
				<h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
					The details you&apos;d rather not build twice.
				</h2>
				<p className="mt-3 text-base leading-7 text-slate-600">
					Every card below is the real component. Poke at it.
				</p>
			</div>

			<div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<FieldStateDemo />
				<PasteDemo />
				<LengthDemo />
				<LocaleDemo />
				<UndoDemo />
				<CustomPickerDemo />
			</div>
		</section>
	);
}
