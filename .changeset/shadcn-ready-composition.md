---
"phonefield": minor
---

Support React 18 and older primitives, and compose cleanly with design systems and form libraries.

- **React 18.** Peer ranges are now `react >=18 <20` and `react-dom >=18 <20`. Every part accepts `ref` on React 18 too, and the published types work with `@types/react` 18.
- **Wider primitives ranges.** `@base-ui/react >=1.2`, `react-aria-components >=1.18`, `radix-ui >=1.1`. `phonefield/radix` now imports from the `radix-ui` root: the `radix-ui/*` subpaths it used before exist only from 1.7, so 2.1 failed to resolve on the 1.4–1.6 versions its peer range allowed. CI now tests the lowest and latest supported versions on React 18 and 19.
- **Your `data-slot` wins.** A `data-slot` you pass to any part is kept instead of being overwritten, so design systems that style through slots (such as shadcn/ui's `InputGroup` focus ring) keep working: `<PhoneField.Input render={<InputGroupInput data-slot="input-group-control" />} />`.
- **Field-level `onFocus` and `onBlur` on Root.** `onFocus` runs when focus enters the field and `onBlur` once focus settles outside the input, the country trigger, and the popup. Moving between them no longer calls `onBlur`, so `onBlur={field.onBlur}` no longer validates while the user picks a country. `onBlur` runs after dispatch: read `event.target`. Put `onBlur` on `Input` for per-element events.
- **`autoInvalid` on Root.** `autoInvalid={false}` turns off automatic validation, so only `invalid` marks the field invalid when a form library owns validation.
- **`parse` and `isValid` accept `{ countryIso2, nationalNumber }`**, the shape a form's default value has before the user types.
- **Smaller bundle.** Every entry now loads a single copy of libphonenumber-js. A mixed import pulled in both its `es6` and `es6-modern` builds: each entry drops 5.6 KB gzip (`phonefield` 45.7 → 40.1 KB, `phonefield/utils` 40.9 → 35.0 KB, peers excluded).
