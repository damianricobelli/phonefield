import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	getPrimitive,
	isPrimitive,
	type Primitive,
	primitives,
} from "@/lib/primitives";

/** Switches which headless library every recipe is written for. */
export function PrimitivePicker({
	value,
	onValueChange,
}: {
	value: Primitive;
	onValueChange: (value: Primitive) => void;
}) {
	return (
		<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
			<Tabs
				value={value}
				onValueChange={(next) => {
					if (isPrimitive(next)) onValueChange(next);
				}}
			>
				<TabsList variant="line" aria-label="Primitives library">
					{primitives.map((primitive) => (
						<TabsTrigger key={primitive.value} value={primitive.value}>
							{primitive.label}
						</TabsTrigger>
					))}
				</TabsList>
			</Tabs>
			<p className="text-xs text-slate-500">
				Recipes import from{" "}
				<code className="font-mono text-slate-700">
					{getPrimitive(value).entry}
				</code>
			</p>
		</div>
	);
}
