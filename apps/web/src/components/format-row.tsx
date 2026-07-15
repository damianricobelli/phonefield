export function FormatRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="grid grid-cols-[7.5rem_minmax(0,1fr)] items-baseline gap-3 border-b border-white/10 py-3 last:border-b-0">
			<dt className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
				{label}
			</dt>
			<dd className="break-all text-right font-mono text-sm text-slate-100">
				{value}
			</dd>
		</div>
	);
}
