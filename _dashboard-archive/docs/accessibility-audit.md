# Accessibility audit — Section C of the handoff plan

**Date**: 2026-08-25
**Scope**: all 36 components, 236 Storybook stories
**Method**: axe-core 4.13.0 driven programmatically over every story in headless
Chromium at 1280×900, plus a source audit of the seven keyboard/focus gaps that
axe structurally cannot see.
**This is diagnosis only.** Nothing was changed. Every finding carries a file
path or a measured value.

Rules disabled for the run, because they fault the Storybook iframe rather than
the component: `region`, `page-has-heading-one`, `landmark-one-main`,
`html-has-lang`, `document-title`.

---

## 1. Automated pass — results

**236 stories scanned, 0 scan errors, 159 violation groups, ~376 failing nodes.**

| Rule | Impact | Groups | Nodes | Verdict |
| --- | --- | --- | --- | --- |
| `color-contrast` | serious | 120 | 314 | **~119 library**, ~195 story-only |
| `aria-required-parent` | critical | 13 | 21 | **library** (documented markup) |
| `label` | critical | 10 | 20 | **library** (documented markup) |
| `aria-allowed-attr` | critical | 9 | 13 | **library** (documented markup) |
| `landmark-unique` | moderate | 4 | 4 | story-only |
| `empty-table-header` | minor | 2 | 3 | story-only |
| `aria-input-field-name` | serious | 1 | 1 | story-only |

**Four components are clean**: Card, Icon, IconButton, RadioSelect.

### Defects per component

| Component | Groups | Stories hit | Rules |
| --- | --- | --- | --- |
| MenuItem | 20 | 12/12 | aria-allowed-attr, aria-required-parent, color-contrast |
| DropdownField | 12 | 11/12 | aria-input-field-name, color-contrast |
| Chip | 10 | 10/16 | color-contrast |
| Input | 10 | 9/13 | color-contrast, label |
| Switch | 8 | 7/7 | color-contrast, label |
| Textarea | 8 | 7/10 | color-contrast, label |
| DropdownMenu | 6 | 5/8 | aria-allowed-attr, color-contrast |
| Breadcrumbs | 6 | 4/6 | color-contrast, landmark-unique |
| SegmentSelector · Tabs · Icons · Toast · Stepper | 5 each | — | color-contrast |
| Avatar · TextButton · FieldVerification · Pagination · FilterSegment | 4 each | — | mixed |
| Button · Tag · PaginationItem · Link · Divider · Alert · LoadingIndicator | 3 each | — | mixed |
| Pill · Modal · Tooltip · LoadingInline · ProgressBar · Step | 2 each | — | color-contrast |
| SectionMarker | 1 | 1/4 | color-contrast |

### 1a. Contrast — two tokens cause almost all of it — **DESIGNER**

The 314 contrast nodes are not 314 problems. Roughly 195 are Storybook
scaffolding (`.demo-note` ×59, `.demo-label` ×53, `.demo-k` ×19, `.demo-n` ×9,
plus `.icon-name` ×13 and `.size-label` ×4, which are **story-local classes in
`Icons.stories.ts`, not library classes** — verified absent from `src/`).

The library share reduces to two token pairings:

| Token | On Paper `#ffffff` | On Card `#fafafb` | On Neutral `#f1f1f4` | On Frame `#f0f3f7` |
| --- | --- | --- | --- | --- |
| `Content/Tertiary` `#727280` | 4.74 ✅ | 4.54 ✅ | **4.20 ❌** | **4.26 ❌** |
| `Content/Faint` `#c4c4ce` | **1.73 ❌** | **1.66 ❌** | **1.54 ❌** | **1.55 ❌** |
| `Content/Secondary` `#5b5b68` | 6.69 ✅ | 6.41 ✅ | 5.93 ✅ | 6.01 ✅ |

- **`Content/Tertiary` is marginal and surface-dependent.** It clears AA on the
  two light surfaces and fails on the two grey ones — 4.20 and 4.26 against a
  4.5 requirement. Every failing instance sits on the app canvas: `.tab` (×16),
  `.step-label` (×11), `.field-verification-label` (×7), `.menu-item-subtitle`
  (×4), `.divider-label` (×4), and the field labels `.input-label > span` (×16),
  `.textarea-label > span` (×9), `.dropdown-field-label > span` (×5).
- **`Content/Faint` fails on every surface in the stack**, worst 1.54:1. It is
  the placeholder and timestamp colour: `.dropdown-field-placeholder` (×12,
  measured 1.73:1) and `.toast-timestamp` (×9, 1.73:1).

Two further one-off pairings:

- **`.avatar` disabled** — `#ffffff` on `#9cb1cc` = **2.19:1** at 8px. The
  disabled avatar deliberately keeps `Content/Contrast` initials while the fill
  dims (documented in CLAUDE.md as intentional); the result is unreadable.
- **`.chip` soft fills** — warning `#c9881f` on `#ece9e4` = **2.46:1**, critical
  `#c5303c` on `#eee3e8` = **4.34:1**, success `#157d61` on `#ddebec` = 4.14:1,
  all at 8px.

This is a **DESIGNER** item, not a code defect: the values are faithfully
extracted, and no amount of CSS fixes a token pair that does not meet AA. The
decision is whether `Content/Tertiary` is permitted on grey surfaces, and
whether `Content/Faint` is permitted for text at all.

#### CORRECTION — 2026-08-25: scope narrowed, conclusion unchanged

Reconciled against two claims from the designer — that `Content/Tertiary` is
only used on paper-white, and that `Content/Faint` is only used for content
excluded from the accessibility tree. Each was checked against what the
components actually render. **Both tokens still fail, but on fewer elements than
stated above.** Appended rather than rewritten, matching the P5 and P6 pattern in
`handoff-audit.md`; the original text stands as the record.

**1. The grey canvas is ours, which settles the surface question.**
`src/base/index.css` sets `html { background-color: var(--color-surface-frame); }`
— `#f0f3f7`. That background ships in both `dist` and `/source`, so it is the
library's own default, not a Storybook artifact. Any component that paints no
background of its own renders on grey unless the consuming app puts something
white behind it. CLAUDE.md already records this deliberately for Stepper: its
white root fill is "not reproduced" because "the white would be wrong on any
surface that is not already white".

**2. `.menu-item-subtitle` should not have been on the failing list.** Traced in
the rendered DOM, its nearest painting ancestor is `div.dropdown-menu`, which
fills `Surface/Paper` — so it renders at **4.74:1 and PASSES**. axe measured it
at 4.26 only because the MenuItem stories render rows bare, outside a panel.
That is a story artifact, and the designer is right about this element.

The other six trace to `html` with no painting ancestor, and keep the finding:
`.tab`, `.step-label`, `.field-verification-label`, `.divider-label`,
`.input-label > span`, `.textarea-label > span` — all `#727280` on `#f0f3f7` =
**4.26:1**. The field labels are the clearest case: they sit above the white
input box, outside it, so the field's white never covers them.

**3. `Content/Faint` is not excluded from the accessibility tree — but only
three of its seven usages are defects.** No element carrying Faint has
`aria-hidden`, `role="presentation"` or `role="none"`; checked both the rendered
ancestor chains and all 17 occurrences across `CLAUDE.md`, `stories/` and `src/`
— zero. `.dropdown-field-placeholder` renders the live string "Select";
`.toast-timestamp` renders "just now". Both are read.

| Usage | Ratio | Verdict |
| --- | --- | --- |
| `dropdown-field.css:101` `.dropdown-field-placeholder` on white | 1.73 | **FAIL** — live text |
| `textarea.css:100` `::placeholder` on white | 1.73 | **FAIL** — live text |
| `toast.css:135` `.toast-timestamp` on white | 1.73 | **FAIL** — live text |
| `tooltip.css:53` `.tooltip-title` / `-subtext` on `#16161a` | **10.43** | **PASS** |
| `filter-segment.css:144` `:disabled` | 1.66 | **EXEMPT** |
| `link.css:153` `[aria-disabled]` | 1.73 | **EXEMPT** |
| `pagination-item.css:188` `:disabled` | 1.73 | **EXEMPT** |

The three exemptions are real but come from a different mechanism than the
designer named: **WCAG 1.4.3 excludes inactive controls** from the contrast
requirement. That is not the same as being removed from the accessibility tree —
a disabled control is still announced, it simply is not held to 4.5:1. The
tooltip usage passes comfortably on the dark surface.

So the original "fails on every surface in the stack" was true of the *token
pairing* and overstated the *defect*, which is three live-text usages.

**Resolved status.** Both findings stand; neither designer claim clears its
token. Corrected scope:

- `Content/Tertiary` — fails on **six** elements on `#f0f3f7` at 4.26:1
  (`.menu-item-subtitle` removed).
- `Content/Faint` — fails on **three** live-text usages at 1.73:1 (placeholders
  in DropdownField and Textarea, and Toast's timestamp).

Still DESIGNER-blocked and still urgent: these are high-traffic label and
placeholder colours, and no CSS resolves a token pair below AA.

### 1b. `aria-allowed-attr` — `aria-selected` on a plain button — **BUG**

13 nodes across Button, MenuItem and DropdownMenu:

```html
<button class="btn btn-outline" aria-selected="true">Selected</button>
<button class="menu-item" role="menuitem" aria-selected="true">
```

`aria-selected` is not allowed on `button`, nor on `role="menuitem"` — it
belongs to `option`, `tab`, `row`, `gridcell` and `treeitem`. This is a library
defect rather than a story slip, because **CLAUDE.md documents this exact
markup** for both components, and `button.css` / `menu-item.css` style
`[aria-selected="true"]` as a supported state. Correct attributes would be
`aria-pressed` for a toggle button and `aria-checked` with
`role="menuitemradio"` / `menuitemcheckbox` for a selectable menu row.

### 1c. `aria-required-parent` — orphan `role="menuitem"` — **BUG**

21 nodes across MenuItem and Avatar. `role="menuitem"` requires an ancestor
`role="menu"` or `menubar`. The MenuItem stories render rows standalone, and
CLAUDE.md's MenuItem examples show `<button class="menu-item" role="menuitem">`
with no wrapper. The role should either be documented as only valid inside
`.dropdown-menu[role="menu"]`, or omitted from the standalone examples.

### 1d. `label` — form controls with no accessible name — **BUG**

20 nodes across Input, Switch and Textarea. The library's label part is a
**`<div class="input-label">`, not a `<label for>`**, so it is styling only and
conveys nothing to assistive tech. Switch is the worst case: 7/7 stories fail,
and the component is a bare `<input type="checkbox" class="switch-input">`
inside a `<label class="switch">` with no text and no `aria-label`, so it has no
accessible name at all in any documented usage.

### 1e. Story-only issues — no library change needed

`landmark-unique` (4) — two `<nav aria-label="Breadcrumb">` / `"Pagination"` in
one story; `empty-table-header` (3) — `<th></th>` in the FilterSegment and
TextButton demo tables; `aria-input-field-name` (1) — a demo `role="listbox"`.

---

## 2. Keyboard and focus audit

### 2. `.icon-button` has no `:focus-visible` — **BUG, open**

Confirmed: `src/components/icon-button.css` contains **zero** occurrences of
`:focus-visible`. It styles `:hover:not(:disabled)` (`:56`),
`:active:not(:disabled)` (`:60`) and `:disabled` (`:66`), and nothing else. The
`.icon-button.icon-ring` rule at `:71` is a manually-applied selected state, not
a focus affordance.

**It propagates.** IconButton is the dismiss/close control in three composed
components — `alert.css:19`, and the Modal and Toast stories each instantiate
it. A keyboard user tabbing to the close button of a modal, toast or alert gets
no visible focus indicator. CLAUDE.md references `icon-button` 22 times.

Note the irony recorded in `icon-button.css:65`: the file explicitly rejected
`opacity-50` for disabled as "not the design" — the component has had careful
attention paid to its disabled state and none to its focus state.

### 3. `.with-ring` without `:focus-visible` — **ASSUMPTION, narrower than filed**

Confirmed list — **four**, exactly as flagged:

| Component | `with-ring` | `:focus-visible` |
| --- | --- | --- |
| avatar | 1 | **0** |
| chip | 5 | **0** |
| field-verification | 1 | **0** |
| section-marker | 2 | **0** |
| filter-segment · pill · segment-selector · tabs · tag · text-button | ✔ | ✔ |

**But the finding overstates the problem.** The four without `:focus-visible`
are exactly the four **non-interactive** components in the set — an avatar, a
status chip, a verification marker and a section marker are all presentational,
with nothing to focus. The six that pair the two are all controls. So the split
is principled, not an oversight.

What remains genuinely unclear is a **DESIGNER** question: what is Figma's Ring
boolean *for* on a non-interactive element? If it signals selection, these need
a real state and probably a role; if it is a focus affordance, it is on the
wrong components.

**Breadcrumbs is genuinely fixed, not merely re-listed.** `breadcrumbs.css:119`
defines `.breadcrumb:focus-visible { @apply focus-ring; }`, and the component
defines no `with-ring` at all, so it is not a ring-only component. Verified this
session in an external consumer: keyboard `Tab` reached the crumb, the ring
rendered as `2px solid oklch(0.4234 0.1163 256.9)` (`Primary/Main`) at
`outline-offset: -2px`, and the row did not reflow.

### 4. `opacity-50` disabled treatment — **BUG, open**

Confirmed in four files:

- `src/components/_template.css:107` — **so every scaffolded component inherits it**
- `src/components/menu-item.css:136`
- `src/components/pill.css:100`
- `src/components/tabs.css:202`

All four are `@apply cursor-not-allowed opacity-50;`.

**The library treats this as a defect elsewhere.** `icon-button.css:65` carries
the comment *"an earlier version used opacity-50, which is not the design"*, and
CLAUDE.md lists it among the four defects the visual harness caught:
*"Disabled faded the whole button with `opacity-50` instead of using
`Secondary/Disabled`"*. The template still teaches the rejected pattern.

Beyond inconsistency, blanket opacity reduces contrast on both text and
background simultaneously, which is how a compliant palette becomes
non-compliant in the disabled state.

**Update — 2026-08-25: the template is fixed; the three components are held.**
`_template.css:107` now applies `text-secondary-disabled`, matching
`icon-button.css:67`, so newly scaffolded components no longer inherit the
pattern. The three shipping components keep it, because none of them takes a
like-for-like swap.

**The root cause is a missing token.** The theme defines exactly three
`-disabled` values — `--color-primary-disabled` (`valiify.css:31`),
`--color-secondary-disabled` (`:37`) and `--color-stroke-disabled` (`:55`) — and
**none of them is a content-ramp colour**. icon-button was a clean fix only
because its glyph rests at `Secondary/Main` and steps to `Secondary/Disabled` on
the same ramp. The other three do not sit on that ramp: `menu-item` rests at
`Content/Primary`; `pill` at `Content/Secondary` over a real `Action/Hover` fill
that opacity currently dims; and `tabs` applies one `:disabled` rule across three
types with different rest colours — `.tab-underline` `Secondary/Main`,
`.tab-segment` `Content/Tertiary`, `.tab-chip` inherited — two of which also
carry fills and a hairline. `pill.css:96` and `tabs.css:198` both record that
Figma models no disabled variant for them at all.

**Held pending a designer decision** on adding a `Content/Disabled` token.
Until one exists, any swap would cross colour ramps and leave fills undimmed —
a visible change to three shipping components with no Figma reference to check
it against.

### 5. `aria-current` is class-only on Step — **BUG, open**

Confirmed. The only occurrence of `aria-current` in `src/components/step.css` is
at line 15, **inside the usage comment** — no selector matches it. Styling comes
from `.step-active` alone.

Every comparable component drives from ARIA:

| Component | ARIA-driven selectors |
| --- | --- |
| tabs | 14 |
| pill | 4 |
| menu-item | 2 |
| dropdown-field | 2 |
| **step** | **0** |

Three resolutions, none chosen here:

1. **Alias** — add `.step[aria-current="step"]` beside `.step-active`, matching
   Tabs. Non-breaking; both work.
2. **Drop the ARIA from the docs** — stay class-only and stop implying the
   attribute does anything.
3. **Require both** — ARIA drives styling, the class is removed. Breaking.

Note `aria-current="step"` maps only to *active*; it cannot express completed or
upcoming, so options 1 and 3 still need `.step-upcoming` as a class.

### 6. `prefers-reduced-motion` — **BUG, open**

Confirmed: **1 of 17** component files with motion is guarded.

- **Keyframe animation** — only `loading-indicator.css`, and it *is* guarded
  (2 occurrences). The single highest-risk component is covered.
- **Transitions, all unguarded (16)** — button, card, input, textarea,
  icon-button, menu-item, dropdown-field, filter-segment, radio-select, link,
  tabs, pill, pagination-item, tag, text-button, switch.

Severity is lower than the raw count suggests: these are short hover/state
transitions, not parallax or looping motion, and the WCAG 2.3.3 obligation is
weaker for them. The concrete exception is **Switch**, whose knob slides 14px
over 150ms — that is the one transition a motion-sensitive user is most likely
to notice.

There is also a known structural defect here, already recorded: the
`prefers-reduced-motion` block in `loading-indicator.css` sits **outside** its
`@layer components`, making it the only unlayered rule in `dist` and the only
place the overlay contract breaks.

### 7. No story models keyboard interaction — **BUG, open**

Confirmed, and one earlier number was wrong:

- **`tabindex`: 0 stories.** No story defines one.
- **`play:` functions: 0.** An earlier count of 37 was a false positive —
  `grep 'play:'` matches `display:`. A pattern anchored to `^\s*play:` returns
  **zero**.
- **Hand-rolled `addEventListener`: 9 files** — TextButton, Modal,
  FilterSegment, PaginationItem, Toast, DropdownField, Pagination, Stepper,
  Alert. All mouse-click handlers; none handles a key event.

So the roving-tabindex patterns that Tabs, SegmentSelector and RadioSelect
require — arrow-key navigation within the group, one tab stop for the whole
control — are **neither implemented nor modelled nor tested**. A consuming team
reading the stories would reasonably conclude that `role="tablist"` plus
`aria-selected` is the whole contract, and ship a tab bar where every tab is a
separate tab stop and arrow keys do nothing.

`@storybook/addon-a11y` is installed but configured with **no threshold**, so it
is an inspection panel that gates nothing.

---

## 3. Classification summary

| # | Finding | Class | Status |
| --- | --- | --- | --- |
| 1a | `Content/Faint` fails AA on every surface (1.54–1.73:1) | DESIGNER | open |
| 1a | `Content/Tertiary` fails on Neutral/Frame (4.20/4.26:1) | DESIGNER | open |
| 1a | Disabled avatar initials 2.19:1 | DESIGNER | open |
| 1a | Chip soft-fill text 2.46–4.34:1 at 8px | DESIGNER | open |
| 1b | `aria-selected` on `button` / `menuitem` (13 nodes) | BUG | open |
| 1c | `role="menuitem"` with no `role="menu"` parent (21 nodes) | BUG | open |
| 1d | Form controls with no accessible name (20 nodes); Switch has none in any documented usage | BUG | open |
| 1e | landmark-unique, empty-table-header, aria-input-field-name | story-only | n/a |
| 2 | `.icon-button` has no `:focus-visible`; propagates to Modal, Toast, Alert | BUG | open |
| 3 | Four `with-ring` components lack `:focus-visible` — all four are non-interactive | ASSUMPTION | open, narrower than filed |
| 3 | What is Figma's Ring boolean for on a non-interactive element? | DESIGNER | open |
| 3 | Breadcrumbs `:focus-visible` | — | **CLOSED** this session |
| 4 | `opacity-50` disabled in `_template.css` + 3 components | BUG | open |
| 5 | `aria-current` class-only on Step | BUG | open |
| 6 | 16 of 17 motion files unguarded; Switch is the notable one | BUG | open |
| 6 | `loading-indicator.css` reduced-motion block outside `@layer components` | BUG | open, previously recorded |
| 7 | Zero `tabindex`, zero `play:`, zero key handlers in 236 stories | BUG | open |

**Closed**: 1 of the 7 keyboard/focus items (Breadcrumbs, verified in an
external consumer). **Open**: the other 6, plus 4 designer decisions and 3
library ARIA defects surfaced by axe.

---

## 4. Not covered

- No screen-reader pass. axe finds programmatic defects; it does not tell you
  whether a Breadcrumbs trail or a Stepper *reads* sensibly in VoiceOver or NVDA.
- No focus-order audit beyond the components above.
- Contrast was measured against the four surface tokens. Components rendered on
  a coloured or image background were not evaluated.
- The `dist` (prebuilt) entry was not scanned separately; stories exercise the
  source path.
