# PhoneField

Composable, accessible React phone input built on Base UI and `libphonenumber-js`.

- Zero-config `Root`, `Country`, and `Input`, or compose every country-picker part.
- Unstyled: `className` on each part, field state as data attributes.
- Built-in `Label`, `Description`, and `Error`, wired for accessibility.
- Controlled or uncontrolled, with canonical E.164 output.
- FormData submission and server-compatible utilities.

[Documentation and playground](https://phonefield.vercel.app) · [Package guide](./packages/phonefield/README.md) · [Migration guide](./packages/phonefield/MIGRATION.md)

## Install

```bash
pnpm add phonefield @base-ui/react
```

Requires React 19 and `@base-ui/react` 1.9 or newer.

## Usage

```tsx
import { PhoneField } from "phonefield";

export function PhoneNumber() {
  return (
    <PhoneField.Root name="phone" defaultCountry="US" required>
      <PhoneField.Label>Phone</PhoneField.Label>
      <PhoneField.Group className="flex rounded-lg border data-invalid:border-red-500">
        <PhoneField.Country />
        <PhoneField.Input />
      </PhoneField.Group>
      <PhoneField.Error />
    </PhoneField.Root>
  );
}
```

- `Root` owns the value, field state, and form serialization (submit reveals errors, reset restores the value).
- `Group` is the visual shell; `Label`, `Description`, and `Error` are linked to the input.
- `Country` is a searchable picker; pass `Country*` parts as children to customize it.
- `Input` is the telephone input; it formats, handles paste, and limits length.
- `usePhoneField()` drives Root from your own parts.
- `phonefield/utils` parses and validates on client and server.

The [package guide](./packages/phonefield/README.md) covers composition, field state, forms, and utilities. The documentation site has the full API reference and typechecked examples.

## Development

Requires Node.js 22.18 or newer.

```bash
pnpm install
pnpm --filter web dev
pnpm --filter phonefield test
pnpm build
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for repository conventions.
