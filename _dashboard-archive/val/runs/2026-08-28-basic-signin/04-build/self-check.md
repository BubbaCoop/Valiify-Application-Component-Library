# Build self-check — 2026-08-28-basic-signin

Build agent: val-build. Sources walked: `manifest.json`, `03-requirements.md`,
`02-component-map.json`, `01-extraction/` (figma.json, variables.json,
behaviors.json, structure.md), `.claude/skills/valiify-dashboard-ui/SKILL.md`,
`src/themes/valiify.css` (fresh read — quoted in styles.css header),
CLAUDE.md Design Tokens section, and the mapped component sources
(`src/components/button.css`, `link.css`, plus `input.css`/`checkbox.css`/
`card.css` context for the overridden matches). `00-input/requester-answers.md`
treated as binding overrides per the orchestrator.

**Rework pass 2026-08-29** (fix list from `05-qa-report.md` S6.1/S6.2): one
targeted change — a `:focus-visible` ring on the two chrome-less text inputs.
See §5. Nothing else was touched; the walk below was re-run in full and every
prior ✓ still holds.

## 1. Component map walk (02-component-map.json, top to bottom)

| # | figmaNode | Map match / variant | In build as | ✓/✗ |
| - | --- | --- | --- | - |
| 1 | est-card | Card (visual-guess) → map note + requester answer 5: bespoke token surface | `.signin-card` — `--color-surface-paper` fill, `--border-thin` + `--color-stroke-divider` hairline (renders 1px, matching the measured stroke), `--radius-control` 6px as drawn, no shadow, 16px padding, 400px width + both-axis flex centering at the call site. Placeholder `.card` deliberately not used. Marked `val:gap`. | ✓ |
| 2 | est-title | none | `.signin-title` — raw 24px (no token exists; map instruction), `--text-h2--line-height` 19.5px box, weight 600, `--color-content-primary`, `val:gap`. Weight note: extraction estimated 700 with `estimated:true` (±1 step fuzz); the drawn glyphs are 600 — the title tiles pass the diff at <2% with 600. | ✓ |
| 3 | est-subtitle | none | `.signin-subtitle` — exact double token match per map: `--text-body-1` (13/19.5/400) + `--color-content-secondary`, `val:gap`. | ✓ |
| 4 | est-email-label + est-email-value | Input (visual-guess), type=email, bg white, label "Email", value "user@valiify.com" | `<input type="email" class="input">` prefilled — the library `.input` element class with **no `.input-field` box** (requester answer 2: chrome-less as drawn). Value renders Inter, not mono (requester answer 1). Label as drawn: 14px/500 (`--text-subtitle` size/weight) in `--color-content-primary`. **Rework:** call-site `:focus-visible` ring restating the library `focus-ring` utility from the ring tokens (QA S6.1) — rest render unchanged, see §5. | ✓ |
| 5 | est-password-label + est-password-placeholder | Input (visual-guess), type=password, placeholder "Enter your password" | `<input type="password" class="input">`, empty, placeholder shown in `--color-content-tertiary` via the library `.input` placeholder rule. Same chrome-less treatment and label style. **Rework:** same `:focus-visible` ring (QA S6.2). | ✓ |
| 6 | est-checkbox + est-checkbox-label | Checkbox (visual-guess), checked=false | **Native 16×16 checkbox** per requester answer 3 — library Checkbox markup deliberately NOT substituted. Unchecked by default (verified). Label 14px/400 `--color-content-secondary`, 8px gap, real `<label for>` association. Marked `val:gap`. | ✓ |
| 7 | est-btn-primary | Button, variant=primary, size=md (default), label "Sign In" | `.btn .btn-primary` (md default) — library markup/CSS canonical; `flex: 1` applied at the call site per the map's width deviation. Renders 290.5×28 @ (457,485) vs measured 291×28 @ (457,485). | ✓ |
| 8 | est-btn-cancel | Button, variant=outline, size=md (default), label "Cancel" | `.btn .btn-outline`, hug width, in an 8px-gap flex row. Renders 67.5×28 @ (755.5,485) vs measured 67×28 @ (756,485). | ✓ |
| 9 | est-link | Link, style=strong (base `.link`), label "Forgot password?" | `<a class="link" href="#">` centered in the card. Known, accepted deviation per the map + orchestrator (library class is canonical): `.link` is Inter 600 where the drawn glyphs are ~400 — this is the run's single warn tile (2.3%, x576 y512). Destination page is out of scope (03-requirements §2 row 3), so the href stays inert. | ✓ |
| 10 | est-btn-view-demo | Button, variant=outline, size=sm, label "View Demo Info" | `.btn .btn-outline .btn-sm`, `position: fixed; right/bottom: 20px` at the call site. Stock 6px radius per the map's recommendation (measured 4.5 flagged as probable noise). Renders 108.5×24 @ (1151.5,756) vs measured 108×24 @ (1152,756). | ✓ |

Also from the map's gaps array: est-root page background — `--color-surface-frame` set explicitly on `body` (and inherited from the library's `html` rule). ✓

## 2. Behaviors walk

`01-extraction/behaviors.json` is a source-limited **empty set** (screenshot
source) — per the orchestrator, the wired behaviors are 03-requirements.md §2,
rows 1–4. All alert copy per requester answer 4 (native `alert()`).

| # | Trigger | Required outcome | Wired as | Verified | ✓/✗ |
| - | --- | --- | --- | --- | - |
| 1 | "Sign In" click | confirmation alert, no navigation | `alert("Sign in clicked")` | headless click → alert fired with exact copy | ✓ |
| 2 | "Cancel" click | confirmation alert, no navigation | `alert("Cancel clicked")` | headless click → alert fired with exact copy | ✓ |
| 3 | "Forgot password?" click | outbound navigation to the forgot-password page — **destination explicitly not part of this build**; only the link is in scope | real `<a class="link">`; href left inert (`#`) rather than pointed at a nonexistent file | link present, focusable, correct rest styling | ✓ |
| 4 | "View Demo Info" click | informational alert | `alert("This is a demo!")` — requester answer 4 specifies exact copy only for Sign In/Cancel and says "demo info" for this one; the copy used is the informational message from the prototype this design was rendered from | headless click → alert fired | ✓ |
| — | Email field | standard text entry, prefilled | native `<input type="email">`, value `user@valiify.com` | ✓ | ✓ |
| — | Password field | standard masked entry, placeholder | native `<input type="password">` | ✓ | ✓ |
| — | "Remember me" | toggles; unchecked by default; no functional effect | native checkbox | headless: default unchecked, click toggles to checked | ✓ |
| — | Keyboard focus on the text fields (QA standing check S6.1/S6.2, rework fix) | visible focus indicator on Tab | `.signin-field .input:focus-visible` — 2px `--ring-focus-color` (Primary/Main) outline at −2px offset, the library `focus-ring` treatment | headless: Tab → `#email` and Tab → `#password` each draw the ring (computed `2px solid oklch(0.4234 0.1163 256.9)`, offset −2px); pixels change on focus | ✓ |

## 3. Non-negotiable rules

| Rule | Status | ✓/✗ |
| --- | --- | - |
| 1. Mapped components reproduce library markup/CSS; deviations only where noted | Button ×3 and Link use library classes untouched; Input/Checkbox/Card deviations are exactly the requester's answers 2/3/5, which override the map's notes. Rework adds one call-site rule on the chrome-less inputs restating the library's own `focus-ring` utility (src/utilities/index.css:32) — the treatment `.input-field:focus-within` (input.css:150) would have supplied had the wrapper existed; per the fix list, not a reintroduction of the field chrome | ✓ |
| 2. No hardcoded hex; all values via custom properties; token comment block at top of styles.css | Re-grepped after rework: zero hex in rules (the only `#767676` occurrence is a comment explaining the native checkbox's browser-drawn border). Header quotes token names + values freshly read from `src/themes/valiify.css`, now including `--ring-focus-width` / `--ring-focus-color`. Spacing values are raw px because the design system deliberately ships no spacing tokens (CLAUDE.md); each is annotated | ✓ |
| 3. Implement every entry in behaviors.json | Vacuously satisfied (empty set) + §2 flows wired per orchestrator, per table above | ✓ |
| 4. tabular-nums on numerics; mono strictly per §4 | §4: the email value is the page's only data-classified content and the requester overrode it to Inter (answer 1); no IDs/amounts/dates/counts appear, so no numeric or mono treatment applies anywhere | ✓ |
| 5. Unmapped instances as one-offs marked `val:gap` | 4 `val:gap` comments: title, subtitle (confidence none), card surface, native checkbox (requester-directed one-offs) | ✓ |

## 4. Verification evidence (initial build)

- **Console**: `node val/tools/screenshot.mjs` — page loads over `file://`
  with **zero console errors** (`06-accuracy/console.log` is 0 bytes; separate
  playwright probe also caught none).
- **Tile diff** (`node val/tools/grid-diff.mjs`, same tool as the accuracy
  gate): 20×13 grid, **252 non-empty tiles: 251 pass, 1 warn, 0 fail —
  passPct 99.6%**. The one warn (2.3% at x576,y512) is the Forgot-password
  link's left half: library `.link` weight 600 vs the drawn ~400 — the
  deviation the map and orchestrator direct (library class is canonical).
- **Geometry probe** vs `01-extraction/figma.json` (all within ±0.5px):
  card 400×356 @ (440,222) exact; Sign In (457,485) 290.5×28; Cancel
  (755.5,485) 67.5×28; checkbox (457,442.5) 16×16; View Demo (1151.5,756)
  108.5×24.
- **Fonts**: @fontsource/inter 400/500/600 loaded via relative node_modules
  paths — offline-deterministic, no CDN. JetBrains Mono not loaded (no mono
  on the page).

## 5. Rework pass 2026-08-29 — QA S6.1/S6.2 fix and verification

**Change (the fix list's one item, nothing else):** one rule + two header
token lines in `styles.css`. `.signin-field .input:focus-visible` now applies
`outline: var(--ring-focus-width) solid var(--ring-focus-color);
outline-offset: calc(-1 * var(--ring-focus-width))` — declaration-for-
declaration the library's `focus-ring` utility (2px Primary/Main, negative
offset so the ring's outer edge sits on the element's own edge). Restated at
the call site because the prebuilt `dist/index.css` entry ships component
classes only, never utility classes. Root cause per the QA report: the
library's visible focus treatment lives on the `.input-field` wrapper's
`:focus-within`, which the requester-mandated chrome-less rendering omits,
while the `.input` element reset (`outline-none`) suppresses the browser's
own ring. `index.html` untouched.

**Verified headless** (node + repo playwright 1.62.1 from the repo root,
Chromium 1280×800 @2x over `file://`; log in the session scratchpad,
`verify-fix.log`) — 9/9 pass:

- **Rest state unchanged (the binding constraint):** full-page unfocused
  screenshot after the fix is **byte-identical** to the pre-fix baseline
  (66,237 = 66,237 bytes) — the card region, and every other region, is
  pixel-for-pixel unchanged, so the Gate 6 artifacts in `06-accuracy/`
  (captured from the identical unfocused render) remain valid and were not
  regenerated. Computed rest state of `#email`: `outline-style: none`,
  `box-shadow: none`.
- **S6.1:** first Tab lands on `#email`; after the 500ms transition settle,
  computed outline is `2px solid oklch(0.4234 0.1163 256.9)` (=
  `--ring-focus-color`, Primary/Main) at `-2px` offset; the focused
  screenshot differs from the unfocused one (visible in pixels, not just in
  computed style).
- **S6.2:** second Tab lands on `#password`; same computed ring.
- **Pointer focus:** a mouse click on `#email` also draws the ring — that is
  the UA `:focus-visible` heuristic for text-entry elements (Selectors L4:
  keyboard input is imminent), and it matches the library's own
  `.input-field:focus-within` behavior, which likewise rings on click. The
  selector is `:focus-visible` only, exactly per the fix list.
- **Console:** zero console errors, zero page errors across load, tabbing,
  and clicking.
- **Rule 2 re-check:** no hardcoded hex in any rule after the edit; the new
  rule uses only the two ring custom properties.

All items ✓ — nothing outstanding.
