<p align="center">
  <img src="https://img.shields.io/npm/v/phonefield?style=flat-square" alt="npm" />
  <img src="https://img.shields.io/bundlephobia/minzip/phonefield?style=flat-square" alt="size" />
  <img src="https://img.shields.io/npm/l/phonefield?style=flat-square" alt="license" />
</p>

# PhoneField

**A primitive phone input for design systems.**

Compose country picker + number input with [Base UI](https://base-ui.com), while keeping parsing and validation aligned with [libphonenumber-js](https://gitlab.com/catamphetamine/libphonenumber-js) through a clean primitive API.

- **Composable primitive** — `PhoneField.Root`, `PhoneField.Country`, `PhoneField.Input`
- **Built with Base UI** — slots, motion, and popup behavior
- **E.164 + validation** — `PhoneFieldUtils` for parse, format, and FormData

**[Demo](https://phonefield.vercel.app)** · **[GitHub](https://github.com/damianricobelli/phonefield)**

---

## Installation

```bash
# npm
npm install phonefield

# pnpm
pnpm add phonefield

# bun
bun add phonefield
```

**Peer dependencies:** `react` and `react-dom` (≥18). You also need `@base-ui/react` and `libphonenumber-js`; they are declared as dependencies of `phonefield`, so they install automatically.

---

## Emitted value

The controlled value (and what you get from FormData) has this shape:

```ts
type PhoneField.Value = {
  countryIso2: string;      // e.g. "US"
  countryDialCode: string; // e.g. "1"
  nationalNumber: string;  // e.g. "(201) 555-0123"
  e164: string | null;     // e.g. "+12015550123"
  isValid: boolean;
};
```

Store this, validate with it, and submit it.

---

## Quick Start

```tsx
import { PhoneField } from "phonefield";

export function SignupPhone() {
  return (
    <PhoneField.Root defaultCountry="US" lang="en">
      <PhoneField.Country />
      <PhoneField.Input />
    </PhoneField.Root>
  );
}
```

Root can run **uncontrolled** by default; it still gives normalized output, and the input placeholder adapts to the selected country.

---

## Controlled mode

Use when your form or global state owns the value:

```tsx
import * as React from "react";
import { PhoneField } from "phonefield";

export function CheckoutPhone() {
  const [phone, setPhone] = React.useState<PhoneField.Value>({
    countryIso2: "US",
    countryDialCode: "1",
    nationalNumber: "",
    e164: null,
    isValid: false,
  });

  return (
    <PhoneField.Root value={phone} onValueChange={setPhone}>
      <PhoneField.Country />
      <PhoneField.Input />
    </PhoneField.Root>
  );
}
```

Use **uncontrolled** for simple forms; switch to **controlled** when you need validation, multi-step flows, or async orchestration.

---

## Uncontrolled + FormData (client / server)

Set a `name` on `Root` to serialize the full `PhoneField.Value` as JSON in a hidden input. Read it from FormData on client or server.

```tsx
import { PhoneField } from "phonefield";
import { PhoneFieldUtils } from "phonefield/utils";

// Uncontrolled: omit value and onValueChange
<form
  onSubmit={(event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const phone = PhoneFieldUtils.fromFormData(formData, "phone");
    // phone -> PhoneField.Value | null
  }}
>
  <PhoneField.Root name="phone" defaultCountry="US">
    <PhoneField.Country />
    <PhoneField.Input />
  </PhoneField.Root>
</form>

// Server side:
const formData = await request.formData();
const phone = PhoneFieldUtils.fromFormData(formData, "phone");
```

---

## Country subset (type-safe)

Limit countries with an array of ISO codes; IntelliSense stays type-safe:

```tsx
<PhoneField.Root countries={["US", "CA", "MX"]}>
  <PhoneField.Country />
  <PhoneField.Input />
</PhoneField.Root>
```

---

## Styling with country slots

Country picker styling lives in `PhoneField.Country` via **slots**; `Root` and `Input` use normal `className`.

```tsx
const countrySlots: PhoneField.CountrySlots = {
  trigger: "h-10 rounded-md border border-gray-200 px-3",
  popup: "rounded-lg shadow-lg",
  item: "px-3 py-2 data-[highlighted]:bg-slate-900 data-[highlighted]:text-white",
};

<PhoneField.Root className="flex items-center gap-2">
  <PhoneField.Country slots={countrySlots} />
  <PhoneField.Input className="h-10 rounded-md border border-gray-200 px-3" />
</PhoneField.Root>
```

---

## Validity (`data-valid` / `data-invalid`)

Pair with [Base UI Field](https://base-ui.com/react/docs/components/field) for invalid state and error messages:

```tsx
import { Field } from "@base-ui/react/field";

const hasNumber = value.nationalNumber.trim().length > 0;
const showError = hasNumber && !value.isValid;

<Field.Root invalid={showError} className="space-y-2">
  <Field.Label>Phone</Field.Label>

  <PhoneField.Root value={value} onValueChange={setValue}>
    <PhoneField.Country />
    <PhoneField.Input className="data-invalid:border-red-500 data-valid:border-emerald-500" />
  </PhoneField.Root>

  <Field.Error match={showError}>Invalid phone number</Field.Error>
</Field.Root>
```

---

## Formatting + utils

Validate and format on frontend or backend with `PhoneFieldUtils`:

```tsx
import { PhoneFieldUtils } from "phonefield/utils";

const parsed = PhoneFieldUtils.parse(value);

const output = {
  isValid: PhoneFieldUtils.isValid(value),
  e164: value.e164,
  national: parsed?.formatNational(),
  international: parsed?.formatInternational(),
};

// Anywhere (frontend or backend):
PhoneFieldUtils.isValid("+14155552671");
PhoneFieldUtils.fromFormData(formData, "phone");
PhoneFieldUtils.getCountries("es-AR"); // Map<iso2, country>
```

---

## API summary

| Export | Description |
|--------|-------------|
| `PhoneField.Root` | Container; `value` / `onValueChange`, `defaultCountry`, `countries`, `name`, `lang` |
| `PhoneField.Country` | Country combobox; `slots`, `inputPlaceholder`, `renderCountryValue`, `renderCountryItem` |
| `PhoneField.Input` | Number input; `className`, `onBlur`, `onValueChange`; exposes `data-valid` / `data-invalid` |
| `PhoneFieldUtils.parse(value)` | Parse `Value` or E.164 string → libphonenumber `PhoneNumber` (formatNational, formatInternational, getURI) |
| `PhoneFieldUtils.isValid(value)` | Validate `Value` or raw string |
| `PhoneFieldUtils.fromFormData(formData, name)` | Read serialized value from FormData |
| `PhoneFieldUtils.getCountries(locale?)` | Map of ISO2 → country (name, dialCode, flag) |

---

## Development (this repo)

```bash
bun install
bun --bun run dev    # app + package watch
bun --bun run build  # production build
bun --bun run test   # Vitest
bun --bun run lint   # Biome
bun --bun run format # Biome format
```

The app at `src/routes` is the demo site; the library lives in `package/`. New UI components (e.g. Shadcn): `pnpm dlx shadcn@latest add <component>`.

---

## License

MIT · [damianricobelli/phonefield](https://github.com/damianricobelli/phonefield)
