# Kerb Sense: website standards (mandatory)

This is the owner's definitive checklist for the Kerb Sense website. It is mandatory.

## 0. How to use this file

1. **Precedence.** This file has the highest priority. The order is: `WEBSITE-STANDARDS.md` > `DESIGN.md` > `CONTENT.md` > `PROMPT.md` > `PLAN.md`. If this file conflicts with your plan, change the plan.
2. **Compliance matrix.** Make `docs/COMPLIANCE.md`. Put every numbered item from this file in it, with one status:
   - `DONE`: give the file, test or screenshot that proves it.
   - `N/A`: give the reason. This site is a static site with no backend, so many server items do not apply. Do not skip them silently; write the reason.
   - `OWNER`: the repository owner must do it. List the exact steps.
   - `BLOCKED`: you need content or a decision. Ask, and do not invent it.
3. **Language.** Write all documentation, ADRs, code comments, commit messages and UI microcopy (buttons, errors, labels, alt text) in **ASD-STE100 Simplified Technical English**: short sentences, one instruction per sentence, active voice, approved simple words. Headlines follow the Ahoy style in `DESIGN.md`.
4. **No placeholders.** Do not ship "lorem ipsum", "TBD", fake names, fake numbers, fake reviews or fake quotes. If content is missing, do not invent it and do not stop. Leave that feature out (for example, no email link), mark it BLOCKED in `docs/COMPLIANCE.md`, and list exactly what you need in the final report.

## 1. Decisions already made by the owner

- **Team names:** first names only (Brenden, Justin, Min, Wen Wei, Jaden), with role and institution. No surnames, no contact details, no ages.
- **Repository hygiene:** do not commit `website-handoff/source/` or `website-handoff/references/`. Add them to `.gitignore`. Commit the other handoff files.
- **URL structure:** the site is at the root URL. The game moves to `/play/` byte-for-byte unchanged, with a CI check that its SHA-256 has not changed.
- **Gameplay glimpse on the landing page:**
  - Record a real clip of the actual game at `/play/`. Use Playwright in headless Chromium, choose the Teenager profile so the phone notification shows, keep it silent, loop 6 to 10 seconds, and output WebM and MP4 under 2 MB plus a WebP poster frame.
  - Show it as a big Ahoy-style gameplay thumbnail. Activating it (click, tap, Enter or Space) goes to `/play/`.
  - You can use a React Bits component for the press interaction if it obeys the motion rules in section 5.
  - If you cannot record the clip, use a real screenshot of the game as the poster, and tell the owner.
  - Never use mock-ups or AI-generated gameplay.
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

| # | Item | Notes for this site |
|---|---|---|
| 1 | Remove horizontal scroll | Test at 320, 375, 768, 1024 and 1440px. No element can be wider than the viewport. |
| 2 | Find broken links | Run lychee (or similar) in CI on the built site. |
| 3 | Add mobile menu | Accessible: a button with `aria-expanded`, focus trap, Escape closes it. |
| 4 | Add favicon | Use `kerbsense-mark-white-on-red.svg`, plus PNG fallbacks and an apple-touch-icon. |
| 5 | Fix page titles | Unique per page. Format: `Page name | Kerb Sense`. |
| 6 | Add meta description | Unique per page, 120 to 160 characters, true and specific. |
| 7 | Fix footer links | Every footer link must work. |
| 8 | Custom 404 page | On brand (Ahoy style), with a link home and a link to `/play/`. Must work on GitHub Pages (`404.html`). |
| 9 | Copyright year | Compute it at build time: "© 2026 Kerb Sense". |
| 10 | Compress images (WebP) | WebP or AVIF in responsive sizes with `srcset`. No image over 300 KB except the hero. |
| 11 | Fix broken buttons | Every button does something. Test them in E2E. |
| 12 | Success messages | For any action that has a result (for example "Link copied."). |
| 13 | Error messages | Plain STE messages for the 3D viewer, the clip and the game iframe failing to load. |
| 14 | No placeholder text | See section 0.4. List missing content in the final report. |
| 15 | Remove unused nav and fix mobile overflow | Nav links go only to sections that exist. |
| 16 | Clickable logo | Goes to the top of the home page. |
| 17 | Clickable number | Use `tel:` links only if the owner gives a public number. None is planned, so record N/A or ask. |
| 18 | Clickable email | Use a `mailto:` link only for a public team email the owner gives you. **BLOCKED:** there is none yet, so leave it out and list it in the report. Never publish a personal or school email. |
| 19 | Every page mobile optimised | Includes `/play/` entry, the policies and the 404 page. |
| 20 | Privacy policy page | Plain STE. The site collects no personal data and sets no cookies. Describe the game's data honestly (check the game code: it may use localStorage for settings). Include a contact (BLOCKED until item 18 is answered). |
| 21 | Terms of use page | No T&C page exists yet, so write a short Terms of use: free educational project, no warranty, game rules, play only when stationary and safe. |
| 22 | Cookies policy | One short section: no cookies are set. If localStorage is used, say what and why. |
| 23 | Cookie consent | Not needed if there are no non-essential cookies or trackers. Record the reasoning. Do not add a banner that does nothing. |
| 24 | Form consent | N/A (no forms). |
| 25 | Refund policy | N/A (free; nothing is sold). |
| 26 | Analytics tracking | None at launch. If the owner wants analytics later: cookieless, aggregate, PDPA-compliant, disclosed in the privacy policy. |
| 27 | Third-party embeds | Embed only our own `/play/` (same origin). No YouTube or social embeds. Load no third-party scripts at all. |
| 28 | Fix accessibility | WCAG 2.2 AA; see E23. |
| 29 | Alt text on images | Specific and descriptive. Decorative zebra bars get `alt=""`. |
| 30 | Colour contrast | Never white on yellow. Light blue only behind 24px+ bold text. Check every pair. |
| 31 | Keyboard-friendly forms | N/A (no forms). Every control is still keyboard-operable. |
| 32 | Clear button labels | Verb plus object, for example "Play the game." and "Show the grid.". |
| 33 | Remove fake reviews | Never add reviews or testimonials. |
| 34 | Remove unsupported claims | Mark targets as **targets**. Make no claims of results. Show a source next to each statistic. |
| 35 | Real business details | We are a student team, not a business. Show the team name, the Delta Challenge 2026 Track B context and the YCM grant (text only). Do not use SPF, NCPC or NYC logos without written permission. |
| 36 | Copyright on images | Use only our own renders, logo and real game captures. Use no reference images on the site. Use no Ahoy, Dumb Ways to Die or Epic "Quinn" assets. |
| 37 | Local laws and other risks | Cover these in `docs/LEGAL-REVIEW.md`: PDPA, Copyright Act, minors, road-safety messaging (the site must never encourage phone use near roads; repeat "Stop somewhere safe before you play."). |
| 38 | Remove purple gradients | No gradients of any colour. |
| 39 | Remove AI slop photos | No stock photos and no AI images. Use only real renders and real game captures. |
| 40 | Build sitemap.xml | Include every public route. |
| 41 | Build robots.txt | Allow all, and point to the sitemap. |
| 42 | Remove noindex tags | No `noindex` on public pages. Keep `noindex` on the 404 page. |
| 43 | Add canonical tags | An absolute canonical URL on every page. |
| 44 | Add meta titles | See item 5. |
| 45 | Add meta descriptions | See item 6. |
| 46 | Fix heading hierarchy | One `h1` per page. No skipped levels. |
| 47 | Alt text on images | See item 29. |
| 48 | Add schema markup | JSON-LD: `WebSite`, `VideoGame` (for the game) and `Organization` (the team, with no personal data). Validate it. |
| 49 | Add internal links | Sections link to each other where useful, for example targets → programme, and booth → play. |
| 50 | Fix broken links | See item 2. |
| 51 | Improve Core Web Vitals | Targets: LCP under 2.5 s, CLS under 0.1, INP under 200 ms on a mid-range phone. Lazy-load the 3D viewer. Enforce budgets in Lighthouse CI. |
| 52 | Enforce HTTPS | See E5. |
| 53 | Add og:image | 1200×630 WebP or PNG made from our hero art. Add Twitter card tags too. |
| 54 | Verify Search Console | **OWNER:** list the steps. If the owner gives a verification meta tag, add it. |
| 55 | Sticky mobile CTA | A sticky "Play." button on mobile that does not cover content and respects safe-area insets. |

## 4. Signs of a vibe-coded site: do NOT ship any of these

Items 57 to 89 come from the owner's list. Each one is a ban, with the rule to follow instead.

| # | Ban | Our rule instead |
|---|---|---|
| 57 | A generic hero text colour, a vague hero, or a badge above the headline | The hero says exactly what this is: a road-safety game and booth for students. No pill badge above the headline. |
| 58 | Emoji icons | No emoji anywhere in the UI or copy. |
| 58 | Random cursive or serif-italic accents | Helvetica Neue only. No serif, no script, no italics for decoration. |
| 58 | A "Made with Lovable" or similar tag | None. |
| 58 | Em dashes | No em dashes (—) in any copy. Use a full stop, colon or comma. Search the build output to check. |
| 59 | Harsh gradients, grain over gradient texture | No gradients. No grain. No noise textures. |
| 60 | Lucide icons (or any default icon pack) | No icon library. Draw the few icons we need as flat geometric SVGs in our palette. |
| 61 | A flat pure-white page background | Use `--ks-paper` as the page ground and full colour fields for sections (see `DESIGN.md`). |
| 62 | Rainbow colouring | Only the seven palette colours, in the fixed section cycle. |
| 62 | Drop shadows | None. |
| 63 | Checkmark bullets | Use square bullets or numbers only. |
| 64 | Three pricing tiers | None. |
| 65 | No real product demo | The real game (embedded and at `/play/`) and the real booth model are the demo. |
| 66 | Soft corner radius | `border-radius: 0` everywhere. |
| 67 | Purple and black | No purple. |
| 68 | Generic shimmering skeleton loaders | Loading states are on-brand: a solid black block and a short STE label ("Loading the booth."). No shimmer. |
| 69 | Radial orbs, blurred blobs | None. |
| 70 | Dot grids | None. The only grid is the real 12-column grid behind "Show grid.". |
| 71 | Sparkle icons | None. |
| 72 | Animated arrows | The Ahoy arrow tabs are static shapes. No bouncing or sliding arrows. |
| 73 | Hover animations | Hover is an **instant** state change (colour inversion or a solid underline), with no transition. Drop the React Bits **Magnet** effect. |
| 74 | Neon colours | None. |
| 75 | Basic pastel colours | None. |
| 76 | Bento grids | Use a strict Swiss column grid. The parts catalogue is a uniform grid of equal cells, not a bento. |
| 77 | Inter, Geist or Space Grotesk; Inter everywhere | Helvetica Neue only. |
| 78 | "It's not X, it's Y" phrasing | Do not write in this pattern. Exception: quoting the game's own on-screen rules word for word (for example "Green means cars are braking, not that the road is clear.") is allowed, because it is real product text. |
| 79 | Low-contrast dark mode | No dark-mode variant at launch. Black sections are pure black with pure white text. |
| 80 | A badge above the headline | None (see 57). |
| 81 | Coloured-border cards | No cards with coloured borders. Use solid fills or black rules. |
| 82 | Untouched shadcn/ui | Do not use shadcn defaults. Radix primitives must be fully restyled to `DESIGN.md`. |
| 83 | Fade-in on scroll | No opacity animation anywhere. Content is visible by default. The only allowed motion is described below this table. |
| 84 | Cursor-following beams or spotlights | None. |
| 85 | Buttons that fade on hover | None (see 73). |
| 86 | Inconsistent spacing | Use one spacing scale (multiples of 8px) and the 12-column grid. Check spacing in the screenshots. |
| 87 | Generic buzzword copy | Avoid words like "revolutionary", "seamless", "unlock", "empower", "elevate", "cutting-edge" and "game-changer". Write specific STE sentences. |
| 88 | Space Grotesk plus Instrument Serif | No. Helvetica Neue only. |
| 89 | Grain over a gradient | No (see 59). |

**Allowed motion.** Motion must carry meaning, use transform only (never opacity or blur), and stop under `prefers-reduced-motion`. These are allowed:
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
