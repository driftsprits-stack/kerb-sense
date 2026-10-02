# Build plan

Revision 2. Follows `WEBSITE-STANDARDS.md` (highest priority), then `DESIGN.md`, `CONTENT.md` and `PROMPT.md`. Read `RESEARCH-NOTES.md` first.

This plan is a live checklist (standards item E27). Tick a task when it is done.

## The idea

A one-page Swiss poster on a paper ground, built on a visible 12-column grid. The booth is the hero object. **"Show the grid."** is the one strong gesture. Every section opens with an Ahoy chevron tab and a full-stop headline. The only colours are the seven palette colours plus the paper ground. There are no shadows, gradients, opacity changes, fades, hover animations or rounded corners.

## Decisions taken from the owner (standards section 1)

- Team: first names only (Brenden, Justin, Min, Wen Wei, Jaden), with role and institution.
- `website-handoff/source/` and `website-handoff/references/` are in `.gitignore`. The other handoff files are committed.
- The site is at the root URL. The game moves to `/play/` unchanged. CI checks its SHA-256.
- The landing page shows a real gameplay clip as a big thumbnail that goes to `/play/`.
- No API keys, secrets, backend or database.

## Stack

- Vite 8, React 19, TypeScript (`strict`).
- Tailwind 4 with every token in `src/styles/tokens.css`. Tailwind's default palette is removed, so only `ks-*` colours exist.
- react-three-fiber 9, drei 10, three.
- GSAP 3.15 (SplitText only, for the hero headline).
- Radix Toggle, Toggle Group, Tabs, Accordion and Dialog.
- Build-time only: sharp (images), gltf-transform (GLB), Playwright and ffmpeg (clip).
- Tests: Vitest (unit, coverage), Playwright (E2E, axe, screenshots), Lighthouse CI.
- CI: build, lint, typecheck, unit tests, E2E, link check (lychee), gitleaks, npm audit, CodeQL, Lighthouse CI, the `/play/` SHA-256 check, Dependabot.

## File layout

```
index.html                       site entry
privacy/index.html, terms/index.html, cookies/index.html   policy pages (Vite multi-page)
404.html                         custom 404 (GitHub Pages)
public/play/index.html           the game, git mv'd, byte-identical (SHA-256 in CI)
public/favicon.svg, icons        kerbsense-mark-white-on-red.svg, PNG fallbacks, apple-touch-icon
public/robots.txt, sitemap.xml
src/styles/tokens.css            palette, paper, type scale, grid, focus ring
src/content.ts                   all copy, from CONTENT.md and the proposal only
src/lib/                         pure logic with unit tests: explode vectors, view angles, grid state, retry/backoff, circuit breaker
src/components/                  Nav, Logo, SectionTab, LabelBlock, GridOverlay, Marquee, PlayLink, ErrorBoundary
src/bits/                        SplitText, ScrollVelocity, Counter (React Bits, copied in and cleaned)
src/sections/                    Hero, Problem, Game, Booth, Programme, Targets, Safety, Team, Budget, Footer
src/booth/                       BoothViewer.tsx (lazy), BoothFallback.tsx, parts.ts
scripts/images.mjs               renders and parts to WebP and AVIF at 480 / 960 / 1600; og image
scripts/model.mjs                GLB: meshopt + quantise, strip UVs, keep node names
scripts/record-clip.mjs          Playwright + ffmpeg gameplay clip
scripts/audit.mjs                fails the build on banned CSS, off-palette colours, em dashes, emoji, or a changed game hash
scripts/check-play-hash.mjs      the SHA-256 check
docs/                            COMPLIANCE.md, LEGAL-REVIEW.md, DR.md, adr/, screenshots/
.github/workflows/               ci.yml, pages.yml, codeql.yml, uptime.yml; dependabot.yml
```

## Sections

The tab colour follows the section number in the cycle red, blue, green, yellow, light blue, black.

| # | Section | Tab | Content |
|---|---|---|---|
| 1 | **Hero** | red tab, green field | Responsive HTML/SVG thumbnail: zebra bars on the grid columns, the booth side silhouette cropped by the frame, "kerb sense" knocked out in green, the tagline, **Play the game.** and **See the booth.** One SplitText slide on the headline at load. |
| 1b | **Gameplay clip** | — | A big Ahoy-style thumbnail: the real clip (muted, looping, `playsinline`) with a WebP poster, a black label block "Play." and a press state. Click, tap, Enter or Space goes to `/play/`. |
| 2 | **The problem.** | blue | Big type left, three small columns right. The SPF figures quoted exactly with the source and the caveat. |
| 3 | **The game.** | green | Eight rules as numbered black label blocks. Radix Tabs for the three profiles. The pledge. The embed: click to load the iframe, with **Open full screen.** and **Open in a new page.** |
| — | Road band | yellow | ScrollVelocity marquee: "Look. Listen. Cross. Then check." in black. Stops under reduced motion. |
| 4 | **The booth.** | yellow tab, black text | The 3D viewer, the parts catalogue, the spec table, the elevations plate. |
| 5 | **The programme.** | light blue | Desktop: Swiss table (Month, Activities, Outputs). Phone: the Stepper on Radix Tabs. |
| 6 | **The targets.** | black | Six Counters, each with a **Target.** label. Headline: "Targets, not results." |
| 7 | **Safe by design.** | red | Radix Accordion of the safeguards. "Stop somewhere safe before you play." set big. |
| 8 | **The team.** | blue | Swiss table: role, first name, institution. |
| 9 | **The budget.** | green | Flat palette bars on a 0 to S$3,000 scale in a real table. |
| 10 | **Footer** | yellow, black text | Delta Challenge 2026 Track B, the YCM grant, the team name, the five references, policy links, "© 2026 Kerb Sense". |

**Nav.** Logo top-left (goes to the top). Lowercase links to the sections. **Show the grid.** toggle (also the `G` key). **Play the game.** On phones a Radix Dialog menu with `aria-expanded`, a focus trap and Escape to close, plus a sticky **Play.** button that respects safe-area insets.

**Motion (the only motion).** The booth viewer; the road band; the Counters (once each); the Stepper on input; one SplitText slide on the hero headline; the clip. All transform only. All stop under `prefers-reduced-motion`. Hover is instant.

## The game embed

- Click to load: a solid poster block **Play.** injects `<iframe src="…/play/" title="Kerb Sense, the game" allow="fullscreen">` and focuses it.
- **Open full screen.** uses the Fullscreen API. On iPhone it goes to `/play/`.
- Below 640px the Play. control goes straight to `/play/`.
- Loading state: a black block with "Loading the game." Error state: "The game did not load. Open it in a new page." with a link.

## The booth viewer

- `React.lazy`, loaded when the booth section is near the viewport. Skipped when WebGL is missing or reduced motion is on; then `BoothFallback` shows the static renders and the view buttons swap renders.
- `OrthographicCamera`, `MeshBasicMaterial` in the palette, drei `<Outlines>` in black, no lights, no environment, no shadows.
- Drag to rotate (OrbitControls, no zoom, no pan, `touch-action: pan-y`).
- **Front. Side. Back. Top.** Toggle Group; the last input wins and animations never stack (E21).
- **Explode.** Toggle: screen glass +Z, controls +Y with buttons spread on X, hardware −Z and ±X.
- Hover or tap a part: an Ahoy label block via drei `<Html>`. Catalogue cards show the same label on focus.
- GLB fetch: 15 s timeout, 3 retries with backoff, then a circuit breaker and the fallback (E15, E19, E20, S7). Error boundary with an STE message (E18).

## Assets

- WebP and AVIF `srcset` at 480 / 960 / 1600. No image over 300 KB except the hero.
- GLB under 1 MB (meshopt).
- og:image 1200×630 from the hero art.
- Favicon SVG plus PNG fallbacks and apple-touch-icon.

## Pages and SEO

- `/privacy/`, `/terms/`, `/cookies/` in STE. No contact email (BLOCKED, standards item 18).
- `404.html` on brand with links home and to `/play/`, `noindex`.
- Unique titles `Page name | Kerb Sense`, meta descriptions, canonical URLs, sitemap, robots, JSON-LD (`WebSite`, `VideoGame`, `Organization`), og and Twitter tags.

## Deploy

- `base: '/kerb-sense/'`.
- `pages.yml` on push to `main`: build, upload, deploy. Actions pinned to SHAs.
- Owner: Settings → Pages → Source → GitHub Actions; Enforce HTTPS.

## Checklist

- [x] Research notes
- [x] Plan (this file)
- [x] Scaffold, tokens, game moved to `/play/`, hash check
- [x] Image and model pipeline
- [x] Gameplay clip
- [x] Sections, nav, grid, embed
- [x] Booth viewer and fallback
- [x] Policies, 404, SEO
- [x] Unit tests with coverage, E2E with axe, screenshots
- [x] Audit script, CI workflows, Dependabot, CodeQL, Lighthouse, lychee, gitleaks
- [x] Docs: README, ADRs, DR, LEGAL-REVIEW, CONTRIBUTING, COMPLIANCE
- [ ] Pull request with screenshots and final report
