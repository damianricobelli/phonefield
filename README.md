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

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Controlled Mode](#controlled-mode)
- [Styling Country Select](#styling-country-select)
- [Country Subset](#country-subset)
- [Internationalization](#internationalization)
- [Uncontrolled + FormData (Client / Server)](#uncontrolled--formdata-client--server)
- [Validity States](#validity-states)
- [API Reference (At a Glance)](#api-reference-at-a-glance)
- [Formatting + Utils](#formatting--utils)
- [License](#license)

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

## Styling Country Select

This `classNames` preset is based entirely on Base UI's
[Combobox "input inside popup" example](https://base-ui.com/react/components/combobox#input-inside-popup).
You can style the Combobox however you want.

```tsx
<PhoneField.Country
  classNames={{
    // Trigger button that opens the country Combobox.
    trigger:
      "inline-flex h-10 min-w-[7.5rem] cursor-default select-none items-center justify-between gap-2 whitespace-nowrap rounded-xl border border-gray-200 bg-white pr-2.5 pl-3 text-base text-gray-900 transition-colors hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 data-[popup-open]:bg-gray-100",
    // Trigger icon.
    icon: "flex text-gray-600",
    // Positioning layer for z-index and popup alignment.
    positioner: "z-50",
    // Popup panel with dimensions and enter/exit transitions.
    popup:
      "origin-[var(--transform-origin)] flex max-w-[var(--available-width)] max-h-[24rem] flex-col overflow-hidden rounded-lg bg-[canvas] text-gray-900 shadow-lg shadow-gray-200 outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300",
    // Wrapper around the search input.
    searchInputContainer: "shrink-0 p-2",
    // Search input inside the popup.
    searchInput:
      "h-10 w-full font-normal rounded-md border border-gray-200 px-3 text-base text-gray-900 focus:outline focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800",
    // Empty state when no country matches.
    empty: "p-4 text-[0.925rem] leading-4 text-gray-600 empty:m-0 empty:p-0",
    // Scrollable list of countries.
    list: "min-h-0 flex-1 overflow-y-auto scroll-py-2 py-2 overscroll-contain empty:p-0",
    // Country row and highlighted state.
    item:
      "grid min-w-[max(16rem,var(--anchor-width))] cursor-default grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg py-2.5 pr-4 pl-4 text-base leading-5 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-2 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-lg data-[highlighted]:before:bg-gray-900",
  }}
  positioning={{ side: "bottom", align: "start", sideOffset: 8 }}
  renderCountryValue={(country) => `${country.flag ?? ""} ${country.dialCode}`}
/>
```

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

## Country Subset

```tsx
<PhoneField.Root countries={["US", "CA", "MX"]} defaultCountry="US">
  <PhoneField.Country />
  <PhoneField.Input />
</PhoneField.Root>
```

- `countries`: limits available ISO2 countries.

## Internationalization

```tsx
<PhoneField.Root lang="es-AR" defaultCountry="AR">
  <PhoneField.Country
    inputPlaceholder="Buscar país"
    noResultsText="No se encontraron países"
  />
  <PhoneField.Input />
</PhoneField.Root>
```

- `lang`: BCP 47 locale (or locale list), normalized via `Intl.getCanonicalLocales`.

## Uncontrolled + FormData (Client / Server)

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

## Validity States

`PhoneField.Value.isValid` can be used directly, or you can style the input using
Base UI state attributes (`data-valid` / `data-invalid`).

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
</Field.Root>;
```

## Formatting + Utils

```ts
import { PhoneFieldUtils } from "phonefield/utils";

const parsed = PhoneFieldUtils.parse("+14155552671");

const output = {
  isValid: PhoneFieldUtils.isValid("+14155552671"),
  national: parsed?.formatNational(),
  international: parsed?.formatInternational(),
};
```

`parse` and `isValid` accept either `PhoneField.Value` or a phone string.
For national-number strings, pass `options.defaultCountry`.

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
  defaultCountry?: PhoneField.CountryCodeValue; // default: "US" if available, otherwise first available
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
  classNames?: PhoneField.CountryClassNames;
  positioning?: PhoneField.CountryPositioning;
  renderCountryItem?: (country: PhoneField.Country) => React.ReactNode;
  renderCountryValue?: (country: PhoneField.Country) => React.ReactNode;
};
```

```ts
type InputProps = BaseInput.Props;
```

## License

MIT © Damian Ricobelli
