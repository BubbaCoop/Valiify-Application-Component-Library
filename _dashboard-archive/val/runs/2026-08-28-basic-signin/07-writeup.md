# Val run writeup — 2026-08-28-basic-signin

**Deliverable:** `04-build/index.html` (+ `styles.css`) — the dashboard
sign-in page, built from the attached design screenshot and writeup.
Signed off 2026-08-29 after one rework pass.

## What was built

A single static page (vanilla HTML/CSS/JS) on the library's `dist/index.css`:
a centered 400px sign-in card on `Surface/Frame` — title, subtitle,
chrome-less email/password fields (email prefilled), a native "Remember me"
checkbox, a flexed primary **Sign In** beside an outline **Cancel**, a
centered **Forgot password?** link, and a viewport-fixed outline
**View Demo Info** button bottom-right. Fonts load from the repo's
`@fontsource` packages (no CDN); every color/radius/type value is a design
token custom property — zero hardcoded hex.

## Final scores

- **Visual accuracy: 99.6%** (Gate 6 grid diff, 64px tiles, 20×13 grid,
  252 non-empty tiles — 251 pass, 1 warn, **0 fail**, 0 fails inside
  matched library components). Overlay and full tile data in
  `06-accuracy/`.
- **QA: PASS** — 29 checks: 24 pass, 0 fail, 5 n/a (no sticky header,
  progress track, or expand/collapse exists on this page). All four flows
  verified with exact alert copy; resize clean at 1440/1280/1024; full
  keyboard traversal with visible focus on all 7 interactive elements;
  zero console errors. Report: `05-qa-report.md`.

## Behaviors verified

1. Sign In → `alert("Sign in clicked")`, no navigation
2. Cancel → `alert("Cancel clicked")`, no navigation
3. Forgot password? → real anchor, destination out of scope (inert `#`)
4. View Demo Info → informational alert
5. Remember me toggles both directions (incl. via its label); unchecked default
6. Email/password accept input; placeholder and prefill as specified

## Deliberate deviations, and why

1. **Forgot password? renders Inter 600 where the design drew ~400** — the
   run's single warn tile (2.3%). The library `.link` (strong) is canonical
   for a mapped Link per pipeline rules, and no shipped Link style is
   14px/400/Primary/no-underline. Flagged, not silently matched to pixels.
2. **`:focus-visible` ring on the chrome-less inputs** (rework 1). The
   design's chrome-less fields dropped the `.input-field` wrapper that
   carries the library's focus treatment, leaving keyboard focus invisible
   (QA S6.1/S6.2, WCAG 2.4.7). One call-site rule restates the library's
   `focus-ring` (2px `Primary/Main`, −2px offset). Invisible at rest —
   the rest-state render is byte-identical.
3. **Reproduced as drawn per your answers** (`00-input/requester-answers.md`):
   chrome-less inputs, native 16×16 checkbox, bespoke token-composed card
   (white / hairline / 6px / no shadow), email value in Inter.

## Component gaps — future library candidates

- **Card**: the page needed a bespoke token surface; the shipped `.card`
  is placeholder scaffolding. A real Card matching this treatment
  (paper fill, `stroke-divider` hairline, `radius-control`) is the obvious
  first candidate.
- **Quiet-primary Link variant**: 14px/400 `Primary/Main`, no rest
  underline — drawn here, absent from the Link set.
- **Page-title type token**: the 24px/600 title has no `--text-*` token;
  the scale jumps 19px (h2) → 46px (display).
- **Labeled bare-input pattern**: 14px mixed-case field labels over
  chrome-less inputs don't match the library's 10px uppercase
  `.input-label` — worth a designer decision on whether this is a real
  Input variant.

## Open questions carried through

All five Gate 3 questions were answered mid-run (design-as-drawn wins;
see `00-input/requester-answers.md`). One soft item remains: the
**View Demo Info alert copy** was never pinned — the build uses the
prototype's "This is a demo!". Say the word if you want different copy.

## Needing human review

Nothing blocking. `manifest.json` shows the full gate log: one rework
cycle (keyboard-focus fix), QA re-run after the last build change,
accuracy measured after QA, thresholds met.
