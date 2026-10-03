# Legal review

This is a short review of the Kerb Sense website against the laws and standards named in `website-handoff/WEBSITE-STANDARDS.md` (E11, L37). It is written by the build team, not by a lawyer. The owner should check it with the school or institution contact.

Last updated: 3 October 2026.

## 1. Personal Data Protection Act 2012 (Singapore)

- The site collects no personal data. There are no accounts, forms, cookies or analytics. See `/privacy/`.
- The game stores nothing in the browser. It uses no localStorage, sessionStorage, IndexedDB or cookies, and makes no network requests (checked in the game code on 2 October 2026).
- The site stores one setting in localStorage (`kerb-sense:grid`, a 0 or 1). It is not personal data. The rotating copy uses no storage at all.
- The schools programme records only anonymous aggregate counts and tallies. No photos, names or identifying details. This is stated on the site and in the proposal (sections 6.1 and 10).
- **PDPC guidance on children's personal data.** No personal data of any child is collected online. In schools, sessions would run with school staff present and after the school's parental consent process. The site repeats this.
- Team members are shown by first name, role and institution only. No surnames, contact details or ages.

## 2. Copyright Act 2021 (Singapore) and licences

- The site uses only assets the team made: the game, the booth renders and model, the logo, the poster textures, the product render and the gameplay clip.
- The reference images in `website-handoff/references/` are third-party works. They are not in the repository and not on the site.
- No Ahoy, Dumb Ways to Die or Epic "Quinn" assets are used. The booth is the team's own model.
- No Singapore Police Force, National Crime Prevention Council or National Youth Council logos are used. They are named in text only, as organisers and funders.
- The SPF road traffic figures are quoted as facts with the source named.
- The source code is published under the MIT licence in `LICENSE`.
- **Fonts.** Helvetica Neue is not self-hosted; the site relies on the system font and falls back to Arial. Kerb Block is the team's own font, supplied in the handoff. Noto Sans JP is under the SIL Open Font License 1.1, which allows subsetting and self-hosting; the subset is made from the `@fontsource/noto-sans-jp` package and the licence file ships with that package in `node_modules`.
- The gameplay clip is a recording of the team's own game.

## 3. Minors

- The game is for primary and secondary school students. It shows no collision, injury or death. Failure cuts to a non-graphic results screen.
- The site gives no way for a minor to contact the team or to submit data.
- No reviews, testimonials or photos of students.

## 4. Road-safety messaging

- The site must never encourage phone use near a road. "Stop somewhere safe before you play." appears in the hero, the safety section, the footer, the terms page and the 404 page.
- The terms page says: do not play while you walk, cycle, drive or cross a road.
- Every number in "How we will measure it" is labelled "Target" and the section says nothing is measured yet. No result is claimed. The booth is labelled "Designed, to be built", the programme "Planned" and the grant "Requested".

## 5. WCAG 2.2 AA

- Playwright runs axe-core (WCAG 2.0, 2.1 and 2.2 A and AA tags) on every page at four viewports. CI fails on serious or critical violations.
- Contrast: black on paper (18.5:1), white on black (21:1), white on green (5.0:1). Green text appears only at 24 px or larger (the hero katakana) or at 16 px bold on white (the selected catalogue name, 5.0:1). Status words and the running-order label are white on a solid green block. There is no green text on black.
- Keyboard: every control is reachable. Focus is a 3 px square outline. The mobile menu traps focus and closes on Escape (Radix Dialog).
- Motion: every animation stops under `prefers-reduced-motion`, and the scroll scenes show their final state.
- Images: specific alt text on the booth images. Decorative textures and part images have empty alt.
- Language: every Japanese string has `lang="ja"` and an English meaning in its `aria-label`.

## 6. Open items for the owner

- Give a public contact address, or confirm there is none (standards L18). Until then the privacy page points to GitHub issues.
- Confirm the team name "TEAM if raeann cared" may be published as the organisation name.
