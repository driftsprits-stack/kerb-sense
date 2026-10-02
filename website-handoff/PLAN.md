# Build plan

Status: **waiting for approval. Nothing is built yet.** Read `RESEARCH-NOTES.md` first.

## The idea

A one-page Swiss poster built on a visible 12-column grid. The booth is the hero object, and **"Show grid."** is the one strong gesture. Every section opens with an Ahoy chevron tab and a full-stop headline. The only colours are the seven palette colours. There are no shadows, gradients, opacity changes or rounded corners.

## Stack

- **Vite 8 + React 19 + TypeScript.**
- **Tailwind 4**, with every token in `src/styles/tokens.css`: the palette, the type scale (12 / 14 / 16 / 20 / 28 / 40 / 64 / 96 / 160, the largest sizes fluid with `clamp`), tracking, the grid and the rule weights. Tailwind's default palette is switched off, so only `ks-*` colours exist.
- **react-three-fiber 9 + drei 10 + three.**
- **GSAP 3.15** (SplitText, ScrollTrigger).
- **Radix** Toggle, ToggleGroup, Tabs, Accordion, Dialog and Tooltip.
- **sharp** and **gltf-transform**, as build-time scripts only.

## File layout

```
index.html                    site entry (the game moves out of the root)
public/play/index.html        the game, git mv'd, byte-identical (checked by SHA-256 in CI)
public/favicon.svg            kerbsense-mark-white-on-red.svg
src/styles/tokens.css         palette, type scale, grid, focus ring
src/content.ts                all copy, taken only from CONTENT.md and the proposal
src/components/               Nav, Logo, SectionTab, LabelBlock, GridOverlay, PlayButton (Magnet), Marquee
src/bits/                     SplitText, ScrollVelocity, Magnet, Counter (React Bits, copied in and cleaned)
src/sections/                 Hero, Problem, Game, Booth, Programme, Targets, Safety, Team, Budget, Footer
src/booth/                    BoothViewer.tsx (lazy chunk), BoothFallback.tsx, parts.ts (node to label to explode vector)
scripts/images.mjs            renders and parts to WebP + AVIF at 480 / 960 / 1600
scripts/model.mjs             GLB: meshopt + quantise, strip UVs, keep node names (target under 150 KB)
scripts/audit.mjs             fails the build on banned CSS or off-palette colour, or if the game hash changes
.github/workflows/pages.yml   build, then upload-pages-artifact, then deploy-pages
```

## Sections

The tab colour follows the section number, using the cycle red, blue, green, yellow, light blue, black. This lines up with the document: site sections 2, 3, 5, 6, 8 and 9 have the same number and the same subject as the document's sections.

| # | Section | Tab | Content and components |
|---|---|---|---|
| 1 | **Hero** | red tab, green field | A responsive HTML/SVG thumbnail:<br>• zebra bars are SVG rectangles lined up with the grid columns;<br>• the booth side silhouette is huge and cropped by the frame (cropped harder on a 375px phone, not shrunk);<br>• "kerb sense" plus the roundel, knocked out in green on the black;<br>• tagline "Wait, and you get there first.";<br>• **Play.** (Magnet) and **See the booth.** buttons. |
| 2 | **The problem.** | blue | Big type on the left; three small columns on the right, as on the *Neue Grafik* cover. The SPF figures quoted exactly (142 → 149; 11 → 27), with the source and the "not caused by phone use or students" caveat. "Knowing the rules is not the same as following them." |
| 3 | **The game.** | green | The eight Ahoy rules as numbered black label blocks. Radix Tabs for the profiles (Primary School, Teenager, Office Worker). The pledge, and **I promise.** The embed (below). |
| — | Marquee | yellow band | "Look. Listen. Cross. Then check." in black, scroll-linked. |
| 4 | **The booth.** (largest) | yellow (black text) | The 3D viewer (below), the Cocricot parts catalogue, the spec sheet as a Swiss table (3px rule on top, 1px rules between rows), and the elevations plate. |
| 5 | **The programme.** | light blue | Desktop: a Swiss table with the columns Month / Activities / Outputs. Phone: the Stepper (Radix Tabs, squares 1–6). |
| 6 | **The targets.** | black | Six huge rolling Counters, each with a **"Target."** label block, under the headline "Targets, not results. The pilot has not run yet." |
| 7 | **Safe by design.** | red | Radix Accordion of the safeguards, with "Stop somewhere safe before you play." set big. |
| 8 | **The team.** | blue | A Swiss table of role and institution (see question 1). |
| 9 | **The budget.** | green | Flat palette bars on a 0–S$3,000 scale, as a real `<table>` with bar cells; the top items; "No grant money goes to cash prizes or to team members." |
| 10 | **Footer** | yellow (black text) | Delta Challenge 2026 Track B (SPF and NCPC); NYC Young ChangeMakers grant; TEAM if raeann cared; the five references from section 14; logo white on black. |

**Nav.** Logo top-left. Small lowercase links: problem, game, booth, programme, targets, safety, team, budget. A **Show grid.** toggle and a **Play.** button. On phones the nav becomes a Radix Dialog: a full-screen black sheet with big type.

**Motion.**
- SplitText headlines slide up from behind a hard mask.
- Section tabs use the Ahoy diagonal `clip-path` wipe.
- The Magnet pull on **Play.** buttons.
- Counter rollers on the targets.
- The marquee.

Nothing fades or blurs. Under `prefers-reduced-motion`, everything renders in its final state.

## The game embed

- **Click to load.** A poster block reading **Play.**. Clicking it injects `<iframe src="${BASE_URL}play/" title="Kerb Sense, the game" allow="fullscreen; autoplay">` and then focuses it. This means no audio and no 177 KB download until the visitor asks for them.
- **Open full screen.** On desktop and Android this uses the Fullscreen API on the frame; on iPhone it goes to `/play/`. There is also an always-visible "Open in its own page" link.
- **Phones.** Below 640px, Play. goes straight to `/play/`. The game uses `touch-action: none`, which would otherwise trap page scrolling inside the embed.

## The booth viewer

- **Lazy loading.** It is a `React.lazy` chunk, fetched when the booth section is within one screen of the viewport.
- **When it is skipped.** It is not loaded at all if WebGL is missing or `prefers-reduced-motion` is set. In that case `BoothFallback` shows the static renders (`booth-flat-*`), and the **Front. Side. Back. Top.** buttons still work by swapping renders.
- **Camera.** `OrthographicCamera`, no lights, no environment map and no shadows.
- **Materials.** Every mesh gets a `MeshBasicMaterial` in its palette hex, mapped from the GLB material name.
- **Outline.** drei `<Outlines>`: black back-face hulls, thickness tuned to match the renders.
- **Drag to rotate.** OrbitControls with zoom and pan off, so the page keeps scrolling. On touch, horizontal drags rotate and vertical swipes scroll the page (`touch-action: pan-y`).
- **Snaps.** A ToggleGroup with **Front. Side. Back. Top.** that tweens to the same angles as the renders, or jumps straight there under reduced motion.
- **Explode.** A Toggle that tweens each part along one clean axis:
  - screen glass forward (+Z);
  - joystick and buttons up (+Y), with the buttons spread on X;
  - hinges, latches, pins and hooks backward (−Z) and out on ±X;
  - the interior plane backward.
- **Labels.** Hover or tap a part to show an Ahoy label block (drei `<Html>`, black block, white bold "Joystick."). Hovering or focusing a card in the parts catalogue shows the same label on the model, so keyboard and screen-reader users get the same information. The canvas has an `aria-label`, and the catalogue is the accessible list of parts.

## Assets and performance

- WebP and AVIF `srcset` at 480 / 960 / 1600 px, with `loading="lazy"` below the fold.
- GLB under 1 MB (expected around 100–150 KB with meshopt).
- three.js lives only in the lazy booth chunk.
- System fonts only.
- Alt text on every image. Decorative zebra bars are `aria-hidden`.

## Deploy

- `vite.config.ts` sets `base: '/kerb-sense/'`.
- The workflow runs on push to `main`: `npm ci`, then `npm run build` (which runs the audit), then upload, then deploy.
- **One manual step for the repo owner:** in Settings → Pages → Source, choose **GitHub Actions**. A workflow cannot switch this itself.
- After the merge, `driftsprits-stack.github.io/kerb-sense/` becomes the website and the game lives at `/kerb-sense/play/`.

## Checking

1. `scripts/audit.mjs` checks the built CSS and JS. It fails on:
   - any `gradient`, `box-shadow`, `text-shadow`, `filter:`, `backdrop-filter` or `opacity` other than 1;
   - any `border-radius` other than 0 (the roundel SVG is exempt);
   - any colour that is not one of the seven hexes;
   - a change to the game's SHA-256.
2. Playwright screenshots of every section and of `/play/` at **1440 px** and **375 px**, plus a keyboard-only walk (Tab through the nav, the grid toggle, the snaps, explode, the embed and full screen).
3. Contrast check against the table in RESEARCH-NOTES §8.
4. Note: the container has no Helvetica, so screenshots will render in the Arial or Liberation fallback. Real Macs and iPhones get Helvetica Neue.
5. Open a PR. Screenshots go in `docs/screenshots/` on the branch and are embedded in the PR description.

## Questions before building

1. **Team names.** PROMPT.md says "roles and institutions only", but CONTENT.md lists names as public. Should the five names go on the site? (Default: show role, name and institution, as CONTENT.md says.)
2. **What goes into the public repo.** The repo is public. Should `website-handoff/` be committed in full? `source/proposal-full-text.txt` is the whole grant proposal, and `references/` holds third-party images. (Default: commit the Markdown docs only, git-ignore `source/` and `references/`, and copy the assets the site needs into `src/assets/`.)
3. **The URL change.** Are you OK with the root URL becoming the website and the game moving to `/play/`? Anyone with the old link lands on the site, which has a big **Play.** button.
