import * as React from "react";

const PhoneInputInline = React.lazy(() =>
	import("@/blocks/phone-input-inline").then((module) => ({
		default: module.PhoneInputInline,
	})),
);
const PhoneInputSeparated = React.lazy(() =>
	import("@/blocks/phone-input-separated").then((module) => ({
		default: module.PhoneInputSeparated,
	})),
);
const PhoneInputFixedCountry = React.lazy(() =>
	import("@/blocks/phone-input-fixed-country").then((module) => ({
		default: module.PhoneInputFixedCountry,
	})),
);
const PhoneInputExtension = React.lazy(() =>
	import("@/blocks/phone-input-extension").then((module) => ({
		default: module.PhoneInputExtension,
	})),
);
const PhoneInputValidation = React.lazy(() =>
	import("@/blocks/phone-input-validation").then((module) => ({
		default: module.PhoneInputValidation,
	})),
);
const PhoneInputFormData = React.lazy(() =>
	import("@/blocks/phone-input-form-data").then((module) => ({
		default: module.PhoneInputFormData,
	})),
);
const PhoneInputReactHookForm = React.lazy(() =>
	import("@/blocks/phone-input-react-hook-form").then((module) => ({
		default: module.PhoneInputReactHookForm,
	})),
);
const PhoneInputTanStackForm = React.lazy(() =>
	import("@/blocks/phone-input-tanstack-form").then((module) => ({
		default: module.PhoneInputTanStackForm,
	})),
);
const PhoneInputStates = React.lazy(() =>
	import("@/blocks/phone-input-states").then((module) => ({
		default: module.PhoneInputStates,
	})),
);
const PhoneInputOtp = React.lazy(() =>
	import("@/blocks/phone-input-otp").then((module) => ({
		default: module.PhoneInputOtp,
	})),
);
const PhoneInputPaste = React.lazy(() =>
	import("@/blocks/phone-input-paste").then((module) => ({
		default: module.PhoneInputPaste,
	})),
);
const PhoneInputSubset = React.lazy(() =>
	import("@/blocks/phone-input-subset").then((module) => ({
		default: module.PhoneInputSubset,
	})),
);
const PhoneInputDrawer = React.lazy(() =>
	import("@/blocks/phone-input-drawer").then((module) => ({
		default: module.PhoneInputDrawer,
	})),
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
	component: React.LazyExoticComponent<React.ComponentType>;
	loadCode: () => Promise<string>;
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
		component: PhoneInputInline,
		loadCode: () =>
			import("@/blocks/phone-input-inline.tsx?raw").then(
				(module) => module.default,
			),
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
		component: PhoneInputSeparated,
		loadCode: () =>
			import("@/blocks/phone-input-separated.tsx?raw").then(
				(module) => module.default,
			),
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
		component: PhoneInputFixedCountry,
		loadCode: () =>
			import("@/blocks/phone-input-fixed-country.tsx?raw").then(
				(module) => module.default,
			),
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
		component: PhoneInputExtension,
		loadCode: () =>
			import("@/blocks/phone-input-extension.tsx?raw").then(
				(module) => module.default,
			),
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
			"Real-time required and invalid states with accessible error messaging.",
		category: "Forms",
		labels: ["field", "validation"],
		component: PhoneInputValidation,
		loadCode: () =>
			import("@/blocks/phone-input-validation.tsx?raw").then(
				(module) => module.default,
			),
		useWhen:
			"Use it in controlled forms that own validation without a form library.",
		requires: ["field", "input-group"],
		accessibility:
			"Errors are connected with aria-describedby and exposed through aria-invalid.",
	},
	{
		id: "form-data",
		title: "Server-safe FormData",
		shortTitle: "FormData",
		description:
			"Submit minimal source values and rebuild trusted derived data at the boundary.",
		category: "Forms",
		labels: ["server action", "native"],
		component: PhoneInputFormData,
		loadCode: () =>
			import("@/blocks/phone-input-form-data.tsx?raw").then(
				(module) => module.default,
			),
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
		component: PhoneInputReactHookForm,
		loadCode: () =>
			import("@/blocks/phone-input-react-hook-form.tsx?raw").then(
				(module) => module.default,
			),
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
		component: PhoneInputTanStackForm,
		loadCode: () =>
			import("@/blocks/phone-input-tanstack-form.tsx?raw").then(
				(module) => module.default,
			),
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
		component: PhoneInputStates,
		loadCode: () =>
			import("@/blocks/phone-input-states.tsx?raw").then(
				(module) => module.default,
			),
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
		component: PhoneInputOtp,
		loadCode: () =>
			import("@/blocks/phone-input-otp.tsx?raw").then(
				(module) => module.default,
			),
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
		component: PhoneInputPaste,
		loadCode: () =>
			import("@/blocks/phone-input-paste.tsx?raw").then(
				(module) => module.default,
			),
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
			"Limit supported markets and localize country names, search, and sorting.",
		category: "Mobile & localization",
		labels: ["i18n", "subset"],
		component: PhoneInputSubset,
		loadCode: () =>
			import("@/blocks/phone-input-subset.tsx?raw").then(
				(module) => module.default,
			),
		useWhen:
			"Use it when product availability is restricted to a known set of countries.",
		requires: ["field", "input-group"],
		accessibility:
			"Localized names remain searchable and visible beside their dialing codes.",
	},
	{
		id: "drawer",
		title: "Country select in a Drawer",
		shortTitle: "Drawer picker",
		description:
			"A thumb-friendly country picker designed for mobile product flows.",
		category: "Mobile & localization",
		labels: ["drawer", "mobile"],
		component: PhoneInputDrawer,
		loadCode: () =>
			import("@/blocks/phone-input-drawer.tsx?raw").then(
				(module) => module.default,
			),
		useWhen:
			"Use it on mobile-first forms where a popover would feel cramped or hard to scan.",
		requires: ["button", "drawer", "field", "input", "input-group"],
		accessibility:
			"The trigger names its purpose and the modal drawer keeps search and options reachable.",
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
