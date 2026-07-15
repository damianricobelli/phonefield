import {
	type ApiProperty,
	countryProperties,
	inputProperties,
	rootProperties,
	utilityProperties,
} from "@/lib/api-reference";

function ApiTable({ rows }: { rows: readonly ApiProperty[] }) {
	return (
		<div className="code-scrollbar mt-4 overflow-x-auto rounded-xl border border-slate-200">
			<table className="w-full min-w-lg border-collapse text-sm">
				<thead>
					<tr className="border-b border-slate-200 bg-slate-50/80">
						{["Prop / method", "Type", "Default", "Description"].map(
							(heading) => (
								<th
									key={heading}
									className="px-4 py-3 text-left font-semibold text-slate-700"
								>
									{heading}
								</th>
							),
						)}
					</tr>
				</thead>
				<tbody className="text-slate-600">
					{rows.map((row) => (
						<tr
							key={row.name}
							className="border-b border-slate-100 last:border-0"
						>
							<td className="px-4 py-2.5 font-mono text-xs text-slate-800">
								{row.name}
							</td>
							<td className="px-4 py-2.5 font-mono text-xs">{row.type}</td>
							<td className="px-4 py-2.5">{row.defaultValue}</td>
							<td className="px-4 py-2.5">{row.description}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function ReferenceCard({
	title,
	description,
	rows,
}: {
	title: string;
	description: string;
	rows: readonly ApiProperty[];
}) {
	return (
		<article className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40 md:p-8">
			<h3 className="text-lg font-semibold tracking-tight text-slate-900">
				{title}
			</h3>
			<p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
				{description}
			</p>
			<ApiTable rows={rows} />
		</article>
	);
}

export function ComponentApiReference() {
	return (
		<>
			<ReferenceCard
				title="PhoneField.Root props"
				description="State, country scope, and form serialization. Root is the only owner of domain value changes and submission name."
				rows={rootProperties}
			/>
			<ReferenceCard
				title="PhoneField.Country props"
				description="Copy, content, styling, positioning, and advanced behavioral customization for the country picker."
				rows={countryProperties}
			/>
			<ReferenceCard
				title="PhoneField.Input props"
				description="Native input behavior and styling. Value changes and form serialization remain owned by Root."
				rows={inputProperties}
			/>
		</>
	);
}

export function UtilitiesApiReference() {
	return (
		<ReferenceCard
			title="Named utilities"
			description="Server-compatible named exports from phonefield/utils. Import the helpers you use or import * as PhoneFieldUtils."
			rows={utilityProperties}
		/>
	);
}
