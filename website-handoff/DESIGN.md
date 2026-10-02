# Kerb Sense: design system

This is the same system used in the redesigned proposal (`Kerb_Sense_proposal_final.docx`). The website and the document must look like one family.

## The idea in one line

**Flatpacked Swiss poster meets an Ahoy thumbnail, with the arcade booth as the hero object.** Flat colour, big Helvetica, a strict grid, nothing decorative that does not carry meaning.

## 1. Type: Helvetica only

- Family: **Helvetica Neue** (Bold for display and headings, Regular for body, Medium allowed for UI labels).
- CSS stack: `"Helvetica Neue", Helvetica, Arial, sans-serif`. Helvetica is not licensed for free self-hosting, so rely on the system font (Mac and iOS have it; Windows falls back to Arial). Do **not** load any webfont.
- Display type is **big** and **tightly tracked**: `letter-spacing: -0.04em` at 64px and above, `-0.02em` at 24–64px, `0` for body. Letters must never touch (Ahoy: "Not too close!").
- Headlines end with a **full stop**: "The booth." "Play." "Wait, and you get there first." (Ahoy: "Do not forget the full stop.")
- Lowercase is allowed for brand and nav moments, like Sunn's lowercase site ("shop by category").
- Flush-left, ragged-right. No centred paragraphs, no justified text.
- Scale (px): 12 / 14 / 16 (body) / 20 / 28 / 40 / 64 / 96 / 160 (hero, clamp with `vw`).

## 2. Colour: the seven acceptable colours

| Token | Hex | Road meaning |
|---|---|---|
| `--ks-white` | `#FFFFFF` | road markings, zebra bars |
| `--ks-black` | `#000000` | tarmac, silhouettes, text |
| `--ks-red` | `#AC1E39` | red man / stop / the logo roundel |
| `--ks-yellow` | `#E1B913` | kerb paint / warning |
| `--ks-green` | `#178048` | green man / go |
| `--ks-blue` | `#214EA0` | Singapore road signs |
| `--ks-lblue` | `#3D99C9` | screen / sky |

Rules, taken from the Ahoy guide in `references/ref-4.webp`:
- **No other colours.** No greys and no tints. The one exception is the page ground below.
- **Page ground:** `--ks-paper` `#F2EFE8`, a warm paper tone taken from the *Neue Grafik* cover (`ref-3`) and from Cocricot. Use it only as the page background behind long reading areas, so the site does not sit on a flat pure-white page. Never use it for type, shapes or the booth. Pure white `#FFFFFF` stays for road markings, zebra bars, table rows and white type on colour.
- **No gradients. No drop shadows. No opacity changes. No blur. No glow.**
- Colour combinations: white or black on any colour, except **never white text on yellow** (use black), and use light blue only behind large text (24px or more, bold).
- Section colours cycle in this order: **red, blue, green, yellow, light blue, black**. The proposal's 14 sections use this cycle, so section N on the site should use the same colour as section N in the document.

## 3. Shapes and composition

- **Flatpacked:** solid fills, hard edges, `border-radius: 0` everywhere. The only round shapes allowed are the logo roundel and actual round objects.
- **Ahoy section tabs:** section headers are solid colour bars, with an arrow or chevron end (`clip-path: polygon(...)`) pointing into the content, holding white Helvetica Bold. Alternate the point direction left and right like the infographic.
- **Ahoy thumbnail composition:** a huge black silhouette of the booth on a single colour field, cropped by the frame ("only a part of the weapon may be visible"), with the title knocked out **in the background colour** on top of the black. See `assets/booth/plates/hero-16x9.webp`. The white vertical bars are a **zebra crossing**, our equivalent of Ahoy's scope rings.
- **Swiss grid:** 12 columns, 24px gutters, generous margins. Asymmetric placement is encouraged (big type left, small three-column info right, as in `references/ref-3.png`, the *Neue Grafik* cover).
- **Rules:** use solid black rules only: 3px above tables and sections, 1px between rows. This matches the document's tables.
- **Labels:** small black blocks with white bold text ("There are rules." style) for callouts and badges.
- **Catalogue grid (Cocricot):** isolated objects (booth parts) on plain white, separated by 1–2px black hairlines, with lots of air.

## 4. Logo

- Files are in `assets/logo/`. The wordmark is lowercase **"kerb sense"** in Helvetica Neue Bold, tightly tracked, followed by a **roundel that is also the full stop**.
- The roundel is a solid disc with three concentric arcs, inspired by the Sunn amplifier logo (a disc radiating sound). For us it means *look and listen*: the dot is the pedestrian, and the arcs are the vision cone or a horn.
- Colourways: black wordmark with a red roundel on white; white wordmark with a red roundel on black; all-white on red. Never recolour the roundel any other way. Never add effects.
- Favicon: `kerbsense-mark-white-on-red.svg`.

## 5. Imagery

- The booth is the hero. Use the flat renders in `assets/booth/renders/`:
  - `booth-silhouette-*`: pure black silhouettes for thumbnails and big crops.
  - `booth-flat-*`: white body, black marquee, light-blue screen, and four direction buttons in green/red/yellow/blue.
  - `booth-red-*`: red body. This is the document's elevations plate.
- `assets/models/booth-flat.glb` holds the same booth in the 7-colour palette (for a flat, unlit 3D look). (The textured original is kept out of the repo for size; it is not needed.)
- No photos of real people.
