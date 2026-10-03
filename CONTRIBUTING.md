# Contributing

## Rules

1. Open a pull request for every change. Do not push to `main`.
2. One reviewer must approve. CI must be green.
3. Keep TypeScript `strict`. Fix every ESLint and Prettier finding.
4. Write code comments, commit messages and UI text in ASD-STE100 Simplified Technical English. Short sentences. Active voice. One instruction per sentence. No em dashes. `npm run check:writing` lists the words and patterns to avoid.
5. Follow `website-handoff/WEBSITE-STANDARDS.md` and `website-handoff/DESIGN.md`. The build audit enforces the colour and motion rules.
6. Do not change `public/play/index.html`. If the team ships a new game build, update the hash in `scripts/check-play-hash.mjs` in the same pull request and say so in the description.
7. Commit no secrets, no personal data and no reference images. `website-handoff/source/` and `website-handoff/references/` stay out of git.

## Before you push

```sh
npm run check:play
npm run check:writing
npm run lint
npm run format:check
npm run typecheck
npm test
npm run build
npm run test:e2e
```

## Pull request description

Say what changed and why. Add screenshots at 375, 768, 1024 and 1440 px for a visual change (`npm run screenshots`). Update `docs/COMPLIANCE.md` if a standard's status changed.

## Architecture decisions

Record a new decision in `docs/adr/` with the next number. Keep it short: context, decision, consequences.
