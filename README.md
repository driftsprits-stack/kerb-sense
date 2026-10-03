# Kerb Sense

Wait, and you get there first.

Kerb Sense is a free browser game and a planned six-month schools programme. The safest way to cross is also the best way to score. This repository holds the public website and the game.

- Website: https://driftsprits-stack.github.io/kerb-sense/
- Game: https://driftsprits-stack.github.io/kerb-sense/play/
- Project: Delta Challenge 2026, Track B, Road Safety Education. Team: TEAM if raeann cared.

## What is in this repository

| Path                     | What it is                                                                                                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `public/play/index.html` | The game. One file. It is not changed by the website. CI checks its SHA-256.                                                                                                   |
| `src/`                   | The website: React, TypeScript, Tailwind tokens.                                                                                                                               |
| `src/lib/`               | Pure logic with unit tests: views, explode offsets, grid state, retry, budget, the copy pool.                                                                                  |
| `src/booth/`             | The 3D booth viewer (react-three-fiber) and its static fallback.                                                                                                               |
| `src/copy-pool.json`     | The rotating hero headlines and section titles, copied from `website-handoff/copy-pool.json`.                                                                                  |
| `scripts/`               | Build-time tools: icons, model compression, the font subset, the gameplay clip, the design audit, the writing check, the sitemap, the game hash check, the review screenshots. |
| `tests/`                 | Playwright end-to-end tests with axe-core at 375, 768, 1024 and 1440 px, and screenshot tests.                                                                                 |
| `docs/`                  | Compliance matrix, legal review, disaster recovery, ADRs and screenshots.                                                                                                      |
| `website-handoff/`       | The design system, the content brief, the standards, the copy pool, the research notes and the plan.                                                                           |

## How to run it

You need Node 22. The font subset also needs Python with `fonttools` and `brotli`.

```sh
npm ci
npm run dev          # http://localhost:5173/kerb-sense/
npm run build        # checks the game hash and the writing, builds dist/, runs the design audit, writes the sitemap
npm run preview      # serves dist/ at http://localhost:4173/kerb-sense/
```

## How to test it

```sh
npm run check:play      # the game file is unchanged
npm run check:writing   # no em dashes, no AI-style wording in the copy and docs
npm run lint
npm run typecheck
npm test                # unit tests with coverage
npm run test:e2e        # Playwright, against the built site
npm run lhci            # Lighthouse CI, against the preview server
npm run screenshots     # the review images in docs/screenshots/ (run npm run preview first)
```

On a machine without a GPU, set `PW_SOFTWARE_GL=1` so Playwright can run WebGL.

## How to regenerate the assets

```sh
npm run assets       # favicons from the monogram; the GLB with meshopt; the Noto Sans JP subset
npm run clip         # records a real gameplay clip with Playwright and ffmpeg
```

The sources for the assets are in `website-handoff/assets/`. The SVG renders, parts, logo and textures are copied to `src/assets/` as they are.

## How it is deployed

Every push to `main` runs `.github/workflows/pages.yml`. It builds the site and deploys `dist/` to GitHub Pages. The base path is `/kerb-sense/`. See `docs/DR.md` for the restore steps.

## Architecture

```mermaid
flowchart LR
  subgraph Build["Build (GitHub Actions)"]
    A[website-handoff/assets] -->|scripts/icons.mjs, model.mjs, subset-font.mjs| B[src/assets, public/]
    G[public/play/index.html] -->|scripts/check-play-hash.mjs| H{SHA-256 unchanged?}
    C[src/content.ts, copy-pool.json, docs] -->|scripts/writing.mjs| W{Writing check}
    S[src/] -->|Vite + React + Tailwind| D[dist/]
    B --> D
    G --> D
    D -->|scripts/audit.mjs| E{Design audit}
    E -->|pass| P[GitHub Pages]
  end
  subgraph Browser
    P --> I[index.html]
    I --> R[react chunk]
    I --> V[BoothViewer chunk, lazy]
    V --> T[three chunk, lazy]
    V -->|fetch with retry| M[booth-flat.glb]
    V -.->|no WebGL, reduced motion, or failure| F[SVG renders]
    I --> K[/play/ link]
  end
```

## Design rules

The design system is in `website-handoff/DESIGN.md` and the standards are in `website-handoff/WEBSITE-STANDARDS.md`. In short: black, white, paper and green only; Helvetica Neue for text, Kerb Block for display, a Noto Sans JP subset for four Japanese strings; a full stop only on the hero headline and the section titles; a 12-column grid; no gradients, shadows, opacity animation or rounded corners; motion is transform only and scrubbed to the scroll. `scripts/audit.mjs` fails the build if the built CSS, HTML, JS or SVG breaks these rules.

## Licence

See `LICENSE`. The game, renders, logo, fonts and text belong to the Kerb Sense team. Noto Sans JP is under the SIL Open Font License.
