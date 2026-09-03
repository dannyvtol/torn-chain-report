# Project Context

## Project Context

Torn Chain Report is a **TamperMonkey userscript** that injects UI panels into [Torn](https://www.torn.com), a browser-based RPG. It runs in the page's content script context under TamperMonkey.

The `GM` object (Greasemonkey API) is the primary runtime dependency:

- `GM.getValue(key, default)` / `GM.setValue(key, value)` — persistent cross-session storage (replaces `localStorage`, which is origin-scoped and unreliable in userscripts).
- No `GM.xmlHttpRequest` is used yet; outbound API calls go through the page's `fetch` with an `Authorization` header.

`main.js` is the entry point. It checks `location.pathname` and boots the relevant Controller (currently only `FactionController` on `/factions.php`).

## Module Architecture

Each UI feature follows a three-class MVC split — see [ADR 001](docs/adr/001-mvc-one-way-data-flow.md) for the full decision record.

Data flow is **one-way**: user input events update the ViewModel; ViewModel changes do not automatically update the View. The View reads ViewModel state at render time only.

```
User input → View (event handler) → ViewModel (setter)
                                          ↑
Controller pre-fills on init ────────────┘
```

## Key Terms

| Term | Definition |
|---|---|
| **ViewModel** | Plain ES class holding module state as private fields with getter/setter pairs. No DOM, no side effects. |
| **View** | Builds and mounts DOM; wires input events to the ViewModel; reads ViewModel state at render time. |
| **Controller** | Owns the ViewModel and View; wires callbacks; integrates with shared services. Bootstrapped by `main.js`. |
| **SettingsStore** | Shared service wrapping `GM.getValue`/`GM.setValue` for persistent key-value storage. |
| **ApiClient** | Shared service that wraps `fetch` with a base URL, `Authorization` header, and typed error handling. Throws `MissingApiKey` when no key is set. |
| **MissingApiKey** | Custom error thrown by `ApiClient` when `apiKey` is null or empty. |
| **createPanel** | UI factory (`src/modules/faction/ui/createPanel.js`) that builds the Chain Report DOM panel and returns refs to the input and button. |
