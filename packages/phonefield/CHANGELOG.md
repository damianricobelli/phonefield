# phonefield

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
