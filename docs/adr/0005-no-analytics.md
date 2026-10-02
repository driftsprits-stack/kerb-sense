# ADR 0005: No analytics and no third-party scripts

Date: 2026-10-02. Status: accepted.

## Context

The site is for students. The standards ask for no PII, no trackers, no cookie banner that does nothing, and a strict CSP.

## Decision

- No analytics, no error logging service, no fonts, images or scripts from other origins. The CSP allows `'self'` only (plus `'unsafe-inline'` for styles, which Vite and GSAP need, and `'wasm-unsafe-eval'` for the model decoder).
- Errors are logged to the browser console only, with no personal data.
- One localStorage key remembers the grid toggle. The privacy and cookies pages name it.
- If the owner wants analytics later, it must be cookieless and aggregate, with a stated retention period, disclosed on the privacy page.

## Consequences

- No cookie consent banner is needed.
- The team has no visitor numbers. The GitHub Pages traffic graph gives rough counts.
