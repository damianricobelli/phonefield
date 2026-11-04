import * as React from "react";
import { type Primitive, primitives } from "@/lib/primitives";

type BlockModule = Record<string, React.ComponentType>;

// Every recipe ships one file per adapter: src/blocks/<primitive>/<block>.tsx.
const blockModules = import.meta.glob<BlockModule>([
	"../blocks/*/*.tsx",
	"!../blocks/**/*.test.tsx",
]);
const blockSources = import.meta.glob<string>(
	["../blocks/*/*.tsx", "!../blocks/**/*.test.tsx"],
	{ query: "?raw", import: "default" },
);

export type RecipeCategory =
	| "Basics"
	| "Forms"
	| "Product flows"
	| "Mobile & localization";

export type Recipe = {
	id: string;
	title: string;
	shortTitle: string;
	description: string;
	category: RecipeCategory;
	labels: readonly string[];
	/** File name in `src/blocks/<primitive>/`, one per adapter. */
	block: string;
	/** Component exported by every variant of the block. */
	exportName: string;
	useWhen: string;
	requires: readonly string[];
	accessibility: string;
};

export const recipes = [
	{
		id: "inline",
		title: "Inline country select",
		shortTitle: "Inline select",
		description:
			"One visual field with separate accessible country and phone controls.",
		category: "Basics",
		labels: ["default", "shadcn"],
		block: "phone-input-inline",
		exportName: "PhoneInputInline",
		useWhen:
			"Use this as the default for profiles, contact forms, and account settings.",
		requires: ["field", "input-group"],
		accessibility:
			"Country and phone keep independent names while sharing one visual boundary.",
	},
	{
		id: "separated",
		title: "Separated country select",
		shortTitle: "Separated select",
		description:
			"Country and phone retain their own visual boundaries for dense forms.",
		category: "Basics",
		labels: ["checkout", "responsive"],
		block: "phone-input-separated",
		exportName: "PhoneInputSeparated",
		useWhen:
			"Use it when labels and column alignment matter more than compactness.",
		requires: ["field", "input"],
		accessibility: "Each control has its own visible label and focus target.",
	},
	{
		id: "fixed-country",
		title: "Fixed country",
		shortTitle: "Fixed country",
		description:
			"Remove the picker when the product already knows the supported market.",
		category: "Basics",
		labels: ["single market", "simple"],
		block: "phone-input-fixed-country",
		exportName: "PhoneInputFixedCountry",
		useWhen:
			"Use it for market-specific products or tenant-level country policies.",
		requires: ["field", "input-group"],
		accessibility:
			"The dialing code remains visible even though it is not interactive.",
	},
	{
		id: "extension",
		title: "Phone with extension",
		shortTitle: "With extension",
		description:
			"Collect an office extension without mixing it into the canonical phone value.",
		category: "Basics",
		labels: ["business", "extension"],
		block: "phone-input-extension",
		exportName: "PhoneInputExtension",
		useWhen:
			"Use it for business contacts, support desks, and PBX-backed phone records.",
		requires: ["field", "input-group"],
		accessibility:
			"Phone and extension have independent labels, values, and input modes.",
	},
	{
		id: "validation",
		title: "Validated field",
		shortTitle: "Validation",
		description:
			"Required and invalid states read from the field itself, with accessible error messaging.",
		category: "Forms",
		labels: ["field", "validation"],
		block: "phone-input-validation",
		exportName: "PhoneInputValidation",
		useWhen:
			"Use it when the field owns validation and no form library is involved.",
		requires: ["field", "input-group"],
		accessibility:
			"The message is linked with aria-describedby, and aria-invalid follows the field state automatically.",
	},
	{
		id: "form-data",
		title: "Server-safe FormData",
		shortTitle: "FormData",
		description:
			"Submit minimal source values and rebuild trusted derived data at the boundary.",
		category: "Forms",
		labels: ["server action", "native"],
		block: "phone-input-form-data",
		exportName: "PhoneInputFormData",
		useWhen:
			"Use it for native forms, server actions, or progressively enhanced submissions.",
		requires: ["field", "input-group"],
		accessibility:
			"The visible field remains native while hidden source inputs serialize the value.",
	},
	{
		id: "react-hook-form",
		title: "React Hook Form + Zod",
		shortTitle: "React Hook Form",
		description:
			"Controller-based integration with Standard Schema validation on every change.",
		category: "Forms",
		labels: ["rhf", "zod"],
		block: "phone-input-react-hook-form",
		exportName: "PhoneInputReactHookForm",
		useWhen:
			"Use it when React Hook Form owns the complete form state and submission lifecycle.",
		requires: [
			"react-hook-form",
			"@hookform/resolvers",
			"zod",
			"field",
			"input-group",
		],
		accessibility:
			"Controller forwards blur, value changes, invalid state, and the Zod message.",
	},
	{
		id: "tanstack-form",
		title: "TanStack Form + Zod",
		shortTitle: "TanStack Form",
		description:
			"Type-safe field composition using TanStack Form's Standard Schema support.",
		category: "Forms",
		labels: ["tanstack", "zod"],
		block: "phone-input-tanstack-form",
		exportName: "PhoneInputTanStackForm",
		useWhen:
			"Use it for deeply typed or highly reactive forms built around TanStack's ecosystem.",
		requires: ["@tanstack/react-form", "zod", "field", "input-group"],
		accessibility:
			"Field meta drives real-time aria-invalid and a colocated error announcement.",
	},
	{
		id: "states",
		title: "Disabled, read-only, and loading",
		shortTitle: "Field states",
		description:
			"Production states that preserve visual structure and communicate availability.",
		category: "Forms",
		labels: ["states", "a11y"],
		block: "phone-input-states",
		exportName: "PhoneInputStates",
		useWhen:
			"Use these patterns for permissions, persisted values, and async mutations.",
		requires: ["field", "input-group"],
		accessibility:
			"Native disabled/readOnly semantics are paired with visible status affordances.",
	},
	{
		id: "verification",
		title: "Phone verification flow",
		shortTitle: "Verification / OTP",
		description:
			"A complete phone-to-OTP interaction with editable and verified states.",
		category: "Product flows",
		labels: ["otp", "multi-step"],
		block: "phone-input-otp",
		exportName: "PhoneInputOtp",
		useWhen:
			"Use it for sign-in, onboarding, account recovery, and phone verification.",
		requires: ["button", "card", "field", "input-group", "input-otp"],
		accessibility:
			"Each step exposes a single task, preserves the phone value, and labels the OTP slots.",
	},
	{
		id: "paste",
		title: "International paste detection",
		shortTitle: "Paste detection",
		description:
			"Pasting an international number updates country and normalized output.",
		category: "Product flows",
		labels: ["paste", "e.164"],
		block: "phone-input-paste",
		exportName: "PhoneInputPaste",
		useWhen:
			"Use it when users frequently paste numbers from contacts, CRMs, or messages.",
		requires: ["field", "input-group"],
		accessibility:
			"Country changes are reflected in visible text, not communicated by flag alone.",
	},
	{
		id: "subset",
		title: "Localized country subset",
		shortTitle: "Localized subset",
		description:
			"Limit supported markets, pin the key ones, and localize country names, search, and sorting.",
		category: "Mobile & localization",
		labels: ["i18n", "subset"],
		block: "phone-input-subset",
		exportName: "PhoneInputSubset",
		useWhen:
			"Use it when product availability is restricted to a known set of countries.",
		requires: ["field", "input-group"],
		accessibility:
			"Localized names remain searchable and visible beside their dialing codes.",
	},
	{
		id: "native-select",
		title: "Native country select",
		shortTitle: "Native select",
		description:
			"Drive the field from a plain <select> with usePhoneField, no popup required.",
		category: "Mobile & localization",
		labels: ["native", "usePhoneField"],
		block: "phone-input-native-select",
		exportName: "PhoneInputNativeSelect",
		useWhen:
			"Use it when the platform picker beats a custom popup, such as in mobile web or embedded webviews.",
		requires: ["field", "input-group"],
		accessibility:
			"A real select keeps native keyboard, screen reader, and touch behavior for the country.",
	},
	{
		id: "drawer",
		title: "Country select in a Drawer",
		shortTitle: "Drawer picker",
		description:
			"A thumb-friendly country picker designed for mobile product flows.",
		category: "Mobile & localization",
		labels: ["drawer", "mobile"],
		block: "phone-input-drawer",
		exportName: "PhoneInputDrawer",
		useWhen:
			"Use it on mobile-first forms where a popover would feel cramped or hard to scan.",
		requires: ["button", "drawer", "field", "input", "input-group"],
		accessibility:
			"The trigger names its purpose and the current country, and the modal drawer keeps search and options reachable.",
	},
] as const satisfies readonly Recipe[];

export type RecipeId = (typeof recipes)[number]["id"];

export const recipeCategories = [
	"Basics",
	"Forms",
	"Product flows",
	"Mobile & localization",
] as const satisfies readonly RecipeCategory[];

export const featuredRecipeIds = [
	"inline",
	"react-hook-form",
	"drawer",
] as const satisfies readonly RecipeId[];

export function findRecipe(id: RecipeId) {
	const recipe = recipes.find((item) => item.id === id);
	if (!recipe) throw new Error(`Unknown recipe: ${id}`);
	return recipe;
}

export type RecipeVariant = {
	component: React.LazyExoticComponent<React.ComponentType>;
	loadCode: () => Promise<string>;
};

function createVariant(recipe: Recipe, primitive: Primitive): RecipeVariant {
	const path = `../blocks/${primitive}/${recipe.block}.tsx`;
	const loadModule = blockModules[path];
	const loadSource = blockSources[path];
	if (!loadModule || !loadSource) {
		throw new Error(`Missing ${primitive} variant for recipe ${recipe.id}`);
	}
	return {
		component: React.lazy(() =>
			loadModule().then((module) => {
				const component = module[recipe.exportName];
				if (!component) {
					throw new Error(`${path} does not export ${recipe.exportName}`);
				}
				return { default: component };
			}),
		),
		loadCode: loadSource,
	};
}

// Created once per recipe and adapter, so lazy components keep their identity.
const recipeVariants = new Map<string, Map<Primitive, RecipeVariant>>(
	recipes.map((recipe) => [
		recipe.id,
		new Map(
			primitives.map(({ value }) => [value, createVariant(recipe, value)]),
		),
	]),
);

export function getRecipeVariant(recipe: Recipe, primitive: Primitive) {
	const variant = recipeVariants.get(recipe.id)?.get(primitive);
	if (!variant) throw new Error(`Unknown recipe: ${recipe.id}`);
	return variant;
}
