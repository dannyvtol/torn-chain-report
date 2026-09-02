# Coding Standards

## Variable Naming

**Rule:** Use full, descriptive names for all identifiers — no abbreviations.

| ✗ Abbreviated | ✓ Full name |
|---|---|
| `vm` | `viewModel` |
| `el` | `element` |
| `mountEl` | `mountElement` |
| `btn` | `button` |
| `cb` | `callback` |
| `fn` | `functionName` (or a descriptive name) |

**Applies to:** variables, parameters, destructured names, class fields, function names, loop variables — in all files including `*.spec.js`.

**Allowed short names:** `id`, `url`, `html`, `css`, `dom` (true domain acronyms); `i`, `j` (loop indices).

**Enforcement:** ESLint `id-length` rule (min: 3, exceptions: `id`, `i`, `j`) + PR review.

## JSDoc Type Imports

**Rule:** Never use inline `import()` in value-bearing JSDoc tag type expressions. Declare a `@typedef` alias at the top of the file (directly after the `import` statements) and reference the alias name instead.

| ✗ Inline import | ✓ @typedef alias |
|---|---|
| `@param {import("./FactionViewModel.js").FactionViewModel} viewModel` | `@param {FactionViewModel} viewModel` |
| `@type {import("./Store.js").Store}` | `@type {Store}` |
| `@returns {import("./Result.js").Result}` | `@returns {Result}` |

**Typedef placement:**

```js
import { createPanel } from "./ui/createPanel.js";

/** @typedef {import("./FactionViewModel.js").FactionViewModel} FactionViewModel */
```

**Applies to:** `@param`, `@type`, `@returns`, `@property` — in all files including `*.spec.js`.
(`@typedef` itself uses `import()` by design; that is the only permitted location.)

**Enforcement:** ESLint `local/no-jsdoc-inline-import` rule + PR review.
