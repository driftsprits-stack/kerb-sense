# ADR 0006: Three fonts, two of them self-hosted

Date: 2026-10-03. Status: accepted.

## Context

`DESIGN.md` revision 3 asks for Helvetica Neue for text, Kerb Block for display moments only, and Noto Sans JP for the approved Japanese strings. Helvetica Neue is not licensed for free self-hosting. The standards ban every other font (V25, V36) and ask for the Japanese subset to hold only the characters used (A17).

## Decision

- **Helvetica Neue** comes from the system stack `"Helvetica Neue", Helvetica, Arial, sans-serif`. No webfont is loaded for it. Windows shows Arial.
- **Kerb Block** is the team's own font (`website-handoff/assets/fonts/KerbBlock-Regular.woff2`, about 2 KB). It is copied to `src/assets/fonts/` and preloaded in `index.html`, because the hero title uses it on the first paint. The `.ks-block` class sets it and forces capitals. It is never used for paragraphs.
- **Noto Sans JP** (SIL Open Font License) comes from `@fontsource/noto-sans-jp`. `scripts/subset-font.mjs` runs `pyftsubset` over the Bold file with only the characters in the four approved strings, and writes `src/assets/fonts/NotoSansJP-700-subset.woff2` (about 2 KB). The `[lang="ja"]` selector applies it, except where `.ks-block` sets the katakana in Kerb Block, as `DESIGN.md` section 2 asks.
- Every Japanese string has `lang="ja"` and an `aria-label` with its English meaning. The strings live in `src/content.ts` (`JA`) and nowhere else.
- Both fonts use `font-display: swap`. The E2E test "the fonts are Helvetica Neue, Kerb Block and a Noto Sans JP subset" checks the loaded faces and that no other Japanese text exists on the page.

## Consequences

- Two small font files, about 4 KB in total, and no third-party font request.
- A new approved Japanese string needs a new subset: edit `scripts/subset-font.mjs` and run `npm run assets`.
- The font licences are recorded in `docs/LEGAL-REVIEW.md` section 2.
