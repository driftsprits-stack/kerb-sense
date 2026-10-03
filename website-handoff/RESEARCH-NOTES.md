# Research notes

Research for the Kerb Sense website. Read alongside `WEBSITE-STANDARDS.md` (highest priority), `DESIGN.md`, `CONTENT.md`, `PROMPT.md` and `PLAN.md`.

**Revision 3 (3 October 2026).** Updated for the four-colour design system: black, white, paper and green only; the new logo; Kerb Block and the Japanese accents; the poster-mode hero; the rotating copy pool; the Apple-style scroll unfold; and the Wikipedia guide to AI writing.

**How the research was done.** This session's network policy blocks most websites (youtube.com, swissthemes.design, sunnamps.com, cocricot.pics, reactbits.dev, rnprimitives.com). So:

- React Bits and RN Primitives were read from their source code, cloned from GitHub.
- Ahoy, Swiss Themes, Sunn and Cocricot come from web search results and the descriptions in `PROMPT.md`, checked against the reference images.
- The Wikipedia page "Signs of AI writing" was read in full as wikitext (`action=raw`), because the rendered page was blocked.

## 1. Principles from the references and DESIGN.md

| Principle                                       | Where it shows on the site                                                                                                         |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| One subject in the centre, huge type behind it  | The hero: the booth in front of "KERB SENSE" in Kerb Block (`JAZZ SEEN`, the A2 poster).                                           |
| One accent colour                               | Green is the "green man". Section tabs, the logo full stop, status labels, selected parts.                                          |
| Big Helvetica, tightly kerned, a full stop      | The headline and the section titles end with a full stop. Nothing else does (`DESIGN.md` section 2).                               |
| A strict grid with a narrow index column        | The sticky section index on the left at 1280 px and up (`ref-3`, the *Neue Grafik* cover).                                         |
| Running-order lists in square lettering         | The game section: `WAIT [KERB]:` and the rest, word in white, bracket in green (WIRE01).                                            |
| Halftone dots and bars only                     | The LED wave and the perspective zebra in the hero. No gradients, no grain.                                                        |
| Flat silhouettes, hard edges, no shadows        | The 404 page and the og:image keep the Ahoy composition. The booth viewer is unlit with a 2 px outline.                             |
| Isolated objects on white cells                 | The parts catalogue (Cocricot).                                                                                                    |

## 2. Ahoy (Stuart Brown)

- The video `yh2FGCYC63Q` is "M16.", from Ahoy's *Iconic Arms* series. The title is the style: one name, Helvetica, a full stop.
- `ref-4` (the thumbnail rules) still applies, with revision 3 changes: the palette is four colours, and the full stop is used sparingly (hero headline and section titles only).
- The thumbnail recipe (`ref-5`): one colour field, white geometry, a huge black silhouette, the title knocked out in the field colour. On this site that recipe is used for the og:image and the 404 page only. The hero follows poster mode (`DESIGN.md` section 7).
- Outlines: Ahoy art has none, but the booth body is white, so the viewer keeps a black outline and the stage ground is paper. The outline is the palette black, so it is still flat.

## 3. Swiss style on the web

- Swiss Themes sums it up as a grid that organises relationships, type that carries the hierarchy, reduction with a purpose, and asymmetry within order.
- `ref-1` (Kunsthalle Basel 1959): one field, huge type across the grid, a small information block on the same baseline.
- `ref-3` (*Neue Grafik*): a giant headline top-left, then an information band, then a big number. The site's index column and summary-first sections follow it.
- `ref-2` (Fiat ads) and `ref-6` (Swiss/Japanese poster): enormous single-colour type, cropped by the frame, with a dense text column snapped to the grid. The hero title and the katakana column follow them.

### "Show the grid"

The one strong gesture stays: a toggle in the nav (and the `G` key) reveals the 12-column grid the site is built on. Columns are green dashed lane markings with numbers. It is remembered in one localStorage key, wrapped in try/catch, and shows 4 columns on phones.

## 4. Poster mode (DESIGN.md section 7)

- The A2 poster (`assets/poster/kerb-sense-poster-A2.svg`) is the reference: a black field, the LED wave, the zebra, the title in Kerb Block, the booth in the centre, the vertical katakana in green, the vertical tagline in Noto Sans JP.
- The product render `booth-product.webp` is the poster image. The live viewer swaps in on top when it loads, with the render kept underneath (invisible) so the layout never moves.
- On phones the title sits above the booth, the katakana column stays thin at the right edge, and the copy follows. The first screen at 375 by 812 shows the booth, the one-liner and "Play" above the sticky bar. At 1440 by 900 the copy sits on one black panel at the bottom-left, clear of the title.
- The textures are SVG with dots and bars only. They are decorative (`alt=""`).

## 5. Type

- Helvetica Neue for text: the system stack, no webfont.
- Kerb Block (`assets/fonts/KerbBlock-Regular.woff2`, about 2 KB) for the hero title, the running order, small `PLAY` labels and the katakana カーブセンス. It maps lowercase input to capitals.
- Noto Sans JP for 待てば、先に着く。, 渡り方 and あそぶ. `@fontsource/noto-sans-jp` is subset with `pyftsubset` to the characters used (about 2 KB). Every Japanese string has `lang="ja"` and its English meaning in `aria-label`.
- Scale: 12 / 14 / 16 / 18 / 20 / 28 / 40 / 48 / 64 / 96 / 160. Tracking `-0.04em` at 64 px and up, `-0.02em` at 24 to 64 px.

## 6. React Bits, Radix and GSAP

- React Bits is a copy-in library. Of its 213 components, most fail the standards (opacity, blur, gradients, shadows, glow). Kept, cleaned and ported to GSAP: **SplitText** (one slide at load, no opacity), **ScrollVelocity** (the road band), **Counter** (the targets, once each) and the **Stepper** pattern (the plan on phones, rebuilt on Radix Tabs). Magnet and every hover effect are dropped.
- RN Primitives wraps Radix on the web, so Radix is used directly: Toggle, Toggle Group, Tabs, Accordion, Dialog. All restyled to the tokens.
- **GSAP ScrollTrigger** drives the scroll unfold (`PROMPT.md` section 5a). Everything is `transform` only, `scrub: true`, reversible, with no scroll-jacking. Pins are short: 0.8 screens for the hero (0.5 on phones) and 2.2 for the booth scene (1.5 on phones). ScrollTrigger changes the page height after the browser has jumped to a deep link, so the hook scrolls to the hash target once after its first refresh. Details in `docs/adr/0008-scroll-unfold.md`.

## 7. Colour and contrast (WCAG, computed)

| Pair                          | Ratio | Use                                                                |
| ----------------------------- | ----- | ------------------------------------------------------------------ |
| Black on paper `#F2EFE8`      | 18.5  | body text                                                          |
| White on black                | 21.0  | the hero, the targets section, the footer                          |
| White on green `#178048`      | 5.0   | tabs, buttons, status labels, the running-order label              |
| Green on white                | 5.0   | the selected catalogue name at 16 px bold                          |
| Green on paper                | 4.3   | large text only (24 px and up): not used for body text             |
| Green on black                | 4.2   | the hero katakana at 24 px and up only (large text); never for body |

Focus ring: a 3 px square outline, white on black and green, black on paper and white.

## 8. The game and the repo

- The game is one self-contained `index.html` (about 177 KB) with no external assets, no storage, no cookies and no network requests. It lives at `public/play/index.html`, byte for byte. CI checks its SHA-256.
- The landing page shows a real gameplay clip (Playwright, Teenager profile, 8 s, silent, WebM and MP4) as a large thumbnail that opens `/play/`. There is no iframe on the landing page (`PROMPT.md` section 4).
- The game's text contains em dashes. The game is unchanged, so the audit excludes `public/play/`.

## 9. The booth model (`assets/models/booth-flat.glb`)

- 471 KB from Blender, no textures, three materials: `kerb_white`, `kerb_black`, `kerb_green`. Bounds 0.617 by 0.668 by 0.711 m, which match 61.7 W by 66.8 H by 71.2 D cm.
- Node tree: `cabinet` is the root and holds the body mesh (white body, black marquee and screen face). Its children: `screen_glass`; `joystick` with `joystick_button`, `joystick_shaft`, `joystick_dust_washer` and an unnamed body; `button_up/down/left/right`; `hinge_left/right`; `hook_left/right`; `latch_left/right`; `latch_pin_left/right`; `interior` (the rear panel).
- An unnamed mesh belongs to its nearest named ancestor, so the joystick body selects the joystick.
- Compression: gltf-transform with meshopt and quantisation, without `join` or `flatten`, so every named node survives (104 KB). Positions are normalised int16, so the node scale is the real scale.
- With an orthographic camera, drei's `Outlines` thickness is in pixels (2 px, 4 px for the selected part).

## 10. Rotating copy (PROMPT.md section 5b)

- `copy-pool.json` has 10 hero headlines and 4 or 5 titles per section (53 entries). It is copied to `src/copy-pool.json` and never edited by the site.
- The pick happens when the module loads, before the first render. The first entry is the default, forced by `?copy=default`, used in the static HTML, in tests and in screenshots.
- Each slot reserves its longest entry with an invisible twin in the same grid cell, so nothing shifts (Lighthouse CLS 0).
- `src/lib/copy-pool.test.ts` validates every entry in CI. Details in `docs/adr/0007-rotating-copy.md`.

## 11. Writing: the Wikipedia guide to AI writing

The page lists tells that readers associate with chatbot text. The site copy and the docs avoid them, and `scripts/writing.mjs` fails the build on the ones that can be matched:

- Vocabulary: the overused chatbot words. The full list is the `WORDS` array in `scripts/writing.mjs`, so it is not repeated here.
- Structure: negative parallelisms (the "not X, it's Y" and "not only X but also Y" shapes), verbs that avoid a plain "is" ("serves as", "stands as"), participle tails that add significance, section summaries, didactic disclaimers, and vague attributions. The `PHRASES` array in the same script holds the patterns.
- Punctuation and format: em dashes, curly quotes, emoji, title-case headings, thematic breaks between sections, bold inline headers in lists.
- Tone: no puffery, no vague attributions ("experts say"), no claims of significance. Plain facts with a source.

The guide also notes that human writing keeps simple "is" and "has" sentences, plain verbs ("used", not "utilised") and the occasional superlative or hedge. The site copy is written that way: short STE sentences, present tense, specific numbers with a label.

## 12. Sources

- [M16. (YouTube)](https://www.youtube.com/watch?v=yh2FGCYC63Q); [Ahoy (Web Video), TV Tropes](https://tvtropes.org/pmwiki/pmwiki.php/WebVideo/Ahoy)
- [8 Swiss-Style Website Examples, Swiss Themes](https://swissthemes.design/insights/swiss-style-website-examples)
- React Bits source: https://github.com/DavidHDev/react-bits
- RN Primitives source: https://github.com/roninoss/rn-primitives
- GSAP ScrollTrigger docs: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- Wikipedia, "Signs of AI writing": https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing
- `references/ref-1` to `ref-6`, `assets/poster/kerb-sense-poster-A2.svg`
