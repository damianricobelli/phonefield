# Contributing to Phonefield

We're glad you're interested in contributing to our project! Here are some guidelines to help you get started.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/damianricobelli/phonefield.git`
3. Create a new branch: `git checkout -b your-feature-name`
4. Make your changes
5. Commit your changes: `git commit -m "Add some feature"`
6. Push to the branch: `git push origin your-feature-name`
7. Create a pull request

## Development Setup

1. Install dependencies: `pnpm install`
2. Run the documentation app: `pnpm --filter web dev`

## React and Code Style

We use Biome for formatting and general linting. ESLint runs the official
`eslint-plugin-react-hooks` recommended rules, including React Compiler
diagnostics.

The v1 library supports React 19 and is not precompiled with React
Compiler. Keep intentional manual memoization in the package unless a profiler
and regression tests show it can be removed. The documentation app does use
React Compiler, so prefer plain functions and calculations there; add
`useMemo` or `useCallback` only when identity is part of a documented
performance boundary or Hook dependency.

Before submitting a pull request, run:

```bash
pnpm lint
pnpm --filter phonefield test
pnpm build
```

## Submitting Pull Requests

1. Ensure your code adheres to the existing style.
2. Include tests for any new functionality.
3. Update documentation if necessary.
4. Describe your changes in detail in the pull request description.

## Reporting Issues

Use the GitHub issue tracker to report bugs or suggest features.

Thank you for contributing!
