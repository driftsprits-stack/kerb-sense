# Legal review

This is a short review of the Kerb Sense website against the laws and standards named in `website-handoff/WEBSITE-STANDARDS.md` (E11, item 37). It is written by the build team, not by a lawyer. The owner should check it with the school or institution contact.

## 1. Personal Data Protection Act 2012 (Singapore)

- The site collects no personal data. There are no accounts, forms, cookies or analytics. See `/privacy/`.
- The game stores nothing in the browser. It uses no localStorage, sessionStorage or cookies.
- The site stores one setting in localStorage (`kerb-sense:grid`, a 0 or 1). It is not personal data.
- The schools programme records only anonymous aggregate counts and tallies. No photos, names or identifying details. This is stated on the site and in the proposal (section 6.1 and section 10).
- **PDPC guidance on children's personal data.** No personal data of any child is collected online. In schools, sessions run with school staff present and after the school's parental consent process. The site repeats this.
- Team members are shown by first name, role and institution only. No surnames, contact details or ages.

## 2. Copyright Act 2021 (Singapore)

- The site uses only assets the team made: the game, the booth renders and model, the logo and the gameplay clip.
- The reference images in `website-handoff/references/` are third-party works. They are not in the repository and not on the site.
- No Ahoy, Dumb Ways to Die or Epic "Quinn" assets are used. The booth is the team's own model.
- No Singapore Police Force, National Crime Prevention Council or National Youth Council logos are used. They are named in text only, as organisers and funders.
- The SPF road traffic figures are quoted as facts with the source named.
- The source code is published under the MIT licence in `LICENSE`.
- Helvetica Neue is not self-hosted. The site relies on the system font and falls back to Arial.

## 3. Minors

- The game is for primary and secondary school students. It shows no collision, injury or death. Failure cuts to a non-graphic results screen.
- The site gives no way for a minor to contact the team or to submit data.
- No reviews, testimonials or photos of students.

## 4. Road-safety messaging

- The site must never encourage phone use near a road. "Stop somewhere safe before you play." appears in the hero, the booth section, the safety section, the footer, the terms page and the 404 page footer.
- The terms page says: do not play while you walk, cycle, drive or cross a road.
- Targets are labelled "Target." and the targets section says "Targets, not results. The pilot has not run yet." No result is claimed.

## 5. WCAG 2.2 AA

- Playwright runs axe-core (WCAG 2.0, 2.1 and 2.2 A and AA tags) on every page. CI fails on serious or critical violations.
- Contrast: white or black on every field as DESIGN.md allows. Never white on yellow. Light blue only behind large bold text.
- Keyboard: every control is reachable. Focus is a 3px square outline. The mobile menu traps focus and closes on Escape (Radix Dialog).
- Motion: every animation stops under `prefers-reduced-motion`.
- Images: specific alt text. Decorative images have empty alt.

## 6. Open items for the owner

- Give a public contact address, or confirm there is none (standards item 18). Until then the privacy page points to GitHub issues.
- Confirm the team name "TEAM if raeann cared" may be published as the organisation name.
