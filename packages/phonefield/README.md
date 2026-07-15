## PhoneField

Composable phone field primitive built with Base UI and libphonenumber-js.

- Country picker with localized names, dial codes, and flags.
- As-you-type formatting via `formatOnType`.
- Controlled and uncontrolled usage.
- FormData integration via `name` on `PhoneField.Root`.
- Shared utils for parsing, validation, and country metadata.

### Install

```bash
pnpm add phonefield
# or
npm install phonefield
yarn add phonefield
bun add phonefield
```

Requires `@base-ui/react >= 1.2 < 2`, `react >= 18 < 20`, and
`react-dom >= 18 < 20` as peer dependencies.

### Usage

```tsx
import { PhoneField } from "phonefield";

export function SignupPhone() {
  return (
    <PhoneField.Root defaultCountry="US" lang="en">
      <PhoneField.Country />
      <PhoneField.Input aria-label="Phone number" />
    </PhoneField.Root>
  );
}
```

`PhoneField.Root` is uncontrolled by default. If `defaultCountry` is not set,
it falls back to `"US"` when available, otherwise the first available country.

```tsx
import * as React from "react";
import { PhoneField } from "phonefield";

export function ControlledExample() {
  const [phone, setPhone] = React.useState<PhoneField.Value>({
    countryIso2: "US",
    countryDialCode: "+1",
    nationalNumber: "",
    e164: null,
    isValid: false,
  });

  return (
    <PhoneField.Root value={phone} onValueChange={setPhone}>
      <PhoneField.Country />
      <PhoneField.Input aria-label="Phone number" />
    </PhoneField.Root>
  );
}
```

### FormData

```tsx
import { PhoneField } from "phonefield";
import { PhoneFieldUtils } from "phonefield/utils";

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
        <PhoneField.Input aria-label="Phone number" />
      </PhoneField.Root>
    </form>
  );
}
```

Forms contain only `{ countryIso2, nationalNumber }`. Treat this as untrusted
input: `fromFormData` validates it and rebuilds `countryDialCode`, `e164`, and
`isValid` instead of accepting client-supplied derived fields.

### Utilities (`phonefield/utils`)

```ts
import { PhoneFieldUtils } from "phonefield/utils";

const parsed = PhoneFieldUtils.parse("+14155552671");
const isValid = PhoneFieldUtils.isValid("+14155552671");
```

`parse` and `isValid` accept either `PhoneField.Value` or a phone string. Parsing
is strict by default. Pass `options.defaultCountry` for national strings, or
`{ extract: true }` to intentionally extract a number from surrounding text.

`PhoneField.Input` defaults to telephone-friendly native attributes and both
`PhoneField.Root` and `PhoneField.Input` forward refs. See the full documentation
for `slotProps`, immutable country metadata, and the complete API.

More documentation and API reference: https://phonefield.vercel.app
