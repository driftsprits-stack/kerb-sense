# Build plan

Revision 3 (3 October 2026). Follows `WEBSITE-STANDARDS.md` (highest priority), then `DESIGN.md`, `CONTENT.md` and `PROMPT.md`. Read `RESEARCH-NOTES.md` first.

This plan is a live checklist (standards item E27). Tick a task when it is done.

## The idea

A poster on a paper ground, in four colours: black, white, paper and green. The booth is the hero object and the signature interaction. The page reads like a short argument for a judge, in the order `PROMPT.md` section 5 gives, with a sticky index on desktop and the current section name on phones. The page unfolds as the visitor scrolls, with transforms only. The hero headline and the section titles rotate from the owner's copy pool. There are no shadows, gradients, opacity changes, fades, hover animations or rounded corners.

## Decisions taken from the owner (standards section 1)

- Team: first names only (Brenden, Justin, Min, Wen Wei, Jaden), with role and institution.
- `website-handoff/source/` and `website-handoff/references/` are in `.gitignore`. The other handoff files are committed.
- The site is at the root URL. The game is at `/play/` unchanged. CI checks its SHA-256.
- The landing page shows a real gameplay clip as a big thumbnail that goes to `/play/`. No iframe.
- No API keys, secrets, backend or database.

## Stack

- Vite 8, React 19, TypeScript (`strict`). React, three.js and the viewer are separate chunks.
- Tailwind 4 with every token in `src/styles/tokens.css`. Only the four `ks` colours exist. Spacing unit 8 px.
- react-three-fiber 9, drei 10, three.
- GSAP 3.15: SplitText (hero headline), ScrollTrigger (the unfold), the counters and the road band.
- Radix Toggle, Toggle Group, Tabs, Accordion and Dialog.
- Fonts: system Helvetica Neue; Kerb Block (self-hosted); Noto Sans JP subset (`scripts/subset-font.mjs`).
- Build-time only: sharp (icons), gltf-transform (GLB), fonttools (subset), Playwright and ffmpeg (clip).
- Tests: Vitest (unit, coverage), Playwright (E2E, axe, screenshots at 375, 768, 1024 and 1440), Lighthouse CI.
- CI: the game hash, the writing check, build with audit, lint, format, typecheck, unit tests, E2E, lychee, gitleaks, npm audit, CodeQL, Lighthouse CI, Dependabot.

## File layout

```
index.html, privacy/index.html, terms/index.html, 404.html
public/play/index.html           the game, byte-identical (SHA-256 in CI)
public/favicon.svg, favicon.ico, PNG icons, og-image.png, robots.txt
public/models/booth-flat.glb     meshopt, 104 KB
src/styles/tokens.css            four colours, paper, type scale, grid, fonts, focus ring
src/content.ts                   all fixed copy, from CONTENT.md and the proposal
src/copy-pool.json, src/copy.ts  the rotating display copy
src/lib/                         pure logic with unit tests: explode, views, grid, retry, budget, copy pool
src/components/                  Nav, Logo, SectionTab, LabelBlock, Section, SectionIndex, GridOverlay, Marquee, ErrorBoundary, unfold
src/bits/                        SplitText, Counter (React Bits, cleaned)
src/sections/                    Hero, Problem, Answer, Booth, Game, Plan, Measure, Safety, Team, Budget, Footer
src/booth/                       BoothViewer.tsx (lazy), BoothFallback.tsx, useBoothLoad.ts
src/assets/                      SVG renders, parts, logo, textures, the poster render, the clip, the fonts
scripts/                         icons, model, subset-font, record-clip, audit, writing, sitemap, check-play-hash, screenshots
docs/                            COMPLIANCE.md, LEGAL-REVIEW.md, DR.md, adr/0001 to 0008, screenshots/
.github/workflows/               ci.yml, pages.yml, codeql.yml, uptime.yml; dependabot.yml
```

## Page order

| #   | Section                     | Ground | Content                                                                                                                          |
| --- | --------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------- |
| 0   | Hero (poster mode)          | black  | Kerb Block title behind the booth, the product render then the live viewer, LED wave, zebra, katakana, tagline, the copy on one black panel, Play, See the booth. Pinned for 0.8 screens. |
| 1   | The problem                 | paper  | Two short paragraphs, the SPF figures with the source and the caveat.                                                            |
| 2   | Our answer                  | paper  | Three equal columns (Exists, Designed, Planned) that slide in from below with the scroll.                                       |
| 3   | The booth                   | paper  | The pinned scene (turn, explode, labels), the interactive viewer, the linked catalogue, the specs. The largest section.          |
| 4   | The game                    | paper  | The clip thumbnail, the running order in Kerb Block with 渡り方, the rules, the pledge, the profiles.                               |
| 4b  | Road band                   | black  | LOOK. LISTEN. CROSS. THEN CHECK. in Kerb Block. Stops under reduced motion.                                                      |
| 5   | The plan                    | paper  | Six months in future tense: a table on desktop, a stepper on phones.                                                             |
| 6   | How we will measure it      | black  | Six targets with a "Target" label, one paragraph on the method, the source.                                                     |
| 7   | Safe by design              | paper  | The website, the game and the programme kept separate; the safeguards accordion.                                                |
| 8   | The team                    | paper  | Role, first name, institution.                                                                                                   |
| 9   | The budget                  | paper  | S$3,000 requested, flat green bars, the top items.                                                                               |
| 10  | Footer                      | black  | Delta Challenge 2026 Track B, the YCM grant (text only), references, policy links, Back to top, the copyright line.              |

Every section opens with a green tab (number plus the title from the pool), one large summary sentence, then the detail, then a "Next:" link.

## The scroll unfold

- Hero: pinned; the title moves up, the zebra walks sideways, the LED wave drifts, the booth grows a little. The copy stays readable.
- Our answer: the three columns slide up from below, one after another, between 90% and 35% of the viewport.
- The booth: pinned for 2.2 screens (1.5 on phones). Progress 0 to 0.3 turns the booth to the side, 0.3 to 0.5 explodes it, 0.5 to 1 highlights the joystick, the up button, the screen glass, the rear panel and the latches while their labels slide in. At the end the viewer is interactive, exploded and on the side view.
- Reduced motion or no JavaScript: no pins, everything in its final state.

## The booth viewer

- Lazy chunk, loaded when a stage is near the viewport, only with WebGL and without reduced motion.
- Orthographic camera, `MeshBasicMaterial` in the palette, a 2 px black outline, no lights.
- Drag to rotate. Front, Side, Back, Top. Explode and Assemble. Click, tap or keyboard selection with a green highlight, the name and the purpose in the readout and in the catalogue.
- The static fallback shows the SVG light renders, swaps them with the view buttons, and lists every part with its purpose.

## Checklist

- [x] Research notes (revision 3)
- [x] Plan (this file, revision 3)
- [x] Handoff replaced; old logo, renders and GLB removed
- [x] Four-colour tokens, fonts, green tabs, sparing full stops
- [x] Content in the new reading order with status labels
- [x] Poster-mode hero with the live booth swap-in
- [x] Booth viewer, scene drive, linked catalogue, fallback
- [x] Scroll unfold (hero, our answer, booth scene)
- [x] Rotating copy pool with CI validation and `?copy=default`
- [x] Unit tests, E2E at four widths with axe, screenshots with scroll states
- [x] Audit, writing check, CI, Lighthouse
- [x] Docs: README, ADRs 0006 to 0008, LEGAL-REVIEW, COMPLIANCE with A1 to A18
- [x] Pull request updated with screenshots and the final report (driftsprits-stack/kerb-sense#1)
