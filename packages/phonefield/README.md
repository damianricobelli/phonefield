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

### Usage

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

```tsx
import * as React from "react";
import { PhoneField } from "phonefield";

export function ControlledExample() {
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
        <PhoneField.Input />
      </PhoneField.Root>
    </form>
  );
}
```

More documentation and API reference: https://phonefield.vercel.app

