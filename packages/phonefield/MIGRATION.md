# Migration guide

## v1 to v2

Version 2 replaces `PhoneField.Country`'s configuration props with composable parts, and builds field state, labels, errors, and form submit/reset handling into the field. The value model and FormData payload are unchanged, so no phone data migration is required.

### Before you start

```bash
pnpm add phonefield@^2 @base-ui/react@^1.9
```

- `@base-ui/react` must be `>=1.9.0 <2` (was `>=1.6`).
- React and React DOM stay at `>=19 <20`. The internal React 18 ref fallback is gone, and components take `ref` as a regular prop.
- Building the repository requires Node.js 22.18 or newer.

Removed `Country` props and types fail the typecheck, so start there. Two changes affect behavior without a type error: see [Behavior changes](#behavior-changes).

### Removed from `PhoneField.Country`

| v1 | v2 |
| --- | --- |
| `classNames={{ trigger, popup, … }}` | `className` on each part |
| `positioning={{ side, sideOffset, … }}` | props on `PhoneField.CountryPositioner` |
| `renderCountryValue={(c) => …}` | `<PhoneField.CountryValue>{(c) => …}</PhoneField.CountryValue>` |
| `renderCountryItem={(c) => …}` | `<PhoneField.CountryList>{(c) => <PhoneField.CountryItem country={c}>…</PhoneField.CountryItem>}</PhoneField.CountryList>` |
| `icon={<Icon />}` | `<PhoneField.CountryIcon><Icon /></PhoneField.CountryIcon>` |
| `inputPlaceholder="…"` | `labels={{ search: "…" }}` (or `placeholder` on `CountrySearch`) |
| `noResultsText="…"` | `labels={{ empty: "…" }}` (or children of `CountryEmpty`) |
| `placeholder="…"` | removed: a country is always selected |
| `slotProps.root` | props on `PhoneField.Country` (`open`, `onOpenChange`, `modal`, …) |
| `slotProps.<part>` | props on that part, e.g. `<PhoneField.CountryTrigger aria-label="Country" />` |

Removed types: `PhoneField.CountryClassNames`, `PhoneField.CountrySlotProps`, `PhoneField.CountryPositioning`, `PhoneField.RenderCountryItem`, `PhoneField.RenderCountryValue`.

`<PhoneField.Country />` with no children still renders the complete picker. Compose the parts only where you customize:

```diff
- <PhoneField.Country
-   classNames={{ trigger: "trigger", popup: "popup", item: "item" }}
-   positioning={{ side: "top" }}
-   slotProps={{ trigger: { "aria-label": "Country" } }}
- />
+ <PhoneField.Country>
+   <PhoneField.CountryTrigger className="trigger" aria-label="Country" />
+   <PhoneField.CountryPortal>
+     <PhoneField.CountryPositioner side="top">
+       <PhoneField.CountryPopup className="popup">
+         <PhoneField.CountrySearch />
+         <PhoneField.CountryEmpty />
+         <PhoneField.CountryList>
+           {(country) => (
+             <PhoneField.CountryItem country={country} className="item" />
+           )}
+         </PhoneField.CountryList>
+       </PhoneField.CountryPopup>
+     </PhoneField.CountryPositioner>
+   </PhoneField.CountryPortal>
+ </PhoneField.Country>
```

### Data slots

`phone-field-country-search-input` is now `phone-field-country-search`, and `phone-field-country-search-container` is removed (wrap `CountrySearch` yourself if you need a container). New slots: `phone-field-label`, `phone-field-group`, `phone-field-description`, `phone-field-error`, `phone-field-country-group` (with `data-preferred`), and `phone-field-country-item-indicator`.

### Field state, labels, and errors are built in

Remove manual touched, `aria-invalid`, and error-message wiring. Root is now a plain wrapper; `PhoneField.Group` is the styled shell, and `Label`, `Description`, and `Error` are linked to the input for you. Root, Group, and the field parts mirror state as `data-valid`, `data-invalid`, `data-filled`, `data-dirty`, `data-touched`, `data-focused`, `data-disabled`, `data-readonly`, `data-required`, and `data-country`. Input receives `aria-invalid` automatically.

```diff
- const [touched, setTouched] = useState(false);
- const invalid = touched && !phone.isValid;
- <label htmlFor="phone">Phone</label>
- <PhoneField.Root className={invalid ? "error" : ""}>
-   <PhoneField.Country />
-   <PhoneField.Input id="phone" aria-invalid={invalid || undefined} onBlur={() => setTouched(true)} />
- </PhoneField.Root>
- {invalid && <p>Invalid number</p>}
+ <PhoneField.Root required invalid={!!serverError}>
+   <PhoneField.Label>Phone</PhoneField.Label>
+   <PhoneField.Group className="data-invalid:border-red-500">
+     <PhoneField.Country />
+     <PhoneField.Input />
+   </PhoneField.Group>
+   <PhoneField.Error>{serverError}</PhoneField.Error>
+ </PhoneField.Root>
```

`invalid` adds an external error (server, form library); automatic validation still applies when it is `false`, so `invalid={!!serverError}` is safe.

The field now behaves like a native form control: submitting its form marks it touched, so errors show without a prior blur, and a form `reset` restores an uncontrolled field's initial value.

New Root props: `preferredCountries`, `disabled`, `readOnly`, `required`, `invalid`, `form`, `limitMaxLength`, and `render`. `className` and `style` accept a function of `PhoneField.State`. With `render={<YourComponent />}`, PhoneField's `data-slot` replaces the component's own.

### `onValueChange` details

`onValueChange` receives a second argument, `{ reason: "input" | "paste" | "country" | "undo" | "redo" }`. One-argument callbacks keep working.

### New APIs

- `PhoneField.Label`, `Group`, `Description`, and `Error` (see above).
- `Country`'s `labels={{ search, empty }}` translates the picker copy without composing it.
- `usePhoneField()` returns `{ value, state, country, countries, setCountry, setNumber }` for custom parts inside Root. `setCountry` accepts a plain ISO2 string.
- `getExampleNumber(iso2, format?)` from `phonefield/utils` returns an example number. `PhoneField.Input`'s `placeholder` accepts a function of the country: `placeholder={(c) => getExampleNumber(c.iso2)}`.

### Behavior changes

- **`limitMaxLength` defaults to `true`.** Typing or pasting more digits than any number in the country can have is ignored. Restore v1 behavior with `limitMaxLength={false}`.
- **The trigger shows flag and dial code** (`🇺🇸 +1`) instead of `🇺🇸 United States (+1)`. Its accessible name is still `United States (+1)`, so `getByRole("combobox", { name: "United States (+1)" })` keeps working, but text queries do not. Restore the old content with ``<PhoneField.CountryValue>{(c) => `${c.flag} ${c.name} (${c.dialCode})`}</PhoneField.CountryValue>``.

### Checklist

- `@base-ui/react` is 1.9 or newer.
- No `classNames`, `slotProps`, `positioning`, `icon`, copy, or `render*` props on `Country`.
- No removed `PhoneField.Country*` / `Render*` types.
- CSS uses `phone-field-country-search` instead of the old search slots, and styles the shell on `phone-field-group`.
- Manual touched, `aria-invalid`, and error wiring is replaced by `Group` and `Error`.
- `limitMaxLength={false}` is set where over-long input must be preserved.
- Tests match the trigger by role and name, not by country-name text.

## 0.x to v1

Version 1 establishes a smaller, stable public interface. The runtime value model and FormData payload remain compatible, so no phone data migration is required.

### Before you start

V1 supports React 19, React DOM 19, Base UI 1.6 or newer, and Node.js 22 or newer.

```bash
pnpm add phonefield@^1
```

Apply the five mechanical replacements below, then run your typecheck and form submission tests.

### Utilities use named exports

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

### Root owns value changes

```diff
  <PhoneField.Root onValueChange={handlePhoneChange}>
-   <PhoneField.Input onValueChange={handleNationalNumber} />
+   <PhoneField.Input onChange={handleNativeInputEvent} />
  </PhoneField.Root>
```

Use `Root.onValueChange` for the canonical phone value. Use native input events only when low-level event access is required.

### Root owns form serialization

```diff
- <PhoneField.Input name="phone" />
+ <PhoneField.Root name="phone">
+   <PhoneField.Input />
+ </PhoneField.Root>
```

This guarantees one structured FormData entry. `Input.name` is no longer accepted.

### Country customization has one seam per concern

Move part classes from `slotProps` to `classNames`, and popup geometry to `positioning`:

```diff
  <PhoneField.Country
-   slotProps={{ trigger: { className: "trigger" }, positioner: { side: "top" } }}
+   classNames={{ trigger: "trigger" }}
+   positioning={{ side: "top" }}
  />
```

`slotProps` remains available for behavioral and ARIA attributes.

### Types use the namespace

```diff
- import type { PhoneFieldValue } from "phonefield";
- let phone: PhoneFieldValue;
+ import type { PhoneField } from "phonefield";
+ let phone: PhoneField.Value;
```

The `PhoneField.*` namespace is the canonical type interface.

### Styling with stable data slots

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

### Final checklist

- No `PhoneFieldUtils` facade imports remain.
- `onValueChange` and form `name` live on `PhoneField.Root`.
- Country appearance uses `classNames`; popup geometry uses `positioning`.
- Public types use the `PhoneField.*` namespace.
- React, Base UI, and Node.js match the supported versions.
- Typecheck and form submission tests pass.
