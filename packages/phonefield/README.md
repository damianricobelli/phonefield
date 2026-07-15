# phonefield

A composable, accessible React phone-field primitive for design systems.

[Full documentation and playground](https://phonefield.vercel.app) · [Migration guide](./MIGRATION.md)

## Install

```bash
pnpm add phonefield
```

Requires React 19, React DOM 19, Base UI 1.6 or newer, and Node.js 22 or newer.

## Quick start

```tsx
import { PhoneField } from "phonefield";

<PhoneField.Root defaultCountry="US" lang="en">
  <PhoneField.Country />
  <PhoneField.Input aria-label="Phone number" />
</PhoneField.Root>;
```

The compound interface intentionally has one authority for each concern:

- `Root` owns `value`, `defaultValue`, `onValueChange`, and form `name`.
- `Country` owns country selection and popup customization.
- `Input` owns native input attributes, events, and styling.

## Controlled

```tsx
const [phone, setPhone] = useState<PhoneField.InputValue>({
  countryIso2: "US",
  nationalNumber: "",
});

<PhoneField.Root value={phone} onValueChange={setPhone}>
  <PhoneField.Country />
  <PhoneField.Input aria-label="Phone number" />
</PhoneField.Root>;
```

`onValueChange` emits a canonical `PhoneField.Value` with `countryDialCode`, `e164`, and `isValid`.

## International paste

When input begins with `+`, PhoneField parses it as an international number. If
the detected country is available, Root selects it automatically and Input keeps
only its nationally formatted number. For example, pasting
`+44 20 7946 0018` selects the United Kingdom and displays `020 7946 0018`.

When `countries` excludes the detected country, PhoneField preserves the pasted
text and emits an invalid value with `e164: null` instead of reinterpreting those
digits as a number from the currently selected country.

## FormData

```tsx
import { fromFormData } from "phonefield/utils";

<PhoneField.Root name="phone">
  <PhoneField.Country />
  <PhoneField.Input aria-label="Phone number" />
</PhoneField.Root>;

const phone = fromFormData(formData, "phone");
```

## Utilities

```ts
import {
  buildValue,
  countries,
  fromFormData,
  getCountries,
  isValid,
  parse,
  toFormValue,
} from "phonefield/utils";
```

All utility exports work on client and server. Namespace-style usage remains available through `import * as PhoneFieldUtils from "phonefield/utils"`.

## Customization

- `classNames` styles country-picker parts.
- `positioning` controls popup geometry.
- renderers customize country content.
- `slotProps` forwards advanced behavioral and ARIA props without duplicating styling or positioning.

Define `classNames` once in your design-system wrapper instead of repeating it at every call site:

```tsx
import { inputClassName } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PhoneField } from "phonefield";

const countryClassNames = {
  trigger:
    "group/phone-country-trigger flex h-full w-fit items-center gap-2 border-r border-input px-3",
  icon: "group-data-popup-open/phone-country-trigger:rotate-180",
  popup: "w-72 origin-(--transform-origin) rounded-lg bg-popover shadow-2xl",
  item: "rounded-lg px-3 py-2 data-highlighted:bg-accent",
} satisfies PhoneField.CountryClassNames;

<PhoneField.Root
  className={cn(
    "flex h-10 min-w-0 overflow-hidden rounded-lg border border-input bg-background",
    "focus-within:ring-2 focus-within:ring-ring",
    "has-data-popup-open:ring-2 has-data-popup-open:ring-ring",
    "has-aria-invalid:border-destructive has-aria-invalid:ring-2",
  )}
>
  <PhoneField.Country
    classNames={countryClassNames}
    slotProps={{ trigger: { "aria-label": "Country" } }}
  />
  <PhoneField.Input
    aria-label="Phone number"
    className={cn(
      inputClassName,
      "h-full w-auto min-w-0 flex-1 rounded-none border-0 focus-visible:ring-0",
    )}
  />
</PhoneField.Root>;
```

This looks like one field, while remaining two accessible controls: a country selector and a telephone input. Put the shared border, focus ring, invalid state, and sizing on `Root`; remove the duplicated border and ring from the inline controls.

Give the telephone input a native `<label>` (or its own `aria-label`) and give the country trigger an independent accessible name through `slotProps.trigger`. Do not wrap the complete compound component in one Base UI `Field.Root`: a field represents one form control, while `PhoneField` contains two interactive controls.

For Tailwind, `Root.className` plus `classNames` is the recommended combination. Use `cn` to merge shared design-system tokens, and named `group` variants only for state relationships inside a slot. A group on `PhoneField.Root` cannot reach the country popup because Base UI renders it in a portal, so `CountryClassNames` remains the explicit styling seam for popup parts.

For vanilla CSS and CSS Modules, every rendered part also exposes a stable, namespaced `data-slot`, including `phone-field`, `phone-field-input`, `phone-field-country-trigger`, `phone-field-country-popup`, and `phone-field-country-item`. Country popup selectors must be global because the popup is portaled.

See the documentation site for the complete API reference and a typechecked production preset.

## Version support

| Dependency | Supported |
| --- | --- |
| React / React DOM | `>=19 <20` |
| Base UI | `>=1.6 <2` |
| Node.js | `>=22` |

The supported range is deliberately narrow and tested in CI on Node.js 22 and 24. See the [migration guide](./MIGRATION.md) when upgrading from 0.x.
