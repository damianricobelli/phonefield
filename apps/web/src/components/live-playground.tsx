import type { PhoneField } from "phonefield";
import { getExampleNumber, parse } from "phonefield/utils";
import * as React from "react";
import { CopyButton } from "@/components/copy-button";
import { HighlightedCode } from "@/components/doc-block";
import { FormatRow } from "@/components/format-row";
import {
	FieldReporter,
	type FieldSnapshot,
	StateAttributes,
} from "@/components/landing/shared";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhoneInput } from "@/examples/production-preset";
import { cn } from "@/lib/utils";

const LANGS = [
	["en", "English"],
	["es", "Español"],
	["pt-BR", "Português"],
	["de", "Deutsch"],
	["fr", "Français"],
	["ja", "日本語"],
	["ar", "العربية"],
] as const;

const COUNTRY_SETS = {
	all: { label: "All countries", codes: undefined },
	americas: {
		label: "Americas",
		codes: ["AR", "BR", "CA", "CL", "CO", "MX", "US", "UY"],
	},
	europe: {
		label: "Europe",
		codes: ["DE", "ES", "FR", "GB", "IT", "NL", "PT"],
	},
} as const satisfies Record<
	string,
	{ label: string; codes: readonly PhoneField.CountryCode[] | undefined }
>;

const PREFERRED: readonly PhoneField.CountryCode[] = ["US", "GB", "ES"];

type Options = {
	lang: string;
	countrySet: keyof typeof COUNTRY_SETS;
	preferred: boolean;
	examplePlaceholder: boolean;
	formatOnType: boolean;
	limitMaxLength: boolean;
	required: boolean;
	disabled: boolean;
	readOnly: boolean;
};

const DEFAULT_OPTIONS: Options = {
	lang: "en",
	countrySet: "all",
	preferred: true,
	examplePlaceholder: true,
	formatOnType: true,
	limitMaxLength: true,
	required: false,
	disabled: false,
	readOnly: false,
};

const TOGGLES = [
	["preferred", "preferredCountries"],
	["examplePlaceholder", "Example placeholder"],
	["formatOnType", "formatOnType"],
	["limitMaxLength", "limitMaxLength"],
	["required", "required"],
	["disabled", "disabled"],
	["readOnly", "readOnly"],
] as const satisfies readonly (readonly [keyof Options, string])[];

function toCode(options: Options) {
	const props: string[] = ['defaultCountry="US"'];
	const codes = COUNTRY_SETS[options.countrySet].codes;
	if (options.lang !== "en") props.push(`lang="${options.lang}"`);
	if (codes) props.push(`countries={${JSON.stringify(codes)}}`);
	if (options.preferred)
		props.push(`preferredCountries={${JSON.stringify(PREFERRED)}}`);
	if (!options.formatOnType) props.push("formatOnType={false}");
	if (!options.limitMaxLength) props.push("limitMaxLength={false}");
	for (const flag of ["required", "disabled", "readOnly"] as const) {
		if (options[flag]) props.push(flag);
	}
	props.push("onValueChange={(value, { reason }) => save(value)}");

	const imports = options.examplePlaceholder
		? `import { PhoneField } from "phonefield";\nimport { getExampleNumber } from "phonefield/utils";`
		: `import { PhoneField } from "phonefield";`;
	const placeholder = options.examplePlaceholder
		? "\n    placeholder={(country) => getExampleNumber(country.iso2)}"
		: "";

	return `${imports}

<PhoneField.Root
  ${props.join("\n  ")}
>
  <PhoneField.Country />
  <PhoneField.Input
    aria-label="Phone number"${placeholder}
  />
</PhoneField.Root>`;
}

function ToggleRow({
	label,
	checked,
	onCheckedChange,
}: {
	label: string;
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
}) {
	return (
		<Label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2.5 py-2 font-normal text-slate-700 transition-colors select-none hover:bg-white">
			<span className={label.includes(" ") ? "" : "font-mono text-[13px]"}>
				{label}
			</span>
			<Switch checked={checked} onCheckedChange={onCheckedChange} />
		</Label>
	);
}

const LANG_ITEMS = LANGS.map(([value, label]) => ({ value, label }));
const COUNTRY_SET_ITEMS = Object.entries(COUNTRY_SETS).map(([value, set]) => ({
	value: value as Options["countrySet"],
	label: set.label,
}));

export function LivePlayground() {
	const baseId = React.useId();
	const [options, setOptions] = React.useState<Options>(DEFAULT_OPTIONS);
	const [snapshot, setSnapshot] = React.useState<FieldSnapshot | null>(null);
	const [reason, setReason] = React.useState<PhoneField.ChangeReason | null>(
		null,
	);
	const [tab, setTab] = React.useState<"output" | "code">("output");
	const update = <Key extends keyof Options>(key: Key, value: Options[Key]) =>
		setOptions((current) => ({ ...current, [key]: value }));

	const value = snapshot?.value ?? null;
	const parsed = value ? parse(value) : undefined;
	const code = toCode(options);
	const formats = [
		["National", parsed?.formatNational()],
		["International", parsed?.formatInternational()],
		["E.164", value?.e164],
		["RFC 3966", parsed?.getURI()],
	] as const;

	return (
		<article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40">
			<header className="border-b border-slate-200 px-6 py-6 md:px-8">
				<div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
					<span className="size-1.5 rounded-full bg-emerald-500" />
					Interactive playground
				</div>
				<h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
					Flip a prop, see the field, copy the code.
				</h2>
				<p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
					Every option maps to a Root prop. The output updates from{" "}
					<code>onValueChange</code> and <code>usePhoneField</code>.
				</p>
			</header>

			<div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(22rem,1fr)]">
				<div className="bg-slate-50/70 p-6 md:p-8 lg:border-r lg:border-slate-200">
					<div>
						<PhoneInput
							label={
								<>
									Phone number
									{options.required ? (
										<span className="text-rose-600" aria-hidden="true">
											{" "}
											*
										</span>
									) : null}
								</>
							}
							description="Tab away from an incomplete number to see data-invalid."
							key={options.countrySet}
							defaultCountry="US"
							lang={options.lang}
							countries={COUNTRY_SETS[options.countrySet].codes}
							preferredCountries={options.preferred ? PREFERRED : undefined}
							formatOnType={options.formatOnType}
							limitMaxLength={options.limitMaxLength}
							required={options.required}
							disabled={options.disabled}
							readOnly={options.readOnly}
							onValueChange={(_value, details) => setReason(details.reason)}
							placeholder={
								options.examplePlaceholder
									? (country) => getExampleNumber(country.iso2)
									: "Enter phone number"
							}
						>
							<FieldReporter onChange={setSnapshot} />
						</PhoneInput>
					</div>

					<div className="mt-6 grid gap-3 sm:grid-cols-2">
						<div className="grid gap-1.5">
							<Label
								id={`${baseId}-lang`}
								className="font-mono text-xs font-medium text-slate-500"
							>
								lang
							</Label>
							<Select
								items={LANG_ITEMS}
								value={options.lang}
								onValueChange={(next) => {
									if (next) update("lang", next);
								}}
							>
								<SelectTrigger
									aria-labelledby={`${baseId}-lang`}
									className="h-9 w-full bg-white"
								>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{LANG_ITEMS.map((item) => (
										<SelectItem key={item.value} value={item.value}>
											{item.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="grid gap-1.5">
							<Label
								id={`${baseId}-countrySet`}
								className="font-mono text-xs font-medium text-slate-500"
							>
								countries
							</Label>
							<Select
								items={COUNTRY_SET_ITEMS}
								value={options.countrySet}
								onValueChange={(next) => {
									if (next) update("countrySet", next);
								}}
							>
								<SelectTrigger
									aria-labelledby={`${baseId}-countrySet`}
									className="h-9 w-full bg-white"
								>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{COUNTRY_SET_ITEMS.map((item) => (
										<SelectItem key={item.value} value={item.value}>
											{item.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<fieldset className="mt-4 grid gap-0.5 rounded-xl border border-slate-200 bg-slate-100/60 p-1 sm:grid-cols-2">
						<legend className="sr-only">Root props</legend>
						{TOGGLES.map(([key, label]) => (
							<ToggleRow
								key={key}
								label={label}
								checked={options[key]}
								onCheckedChange={(checked) => update(key, checked)}
							/>
						))}
					</fieldset>
				</div>

				<Tabs
					value={tab}
					onValueChange={(next) => setTab(next as "output" | "code")}
					className="min-w-0 gap-0 bg-slate-950 text-white"
				>
					<div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
						<TabsList
							aria-label="Playground output"
							className="bg-white/10 text-slate-400"
						>
							<TabsTrigger
								value="output"
								className="px-2.5 text-xs text-slate-400 hover:text-white data-active:bg-white/15 data-active:text-white"
							>
								Output
							</TabsTrigger>
							<TabsTrigger
								value="code"
								className="px-2.5 text-xs text-slate-400 hover:text-white data-active:bg-white/15 data-active:text-white"
							>
								Code
							</TabsTrigger>
						</TabsList>
						{tab === "code" ? (
							<CopyButton
								text={code}
								className="ml-auto h-7 border-white/10 bg-white/10 text-slate-300 shadow-none hover:bg-white/15 hover:text-white"
							/>
						) : (
							<span
								className={cn(
									"ml-auto inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
									value?.isValid
										? "bg-emerald-400/10 text-emerald-300"
										: "bg-amber-400/10 text-amber-300",
								)}
							>
								<span
									className={cn(
										"size-1.5 rounded-full",
										value?.isValid ? "bg-emerald-400" : "bg-amber-400",
									)}
								/>
								{value?.isValid ? "Valid" : "Incomplete"}
							</span>
						)}
					</div>

					<TabsContent value="output" className="space-y-6 p-6 md:p-8">
						<div>
							<h3 className="mb-3 text-xs font-semibold tracking-wide text-slate-400 uppercase">
								Root state
							</h3>
							<StateAttributes state={snapshot?.state ?? null} tone="dark" />
						</div>
						<div>
							<h3 className="mb-1 text-xs font-semibold tracking-wide text-slate-400 uppercase">
								Formats
							</h3>
							<dl>
								{formats.map(([label, formatted]) => (
									<FormatRow
										key={label}
										label={label}
										value={formatted ?? "-"}
									/>
								))}
								<FormatRow label="Last reason" value={reason ?? "-"} />
							</dl>
						</div>
					</TabsContent>
					<TabsContent value="code">
						<HighlightedCode
							code={code}
							className="max-h-none rounded-none bg-transparent"
						/>
					</TabsContent>
				</Tabs>
			</div>
		</article>
	);
}
