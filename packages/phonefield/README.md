# phonefield

Composable, accessible React phone input for Base UI, Radix UI, or React Aria, built on `libphonenumber-js`. Unstyled, formats as you type, and submits through FormData.

[Documentation and playground](https://phonefield.vercel.app) · [Migration guide](./MIGRATION.md)

## Install

Install PhoneField with the primitives library your design system uses:

| Library | Install | Import |
| --- | --- | --- |
| Base UI | `pnpm add phonefield @base-ui/react` | `phonefield` (or `phonefield/base-ui`) |
| React Aria | `pnpm add phonefield react-aria-components` | `phonefield/react-aria` |
| Radix UI | `pnpm add phonefield radix-ui` | `phonefield/radix` |

Peer dependencies: `react >=18 <20`, `react-dom >=18 <20`, and one of `@base-ui/react >=1.2 <2`, `react-aria-components >=1.18 <2`, or `radix-ui >=1.1 <2`. Each entry imports only its own library. CI tests both ends of every range, on React 18 and 19.

## Quick start

```tsx
import { PhoneField } from "phonefield";

<PhoneField.Root defaultCountry="US">
  <PhoneField.Country />
  <PhoneField.Input aria-label="Phone number" />
</PhoneField.Root>;
```

`<PhoneField.Country />` renders a complete, searchable country picker. `onValueChange(value, { reason })` emits a `PhoneField.Value` with `countryIso2`, `countryDialCode`, `nationalNumber`, `e164`, and `isValid`. Pass `value` for controlled mode.

## Choose your primitives

Every entry exports the same `PhoneField` and `usePhoneField`. Root, Input, Label, Group, Description, Error, the value, formatting, validation, undo, FormData, field state, and `data-slot` names are shared and behave the same. The Country parts wrap each library's own components and follow its composition model:

| | `phonefield` (Base UI) | `phonefield/react-aria` | `phonefield/radix` |
| --- | --- | --- | --- |
| Country | `Combobox.Root` | `Select` | `Popover.Root` |
| Trigger | `Combobox.Trigger` | `Button` | `Popover.Trigger` |
| Popup | `CountryPortal` › `CountryPositioner` › `CountryPopup` | `CountryPopover` (`Popover` + `Autocomplete`) | `CountryPortal` › `CountryContent` |
| Search | `Combobox.Input` | `SearchField` › `CountrySearchInput` | input with `aria-activedescendant` |
| List / item | `Combobox.List` / `Combobox.Item` | `ListBox` / `ListBoxItem` | `listbox` / `option` |
| Empty | `CountryEmpty` | `CountryList renderEmptyState` | `CountryEmpty` |
| Indicator | `Combobox.ItemIndicator` | `SelectionIndicator` | shown when selected |
| Compose with | `render` | `render` and render props | `asChild` |
| Highlighted item | `data-highlighted` | `data-focused` | `data-highlighted` |

```tsx
import { PhoneField } from "phonefield/radix";

<PhoneField.Root defaultCountry="US">
  <PhoneField.Country>
    <PhoneField.CountryTrigger className="trigger" />
    <PhoneField.CountryPortal>
      <PhoneField.CountryContent sideOffset={8} className="popup">
        <PhoneField.CountrySearch />
        <PhoneField.CountryEmpty />
        <PhoneField.CountryList />
      </PhoneField.CountryContent>
    </PhoneField.CountryPortal>
  </PhoneField.Country>
  <PhoneField.Input aria-label="Phone number" />
</PhoneField.Root>;
```

```tsx
import { PhoneField } from "phonefield/react-aria";

<PhoneField.Root defaultCountry="US">
  <PhoneField.Group className={({ isFocusWithin }) => (isFocusWithin ? "ring" : "")}>
    <PhoneField.Country>
      <PhoneField.CountryTrigger className="trigger" />
      <PhoneField.CountryPopover offset={8} className="popup">
        <PhoneField.CountrySearch />
        <PhoneField.CountryList renderEmptyState={() => <PhoneField.CountryEmpty />} />
      </PhoneField.CountryPopover>
    </PhoneField.Country>
    <PhoneField.Input aria-label="Phone number" />
  </PhoneField.Group>
</PhoneField.Root>;
```

Library conventions carry through: Radix `Country` takes Popover props (`open`, `onOpenChange`, `modal`), React Aria `Country` takes Select props (`isOpen`, `onOpenChange`) and `CountryItem` takes `isDisabled`. In React Aria, Escape first clears a non-empty search, as `SearchField` does, then closes the popup.

Picking a country moves focus to the phone input, with the caret after the digits already typed, so the user can go straight to the number. Closing the picker without picking (Escape, clicking outside) returns focus to the trigger, and typing on the closed trigger keeps it there. Pass `focusInputOnSelect={false}` to `Country` to always return focus to the trigger.

The examples below use the Base UI entry.

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

Pass children to `Country` to customize any part. With Base UI, each part wraps one Combobox part and accepts `className`, `style`, `render`, and that part's props.

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

### Design systems that use `data-slot`

A `data-slot` you pass wins over PhoneField's. Design systems such as shadcn/ui style parts through their own slots (`InputGroup` draws its focus ring from `[data-slot=input-group-control]`), and their components set the slot before spreading your props. Composed with `render` or `asChild`, such a component receives PhoneField's slot as a prop, so set the slot you need on the element itself:

```tsx
<PhoneField.Group render={<InputGroup />}>
  <PhoneField.Input render={<InputGroupInput data-slot="input-group-control" />} />
</PhoneField.Group>
```

`<PhoneField.Input data-slot="input-group-control" render={<InputGroupInput />} />` works too. With Radix, put it on the `asChild` child.

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

After blur or form submit, the field is invalid when the number is incomplete or invalid, or required and empty. Input gets `aria-invalid` automatically. `invalid` adds an external error (server, form library); automatic validation still applies when it is `false`. Pass `autoInvalid={false}` to turn it off, so only `invalid` marks the field invalid. A form `reset` restores an uncontrolled field's initial value.

Root's `onFocus` and `onBlur` describe the whole field: `onFocus` runs when focus enters it, and `onBlur` once focus settles outside the input, the country trigger, and the popup. Moving between them calls neither. `onBlur` runs after the event is dispatched, so read `event.target`, not `event.currentTarget`. For per-element events, put `onFocus` or `onBlur` on `Input`.

## Custom parts

`usePhoneField()` reads and drives the nearest Root: `{ value, state, country, countries, setCountry, setNumber, focusInput }`. Call `focusInput()` when a custom picker closes after a pick, to move focus to the number like the built-in picker does.

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

`phonefield/utils` runs on client and server: `parse`, `isValid`, `buildValue`, `fromFormData`, `toFormValue`, `getCountries`, `countries`, and `getExampleNumber`. `parse` and `isValid` accept a string, a `PhoneField.Value`, or just `{ countryIso2, nationalNumber }`, and always revalidate.

### Form libraries

Keep the value in the form, validate it with `isValid`, and let the form library own the error:

```tsx
import { PhoneField } from "phonefield";
import { isValid } from "phonefield/utils";
import * as z from "zod";

const schema = z.object({
  phone: z
    .custom<PhoneField.InputValue>()
    .refine((phone) => isValid(phone), "Enter a valid phone number."),
});

const form = useForm({
  defaultValues: { phone: { countryIso2: "US", nationalNumber: "" } },
  resolver: standardSchemaResolver(schema),
});

<Controller
  name="phone"
  control={form.control}
  render={({ field, fieldState }) => (
    <PhoneField.Root
      value={field.value}
      onValueChange={field.onChange}
      onBlur={field.onBlur}
      invalid={fieldState.invalid}
      autoInvalid={false}
    >
      <PhoneField.Country />
      <PhoneField.Input ref={field.ref} />
      <PhoneField.Error>{fieldState.error?.message}</PhoneField.Error>
    </PhoneField.Root>
  )}
/>;
```

`ref` on `Input` lets the form focus the field on a failed submit. Root's `onBlur` marks the field touched only once focus leaves the number and the picker. The form holds `{ countryIso2, nationalNumber }` until the user types, then the full `PhoneField.Value`; `parse(phone)?.number` gives the E.164 string either way.

## Behavior

- Pasting `+44 20 7946 0018` selects the United Kingdom and shows `020 7946 0018`. Countries excluded by `countries` are kept as invalid text.
- Digits beyond the longest possible number for the country are blocked. Opt out with `limitMaxLength={false}`.
- `Cmd/Ctrl+Z` and `Cmd/Ctrl+Shift+Z` (or `Ctrl+Y`) undo and redo number and country changes as native-style transactions.
- `isValid` is `false` when the number belongs to a different country than the selected one.
- Country names come from `Intl.DisplayNames`, which can differ between Node and browsers for a few regions. Server-rendering every name (a native `<select>`) can cause hydration warnings.
- A `data-slot` you pass to a part wins over PhoneField's. A component composed with `render` or `asChild` receives PhoneField's slot as a prop, unless you set one on it.
- With `@base-ui/react` older than 1.8, Base UI keeps a read-only picker closed. From 1.8 it opens for browsing. The selection never changes while read-only.

See the [documentation](https://phonefield.vercel.app) for the full API reference.
