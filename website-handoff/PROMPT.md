# Build the Kerb Sense website

## 1. Purpose and audience

Build a public website for **Kerb Sense**: a student road-safety project that combines a browser game, a portable arcade booth, and a planned six-month schools programme. It is our entry for Delta Challenge 2026, Track B (Road Safety Education).

- **Primary audience:** competition judges and school organisers. They must understand the project and trust it.
- **Secondary audience:** students. They need one obvious route into the game.
- **The first screen must answer four questions:**
  - What is Kerb Sense?
  - Who is it for?
  - Why does the physical booth matter?
  - Where do I play?

  Pair the tagline "Wait, and you get there first." with the one-liner from `CONTENT.md`. The tagline alone does not explain the project.
- **The booth is the main visual subject and the signature interaction.** "Explore the booth" is the defining experience of the site. It is visible in the hero and has the largest section.
- **One colour scheme:** black, white, paper and green only (`DESIGN.md`). The earlier multi-colour version is wrong; remove all red, yellow, blue and light blue.
- **New logo:** use the files in `assets/logo/` (lowercase wordmark with a green square full stop, and the "k." monogram). The earlier round-dot logo is retired; remove it everywhere.
- **Full stops sparingly:** only the hero headline and the big section titles end with a decorative full stop (`DESIGN.md` section 2). Buttons, nav, tabs, labels, part names, numbers and captions do not.
- **Be accurate.** Clearly separate what exists (the game, the booth design) from what is planned (building the booth, the programme), what is requested (the grant) and what is a target (the numbers). `CONTENT.md` has a status table for this. Follow it exactly.

## 2. Files, in order of priority

All files are in `website-handoff/`. If two files disagree, the higher one wins:
1. `WEBSITE-STANDARDS.md`: mandatory rules and acceptance checks.
2. `DESIGN.md`: the design system, including the exact section colour table.
3. `CONTENT.md`: what to say, each item's status, and what must not be published.
4. This file.
5. `references/`: six reference images. Look at them before you design.
   - `ref-1`: Swiss poster, Kunsthalle Basel 1959.
   - `ref-2`: Fiat ads in a Swiss annual.
   - `ref-3`: *Neue Grafik* cover.
   - `ref-4`: Ahoy's thumbnail rules.
   - `ref-5`: an Ahoy thumbnail.
   - `ref-6`: a Swiss/Japanese type poster.
6. `source/proposal-full-text.txt`: the full proposal. Use it to check facts and numbers.

## 3. Final URLs and routes (the complete route set)

GitHub Pages project site, so the base path is `/kerb-sense/`:

| Route | Final URL | What it is |
|---|---|---|
| `/` | https://driftsprits-stack.github.io/kerb-sense/ | The one-page website |
| `/play/` | https://driftsprits-stack.github.io/kerb-sense/play/ | The game, full page |
| `/privacy/` | .../kerb-sense/privacy/ | Privacy and cookies policy |
| `/terms/` | .../kerb-sense/terms/ | Terms of use |
| `404.html` | any unknown URL | Custom 404 page |

There are no other pages. If the owner adds a custom domain later, only the base path changes.

## 4. The game: the boundary contract

- **Source:** `index.html` at the root of `driftsprits-stack/kerb-sense`, commit `e1d8f1f9debb161d54bf6e56e43f131821251bf4` (28 Aug 2026). It is one self-contained file: no external assets, no storage, no cookies, no network requests. SHA-256 of the deployed file: `d5dd3116553426731172dfa662764b8fb5c57ad6be87cb117de4753a96170d1f`.
- **Preservation:** copy that file to `public/play/index.html` byte for byte. In CI, check that its SHA-256 still matches the value above. If the owner later updates the game on purpose, they update the hash in the same commit.
- **No wrapper page.** `/play/` serves the game file directly.
- **Which standards apply inside the game:** none that need code changes. Website rules (meta tags, policies, analytics, mobile layout, accessibility fixes) apply to the website only. Report any problems you find inside the game in the final report. Do not fix them.
- **If moving the game breaks something** (for example a path), stop that part, do not edit the game, and report it.
- **On the landing page:** show a real recorded gameplay clip as a large Ahoy-style thumbnail that opens `/play/` (details in `WEBSITE-STANDARDS.md` section 1). **No iframe of the game on the landing page.**

## 5. Page order (the reading journey)

The page reads like a short, clear argument for a judge: **what it is → why it is needed → our answer → the booth → the game → the plan → how we will measure it → safety → who → cost.** Every section opens with one large summary sentence, then the detail. Use the reading aids in `DESIGN.md` section 6 (a sticky section index on desktop, the current section name on mobile, a "Next:" signpost at the end of each section).

All section tabs are green with white text (`DESIGN.md` section 1). There is no colour cycle.

0. **Hero (poster mode, black).** Build it from the A2 poster (`assets/poster/kerb-sense-poster-A2.svg`; see `DESIGN.md` section 7):
   - **Title:** the huge Kerb Block title "KERB SENSE" (white), behind the booth.
   - **Booth:** in the centre, overlapping the title. Use the glossy product render `assets/poster/booth-product.webp` as the poster, then swap in the live 3D booth when the viewer loads.
   - **Textures:** the LED dot-matrix wave and the perspective zebra crossing (`assets/textures/`).
   - **Japanese:** the vertical green katakana カーブセンス, and the vertical tagline 待てば、先に着く。 (`lang="ja"`).
   - **Visible text:** the hero headline from `copy-pool.json` and the one-liner from `CONTENT.md`, in Helvetica on black with no highlight boxes. Then **Play** (to `/play/`) and **See the booth** (to the viewer).
   - **First screen:** at 375×812 and 1440×900, the booth, the one-liner and "Play" are visible without scrolling.
   - **Mobile:** recompose. The title goes above the booth, and the katakana column stays thin at the edge.
1. **The problem.** Short: two or three sentences and one sourced statistic. Why phone distraction at crossings matters.
2. **Our answer.** One orientation screen with three equal columns, each with one sentence and a link down the page:
   - **the game** (exists, playable now);
   - **the booth** (designed, to be built);
   - **the programme** (planned, six months, three schools).
3. **The booth.** The 3D viewer, the linked parts catalogue and the specs. This is the largest section and the signature interaction.
4. **The game.** The gameplay clip thumbnail (it opens `/play/`), the mechanics as short Ahoy rules, and the WIRE-style running order from `CONTENT.md` in Kerb Block, with the 渡り方 label.
5. **The plan.** The six-month programme in future tense.
6. **How we will measure it (black section).** The six targets, each labelled "Target": **900** participants; **1,500** game sessions; **20** student ambassadors; **≥20%** relative reduction in visible phone use while crossing; **≥20 percentage-point** improvement in safe-crossing rate (first run vs coached replay); **≥75%** of exit respondents recall the phone-check sequence. Add one short paragraph on how they will be measured (anonymous observation tallies, in-session comparison, exit question).
7. **Safe by design.** Safety and privacy. Keep the website, the game and the future programme separate (see `CONTENT.md`).
8. **The team.** First names, roles and institutions.
9. **The budget.** S$3,000 requested, as flat green bars on paper.
10. **Footer (black).** Delta Challenge 2026 Track B and the YCM grant (text only, no logos), references, policy links, "Back to top" and the copyright line.

## 5a. The scroll unfold (Apple-style)

Make the page **unfold as the visitor scrolls**, like an Apple product page, while obeying `WEBSITE-STANDARDS.md` (transform only, scrubbed to scroll, no opacity, no scroll-jacking, a full static fallback):
1. **Hero to booth:** pin the hero. As you scroll, the booth silhouette slides from its cropped position to the centre and the zebra bars slide sideways like a crossing being walked. The headline moves up and out of the way, then the pin releases into "The problem.".
2. **"Our answer.":** three columns (game, booth, programme) slide in from below, one after another, tied to scroll progress.
3. **The booth (the main scene):** pin the 3D booth. Scroll progress drives the model: front view, then a slow turn to the side, then **Explode** (the parts separate), then each key part is highlighted with its label panel sliding in beside it (joystick, buttons, screen, rear panel and latches). When the pin releases, the full interactive viewer and the catalogue are ready to use.
4. **Everything after that** scrolls normally. Only the Counters and the road band move.

Rules: the essential booth viewer must work without the scroll scene. On mobile, keep the pins short (no more than about one and a half screen heights each). Test scrolling back up: every scene must reverse cleanly.

## 5b. Rotating display copy

The hero headline and the big section titles change on each page load. The pool is in `website-handoff/copy-pool.json`. Copy it into the site source; it is the single source for these texts.
- **Selection:** pick one entry per slot at random when the page loads. Select it in the first render (before paint), so the text never flashes or swaps visibly.
- **Default:** the first entry of each slot is the default. Use it when JavaScript is off (in the prerendered or static HTML), in print, and in all tests and screenshots. Add a `?copy=default` URL parameter that forces the defaults, and use it in Playwright.
- **Stable layout:** reserve space for the longest entry in each slot, so changing text causes no layout shift (CLS stays under 0.1). Check every entry at 375px and 1440px: none may overflow or break badly.
- **Fixed things stay fixed:** the nav labels, the section index, the anchor IDs, `<title>`, the meta description, og tags and JSON-LD never rotate. Only the visible display text does.
- **No storage:** do not use cookies or local/session storage to remember or avoid repeats. Plain random selection is fine. The privacy page still says the website stores nothing.
- **Validation in CI:** a test checks every entry. The hero and section titles end with one full stop; the hero headline is at most 34 characters and a section title at most 24 characters. It also checks: no em dashes, no emoji, no exclamation or question marks, and no banned words (`WEBSITE-STANDARDS.md` V35). The build fails on any violation.
- If a slot has only one entry, it simply does not rotate. Never invent entries yourself; the owner supplies the pool.

## 6. The booth viewer

Use `assets/models/booth-flat.glb`. Its nodes are named `cabinet`, `screen_glass`, `joystick`, `joystick_button`, `button_up/down/left/right`, `hinge_left/right`, `latch_left/right` and so on.
- Use react-three-fiber + drei, an **orthographic camera**, and **unlit flat materials** (`MeshBasicMaterial` in the palette colours): no lights, no shadows, no environment map. Give it a solid black outline.
- **Priorities.** Build in this order, and get each level working on desktop, mobile, keyboard and touch before the next:
  1. **Essential:** drag or touch to rotate; named views (**Front / Side / Back / Top**); part selection (click, tap or keyboard) that highlights the part and shows its name and purpose in an Ahoy label block; the static fallback (the flat renders) when WebGL fails or reduced motion is on.
  2. **Secondary:** an **"Explode"** toggle that moves the parts apart along clean axes.
  3. **Optional polish:** only after everything else in this file works.
- **Catalogue and model are one experience:** selecting a part in the catalogue highlights it in the model, and the reverse. Each part has a one-line purpose, for example "Joystick: moves the player". Take the purposes from `CONTENT.md` and the proposal. Do not invent features.
- **Specs:** 61.7 cm wide × 71.2 cm deep × 66.8 cm tall; 12 mm MDF or plywood; four movement buttons and a joystick with a built-in button; three stations planned. Label it as a design to be built.

## 7. Research: keep it bounded

Write a short `RESEARCH-NOTES.md`. Do not shop for components.
1. Study the six reference images and `DESIGN.md`. Extract 5 to 8 principles that apply to this site.
2. Read the Ahoy rules in `ref-4`. The video https://www.youtube.com/watch?v=yh2FGCYC63Q ("M16.") is background only.
3. Look at https://sunnamps.com/ and https://cocricot.pics/ only for the specific patterns named in `DESIGN.md`.
4. **Libraries are allowed only when they solve a named requirement:**
   - **Radix UI** for the accessible mobile menu, toggles and tooltips (do not use RN Primitives: on the web they only wrap Radix);
   - **GSAP ScrollTrigger** (already a dependency) or CSS scroll-driven animations for the scroll unfold (section 5a).
   - **React Bits** only for the allowed motions in `WEBSITE-STANDARDS.md` section 4 (ScrollVelocity band, Counter, Stepper, one SplitText slide), restyled to the rules. No Magnet, no hover effects, nothing with opacity, blur, glow or gradients.

Priority: the scroll unfold is **secondary** (build it after the essentials work). Optional polish: the grid toggle, the counters, the road band and the split-text entrance.

## 8. Technical requirements

- Vite + React + TypeScript. Tailwind is allowed. Put the palette, the paper ground and the type scale in CSS variables or tokens from `DESIGN.md`.
- Fonts: the system Helvetica Neue stack only, with no webfonts.
- Images: **SVG for all flat art** (supplied in `assets/`). Lazy-load every below-the-fold image (`loading="lazy"`, `decoding="async"`, explicit width and height), the gameplay clip (`preload="none"` plus a WebP poster) and the 3D viewer (dynamic import when it nears the viewport). Keep the GLB under 1 MB (Draco or meshopt).
- Accessibility: WCAG 2.2 AA, full keyboard and touch support, a square 3px focus outline, and `prefers-reduced-motion`.
- Mobile: recompose for 375px; do not just shrink the desktop layout.
- Deploy with GitHub Pages through a GitHub Actions workflow, with the base path `/kerb-sense/`.

## 9. Process

Work end to end without stopping for approval. The owner has already made every decision (`WEBSITE-STANDARDS.md` section 1).
1. Write `RESEARCH-NOTES.md` and `PLAN.md` (following `WEBSITE-STANDARDS.md`), then continue straight to the build.
2. Build in priority order: the accurate content, the working game route, the essential booth viewer, intentional mobile layouts, and reliable deployment. Then the secondary features, then the optional polish.
3. Test, and take screenshots at 375, 768 and 1440px.
4. Fill in `docs/COMPLIANCE.md`. Commit, push, and open a pull request containing the screenshots and the final report.
5. **The final report separates three things:** checks that ran and passed, checks that ran and failed, and checks that could not run (with the reason). Never mark something as passed unless it ran.
6. If a push fails, keep committing locally and say so in the report.
