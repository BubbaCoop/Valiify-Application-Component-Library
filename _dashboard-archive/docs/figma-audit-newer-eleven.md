# Round-2 Figma audit: the eleven components never externally reviewed

**Date**: 2026-08-24 (audit) · 2026-08-25 (four fixes applied)
**Scope**: `Breadcrumbs · Divider · FilterSegment · Link · LoadingIndicator ·
LoadingInline · Pagination · PaginationItem · ProgressBar · Step · Stepper`
**Method**: four independent auditors re-pulled each Figma node, instructed to
treat the CSS header comments as unverified claims. Every consequential finding
was then re-verified directly before entering this report.
**Originally report-only.** The four defects in §1 were subsequently fixed on
instruction; everything in §2-§4 remains open.

---

## Why these eleven

`docs/figma-alignment-audit.md` covered 23 components. These eleven shipped
afterwards and had only ever been checked by the person who wrote them, which is
the weakest form of review.

**The headline is not any single defect — it is that none of this was visible to
the harness.** All 823 visual checks and 105 static checks passed at the time,
and every finding below survived them untouched. The suite is now 826.

---

## 1. Real defects

> **All four were fixed on 2026-08-25.** Struck through below with what changed;
> the surrounding analysis is left intact as the record of why.


**~~PaginationItem — the label colour never changes on hover or pressed.~~ FIXED.**
Figma draws the label `#40404d` on hover and `#2e2e38` on pressed, against
`Content/Secondary #5b5b68` at rest. `pagination-item.css:109-119` changes only
`background-color`. The values were sampled during the build and not acted on;
the header describes the un-tokenised states as "fills and strokes" and never
mentions the label, which is a third un-tokenised axis. Neither greys near any
token, so this needs either the raw values or an explicit decision.

**~~LoadingIndicator — the XS ring is 33% thicker than Figma draws.~~ FIXED.**
Ships 2px where Figma renders 1.5px, on the default size *and* the size embedded
in all four LoadingInline variants. See §2 for why the stated justification was
false. Both integer options are equidistant from the authored value (2 is 0.5
thick, 1 is 0.5 thin) because Chrome floors fractional `border-width` — verified
at 1x and 2x. **A border cannot express this. A conic-gradient with a mask, or an
inline SVG, renders 1.5 / 2 / 2.52 / 3.04 exactly** and is the only approach that
actually matches.

**~~Divider force-uppercases its label.~~ FIXED.**
`divider.css:90` applies `type-label-s-bold`, whose utility adds
`text-transform: uppercase`. Figma binds no text style to this component at all
(verified: `get_variable_defs(880:31253)` returns only Stroke/Line,
Stroke/Divider, Content/Tertiary, Spacing/16) and types the caps into the string
— the node is literally named "BENEFICIAL OWNERS". A consumer passing
"Beneficial owners" gets it shouted back.

> This is the **same question deliberately left open on Chip**, where casing was
> not imposed precisely because typed caps and a transform cannot be told apart.
> The two components answer it differently. That inconsistency is the finding.

**~~FilterSegment — the documented container usage gets a pointer cursor and a
focus ring.~~ RESOLVED THE OTHER WAY.** The usage block wraps an IconButton in
`<div class="filter-segment filter-segment-last">`, but the base applies
`cursor-pointer` (`:88`) and `:focus-visible { focus-ring }` (`:127`)
unconditionally — while the header calls that same segment "a container rather
than a control". The ring is inert on a `div`; the cursor is not.

### What changed

- **PaginationItem** now steps the label with the fill: `Secondary/Strong` on
  hover, `Content/Primary` on pressed. Both are approximations of un-tokenised
  greys (Δ 23.2 and 45.3) and are documented as such, matching how the fills are
  handled. Two assertions added.
- **LoadingIndicator** is now a **masked conic-gradient rather than a border**,
  which carries the authored `1.5 / 2 / 2.52 / 3.04` exactly — verified through
  computed style. A border could not: Chrome floors fractional `border-width`.
  The spec now asserts the ring values themselves and that no border exists.
- **Divider** uses `text-label-s-bold` instead of the `type-label-*` form, so
  casing is the caller's. Chip and Divider now answer that question the same way.
- **FilterSegment** went the opposite way to the recommendation, by decision:
  every segment is a **control**, not a container. The value segments are now
  `<button>`, so the whole row is keyboard-reachable — verified, tab order runs
  Product → Is any of → Deposit Account → ×. The icon segment stays a non-button
  wrapper because nesting a button inside a button is invalid HTML. Whether the
  icon should take over the segment's action is deliberately left open.

**One harness improvement fell out of this**: `visual-specs` gained a
`contains: true` comparison, for tokens embedded in a larger serialisation — a
gradient stop, a shadow colour, a font stack. Without it the conic-gradient's
track and arc colours could not have been asserted at all.

---

## 2. False claims in my own documentation

Nine. Listed because the headers are the only durable record of *why* each
decision was made, so a wrong one is worse than no comment.

| # | Component | Claim | Reality |
| --- | --- | --- | --- |
| 1 | LoadingIndicator | "Figma's own PNG export renders 2px and 3px — traced pixel by pixel" | It renders **1.56 / 2.00 / 2.50 / 3.11**. My trace used a binary is-it-white test, so the 56%-coverage pixel at XS counted as a full one. |
| 2 | LoadingIndicator | authored widths are "2.5 and 3, Figma's arc math" | Authored are **2.52 / 3.04** — the actual path annulus. |
| 3 | LoadingIndicator | "masked stroke-widths are exactly double the ring" | 5 ≠ 5.04, 6 ≠ 6.08. In a mask-inside technique the stroke only needs to be ≥ the annulus, so it is not evidence of thickness at all. |
| 4 | PaginationItem | borders are "roughly Stroke/Border at 0.24 and 0.33 alpha" | Figma declares them literally at **0.2 / 0.25**, over the state fill. Compositing those gives Δ **0.0** against the render. I composited over white. |
| 5 | PaginationItem | default-pressed is "Δ 5.7" from Action/Selected | **Δ 10.3–11.7.** My script hardcoded Action/Selected at 0.09; its real alpha is 0.078. |
| 6 | Divider | the label is "byte-for-byte `Label S Sans - Bold`" | The *values* match; **no style is bound**. Provenance overstated. |
| 7 | Pagination | `.pagination-summary` "maps cleanly" to `--text-data-xs` | Figma is Auto leading, the token carries 16.5px — the very mismatch the next bullet discloses for `.pagination-status`. |
| 8 | Pagination | 1208px is "the artboard's content width" | Both variants are authored at a literal fixed `w-[1208px]` inside a 1321 frame. `w-full` is still right; the reason given is not. |
| 9 | Stepper | the instances "kept the component's default label instead of being overridden" | The number is **not an exposed property** — there is nothing to override. Observation right, cause wrong. |

---

## 3. Assumptions worth surfacing

- **PaginationItem active-pressed** binds `primary-pressed` (Δ **36.6** from
  Figma's `#143d75`) where `primary-dark` is Δ **10.6**. The header justifies the
  *hover* divergence and is silent on this one.
- **LoadingIndicator dots**: `#5b5b68` is ambiguous — `--color-secondary` and
  `--color-content-secondary` are the *same value*, so the spec's "Secondary/Main
  not Primary" assertion cannot distinguish them. LoadingInline's sibling label
  at the identical hex is bound to Content/Secondary.
- **ProgressBar** drops Figma's `overflow-clip` on both rows and
  `whitespace-nowrap` on every text child: a long title wraps and pushes the
  value; a long legend overflows rather than clipping.
- **ProgressBar** stores letter-spacing as `0.5px` against the documented rule
  that Figma authors it only as a percentage.
- **Stepper** root is `w-full` where Figma fixes 400px — undocumented, unlike the
  fill and radius in the same paragraph.
- **Step** documents `aria-current="step"` but nothing selects it; styling is
  class-only, where Tabs, Pill, MenuItem and DropdownField all drive from ARIA.
- **Link** rest declarations rely on source order (`.link` sets `no-underline`,
  `.link-quiet` overrides at equal specificity) — in a file whose own comment
  disavows exactly that pattern for its state rules.
- **Link** pressed states are unassertable: the harness supports only `hover:`.
  `--color-critical-content`, the token added *for this component*, appears in
  no spec and is protected by nothing.
- **Breadcrumbs** separators have no `aria-hidden`, so a screen reader announces
  "greater than" / "slash" / "middot" between every crumb.
- **Breadcrumbs** has no `:focus-visible` at all, though `.breadcrumb` is
  documented as an `<a href>`.

---

## 4. For the designer

1. **Icon stroke weight does not scale.** Figma's exports are `stroke-width="2"`
   at every icon size (home at 14, check at 12); the sprite's symbols are
   24-viewBox, giving ~1.17px at 14 and 1.0px at 12 — roughly half. Should
   strokes scale on resize?
2. **Stepper's step number is not an overridable property**, which is why all
   four instances read "1".
3. **FilterSegment binds `Radius/XS` (4px)** somewhere in the variant set that
   does not appear in instances — most plausibly the hidden Ring overlay. The
   segment box itself measures 6px. What carries the 4?
4. **Breadcrumbs models no hover or focus state** on its links.
5. **Chip vs Divider casing** — the same typed-caps-or-transform question,
   answered two different ways. One answer, please.

---

## 5. One auditor claim rejected

An auditor reported that Breadcrumbs' separator sizes, separator colour, dot
weight and home-icon colour are asserted nowhere. **They are** — verified, 20
assertions in that block including `separator is Content/Tertiary`, `base
separator is 13px`, `chevron separator is 12px`, `dot separator is bold` and
`home icon is Content/Tertiary`. Not carried into this report.

---

## 6. What checked out

Worth stating plainly, since the above is all negatives. Independent extraction
confirmed the non-obvious calls:

- **`Critical/Content` is a real Collection 1 variable at `#b73943`** — the token
  added to the pipeline for Link was correct.
- **ProgressBar's headline finding holds**: `Has Legend` swaps only the colour
  scheme while both variants render a `Bottom Content`-gated legend; the
  Approved/Content-vs-Approved/Main split; the `false` variant's 92% / 72% / 68%
  three-way contradiction; the 360px track in a 400px frame.
- **Step's inverted label ramp** — completed `Content/Tertiary` Medium against
  upcoming `Neutral/Strong` Regular — and its two distinct border tokens.
- **Stepper's 9px connector offset** falling out of `items-center` over a 42px
  step, and the `flex-1` connectors against 38/38/41/51 steps.
- **Breadcrumbs' literal `>`**, the two different sample paths, the 13/12/13 +
  Regular/Regular/Bold separator split, and the `Content/Tertiary` home icon.
- **LoadingInline's 12px indicator at every size.**
- **FilterSegment's shared edges** (middle and last left edges measure
  `#fafafb`, first measures the hairline) and fill *replacement* on hover.
- **Divider's two stroke tokens** and three-way structural incompatibility.
- **Link's** underline-as-a-state-only-on-strong, all five ramps and their
  differing lengths, and `inline` as a paragraph.

---

## Not addressed here

This round covered Figma accuracy for eleven components only. Still outstanding
from the handoff plan: the packed-install proof, the accessibility pass, and the
consolidated two-audience report. Independent of all of it, three findings from
the earlier exploration remain and are invisible to the harness:

- `dist/` is gitignored with no `prepublishOnly` — publishing from a clean clone
  ships a tarball with no CSS.
- The prebuilt entry silently clobbers a consumer's `@theme`, including
  `--spacing` and `--font-sans`.
- The `prefers-reduced-motion` block in `loading-indicator.css` sits outside its
  `@layer components`, so it beats consumer utilities — the only place the
  overlay contract breaks.
