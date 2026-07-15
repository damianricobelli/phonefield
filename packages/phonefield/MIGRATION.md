# Migration to 0.3

Version 0.3 narrows the public interface before 1.0. The runtime value model and FormData payload remain compatible.

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
