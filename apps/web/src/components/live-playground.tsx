import { Field } from "@base-ui/react/field";
import { ChevronDownIcon } from "lucide-react";
import { PhoneField } from "phonefield";
import { isValid, parse } from "phonefield/utils";
import * as React from "react";
import { FormatRow } from "@/components/format-row";

const liveCountryClassNames: PhoneField.CountryClassNames = {
	trigger:
		"group/phone-country-trigger ui-pressable flex h-11 w-fit shrink-0 cursor-default items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-left text-base text-slate-900 shadow-sm transition-colors duration-150 select-none hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-sky-600 data-[popup-open]:border-slate-300 data-[popup-open]:bg-slate-50",
	icon: "flex shrink-0 text-slate-500 transition-transform duration-150 [transition-timing-function:var(--ease-out-ui)] group-data-popup-open/phone-country-trigger:rotate-180 motion-reduce:transition-none",
	positioner: "isolate z-50",
	popup:
		"group/phone-country relative flex max-h-[min(24rem,var(--available-height))] w-72 max-w-[var(--available-width)] origin-[var(--transform-origin)] flex-col overflow-hidden rounded-xl bg-white text-slate-900 shadow-2xl shadow-slate-900/15 ring-1 ring-slate-900/5 transition-[transform,opacity] duration-150 [transition-timing-function:var(--ease-out-ui)] data-[ending-style]:scale-[0.97] data-[ending-style]:opacity-0 data-[starting-style]:scale-[0.97] data-[starting-style]:opacity-0 motion-reduce:transform-none motion-reduce:transition-none",
	searchInputContainer: "shrink-0 border-slate-100 border-b p-1.5",
	searchInput:
		"h-9 w-full rounded-lg border border-transparent bg-slate-100 px-3 text-sm font-normal text-slate-900 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/15",
	list: "min-h-0 flex-1 scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0",
	item: "relative flex w-full cursor-default items-center gap-2.5 rounded-lg py-2 pr-3 pl-3 text-sm outline-hidden select-none data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-950 data-[selected]:bg-slate-100 data-[selected]:text-slate-950",
	empty:
		"hidden w-full justify-center px-3 py-6 text-center text-sm text-slate-500 group-data-empty/phone-country:flex",
};

const SAMPLES = [
	{
		label: "US",
		value: {
			countryIso2: "US",
			countryDialCode: "+1",
			nationalNumber: "202 555 0123",
			e164: "+12025550123",
			isValid: true,
		},
	},
	{
		label: "GB",
		value: {
			countryIso2: "GB",
			countryDialCode: "+44",
			nationalNumber: "20 7946 0018",
			e164: "+442079460018",
			isValid: true,
		},
	},
	{
		label: "AR",
		value: {
			countryIso2: "AR",
			countryDialCode: "+54",
			nationalNumber: "11 4321 1234",
			e164: "+541143211234",
			isValid: true,
		},
	},
] satisfies ReadonlyArray<{ label: string; value: PhoneField.Value }>;

export function LivePlayground() {
	const [value, setValue] = React.useState<PhoneField.Value>({
		countryIso2: "US",
		countryDialCode: "+1",
		nationalNumber: "",
		e164: null,
		isValid: false,
	});
	const [phoneTouched, setPhoneTouched] = React.useState(false);

	const parsed = parse(value);
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

	return (
		<article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40">
			<header className="border-b border-slate-200 px-6 py-6 md:px-8">
				<div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
					<span className="size-1.5 rounded-full bg-emerald-500" />
					Interactive playground
				</div>
				<h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
					See every state before you ship it.
				</h2>
				<p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
					Enter a number or load a sample. The field and its canonical output
					update together.
				</p>
			</header>

			<div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)]">
				<div className="bg-slate-50/70 p-6 md:p-8 lg:border-r lg:border-slate-200">
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
							className="flex min-w-0 flex-col gap-2 sm:flex-row"
						>
							<PhoneField.Country
								inputPlaceholder="Search country"
								noResultsText="No countries found"
								classNames={liveCountryClassNames}
								icon={<ChevronDownIcon aria-hidden className="size-4" />}
								positioning={{
									side: "bottom",
									align: "start",
									sideOffset: 8,
								}}
								renderCountryValue={(country) => (
									<span className="flex min-w-0 items-center gap-2">
										<span aria-hidden>{country.flag}</span>
										<span>{country.dialCode}</span>
										<span className="sr-only">{country.name}</span>
									</span>
								)}
								renderCountryItem={(country) => (
									<span className="flex min-w-0 flex-1 items-center gap-2.5">
										<span aria-hidden className="shrink-0">
											{country.flag}
										</span>
										<span className="min-w-0 flex-1 truncate">
											{country.name}
										</span>
										<span className="shrink-0 text-slate-500">
											{country.dialCode}
										</span>
									</span>
								)}
							/>
							<PhoneField.Input
								className="h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-base text-slate-900 shadow-sm outline-none transition-colors duration-150 placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 data-invalid:border-red-500 data-invalid:ring-2 data-invalid:ring-red-500/10 data-valid:border-emerald-500 sm:flex-1"
								onBlur={() => setPhoneTouched(true)}
								onChange={() => setPhoneTouched(true)}
								placeholder="Enter phone number"
							/>
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

					<div className="mt-8 border-t border-slate-200 pt-5">
						<p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
							Load a valid sample
						</p>
						<div className="mt-3 flex flex-wrap gap-2">
							{SAMPLES.map((sample) => (
								<button
									key={sample.label}
									type="button"
									onClick={() => {
										setValue(sample.value);
										setPhoneTouched(true);
									}}
									className="ui-pressable rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-xs font-semibold text-slate-700 transition-colors duration-150 hover:border-slate-300 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
								>
									{sample.label}
								</button>
							))}
						</div>
					</div>
				</div>

				<div className="bg-slate-950 p-6 text-white md:p-8">
					<div className="flex items-start justify-between gap-4">
						<div>
							<h3 className="text-sm font-semibold text-white">
								Canonical output
							</h3>
							<p className="mt-1 text-xs leading-5 text-slate-400">
								Live values from <code>parse</code>.
							</p>
						</div>
						<span
							className={`mt-0.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
								value.isValid
									? "bg-emerald-400/10 text-emerald-300"
									: "bg-amber-400/10 text-amber-300"
							}`}
						>
							<span
								className={`size-1.5 rounded-full ${
									value.isValid ? "bg-emerald-400" : "bg-amber-400"
								}`}
							/>
							{value.isValid ? "Valid" : "Incomplete"}
						</span>
					</div>
					<dl className="mt-5 border-t border-white/10">
						{formatPreview.map((row) => (
							<FormatRow key={row.label} label={row.label} value={row.value} />
						))}
						<FormatRow
							label="Validity"
							value={isValid(value) ? "true" : "false"}
						/>
					</dl>
				</div>
			</div>
		</article>
	);
}
