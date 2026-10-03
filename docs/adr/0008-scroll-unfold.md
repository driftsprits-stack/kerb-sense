# ADR 0008: The scroll unfold with GSAP ScrollTrigger

Date: 2026-10-03. Status: superseded by ADR 0009.

## Context

`PROMPT.md` section 5a asks for an Apple-style unfold: the hero pins, "Our answer" slides in, and the booth scene turns, explodes and labels the model as the visitor scrolls. `WEBSITE-STANDARDS.md` allows it only as transform-only motion, scrubbed to the scroll position, reversible, with no scroll-jacking and a full static fallback.

## Decision

- GSAP ScrollTrigger, already a dependency through SplitText, drives every scene. `src/components/unfold.ts` wraps it in `useUnfold`: a layout effect that builds the scene inside a `gsap.context`, refreshes after load, restores a deep link once the pins have added their space, and reverts everything on unmount.
- With `prefers-reduced-motion: reduce` the hook does nothing. The page then shows every scene in its final state: the columns in place, the labels listed, the viewer replaced by the static renders. With JavaScript off the static HTML shows the same.
- Every tween uses `transform` only (`yPercent`, `xPercent`, `scale`). No opacity, no blur. `scrub: true` ties progress to the scroll position, so scrolling up reverses it exactly and the native scroll speed is untouched.
- Pins are short: the hero pins for 0.8 screen heights (0.5 on phones) and the booth scene for 2.2 (1.5 on phones).
- The booth scene writes its state into a ref (`SceneDrive`: active, azimuth, explode, part) on every update. The viewer's frame loop reads it and moves the camera and the parts toward those values. When the pin releases (`onLeave`, or progress 1) the scene hands over: the viewer is interactive, exploded and on the side view, and the controls show that state. Scrolling back up takes the scene over again.
- The pinned scene holds only the controls, the stage and the labels, so it fits a 375 by 812 screen with the sticky Play bar.

## Consequences

- The viewer and the catalogue work without the scene (the essential level in `PROMPT.md` section 6).
- The E2E test "the scroll unfold is scrubbed to the scroll, reverses and keeps native scrolling" checks the pins, the transform at three scroll positions, the exact reverse, and that `window.scrollY` is where the test put it.
- A deep link such as `#booth` lands before the scene, so a visitor who follows the index scrolls through it.
