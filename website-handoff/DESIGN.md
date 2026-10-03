# Kerb Sense: design system

This is the same system used in the redesigned proposal (`Kerb_Sense_proposal_final.docx`). The website and the document must look like one family.

## The idea in one line

**A flatpacked Swiss poster with an Ahoy-style booth silhouette, in ONE accent colour.** Black, white, a paper ground, and green. Big Helvetica, a strict grid, and nothing decorative that does not carry meaning.

## 1. Colour: one scheme only

| Token | Hex | Use |
|---|---|---|
| `--ks-black` | `#000000` | text, silhouettes, rules, the targets section and the footer |
| `--ks-white` | `#FFFFFF` | zebra bars, white text on green or black, table rows |
| `--ks-paper` | `#F2EFE8` | the page ground behind reading areas (no flat pure-white page) |
| `--ks-green` | `#178048` | **the only accent**: section tabs, the logo full stop, highlights, selected booth parts |

Rules:
- **No other colours.** No red, yellow, blue or light blue. No greys and no tints. Green is the "green man": the moment it is safe to cross.
- **No gradients. No drop shadows. No opacity changes. No blur. No glow.**
- Text colour pairs: black on paper or white; white on green or black; green on paper or white only at 24px bold or larger (green on paper is about 4.3:1: enough for large text, too low for body text). Links in body text are black and underlined; green is not a body-text colour. Never use green text on black.
- **Every section tab is green with white text.** There is no colour cycle.
- **Section grounds:** paper by default. The hero (poster mode), the targets section and the footer are black. Nothing else gets a colour field.

## 2. Type: Helvetica, plus Kerb Block for display

- **Helvetica Neue** for headings, body and UI (Bold, Regular, Medium).
- **Kerb Block** (our own square modular display face, `assets/fonts/KerbBlock-Regular.woff2`, about 2 KB) for big display moments only: the hero title "KERB SENSE", the WIRE-style running order (`WAIT [KERB]:`), small labels such as `PLAY`, and the katakana カーブセンス. Never use it for paragraphs. It contains A to Z (lowercase input maps to capitals), 0 to 9, `[ ] : . - / + , & $` and a small katakana set.
- **Japanese accents:** short and correct only. Use the katakana カーブセンス in Kerb Block. Set other Japanese (for example 待てば、先に着く。) in **Noto Sans JP** (OFL, self-hosted with `@fontsource/noto-sans-jp`, subset to the characters used). Always mark it with `lang="ja"`, and give the English meaning nearby or in `aria-label`. The list of approved Japanese strings is in `CONTENT.md`.
- CSS stack: `"Helvetica Neue", Helvetica, Arial, sans-serif`. Load no webfonts. Helvetica is not licensed for free self-hosting; Mac and iOS have it, and Windows falls back to Arial.
- Display type is big and tightly tracked: `-0.04em` at 64px and above, `-0.02em` at 24 to 64px, `0` for body. Letters must never touch.
- **Full stops: use them sparingly.** Only two kinds of text end with a full stop as a style device:
  1. the hero headline ("Wait, and you get there first.");
  2. the big section titles ("The booth.", "The problem.").

  The logo's square full stop is part of the mark. **Nothing else** gets a decorative full stop: no buttons, nav links, tabs, view switches, labels, part names, table headers, numbers, captions, badges or list items ("Play", not "Play."; "Front / Side / Back / Top", not "Front. Side. Back. Top."). Normal sentences in body text keep normal punctuation.
- Flush-left, ragged-right. No centred or justified paragraphs. Body text column: 60 to 70 characters wide at most.
- **No highlighter effect.** Never put black (or any) boxes behind individual lines of a headline. Headline text sits directly on its ground. To keep the hero headline readable, place it on one solid green panel that covers the zebra bars behind it (one block, not per-line boxes).
- Scale (px): 12 / 14 / 16 (body) / 20 / 28 / 40 / 64 / 96 / 160 (hero, clamp with `vw`).

## 3. Shapes and composition

- **Flatpacked:** solid fills, hard edges, `border-radius: 0` everywhere.
- **Section tabs:** a solid green bar with a static chevron end (`clip-path`), holding white Helvetica Bold. The chevron points into the content.
- **Ahoy thumbnail composition (og:image and 404 only; the hero now follows poster mode, section 7):** the black side silhouette of the booth, large and cropped by the frame, on the green field, with white zebra bars running the **full width** of the frame. Where the headline sits, put one solid green panel over the bars (a single block sized to the text area, never per-line boxes) so the white headline stays readable. The wordmark is knocked out in green on the black silhouette. See `assets/booth/plates/hero-16x9.svg`. The zebra bars run the full width; the wordmark sits centred in the black body with clear space on every side.
- **Swiss grid:** 12 columns, 24px gutters. Asymmetric placement: a narrow left index column and a wide content column, as in `references/ref-3.png` (the *Neue Grafik* cover and contents).
- **Rules:** solid black only. 3px above tables and sections, 1px between rows.
- **Catalogue grid (Cocricot):** isolated booth parts on white cells separated by 1 to 2px black hairlines, with lots of air. A selected part gets a green cell outline (2px). This is not a coloured-border card pattern; nothing else has a coloured border.
- **Two dominant moments only:** the hero and the booth viewer. Everything else is calm.
- **Mobile:** recompose; do not just shrink. On a 375px screen, the first view shows the booth silhouette, the one-liner and "Play".

## 4. Logo

- Files are in `assets/logo/`. Do not redraw them.
- **Wordmark:** lowercase "kerb sense" in Helvetica Neue Bold, tightly tracked, ending in a **square full stop** in green. The square full stop is the brand mark: it reads as the full stop Ahoy insists on, and as the person waiting at the kerb.
- **Monogram (favicon and small spaces):** "k" plus the square full stop.
- Colourways:
  - black type with a green full stop, on paper or white;
  - white type with a green full stop, on black;
  - all-white, on green.
- **The one approved exception is the hero knockout:** the whole wordmark in green on the black silhouette.
- Never add effects, outlines or other colours.
- Favicon: `kerbsense-mark-on-green.svg`.

## 5. Imagery

The booth is the hero object. All flat art is **SVG** (small, sharp at any size). Use the renders in `assets/booth/renders/`:
- `booth-silhouette-*`: pure black silhouettes for the hero and big crops.
- `booth-light-*`: white body, black marquee and screen, green buttons and green joystick top. Use these on paper or green grounds.
- `booth-green-*`: green body, black marquee and screen, white buttons. Use these on paper or white grounds.

`assets/models/booth-flat.glb` matches `booth-light` (white body, black marquee and screen, green buttons). There are no photos of real people.

## 6. Reading aids

- **Section index:** on desktop, a sticky left index column lists the section numbers and names. The current section is marked in green. On mobile, show the current section name in the header.
- **Summary first:** each section opens with one large summary sentence, then the detail (inverted pyramid).
- **Signposts:** each section ends with a plain text link to the next logical step, for example "Next: see how we will measure it".
- **"Back to top"** in the footer.

## 7. Poster mode (October 2026 update)

These rules come from the owner's latest references:
- WIRE01 flyer: square techno lettering and running-order lists;
- *JAZZ SEEN*: the subject in the centre with huge type behind it;
- *Beginnings* (ggg): an uncanny product shot and hard two-colour contrast;
- *コンセント*: blocky katakana and a high-contrast subject;
- electraglide 2001: a mid-2000s LED dot-matrix background.

The finished reference is the A2 poster in `assets/poster/` (`kerb-sense-poster-A2.svg`, with a preview in `kerb-sense-poster-A2-preview.webp`).
- **Composition:** the booth sits in the centre, and the huge Kerb Block title sits **behind** it, so the booth overlaps the letters.
- **Product shot:** `assets/poster/booth-product.webp` is a glossy white render with green buttons, for the "uncanny product" moments.
- **Textures:** the LED dot-matrix wave (`assets/textures/led-wave.svg`), a fine dot field (`fine-dots.svg`) and a perspective zebra crossing (`zebra-perspective.svg`). Put them on black. Dots and bars only: these halftone textures are allowed, and gradient fills are still banned.
- **Colours do not change:** black, white, paper and green.
