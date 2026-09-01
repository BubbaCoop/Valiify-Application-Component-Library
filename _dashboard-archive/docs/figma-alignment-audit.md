# Figma alignment audit — what must change for 100% accuracy

**Date**: 2026-08-24
**Scope**: all 23 shipped components except Card, which is excluded as
pre-existing proof-of-concept scaffolding.
**Method**: seven independent auditors re-extracted each component from Figma,
instructed to treat the CSS header comments as unverified claims. Key findings
were then re-verified directly — by measuring in a browser or by inspecting the
Figma render pixel by pixel — rather than relayed.

Findings are split three ways, because the question "is it accurate?" has three
different answers:

- **FIX** — the code does not match Figma. Change the code.
- **ASSUMPTION** — the code committed to a value or behaviour Figma does not
  specify. Not wrong, but not verified either. Someone chose.
- **DESIGNER** — Figma itself is incomplete, contradictory, or ambiguous.
  Cannot be resolved in code.

---

## Corrections made during verification

Two auditor claims did not survive re-checking, and are recorded here rather
than in the lists below:

- **Tabs subtitle does not overflow.** An auditor reported the subtitle
  overflowing its pinned 32px box. Measured: `scrollHeight === clientHeight` on
  both tabs, no overflow. The structural finding stands (Figma draws the
  subtitle as a row sibling; ours stacks it), but the overflow does not.
- **Chip `BG=no` has no hairline.** An auditor described it as "transparent
  fill with a 0.5px hairline". The Figma render shows bare coloured text with a
  dot, no fill and no visible border — and the badge loses its circle entirely.

Conversely, one auditor finding was verified and **acted on immediately**: three
FieldVerification defects, all introduced earlier in this same session. The node
metadata settled them — `State=none` and `pending` are `<instance>` nodes, not
drawn shapes. They are listed under FieldVerification below as FIXED.

---

## Cross-cutting — affects many components at once

### 1. Hover erases the selected state — 7 components · FIX

Measured in a browser, not inferred. Hover rules are written
`.x:hover:not(:disabled):not([aria-disabled="true"])` — specificity (0,4,0).
Active rules are bare attribute selectors at (0,2,0). Hover wins everywhere.

| component | selected | while hovered |
| --- | --- | --- |
| **Tag** | solid `Primary/Main`, white label | near-transparent grey, **label stays white → invisible** |
| TextButton `cell` | `Primary/Soft` + `Primary/Main` | grey fill + near-black, weight stays 500 |
| TextButton `text` | `Primary/Main` | near-black, weight stays 500 |
| Pill | `Primary/Soft` | `Action/Focused` |
| Tabs `chip` / `segment` | selected fill | reverts to hover fill |
| SegmentSelector | white fill | `Action/Subtle` |
| Button `outline` | `Action/Hover` | `Action/Subtle` |
| RadioSelect | `Primary/Main` ring | `Secondary/Main` ring, dot stays primary |

Figma draws no `Hover + Active` variant for any of them, so the intended
behaviour is a **designer question** — but partial reversion is certainly not
it. Fix shape: add `:not([aria-pressed="true"]):not([aria-selected="true"])` to
the hover rules once the rule is confirmed.

### 2. Derived heights overshoot their Figma frame · FIX

Figma draws strokes *inside* the frame; CSS border-box adds them on top.

| component | Figma | rendered | delta |
| --- | --- | --- | --- |
| Tooltip | 140 | 144.5 | +4.5 |
| Modal | 317 | 320.5 | +3.5 |
| Toast Full | 97 | 98.5 | +1.5 |

Tooltip's extra comes from its two `Micro L` parts, whose Auto line height
Figma resolves to 13px and Chrome to 14px. Counter-argument for Modal and Toast
Full: their height genuinely varies with content, so pinning is wrong — the
honest fix there is to document the 2px border offset instead.

### 3. Both new shadow tokens are probably wrong · FIX

`get_design_context` returns local effects in the CSS **filter** form
(`drop-shadow()`), whose blur is half the box-shadow blur and which silently
drops spread. Proof from Toast's own two shadows: the *named* General Drop
Shadow is authoritatively `blur 34, spread -12`, yet the same codegen emitted
`drop-shadow(0px 12px 17px …)`.

| token | recorded | probably | 
| --- | --- | --- |
| `--shadow-modal` | `0 12px 16px 0` | `0 12px 32px ?` |
| `--shadow-toast` | `0 4px 6px 0` | `0 4px 12px ?` |

Spread is unrecoverable from the filter form. Needs reading in Dev Mode.
`--shadow-panel` and `--shadow-knob` come from named styles and are unaffected.

### 4. Figma's `Ring` boolean is inconsistently mapped · FIX

Nine components map it to `.with-ring`. Four do not:

- **MenuItem**, **DropdownMenu**, **Switch**, **RadioSelect** bind it to
  `:focus-visible` only. DropdownMenu's is dead in practice — a `div` panel is
  not focusable.
- **IconButton** uses a differently-named `.icon-ring` **and draws it outset**,
  where Figma's Ring frame is exactly the button's bounds. This is the same
  defect the harness already caught and fixed on Chip.
- **IconButton has no `:focus-visible` rule at all**, alone among interactive
  components.

### 5. Three components bypass the type tokens · ASSUMPTION

Input, Textarea and DropdownField hand-roll their label and error type as
`text-[10px] font-semibold uppercase tracking-[1px]` etc. The values are
correct, but they are byte-for-byte `--text-label-s-bold` and `--text-micro-l`.
A token value change will not reach them. CLAUDE.md explicitly directs
`type-label-*` here.

---

## By component

### Button
- ~~**FIX** — `.btn-empty` is missing two of its four Figma states~~ —
  **fixed 2026-08-24.** Figma gives outline and empty an identical interaction
  ramp, so it now lives on the base `.btn` and both inherit it.
- ~~**FIX** — a bare `.btn` is inert~~ — **fixed 2026-08-24**, same change. The
  base took outline's rest appearance while the interaction rules sat inside
  `.btn-outline`, so `<button class="btn">` looked like an outline button and
  responded to nothing. `.btn-outline` is now an explicit alias.
- **ASSUMPTION** (new) — the `md` size default is ungrounded. Outline as the
  base Display is defensible (the set's rest default), but the set's top-left
  variant is `sm`, and nothing confirms medium. `.btn` has always been md, so it
  was left alone rather than changed on weak evidence.
- **FIX** — disabled binds two greys in Figma (`Content/Tertiary` **and**
  `Secondary/Main`, the latter presumably the icon); the code paints everything
  `content-tertiary`.
- **ASSUMPTION** — `.btn-primary:active` is invented. Figma ships primary with
  four states only; there is no active variant.
- **DESIGNER** — every variant carries a hidden 13×13 `Status` slot that is
  unimplemented and undocumented. Live or dead?
- ~~Coverage: no hover / active / selected assertion exists~~ — **closed
  2026-08-24.** 15 assertions added across the interaction matrix, including
  that outline and empty agree, that a bare `.btn` is not inert, and that the
  filled variants keep their label colour. That last one caught a regression
  introduced *by* this fix: the base `:active` sets `Primary/Main` text, so a
  pressed primary briefly rendered blue-on-blue.

### IconButton
- **FIX** — no `:focus-visible` rule at all.
- **FIX** — `.icon-ring` is outset; Figma's is inset at the button's bounds.
  Also off-convention in name (`.icon-ring` vs `.with-ring` everywhere else).

### Icon
- **ASSUMPTION** — `.icon-ring` has no Figma source; Icon Container has a
  single Size property and no ring axis. It is also a *border*, so it eats the
  glyph box: `.icon-size-14.icon-ring` leaves a 10px glyph.
- **ASSUMPTION** — hardcoded `fill: none; stroke-width: 2` on every `.icon`
  blanks any filled sprite symbol, including the documented `custom-*` glyphs.
- Coverage: 6 of 11 sizes asserted; 13 and 15 are unchecked despite being the
  sizes Button and MenuItem are told to use.

### Input
- **FIX** — header and spec say "96 variants"; Figma draws **84**. The missing
  12 are the whole `disabled × error` block. The spec file contradicts itself.
- **ASSUMPTION** — disabled+error resets the border to `stroke-divider`,
  killing the error state. Textarea and DropdownField both keep the crimson
  hairline, so the three field types behave differently.
- **ASSUMPTION** — "8px gap, every size" is unverifiable: the icon slots are
  hidden in every variant. DropdownField, the parallel component, uses 6px at
  sm.
- **FIX** (shared) — disabled does not change the value text colour; Figma uses
  `Content/Secondary`.

### Textarea
- **FIX** — disabled wipes the error hairline; Figma keeps `Critical/Main` on
  the disabled+error variant.
- **FIX** — `.textarea-bg-neutral` is asserted as a Figma fact in both the CSS
  and the spec. Figma has **no BG property** on this component and
  `Surface/Card` appears nowhere in its variable defs. DropdownField's
  equivalent is honestly caveated; this one is not.
- **ASSUMPTION** — the header says Figma does not specify a height. It does:
  all 12 variants are fixed at **50px**. The library's decision to leave height
  to the consumer is defensible, but it is a departure, not an absence.

### DropdownField
- **FIX** — sm vertical padding is `5px`; Figma is **5.5px**, identical to
  Input sm which already gets it right. Masked by the pinned height, so no spec
  catches it.
- **DESIGNER** — the Error Message frame is unconfigured in Figma (100×100 at
  0,0 in all three variants). The shipped 6px top padding is copied from Input.
- **DESIGNER** — Figma models error only on `Filled=yes`. There is no
  empty-and-invalid variant, which is the common case.

### MenuItem
- **FIX** — the trailing icon is `Primary/Main` at rest in **every** Figma
  variant (verified on the variant-set render). Ours inherits the row colour and
  renders near-black; blue only appears via `aria-selected`, which also wrongly
  tints the title.
- **FIX** — the header says sm uses 12px icons. Figma's sm *leading* icon is
  15px; only the trailing one is 12px. Same error in CLAUDE.md.
- **ASSUMPTION** — `:disabled` is invented and uses `opacity-50`, the exact
  blanket-opacity treatment the harness rejected on IconButton.
- **ASSUMPTION** — Figma has no Selected/Active/Disabled axis at all, and no
  `Hover=yes` for `Combined`. Layering hover onto a selected row is composition,
  not spec.
- **DESIGNER** — `Radius/XS` appears in the component's variable set but in
  none of its four resolved variants; likely bound to a hidden slot.

### DropdownMenu
- **FIX** (doc) — the header says "positioning is the consumer's job", then the
  file ships `.dropdown` / `.dropdown-panel` positioning helpers.
- **ASSUMPTION** — `items-start` where Figma stretches rows to the panel width.
  Works only because `.menu-item` carries `w-full`; any other child hugs.
- Coverage: 200px min-width, the 0.5px border and `shadow-panel` are all
  unasserted.

### Chip / badge / dot
- ~~**FIX** — the entire `BG` axis is unimplemented~~ — **fixed 2026-08-24**.
  `.chip-bg-no` / `.badge-bg-no` added, with 12 spec assertions covering both
  treatments. `BG=yes` confirmed as the Figma default (the three lowest-id
  variants, one per Type, are all `BG=yes`), so it stays classless and no
  existing markup changed.
- **DESIGNER** (new) — **BG is a no-op for `dot`.** Figma draws all 18 dot
  variants across the axis, but sampling `BG=yes` against `BG=no` returns
  byte-identical pixels, because a dot *is* its fill. Nine variants are
  redundant. No `.dot-bg-no` was added.
- **DESIGNER** — labels render UPPERCASE in Figma (`REVIEW`, `FLAGGED`).
  Nothing distinguishes a `text-transform` on the component from the casing of
  the sample strings, and the API cannot tell them apart. **Still open and
  deliberately unresolved**: casing was left untouched while fixing the BG axis
  — no `uppercase`, and no `text-transform: none` assertion either, since
  pinning one would bake in a guess. Pill answered the same question and now
  pins `text-transform: none`; this needs the same answer.
- **ASSUMPTION** — the ring's "2px Primary/Main" is house convention; the Ring
  frame binds no variables. Its inset-at-zero geometry *is* verified.

### Tag
- **FIX** — hover erases the selected state, worst case in the library (see
  cross-cutting §1).
- Everything else verified exact, including the two oddities the header
  reproduces on purpose: md active bumps to weight 500 while sm stays 400, and
  the gap really is larger on the smaller size.

### Pill
- **ASSUMPTION** — `:disabled` is invented and uses `opacity-50`. Figma has six
  variants and no disabled.
- The off-by-one token naming is **confirmed real**: rest binds the token named
  `Action/Hover`. Do not "fix" it.

### Tabs
- **FIX** — `.tab-subtitle` is `display: block` and stacks below the label.
  Figma draws it as a **row sibling at the frame's right edge**. (It does not
  overflow — see Corrections.)
- **ASSUMPTION** — the subtitle's colour and type are unverifiable: the layer is
  hidden in all 12 variants, so `get_variable_defs` reports nothing for it. The
  code asserts `Primary/Main` + `Micro S - Bold` as fact, and the spec pins it.
- **ASSUMPTION** — the underline's 2px active rule is a raw stroke, not a
  variable binding.
- **ASSUMPTION** — sm's rest gap is 10px where lg's is 8px. Implemented
  correctly but asserted nowhere and absent from the docs.

### SegmentSelector
- **FIX** (doc) — the "160px example with two 79px segments" cited in the CSS
  and spec does not exist. The real node is 403×28 with **six** children of
  unequal width. The conclusion (children hug) is right and better evidenced by
  the real node.
- **DESIGNER** — the description caps usage at 2–5 options; the only variant
  drawn contains six.

### Avatar
- **ASSUMPTION** — bare `.avatar` is md; Figma's default variant is **xs**.
  Fine if deliberate, but it currently reads as extracted.
- Coverage: `font-weight` is unasserted, so the trap the header warns about
  (xs/sm genuinely 600, md/lg 500) is unverified.
- All three headline claims verified true, including that no image layer exists
  in any variant despite the description saying "user profile image".

### Switch
- **FIX** — Ring boolean not exposed as `.with-ring` (see cross-cutting §4).
- Coverage: 4 of 6 variants asserted. **No knob assertion at all** — not its
  14px size, not `Surface/Paper`, not `--shadow-knob`, not the 14px travel,
  which is the one thing the component does.
- Geometry and all six state colours verified exact.

### RadioSelect
- **FIX** — the focus ring is on the 15px circle. Figma's Ring layer is
  `inset-0` on the **whole row**, circle plus label.
- **FIX** — hover erases the checked ring (cross-cutting §1).
- **ASSUMPTION** — the white circle fill is invented. Figma draws **no
  background** on the circle in any of the four variants, and `Surface/Paper` is
  absent from the component's variable set. Renders opaque white where Figma is
  transparent — visible on `surface-frame`.
- **ASSUMPTION** — `disabled + checked` is invented; Figma draws no such
  variant, and the 8% dot it produces is near-invisible.
- Coverage: hover untested; the 8px inner dot — the component's defining
  element — has no assertion.

### Tooltip
- **FIX** — `.tooltip` sets no base `color`, so any unclassed text or icon
  inside inherits the page's dark `Content/Primary` on the dark fill and is
  invisible. `.toast-simple` gets this right.
- **FIX** (doc) — "the only dark surface in the library" went stale when Toast
  Simple shipped.
- **FIX** — height overshoot (cross-cutting §2).

### Modal
- **FIX** — the footer Cancel override introduces a hover state Figma does not
  draw: `.modal-footer .btn-empty:not(:hover)` makes the label jump
  `Content/Secondary` → `Content/Primary`.
- **ASSUMPTION** — `.modal-icon` bakes the neutral treatment into the base
  class, so a bare `.modal` silently renders neutral. Figma's `Action` axis has
  no default.
- **DESIGNER** — the positive variant's confirm button carries a stale 0.5px
  `Critical/Main` border, left over from duplicating the destructive variant.
  Not reproduced in code.
- **FIX** (doc) — the header says two values are untokenised; it is three.

### TextButton
- **FIX** — hover and press erase the selected state, leaving a broken
  half-state where the weight stays 500 (cross-cutting §1).
- **FIX** — `disabled + selected` keeps the `Primary/Soft` fill under
  `Content/Tertiary` text.
- **ASSUMPTION** — `border-none` emits `--tw-border-style: none`, the exact
  declaration documented as the cause of the Tabs underline bug. Inert here, but
  redundant.
- Coverage: `.with-ring` and `:focus-visible` asserted nowhere.

### Toast
- **FIX** — shadow blur (cross-cutting §3) and Full's height (§2).
- **DESIGNER** — Simple exists only for `Type=info`, draws a success checkmark
  despite being typed info, and its component description is Tooltip's copied
  verbatim.
- **DESIGNER** — Full's 8px radius is raw in Figma, not bound to `Radius/MD`.
- Coverage: Full's shadow is asserted only as `≠ none`, which is why §3 was
  invisible. Simple's shadow and border are asserted not at all.

### Alert
- **DESIGNER** — neutral's icon is `Neutral/Content` while its rail is
  `Neutral/Main`; every other type uses one colour for both. Verified by pixel
  sampling.
- **DESIGNER** — the dismiss is a stray 10×16 raw vector, not an Icon Button
  instance as in Toast and Modal. Implemented as `icon-button-md`.
- **DESIGNER** — `warning` uses an info glyph and `info` uses a refresh glyph.
- **ASSUMPTION** — the 3px rail is a left border where Figma models a clipped
  rectangle child. Traced down the corner arc: one row of antialiasing
  difference, identical either side.
- **ASSUMPTION** — width is not pinned. The original justification ("828 is a
  1007px artboard minus 36px margins") is arithmetically wrong — the right
  margin is 143px, and all five variants are authored at exactly 828. Figma
  *does* specify a width; `w-full` is a house decision about banner semantics.
- **DESIGNER** — the dismiss frame is internally broken: a 10×16 box containing
  two 10×10 vectors at (3,3), which overflow it on both axes.

### SectionMarker
- **DESIGNER** — `Status=na` draws nothing at all. Intentional placeholder, or
  an unfinished variant?

### FieldVerification

Three findings here were **fixed during this audit** rather than only reported,
because they were introduced an hour earlier in the same session:

- **FIXED** — `State=none` was built as a bespoke 10×1px rule, reasoning from
  its `Spacing/10` + `Spacing/1` bindings. Wrong: `Spacing/10` appears in
  pending and mismatch too, so it was never none-specific. The node metadata
  shows an `<instance>`, and a pixel trace gives 9.0 × 1px — a 14px Lucide
  `#minus`. Now a Section Marker with a minus glyph.
- **FIXED** — pending was a bare 14px icon. Figma nests a 16×16 Section Marker
  instance at y=1, with the label at x=23. The bare icon put the label at 21,
  misaligning pending and none against verified in a column.
- **FIXED** — the expanded state top-aligned its glyph at y=0; Figma centres a
  15px glyph in a 15×18 frame, so it sat 1.5px high.
- **DESIGNER** — the mismatch action row looks like a Text Button but is plain
  text plus an arrow, coloured `Critical/Main` where every Text Button type is
  Content or Primary.
- **ASSUMPTION** — the 137px details column is **authored in Figma**, not a
  sample string as the header originally claimed; that is why its mono line
  wraps to two rows. Left unpinned deliberately, now documented as a departure.
