# Kerb Sense: website standards (mandatory)

This is the owner's definitive checklist for the Kerb Sense website. It is mandatory.

## 0. How to use this file

1. **Precedence.** This file has the highest priority. The order is: `WEBSITE-STANDARDS.md` > `DESIGN.md` > `CONTENT.md` > `PROMPT.md` > `PLAN.md`. If this file conflicts with your plan, change the plan.
2. **Compliance matrix.** Make `docs/COMPLIANCE.md`. Put every item ID from this file in it (E = engineering, L = launch, V = vibe-coding bans, S = safety, A = acceptance), with one status:
   - `DONE`: give the file, test or screenshot that proves it.
   - `N/A`: give the reason. This site is a static site with no backend, so many server items do not apply. Do not skip them silently; write the reason.
   - `OWNER`: the repository owner must do it. List the exact steps.
   - `BLOCKED`: you need content or a decision. Do not invent it, and do not stop. List it in the final report.
3. **Language.** Write all documentation, ADRs, code comments, commit messages and UI microcopy (buttons, errors, labels, alt text) in **ASD-STE100 Simplified Technical English**: short sentences, one instruction per sentence, active voice, approved simple words. Headlines follow the Ahoy style in `DESIGN.md`.
4. **No placeholders.** Do not ship "lorem ipsum", "TBD", fake names, fake numbers, fake reviews or fake quotes. If content is missing, do not invent it and do not stop. Leave that feature out (for example, no email link), mark it BLOCKED in `docs/COMPLIANCE.md`, and list exactly what you need in the final report.

## 1. Decisions already made by the owner

- **Team names:** first names only (Brenden, Justin, Min, Wen Wei, Jaden), with role and institution. No surnames, no contact details, no ages.
- **Repository hygiene:** do not commit `website-handoff/source/` or `website-handoff/references/`. Add them to `.gitignore`. Commit the other handoff files.
- **URL structure:** the site is at the root URL. The game moves to `/play/` byte for byte, with a CI check of its SHA-256. The exact source commit, hash, routes and boundary rules are in `PROMPT.md` sections 3 and 4.
- **Gameplay glimpse on the landing page:**
  - Record a real clip of the actual game at `/play/`. Use Playwright in headless Chromium, choose the Teenager profile so the phone notification shows, keep it silent, loop 6 to 10 seconds, and output WebM and MP4 under 2 MB plus a WebP poster frame.
  - Show it as a big Ahoy-style gameplay thumbnail. Activating it (click, tap, Enter or Space) goes to `/play/`.
  - You can use a React Bits component for the press interaction if it obeys the motion rules in section 4.
  - If you cannot record the clip, use a real screenshot of the game as the poster, and tell the owner.
  - Never use mock-ups or AI-generated gameplay. Do not embed the game in an iframe on the landing page.
- **Security:** the site has **no API keys, no secrets, no backend and no database**. Keep it that way. Do not add any service that needs a secret in client code.

## 2. Engineering, security and operations standards

For each item, implement it or record N/A with the reason in `docs/COMPLIANCE.md`.

| ID | Standard | What it means for this static site |
|---|---|---|
| E1 | Input sanitization and injection prevention | There is no user input. If any input is added, validate it and encode output. Never use `dangerouslySetInnerHTML`. Set a strict Content-Security-Policy in a `<meta>` tag: no `unsafe-eval`, and `unsafe-inline` only if it cannot be avoided. |
| E2 | Authentication, authorization, roles and permissions | N/A (no accounts). State this. GitHub branch protection controls who can deploy. |
| E3 | Session management and token expiry | N/A (no sessions, cookies or tokens). |
| E4 | Secrets management | Commit no secrets. Add a secret scan (gitleaks) to CI on every push and PR, and scan the full git history once. Give the owner steps to turn on GitHub secret scanning and push protection. Never print environment values in logs. |
| E5 | HTTPS and TLS certificate rotation | GitHub Pages issues and renews TLS certificates. Owner step: Settings → Pages → Enforce HTTPS. Use only `https://` URLs. Add `upgrade-insecure-requests` to the CSP. |
| E6 | Rate limiting and abuse prevention | N/A at app level (no endpoints). GitHub's CDN serves the files. Record this. |
| E7 | Dependency scanning and vulnerability patching | Add a Dependabot config (npm and GitHub Actions, weekly), `npm audit --audit-level=high` in CI, and CodeQL. Pin GitHub Actions to commit SHAs. Keep dependencies to the minimum. |
| E8 | Multi-tenancy and data isolation | N/A (single static site, no user data). |
| E9 | PII handling | Publish no PII. First names only. Store and log no user data. The game stores nothing personal. |
| E10 | Data retention and deletion policies | State in the privacy policy that the site collects no personal data. If you add analytics later, it must be cookieless and aggregate, with retention stated. |
| E11 | Regulatory compliance | Singapore PDPA 2012 (including the PDPC guidance on children's personal data), the Singapore Copyright Act 2021, and WCAG 2.2 AA. Write a short `docs/LEGAL-REVIEW.md`. |
| E12 | Audit trails and tamper-evident logging | Use git history, protected `main`, PR-only merges and the deploy logs in GitHub Actions. Document this. Signed commits are recommended (owner setting). |
| E13 | Integration, end-to-end and regression testing | Use Playwright E2E for every route, the game iframe, `/play/` loading, nav, the booth viewer controls and the 404 page. Add screenshot regression tests at 375, 768 and 1440px. |
| E14 | Load and stress testing | Static files on a CDN. Run Lighthouse CI three times per build and record the results. Record N/A for server load. |
| E15 | Chaos and resilience testing | Test that the page works when WebGL fails, JavaScript is slow, the GLB fails to load or the clip fails to load. Each failure shows the static fallback. |
| E16 | Test coverage thresholds enforced in CI | Vitest unit tests for logic (booth state, explode math, grid toggle). Coverage of at least 80% lines on `src/lib`. CI fails below the threshold. |
| E17 | Code review process and standards | Write `CONTRIBUTING.md`: PRs only, one reviewer, CI green, ESLint and Prettier, TypeScript `strict`. |
| E18 | Error handling | Use React error boundaries around the 3D viewer and the clip, with a clear STE error message and a working fallback. |
| E19 | Graceful retry with backoff and idempotency | Retry the GLB and clip fetch up to 3 times with exponential backoff, then show the fallback. Make sure no action runs twice. |
| E20 | Circuit breakers and fallback behaviour | After repeated failures, stop retrying for the session and keep the fallback. |
| E21 | Concurrency and race conditions | Guard state when view buttons are pressed quickly during an animation. The last input wins. Do not stack animations. |
| E22 | Caching strategy and invalidation | Use content-hashed filenames from Vite for all assets, so a new deploy invalidates the cache. Document it. |
| E23 | Accessibility | WCAG 2.2 AA. Run axe-core in the Playwright tests; CI fails on serious or critical violations. |
| E24 | RTO, RPO and disaster recovery | Write `docs/DR.md`. RPO is the last commit on `main`. Set an RTO target of 30 minutes to redeploy from git. Give the restore steps, including a manual deploy if Actions fails. |
| E25 | Documentation, ADRs and architecture diagrams | Write a `README.md` in STE, put ADRs in `docs/adr/` (stack, 3D approach, hosting, game embedding, no-analytics), and add one Mermaid architecture diagram. |
| E26 | API protection and contracts | N/A (no API). Record it. If an external API is ever added, it needs a written contract and a server-side proxy. |
| E27 | Plan | Keep `PLAN.md` current. Tick off tasks as you finish them. |

## 3. Launch checklist

| ID | Item | Notes for this site |
|---|---|---|
| L01 | Remove horizontal scroll | Test at 320, 375, 768, 1024 and 1440px. No element can be wider than the viewport. |
| L02 | Find broken links | Run lychee (or similar) in CI on the built site. |
| L03 | Add mobile menu | Accessible: a button with `aria-expanded`, focus trap, Escape closes it. |
| L04 | Add favicon | Use `kerbsense-mark-on-green.svg` (the "k." monogram), plus PNG fallbacks and an apple-touch-icon. |
| L05 | Fix page titles | Unique per page. Format: `Page name | Kerb Sense`. |
| L06 | Add meta description | Unique per page, 120 to 160 characters, true and specific. |
| L07 | Fix footer links | Every footer link must work. |
| L08 | Custom 404 page | On brand (Ahoy style), with a link home and a link to `/play/`. Must work on GitHub Pages (`404.html`). |
| L09 | Copyright year | Compute it at build time: "© 2026 Kerb Sense". |
| L10 | Image formats and compression | **SVG for all flat art** (logo, booth renders, parts, hero, plates; already supplied as SVG). Inline the hero SVG; load the others with `<img>`. Raster only where needed: the gameplay poster (WebP) and the og:image (PNG, supplied). Every below-the-fold image uses `loading="lazy"` and `decoding="async"`, with width and height set to prevent layout shift. No image over 300 KB. |
| L11 | Fix broken buttons | Every button does something. Test them in E2E. |
| L12 | Success messages | For any action that has a result (for example "Link copied"). |
| L13 | Error messages | Plain STE messages for the 3D viewer, the clip and the game iframe failing to load. |
| L14 | No placeholder text | See section 0.4. List missing content in the final report. |
| L15 | Remove unused nav and fix mobile overflow | Nav links go only to sections that exist. |
| L16 | Clickable logo | Goes to the top of the home page. |
| L17 | Clickable number | Use `tel:` links only if the owner gives a public number. None is planned, so record N/A or ask. |
| L18 | Clickable email | Use a `mailto:` link only for a public team email the owner gives you. **BLOCKED:** there is none yet, so leave it out and list it in the report. Never publish a personal or school email. |
| L19 | Every page mobile optimised | Includes `/play/` entry, the policies and the 404 page. |
| L20 | Privacy policy page | Plain STE. The site collects no personal data and sets no cookies. State that the game stores nothing (verified: no localStorage, cookies or network requests in commit `e1d8f1f`), and keep the website, the game and the future school programme separate (see `CONTENT.md`). Include a contact (BLOCKED until L18 is answered). |
| L21 | Terms of use page | No T&C page exists yet, so write a short Terms of use: free educational project, no warranty, game rules, play only when stationary and safe. |
| L22 | Cookies policy | One short section on the privacy page: the website and the game set no cookies and use no browser storage. |
| L23 | Cookie consent | Not needed if there are no non-essential cookies or trackers. Record the reasoning. Do not add a banner that does nothing. |
| L24 | Form consent | N/A (no forms). |
| L25 | Refund policy | N/A (free; nothing is sold). |
| L26 | Analytics tracking | None at launch. If the owner wants analytics later: cookieless, aggregate, PDPA-compliant, disclosed in the privacy policy. |
| L27 | Third-party embeds | None. No YouTube or social embeds, no iframes on the landing page, and no third-party scripts at all. `/play/` is a separate page. |
| L28 | Fix accessibility | WCAG 2.2 AA; see E23. |
| L29 | Alt text on images | Specific and descriptive. Decorative zebra bars get `alt=""`. |
| L30 | Colour contrast | Only the pairs allowed in `DESIGN.md` section 1. Green text only at 24px bold or larger (4.3:1 on paper). Check every pair with a tool and record the ratios. |
| L31 | Keyboard-friendly forms | N/A (no forms). Every control is still keyboard-operable. |
| L32 | Clear button labels | Verb plus object, for example "Play the game" and "Show the grid". No full stop on buttons or other UI labels. |
| L33 | Remove fake reviews | Never add reviews or testimonials. |
| L34 | Remove unsupported claims | Mark targets as **targets**. Make no claims of results. Show a source next to each statistic. |
| L35 | Real business details | We are a student team, not a business. Show the team name, the Delta Challenge 2026 Track B context and the YCM grant (text only). Do not use SPF, NCPC or NYC logos without written permission. |
| L36 | Copyright on images | Use only our own renders, logo and real game captures. Use no reference images on the site. Use no Ahoy, Dumb Ways to Die or Epic "Quinn" assets. |
| L37 | Local laws and other risks | Cover these in `docs/LEGAL-REVIEW.md`: PDPA, Copyright Act, minors, road-safety messaging (the site must never encourage phone use near roads; repeat "Stop somewhere safe before you play."). |
| L38 | Remove purple gradients | No gradients of any colour. |
| L39 | Remove AI slop photos | No stock photos and no AI images. Use only real renders and real game captures. |
| L40 | Build sitemap.xml | Include every public route. |
| L41 | Build robots.txt | Allow all, and point to the sitemap. |
| L42 | Remove noindex tags | No `noindex` on public pages. Keep `noindex` on the 404 page. |
| L43 | Add canonical tags | An absolute canonical URL on every page. |
| L44 | Add meta titles | Same as L05. |
| L45 | Add meta descriptions | Same as L06. |
| L46 | Fix heading hierarchy | One `h1` per page. No skipped levels. |
| L47 | Alt text on images | Same as L29. |
| L48 | Add schema markup | JSON-LD: `WebSite`, `VideoGame` (for the game) and `Organization` (the team, with no personal data). Validate it. |
| L49 | Add internal links | Sections link to each other where useful, for example targets → programme, and booth → play. |
| L50 | Fix broken links | Same as L02. |
| L51 | Improve Core Web Vitals | Targets: LCP under 2.5 s, CLS under 0.1, INP under 200 ms on a mid-range phone. Lazy-load the 3D viewer. Enforce budgets in Lighthouse CI. |
| L52 | Enforce HTTPS | See E5. |
| L53 | Add og:image | 1200×630 WebP or PNG made from our hero art. Add Twitter card tags too. |
| L54 | Verify Search Console | **OWNER:** list the steps. If the owner gives a verification meta tag, add it. |
| L55 | Sticky mobile CTA | A sticky "Play" button on mobile that does not cover content and respects safe-area insets. |

## 4. Signs of a vibe-coded site: do NOT ship any of these

These come from the owner's list (originally numbered 57 to 89). Each one is a ban, with the rule to follow instead.

| ID | Ban | Our rule instead |
|---|---|---|
| V01 | A generic hero text colour, a vague hero, or a badge above the headline | The hero says exactly what this is: a road-safety game and booth for students. No pill badge above the headline. |
| V02 | Emoji icons | No emoji anywhere in the UI or copy. |
| V03 | Random cursive or serif-italic accents | Helvetica Neue only. No serif, no script, no italics for decoration. |
| V04 | A "Made with Lovable" or similar tag | None. |
| V05 | Em dashes | No em dashes (—) in any copy. Use a full stop, colon or comma. Search the build output to check. |
| V06 | Harsh gradients, grain over gradient texture | No gradients. No grain. No noise textures. |
| V07 | Lucide icons (or any default icon pack) | No icon library. Draw the few icons we need as flat geometric SVGs in black, white or green. |
| V08 | A flat pure-white page background | Use `--ks-paper` as the page ground and full colour fields for sections (see `DESIGN.md`). |
| V09 | Rainbow colouring | ONE accent colour only: black, white, paper and green (`DESIGN.md` section 1). No red, yellow, blue or light blue anywhere, including booth renders, charts, buttons and focus states. |
| V09b | Highlighter text effect | No boxes or bars behind individual headline lines (the black "highlighter" look). Type sits directly on its ground. |
| V10 | Drop shadows | None. |
| V11 | Checkmark bullets | Use square bullets or numbers only. |
| V12 | Three pricing tiers | None. |
| V13 | No real product demo | The real game (embedded and at `/play/`) and the real booth model are the demo. |
| V14 | Soft corner radius | `border-radius: 0` everywhere. |
| V15 | Purple and black | No purple. |
| V16 | Generic shimmering skeleton loaders | Loading states are on-brand: a solid black block and a short STE label ("Loading the booth"). No shimmer. |
| V17 | Radial orbs, blurred blobs | None. |
| V18 | Dot grids | No generic decorative dot-grid backgrounds. The only dots allowed are the supplied LED halftone textures (`assets/textures/`), used as in the poster. |
| V19 | Sparkle icons | None. |
| V20 | Animated arrows | The Ahoy arrow tabs are static shapes. No bouncing or sliding arrows. |
| V21 | Hover animations | Hover is an **instant** state change (colour inversion or a solid underline), with no transition. Drop the React Bits **Magnet** effect. |
| V22 | Neon colours | None. |
| V23 | Basic pastel colours | None. |
| V24 | Bento grids | Use a strict Swiss column grid. The parts catalogue is a uniform grid of equal cells, not a bento. |
| V25 | Inter, Geist or Space Grotesk; Inter everywhere | Helvetica Neue for text, Kerb Block for display only, Noto Sans JP only for the approved Japanese strings. Nothing else. |
| V26 | "It's not X, it's Y" phrasing | Do not write in this pattern. Exception: quoting the game's own on-screen rules word for word (for example "Green means cars are braking, not that the road is clear.") is allowed, because it is real product text. |
| V27 | Low-contrast dark mode | No dark-mode variant at launch. Black sections are pure black with pure white text. |
| V28 | A badge above the headline | None (see V01). |
| V29 | Coloured-border cards | No cards with coloured borders. Use solid fills or black rules. |
| V30 | Untouched shadcn/ui | Do not use shadcn defaults. Radix primitives must be fully restyled to `DESIGN.md`. |
| V31 | Fade-in on scroll | No opacity animation anywhere. Content is visible by default. The scroll-driven "unfold" in the allowed-motion list is transform-only and scrubbed to the scroll position; it is not a fade. |
| V32 | Cursor-following beams or spotlights | None. |
| V33 | Buttons that fade on hover | None (see V21). |
| V34 | Inconsistent spacing | Use one spacing scale (multiples of 8px) and the 12-column grid. Check spacing in the screenshots. |
| V35 | Generic buzzword copy | Avoid words like "revolutionary", "seamless", "unlock", "empower", "elevate", "cutting-edge" and "game-changer". Write specific STE sentences. |
| V36 | Space Grotesk plus Instrument Serif | No. Helvetica Neue only. |
| V37 | Grain over a gradient | No (see V06). |

**Allowed motion.** Motion must carry meaning, use transform only (never opacity or blur), and stop under `prefers-reduced-motion`. These are allowed:
- **the scroll-driven unfold (Apple-product-page style)** in the hero, "Our answer." and the booth section. It is **scrubbed to the scroll position**, not triggered by time: as the visitor scrolls, pinned scenes move, the booth turns, the parts separate and text panels slide in using `transform` only. Scrolling back reverses it exactly. Content is never hidden: with JavaScript off, with reduced motion on, or before the scene starts, everything shows in its final, readable state. No scroll-jacking: native scrolling speed and keyboard scrolling must stay normal;
- the booth viewer (rotate, snap, explode);
- the ScrollVelocity road band (it stops under reduced motion);
- the target Counters (each one counts once);
- the Stepper (it moves on user input);
- one SplitText slide on the hero headline at page load, with no opacity;
- the gameplay clip.

## 5. Safety and reliability

| ID | Item | Notes |
|---|---|---|
| S1 | Rate limiting | N/A (static, no endpoints). |
| S2 | API limits and spending caps | N/A (no paid APIs). Never add a paid API key to client code. |
| S3 | Error handling | See E18. |
| S4 | Loading states | For the 3D viewer, the clip and the game iframe (see 68). |
| S5 | Empty states | N/A (no lists from data). Record it. |
| S6 | Handle failed requests | Show the fallback for a failed GLB, clip or iframe (E15). |
| S7 | Handle API timeouts | Time out asset fetches after 15 s, then fall back. |
| S8 | Prevent duplicate submissions | N/A (no forms). |
| S9 | Prevent duplicate payments | N/A (no payments). |
| S10 | Optimise DB queries | N/A (no database). |
| S11 | DB indexes | N/A. |
| S12 | Paginate large results | N/A. |
| S13 | Compress files | Brotli and gzip are served by GitHub Pages. Minify JS and CSS. Draco or meshopt for the GLB (under 1 MB). |
| S14 | Limit upload size | N/A (no uploads). |
| S15 | Cache repeat requests | See E22. |
| S16 | Uptime monitoring | **OWNER:** suggest a free uptime check (for example a scheduled GitHub Action that fetches `/` and `/play/` and opens an issue on failure). You can build that Action. |
| S17 | Error logging | No third-party logging. Log errors to the console only, with no personal data. Record the decision in an ADR. |
| S18 | Test simultaneous users | N/A for a static CDN. Record the Lighthouse results instead. |
| S19 | Test back and restore | Test that browser Back and Forward, deep links to sections, and reloads all work, including returning from `/play/`. Test restore from git (E24). |

## 6. Owner-only actions (list them in your final report)

1. Install the Claude GitHub App on `driftsprits-stack/kerb-sense` with write access (needed to push).
2. Settings → Pages → Source: **GitHub Actions**. Then turn on **Enforce HTTPS**.
3. Settings → Code security: turn on **secret scanning**, **push protection** and **Dependabot alerts**.
4. Settings → Branches: protect `main` (PRs required, status checks required).
5. Google Search Console: verify the site and submit `sitemap.xml`.
6. Give a public contact email for the team, or confirm that there is none (item 18).

## 7. Definition of done

- Every item in this file has a status in `docs/COMPLIANCE.md`.
- CI is green: build, lint, typecheck, unit tests with coverage threshold, Playwright E2E with axe, link check, gitleaks, npm audit, Lighthouse CI budgets, and the `/play/` SHA-256 check.
- Screenshots at 375, 768 and 1440px for every page are attached to the PR.
- A final report lists what is DONE, N/A, OWNER and BLOCKED, in STE.

## 8. Acceptance criteria (observable outcomes)

Test each one and report it as passed, failed or could not run.

| ID | Outcome |
|---|---|
| A1 | On the first screen, at 375px and at 1440px, a visitor can see what Kerb Sense is, who it is for, why the booth matters and where to play, without scrolling. |
| A2 | Every published number has the correct label ("Target", "Requested", "Planned") and a source. No number is shown as a result. |
| A3 | The game loads and is playable at the deployed `/play/` URL, and its SHA-256 matches `PROMPT.md` section 4. |
| A4 | The booth stays understandable when WebGL fails or reduced motion is on: the static renders, the part names and the purposes all show. |
| A5 | All controls work with a keyboard only, and with touch only. |
| A6 | Mobile layouts keep the hierarchy: the booth, the one-liner and "Play" stay readable at 375px, with no horizontal scroll. |
| A7 | Selecting a part in the catalogue highlights the same part in the 3D model, and the reverse. |
| A8 | No text says the booth is built, the schools are confirmed or the grant is awarded (see the status table in `CONTENT.md`). |
| A9 | The final report separates checks that passed, checks that failed, and checks that could not run (with the reason). |
| A10 | Only black, white, paper (`#F2EFE8`) and green (`#178048`) appear in the built CSS and images. The build audit fails on any other colour. |
| A11 | The new logo files are used everywhere (header, footer, favicon, og:image, 404). No round-dot logo remains. |
| A12 | The page follows the reading order in `PROMPT.md` section 5, with the section index on desktop and the current section name on mobile. |
| A13 | All flat art on the site is SVG. Every below-the-fold image is lazy-loaded and has explicit width and height (CLS under 0.1). |
| A14 | The scroll unfold works at 375, 1024 and 1440px, reverses when scrolling up, keeps native scroll speed, and shows the final readable state with reduced motion on or JavaScript off. |
| A15 | Only the hero headline and the big section titles end with a decorative full stop. No button, nav link, tab, label, part name, number or caption ends with one. |
| A16 | Rotating copy: each refresh can show different hero and section-title text from `copy-pool.json`; `?copy=default` shows the first entries; no visible text swap, no layout shift, no storage; every entry passes the CI copy validation. |
| A17 | The fonts are Helvetica Neue (text), Kerb Block (display only, self-hosted WOFF2) and Noto Sans JP (subset, only for the approved Japanese strings). Every Japanese string is in `CONTENT.md`, has `lang="ja"` and has an English meaning. |
| A18 | The hero follows the poster composition (booth in front of the huge Kerb Block title, LED texture, vertical katakana) at 375 and 1440px, with no loss of legibility. |
