# phonefield

## 2.3.0

### Minor Changes

- [`7c208c8`](https://github.com/damianricobelli/phonefield/commit/7c208c8adf4daa33dcd16eb2ec5d55cc9bf9354f) Thanks [@damianricobelli](https://github.com/damianricobelli)! - Picking a country moves focus to the phone input, so the user can type the number right away.
  
  - **Focus follows the pick.** After a country is chosen from the list, with the pointer or Enter, focus moves to the input with the caret after the digits already typed. Closing the picker without picking (Escape, clicking outside) still returns focus to the trigger, and typing on the closed trigger keeps focus there. Works the same in the Base UI, Radix, and React Aria adapters, and Root's `onBlur` does not run in between.
  - **`focusInputOnSelect` on `Country`.** Pass `focusInputOnSelect={false}` to keep the previous behavior and always return focus to the trigger. In Base UI, `finalFocus` on `CountryPopup` still overrides it; in Radix, so does calling `event.preventDefault()` in `CountryContent`'s `onCloseAutoFocus`.
  - **`focusInput()` from `usePhoneField()`.** Focuses the input with the caret at the end and returns `false` when no enabled input is mounted, so a custom picker such as a drawer can do the same when it closes after a pick.

## 2.2.0

### Minor Changes

- [#19](https://github.com/damianricobelli/phonefield/pull/19) [`3eb1431`](https://github.com/damianricobelli/phonefield/commit/3eb1431cc6322525aefd3c6ff35df56e1d01131d) Thanks [@damianricobelli](https://github.com/damianricobelli)! - Support React 18 and older primitives, and compose cleanly with design systems and form libraries.
  
  - **React 18.** Peer ranges are now `react >=18 <20` and `react-dom >=18 <20`. Every part accepts `ref` on React 18 too, and the published types work with `@types/react` 18.
  - **Wider primitives ranges.** `@base-ui/react >=1.2`, `react-aria-components >=1.18`, `radix-ui >=1.1`. `phonefield/radix` now imports from the `radix-ui` root: the `radix-ui/*` subpaths it used before exist only from 1.7, so 2.1 failed to resolve on the 1.4–1.6 versions its peer range allowed. CI now tests the lowest and latest supported versions on React 18 and 19.
  - **Your `data-slot` wins.** A `data-slot` you pass to any part is kept instead of being overwritten, so design systems that style through slots (such as shadcn/ui's `InputGroup` focus ring) keep working: `<PhoneField.Input render={<InputGroupInput data-slot="input-group-control" />} />`.
  - **Field-level `onFocus` and `onBlur` on Root.** `onFocus` runs when focus enters the field and `onBlur` once focus settles outside the input, the country trigger, and the popup. Moving between them no longer calls `onBlur`, so `onBlur={field.onBlur}` no longer validates while the user picks a country. `onBlur` runs after dispatch: read `event.target`. Put `onBlur` on `Input` for per-element events.
  - **`autoInvalid` on Root.** `autoInvalid={false}` turns off automatic validation, so only `invalid` marks the field invalid when a form library owns validation.
  - **`parse` and `isValid` accept `{ countryIso2, nationalNumber }`**, the shape a form's default value has before the user types.
  - **Smaller bundle.** Every entry now loads a single copy of libphonenumber-js. A mixed import pulled in both its `es6` and `es6-modern` builds: each entry drops 5.6 KB gzip (`phonefield` 45.7 → 40.1 KB, `phonefield/utils` 40.9 → 35.0 KB, peers excluded).

## 2.1.0

### Minor Changes

- [`64f7144`](https://github.com/damianricobelli/phonefield/commit/64f71449980dea0cf2ba987764dd0dd447ba9044) Thanks [@damianricobelli](https://github.com/damianricobelli)! - Add Radix UI and React Aria adapters. Import `PhoneField` from `phonefield/radix` (built on Radix Popover, Slot, and Label, composed with `asChild`) or `phonefield/react-aria` (built on React Aria Select, Autocomplete, SearchField, ListBox, Group, and Input, with render props). `phonefield` keeps the Base UI adapter, now also available as `phonefield/base-ui`.
  
  Every adapter shares the same value model, formatting, validation, undo history, FormData serialization, field state, and data slots. `@base-ui/react` is now an optional peer dependency, alongside optional `radix-ui` and `react-aria-components`; install the one you use.
  
  `Label`, `Group`, `Description`, and `Error` no longer re-render on every keystroke; they update only when a field state flag changes.

## 2.0.0

### Major Changes

- [#16](https://github.com/damianricobelli/phonefield/pull/16) [`aa0c633`](https://github.com/damianricobelli/phonefield/commit/aa0c633940551998ad0883fc97c2841b405505b0) Thanks [@damianricobelli](https://github.com/damianricobelli)! - PhoneField v2: a composable API designed for great developer experience.
  
  - **Composable country picker.** `PhoneField.Country` is now built from Base UI-style parts (`CountryTrigger`, `CountryValue`, `CountryIcon`, `CountryPortal`, `CountryPositioner`, `CountryPopup`, `CountrySearch`, `CountryEmpty`, `CountryList`, `CountryItem`, `CountryItemIndicator`). Every part takes `className` (string or function of state), `style`, and `render`. `<PhoneField.Country />` without children still renders a complete picker.
  - **Breaking:** removed `classNames`, `slotProps`, `positioning`, `renderCountryItem`, `renderCountryValue`, `icon`, `placeholder`, `noResultsText`, and `inputPlaceholder` from `PhoneField.Country`, plus the `CountryClassNames`, `CountrySlotProps`, `CountryPositioning`, `RenderCountryItem`, and `RenderCountryValue` types. Compose the parts instead.
  - **Field state on Root.** Root exposes `data-country`, `data-valid`, `data-invalid`, `data-filled`, `data-dirty`, `data-touched`, `data-focused`, `data-disabled`, `data-readonly`, and `data-required`. `className` and `style` accept a function of that state, and `render` swaps the element. Input gets `aria-invalid` automatically.
  - **Field anatomy.** New `PhoneField.Label`, `PhoneField.Group` (the visual shell, mirroring Root state), `PhoneField.Description`, and `PhoneField.Error` (rendered only while the field is invalid). Ids, `htmlFor`, and `aria-describedby` are wired automatically.
  - **Native form behavior.** Submitting the owning form marks the field touched, so errors show without a prior blur. A form reset restores an uncontrolled field to its initial value.
  - **New Root props:** `preferredCountries`, `disabled`, `readOnly`, `required`, `invalid` (forces the invalid state; automatic validation still applies when it is `false`), `form`, and `limitMaxLength`.
  - `PhoneField.Country` accepts `labels={{ search, empty }}` to translate the picker copy without composing it.
  - **Breaking:** `limitMaxLength` is on by default and rejects digits beyond the longest possible number for the selected country. Pass `limitMaxLength={false}` to opt out.
  - `onValueChange` receives a second argument, `{ reason }`: `"input"`, `"paste"`, `"country"`, `"undo"`, or `"redo"`.
  - `PhoneField.Input` accepts `placeholder` as a function of the selected country.
  - New `usePhoneField()` hook for custom parts. Its `setCountry` accepts plain strings. A new `getExampleNumber()` helper is in `phonefield/utils`.
  - The country search highlights the first match automatically, so Enter selects it.
  - **Breaking:** the default trigger shows the flag and dial code, and its accessible name is the country name with its dial code. Pass `aria-label`, `aria-labelledby`, or an `id` with a `<label htmlFor>` to override it.
  - **Breaking:** requires `@base-ui/react` 1.9 or later. Refs are regular React 19 props.
  - Fixed: calling `setCountry` and then `setNumber` in the same event now keeps the new country.
  - Fixed: numbers for territories that share a numbering plan with a larger country (Åland Islands, Isle of Man, Jersey, Christmas Island, Vatican City, Saint Barthélemy, Svalbard, Western Sahara…) are now valid when that territory is selected. Numbers from another region of the plan, such as a US number with Canada selected, are still invalid.

## 1.0.2

### Patch Changes

- [#14](https://github.com/damianricobelli/phonefield/pull/14) [`dd5c887`](https://github.com/damianricobelli/phonefield/commit/dd5c887f39a7a372c13f0c88b35d317471ca498c) Thanks [@damianricobelli](https://github.com/damianricobelli)! - feat(web,phonefield): add copy-paste PhoneField recipes, revamp documentation and update package deps

## 1.0.1

### Patch Changes

- [#12](https://github.com/damianricobelli/phonefield/pull/12) [`1d47926`](https://github.com/damianricobelli/phonefield/commit/1d47926b01aee747d3e57034991d4749405811e2) Thanks [@damianricobelli](https://github.com/damianricobelli)! - Add bounded, native-style undo and redo history for formatted phone edits,
  including grouped typing and deletion transactions, restored selections,
  country changes, and controlled or uncontrolled fields. Prevent direct `+`
  entry while preserving international paste and normal Backspace removal.

  Normalize pasted international numbers, select detected allowed countries, reject disallowed countries without reinterpreting their digits, and require valid numbers to match the selected country.

## 1.0.0

### Major Changes

- [#10](https://github.com/damianricobelli/phonefield/pull/10) [`fec94e0`](https://github.com/damianricobelli/phonefield/commit/fec94e02887b53cfe85da5dc4a307c593da1db8e) Thanks [@damianricobelli](https://github.com/damianricobelli)! - Release the stable v1 interface: make Root the sole owner of value changes and form serialization, separate Country styling/positioning/behavior seams, publish only documented named utilities, standardize public types under `PhoneField.*`, and expose namespaced `data-slot` attributes for CSS styling.

## 0.2.0

### Minor Changes

- [#6](https://github.com/damianricobelli/phonefield/pull/6) [`0916dff`](https://github.com/damianricobelli/phonefield/commit/0916dffc609d7424f45ed900b6b43f7d4fce73f0) Thanks [@damianricobelli](https://github.com/damianricobelli)! - Canonicalize E.164 values across national trunk prefixes, harden FormData parsing, preserve the React client boundary, support React 18 refs, expose country slot props, and align phone input semantics, types, packaging, tests, and documentation.

## 0.1.1

### Patch Changes

- [#4](https://github.com/damianricobelli/phonefield/pull/4) [`c276cf7`](https://github.com/damianricobelli/phonefield/commit/c276cf789cc79f3068888c483e726405e8f3e2e0) Thanks [@damianricobelli](https://github.com/damianricobelli)! - feat,docs: update PhoneField component

## 0.1.0

### Minor Changes

- [#1](https://github.com/damianricobelli/phonefield/pull/1) [`63905b0`](https://github.com/damianricobelli/phonefield/commit/63905b00f2fb063f1d14d06cb23ccc544f37031c) Thanks [@damianricobelli](https://github.com/damianricobelli)! - Introduce phonefield package with composable phone field (Base UI + libphonenumber-js), utils for parse/validate/FormData, and updated README + docs site
