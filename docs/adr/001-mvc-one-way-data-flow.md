# ADR 001 — MVC Module Structure and One-Way Data Flow

**Status:** Accepted  
**Date:** 2026-09-03

## Context

Torn Chain Report is a TamperMonkey userscript. UI modules need a consistent structure that is easy to test with jsdom and easy to extend without entangling state management with DOM manipulation.

## Decision

Each UI feature module follows a three-class MVC split:

- **ViewModel** — holds state as plain private fields with getter/setter pairs. No DOM knowledge. No side effects.
- **View** — reads ViewModel state at render time and writes back on user input events. Never observes ViewModel changes.
- **Controller** — owns the ViewModel and View instances, wires callbacks (e.g., `onSave`), and integrates with shared services (e.g., `SettingsStore`).

Data flow is **one-way**: user input → View event handler → ViewModel setter. Programmatic changes to the ViewModel (e.g., pre-filling from storage) do **not** propagate back to the DOM automatically. The View is responsible for explicit re-renders when needed.

## Consequences

- Views are stateless after `render()` — the ViewModel is the single source of truth.
- jsdom tests can assert ViewModel state after simulating input events without inspecting the DOM.
- No observer, signal, or reactive proxy infrastructure is needed or introduced.

## Considered Alternatives

**Reactive ViewModel (signals / observers / Proxy):** a ViewModel that notifies listeners on every setter call, allowing Views to auto-update. Considered and **deferred** — the added infrastructure (event emitter, Proxy traps, or a signals library) is not warranted at userscript scale. If the UI grows to require live-updating displays (e.g., chain timer), this decision should be revisited and a new ADR written.
