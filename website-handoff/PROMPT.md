Build the public website for **Kerb Sense**, our Delta Challenge 2026 (Track B, Road Safety) project. It must showcase the project, host our browser game, and make our **arcade booth** the hero, shown as an interactive 3D model.

Everything you need is in `website-handoff/` in this repo. Read these first, in order:
1. `website-handoff/DESIGN.md`: the design system (it is binding).
2. `website-handoff/CONTENT.md`: what to say, and what must NOT be published.
3. `website-handoff/references/`: six reference images.
   - `ref-1`: Swiss poster (Aeschbacher/Bill/Müller/Linck, Kunsthalle Basel 1959).
   - `ref-2`: Fiat ads in a Swiss annual.
   - `ref-3`: the *Neue Grafik* cover.
   - `ref-4`: Ahoy's thumbnail rules infographic.
   - `ref-5`: an Ahoy-style thumbnail.
   - `ref-6`: a Swiss/Japanese type poster.
   Study them closely before designing anything.
4. `website-handoff/source/proposal-full-text.txt`: the full proposal, the source of truth for facts and numbers.

## Research first, then plan

Before you write code, do this research and write a short `website-handoff/RESEARCH-NOTES.md`:
- **Ahoy (Stuart Brown's YouTube channel)**: watch or read about https://www.youtube.com/watch?v=yh2FGCYC63Q and his thumbnail style. The rules in `ref-4` are law:
  - seven colours only;
  - Helvetica Neue Bold;
  - big type, kerned tight but never touching;
  - always a full stop;
  - no drop shadows, gradients or opacity;
  - simplified flat silhouettes, cropped boldly.
- **Swiss style on the web**: read https://swissthemes.design/insights/swiss-style-website-examples. Pick the **one strong gesture** this site will be built around. My suggestion: a "Show grid" toggle that reveals the 12-column grid, because our game is literally about a road grid.
- **Sites I like**: https://sunnamps.com/ (lowercase Helvetica headlines, logo top-left, a confident product hero) and https://cocricot.pics/ (calm paper-like page, tiny single-colour nav, a catalogue grid of isolated objects). Our logo is inspired by the Sunn roundel.
- **React Bits**: go through https://reactbits.dev/get-started/index and the whole component catalogue. Pick the components that make the site feel modern and usable **without breaking the Ahoy rules**. Avoid anything with glow, gradients, blur, glass, particles or opacity fades. Good candidates are text-split or scroll reveals that move solid type, marquees, magnetic or press interactions, steppers and counters. List what you chose and why.
- **RN Primitives**: go through https://rnprimitives.com/#core-primitives. These are React Native ports of Radix-style headless primitives. For a web build, use them only if they work cleanly on web. Otherwise use the equivalent **Radix UI** primitives (accordion, tabs, dialog, toggle, tooltip) for accessible behaviour, styled entirely by our design system.

## The game

Our game is live at https://driftsprits-stack.github.io/kerb-sense/ from the repo `driftsprits-stack/kerb-sense`.
- **Do not change the game's code or behaviour.** It is finished and tuned.
- Host it as part of the site at `/play/`: inspect the repo and move or copy the existing game files there, unchanged. Make sure it still loads its assets and stays playable.
- On the main site, add a big Ahoy-style "Play." entry point, and an embedded preview (an iframe of `/play/`) with a clear "open full screen" option. Keyboard and mouse focus must work inside the iframe.
- Deploy everything with GitHub Pages using a GitHub Actions workflow. Configure the base path correctly for a project page.

## The booth (main focus)

Use `website-handoff/assets/models/booth-flat.glb`. Its nodes are named `cabinet`, `screen_glass`, `joystick`, `button_up/down/left/right`, `hinge_left/right`, `latch_left/right` and so on.
- Build it with **react-three-fiber + drei**, using an **orthographic camera** and **unlit, flat materials** (`MeshBasicMaterial` with the palette colours, no lighting and no shadows) so it looks exactly like the flat renders. Add a solid black outline (for example back-face outlines, or drei `<Outlines>`). Use no environment maps.
- Interactions:
  - drag to rotate;
  - snap buttons for **Front. Side. Back. Top.**, matching the orthographic renders;
  - an **"Explode."** toggle that slides the parts apart along clean axes;
  - hover or tap on a part to show an Ahoy-style label block with the part's name.
- Pair it with a Cocricot-style **parts catalogue grid** using `assets/booth/parts/`, and a spec sheet: 61.7 × 71.2 × 66.8 cm, 12 mm MDF or plywood, four buttons plus a joystick, three stations.
- The fallback for no WebGL or reduced motion is the static renders.

## Site structure

This is a one-page site with numbered sections, plus `/play/`. Use the Ahoy colour-cycle tabs from DESIGN.md:
1. **Hero**: an Ahoy thumbnail built from `booth-silhouette-side.webp` on green with zebra-crossing bars and the knocked-out wordmark (see `assets/booth/plates/hero-16x9.webp`; rebuild it responsively in HTML, CSS or SVG rather than using the flat PNG). Include the tagline "Wait, and you get there first." and two actions: **Play.** and **See the booth.**
2. **The problem.**
3. **The game.** Show the mechanics as short Ahoy rules, with the embed.
4. **The booth.** The 3D model, parts catalogue and specs. This is the largest section.
5. **The programme.** The six-month timeline as a Swiss table or stepper.
6. **The targets.** Big numbers (900 / 1,500 / 20 / 20% / 75%), clearly labelled as targets.
7. **Safe by design.** Safety and privacy.
8. **The team.** First names, roles and institutions only (see CONTENT.md).
9. **The budget.** S$3,000 as flat bars in the palette.
10. **Footer.** Delta Challenge 2026 Track B, the YCM grant and references.

## Technical requirements

- Vite + React + TypeScript; Tailwind is allowed, but put the palette and type scale in CSS variables or tokens from DESIGN.md.
- Fonts: the system Helvetica Neue stack only, with no webfonts.
- Performance: convert the PNG renders to WebP or AVIF in several sizes, lazy-load the 3D section, and keep the GLB under 1 MB (Draco or meshopt compression is fine).
- Accessibility: WCAG AA contrast (never white on yellow), full keyboard navigation, visible focus (a 3px black or white outline, square), `prefers-reduced-motion` support, and alt text for every image.
- Mobile: it must look intentional on a 375px-wide phone, not just shrink.

## Process

Work end to end without stopping for approval. The owner has already made every decision (see section 1 of `WEBSITE-STANDARDS.md`).
1. Do the research and write `RESEARCH-NOTES.md` and `PLAN.md` (follow `WEBSITE-STANDARDS.md`). Do not wait for approval; continue straight to the build.
2. Build the complete site. Run it locally and take screenshots at 375, 768 and 1440px. Check every page against `DESIGN.md` and `WEBSITE-STANDARDS.md`: no gradients, shadows, opacity animation, rounded corners or off-palette colours.
3. Fill in `docs/COMPLIANCE.md`. Commit, push, and open a pull request with the screenshots and the final report (DONE, N/A, OWNER and BLOCKED items) in the description.
4. If a push fails, keep working and committing locally, and say so in the final report.
