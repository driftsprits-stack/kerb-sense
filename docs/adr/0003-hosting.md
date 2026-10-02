# ADR 0003: GitHub Pages with a GitHub Actions workflow

Date: 2026-10-02. Status: accepted.

## Context

The game already lives on GitHub Pages at the root of the project page. The site must host it and deploy with Actions.

## Decision

- `.github/workflows/pages.yml` builds `dist/` and deploys it with `actions/deploy-pages` on every push to `main`. The owner sets Settings → Pages → Source to "GitHub Actions".
- The Vite base path is `/kerb-sense/`. Every absolute URL (canonical, og:image, sitemap, robots) uses `https://driftsprits-stack.github.io/kerb-sense/`.
- A custom `404.html` works on GitHub Pages.
- Actions are pinned to commit SHAs. Dependabot updates them weekly.

## Consequences

- No server, no secrets, no backend. TLS comes from GitHub Pages.
- A new deploy invalidates the cache because Vite hashes every asset filename.
- Hosting elsewhere needs a base path change (see `docs/DR.md`).
