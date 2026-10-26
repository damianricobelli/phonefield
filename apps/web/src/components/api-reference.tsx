import type React from "react";
import {
	type ApiProperty,
	countryParts,
	countryProperties,
	fieldParts,
	hookProperties,
	inputProperties,
	rootProperties,
	rootStateAttributes,
	utilityProperties,
} from "@/lib/api-reference";

const CODE_CELL =
	"whitespace-nowrap px-4 py-2.5 font-mono text-xs text-slate-800";
const TEXT_CELL = "px-4 py-2.5";

function DataTable({
	headings,
	rows,
}: {
	headings: readonly string[];
	rows: readonly { key: string; cells: readonly React.ReactNode[] }[];
}) {
	return (
		<div className="code-scrollbar mt-4 overflow-x-auto rounded-xl border border-slate-200">
			<table className="w-full min-w-lg border-collapse text-sm">
				<thead>
					<tr className="border-b border-slate-200 bg-slate-50/80">
						{headings.map((heading) => (
							<th
								key={heading}
								className="px-4 py-3 text-left font-semibold text-slate-700"
							>
								{heading}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="text-slate-600">
					{rows.map((row) => (
						<tr
							key={row.key}
							className="border-b border-slate-100 last:border-0"
						>
							{headings.map((heading, index) => (
								<td
									key={heading}
									className={index === 0 ? CODE_CELL : TEXT_CELL}
								>
									{row.cells[index]}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function PropsTable({
	rows,
	label = "Prop",
}: {
	rows: readonly ApiProperty[];
	label?: string;
}) {
	return (
		<DataTable
			headings={[label, "Type", "Default", "Description"]}
			rows={rows.map((row) => ({
				key: row.name,
				cells: [
					row.name,
					<span className="font-mono text-xs">{row.type}</span>,
					row.defaultValue,
					row.description,
				],
			}))}
		/>
	);
}

function ReferenceCard({
	title,
	description,
	children,
}: {
	title: string;
	description: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<article className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40 md:p-8">
			<h3 className="text-lg font-semibold tracking-tight text-slate-900">
				{title}
			</h3>
			<p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
				{description}
			</p>
			{children}
		</article>
	);
}

export function ComponentApiReference() {
	return (
		<>
			<ReferenceCard
				title="PhoneField.Root"
				description="Owns the value, field state, and form serialization. Renders a plain div wrapper; every other part must be inside it."
			>
				<PropsTable rows={rootProperties} />
			</ReferenceCard>
			<ReferenceCard
				title="Root state attributes"
				description={
					<>
						Root and Group mirror <code>PhoneField.State</code> as data
						attributes, so you can style the field without tracking state. The
						same object is passed to <code>className</code> and{" "}
						<code>style</code> functions and returned by{" "}
						<code>usePhoneField().state</code>. Boolean attributes are present
						only when true.
					</>
				}
			>
				<DataTable
					headings={["Attribute", "State key", "Present when"]}
					rows={rootStateAttributes.map((row) => ({
						key: row.attribute,
						cells: [row.attribute, <code>{row.key}</code>, row.description],
					}))}
				/>
			</ReferenceCard>
			<ReferenceCard
				title="Field parts"
				description={
					<>
						Label, Group, Description, and Error take <code>className</code> and{" "}
						<code>style</code> (static or a function of{" "}
						<code>PhoneField.State</code>), <code>render</code>, and the props
						of their element. They carry the same state attributes as Root. With{" "}
						<code>render</code>, PhoneField's <code>data-slot</code> replaces
						the rendered component's own.
					</>
				}
			>
				<DataTable
					headings={["Part", "Element", "data-slot", "Behavior"]}
					rows={fieldParts.map((part) => ({
						key: part.name,
						cells: [
							part.name,
							<span className="font-mono text-xs">{part.element}</span>,
							<span className="font-mono text-xs">{part.slot}</span>,
							part.behavior,
						],
					}))}
				/>
			</ReferenceCard>
			<ReferenceCard
				title="PhoneField.Input"
				description="A Base UI Input bound to Root. Formatting, paste, undo, and length limits are handled for you."
			>
				<PropsTable rows={inputProperties} />
			</ReferenceCard>
			<ReferenceCard
				title="PhoneField.Country"
				description="A Base UI Combobox.Root whose selection is managed by Root. Without children it renders the full default anatomy, unstyled."
			>
				<PropsTable rows={countryProperties} />
			</ReferenceCard>
			<ReferenceCard
				title="Country parts"
				description={
					<>
						Each part accepts <code>className</code> and <code>style</code>{" "}
						(static or a function of the part's Base UI state),{" "}
						<code>render</code>, and the props of the Base UI part it wraps.
						Parts below Portal render outside Root, so style them directly
						rather than through Root selectors.
					</>
				}
			>
				<DataTable
					headings={["Part", "Wraps", "data-slot", "Defaults"]}
					rows={countryParts.map((part) => ({
						key: part.name,
						cells: [
							part.name,
							<span className="font-mono text-xs">{part.wraps}</span>,
							<span className="font-mono text-xs">{part.slot}</span>,
							part.defaults,
						],
					}))}
				/>
			</ReferenceCard>
			<ReferenceCard
				title="usePhoneField()"
				description={
					<>
						Reads and drives the nearest Root from your own parts: a native{" "}
						<code>select</code>, a drawer, or a status message. Must be called
						inside <code>PhoneField.Root</code>.
					</>
				}
			>
				<PropsTable rows={hookProperties} label="Field" />
			</ReferenceCard>
		</>
	);
}

export function UtilitiesApiReference() {
	return (
		<ReferenceCard
			title="phonefield/utils"
			description="Named exports that run on the client and the server. Import only what you use."
		>
			<PropsTable rows={utilityProperties} label="Export" />
		</ReferenceCard>
	);
}
