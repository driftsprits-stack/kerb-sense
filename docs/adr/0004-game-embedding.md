# ADR 0004: The game moves to /play/ unchanged and is embedded on demand

Date: 2026-10-02. Status: accepted.

## Context

The game is finished and tuned. The site must host it, embed a preview and keep keyboard and mouse focus working inside the frame.

## Decision

- `git mv index.html public/play/index.html`. The file is byte-identical. `scripts/check-play-hash.mjs` fails the build if its SHA-256 changes.
- The game has no external assets and no absolute URLs, so it works at any path.
- The embed is an iframe of `/play/` that loads only when the visitor presses "Load the game.". On load the frame is focused. A 15 s timeout shows an error with a link to `/play/`.
- Escape inside the game pauses the game and never reaches the page, so "Open full screen." uses the browser's Fullscreen API. The browser's own Escape always exits.
- Below 640 px the game opens in its own page, because it sets `touch-action: none`.
- The landing page shows a real gameplay clip, recorded with Playwright on the Teenager profile. The recorder serves a copy of the game with one read-only hook so a bot can play safely; the published file is not changed.

## Consequences

- The game keeps its own visual style inside its frame. The design rules apply to the site around it.
- The audit excludes `dist/play/`.
