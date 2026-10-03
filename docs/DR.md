# Disaster recovery

## Objectives

- **RPO (recovery point objective):** the last commit on `main`. The site has no data store. Git is the only state.
- **RTO (recovery time objective):** 30 minutes to redeploy from git.

## What can fail

| Failure                                    | Effect                             | Recovery                                  |
| ------------------------------------------ | ---------------------------------- | ----------------------------------------- |
| GitHub Pages serves an old or broken build | Visitors see the old site or a 404 | Re-run the Pages workflow (steps A)       |
| A bad commit reaches `main`                | The site shows a defect            | Revert the commit (steps B)               |
| GitHub Actions is down                     | No deploy happens                  | Deploy by hand (steps C)                  |
| The repository is deleted                  | Nothing is served                  | Restore from any clone (steps D)          |
| GitHub Pages is down                       | Nothing is served                  | Wait, or host `dist/` elsewhere (steps E) |

## A. Re-run the deploy

1. Open the repository on GitHub. Go to Actions.
2. Open "Deploy to GitHub Pages".
3. Press "Run workflow" on `main`.
4. Wait for the green tick. Open https://driftsprits-stack.github.io/kerb-sense/ and https://driftsprits-stack.github.io/kerb-sense/play/.

## B. Revert a bad commit

1. `git revert <sha>` on a branch.
2. Open a pull request. Wait for CI.
3. Merge. The Pages workflow deploys the revert.

## C. Deploy by hand when Actions is down

1. On a computer with Node 22: `git clone https://github.com/driftsprits-stack/kerb-sense && cd kerb-sense`.
2. `npm ci && npm run build`.
3. Check `dist/index.html` and `dist/play/index.html` exist.
4. Push `dist/` to a `gh-pages` branch: `npx gh-pages -d dist -t true` (installs the `gh-pages` tool on demand; `-t` keeps `.nojekyll`).
5. In Settings → Pages, set Source to "Deploy from a branch", branch `gh-pages`, folder `/`.
6. When Actions is back, set Source to "GitHub Actions" again and delete the `gh-pages` branch.

## D. Restore the repository

1. Any team member's clone holds the full history. `git remote set-url origin <new repository url>`.
2. `git push --all origin && git push --tags origin`.
3. Re-install the Claude GitHub App if it is used, turn on Pages (Source: GitHub Actions), branch protection and secret scanning.
4. Run steps A.

## E. Host elsewhere for a time

`dist/` is static. Any static host works. The base path is `/kerb-sense/`; to host at the root, change `base` in `vite.config.ts` and the absolute URLs in `index.html`, `public/robots.txt` and `scripts/sitemap.mjs`, then rebuild.

## Test of this plan

- Step B is exercised by every reverted pull request.
- Step C was tested locally on 2 October 2026: `npm ci && npm run build` produced a working `dist/` in under 2 minutes.
- Playwright tests in `tests/site.spec.ts` check that the home page, `/play/`, the policy pages and the 404 page load, and that Back and Forward work after a visit to the game.
