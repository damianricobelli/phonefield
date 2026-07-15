# PhoneField

Composable React phone-field primitive built with Base UI and `libphonenumber-js`.

- Three public components: `Root`, `Country`, and `Input`.
- Controlled or uncontrolled state.
- Localized country metadata and canonical E.164 output.
- FormData support on client and server.
- Unstyled by default, with one customization seam per concern.

[Documentation and playground](https://phonefield.vercel.app) · [Package guide](./packages/phonefield/README.md) · [Migration guide](./packages/phonefield/MIGRATION.md)

## Install

```bash
pnpm add phonefield
```

## Minimal usage

```tsx
import { PhoneField } from "phonefield";

export function PhoneNumber() {
  return (
    <PhoneField.Root defaultCountry="US">
      <PhoneField.Country />
      <PhoneField.Input aria-label="Phone number" />
    </PhoneField.Root>
  );
}
```

The interface has one authority for each concern:

- `Root` owns the phone value and form serialization.
- `Country` owns selection and popup customization.
- `Input` owns native input attributes, events, and styling.
- `phonefield/utils` is the server-compatible parsing and metadata seam.

The [package guide](./packages/phonefield/README.md) contains controlled usage, FormData, utilities, and customization. The documentation site is the canonical API reference and includes typechecked examples.

## Development

```bash
pnpm install
pnpm --filter web dev
pnpm --filter phonefield test
pnpm build
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for repository conventions.
