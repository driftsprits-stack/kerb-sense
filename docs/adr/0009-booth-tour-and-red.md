# ADR 0009: The sticky booth tour, and one red for "not allowed"

Date: 2026-10-03. Status: accepted. Supersedes ADR 0008.

## Context

The owner's review asked for a shorter page: the whole site readable in one to two minutes, and the game reached within six screens on a wide screen. The pinned scroll unfold (ADR 0008) added about 3 screens of pinned scroll and moved the camera without the visitor's input. Astra's animation brief asked for a sticky booth beside short explanations, with manual control always winning, and a detail panel for each part.

The owner also asked for the "nothing stored" safety icon to be a floppy disk with a red strike, so that "not allowed" reads at a glance.

## Decision

- **No pins.** `src/sections/Booth.tsx` places the viewer in a sticky column beside three short tour blocks (`BOOTH.tour` in `src/content.ts`). An `IntersectionObserver` with a thin band in the middle of the viewport marks the active block, and that block sets the view (front, top, back) and highlights its part.
- The tour runs only on screens at least 1024 px wide and 700 px tall. Smaller screens show the same blocks as a list, with no sticky stage.
- **Manual control wins.** A view button or a part choice overrides the tour until the visitor scrolls to a different block. The tour list has bottom padding so the sticky stage stays fully visible at the last block.
- **Part detail.** Selecting a part in the catalogue fills a sticky panel with its drawing, number, name and purpose. Selecting it again clears the panel. Under reduced motion the panel does not slide.
- **Red.** `#AC1E39` joins the palette for one use only: the strike line on the safety icons ("not allowed"). `scripts/audit.mjs` allows it; nothing else may use it.
- `src/components/unfold.ts` is deleted.

## Consequences

- At 1440 by 900 the game section starts at about 5.8 screens and the page is about 10.4 screens. The test "the page is short" checks the limits of 6 and 12.
- The tests "the tour turns the booth as each explanation scrolls past, and a manual choice wins" and "selecting a part opens its detail and selecting it again closes it" cover the behaviour.
- `DESIGN.md` in the website handoff must mention the red exception, so a later designer does not remove it.
