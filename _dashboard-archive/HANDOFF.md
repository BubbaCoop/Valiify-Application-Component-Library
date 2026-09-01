# Handoff — @valiify/dashboard-ui

**State**: Main branch green, all gates pass. CSS-only Tailwind v4 component library — 39 components, 931 automated checks passing.

**Full report**: [docs/handoff-report.md](docs/handoff-report.md) — packaging, Figma accuracy, accessibility findings with severity classification.

---

## Run it locally

```bash
npm install
npm run build              # theme + icons + CSS
npm run typecheck          # TypeScript validation
npm run verify:layers      # cascade layer contract
npm run audit              # component coverage
npm run verify:component --all  # static verification (run for each component)
npm run build-storybook    # static build for visual verification
npx http-server storybook-static -p 6007 &  # ← http-server, NOT serve
npm run verify:visual -- --url http://127.0.0.1:6007
```

**⚠️ GOTCHA**: `verify:visual` requires **http-server**, not `serve`. `serve` returns HTTP 301 redirects on `iframe.html` paths; the harness doesn't follow redirects → false NO-ELEMENT cascade on all 931 checks. CI uses `http-server` + `wait-on` (see [.github/workflows/ci.yml](.github/workflows/ci.yml)).

---

## Your tasks (dev, code-fixable)

**8 confirmed-open items** — 5 accessibility bugs + 3 ARIA defects. All have file paths and clear fixes.

### Priority 1: Accessibility bugs ([§3b](docs/handoff-report.md#3b-accessibility-bugs-that-are-code-fixable))

1. **`.icon-button` has zero `:focus-visible`** — propagates to Modal/Toast/Alert close buttons  
   File: `src/components/icon-button.css`  
   Fix: Add `:focus-visible` rule (styles `:hover` / `:active` / `:disabled`, but not focus)

2. **Switch has no accessible name**  
   File: `src/components/switch.css` + stories  
   Fix: Add `aria-label` or associate with visible text

3. **`opacity-50` disabled treatment**  
   Files: `src/components/_template.css:107`, `menu-item.css:136`, `pill.css:100`, `tabs.css:202`  
   Fix: Use token swap (e.g. `Secondary/Disabled`) instead of blanket opacity

4. **16 of 17 motion files unguarded**  
   Files: All hover/state transitions except `loading-indicator.css`  
   Fix: Wrap transitions in `@media (prefers-reduced-motion: no-preference)`  
   Note: Loading animations (the one keyframe) already guarded

5. **`loading-indicator.css` reduced-motion block outside `@layer components`**  
   File: `src/components/loading-indicator.css`  
   Fix: Move `@media (prefers-reduced-motion)` block inside `@layer components`  
   Impact: Only unlayered rule in `dist`, breaks overlay contract

### Priority 2: ARIA defects in documented markup ([§3c](docs/handoff-report.md#3c-three-aria-defects-in-documented-markup))

6. **`aria-selected` on plain `<button>` and `role="menuitem"`** (13 nodes)  
   Components: Button, MenuItem, DropdownMenu  
   Fix: Use `aria-pressed` for toggles, `aria-checked` + `role="menuitemradio"` for selectable rows  
   CSS: Both style `[aria-selected="true"]` — coordinate change across CSS + docs + stories

7. **Orphan `role="menuitem"` without ancestor `role="menu"`** (21 nodes)  
   Fix: Wrap in `<div role="menu">` or `role="menubar"`

8. **Form controls with no accessible name** (20 nodes: Input, Switch, Textarea)  
   Files: `src/components/input.css`, `switch.css`, `textarea.css`  
   Fix: Use `<label>` wrapper or `<label for>` association, not `<div class="*-label">`

---

## Blocked on design (not fixable in code)

**Contrast tokens** ([§4a](docs/handoff-report.md#4a-urgent--contrast-fails-wcag-aa-on-high-traffic-labels-and-placeholders)) — blocks WCAG AA sign-off:

- **`Content/Tertiary` #727280**: 23 elements at 4.26:1 (needs 4.5:1)  
  Affects: tabs, step labels, field labels, verified labels, divider labels, Checkbox checked+disabled, DataRow field labels (12 nodes)
- **`Content/Faint` #c4c4ce**: 3 elements at 1.73:1  
  Affects: Input/Textarea placeholders, Toast timestamp

**Visual specs are CORRECT** — they match Figma. These are token/design decisions, not bugs.

**Open Figma questions** ([§4b](docs/handoff-report.md#4b-the-five-figma-questions)):
- Q2: Stepper step number property exists but instances don't use it
- Q3: FilterSegment binds `Radius/XS` (4px) but measures 6px — what carries the 4?

**Ring on non-interactive elements** ([§4c](docs/handoff-report.md#4c-what-is-the-ring-boolean-for-on-a-non-interactive-element)): Avatar, Chip, FieldVerification, SectionMarker define `.with-ring` but no `:focus-visible` — what does Ring mean here?

---

## Safe to ship / known

**Not blockers, documented behaviors:**

- **loading-indicator layer escape** — the one unlayered rule, addressed in Priority 1 item 5
- **3 wide-tolerance specs** — Pill label widths (29.5±2, 170±25), SegmentSelector widths (158±30, 360±90). All passing, documented as content-driven estimates.
- **Packaging P2/P3** — prebuilt entry reverts theme tokens and double-applies Preflight. Use `/source` in Tailwind apps (documented in README).
- **Checkbox design gaps** — no checked+disabled state (reads as enabled), label goes lighter when checked (inverted ramp), no indeterminate state. Figma omissions, not code bugs.

---

## Gotchas

1. **Specs drift from components** — change appearance, update `scripts/visual-specs.mjs` same commit or CI flags it
2. **Some spec values are estimates** — 4 of 931 checks use non-zero tolerance for content-driven widths (font rendering variation)
3. **Check branch before committing** — main is green, confirm you're on the right branch
4. **verify:visual requires http-server** — `serve` breaks it (301 redirects on iframe.html)
5. **Entry-point matters** — `/source` for Tailwind apps (with utilities), `.` prebuilt for plain pages (no utilities, reverts your tokens)

---

**Questions?** See [docs/handoff-report.md](docs/handoff-report.md) for full context, severity classifications, and evidence.
