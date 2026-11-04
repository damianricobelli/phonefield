---
"phonefield": minor
---

Add Radix UI and React Aria adapters. Import `PhoneField` from `phonefield/radix` (built on Radix Popover, Slot, and Label, composed with `asChild`) or `phonefield/react-aria` (built on React Aria Select, Autocomplete, SearchField, ListBox, Group, and Input, with render props). `phonefield` keeps the Base UI adapter, now also available as `phonefield/base-ui`.

Every adapter shares the same value model, formatting, validation, undo history, FormData serialization, field state, and data slots. `@base-ui/react` is now an optional peer dependency, alongside optional `radix-ui` and `react-aria-components`; install the one you use.

`Label`, `Group`, `Description`, and `Error` no longer re-render on every keystroke; they update only when a field state flag changes.
