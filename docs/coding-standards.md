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
