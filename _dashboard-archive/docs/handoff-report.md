# Consolidated handoff report

**Date**: 2026-08-25 · **Updated**: 2026-08-26 · **Scope**: packaging, Figma accuracy, accessibility

**Assembled, not investigated.** Nothing here is new; every finding traces to one
of three source documents, cited inline:

| Tag      | Source                                                           |
| -------- | ---------------------------------------------------------------- |
| `[PKG]`  | `docs/handoff-audit.md` — packaging P1–P6                        |
| `[FIG]`  | `docs/figma-audit-newer-eleven.md` — 11-component Figma re-audit |
| `[A11Y]` | `docs/accessibility-audit.md` — Section C                        |

Where a finding was corrected or retracted, **the corrected state is carried
here** — see `[PKG]` P5 CORRECTION, `[PKG]` P6 RETRACTED, and `[A11Y]` §1a
CORRECTION plus §2 items 3 and 7.

Each finding is marked **fixed** / **confirmed-open** / **disproven** /
**designer-blocked** / **decision-pending**.

---

## 1. Verdict

**Dev-team-ready, with a documented fix list. Blocked on the designer for one
thing: contrast.**

1. **Contrast is the one blocking area, and it is not fixable in code.** After
   reconciling against the designer's two claims the scope narrowed, but the
   conclusion held. Two token pairings carry the blocker: `Content/Tertiary`
   fails on **23 elements across 5 components** at 4.26:1 (tabs, step labels,
   field labels, verified labels, divider labels, Checkbox checked+disabled labels,
   DataRow field labels — 12 nodes in DataRow alone), and `Content/Faint` on
   **three** live-text usages at 1.73:1 (Input/Textarea placeholders, Toast
   timestamp). Two further one-off pairings (disabled avatar, chip soft fills) are
   the same class of designer-only fix but **lower severity**: both are 8px text on
   low-traffic surfaces. No CSS resolves a token pair below AA; all four need new
   values.
2. **The entry-point risk is closed, but only just.** A consumer importing
   `/source` from JavaScript silently ships no styles, with HTTP 200 and no
   error. That is now documented prominently in the README — the protection is a
   doc, not a guard rail.
3. **Everything else is a known, sized fix list**: **ten confirmed-open items** —
   two packaging behaviours (P2, P3), five accessibility BUGs, three ARIA defects
   in documented markup — each with a file path. Plus one system decision
   (`aria-current`) that is pending rather than broken.

What this is _not_: a library a team can adopt and ship an accessible product
with today, without either new contrast values or an explicit decision to accept
the failures.

---

## 2. What's already solid

The rest of this document is negatives; this section is the counterweight.

- **The Tailwind overlay contract holds by construction.** `dist/index.css`
  declares `@layer theme, base, components, utilities` itself, and all 39
  component files wrap their rules in `@layer components`. Utilities beat
  component classes in every case tested — `bg-red-500`, `p-8`, `hover:`, `md:` —
  and the result is byte-identical regardless of import order. `[PKG]`
- **Token mapping is sound and independently re-verified** (25 of 39 components;
  Checkbox, DataRow, SensitiveData swept 2026-08-26, external Figma re-audit
  outstanding). `[FIG] §6` confirmed the non-obvious calls: `Critical/Content` is
  a real Collection 1 variable; ProgressBar's `Has Legend` misnaming; Step's
  inverted label ramp and its two distinct border tokens; Stepper's 9px connector
  offset; Breadcrumbs' literal `>`; LoadingInline's 12px indicator at every size;
  Divider's two stroke tokens.
- **931 automated checks pass** (as of 2026-08-26, superseding the 2026-08-25
  count of 842/34) — visual verification across 38 components with specs, static
  verification across 39.

**Shipped to `main` this cycle** — each verified present on `origin/main`:

| Fix                                                                           | Commit    | Source            |
| ----------------------------------------------------------------------------- | --------- | ----------------- |
| `prepack` — tarball no longer ships without CSS                               | `5829810` | `[PKG]` P1        |
| Four Figma defects (PaginationItem, LoadingIndicator, Divider, FilterSegment) | `9d3ab4c` | `[FIG] §1`        |
| Icon stroke scaling — per-size ramp                                           | `3a04d14` | `[FIG] §4 Q1`     |
| Help icon inherits `currentColor`                                             | `083e8fc` | —                 |
| 14px stroke resolved at 1.25px                                                | `de42d26` | `[FIG] §4 Q1`     |
| Breadcrumbs rebuild + Step number control                                     | `fb3055b` | `[FIG] §4 Q2, Q4` |
| README entry-point protection                                                 | `5225669` | `[PKG]` P5        |
| P6 retraction                                                                 | `7aeaada` | `[PKG]` P6        |

---

## 3. For the dev team

### 3a. Packaging

| Finding                                                | State                  | Detail                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------------------------------------------ | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tarball shipped no CSS                                 | **fixed**              | `prepack` regenerates `dist/` and the sprite on every pack and publish. `[PKG]` P1                                                                                                                                                                                                                                                                                                                                                |
| `/source` fails under a JS/TS import                   | **fixed (documented)** | It is the _import form_, not any utility. A JS import hands `library.css` to PostCSS with no Tailwind context; all 116 spacing-derived `@apply` calls become unresolvable and the build aborts on the first — while the dev server still returns **HTTP 200**, so the page loads with the library's CSS silently absent. Use `@import "@valiify/dashboard-ui/source";` inside your own Tailwind stylesheet. `[PKG]` P5 CORRECTION |
| Prebuilt entry reverts your theme tokens               | **confirmed-open**     | Not a blanket clobber. It ships its own `@layer theme` and lands after yours, so any token both define becomes ours — a custom `--font-sans` reverts to Inter. Tokens we do not define (spacing) survive. Does not occur on `/source`. `[PKG]` P2                                                                                                                                                                                 |
| Prebuilt entry double-applies Preflight                | **confirmed-open**     | 2 `box-sizing` rules, 2 `h1` resets, 3 `@layer base` declarations in a Tailwind app. Via `<link>` on a plain page it resets `h1` margins and strips `ul` bullets. `[PKG]` P3                                                                                                                                                                                                                                                      |
| `focus-ring` / `type-label-*` "advertised but missing" | **disproven**          | Absent from prebuilt `dist` **by design** (`source(none)` plus on-demand `@utility`). The README documents this correctly. Residual: the CHANGELOG lacks the entry-point caveat. `[PKG]` P4                                                                                                                                                                                                                                       |
| Sprite packed but not exported                         | **disproven**          | `"./icons/sprite.svg"` has been exported since `5d22705`. The finding tested a fabricated `src/`-prefixed specifier. The real gap was that it was undocumented — now in the README. `[PKG]` P6 RETRACTED                                                                                                                                                                                                                          |

**Guidance**: use `/source` inside a Tailwind app; the prebuilt `.` entry only
for pages with no Tailwind build.

### 3b. Accessibility BUGs that are code-fixable

All `[A11Y]`, all **confirmed-open**:

| #   | Finding                                                                           | Evidence                                                                                                                                                                                                                                                                                                                                                                           |
| --- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Switch has no accessible name in any documented usage**                         | A bare `<input type="checkbox" class="switch-input">` inside `<label class="switch">` with no text and no `aria-label`. Fails 7/7 stories.                                                                                                                                                                                                                                         |
| 2   | **`.icon-button` has zero `:focus-visible`** — and it propagates                  | `icon-button.css` styles `:hover` (`:56`), `:active` (`:60`) and `:disabled` (`:66`), and nothing else. It is the close button in **Modal, Toast and Alert** (`alert.css:19`), so keyboard users get no focus indicator on the dismiss control of all three.                                                                                                                       |
| 3   | **`opacity-50` disabled treatment**                                               | `_template.css:107` — so every newly scaffolded component inherits it — plus `menu-item.css:136`, `pill.css:100`, `tabs.css:202`. The library treats this as a defect elsewhere: `icon-button.css:65` records that "an earlier version used opacity-50, which is not the design". Blanket opacity dims text and background together, taking a compliant palette out of compliance. |
| 4   | **16 of 17 motion files unguarded**                                               | Only `loading-indicator.css` honours `prefers-reduced-motion` — and it is the only keyframe animation, so the highest-risk case _is_ covered. The rest are hover/state transitions; the notable one is **Switch**, whose knob slides 14px over 150ms.                                                                                                                              |
| 5   | **`loading-indicator.css` reduced-motion block sits outside `@layer components`** | The only unlayered rule in `dist`, and the only place the overlay contract breaks.                                                                                                                                                                                                                                                                                                 |

### 3c. Three ARIA defects in _documented_ markup

Library defects rather than story slips — CLAUDE.md documents the failing
markup. All `[A11Y]`, all **confirmed-open**:

- **`aria-selected` on a plain `<button>` and on `role="menuitem"`** (13 nodes;
  Button, MenuItem, DropdownMenu). Neither allows it. The correct attributes are
  `aria-pressed` for a toggle button, and `aria-checked` with
  `role="menuitemradio"` / `menuitemcheckbox` for a selectable row. Both
  components style `[aria-selected="true"]` as a supported state, so this is a
  coordinated change across CSS, docs and stories.
- **Orphan `role="menuitem"`** (21 nodes). The role requires an ancestor
  `role="menu"` or `menubar`; the documented examples show it standalone.
- **Form controls with no accessible name** (20 nodes; Input, Switch, Textarea).
  The library's label part is a `<div class="input-label">`, not a
  `<label for>` — styling only, and invisible to assistive tech.

Story-only, no library change needed: `landmark-unique` (4),
`empty-table-header` (3), `aria-input-field-name` (1).

### 3d. A system decision, not a fix

**`aria-current` on Step is class-only.** `[A11Y]` `[FIG] §3` —
**decision-pending**. Its only occurrence in `step.css` is inside a usage
comment; styling comes from `.step-active`. Every comparable component drives
from ARIA: tabs 14 selectors, pill 4, menu-item 2, dropdown-field 2, **step 0**.

Three options, none chosen here:

1. **Alias** — add `.step[aria-current="step"]` beside `.step-active`, matching
   Tabs. Non-breaking; both work.
2. **Drop the ARIA from the docs** — stay class-only and stop implying the
   attribute does anything.
3. **Require ARIA** — it drives styling, the class is removed. Breaking.

`aria-current="step"` maps only to _active_, so `.step-upcoming` stays a class
under any of them.

---

## 4. For the designer

### 4a. URGENT — contrast fails WCAG AA on high-traffic labels and placeholders

`[A11Y] §1a` + CORRECTION — **designer-blocked**. Four items, split by severity:
**two blocking token pairings**, then **two lower-severity one-offs**. All four
are uncodeable — no CSS resolves a token pair below AA.

**Context that settles the surface question**: `src/base/index.css` sets
`html { background-color: var(--color-surface-frame); }` — `#f0f3f7`. That grey
canvas is the library's own default, shipped in both entries. Any component that
paints no background of its own renders on it.

**`Content/Tertiary` `#727280` — fails on 23 rendered nodes across 5 components
at 4.26:1** (AA needs 4.5). Original six elements plus Checkbox (5 nodes: checked
and disabled labels) and DataRow (12 nodes: field labels) confirmed via axe audit
2026-08-26. All trace to `html` with no painting ancestor. The 23 nodes come from
these 8 selectors:

`.tab` · `.step-label` · `.field-verification-label` · `.divider-label` ·
`.input-label > span` · `.textarea-label > span` · `.checkbox-label` (checked and
disabled) · `.data-row-field`

It _passes_ on Paper (4.74) and Card (4.54), so this is surface-dependent rather
than a bad colour outright. The field labels are the clearest case — they sit
above the white input box, outside it, so the field's white never covers them.

**`Content/Faint` `#c4c4ce` — fails on three live-text usages at 1.73:1**:

`dropdown-field.css:101` placeholder · `textarea.css:100` placeholder ·
`toast.css:135` timestamp

**Two one-off pairings — same designer-only fix, lower severity.** Both are 8px
text on lower-traffic surfaces, so they do not block sign-off the way the two
token pairings do, but they are the worst raw ratios in the library:

- **Disabled avatar** — `#ffffff` on `#9cb1cc` = **2.19:1** at 8px. CLAUDE.md
  documents keeping `Content/Contrast` initials while the fill dims as
  intentional; the result is unreadable.
- **Chip soft fills at 8px** — warning `#c9881f` on `#ece9e4` = **2.46:1**;
  critical `#c5303c` on `#eee3e8` = 4.34:1; success `#157d61` on `#ddebec` =
  4.14:1.

> **Scope was narrowed in the designer's favour, and both claims were checked
> rather than assumed.** `.menu-item-subtitle` was removed from the failing list
> — it renders inside `.dropdown-menu`, which fills white, so it passes at 4.74;
> axe hit it only because the stories render rows outside a panel. And four of
> seven `Content/Faint` usages are fine: the tooltip passes at **10.43:1** on the
> dark surface, and three disabled states are **WCAG 1.4.3-exempt** as inactive
> controls. That exemption is real but is not "excluded from the accessibility
> tree" — a disabled control is still announced, it simply is not held to 4.5:1.
> No element carrying Faint has `aria-hidden`, `role="presentation"` or
> `role="none"`: zero across all 17 occurrences.

**The question**: is `Content/Tertiary` permitted on grey surfaces, and is
`Content/Faint` permitted for live text?

### 4b. The five Figma questions

`[FIG] §4`, with current state:

| #   | Question                                                                                                                    | State                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| --- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Icon stroke weight does not scale                                                                                           | **disproven + fixed.** The finding was wrong — only the 24px variant declares `stroke-width="2"`; the 12px declares nothing at all. Our strokes were 0–22% too **thick**, never half. The designer specified the ramp; shipped in `3a04d14`, with 14px resolved at 1.25px in `de42d26`.                                                                                                                                                                                                                                                                                                                                                               |
| 2   | Stepper's step number is not an overridable property                                                                        | **partially resolved.** The `Stepper Number` text property now exists on Step (1032:2012). **But the Stepper's own four instances (1032:2013) still do not pass it**, so the design file still renders "1" four times.                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 3   | FilterSegment binds `Radius/XS` (4px) somewhere not visible in instances; the segment box measures 6px. What carries the 4? | **confirmed-open**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| 4   | Breadcrumbs models no hover or focus state on its links                                                                     | **resolved.** The designer added a 0.5px `currentColor` hover rule and a 2px `Primary/Main` focus state; rebuilt in `fb3055b`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 5   | Chip vs Divider casing — one answer, please                                                                                 | **resolved 2026-08-26.** The designer bound a text style to the Chip label — `Micro Text/Micro S - Bold` — and it applies **no** `text-transform`: the rendered variant emits `REVIEW` with no `uppercase` class, so the caps are the sample string's, not the component's. That confirms the behaviour both components already ship: casing is the caller's. Divider reached it via `text-label-s-bold` (dropping the `type-label-*` form, which forces uppercase) and Chip by never imposing one. The stale "until the designer confirms" comments in `chip.css:54` and `CLAUDE.md:590` should now be updated — a doc follow-up, not a code change. |

### 4c. What is the Ring boolean for on a non-interactive element?

`[A11Y] §2.3` — **designer-blocked**. Four components define `.with-ring` but no
`:focus-visible`: Avatar, Chip, FieldVerification, SectionMarker.

**This is narrower than originally filed.** Those four are exactly the
**non-interactive** components in the set, and the six that pair both
(filter-segment, pill, segment-selector, tabs, tag, text-button) are all
controls. The split is principled, not an oversight.

What remains open is what Figma's Ring boolean _means_ on something you cannot
focus: if it signals selection, these need a real state and probably a role; if
it is a focus affordance, it is on the wrong components.

---

### 4d. New components — audited 2026-08-26

**Checkbox, DataRow and SensitiveData** were built after the original 2026-08-25
audit passes. Axe audit completed 2026-08-26:

- **Checkbox**: 5 `color-contrast` violations — checked and disabled labels use
  `Content/Tertiary`, folded into §4a scope. Storybook landmark/region violations
  are iframe scaffolding, not component defects.
- **DataRow**: 12 `color-contrast` violations — field labels use
  `Content/Tertiary`, folded into §4a scope. Landmark/region violations are iframe
  scaffolding.
- **SensitiveData**: No component-level violations. One `region` violation on
  Storybook error display (iframe scaffolding).

Visual specs for all three reference their Figma nodes and accurately represent
what Figma draws. The contrast failures are Figma design decisions, not spec
errors.

**Checkbox — two designer items, both open:**

- **Checked + disabled is not drawn.** Only 4 of the 8 `Active` × `Hover` ×
  `Disabled` combinations exist. With nothing drawn for checked+disabled, a
  disabled ticked box keeps its full `Primary/Main` fill and **reads as enabled**.
  RadioSelect _invented_ a treatment for exactly this gap
  (`:disabled:checked::before` drops to `Stroke/Divider`); Checkbox deliberately
  did not, so **two checkbox-family controls now answer the same question
  differently**. Source: `src/components/checkbox.css` header.
- **The label goes lighter when checked.** `Content/Primary` unchecked →
  `Content/Tertiary` checked — the same colour as disabled. A ticked row reads
  dimmer than an unticked one, and identical to one you cannot interact with.
  Reproduced faithfully and pinned in the visual spec. Same shape as Step's
  inverted label ramp `[FIG] §6`. Source: `src/components/checkbox.css` header.

**Checkbox also has no indeterminate state** — the axis is `Active`, a boolean,
so a "select all" header checkbox has nothing to render. `:indeterminate` is
deliberately unstyled and currently draws as unchecked.

**DataRow and SensitiveData carry the recurring authoring artefacts.**
SensitiveData's Figma description is a _checkbox's_, pasted verbatim; DataRow's
says "optional leading icon" when the `Icon` axis adds a **trailing** one; both
bind a value that appears nowhere in the rendered structure (`Radius/XS` and
`Neutral/Main` respectively — the same phantom binding as FilterSegment's, an
open designer question at `[FIG] §4 Q3`); and both have padding that cannot
contain its own glyph. Checkbox is the first of the four components built this
cycle to come out clean on all three.

## 5. Open decisions

| Decision                       | State                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Entry-point recommendation** | **largely resolved.** The README now leads with the CSS-`@import`-only rule, names the silent-failure mode, and reframes the prebuilt entry by use case. P2 and P3 remain confirmed-open as _behaviours_, but the guidance steers away from them. Remaining choice: fix them (e.g. strip Preflight from the prebuilt entry) or leave them documented. |
| **`aria-current` system-wide** | **decision-pending.** Three options in §3d. The wider question is whether ARIA should drive styling everywhere, given Tabs, Pill, MenuItem and DropdownField already do and Step does not.                                                                                                                                                            |
| **Contrast tokens**            | **designer-blocked.** Blocks any accessibility sign-off.                                                                                                                                                                                                                                                                                              |
| **Documented-not-fixed**       | The CHANGELOG's missing entry-point caveat on `focus-ring` / `type-label-*` (`[PKG]` P4); and the `_template.css` `opacity-50` pattern, which keeps propagating into every new component until it is changed.                                                                                                                                         |

---

## 6. Not covered by this audit

- **This report reflects the component set as of 2026-08-26.** **Checkbox,
  DataRow and SensitiveData** were added after the original 2026-08-25 audit
  passes. **Axe audit completed 2026-08-26** — findings folded into §4a and §4d.
  Visual verification: 931/931 checks pass across 38 components with specs. **Figma
  re-audit of these three components is outstanding** — their visual specs
  reference Figma nodes (108:607, 165:678, 296:5303) and pass verification, but
  have not been through the external drift sweep that covered 25 of 39 components.
- **No screen-reader pass.** axe finds programmatic defects; it does not tell you
  whether a Breadcrumbs trail or a Stepper _reads_ sensibly in VoiceOver or
  NVDA. `[A11Y]`
- **No focus-order audit** beyond the components named above.
- **Contrast was measured against the four surface tokens only.** Components
  rendered on a coloured or image background were not evaluated. `[A11Y]`
- **The prebuilt `dist` entry was not scanned by axe** — the stories exercise the
  source path. `[A11Y]`
- **Roving-tabindex is unmodelled and untested.** Zero `tabindex`, zero `play:`
  functions, and the 9 stories with `addEventListener` handle clicks only. Tabs,
  SegmentSelector and RadioSelect need arrow-key navigation with one tab stop per
  group; a team reading the stories would reasonably ship a tab bar where every
  tab is its own tab stop. `[A11Y]`
- **`@storybook/addon-a11y` has no threshold** — an inspection panel that gates
  nothing. `[A11Y]`
- **Only 25 of 39 components have been externally re-audited against Figma** (39
  total = 38 specced + Card placeholder). `[FIG]` covered 11, the earlier
  `docs/figma-alignment-audit.md` covered 23, and Card is excluded placeholder
  scaffolding. Checkbox, DataRow, SensitiveData (the 3 newest) swept 2026-08-26
  for contrast only; external Figma re-audit outstanding.
- **`[FIG] §2` (nine corrected false claims) and `§3` (assumptions) are not
  reproduced here.** They are historical record and remain traceable in that
  document.
