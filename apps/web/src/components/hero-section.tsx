import { ArrowRight, RotateCcw } from "lucide-react";
import { usePhoneField } from "phonefield";
import { getExampleNumber } from "phonefield/utils";
import * as React from "react";
import { CopyButton } from "@/components/copy-button";
import {
	FieldReporter,
	type FieldSnapshot,
	StateAttributes,
	usePrefersReducedMotion,
	ValuePreview,
} from "@/components/landing/shared";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/examples/production-preset";

const INSTALL = "pnpm add phonefield @base-ui/react";

type Step = {
	caption: string;
	run: (driver: DemoControls) => Promise<void>;
};

type DemoControls = {
	setCountry: (iso2: "US" | "GB" | "AR") => void;
	setNumber: (text: string) => void;
	wait: (ms: number) => Promise<void>;
};

const STEPS: readonly Step[] = [
	{
		caption: "Formats as you type",
		async run({ setCountry, setNumber, wait }) {
			setCountry("US");
			setNumber("");
			await wait(500);
			const digits = "2025550123";
			for (let index = 1; index <= digits.length; index++) {
				setNumber(digits.slice(0, index));
				await wait(110);
			}
			await wait(1600);
		},
	},
	{
		caption: "Pastes international numbers",
		async run({ setNumber, wait }) {
			setNumber("+44 20 7946 0018");
			await wait(2200);
		},
	},
	{
		caption: "Detects the country for you",
		async run({ setNumber, wait }) {
			setNumber("+54 9 11 4321-1234");
			await wait(2400);
		},
	},
];

/** Drives the field through usePhoneField(), exactly like a custom part would. */
function DemoDriver({
	playing,
	onStep,
}: {
	playing: boolean;
	onStep: (index: number) => void;
}) {
	const { setCountry, setNumber } = usePhoneField();
	const controlsRef = React.useRef({ setCountry, setNumber });
	React.useEffect(() => {
		controlsRef.current = { setCountry, setNumber };
	});

	React.useEffect(() => {
		if (!playing) return;
		let cancelled = false;
		const timers = new Set<ReturnType<typeof setTimeout>>();
		const wait = (ms: number) =>
			new Promise<void>((resolve, reject) => {
				const timer = setTimeout(() => {
					timers.delete(timer);
					if (cancelled) reject(new Error("cancelled"));
					else resolve();
				}, ms);
				timers.add(timer);
			});
		const controls: DemoControls = {
			setCountry: (iso2) => controlsRef.current.setCountry(iso2),
			setNumber: (text) => controlsRef.current.setNumber(text),
			wait,
		};

		(async () => {
			for (let round = 0; round < 3 && !cancelled; round++) {
				for (const [index, step] of STEPS.entries()) {
					if (cancelled) return;
					onStep(index);
					await step.run(controls);
				}
			}
		})().catch(() => undefined);

		return () => {
			cancelled = true;
			for (const timer of timers) clearTimeout(timer);
		};
	}, [onStep, playing]);

	return null;
}

function HeroDemo() {
	const reducedMotion = usePrefersReducedMotion();
	const [interacted, setInteracted] = React.useState(false);
	const [run, setRun] = React.useState(0);
	const [step, setStep] = React.useState(0);
	const [snapshot, setSnapshot] = React.useState<FieldSnapshot | null>(null);
	const playing = !reducedMotion && !interacted;
	const handleStep = React.useCallback((index: number) => setStep(index), []);

	return (
		<div
			className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 lg:rounded-3xl"
			onPointerDownCapture={() => setInteracted(true)}
			onKeyDownCapture={() => setInteracted(true)}
		>
			<div className="flex h-11 items-center justify-between gap-3 border-b border-slate-100 px-4">
				<div className="flex min-w-0 items-center gap-2">
					<span
						className={`size-1.5 shrink-0 rounded-full ${playing ? "animate-pulse bg-emerald-500" : "bg-slate-300"}`}
						aria-hidden="true"
					/>
					<span
						key={playing ? step : "you"}
						className="hero-caption truncate text-xs font-medium text-slate-600"
						aria-live="polite"
					>
						{playing ? STEPS[step]?.caption : "Your turn — type or paste"}
					</span>
				</div>
				{!playing && !reducedMotion ? (
					<Button
						type="button"
						variant="ghost"
						size="xs"
						onClick={(event) => {
							event.stopPropagation();
							setInteracted(false);
							setRun((count) => count + 1);
						}}
						onPointerDownCapture={(event) => event.stopPropagation()}
						className="text-muted-foreground"
					>
						<RotateCcw data-icon="inline-start" aria-hidden="true" />
						Replay
					</Button>
				) : null}
			</div>

			<div className="space-y-3 p-5 sm:p-6">
				<PhoneInput
					key={run}
					label="Phone number"
					defaultCountry="US"
					preferredCountries={["US", "GB", "AR"]}
					placeholder={(country) => getExampleNumber(country.iso2)}
				>
					<FieldReporter onChange={setSnapshot} />
					<DemoDriver playing={playing} onStep={handleStep} />
				</PhoneInput>
				<StateAttributes state={snapshot?.state ?? null} className="pt-1" />
			</div>

			<div className="border-t border-slate-800 bg-slate-950 px-5 py-4 sm:px-6">
				<div className="mb-2 flex items-center justify-between">
					<span className="font-mono text-[11px] text-slate-500">
						onValueChange(value)
					</span>
					<span
						className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
							snapshot?.value.isValid
								? "bg-emerald-400/10 text-emerald-300"
								: "bg-slate-800 text-slate-400"
						}`}
					>
						{snapshot?.value.isValid ? "Valid" : "Incomplete"}
					</span>
				</div>
				<ValuePreview value={snapshot?.value ?? null} className="min-h-42" />
			</div>
		</div>
	);
}

export function HeroSection() {
	return (
		<section className="relative mx-auto max-w-6xl px-5 pb-16 pt-12 sm:px-6 md:pb-24 md:pt-20 lg:pt-24">
			<div className="grid items-center gap-12 lg:grid-cols-[1fr_0.95fr] lg:gap-16">
				<div className="flex min-w-0 flex-col justify-center">
					<a
						href="#features"
						className="ui-pressable inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white/80 py-1 pr-3 pl-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur transition-colors hover:border-slate-300 hover:text-slate-900"
					>
						<span className="rounded-full bg-slate-950 px-2 py-0.5 text-[11px] font-semibold text-white">
							v2.0
						</span>
						Composable parts, field state, and a new hook
						<ArrowRight className="size-3" aria-hidden="true" />
					</a>

					<h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.04] tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-[4rem]">
						The phone input your design system deserves.
					</h1>

					<p className="mt-6 max-w-xl text-base leading-7 text-slate-600 md:text-lg md:leading-8">
						Accessible Base UI primitives with canonical libphonenumber output.
						Works with zero config, composes down to every part, and styles with
						plain <code className="text-[0.9em]">className</code>.
					</p>

					<div className="mt-8 flex flex-wrap items-center gap-3">
						<a
							href="#playground"
							className="ui-pressable inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition-colors duration-150 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
						>
							Try the playground
							<ArrowRight className="size-4" aria-hidden="true" />
						</a>
						<a
							href="/#documentation"
							className="ui-pressable inline-flex h-11 items-center rounded-xl border border-slate-300 bg-white/85 px-5 text-sm font-semibold text-slate-700 shadow-sm transition-colors duration-150 hover:border-slate-400 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
						>
							Read docs
						</a>
					</div>

					<div className="mt-8 flex w-full max-w-md items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/80 py-1.5 pr-1.5 pl-4 shadow-sm backdrop-blur">
						<code className="truncate text-[13px] text-slate-700">
							<span className="select-none text-slate-400">$ </span>
							{INSTALL}
						</code>
						<CopyButton text={INSTALL} className="h-8 shrink-0" />
					</div>
				</div>

				<div className="relative min-w-0">
					<div
						aria-hidden="true"
						className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(closest-side,rgba(56,189,248,0.18),transparent)]"
					/>
					<HeroDemo />
				</div>
			</div>
		</section>
	);
}
