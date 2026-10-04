# ADR 0011: The owner's review and Astra's review (4 October 2026)

Date: 2026-10-04. Status: accepted.

## Context

Two reviews arrived on the same day. The owner asked for:

- an animated chart;
- no section markers or mark strip;
- product display like Apple and Nothing;
- Helvetica that does not look thin;
- an Ahoy hero with an animated background, replacing the dot matrix;
- a katakana column that stays inside its panel.

Astra's review (`site-review-2026-10-04/REVIEW.md`) listed 21 findings. Where the two disagree, the owner's decision stands.

## Decision

### Owner

- **Hero:** the Ahoy thumbnail. Green field, white crossing bars drifting sideways (transform only), the black side silhouette cropped by the frame. All copy, including the katakana, sits in one solid green panel above it.
- **Body text:** Helvetica Neue Medium (500); Regular read too thin. Space Grotesk was tried and rejected by the owner.
- **Charts:** the problem and budget charts are HTML. They play once on entering view (600 ms `power2.out`); reduced motion shows the final values.
- **Booth as a product:**
  - no frame round the stage;
  - "+" hotspots (screen, joystick, latches) in a DOM overlay, projected each frame and hidden when the part faces away;
  - a spec sheet of big numbers.
- **Removed:** the section markers and the mark strip.

### Astra, applied

- **Layout (findings 1 to 4):**
  - the hero buttons fit at 320 px;
  - section titles wrap on phones;
  - safety cards use a 72 px icon column on phones;
  - the view control is two rows below 1280 px.
- **Tour (5, 6, 15):**
  - leaving the tour keeps its last pose until a new input;
  - a part choice no longer swings to a stale preset;
  - the keyframes have holds, with `power2.inOut` per segment and the explode complete at 0.92;
  - a view button reads as pressed only while the camera is at that preset;
  - a short note explains manual mode.
- **Pixel swap (7):** the effect depends only on the requested drawing. It runs two 240 ms phases with about 24 px blocks.
- **Copy (9, 10):**
  - the hero line says free, browser and planned;
  - the safety line says sessions are planned;
  - the caveat no longer claims a cause it cannot show.
- **Performance and motion (11 to 13):**
  - the clip plays only while visible;
  - the canvas loop stops off screen;
  - camera reports are throttled to 100 ms and whole degrees;
  - a 44 px pause control stops the bars and the clip;
  - counters show final digits if reduced motion is switched on later.
- **Smaller fixes:**
  - the catalogue detail opens inline on phones, and the catalogue cards are one font;
  - the crossing icon stays 96 px until 1280 px;
  - Kerb Block labels are at least 18 px;
  - summaries are 24/32 and 20/28 px with `text-wrap: pretty`;
  - major grids have 24 px gutters;
  - there is one TARGETS label;
  - the logo has a 44 px target;
  - the manual camera moves in 300 ms `power2.inOut`;
  - the page wipe takes 300 ms.

### Astra, not applied

- **Keep the section tokens:** the owner removed them.
- **Caveat placement:** Astra wanted it above the plotted figures; the owner asked for it below the bars. The wording change was applied.
- **LED drift pause:** the LED field no longer exists. The pause control covers the bars and the clip instead.
- **Budget DOM list below 768 px:** the budget is HTML at every width now.

## Consequences

- Tests cover the new behaviour:
  - nothing spills its box at 320, 375 and 1024 px (these checks fail on the old code);
  - the tour holds its end pose and re-enters;
  - pressed states follow the camera;
  - the hotspots;
  - the charts play once and show final values under reduced motion;
  - the inline part detail.
- Not verified on a real low-end phone or with a Lighthouse trace.
