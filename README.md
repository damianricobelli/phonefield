# PhoneField

**Composable phone field primitive built with Base UI and libphonenumber-js.**

- **Country picker**: localized names, dial codes, and flag emojis from `libphonenumber-js` + `Intl.DisplayNames`.
- **As-you-type formatting**: optional `formatOnType` flag powered by `AsYouType`.
- **Controlled / uncontrolled**: `PhoneField.Root` works with or without external state.
- **FormData ready**: `name` serializes the full `PhoneField.Value` into a hidden input.
- **Utils on client & server**: `phonefield/utils` exposes a small facade over libphonenumber for parsing, validation, and country metadata.

The public docs live at [`https://phonefield.vercel.app`](https://phonefield.vercel.app).

---

### Installation

```bash
pnpm add phonefield
# or
npm install phonefield
yarn add phonefield
bun add phonefield
```

Peer deps:

- `react >= 18`
- `react-dom >= 18`

---

### Quick start

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

`PhoneField.Root` is uncontrolled by default (`defaultValue` / `defaultCountry`), emits a normalized `PhoneField.Value`, and provides context to `PhoneField.Country` and `PhoneField.Input`.

---

### Controlled mode

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

The controlled value shape is:

```ts
type PhoneFieldValue = {
  countryIso2: CountryCode; // ISO2, e.g. "US"
  countryDialCode: string; // digits only, e.g. "1"
  nationalNumber: string; // formatted or raw, depending on formatOnType
  e164: string | null; // e.g. "+14155552671"
  isValid: boolean;
};
```

---

### Forms + FormData

`PhoneField.Root` accepts a `name` prop. When set, it renders a hidden input containing a JSON-serialized `PhoneField.Value` that you can read from `FormData` on client or server using `PhoneFieldUtils.fromFormData`.

```tsx
import { PhoneField } from "phonefield";
import { PhoneFieldUtils } from "phonefield/utils";

// Uncontrolled is the default: omit `value` and `onValueChange`.
function ExampleForm() {
  return (
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
  );
}
```

Server side:

```ts
const formData = await request.formData();
const phone = PhoneFieldUtils.fromFormData(formData, "phone");
```

---

### Country subset & locales

Limit countries from `PhoneField.Root` and localize display names with `lang`:

```tsx
<PhoneField.Root
  countries={["US", "CA", "MX"]}
  defaultCountry="US"
  lang="es-AR"
>
  <PhoneField.Country />
  <PhoneField.Input />
</PhoneField.Root>
```

Internally, `lang` is normalized via `Intl.getCanonicalLocales`. Country metadata is built once per locale and cached.

---

### Styling `PhoneField.Country` (slots)

`PhoneField.Country` exposes `slots` that map 1:1 to Base UI Combobox parts:

```ts
type CountrySlots<Value extends PhoneField.Country = PhoneField.Country> = {
  root?: Combobox.Root.Props<Value>;
  placeholder?: React.HTMLAttributes<HTMLSpanElement>;
  trigger?: Combobox.Trigger.Props;
  value?: Combobox.Value.Props;
  icon?: Combobox.Icon.Props;
  popup?: Combobox.Popup.Props;
  positioner?: Combobox.Positioner.Props;
  searchInput?: Combobox.Input.Props;
  list?: Combobox.List.Props;
  item?: Combobox.Item.Props;
  empty?: Combobox.Empty.Props;
};
```

Example:

```tsx
import { PhoneField } from "phonefield";

const countrySlots: PhoneField.CountrySlots = {
  trigger: { className: "h-10 rounded-md border border-gray-200 px-3" },
  popup: { className: "rounded-lg shadow-lg" },
  searchInput: {
    className: "h-9 rounded-md border border-gray-200 px-2",
  },
  item: {
    className:
      "px-3 py-2 data-[highlighted]:bg-slate-900 data-[highlighted]:text-white",
  },
};

<PhoneField.Root className="flex items-center gap-2">
  <PhoneField.Country slots={countrySlots} />
  <PhoneField.Input className="h-10 rounded-md border border-gray-200 px-3" />
</PhoneField.Root>;
```

---

### `PhoneField.Country` props

```ts
type CountryProps = {
  placeholder?: React.ReactNode; // default: "Select country"
  noResultsText?: React.ReactNode; // default: "No countries found"
  inputPlaceholder?: string; // default: "Search country"
  icon?: React.ReactNode; // default: internal chevron
  slots?: PhoneField.CountrySlots;
  renderCountryItem?: (country: PhoneField.Country) => React.ReactNode;
  renderCountryValue?: (country: PhoneField.Country) => React.ReactNode;
};
```

`renderCountryItem` and `renderCountryValue` let you fully customize the trigger and list item content while still reusing the built-in country data.

---

### `PhoneField.Input` props

`PhoneField.Input` is a very thin wrapper around Base UI `Input`:

```ts
type InputProps = BaseInput.Props;
```

Key behavior:

- Binds `value` to `PhoneField.Value["nationalNumber"]`.
- Always uses `inputMode="tel"`, `autoComplete="tel"`, and `pattern="[0-9]*"`.
- Emits `onValueChange(nextValue, eventDetails)` and calls `setNumber` in context.
- Mirrors Base UI validity attributes: `data-valid` / `data-invalid` based on `Input` state.

You can use these data attributes to style borders, backgrounds, etc.

---

### Validation + formatting utils

Import from `phonefield/utils`:

```ts
import { PhoneFieldUtils } from "phonefield/utils";

// parse() returns libphonenumber PhoneNumber: formatNational(), formatInternational(), getURI()
const parsed = PhoneFieldUtils.parse(value);

const output = {
  isValid: PhoneFieldUtils.isValid(value),
  e164: value.e164,
  national: parsed?.formatNational(),
  international: parsed?.formatInternational(),
};

// Frontend or backend:
PhoneFieldUtils.isValid("+14155552671");
PhoneFieldUtils.fromFormData(formData, "phone");
PhoneFieldUtils.getCountries("es-AR"); // ReadonlyMap<iso2, country>
PhoneFieldUtils.countries; // default map ("en")
```

API surface:

- **`PhoneFieldUtils.parse(value, options?)`**: `value` is `PhoneField.Value` or string (E.164 or national). Returns libphonenumber `PhoneNumber | undefined`. `options.defaultCountry` is used when parsing national-number strings.
- **`PhoneFieldUtils.isValid(value, options?)`**: boolean validity check. Same inputs/options as `parse`.
- **`PhoneFieldUtils.fromFormData(formData, name)`**: reads a serialized `PhoneField.Value` JSON string from `FormData` and returns `Value | null`.
- **`PhoneFieldUtils.getCountries(locale?)`**: returns a `ReadonlyMap<iso2, PhoneField.Country>` for the given locale (BCP 47). Used internally by `lang`, but you can call it directly.
- **`PhoneFieldUtils.countries`**: default `ReadonlyMap` for `"en"`.

---

### `PhoneField.Root` props

```ts
type RootProps = Omit<React.ComponentPropsWithoutRef<"div">, "defaultValue"> & {
  value?: PhoneField.Value;
  defaultValue?: PhoneField.Value;
  onValueChange?: (value: PhoneField.Value) => void;
  defaultCountry?: PhoneField.CountryCodeValue; // e.g. "US"
  countries?: readonly PhoneField.CountryCodeValue[]; // subset
  lang?: PhoneField.Lang; // BCP 47 string or string[]
  name?: string; // enables hidden input + FormData integration
  formatOnType?: boolean; // default: true
};
```

When `formatOnType` is `true`, the national number is formatted as-you-type using libphonenumber; when `false`, you get the raw input string.

---

### Types

```ts
import type {
  PhoneFieldCountry,
  PhoneFieldCountryCodeValue,
  PhoneFieldCountryMap,
  PhoneFieldCountryName,
  PhoneFieldLang,
  PhoneFieldValue,
} from "phonefield";
```

These types are re-exported from the package entry so you can use them in your own components and APIs.

---

### License

MIT © Damian Ricobelli
