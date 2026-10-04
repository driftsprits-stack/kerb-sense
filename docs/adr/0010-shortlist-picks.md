# ADR 0010: The rest of the website shortlist (picks 6, 8 and 18 to 30)

Date: 2026-10-04. Status: accepted.

## Context

`kerb-sense-website-shortlist.md` lists 30 picks. The first pass (ADR 0009) used the start picks. The owner asked for the rest: the Playgrnd art (18 to 25), the optional picks (6, 8, 26 to 28) and the deferred ones (29, 30). The shortlist itself sets the limits: one graphic language in the body, static assets rather than live editors, no new animation framework, native scrolling.

## Decision

- **Art as code (18 to 25).** Playgrnd is a design-time tool, so each tool's idea is rebuilt as a small script that writes static SVG in the brand palette, sampled from the real booth renders: `scripts/art.mjs` (Stipple, Oddgrid, Optic, Vee, Cipher, Tokens, the grid) and `scripts/share-images.mjs` (Kiosk and Specimen share images). `npm run art` makes them all again. Assets: `src/assets/art/`, `public/og-image.png`, `public/og-specimen.png`.
- **Where each one is used.**
  - Kiosk (18) is the home share image.
  - Specimen (25) is the share image for privacy, terms and the 404 page.
  - Oddgrid (21) is the 404 page art, beside the text.
  - Cipher (22) is one strip of abstract marks beside PLAY, from 768 px.
  - Tokens (23) are the section markers in the tabs and the menu, always next to the word.
  - Stipple (19), Optic (20) and Vee (24) appear in the share images only. The page body keeps one graphic language, the LED dots (shortlist step 5).
- **Shape Grid (8):** paper lines on white behind the dimension drawing, stopping before its captions, so no text sits on a texture.
- **Accordion Gallery (6):** the static booth views (no WebGL, reduced motion, model error, loading). The current view fills the stage and the others are labelled strips that open their view. The panels change at once, with no dimming, tilt or parallax.
- **Variant (26):** three hero compositions compared in `docs/explorations/hero-variants/`. The live poster hero stays; the note explains why and what B would need.
- **Physical control (27):** the view buttons are one joined control with a TURN / TILT readout that follows the scroll tour. They are still ordinary buttons with `aria-pressed`.
- **Dominant value (28):** each target has its unit, an AT LEAST tag where it applies, a short label and one line of context from the proposal.
- **Page transitions (29):** native cross-document View Transitions instead of Barba. The browser still does a full page load, so history, focus and the title need no code. The new page wipes in with `clip-path` (no fade). Only pages that load the site stylesheet take part, so `/play/` always opens plainly. It is off under reduced motion. Barba would have added a router layer to a four-page site and needed special handling for the game.
- **Lenis (30):** opt-in only, with `?smooth=1`. It never runs under reduced motion and is loaded as its own chunk, so normal visits never fetch it. There is one loop: GSAP's ticker drives Lenis, and Lenis updates ScrollTrigger. Hash links work, and the menu dialog keeps its own scrolling. Native scrolling stays the default, because the standards require native scroll speed; the owner can compare the two and decide.

## Consequences

- One new runtime dependency: `lenis` (about 18 KB, loaded only with `?smooth=1`).
- The audit still passes: the art uses the palette, and the transition and Lenis CSS avoid `transition` and opacity.
- Tests in `tests/redesign.spec.ts` cover the markers, the readout, the cipher strip, the targets, the grid, the share images, the accordion, the transition rule, the Lenis opt-in and fresh-load deep links.
- Removing the scroll unfold (ADR 0009) had broken fresh-load deep links such as `#plan`; `App.tsx` now jumps again once the sections exist.
