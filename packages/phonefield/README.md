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
const countryClassNames = {
  trigger: "countryTrigger",
  popup: "countryPopup",
  item: "countryItem",
} satisfies PhoneField.CountryClassNames;

<PhoneField.Country classNames={countryClassNames} />;
```

For vanilla CSS and CSS Modules, every rendered part also exposes a stable, namespaced `data-slot`, including `phone-field`, `phone-field-input`, `phone-field-country-trigger`, `phone-field-country-popup`, and `phone-field-country-item`. Country popup selectors must be global because the popup is portaled.

See the documentation site for the complete API reference and a typechecked production preset.

## Version support

| Dependency | Supported |
| --- | --- |
| React / React DOM | `>=19 <20` |
| Base UI | `>=1.6 <2` |
| Node.js | `>=22` |

The supported range is deliberately narrow and tested in CI on Node.js 22 and 24. See the [migration guide](./MIGRATION.md) when upgrading from 0.x.
