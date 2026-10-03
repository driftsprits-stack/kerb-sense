# ADR 0007: Rotating display copy from a validated pool

Date: 2026-10-03. Status: accepted.

## Context

`PROMPT.md` section 5b asks for the hero headline and the big section titles to change on each page load, from `copy-pool.json`, with no visible swap, no layout shift, no storage, a `?copy=default` switch and a CI check of every entry.

## Decision

- `website-handoff/copy-pool.json` is copied to `src/copy-pool.json`. It is the only source of these texts. The site never edits or adds entries.
- `src/lib/copy-pool.ts` holds the pure logic: `pickCopy` (one random entry per slot, or the first with `?copy=default` or a one-entry slot), `longestEntry`, `validateEntry` and `validatePool`.
- `src/copy.ts` picks the copy when the module loads, before the first render, so the text never swaps on screen. `Math.random` is the only source. Nothing is written to cookies or storage.
- Every slot reserves the width or height of its longest entry with an invisible twin in the same grid cell (`SectionTab.tsx`, `Hero.tsx`), so a different entry never moves the layout.
- Fixed things stay fixed: `<title>`, the meta description, the og tags, the JSON-LD, the nav labels, the section index and the anchor ids come from `src/content.ts` and `index.html`.
- The static HTML and the `<noscript>` text carry the default entries.
- `src/lib/copy-pool.test.ts` validates every entry in CI: one full stop at the end, the length limits (34 for the hero, 24 for a title), no em dash, no emoji, no exclamation or question mark, none of the banned words, no duplicates.
- Playwright uses `?copy=default` for every assertion on text, and one test loads the page several times to check that the copy rotates, that every shown entry is in the pool, and that storage stays empty.

## Consequences

- The owner can change the pool by editing one JSON file. A bad entry fails `npm test` before it ships.
- Screenshots and Lighthouse runs use the default copy, so they are stable.
