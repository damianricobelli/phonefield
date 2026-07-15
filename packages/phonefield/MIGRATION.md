# Migration from 0.x to v1

Version 1 establishes a smaller, stable public interface. The runtime value model and FormData payload remain compatible, so no phone data migration is required.

## Before you start

V1 supports React 19, React DOM 19, Base UI 1.6 or newer, and Node.js 22 or newer.

```bash
pnpm add phonefield@^1
```

Apply the five mechanical replacements below, then run your typecheck and form submission tests.

## Utilities use named exports

```diff
- import { PhoneFieldUtils } from "phonefield/utils";
- PhoneFieldUtils.parse(value);
+ import { parse } from "phonefield/utils";
+ parse(value);
```

Namespace syntax is still available without a dedicated facade:

```ts
import * as PhoneFieldUtils from "phonefield/utils";

PhoneFieldUtils.parse(value);
```

Supported exports are `buildValue`, `countries`, `fromFormData`, `getCountries`, `isValid`, `parse`, and `toFormValue`. Internal normalization and country-resolution helpers are no longer package exports.

## Root owns value changes

```diff
  <PhoneField.Root onValueChange={handlePhoneChange}>
-   <PhoneField.Input onValueChange={handleNationalNumber} />
+   <PhoneField.Input onChange={handleNativeInputEvent} />
  </PhoneField.Root>
```

Use `Root.onValueChange` for the canonical phone value. Use native input events only when low-level event access is required.

## Root owns form serialization

```diff
- <PhoneField.Input name="phone" />
+ <PhoneField.Root name="phone">
+   <PhoneField.Input />
+ </PhoneField.Root>
```

This guarantees one structured FormData entry. `Input.name` is no longer accepted.

## Country customization has one seam per concern

Move part classes from `slotProps` to `classNames`, and popup geometry to `positioning`:

```diff
  <PhoneField.Country
-   slotProps={{ trigger: { className: "trigger" }, positioner: { side: "top" } }}
+   classNames={{ trigger: "trigger" }}
+   positioning={{ side: "top" }}
  />
```

`slotProps` remains available for behavioral and ARIA attributes.

## Types use the namespace

```diff
- import type { PhoneFieldValue } from "phonefield";
- let phone: PhoneFieldValue;
+ import type { PhoneField } from "phonefield";
+ let phone: PhoneField.Value;
```

The `PhoneField.*` namespace is the canonical type interface.

## Styling with stable data slots

V1 also exposes namespaced `data-slot` attributes. This is additive: continue using `classNames` for typed, per-instance classes, or target slots from global CSS.

```css
[data-slot="phone-field"] {
  display: flex;
  gap: 0.5rem;
}

[data-slot="phone-field-country-popup"] {
  transform-origin: var(--transform-origin);
}

[data-slot="phone-field-country-item"][data-highlighted] {
  background: var(--highlighted-country);
}
```

Country popup selectors must be global because Base UI renders the popup in a portal.

## Final checklist

- No `PhoneFieldUtils` facade imports remain.
- `onValueChange` and form `name` live on `PhoneField.Root`.
- Country appearance uses `classNames`; popup geometry uses `positioning`.
- Public types use the `PhoneField.*` namespace.
- React, Base UI, and Node.js match the supported versions.
- Typecheck and form submission tests pass.
