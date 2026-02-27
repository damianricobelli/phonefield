<div align="center">
  <h1>PhoneField</h1>

  <p><strong>Composable React phone input primitive</strong> powered by Base UI + libphonenumber-js.</p>

  <p>
    <a href="https://phonefield.vercel.app"><img src="https://img.shields.io/badge/docs-phonefield.vercel.app-0f172a?style=for-the-badge" alt="Docs" /></a>
    <a href="https://www.npmjs.com/package/phonefield"><img src="https://img.shields.io/npm/v/phonefield?style=for-the-badge" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/phonefield"><img src="https://img.shields.io/npm/dm/phonefield?style=for-the-badge" alt="NPM downloads" /></a>
    <a href="https://bundlephobia.com/package/phonefield"><img src="https://img.shields.io/bundlephobia/minzip/phonefield?style=for-the-badge" alt="Bundlephobia minzip" /></a>
    <img src="https://img.shields.io/badge/license-MIT-16a34a?style=for-the-badge" alt="MIT" />
  </p>
</div>

## Table of Contents

- [Why PhoneField](#why-phonefield)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Controlled Mode](#controlled-mode)
- [Forms + FormData](#forms--formdata)
- [Country Filtering + Localization](#country-filtering--localization)
- [Styling with Slots](#styling-with-slots)
- [Utilities (`phonefield/utils`)](#utilities-phonefieldutils)
- [API Reference (At a Glance)](#api-reference-at-a-glance)
- [Monorepo Development](#monorepo-development)
- [License](#license)

## Why PhoneField

PhoneField gives you a production-ready phone UX without locking you into a visual design system.

| Feature | What you get |
| --- | --- |
| Country picker | Localized country names, dial codes, and flag emoji |
| Smart formatting | As-you-type formatting with `formatOnType` |
| Flexible state | Controlled or uncontrolled usage |
| Form-friendly | Hidden input JSON + `FormData` parser |
| Shared logic | Parse/validate helpers for frontend and backend |

Live docs: [phonefield.vercel.app](https://phonefield.vercel.app)

## Installation

```bash
pnpm add phonefield
# or
npm install phonefield
yarn add phonefield
bun add phonefield
```

Peer dependencies:

- `react >= 18`
- `react-dom >= 18`

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

`PhoneField.Root` is uncontrolled by default and exposes context to `PhoneField.Country` and `PhoneField.Input`.

## Controlled Mode

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

Value shape:

```ts
type PhoneFieldValue = {
  countryIso2: CountryCode;
  countryDialCode: string;
  nationalNumber: string;
  e164: string | null;
  isValid: boolean;
};
```

## Forms + FormData

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
        // phone => PhoneField.Value | null
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

## Country Filtering + Localization

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

- `countries`: limit available ISO2 countries
- `lang`: BCP 47 locale(s), normalized via `Intl.getCanonicalLocales`

## Styling with Slots

`PhoneField.Country` exposes Base UI-aligned slots so you can style each part independently.

```tsx
import { PhoneField } from "phonefield";

const countrySlots: PhoneField.CountrySlots = {
  trigger: { className: "h-10 rounded-md border border-gray-200 px-3" },
  popup: { className: "rounded-lg shadow-lg" },
  searchInput: { className: "h-9 rounded-md border border-gray-200 px-2" },
  item: {
    className:
      "px-3 py-2 data-[highlighted]:bg-slate-900 data-[highlighted]:text-white",
  },
};

export function StyledPhoneField() {
  return (
    <PhoneField.Root className="flex items-center gap-2">
      <PhoneField.Country slots={countrySlots} />
      <PhoneField.Input className="h-10 rounded-md border border-gray-200 px-3" />
    </PhoneField.Root>
  );
}
```

## Utilities (`phonefield/utils`)

```ts
import { PhoneFieldUtils } from "phonefield/utils";

const parsed = PhoneFieldUtils.parse("+14155552671");

const output = {
  isValid: PhoneFieldUtils.isValid("+14155552671"),
  national: parsed?.formatNational(),
  international: parsed?.formatInternational(),
};
```

Utility surface:

- `PhoneFieldUtils.parse(value, options?)`
- `PhoneFieldUtils.isValid(value, options?)`
- `PhoneFieldUtils.fromFormData(formData, name)`
- `PhoneFieldUtils.getCountries(locale?)`
- `PhoneFieldUtils.countries`

## API Reference (At a Glance)

```ts
type RootProps = Omit<React.ComponentPropsWithoutRef<"div">, "defaultValue"> & {
  value?: PhoneField.Value;
  defaultValue?: PhoneField.Value;
  onValueChange?: (value: PhoneField.Value) => void;
  defaultCountry?: PhoneField.CountryCodeValue;
  countries?: readonly PhoneField.CountryCodeValue[];
  lang?: PhoneField.Lang;
  name?: string;
  formatOnType?: boolean; // default: true
};
```

```ts
type CountryProps = {
  placeholder?: React.ReactNode;
  noResultsText?: React.ReactNode;
  inputPlaceholder?: string;
  icon?: React.ReactNode;
  slots?: PhoneField.CountrySlots;
  renderCountryItem?: (country: PhoneField.Country) => React.ReactNode;
  renderCountryValue?: (country: PhoneField.Country) => React.ReactNode;
};
```

```ts
type InputProps = BaseInput.Props;
```

## Monorepo Development

```bash
# install deps
pnpm install

# run all dev tasks (turbo)
pnpm dev

# build everything
pnpm build

# lint all packages/apps
pnpm lint
```

Workspace layout:

```text
.
├─ apps/web                # docs site
├─ packages/phonefield     # published package
├─ README.md
└─ turbo.json
```

## License

MIT © Damian Ricobelli
