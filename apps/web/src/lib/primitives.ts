/** Headless libraries PhoneField ships an adapter for, in display order. */
export const primitives = [
	{
		value: "base-ui",
		label: "Base UI",
		entry: "phonefield",
		packageName: "@base-ui/react",
	},
	{
		value: "react-aria",
		label: "React Aria",
		entry: "phonefield/react-aria",
		packageName: "react-aria-components",
	},
	{
		value: "radix",
		label: "Radix UI",
		entry: "phonefield/radix",
		packageName: "radix-ui",
	},
] as const;

export type Primitive = (typeof primitives)[number]["value"];

export const DEFAULT_PRIMITIVE: Primitive = "base-ui";

export function isPrimitive(value: unknown): value is Primitive {
	return primitives.some((primitive) => primitive.value === value);
}

export function getPrimitive(value: Primitive) {
	return (
		primitives.find((primitive) => primitive.value === value) ?? primitives[0]
	);
}
