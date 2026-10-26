# phonefield

Composable, accessible React phone input built on Base UI and `libphonenumber-js`. Unstyled, formats as you type, and submits through FormData.

[Documentation and playground](https://phonefield.vercel.app) · [Migration guide](./MIGRATION.md)

## Install

```bash
pnpm add phonefield @base-ui/react
```

Peer dependencies: `@base-ui/react >=1.9 <2`, `react >=19 <20`, `react-dom >=19 <20`.

## Quick start

```tsx
import { PhoneField } from "phonefield";

<PhoneField.Root defaultCountry="US">
  <PhoneField.Country />
  <PhoneField.Input aria-label="Phone number" />
</PhoneField.Root>;
```

`<PhoneField.Country />` renders a complete, searchable country picker. `onValueChange(value, { reason })` emits a `PhoneField.Value` with `countryIso2`, `countryDialCode`, `nationalNumber`, `e164`, and `isValid`. Pass `value` for controlled mode.

## Labels and errors

Root is a plain wrapper. `Group` is the visual shell for Country and Input; `Label`, `Description`, and `Error` are wired to the input for you (`htmlFor`, `aria-describedby`). `Error` renders only while the field is invalid.

```tsx
<PhoneField.Root name="phone" required>
  <PhoneField.Label>Phone</PhoneField.Label>
  <PhoneField.Group>
    <PhoneField.Country />
    <PhoneField.Input />
  </PhoneField.Group>
  <PhoneField.Description>Used for sign-in codes.</PhoneField.Description>
  <PhoneField.Error />
</PhoneField.Root>;
```

## Composition

Pass children to `Country` to customize any part. Each part wraps one Base UI Combobox part and accepts `className`, `style`, `render`, and that part's props.

```tsx
import { getExampleNumber } from "phonefield/utils";

<PhoneField.Root defaultCountry="US" preferredCountries={["US", "CA"]}>
  <PhoneField.Label>Phone</PhoneField.Label>
  <PhoneField.Country>
    <PhoneField.CountryTrigger className="trigger">
      <PhoneField.CountryValue>{(c) => `${c.flag} ${c.dialCode}`}</PhoneField.CountryValue>
      <PhoneField.CountryIcon />
    </PhoneField.CountryTrigger>
    <PhoneField.CountryPortal>
      <PhoneField.CountryPositioner sideOffset={8}>
        <PhoneField.CountryPopup className="popup">
          <PhoneField.CountrySearch placeholder="Search" />
          <PhoneField.CountryEmpty>No results</PhoneField.CountryEmpty>
          <PhoneField.CountryList>
            {(country) => (
              <PhoneField.CountryItem country={country} className="item">
                {country.flag} {country.name}
                <PhoneField.CountryItemIndicator />
              </PhoneField.CountryItem>
            )}
          </PhoneField.CountryList>
        </PhoneField.CountryPopup>
      </PhoneField.CountryPositioner>
    </PhoneField.CountryPortal>
  </PhoneField.Country>
  <PhoneField.Input placeholder={(country) => getExampleNumber(country.iso2)} />
</PhoneField.Root>;
```

To translate only the picker copy, skip composition: `<PhoneField.Country labels={{ search: "Buscar país", empty: "Sin resultados" }} />`.

The popup is portaled, so style its parts directly. Every part also has a stable `data-slot` (`phone-field`, `phone-field-input`, `phone-field-country-trigger`, `phone-field-country-popup`, `phone-field-country-item`, …) for global CSS.

## Field state

Root, Group, Label, Description, and Error mirror the field state as data attributes: `data-country`, `data-valid`, `data-invalid`, `data-filled`, `data-dirty`, `data-touched`, `data-focused`, `data-disabled`, `data-readonly`, `data-required`. Style the shell on `Group`:

```tsx
<PhoneField.Root name="phone" required invalid={!!serverError}>
  <PhoneField.Group className="flex rounded-lg border data-focused:ring-2 data-invalid:border-red-500">
    <PhoneField.Country />
    <PhoneField.Input aria-label="Phone number" />
  </PhoneField.Group>
  <PhoneField.Error>{serverError}</PhoneField.Error>
</PhoneField.Root>;
```

After blur or form submit, the field is invalid when the number is incomplete or invalid, or required and empty. Input gets `aria-invalid` automatically. `invalid` adds an external error (server, form library); automatic validation still applies when it is `false`. A form `reset` restores an uncontrolled field's initial value.

## Custom parts

`usePhoneField()` reads and drives the nearest Root: `{ value, state, country, countries, setCountry, setNumber }`.

```tsx
import { usePhoneField } from "phonefield";

function NativeCountrySelect() {
  const { country, countries, setCountry } = usePhoneField();
  return (
    <select
      aria-label="Country"
      value={country.iso2}
      onChange={(e) => setCountry(e.target.value)}
    >
      {countries.map((c) => (
        <option key={c.iso2} value={c.iso2}>{c.name}</option>
      ))}
    </select>
  );
}
```

## Forms and utilities

With `name`, Root submits one FormData entry. Rebuild and validate it on the server:

```ts
import { fromFormData } from "phonefield/utils";

const phone = fromFormData(formData, "phone"); // PhoneField.Value | null
```

`phonefield/utils` runs on client and server: `parse`, `isValid`, `buildValue`, `fromFormData`, `toFormValue`, `getCountries`, `countries`, and `getExampleNumber`.

## Behavior

- Pasting `+44 20 7946 0018` selects the United Kingdom and shows `020 7946 0018`. Countries excluded by `countries` are kept as invalid text.
- Digits beyond the longest possible number for the country are blocked. Opt out with `limitMaxLength={false}`.
- `Cmd/Ctrl+Z` and `Cmd/Ctrl+Shift+Z` (or `Ctrl+Y`) undo and redo number and country changes as native-style transactions.
- `isValid` is `false` when the number belongs to a different country than the selected one.
- Country names come from `Intl.DisplayNames`, which can differ between Node and browsers for a few regions. Server-rendering every name (a native `<select>`) can cause hydration warnings.
- With `render={<YourComponent />}`, PhoneField's `data-slot` replaces the component's own.

See the [documentation](https://phonefield.vercel.app) for the full API reference.
