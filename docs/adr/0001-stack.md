# ADR 0001: Vite, React, TypeScript and Tailwind tokens

Date: 2026-10-02. Status: accepted.

## Context

The brief asks for Vite, React and TypeScript. Tailwind is allowed if the palette and type scale live in tokens from `DESIGN.md`.

## Decision

- Vite 8 with React 19 and TypeScript in `strict` mode.
- Tailwind 4, with its default palette, shadows, blur, radius and animation tokens removed in `src/styles/tokens.css`. Only the seven `ks` colours and the paper ground exist. Tailwind's preflight is not used; the site's own base layer is the reset.
- Radix primitives (Toggle, Toggle Group, Tabs, Accordion, Dialog) for accessible behaviour, fully restyled.
- No webfonts. The system Helvetica Neue stack only.

## Consequences

- Any colour outside the palette fails `scripts/audit.mjs`.
- The CSS is small (about 30 KB) and has no third-party styles.
- Windows visitors see Arial.
