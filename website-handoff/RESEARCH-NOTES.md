# Research notes

Research for the Kerb Sense website, done before writing any site code. Read alongside `WEBSITE-STANDARDS.md` (highest priority), `DESIGN.md`, `CONTENT.md` and `PLAN.md`.

**Revision 2.** Updated for `WEBSITE-STANDARDS.md`: the Magnet effect is dropped, no opacity or fade animation is allowed, hover is an instant state change, the page ground is the paper tone `#F2EFE8`, and the landing page shows a real gameplay clip.

**How the research was done.** This session's network policy blocks most websites: youtube.com, swissthemes.design, sunnamps.com, cocricot.pics, reactbits.dev, rnprimitives.com and radix-ui.com all returned blocked. So:
- I read React Bits and RN Primitives from their **source code**, by cloning `DavidHDev/react-bits` and `roninoss/rn-primitives` from GitHub. That is more reliable than the docs sites.
- For Ahoy, Swiss Themes, Sunn and Cocricot I used **web search results** plus the descriptions in `PROMPT.md`, and checked them against the reference images.
- I did **not** watch the video or see the Sunn and Cocricot pages directly. Anything below that depends on them is marked *(from the brief)*.

---

## 1. Ahoy (Stuart Brown)

- The video `yh2FGCYC63Q` is **"M16."**, from Ahoy's *Iconic Arms* series (uploaded 13 February 2015). The title itself is the style: one name, Helvetica, and a full stop.
- Search results describe the series as "flat colourful silhouette shapes with bold, tightly kerned Helvetica font and fast diagonal wipes", using "vector-based, outline-less graphics".
- `ref-4` (the thumbnail rules infographic) is the law. Its rules, and how the site will follow them:

| Ahoy rule | What it means on the site |
|---|---|
| Seven colours only (`#FFFFFF #000000 #AC1E39 #E1B913 #178048 #214EA0 #3D99C9`) | These are the only colours in the CSS. A build check fails if any other hex, `rgb()`, `hsl()` or named colour appears. |
| Only one font: Helvetica Neue Bold | System stack `"Helvetica Neue", Helvetica, Arial, sans-serif`. Bold for display text, Regular for body text. No webfonts. |
| What size? **Big.** | Display sizes run from 64 to 160px (fluid, using `clamp`). Section numbers and target numbers are poster-sized. |
| You must kern, but **not too close** | `-0.04em` at 64px and above, `-0.02em` at 24–64px. Check visually in the screenshots that no letters touch. |
| Do not forget the full stop | Every headline, tab, button and label ends with a full stop: "Play.", "Explode.", "Front.", "Target." |
| No drop shadows. **Never** gradients. **Please don't** change opacity. | No `box-shadow`, `text-shadow`, `filter`, `opacity`, `backdrop-filter` or `*-gradient()` anywhere. Even CSS hard-stop gradients are out. Zebra bars are SVG rectangles. |
| Simplify outlines, use geometric silhouettes | Use the booth silhouettes and the flat renders as they are. The 3D model gets flat unlit colour. |
| Only a part of the weapon may be visible (rotate, scale) | The hero booth is cropped by the frame. On mobile it is cropped harder, not shrunk. |
| Keep things simple and clean | One idea per section. Small "label block" callouts. |

- The thumbnail recipe (`ref-5` and our own `hero-16x9.webp` plate): one colour field, white "scope" geometry, a huge black silhouette, and the title **knocked out in the field colour**. Our version of the scope rings is the **zebra crossing**.
- The "fast diagonal wipe" from the videos is the shape of the section tabs (static `clip-path` chevrons). Tabs do not animate: `WEBSITE-STANDARDS.md` item 72 and 83 forbid animated arrows and scroll reveals.
- **One tension to note.** Ahoy art has no outlines, but the brief asks for a black outline on the 3D booth. I will keep the outline, because the booth body is white and sits on a white page, so without it the booth would disappear. The outline is the black of the palette, so it is still flat and opaque.

## 2. Swiss style on the web

- The Swiss Themes article (*"8 Swiss-Style Website Examples (and What Makes Them Work)"*) sums Swiss web design up as: **a grid that organises relationships**, **type that carries the hierarchy**, **reduction with a purpose**, and **asymmetry within order**. Clear grid, assertive sans-serif, generous white space, restrained palette. (The page itself was blocked; this summary comes from the search abstracts.)
- From the references:
  - `ref-1` (Kunsthalle Basel 1959): one field colour, huge black type that steps across the grid, and a small information block at the bottom right on the same baseline grid.
  - `ref-3` (*Neue Grafik*): giant headline top-left, then a three-column information band, then a big number ("16") anchoring the bottom-left. **Big type left, small three-column info right.**
  - `ref-2` (Fiat ads): a lowercase wordmark so huge it is cropped, with a single column of small specs set into it. Three colourways of the same layout.
  - `ref-6` (Swiss/Japanese poster): enormous single-colour type filling the sheet edge to edge, with a dense text column snapped to the same grid.

### The one strong gesture: **"Show grid."**

I agree with your suggestion. A toggle in the nav (and the `G` key) reveals the 12-column grid that the whole site is actually built on.
- **Why it fits.** The game is a road grid. Lanes, kerbs and crossings are a grid you have to read. Revealing the page grid makes the point that *structure keeps you safe*.
- **How it looks.** Columns are drawn as **dashed lane markings** (1px solid dashes, not tints), with column numbers 1–12 in small label blocks. They are white on dark or colour fields and black on white or yellow. The hero's zebra bars line up exactly with the grid columns, so with the grid on, the zebra crossing visibly *is* the grid.
- **What it doesn't do.** It is never used as decoration when switched off. It is remembered per visitor (in localStorage, wrapped in try/catch), and it shows 4 columns on phones.

## 3. Sites you like

**sunnamps.com** *(from the brief, and the Sunn roundel heritage)*: a lowercase Helvetica headline voice ("shop by category"), the logo top-left, and one confident product hero.
- Our lowercase "kerb sense" wordmark with the roundel full stop sits top-left in a slim bar.
- Nav labels are lowercase and small ("problem", "game", "booth" …).
- The booth gets one confident hero moment rather than a carousel.

**cocricot.pics** *(from the brief)*: a calm, paper-like page, a tiny one-colour nav, and a catalogue grid of isolated objects.
- The **parts catalogue**: each booth part (joystick, four buttons, screen glass, hinge, latch, hook) sits alone on white in a cell. Cells are separated by 1px black hairlines, with lots of air and a small caption ("Joystick." plus one line of spec).
- "Paper" is the page ground `--ks-paper #F2EFE8` (DESIGN.md revision 2). It is used only as the page background behind reading areas. Type, shapes, the booth and the catalogue cells stay in the seven colours, and the catalogue cells are pure white on the paper ground.

## 4. React Bits

React Bits is a **copy-in** library: you paste the source into your project and own it. It is not a runtime dependency. I scanned all **213** components in `src/ts-default` for banned techniques (`opacity`, `blur`, `backdrop`, `gradient`, `shadow` and `glow`). Most of the catalogue fails: Backgrounds is nearly all WebGL glow, gradients or particles, and most Components and Micro items use glass, blur or opacity.

**Chosen.** Each one is copied in and edited so it moves **solid type or solid blocks only**:

| Component | Where | Why, and what changes |
|---|---|---|
| **SplitText** (GSAP SplitText) | The hero headline only, once at page load | Lines slide up from behind a hard `overflow: clip` edge, like a sign rolling up. Its default `from:{opacity:0,y:40}` is replaced with `from:{yPercent:110}` and no opacity. No ScrollTrigger: section headlines are visible by default (standards item 83). |
| **ScrollVelocity** (marquee) | A yellow band between sections: "Look. Listen. Cross. Then check." | A scroll-linked marquee with solid black type, like a caution tape or the game's chasing wall. Its CSS `drop-shadow` filter is removed. |
| **Counter** (rolling digits) | The targets: 900 / 1,500 / 20 / 20% / 20 pt / 75% | Odometer digits roll behind a hard mask, like a scoreboard. Its default top and bottom `linear-gradient` fades are removed (`gradientHeight=0`, with the spans dropped). |
| **Stepper** (pattern only) | The programme on phones | Months 1–6 as numbered square steps that slide sideways on user input only. Its `opacity` transitions and `box-shadow` are removed, and it is rebuilt on Radix Tabs for keyboard and screen-reader behaviour. |
| **Press interaction** (own, 2 lines of CSS) | The gameplay thumbnail and the **Play.** buttons | `:active { transform: translate(2px, 2px) }` with no transition. This is the "press" the standards allow. The React Bits Magnet effect is **dropped** (standards item 73). |

**Rejected, with reasons:**
- ScrollReveal, BlurText, FadeContent, AnimatedContent, ScrollFloat and TrueFocus: opacity or blur fades.
- ShinyText, GradientText, GlitchText, FuzzyText, LetterGlitch, DecryptedText and ScrambledText: gradients, or random glyph noise that hurts readability and screen readers.
- Everything in Backgrounds and the WebGL Components (Aurora, Silk, Particles, Hyperspeed, FluidGlass, GlassSurface, …): glow, gradients and glass.
- Magnet: clean code, but it is a hover animation, which standards item 73 bans.
- Dock, MagicBento, SpotlightCard, TiltedCard and StickerPeel: shadows, glare, or 3D tilt with shading.
- ModelViewer: it uses lighting, environment maps and shadows. We build our own flat viewer instead.

To keep one animation engine I will use GSAP and port Counter and ScrollVelocity (which use `motion/react`) to it. GSAP 3.13+ includes SplitText for free. Under `prefers-reduced-motion` all of these render their final state immediately. **Hover** is never animated: every hover is an instant colour inversion or a solid underline, with `transition: none`.

## 5. RN Primitives vs Radix UI

- In the RN Primitives source, every primitive's **web build (`*.web.tsx`) is a thin wrapper around the matching `@radix-ui/react-*` package**. For example, `accordion.web.tsx` imports `@radix-ui/react-accordion` and then re-wraps it in React Native's `View` and `Pressable`. Every package also has **`react-native` and `react-native-web` as peer dependencies**.
- **Decision: use Radix UI directly.** On the web, RN Primitives would add react-native-web (a large runtime, plus style-shimming) only to end up at the same Radix components.
- The Radix primitives we will use, all styled entirely with our tokens (square, flat, 3px focus ring):

| Primitive | Use |
|---|---|
| `@radix-ui/react-toggle` | **Show grid.** and **Explode.** |
| `@radix-ui/react-toggle-group` | **Front. Side. Back. Top.** camera snaps (single select, arrow-key navigation) |
| `@radix-ui/react-tabs` | The three game profiles, and the programme stepper on mobile |
| `@radix-ui/react-accordion` | **Safe by design.** safeguards |
| `@radix-ui/react-dialog` | The mobile nav (a full-screen black sheet with big type) |
| `@radix-ui/react-tooltip` | Short definitions on spec-sheet terms (for example "Draco/meshopt" or "MDF"). Mostly the label block does this job. |

## 6. The game and the repo

- `driftsprits-stack/kerb-sense` is **public**, its default branch is `main`, and GitHub Pages is already on. The game is **one self-contained `index.html`** (about 177 KB, about 4,200 lines, with inline CSS and JS). It has **no external assets**: no images, no audio files (sound is generated with WebAudio), no fetches and no absolute URLs. So it will work unchanged from any sub-path.
- **Plan:** `git mv index.html public/play/index.html`, byte for byte, which keeps its git history. A CI step checks its SHA-256 against today's file, so nobody can change it by accident.
- **Input inside an iframe.** The game listens on `window` for `keydown` and on the canvas for `pointerdown`. It already supports reduced motion.
- **Keyboard trap check.** While an in-game message block is up, the game swallows *any* key (including Tab) to dismiss it. That is a one-keypress hold, not a trap.
- **Esc pauses the game.** Inside an iframe, Esc never reaches the parent page. So "full screen" must use the browser's **Fullscreen API** (where the browser's own Esc always exits), not a custom modal. iPhone Safari has no element fullscreen, so on phones "Open full screen." simply goes to `/play/`.
- The game's own visual style (rounded, warm gradients) is the game, and it stays untouched inside its frame. The design rules apply to the site around it.
- **Game storage.** Checked in `index.html` before the move: the game uses **no** `localStorage`, `sessionStorage` or cookies. Nothing is stored between sessions. The privacy and cookies pages can say so.
- The game's text contains em dashes. The game is unchanged, so the em-dash audit excludes `public/play/`.
- **Gameplay clip.** Playwright in headless Chromium can drive the game: press "I promise", pick the Teenager profile, then move with the arrow keys and record the canvas with `recordVideo`. ffmpeg trims the recording to 6 to 10 seconds, strips audio, and writes WebM (VP9) and MP4 (H.264) under 2 MB plus a WebP poster. The clip is a real capture, never a mock-up.

## 7. The booth model (`booth-flat.glb`)

- 471 KB, exported by Blender. It has **no textures**, 7 materials named `kerb_white`, `kerb_black`, `kerb_red` and so on, and about 11.8k vertices.
- Its bounds are **0.617 × 0.668 × 0.711 m**, which matches 61.7 W × 66.8 H × 71.2 D cm exactly.
- Material colours are stored in linear space and convert back to the exact palette hexes. In three.js, `new Color('#AC1E39')` with the default colour management reproduces them exactly.
- **Node tree:** `cabinet` is the root and holds the body mesh, with four primitives: white body, black marquee, white panel and light-blue bezel. Its children are:
  - `screen_glass`
  - `joystick`, which has the children `joystick_button`, `joystick_shaft` and `joystick_dust_washer`
  - `button_up` (green), `button_down` (red), `button_left` (yellow) and `button_right` (blue)
  - `hinge_left` and `hinge_right`
  - `hook_left` and `hook_right`
  - `latch_left` and `latch_right`
  - `latch_pin_left` and `latch_pin_right`
  - `interior` (a back plane)
- Its UVs are unused (it is unlit and untextured), so they can be stripped. Normals are kept because the back-face outline needs them.
- **Compression:** gltf-transform with meshopt and quantisation, but *without* `join` or `flatten`, so every named node survives for explode and hover.
- **Hover labels:**

| Node | Label |
|---|---|
| `joystick` | Joystick. |
| `button_up` / `button_down` / `button_left` / `button_right` | Up. / Down. / Left. / Right. |
| `screen_glass` | Screen glass. |
| `hinge_left` / `hinge_right` | Hinge. |
| `latch_left` / `latch_right` | Latch. |
| `hook_left` / `hook_right` | Hook. |
| `cabinet` | Cabinet, 12 mm MDF. |

## 8. Colour and contrast (WCAG, computed)

| Field | White text | Black text | Use |
|---|---|---|---|
| Black | 21.0 | — | white |
| Red `#AC1E39` | **7.0** | 3.0 (large only) | white |
| Blue `#214EA0` | **7.9** | 2.7 ✗ | white only |
| Green `#178048` | **4.98** (AA) | 4.2 (large only) | white |
| Light blue `#3D99C9` | 3.2 (large bold only) | **6.6** | black for body text; white only at 24px bold and up |
| Yellow `#E1B913` | 1.9 ✗ **never** | **11.2** | black only |

- The knocked-out green wordmark on the black silhouette is 4.2:1, which is fine at hero size.
- Focus ring: 3px **square** outline, white on black, red, blue and green fields, and black on white, paper, yellow and light-blue fields. It is set per section with a `--focus` variable.
- Black text on paper `#F2EFE8` is 18.5:1.

## 9. Sources

- [M16. – Ahoy (YouTube)](https://www.youtube.com/watch?v=yh2FGCYC63Q); [Ahoy (Web Video), TV Tropes](https://tvtropes.org/pmwiki/pmwiki.php/WebVideo/Ahoy); [Iconic Arms: Legendary weapons in FPS history](https://rapidnotes.wordpress.com/2015/03/20/iconic-arms-legendary-weapons-in-fps-history/)
- [8 Swiss-Style Website Examples (and What Makes Them Work), Swiss Themes](https://swissthemes.design/insights/swiss-style-website-examples); [Swiss Design Principles for Web Designers](https://swissthemes.design/insights/swiss-design-for-web-designers)
- React Bits source: https://github.com/DavidHDev/react-bits (`src/ts-default/**`)
- RN Primitives source: https://github.com/roninoss/rn-primitives (`packages/*/src/*.web.tsx`)
- `references/ref-1` to `ref-6`, `assets/booth/plates/hero-16x9.webp`
