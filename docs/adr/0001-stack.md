# ADR 0001: Vite, React, TypeScript and Tailwind tokens

Date: 2026-10-02. Revised 2026-10-03. Status: accepted.

## Context

The brief asks for Vite, React and TypeScript. Tailwind is allowed if the palette and type scale live in tokens from `DESIGN.md`.

## Decision

- Vite 8 with React 19 and TypeScript in `strict` mode.
- Tailwind 4, with its default palette, shadows, blur, radius and animation tokens removed in `src/styles/tokens.css`. Only the four colours (black, white, paper and green) exist. Tailwind's preflight is not used; the site's own base layer is the reset. The spacing unit is 8 px.
- Radix primitives (Toggle, Toggle Group, Tabs, Accordion, Dialog) for accessible behaviour, fully restyled.
- GSAP for the hero SplitText slide, the counters and the scroll unfold (ADR 0008).
- Fonts as in ADR 0006: the system Helvetica Neue stack, the self-hosted Kerb Block, and a Noto Sans JP subset.
- React, three.js and the viewer are split into their own chunks (`vite.config.ts`), so the first paint loads only React and the page code.

## Consequences

- Any colour outside the four fails `scripts/audit.mjs`.
- The CSS is about 20 KB and has no third-party styles.
- Windows visitors see Arial for the text face.
