---
"phonefield": major
---

PhoneField v2: a composable API designed for great developer experience.

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
