# Contributing to Kerb Sense

Thank you for helping. Kerb Sense is a student road-safety project: a free browser game, a planned arcade booth for schools, and this website. This guide explains how to propose a change and what we check before we merge it.

New here? Start with the [README](README.md), then read the design rules in [`website-handoff/DESIGN.md`](website-handoff/DESIGN.md).

## Quick start

You need Node.js 22 or later.

```sh
git clone https://github.com/driftsprits-stack/kerb-sense.git
cd kerb-sense
npm ci
npm run dev
```

Open the address that Vite prints. The site lives at `/kerb-sense/`.

## How we work

| Step                   | What to do                                                                          |
| ---------------------- | ----------------------------------------------------------------------------------- |
| 1. Branch              | Create a branch from `main` with a short, clear name, for example `fix/menu-focus`. |
| 2. Change              | Keep each pull request to one topic. Small pull requests are reviewed faster.       |
| 3. Check               | Run the checks below. CI runs the same checks.                                      |
| 4. Open a pull request | Describe what changed and why. Add screenshots for visual changes.                  |
| 5. Review              | One approval and a green CI are required. We do not push directly to `main`.        |

## Checks before you open a pull request

```sh
npm run check:play     # the game file is unchanged
npm run check:writing  # plain-English rules for site text
npm run lint
npm run format:check
npm run typecheck
npm test               # unit tests
npm run build          # also runs the design audit
npm run test:e2e       # browser tests
```

If a check fails and you are not sure why, open a draft pull request and ask. We are happy to help.

## Project rules

**Design.** The site uses four colours (black, white, paper `#F2EFE8` and green `#178048`), plus one red that marks "not allowed" in the safety icons. Text is Helvetica Neue, with Kerb Block for display text. No gradients, shadows or fades. The build audit enforces these rules. The full rules are in [`website-handoff/DESIGN.md`](website-handoff/DESIGN.md) and [`website-handoff/WEBSITE-STANDARDS.md`](website-handoff/WEBSITE-STANDARDS.md).

**Writing.** Site text, code comments and commit messages use plain English in the style of ASD-STE100 Simplified Technical English: short sentences, active voice, no em dashes. `npm run check:writing` lists the words and patterns to avoid.

**Facts.** The game exists. The booth is designed, not built. The schools programme is planned, the grant is requested, and every number is a target. Please keep the site accurate to that.

**The game.** Do not edit `public/play/index.html`. When the team ships a new game build, update the hash in `scripts/check-play-hash.mjs` in the same pull request and say so in the description.

**Code.** TypeScript stays in `strict` mode. Fix every ESLint and Prettier finding.

## Privacy and security

- Do not commit secrets, API keys, personal data or reference images.
- `website-handoff/source/` and `website-handoff/references/` stay out of git.
- Report a security problem privately to the maintainers. Please do not open a public issue for it.

## Pull request description

Include:

- what changed and why;
- screenshots at 375, 768, 1024 and 1440 px for visual changes (`npm run screenshots`);
- an update to [`docs/COMPLIANCE.md`](docs/COMPLIANCE.md) if the status of a standard changed.

## Architecture decisions

For a decision that affects the structure of the site, add a short record in [`docs/adr/`](docs/adr/) with the next number. Use three headings: context, decision and consequences.

## Licence

By contributing, you agree that your contribution is released under the [MIT licence](LICENSE) of this project.
