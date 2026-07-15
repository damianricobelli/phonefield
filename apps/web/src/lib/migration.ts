export const migrationComparisons = [
	{
		title: "Import utilities directly",
		description:
			"The dedicated PhoneFieldUtils facade is gone. Named exports tree-shake naturally; namespace imports remain available when preferred.",
		before: `import { PhoneFieldUtils } from "phonefield/utils";

const parsed = PhoneFieldUtils.parse(value);`,
		after: `import { parse } from "phonefield/utils";

const parsed = parse(value);`,
	},
	{
		title: "Listen for the complete value at Root",
		description:
			"Root is the single authority for phone state. Input still accepts native events when low-level DOM access is necessary.",
		before: `<PhoneField.Root>
  <PhoneField.Input
    onValueChange={handleNationalNumber}
  />
</PhoneField.Root>`,
		after: `<PhoneField.Root onValueChange={handlePhoneChange}>
  <PhoneField.Input
    onChange={handleNativeInputEvent}
  />
</PhoneField.Root>`,
	},
	{
		title: "Put the submission name on Root",
		description:
			"Root serializes one minimal, structured FormData value. Rebuild and validate its derived fields with fromFormData at the boundary.",
		before: `<PhoneField.Root>
  <PhoneField.Input name="phone" />
</PhoneField.Root>`,
		after: `<PhoneField.Root name="phone">
  <PhoneField.Input />
</PhoneField.Root>

const phone = fromFormData(formData, "phone");`,
	},
	{
		title: "Separate styling, positioning, and behavior",
		description:
			"Each concern now has one clear seam: classNames for appearance, positioning for geometry, and slotProps for behavior or ARIA.",
		before: `<PhoneField.Country
  slotProps={{
    trigger: { className: "trigger" },
    positioner: { side: "top" },
  }}
/>`,
		after: `<PhoneField.Country
  classNames={{ trigger: "trigger" }}
  positioning={{ side: "top" }}
  slotProps={{
    trigger: { "aria-label": "Country" },
  }}
/>`,
	},
	{
		title: "Use the PhoneField type namespace",
		description:
			"Component and domain types now live under the same discoverable namespace as the runtime primitives.",
		before: `import type { PhoneFieldValue } from "phonefield";

let phone: PhoneFieldValue;`,
		after: `import type { PhoneField } from "phonefield";

let phone: PhoneField.Value;`,
	},
] as const;
