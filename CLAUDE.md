# Valiify Short App UI Component Kit

A Tailwind CSS component library for building the Valiify Short App — the
online application where applicants apply for accounts. CSS-only, zero
JavaScript dependencies, framework-agnostic.

This library was bootstrapped from the Valiify Dashboard UI library's
infrastructure. The build pipeline, verification tooling, component process,
and documentation conventions carry over; the components and design tokens do
not — the Short App has its own Figma component library and its own visual
language. The dashboard library's components, stories, tokens, specs, and
component documentation are preserved for reference in
[_dashboard-archive/](_dashboard-archive/) — useful as pattern references when
building analogous Short App components, but **never** to be imported or
treated as a spec for this library.

## Git

**Never run `git commit` or `git push`.** Stage changes with `git add` if asked,
then stop — I write all commit messages and commit myself.

## Quick Reference

### Available Components

#### Button

Extracted from Figma **Button / Standard** (1:218; renamed 2026-09-02 — the
INLINE set; Button / Utility covers non-inline) — 16 variants across `Type` {Primary,
Secondary, Micro, Bubble} × {rest, hover, hover+pressed, inactive}. A former
`Mobile` axis was removed by the designer (caught by the Gate-0 metadata sweep).

- **Base**: `.btn` — layout only, **a type class is required** (Figma names no
  default Type; the Alert/Tabs lesson)
- **Types**: `.btn-primary`, `.btn-secondary`, `.btn-micro`, `.btn-bubble`
- **States**: `:hover`, `:active`, `:disabled` (Figma's `Inactive`),
  `:focus-visible`
- **Icon slots**: plain `svg` children (18px; 12px in Micro), painted by the
  button. Figma's layout per Type: Primary trailing only, Secondary/Micro both
  sides, Bubble leading only — documented, not enforced.
- **Width is the caller's** — Figma's 239px is the sample hug; add `w-full`
  in full-width forms. Heights pinned: 48 / 48 / 12 / 34.

| Type | box | type style | rest → hover → pressed → disabled |
| --- | --- | --- | --- |
| `-primary` | 48px, 4px radius, filled | `type-button-label` (14/600, 10%, **uppercase**) | fill `Primary → Hover → Focus → Disabled`; white ink **never fades** |
| `-secondary` | 48px, 4px radius, 1px border | same | border `Stroke/Border → Hover → (pressed adds Action/Hover wash) → Divider`; ink `Secondary → Primary → · → Tertiary` |
| `-micro` | 12px bare row, no box | `type-micro-label` (9/600, 8%, **uppercase**) | ink `Secondary → Primary (hover **= pressed**) → Tertiary` |
| `-bubble` | 34px pill | `text-label` (14/400, **mixed case**) | ink ramp + fill `none → Action/Hover → Action/Pressed → none` |

> **Casing is a styled transform, not typed caps** — the Figma samples are
> "Button" mixed-case; Primary/Secondary/Micro carry an uppercase transform,
> Bubble doesn't. This resolved the token file's casing question for `Button
> Label` and `Micro-Label` (both now carry `textTransform` and emit `type-*`
> utilities); Eyebrow/Data Key/Tag & Pill remain open.

> **Secondary's hover changes the border only** — the fill wash appears only
> at pressed, and binds the token literally named `Action/Hover` (where
> Bubble's pressed binds `Action/Pressed`). Verbatim; designer list.

> **`Primary/Focus` is Figma's literal name for the Primary PRESSED fill** —
> wired to `:active`, never `:focus-visible` (same pattern as Checkbox).

> **Micro's hover and pressed are pixel-identical in Figma** (0/696 diff —
> measured, not assumed) — reproduced as one rule. Designer list, same defect
> class as the dashboard's TextButton.

> **Primary's height math is 2px short** (13+13+20 = 46 vs the 48px frame;
> Secondary closes exactly via its border-box 1px border) — resolved by frame
> authority (`h-12` pinned), not by inventing padding. Designer list.

> **Secondary's border is a real 1px border** — pixel-aligned, not fractional,
> so the Radio/Checkbox inset-shadow trick is deliberately NOT used here.

```html
<button class="btn btn-primary">
  Continue
  <svg aria-hidden="true"><use href="#arrow-right" /></svg>
</button>

<button class="btn btn-secondary">
  <svg aria-hidden="true"><use href="#arrow-left" /></svg>
  Back
</button>

<button class="btn btn-micro">
  View all
  <svg aria-hidden="true"><use href="#arrow-right" /></svg>
</button>

<button class="btn btn-bubble">Skip</button>

<!-- Full width is the caller's -->
<button class="btn btn-primary w-full">Submit application</button>
```

#### Radio

Radio button control for single selection from a group. Extracted from Figma
Radio (1:419) — 4 variants across `Active` × `Hover` × `Pressed`, all 20×20.

- **Base**: `.radio` — applied **directly to a native `<input type="radio">`**
- **States**: `:hover`, `:active`, `:checked`, `:focus-visible`, `:disabled`
- **Dimensions**: 20×20 circle, 1.5px inside ring, 10px inner dot when checked
- **No label, no sizes, no slots** — the Figma component is the bare control;
  compose your own label markup around it

| State     | ring (1.5px inside)          | fill              | dot                    |
| --------- | ---------------------------- | ----------------- | ---------------------- |
| rest      | `Stroke/Border`              | none              | —                      |
| `:hover`  | unchanged                    | `Action/Hover`    | —                      |
| `:active` | unchanged                    | `Action/Pressed`  | —                      |
| `:checked`| `Primary/Primary`            | **none**          | 10px `Primary/Primary` |

> **The ring is an inset `box-shadow`, not a border — load-bearing.** Chrome
> floors fractional `border-width`, so a 1.5px border renders 1px. An inset
> box-shadow paints the authored 1.5 exactly, and inset matches Figma's inside
> stroke alignment, so the 20px layout box is unaffected. Same family of trap
> as the dashboard LoadingIndicator's masked-gradient ring.

> **Hover and pressed exclude `:checked` by name.** Figma draws no
> checked+hover or checked+pressed variant, so a checked radio deliberately
> takes no tint — the spec pins this. If the designer adds those variants,
> remove the `:not(:checked)` guards rather than layering new rules.

> **Not modelled in Figma, not invented here:** no disabled variant (`:disabled`
> swaps the cursor and nothing else — a disabled radio renders identically to
> an enabled one; on the designer list), and no focus variant in the component
> set (`:focus-visible` uses the library-wide `focus-ring` utility — Figma's
> "Primary Ring" effect, a 3px `Primary/Ring` halo, extracted with the token
> set).

> **Structure quirk in the design file, harmless here:** the three unchecked
> variants draw the ring as a child ellipse, while checked puts the stroke on
> the variant frame itself. Visually identical; flagged to the designer.

```html
<!-- Bare control -->
<input type="radio" name="plan" class="radio" />
<input type="radio" name="plan" class="radio" checked />

<!-- With a label, composed at the call site -->
<label style="display: inline-flex; align-items: center; gap: 10px;">
  <input type="radio" name="account-type" class="radio" checked />
  Business
</label>
```

#### Avatar

Circular initials marker. Extracted (inline fast-path) from Figma Avatar
(23:670) — 4 variants: `Property 1` {MD 24px, SM 20px} × `Feint`.

- **Base**: `.avatar` (MD, 24px) — `Neutral/Base` fill, white initials,
  Eyebrow type (11/600, 10% tracking, uppercase)
- **Size**: `.avatar-sm` (20px) — steps the type to Micro-Label (9/600, 8%)
- **Variant**: `.avatar-feint` — `Neutral/BG` 8% tint, `Text/Secondary` ink

> **The uppercase is the type style's own transform** — this component and
> Badge are the evidence that resolved Eyebrow's casing (typed mixed-case,
> styled caps). Pass initials in any case.
> **Initials only** — no image layer exists in any variant, same as the
> dashboard file's Avatar. No LG, no ring, no disabled modelled.

```html
<span class="avatar">NC</span>
<span class="avatar avatar-sm">NC</span>
<span class="avatar avatar-feint">NC</span>
```

#### Badge

Small uppercase qualifier pill. Extracted (inline fast-path) from Figma Badge
(28:507) — a single symbol, no variant axes.

- **Base**: `.badge` — 16px full-round pill, `Neutral/BG` fill, 8px x-padding,
  Eyebrow type in `Text/Secondary`; width hugs the label

> **No colour variants, sizes, or states exist in the design** — the symbol
> has no axes. Pass the label in natural case (the Eyebrow transform caps it).

```html
<span class="badge">Optional</span>
```

#### BoxAction

A boxed row composing a Checkbox or Switch with a label — the whole row is the
hit target. Extracted from Figma Box action (199:12990) — 8 variants:
`Type` {Checkbox 48px, Switch 44px} × {rest, Hover, Active, Disabled}.

- **Base**: `.box-action` (a `<label>`) + type class `.box-action-checkbox` /
  `.box-action-switch` (required — they carry the pinned heights and label
  styles) + `.box-action-label`
- **Pure composition**: the nested control is the shipped `.checkbox-control`
  / `.switch` markup, unmodified — its checked styling comes free. Row state
  derives from the real input via `:has(:checked)` / `:has(:disabled)`.

| state | ring (inset shadow) | fill | label |
| --- | --- | --- | --- |
| rest | 1px `Stroke/Divider` | `BG/Paper` | checkbox: `text-input`/Primary · switch: `text-body-content`/Secondary |
| hover | 1px `Stroke/Hover` | **unchanged** | unchanged (row hover never touches the control) |
| active | 1px `Primary` | `Primary/BG` | checkbox type steps to `text-lead` (500, ink unchanged); switch type never steps |
| disabled | **0.5px** `Stroke/Divider` (checkbox) / 1px `Stroke/Border` (switch) | `BG/App Page` | `Text/Tertiary` |

> **The ring is an inset box-shadow, heights pinned h-12/h-11** — Figma's
> inside stroke lives within 48/44 (the math closes exactly), a border would
> overflow the pinned box, and the authored 0.5px disabled ring would be
> floored to 1px as a border.
> **Per-type disabled inconsistencies are Figma's** (different ring tokens; no
> distinct disabled switch asset) — designer list.
> No compound states are drawn; the CSS excludes them by name. No row-level
> focus — the nested control's own focus-ring serves.

```html
<label class="box-action box-action-checkbox">
  <span class="checkbox-control">
    <input type="checkbox" class="checkbox-input" />
    <svg class="checkbox-check" aria-hidden="true"><use href="#check" /></svg>
  </span>
  <span class="box-action-label">Paperless statements</span>
</label>
```

#### Checkbox

Binary selection control. Extracted from Figma Checkbox (1:424) — 8 variants
across `Active` × `Hover` × `Pressed` × `Disabled`, all 18×18.

- **Parts**: `.checkbox-control` (18px positioning wrapper), `.checkbox-input`
  (native `<input type="checkbox">`), `.checkbox-check` (sprite `#check` glyph)
- **States**: `:hover`, `:active`, `:checked`, `:disabled`, `:focus-visible` —
  and unlike Radio, **both branches have hover/pressed drawn in Figma**
- **Dimensions**: 18×18 box, raw **3px radius** (on neither Radius token —
  designer list), 1.5px inside ring, 16×16 check glyph at 1px inset

| state | unchecked | checked |
| --- | --- | --- |
| rest | `Stroke/Border` ring 1.5px + Paper fill | `Primary` fill, **no ring** |
| hover | + `Action/Hover` fill, ring unchanged | `Primary/Hover` |
| pressed | + `Action/Pressed` | **`Primary/Focus`** (verbatim token name) |
| disabled | ring thins to **1px** AND swaps to `Stroke/Divider` | `Primary/Disabled` (translucent, as-is) |

> **The ring is an inset box-shadow** (fractional-border trap, same as Radio).
> **The unchecked border only LOOKS like it darkens across states** — it is one
> constant translucent token compositing over the changing fill; do not split
> it into per-state ring colours.
> **Disabled changes two things at once** (width and token) — pixel-verified,
> both authored.
> **`Primary/Focus` is Figma's literal name for the checked PRESSED fill** —
> wired to `:active`, never `:focus-visible`.
> **The wrapper exists for the sprite glyph** — a pseudo-element cannot render
> `<use>`; the check's white is unbound in Figma and ships as `Text/Contrast`
> (designer to confirm). The sprite's symbols carry no paint attributes, so the
> component CSS supplies `fill:none; stroke:currentColor; stroke-width:2`.
> **Not modelled, not invented**: indeterminate (`:indeterminate` renders
> unchecked — see the IndeterminateGap story), disabled+hover/pressed, focus.

```html
<label style="display: inline-flex; align-items: center; gap: 10px;">
  <span class="checkbox-control">
    <input type="checkbox" class="checkbox-input" checked />
    <svg class="checkbox-check" aria-hidden="true"><use href="#check" /></svg>
  </span>
  Online banking
</label>
```

#### Header

The application shell header. Extracted from Figma Header (550:7507) — Web
(1410×60) / Mobile (375×60) variants, which differ **only** by frame width
and the TextSelector's label ("English" → "EN").

- **Base**: `.header` — 60px pinned, `BG/Paper`, 1px `Stroke/Divider` bottom
  border (a real border: pinned height + border-box absorbs it), 20px
  x-padding
- **Parts**: `.header-logo` (caller asset slot, 30px tall, absolutely
  centered — its crimson #CD1041 is the client brand asset's own colour,
  deliberately untokenized), plus the composed `.text-selector`
- **Breakpoint helpers**: `.header-desktop` / `.header-mobile` wrappers —
  render both selector labels; the 768px media query switches them

> **Three labeled library extensions** (the consumer contract; Figma models
> none): `position: sticky; top: 0; z-index: 40` (first z-index in the
> library — establish a scale when overlay components land), full width, and
> the 768px breakpoint. No scrolled shadow — Figma draws none.
> **The helpers are `display: contents` wrappers, not classes on
> `.text-selector`** — header.css sorts before text-selector.css, so
> equal-specificity display rules on the same element would lose by import
> order.
> **Sticky sticks to the nearest scrolling ancestor** — mount as a direct
> child of the scroll container or both contract behaviours silently break.

```html
<header class="header">
  <img class="header-logo" src="/logo.svg" alt="Alabama Credit Union" />
  <span class="header-desktop">
    <button class="text-selector" aria-haspopup="listbox" aria-expanded="false">
      <svg class="text-selector-icon" aria-hidden="true"><use href="#globe" /></svg>
      <span class="text-selector-label">English</span>
      <svg class="text-selector-chevron" aria-hidden="true"><use href="#chevron-down" /></svg>
    </button>
  </span>
  <span class="header-mobile"><!-- same, label "EN" --></span>
</header>
```

#### IconButton

Compact icon-only button. Extracted from Figma "icon button" (1:429) — 16
variants across `Size` × `Type` × `Hover` × `Subtle`.

- **Base**: `.icon-button` — Figma's *Icon Only* type: the glyph IS the box,
  hover recolours it and **nothing else** (no background, ever)
- **Type**: `.icon-button-state` — pads the same glyph into a larger hit target
  and hover adds a full-circle `Action/Hover` halo
- **Sizes**: md default (18px glyph; 24px box as State), `.icon-button-sm`
  (14px glyph; 18px box as State). Box = glyph for Icon Only.
- **Ramp**: default rest `Neutral/Base` → hover `Neutral/Hover`;
  `.icon-button-subtle` rest `Neutral/Disabled` (60% ink) → hover
  `Neutral/Base` — **hover cancels the muting and never reaches Neutral/Hover**
- **Glyph slot**: any sprite symbol, no icon class — the button sizes and
  paints its child `svg` directly (stroke-width 2 → 1.5px at md, 1.167px at sm)

> **Always give an icon-only button an `aria-label`.**
> **md as the bare default is a library choice** — Figma names no default Size.
> **Revised 2026-09-02 (Neutral-ramp rework)**: a Pressed axis was added —
> `:active` binds the new `Neutral/Pressed` for **both** ramps (pressing a
> Subtle button reaches full-strength ink), and the State type's pressed halo
> deepens to `Action/Focused`. `Neutral/Hover` also darkened (#484b4f). The
> old `23:723` rest-binding slip **was fixed by the designer**; still open:
> `23:725`'s hand-shrunk glyph (shipped 18px).
> **Legibility flag**: the Subtle rest glyph is very faint over white.
> **Not modelled, not invented**: Disabled (cursor only), Focus (library
> `focus-ring`).

```html
<button class="icon-button" aria-label="Close">
  <svg aria-hidden="true"><use href="#x" /></svg>
</button>

<!-- Padded hit target with hover halo -->
<button class="icon-button icon-button-state" aria-label="Settings">
  <svg aria-hidden="true"><use href="#settings" /></svg>
</button>

<!-- Small, muted -->
<button class="icon-button icon-button-sm icon-button-subtle" aria-label="Help">
  <svg aria-hidden="true"><use href="#circle-help" /></svg>
</button>
```

#### Skeleton

Loading placeholders mirroring real components. Extracted from Figma Skeleton
(525:4650, **16 shapes**) plus the authored written spec (550:7998) — the
authority for the SM/MD/LG matrix, per-shape radii, and the animation.

- **Base**: `.skeleton` — fill + pulse only; **both a shape and a size class
  are required** (dimensions are a 16×3 matrix, not one box at three scales)
- **Shapes**: `-text -heading -circle -rectangle -button -input -textarea
  -card -switch -checkbox -badge -listitem -tab -avatar -dropdown -radio`
- **Sizes**: `-sm -md -lg` — written-spec defaults; widths stretch freely
  (`w-full` just works — consumer utilities win), heights stay near defaults

| radius | shapes |
| --- | --- |
| 4px | text, heading, checkbox |
| 6px | button, input, textarea, tab, dropdown |
| 8px | rectangle, card |
| 10px | badge, switch |
| full | circle, avatar, radio |

> **The fill is raw `#f1f1f4`** — the written spec names a "Surface/Neutral"
> variable that does not exist in this file's collection (verified by full
> Plugin API enumeration; the name matches the dashboard-era palette). Ships
> as `--skeleton-fill` for overridability; tokenize when the variable lands.
> Designer list.
> **The pulse is the written spec's, not Tailwind's `animate-pulse`** — 2s
> ease-in-out, opacity 1→0.4→1 (Tailwind's floors at 0.5 on a different
> curve). Instances pulse in sync for free; do NOT stagger with
> animation-delay — the spec rules it out. Reduced-motion guard lives inside
> `@layer components` (the dashboard's one cascade leak, not repeated).
> **Accessibility**: each `.skeleton` is `aria-hidden` decoration; the
> CONTAINER carries `role="status"`, `aria-busy="true"` and a label.

```html
<div role="status" aria-busy="true" aria-label="Loading profile">
  <span class="skeleton skeleton-circle skeleton-lg" aria-hidden="true"></span>
  <span class="skeleton skeleton-heading skeleton-lg" aria-hidden="true"></span>
  <span class="skeleton skeleton-text skeleton-md w-full" aria-hidden="true"></span>
</div>
```

#### Switch

Binary on/off toggle. Extracted from Figma Switch (1:446) — 4 variants across
`Active` × `Hover`, all 36×20.

- **Base**: `.switch` on a native `<input type="checkbox" role="switch">` —
  the input is the track, the knob is `::before`
- **States**: `:hover`, `:checked`, `:checked:hover`, `:disabled`,
  `:focus-visible`
- **Dimensions**: 36×20 pill track (no border in any variant), 16px knob at
  2px inset, **16px travel** via the CSS `translate` property

| state | track | knob |
| --- | --- | --- |
| off rest | `Stroke/Border` (17% ink, **used as a fill**) | `BG/Paper` |
| off hover | `Stroke/Hover` (56% ink) | unchanged |
| on rest | `Primary` | unchanged |
| on hover | `Primary/Hover` | unchanged |

> **The off-track paints with STROKE-family tokens as fills** — `bg-stroke-border`,
> never `border-*`; a naive read of the token name would add a line that exists
> nowhere in the design. On the designer list as a naming oddity.
> **The knob ships shadowless**: Figma binds no effect variable and the
> export's faint spill (~1% in one variant) is not a spec. Designer list.
> **Knob diameter was the extraction's one cross-lane conflict** (authored
> 16×16 vs a 15px 1x-raster read) — authored metadata wins: 2+16+16+2 = 36
> exactly. The spec pins 16.
> **Not modelled, not invented**: Disabled (cursor only), Pressed, Focus.

```html
<label style="display: inline-flex; align-items: center; gap: 16px;">
  Email notifications
  <input type="checkbox" role="switch" class="switch" checked />
</label>
```

#### ListItem

One row in a dropdown/selection list. Extracted from Figma List Item (1:463) —
24 variants: `Size` {sm, md, lg} × `Selected` × `Hover` × `LastItem`.

- **Base**: `.list-option` — layout only, **a size class is required** (Figma's
  samples only show sm; no default is baked in). Named `-option`, NOT
  `-item`: `.list-item` IS Tailwind's own `display: list-item` utility and
  the collision stacked the rows (caught live; same trap later hit
  `.text-field-label` vs the `text-field-label` type token's utility)
- **Sizes**: `.list-option-sm` (Help & Caption 12px, 30px / **34px selected**),
  `.list-option-md` (Labels Default 14px, 36px), `.list-option-lg` (Input 16px, 40px)
- **Parts**: `.list-option-text` (wraps, doesn't truncate), `.list-option-check`
  (18px sprite glyph, ALWAYS in markup, shown by selection)
- **States**: `:hover` (works on selected rows too — a real Figma variant),
  `[aria-selected="true"]` / `[aria-checked="true"]`, `:focus-visible`

> **Selection is an ink swap to `Primary`** — text and check inherit together
> via currentColor. No background.
> **The gap-collapse trick**: `gap` is unconditional 10px; the hidden check
> contributes none, so unselected rows read gap-0 with no conditional class.
> **The sm selected row grows 30→34** — Figma's emergent hug (the fixed 18px
> check exceeds sm's 14px line box; md/lg line boxes already clear it).
> Reproduced, spec-pinned, designer-listed.
> **The divider is `:not(:last-child)`**, matching the LastItem boolean's
> intent structurally.
> Not modelled, not invented: disabled, pressed.

```html
<button class="list-option list-option-sm" role="option" aria-selected="true">
  <span class="list-option-text">English</span>
  <svg class="list-option-check" aria-hidden="true"><use href="#check" /></svg>
</button>
```

#### DropdownList

The panel holding ListItem rows. Extracted from Figma Dropdown List (1:480).

- **Base**: `.dropdown-list` — `BG/Paper`, 1px `Stroke/Divider` border, 4px
  radius, zero padding/gap, raw `0 2px 5px 10%` shadow

> **Figma naming trap**: the set's "Property 1 = sm/md" toggles which sample
> row is selected — it is NOT a size axis (both samples are sm rows). No
> container size classes exist on purpose.
> **Two paired library choices — never "fix" one alone**: `overflow: clip` is
> a labeled extension (Figma has no clipping; hover fills would poke past the
> corners), and the shadow ships as `filter: drop-shadow()` because
> overflow-clip eats a box's own `box-shadow`.
> Width is the consumer's — the panel spans its trigger.

```html
<div class="dropdown-list" role="listbox">
  <button class="list-option list-option-sm" role="option" aria-selected="true">…</button>
  <button class="list-option list-option-sm" role="option" aria-selected="false">…</button>
</div>
```

#### RadioField

Labeled radio-group form field. Extracted from Figma Radio Fields (123:6059)
— 6 declared variants across `Filled` × `Hover` × `Focus`.

- **Parts**: `.radio-field` (a `<fieldset>`), `.radio-field-title` (a
  `<legend>`, Labels/Strong 14/500, `Text/Secondary`, optional
  `.radio-field-help` 18px icon slot), `.radio-field-options` (40px row,
  24px apart), `.radio-field-option` (a `<label>` composing the shipped
  `.radio`, 8px gap, Input 16/400), `.radio-field-hint` (optional, 12/400)
- **States: none at field level, deliberately** — see below

> **Figma's state axes are UNWIRED — verified three independent ways**: all
> six variants bind identical variables, share identical structure, and
> render byte-identical pixels (`Filled` checks nothing; hover/focus draw
> nothing). All real interaction ships from the composed `.radio` (native
> tints, crimson `:checked`, focus-ring). Top designer-list item.
> **The helper icon is hidden in every Figma variant** — its recent redesign
> could not be verified from this set, and the current glyph is a
> chevron-left (reads as a placeholder). Designer list.
> **Option ink is raw `#000000` in Figma** (the file's only raw black) —
> shipped as `Text/Primary`; designer list. The `bottomContent` block's
> authored geometry is broken (absolute −59px/−313%) — `.radio-field-hint`
> ships in normal flow as a labeled correction.
> No Error axis exists (unlike the sibling text fields), no disabled.

```html
<fieldset class="radio-field">
  <legend class="radio-field-title">Do you have an existing account?</legend>
  <div class="radio-field-options">
    <label class="radio-field-option">
      <input type="radio" name="existing" class="radio" checked />
      Yes
    </label>
    <label class="radio-field-option">
      <input type="radio" name="existing" class="radio" />
      No
    </label>
  </div>
</fieldset>
```

#### SelectCard

Selectable / navigational option card. Extracted from Figma Card (9:367) —
6 variants: `Hover` × `Radio` × `Pressed`.

- **Base**: `.select-card` — 16px padding, 12px gap, 6px radius, 1px border,
  76px content-driven height (20+**4**+20 text block + 32 padding)
- **Parts**: `.select-card-text`, `.select-card-title` (Labels Strong 14/500),
  `.select-card-description` (optional — Figma's subtitle boolean),
  `.select-card-chevron` (18px, `Neutral/Base`)
- **Two exclusive variants**: a `<label>` composing the shipped `.radio`
  (selection card), or a `<button>` with the trailing chevron (navigation)

| state | border | fill |
| --- | --- | --- |
| rest | `Stroke/Divider` | `BG/Paper` |
| `:hover` | `Stroke/Hover` | **unchanged** (pixel-proven perimeter-only) |
| `:active` (chevron variant) | unchanged token | `Action/Pressed` wash |
| **selected** (`:has(.radio:checked)`) | `Primary/Primary` | `Primary/BG` |

> **Figma's "Pressed" on the radio variant means SELECTED** — persistent, with
> the nested radio checked; driven here by `:has(:checked)` from the real
> input state (CSS-only, no class to sync). The chevron variant's pressed is
> a transient wash. Two strategies for one axis — designer list.
> **The pressed border only LOOKS darker** — constant translucent
> `Stroke/Divider` over the tinted fill (Checkbox precedent).
> **The chevron layer is named ChevronLeft but renders right** — shipped as
> `#chevron-right`; designer list.
> Hover/active exclude the selected card by name (`:not(:has(:checked))`) —
> Figma draws no selected+hover. Not modelled, not invented: disabled, focus
> variants (library focus-ring).

```html
<label class="select-card">
  <input type="radio" name="join" class="radio" checked />
  <span class="select-card-text">
    <span class="select-card-title">Family Connection</span>
    <span class="select-card-description">A relative is already a member</span>
  </span>
</label>

<button class="select-card">
  <span class="select-card-text">
    <span class="select-card-title">Family Connection</span>
    <span class="select-card-description">A relative is already a member</span>
  </span>
  <svg class="select-card-chevron" aria-hidden="true"><use href="#chevron-right" /></svg>
</button>
```

#### Tabs

Chip-style tab item, two types. Extracted from Figma Tabs (23:825) — 7
variants: `Type` {Portal, Application} × `Hover` × `Active`.

- **Base**: `.tab` — layout + shared ink ramp; **a type class is required**
- **Types**: `.tab-portal` (ghost — bare until active, then a neutral
  `Action/Active` wash), `.tab-application` (always boxed — Paper +
  `Stroke/Divider` ring, crimson when active)
- **Row**: `.tabs` — **unsourced structural extension** (no tablist frame in
  Figma yet)
- **States**: `:hover` (ink preview, weight unchanged),
  `[aria-selected="true"]` (ink + weight 400→500), `:focus-visible`
- **Geometry**: 34px hug (7+7+20), 12/7 padding, 8px gap, 4px radius, 16px
  caller icon slot

> **No underline exists** — every active cue is fill/ring/ink
> (pixel-verified; the dashboard's underline-tab instincts don't apply).
> **The Application ring is an inset box-shadow**: height is hug-driven, so a
> real border would render 36px, not the drawn 34.
> **Portal active+hover is a near-invisible token swap** (`Action/Active` →
> `Action/Focused`, Δ6/255) — reproduced faithfully; designer list.
> **Application active+hover is undrawn** — the hover rule excludes the
> selected tab by name.
> **The active weight step reflows the hug ~1px** (Figma's own; designer
> list). Not modelled, not invented: disabled, pressed.

```html
<div class="tabs" role="tablist" aria-label="Application steps">
  <button class="tab tab-application" role="tab" aria-selected="true">
    <svg aria-hidden="true"><use href="#user" /></svg>
    Your details
  </button>
  <button class="tab tab-application" role="tab" aria-selected="false">
    <svg aria-hidden="true"><use href="#banknote" /></svg>
    Funding
  </button>
</div>
```

#### TextSelector

Language-picker dropdown trigger. Extracted from Figma Text Selector (1:489) —
12 variants across `Hover` × `Active` × `Mobile`, all 18px tall.

- **Parts**: `.text-selector` (the button row), `.text-selector-icon` (16px
  globe), `.text-selector-label` (Help & Caption 12/400, natural case),
  `.text-selector-chevron` (18px, rotates)
- **States**: `:hover`, `[aria-expanded="true"]`, `:focus-visible`
- **Ink-only** — no box, fill, border, or padding at any state (the
  `.btn-micro` posture)

| state | label | icons |
| --- | --- | --- |
| rest | `Text/Tertiary` | `Neutral/Disabled` (60% — lighter than the label) |
| `:hover` | `Text/Secondary` | **unchanged** |
| `[aria-expanded="true"]` | `Text/Primary` | `Neutral/Base` full opacity + chevron 180° |

> **The design file contains duplicate `Hover=yes` variants** — two node
> groups with different treatments under the same declared properties. Shipped
> reading (pattern-consistency + node-ID locality): the modest one-token step
> is `:hover`; the two-property near-black step is the OPEN state, wired to
> `aria-expanded` together with the chevron rotation (Figma models rotation on
> a separate Active axis; coupling them is a deliberate simplification). Both
> on the designer list.

> **Mobile is a label swap only** ("English" → "EN") — pass the short label;
> no modifier class exists or is needed.

```html
<button class="text-selector" aria-haspopup="listbox" aria-expanded="false">
  <svg class="text-selector-icon" aria-hidden="true"><use href="#globe" /></svg>
  <span class="text-selector-label">English</span>
  <svg class="text-selector-chevron" aria-hidden="true"><use href="#chevron-down" /></svg>
</button>
```

#### Owner

Icon-in-a-box owner marker. Extracted from Figma Owner (261:13225) — 3
variants on one `Type` axis {individual, Add, company}, all 34×34, **no state
axis**.

- **Base**: `.owner` — 34px rounded square (**4px radius — NOT a circle**;
  deliberately distinct from the circular, initials-only Avatar), `Neutral/BG`
  fill, glyph in `Neutral/Base`
- **One class, no type modifiers** — the three Figma variants are
  byte-identical at the token level and differ only by glyph; the glyph is a
  caller slot (IconButton precedent): `#user` / `#plus` / `#building`

> **No stroke on any variant** — the Add tile was pixel-scanned for a dashed
> ring and has none. **Icon-only forever** — no text layer exists in any
> variant. Static decoration: never a button, no states drawn or invented.
> Geometry closes exactly (8+18+8 = 34); shipped as a pinned flex box.

```html
<span class="owner"><svg aria-hidden="true"><use href="#user" /></svg></span>
<span class="owner"><svg aria-hidden="true"><use href="#plus" /></svg></span>
<span class="owner"><svg aria-hidden="true"><use href="#building" /></svg></span>
```

#### OwnerContainer

One row in the owners list. Extracted from Figma Owner Container (274:258) —
2 variants (`Property 1` = Person / Company), 509×92.5, **no state axis**.

- **Parts**: `.owner-container` (the row), `.owner-container-info` (column),
  `.owner-container-title` (34px pinned row: `.owner-container-name` flex-1
  truncating + optional `.badge` + `.owner-container-percent`),
  `.owner-container-contact` (18px pinned row: `.owner-container-contact-text`
  flex-1 + `.owner-container-actions`)
- **Pure composition, no variant classes** — Person vs Company differ ONLY by
  the Owner glyph and copy (zero variable/structural deltas, lane-verified).
  Composes the shipped Owner, Badge, `.btn-micro` (Edit) and
  `.icon-button-sm.icon-button-state` (delete) unmodified.

> **The divider is a 0.5px inset box-shadow, height pinned `h-[92.5px]`** —
> Figma draws a bottom-only 0.5px `Stroke/Divider` hairline (pixel-confirmed
> at half coverage); a border would be floored to 1px AND add height. Math:
> 16+34+8+18+16 = 92, + 0.5. A Gate-0 metadata read said 94.5 — three
> independent reads + arithmetic + pixels say 92.5 (the 94.5 matches the
> hairline-adds-2px trap applied to a rendered read); designer list.
> **No background, side borders, or radius** — a bare list row (ListItem
> posture), not a card. Width is the caller's (509 is the sample hug).
> **Actions live IN the contact row** (342+8+69 = 419 exactly), trailing the
> text. The delete button is icon-only — always give it an `aria-label`.
> **The badge is Figma's `tag` boolean, hidden by default** — toggle the
> `hidden` attribute, no modifier class.
> **Title/contact row heights (34/18) are frame authority** — both exceed
> their line boxes with no authored padding; Button's h-12 precedent.
> **Figma's glyph layers are misnamed** ("arrow-right" renders a pencil,
> "ChevronLeft" a trash can — SelectCard defect class); ships `#pencil` /
> `#trash-2`. Percent's type style is inferred (single title-level binding,
> matching ink — medium confidence). Both on the designer list.
> **Semantics**: a list row with actions, never a button — mount as `<li>` in
> a list (or `role="listitem"`); only the two nested actions are interactive.

```html
<div class="owner-container">
  <span class="owner"><svg aria-hidden="true"><use href="#user" /></svg></span>
  <div class="owner-container-info">
    <div class="owner-container-title">
      <span class="owner-container-name">John Smith</span>
      <span class="badge" hidden>Optional</span>
      <span class="owner-container-percent">20%</span>
    </div>
    <div class="owner-container-contact">
      <span class="owner-container-contact-text">(123) 456-7890 · john.smith@valiify.com</span>
      <div class="owner-container-actions">
        <button class="btn btn-micro">Edit <svg aria-hidden="true"><use href="#pencil" /></svg></button>
        <button class="icon-button icon-button-sm icon-button-state" aria-label="Remove John Smith">
          <svg aria-hidden="true"><use href="#trash-2" /></svg>
        </button>
      </div>
    </div>
  </div>
</div>
```

#### TextField

Labeled single-line text input. Extracted from Figma Plain Text Field (1:291)
— 9 variants on a **partial** `Filled` × `Hover` × `Focus` × `Error` matrix
(no empty+error, no hover+focus, no disabled), all 413×73.

- **Parts**: `.text-field` › `.text-field-title-row` (25px: `.text-field-title`
  + optional `.text-field-help` 18px icon-button) › `.text-field-box` (48px
  pinned wrapper div — a native input can't host the icon slots; state styling
  hangs off it via `:has()`) › `.text-field-input` (the native input) +
  optional `.text-field-icon` (18px, leading/trailing) › `.text-field-hint`
- **States**: `:hover`, `:has(:focus)` (any focus — Figma's Focus axis is the
  caret), `aria-invalid="true"` (error), `:focus` ring on error too

| state | border (1px, border-box) | extra |
| --- | --- | --- |
| rest | `Stroke/Border` | — |
| `:hover` | `Stroke/Hover` | — |
| focus | `Primary` | + 3px Primary Ring (`focus-ring`) |
| error | **`Warning/Base`** (amber — verbatim) | — |
| error+hover | **unchanged** (unwired in Figma; excluded by name) | — |
| error+focus | border stays amber | **crimson ring still fires** |

> **THE PART CLASS IS `-title`, NOT `-label`** — a `.text-field-label` class
> collides with the `text-field-label` type token's generated utility
> (utilities out-cascade components; the `.list-item` lesson). RadioField's
> `-title` naming adopted family-wide.
> **The label binds `text-label-strong` (14/20/500), NOT the
> `text-field-label` token (13/16)** — verbatim in all nine variants; that
> token is used by no shipped component yet. Designer list.
> **Error binds the WARNING ramp** — settled with variables AND pixels across
> both field sets; no Error/* token appears anywhere. The Error-ramp question
> is closed as an authoring slip until the designer rebinds.
> **Fill, label ink and value ink never change in any state** (pixel-verified)
> — border-only reactions. The placeholder/value ink swap is native
> `::placeholder` (`Text/Hint` → `Text/Primary`), no Filled class.
> **The hint ships in normal flow** — Figma's bottomContent geometry is broken
> (absolute −19px/−313%, the RadioField defect verbatim, all three fields).
> Error hint ink `Warning/Text` is INFERRED (row hidden in every variant).
> **Placeholder contrast fails WCAG as authored** (Text/Hint 3.11:1) — axe
> can't see `::placeholder` here but flags the same ink on DropdownField;
> waived in KNOWN_ISSUES with rationale. Designer list.
> Not modelled, not invented: **disabled** (a priority gap for real forms).

```html
<div class="text-field">
  <div class="text-field-title-row">
    <label class="text-field-title" for="fname">First name</label>
  </div>
  <div class="text-field-box">
    <input id="fname" class="text-field-input" type="text" placeholder="Jane" />
  </div>
</div>

<!-- error: aria-invalid drives it; describedby wires the hint -->
<div class="text-field">
  <div class="text-field-title-row">
    <label class="text-field-title" for="email">Email</label>
  </div>
  <div class="text-field-box">
    <input id="email" class="text-field-input" type="email"
           aria-invalid="true" aria-describedby="email-hint" />
  </div>
  <p id="email-hint" class="text-field-hint">Enter a valid email address.</p>
</div>
```

#### DropdownField

Labeled listbox-trigger field. Extracted from Figma Dropdown Field (1:358) —
9 variants, same partial matrix and 413×73 anatomy as TextField.

- **Parts**: `.dropdown-field` › `.dropdown-field-title-row` /
  `.dropdown-field-title` (+ optional `.dropdown-field-optional` right slot,
  `.dropdown-field-help`) › `.dropdown-field-trigger` (a `<button>`, 48px
  pinned, `aria-haspopup="listbox"`) › `.dropdown-field-value`
  (+ `-value-placeholder` for the unselected ink) + `.dropdown-field-chevron`
  › `.dropdown-field-hint`
- **NOT a native `<select>`** — composes the shipped `.dropdown-list` +
  `.list-option` panel (consumer JS positions and toggles it; TextSelector
  precedent)
- **States**: `:hover`, `:focus-visible` OR `[aria-expanded="true"]` (Primary
  border + ring), `[aria-invalid="true"]` — same ramp as TextField, all the
  same exclusions/compounds

> **The chevron flips 180° on `[aria-expanded="true"]` ONLY** — never on bare
> keyboard focus (arrow direction tracks the PANEL). Structurally verified in
> Figma (the icon's bbox shifts by exactly its own w/h — the corner-rotation
> signature). Uses the CSS `rotate` property (Tailwind v4).
> **Chevron ink is `Neutral/Base`, constant in EVERY state** including error
> (no amber tint) — pixel + variable verified. Glyph is `#chevron-down`
> (Code Connect-resolved; the Figma layer name lies).
> **The error rule is written AFTER the open rule on purpose** — equal
> specificity, so source order gives error+open its amber border while the
> ring and rotation (separate properties) persist. Do not reorder.
> **Unselected accessible name = the label alone** — the placeholder span is
> `aria-hidden` decoration and `aria-labelledby` lists only the title id;
> with a selection, drop `aria-hidden` and append the value id ("label,
> value"). A `<label for>` on a button would clobber the name — use
> `aria-labelledby`.
> **The placeholder ink fails WCAG contrast as authored** (3.11:1) — the one
> waived KNOWN_ISSUES entry in the a11y scanner; designer list.

```html
<div class="dropdown-field">
  <div class="dropdown-field-title-row">
    <span id="at-label" class="dropdown-field-title">Account type</span>
  </div>
  <button class="dropdown-field-trigger" type="button" aria-haspopup="listbox"
          aria-expanded="false" aria-labelledby="at-label">
    <span id="at-value" class="dropdown-field-value dropdown-field-value-placeholder"
          aria-hidden="true">Select an account type</span>
    <svg class="dropdown-field-chevron" aria-hidden="true"><use href="#chevron-down" /></svg>
  </button>
</div>
```

#### TextArea

Labeled multi-line text input. Extracted from Figma Text Area Field
(199:12523) — 6 variants (`Filled` × `Hover` × `Focus`), all 413×104.
**No Error axis exists** — none is invented (designer list: deliberate?).

- **Parts**: `.text-area` › `.text-area-title-row` / `.text-area-title`
  (+ optional `-optional`, `-help`) › `.text-area-input` (the native
  `<textarea>` IS the box — no icon slots to host) › `.text-area-hint`
- **Box**: `h-[79px]` pinned (off Tailwind's scale on purpose), `px-3`
  **`py-2.5`** — the 10px y-padding is authored and differs from the
  siblings (designer list) — top-anchored text, same border/ring ramp as
  the family (token-verified zero deviations)

> **Two labeled corrections of Figma defects**: the value node carries the
> Input style's single-line nowrap/ellipsis (copy-paste artifact — wrapping
> ships, the defect doesn't; a spec check guards the regression), and no
> overflow-clip (it would suppress the scrollbar a fixed-height textarea
> needs).
> **`resize: none` is a library decision, flagged as such** — Figma draws no
> grabber and no overflow state; callers opt in with a resize utility.

```html
<div class="text-area">
  <div class="text-area-title-row">
    <label class="text-area-title" for="notes">Notes</label>
  </div>
  <textarea id="notes" class="text-area-input" placeholder="Anything else?"></textarea>
</div>
```

#### Modal

Confirmation dialog card — the library's first overlay. Extracted from Figma
Modal (557:5127) — 3 variants on a `Type` axis {Destructive, Neutral,
Success}, 480 wide, 308/196/308 (heights emergent, not pinned).

- **Parts**: `.modal` (the card — works as a `<dialog>` or a div) ›
  `.modal-header` (`.modal-title` + a composed bare `.icon-button` close with
  `#x`) › `.modal-description` › optional `.modal-notice` +
  `.modal-notice-destructive` / `-success` (`.modal-notice-label`,
  `.modal-notice-body`) › `.modal-actions` (shipped `.btn-secondary` +
  `.btn-primary`, hug, right-aligned) — plus `.modal-backdrop` and
  `dialog.modal::backdrop`
- **No Type classes on the card** — Figma's Type axis IS the notice banner
  (Neutral omits it structurally; no boolean exists). The height math proves
  it: 196 + 88 banner + 24 gap = 308 exact.
- **Geometry**: `rounded-2xl` (12px), `p-7`/`gap-6`, notice `rounded-md p-4`

> **Both rings are inset box-shadows** — the card's 1px `Stroke/Divider` and
> the banner's 1px accent are inside strokes on CONTENT-DRIVEN heights (a
> real border renders the drawn 308 as 310 — Tabs-Application precedent).
> The card ring shares one declaration with **`--shadow-basic`** (the new
> tokenized "Basic Drop Shadow", 0 8px 24px −4px — also on DropdownList).
> **Destructive binds the PRIMARY (crimson) tints, not the Error ramp** —
> verbatim; the Error ramp remains unused everywhere in the file.
> **The Success banner is raw, unbound hex in Figma** (#f0fdf4/#16a34a/
> #15803d/#166534 — Tailwind-palette greens ≠ the tokenized Success ramp) —
> reproduced verbatim under static-ok waivers; top designer-list item.
> **Untokenized type**: title 18/24/600, notice label 12/16/600 uppercase,
> notice body 13/18 — raw in Figma, no `--text-*` matches (designer list).
> Figma's title `whitespace-nowrap` is an overflow defect, corrected: titles
> wrap. A stray `cursor-pointer` on the actions ROW is excluded.
> **The backdrop is a labeled library extension** — no scrim exists anywhere
> in Figma; the wash (Content/Primary at 45% via color-mix) is unsourced.
> Z-scale per Library Contracts: backdrop z-50, modal z-60.
> **Primary path is the native `<dialog>` + `showModal()`** (free focus trap,
> Escape, restore-on-close, `::backdrop`); the `.modal-backdrop` div fallback
> requires the consumer's own focus trap and Escape — the library ships no
> JS. Backdrop-click dismissal is consumer JS in both paths.

```html
<dialog class="modal" aria-labelledby="m-t" aria-describedby="m-d">
  <div class="modal-header">
    <h2 id="m-t" class="modal-title">Delete this application?</h2>
    <button class="icon-button" aria-label="Close">
      <svg aria-hidden="true"><use href="#x" /></svg>
    </button>
  </div>
  <p id="m-d" class="modal-description">Are you sure you want to proceed?</p>
  <div class="modal-notice modal-notice-destructive">
    <span class="modal-notice-label">Critical warning</span>
    <span class="modal-notice-body">This action cannot be undone.</span>
  </div>
  <div class="modal-actions">
    <button class="btn btn-secondary">Cancel</button>
    <button class="btn btn-primary">Confirm</button>
  </div>
</dialog>
<!-- open with dialog.showModal(); ::backdrop is pre-styled -->
```

#### Tooltip

Dark contrast tooltip with an optional muted title. Extracted (inline
fast-path) from Figma tooltip (582:9178) — a single symbol, no variant axes.

- **Parts**: `.tooltip` (`BG/Contrast` ground, `rounded-lg`, `px-4 py-3`,
  `gap-2`, `shadow-basic`, authored `word-break`), `.tooltip-title`
  (optional — `text-field-label` in `Text/Hint`), `.tooltip-body`
  (`text-body-content` in `Text/Contrast`)

> **Two token firsts**: `BG/Contrast` (#1a1a1a) is a NEW variable added with
> this component (token 58, `--color-surface-contrast`), and the tooltip
> title is the previously-orphaned **`text-field-label` token's first
> consumer** (field labels themselves bind Labels/Strong — the token's name
> lies; designer list updated).
> **`max-w-[280px]` with content hug is a labeled library reading** —
> Figma's frame is a fixed 280 sample, but the authored word-break implies
> wrap-at-limit semantics; short tooltips hug.
> **Not modelled, not invented**: arrow/caret, placement, states. Anchoring
> and show/hide are the consumer's (Popover API pairs well); no z-index is
> baked. Wire `role="tooltip"` + the trigger's `aria-describedby`.

```html
<button class="icon-button" aria-label="What is a routing number?" aria-describedby="tip-1">
  <svg aria-hidden="true"><use href="#circle-help" /></svg>
</button>
<div class="tooltip" role="tooltip" id="tip-1">
  <span class="tooltip-title">Routing number</span>
  <span class="tooltip-body">The nine-digit code on the bottom left of your checks.</span>
</div>
```

#### Toast

Transient floating notification. Extracted (inline fast-path) from Figma
Toast (582:9325) — a PARTIAL `Type` {success, error, info} × `Style` {Full,
Simple} matrix (Simple exists only as info).

- **Full**: `.toast` (Paper card, `rounded-lg`, `p-4`, inset Stroke/Divider
  ring + `shadow-basic` in one declaration — content-driven 66px, Modal
  precedent) + type class + `.toast-icon` (18px caller slot) +
  `.toast-content` (`.toast-title` Field Label / `.toast-body` help-caption)
  + a composed bare `.icon-button` dismiss
- **Simple**: `.toast-simple` — a STATUS-LESS dark `BG/Contrast` full-radius
  pill (15px glyph — off the icon grid, designer list; Content 13/16 in
  Text/Contrast). The Type axis is meaningless for it: no ramp token binds.
- Both carry `z-70` (Library Contracts). Positioning/timers/dismissal are
  the consumer's; `role="status"` for confirmations, `role="alert"` for
  failures.

> **THE STATUS RAMPS FINALLY BIND** — success → `Success/Base`, info →
> `Info/Base` — **but the Type literally named "error" binds `Warning/Base`
> (amber), verbatim**. The sharpest instance of the file-wide slip: the
> sibling variants prove ramps are wired deliberately. `.toast-error` paints
> `text-warning` faithfully; rebind when the designer does.
> The Type class paints ONLY the icon (title/body inks constant). Pass the
> matching glyph: `#circle-check` / `#circle-alert` / `#info`.

```html
<div class="toast toast-success" role="status">
  <svg class="toast-icon" aria-hidden="true"><use href="#circle-check" /></svg>
  <div class="toast-content">
    <span class="toast-title">Document request sent</span>
    <span class="toast-body">Client has been notified to upload their W-9.</span>
  </div>
  <button class="icon-button" aria-label="Dismiss">
    <svg aria-hidden="true"><use href="#x" /></svg>
  </button>
</div>

<div class="toast-simple" role="status">
  <svg aria-hidden="true"><use href="#check" /></svg>
  Template Saved
</div>
```

#### StatusTracker

One step marker in the portal's application-status track. Extracted (inline
fast-path) from Figma Application Status (64:4623) — `Active` {no, yes},
93×16.

- **Base**: `.status-tracker` (Field Label type, `Text/Tertiary`, 14px glyph
  slot painted by currentColor, `gap-2`) + `.status-tracker-active`
  (`Text/Primary`) — **the Active axis is an ink swap only**

> Not modelled, not invented: hover/focus (not interactive in Figma),
> connectors between steps, error/warning step states. Compose the track at
> the call site.

```html
<span class="status-tracker status-tracker-active">
  <svg aria-hidden="true"><use href="#check" /></svg>
  Application
</span>
```

#### Action

One row in the portal's action list. Extracted (inline fast-path) from Figma
Action (71:848) — 3 states: Pending / actionable rest / Done, 720×84 samples
(width the caller's, height emergent 20+44+20).

- **Parts**: `.action` (Paper row, `p-5`/`gap-4`, the OwnerContainer 0.5px
  inset-shadow hairline) + `.action-icon` (18px slot, constant
  Text/Secondary) + `.action-content` (`.action-title` title-medium /
  `.action-description` body-content Tertiary) + optional composed `.badge`
  + a trailing affordance per state
- **States**: rest (no class) — title `Text/Primary` + `.action-cta` (a real
  34px mini button: Paper, 1px Stroke/Divider border, Field Label + 18px
  `#arrow-right` — NOT any shipped `.btn` type); `.action-pending` — title
  demoted to Secondary + `.action-status` chip (12px `#lock` + micro-label
  in `Text/Hint`); `.action-done` — demoted title + chip (12px `#check` +
  micro-label in **`Success/Text`** — more status-ramp adoption)

> **The PENDING chip's Text/Hint-on-Paper fails WCAG (3.11:1)** — the same
> authored-ink defect as the field placeholders, waived in KNOWN_ISSUES;
> designer list. **Figma's arrow layer is named "AttachMoneyRounded"** and
> renders a forward arrow (the naming-lies family); ships `#arrow-right`.
> Not modelled, not invented: hover/pressed (only the CTA is interactive —
> library focus-ring covers it), disabled, compound states.

```html
<div class="action">
  <svg class="action-icon" aria-hidden="true"><use href="#shield-check" /></svg>
  <div class="action-content">
    <span class="action-title">Identity</span>
    <span class="action-description">Verify who you are</span>
  </div>
  <button class="action-cta">Verify <svg aria-hidden="true"><use href="#arrow-right" /></svg></button>
</div>

<div class="action action-done">
  …
  <span class="action-status"><svg aria-hidden="true"><use href="#check" /></svg>Done</span>
</div>
```

#### UtilityButton

The non-inline / special-use button family — a SIBLING of Button / Standard,
not a skin on it. Extracted from Figma Button / Utility (24:4382) — 18
variants on a partial `Size` {MD, SM} × `Type` {Empty, Filled, Rounded,
Text} × `Hover` × `Pressed` matrix.

- **Base**: `.utility-button` — layout only, **a type class is required**
  (the Standard button's rule); SM (34px) is the bare default,
  `.utility-button-md` (54px, drawn for Empty) modifies
- **Types**: `.utility-button-empty` / `-filled` / `-rounded` / `-text`
- **Label convention**: Field Label 13/500 **natural case** (Text type:
  Content 13/400) — never the Standard set's uppercase Button Label
- **Icon slots**: plain `svg` children (18px; 16px in Text), painted by
  currentColor so they ride the ink ramps

| type | box | rest → hover → pressed |
| --- | --- | --- |
| `-empty` | Paper + 1px Stroke/Divider, 4px | ink Secondary → Primary; fill Paper → `Action/Hover` → `Action/Pressed`; **border drops at hover/pressed** |
| `-filled` | solid, 4px, no border | `Primary → Primary/Hover → Primary/Focus`; white ink never fades |
| `-rounded` | ghost pill, no border ever | none → `Action/Hover` → `Action/Pressed`; ink Secondary → Primary |
| `-text` | bare 16px underlined row | ink Tertiary → Primary (**hover = pressed**, byte-identical) |

> **The Empty border is REST-ONLY** — pixel-proven: at hover/pressed both
> Paper and the border drop and the wash composites over the page (the
> hover-variant hexes solve over white, not Paper; the Stroke/Divider
> binding on those variants is a dedup ghost). Ships as border-color
> transparent so geometry never shifts. Designer list.
> **The Text type's Size axis is unwired** (MD ≡ SM, 0/1376 pixel diff) and
> its rest ink is a raw #6f7276 override stacked on a bound Text/Secondary —
> the raw value IS Text/Tertiary's hex, shipped as the token. Designer list.
> **`Primary/Focus` is the pressed fill name again** — wired to `:active`.
> MD's authored w-214 is the sample-hug trap; width is the caller's.
> Not modelled, not invented: disabled (cursor only — unlike Standard, no
> Inactive axis exists), MD Filled/Rounded, focus variants (library ring).

```html
<button class="utility-button utility-button-empty">
  <svg aria-hidden="true"><use href="#dollar-sign" /></svg>
  Add Funds
</button>

<button class="utility-button utility-button-filled utility-button-md">Add Funds</button>
<button class="utility-button utility-button-rounded">Add Funds</button>

<button class="utility-button utility-button-text">
  View statements
  <svg aria-hidden="true"><use href="#chevron-right" /></svg>
</button>
```

---

Further components will be documented here as they are extracted from the
Short App Figma file, one section per component, following the format used in
[_dashboard-archive/DASHBOARD-CLAUDE.md](_dashboard-archive/DASHBOARD-CLAUDE.md).

### Design Tokens (complete enumeration 2026-09-02)

**58 colors, 8 radii, 13 spacing values, 24 text styles, 2 effects (the focus
ring and Basic Drop Shadow).** Colors/spacing/radii come from a **complete Plugin API enumeration of
the file's local variable collection** (`use_figma` →
`figma.variables.getLocalVariableCollectionsAsync` — all 77 variables, applied
or not); typography from the type-preview section (1:2) plus component sweeps.
Browse them rendered in Storybook under **Foundations → Design Tokens**.

> **The applied-only sweep missed 26 of the 56 colors** — the entire Error and
> Info ramps, the Success/Warning/Neutral tint sets, `BG/Page`, `BG/Card` —
> plus ALL spacing and radius variables. The Plugin API enumeration is the
> authoritative completeness source; re-run it when the designer adds tokens.

**Colors** — `Main`-equivalents are unsuffixed (`Primary/Primary` and
`Neutral/Base` both count as the ramp's main shade):

- Primary (crimson): `--color-primary` (#a6192e) / `-hover` / `-focus` /
  `-disabled`, plus tints `-text` / `-bg` / `-ring` / `-track`
- Neutral: `--color-neutral` / `-hover` / `-text` / `-disabled` / `-bg` /
  `-ring` / `-stroke` / `-stroke-hover`
- Content (Figma group **Text**): `--color-content-primary` / `-secondary` /
  `-tertiary` / `-hint` / `-contrast`
- Surface (Figma group **BG**): `--color-surface-paper` (#fffdfb) /
  `-app-page` (#fafaf9) / `-page` (#fdf8f5) / `-card` (#f1f0ee) /
  `-contrast` (#1a1a1a, added with Tooltip)
- Stroke: `--color-stroke-border` / `-divider` / `-hover` (all translucent ink)
- Action: `--color-action-hover` / `-pressed` / `-active` / `-focused`
- Status — **four full ramps**, each Base + Text + BG/Ring/Stroke/Stroke-Hover
  tints: `--color-success*` (#2e6e4e), `--color-warning*` (#b4791c, Text
  #8b5d16), `--color-error*` (#c0362c), `--color-info*` (#1b4e8b)

> **The Figma groups `Text` and `BG` map to the public prefixes `content` and
> `surface`** — avoiding `text-text-secondary` / `bg-bg-paper` utilities and
> matching the dashboard library's API shape. The mapping lives in
> `COLOR_GROUPS` in [scripts/build-theme.mjs](scripts/build-theme.mjs).

> **The Error ramp exists but is applied nowhere** — the field components'
> `Error=Yes` variants bind `Warning/Base` (amber) instead. Now clearly an
> authoring slip (upgraded from an open question once the full enumeration
> surfaced the ramp). On the designer list; build error states against the
> Error ramp only once confirmed.

**Radii** — Figma's scale IS Tailwind's t-shirt naming; emitted verbatim.
xs/sm/md/lg (2/4/6/8px) are byte-identical to Tailwind v4's defaults;
`--radius-xl` (10px) and `--radius-2xl` (12px) **deliberately override**
Tailwind's 12/16 so `rounded-xl` / `rounded-2xl` mean this design system's
corners. `Radius/none` and `Radius/full` are not re-emitted (native
`rounded-none` / `rounded-full` already match). This is the opposite call from
the dashboard library's role names — that file's scale diverged from Tailwind
everywhere; this one builds on it.

**Spacing** — 13 whole-px variables (2–64), every one an exact native Tailwind
step (divide by 4: `Spacing/8` → `p-2`, `Spacing/64` → `p-16`). No
`--spacing-*` tokens on purpose — defining `--spacing-8: 8px` would make `p-8`
mean 8px instead of 32px.

**Typography** — 24 composite `--text-*` tokens, all Inter, line heights
authored in px (only `Link` is Auto):

| Role | tokens |
| --- | --- |
| Display & Title | `text-display` 28/34 · `text-display-large` 30/38 · `text-title` 22/26 · `text-title-medium` 16/20 (all 500) |
| Metric | `text-metric-large` 30/34 · `text-metric-medium` 26/30 · `text-metric-small` 20/26 (all 500) |
| Body | `text-lead` 16/24/500 · `text-body` 15/20 · `text-input` 16/24 · `text-body-content` 13/16 · `text-help-caption` 12/14 |
| Labels & UI | `text-label` 14/20 · `text-label-strong` 14/20/500 · `text-field-label` 13/16/500 · `text-button-label` 14/20/600+10% · `text-link` 14/Auto · `text-eyebrow` 11/16/600+10% · `text-tag-pill` 11/16/600+5% · `text-timestamp` 12/16 · `text-data-key` & `text-micro-label` 9/12/600+8% · `text-lockup-wordmark` 15/17/600+10% · `text-lockup-tagline` 9/11/500+16% |

> **Casing is not baked into any token.** The preview renders Eyebrow,
> Micro-Label, Button Label, Tag & Pill, Data Key and the Lockup styles
> uppercase, but the API exposes no transform binding — casing stays the
> caller's (Chip/Divider precedent) until confirmed per component.

**Focus ring** — Figma's `Primary Ring` effect: spread-only drop shadow,
0/0/0/**3px** in `Primary/Ring` (#a6192e38). Ships as the `focus-ring` utility
(outline at offset 0 — the ring sits **outside** the element, unlike the
dashboard's inset ring) and as `--shadow-focus-ring` for real-shadow cases.

**Radii / spacing / border widths** — **this file defines no such variables**;
geometry is raw per component (verified across 16 subtree sweeps). No
`--radius-*` or `--border-*` tokens are emitted yet; introduce role tokens only
if recurring raw values emerge. Spacing stays on Tailwind's native scale.

The pipeline is generated — do not edit the theme CSS by hand:

```
tokens/figma-tokens.json  ──scripts/build-theme.mjs──>  src/themes/valiify.css
```

Regenerate with `npm run build:theme` (also runs as part of `npm run build`).
To pick up Figma changes, re-extract into the JSON, then regenerate.

Tokens live in a Tailwind `@theme` block, so **each one generates utilities** —
that is the intended way to consume them (`--color-primary` → `bg-primary`,
`text-primary`; `--radius-control` → `rounded-control`; `--text-body-1` →
`text-body-1`). Prefer those over hand-written `var(--color-…)`.

#### Token extraction lessons (paid for once already — do not relearn them)

These were all learned the hard way on the dashboard library and apply verbatim
to the Short App extraction:

- **`get_variable_defs` only returns variables applied to a layer.** A token
  defined in Figma but not yet used anywhere will be silently absent. This bit
  twice on the dashboard (`Surface/Card`, `Critical/Content`). Audit token-group
  completeness with `search_design_system`, which lists variables whether or not
  anything uses them.
- **Duplicate Figma style names silently drop tokens.** The API returns a keyed
  object, so two styles sharing a name collapse into one — and the survivor's
  values get attributed to the wrong style. If a token looks wrong, check for a
  name collision first.
- **`lineHeight: 100` from the API is Figma's "Auto", not 100%.** Emit
  `line-height: normal` (the font's intrinsic metrics, ~1.21x for Inter).
  Emitting `1` makes those styles visibly too tight.
- **Every Figma letter-spacing value is a percentage of font size, never px.**
  Emit `em`: `10%` → `0.1em`, `0.4%` → `0.004em`.
- **`--text-*` tokens carry neither `font-family` nor `text-transform`.** Mono
  styles need an explicit `font-mono`; uppercase label styles need paired
  `type-*` utilities that bundle the casing (the generator handles this).
- **Do not redefine Tailwind's own token names.** Tailwind v4 ships
  `--radius-xs`/`-sm`/`-md` — redefining those silently changes
  `rounded-xs`/`-sm`/`-md` for consumers. Name radii by role instead
  (the dashboard used `--radius-micro`/`-tight`/`-control`/`-surface`/`-pill`).
- **Never define spacing tokens like `--spacing-8: 8px`.** Tailwind v4's scale
  is a multiplier of `--spacing` (0.25rem); `--spacing-8: 8px` would make `p-8`
  mean 8px instead of 32px. Whole-pixel Figma spacing maps to native utilities
  (8px → `p-2`); half-pixel values need arbitrary syntax (`p-[7.5px]` — the
  multiplier form does not compile for half-pixels).

#### CSS traps that transfer to every component

- **Chrome renders a 0.5px hairline border as a full 1px** — measured at 1x and
  2x DPI, and the extra pixel is really in the layout box. A hairline adds
  **2px** to an element's height. Consequence: **never size a bordered
  component with `min-height`** — use an explicit `height` measured from the
  Figma variant frame.
- **Side-specific hairlines need the side-specific length utility.**
  `border-[length:…]` sets all four sides, so `border-t border-[length:var(--border-thin)]`
  silently produces a 0.5px box plus a 1px top. Write
  `border-t border-t-[length:var(--border-thin)]`.
- **Tailwind v4, not v3.** `rounded-[--token]` and `border-[length:--token]`
  (implicit-var shorthand) were dropped — they compile to invalid CSS browsers
  discard without warning. Always write `var()` explicitly, and check
  `dist/index.css` when a style mysteriously doesn't apply.
- **Chrome floors fractional `border-width`** (`1.5px` computes to `1px`), and
  renders `text-decoration-thickness: 0.5px` as a full 1px. Fractional rings
  need a masked conic-gradient; fractional underlines need a background
  gradient band.
- **Only `@utility` registers a real Tailwind utility** that can be `@apply`-ed;
  a plain class in `@layer utilities` cannot. See
  [src/utilities/index.css](src/utilities/index.css).
- **Figma's "Auto" line height makes the line box font-dependent** — component
  heights must not be derived from it. Pin explicit heights measured from the
  Figma variant frames.
- **Figma styles named "- Bold" often resolve to Medium/500.** Read the weight
  the style reports, never map the name.

## Library Contracts (decided 2026-09-02)

Decisions a consumer or contributor would otherwise discover by surprise:

- **Light-only, by design.** The token set is light-mode only and no
  dark-mode variant is planned until the Figma file defines one — a
  deliberate non-goal, not an oversight. Do not add `prefers-color-scheme`
  blocks to components.
- **Breakpoints**: the library defines no `--breakpoint-*` tokens; Tailwind's
  native scale is the contract. The single library-authored media query is
  Header's 768px mobile switch (`md`), documented there. New responsive
  behaviour should use Tailwind's breakpoints, never new raw values.
- **Z-index scale** (established ahead of the Confirmation Modal):
  content `z-0` · sticky chrome (Header) `z-40` · overlay backdrop `z-50` ·
  modal/panel `z-60` · toast `z-70`. Header already ships z-40; overlay
  components must use this scale, not invent values.
- **No class prefix.** Component classes are unprefixed; the collision risk
  with Tailwind utilities is gated mechanically instead (`verify:bundle`
  compiles every component class name through Tailwind + the theme and fails
  on any that resolve to a utility — the `.list-item`/`.text-field-label`
  bug class). Consumers who need namespacing can use Tailwind v4's `prefix()`
  on their own utilities; library classes stay stable API.
- **Undefined tokens are a build failure.** `verify:bundle` also fails on any
  fallback-less `var(--…)` in dist that the bundle never defines (the
  `--color-surface-frame` bug class).
- **Candidate refactor, deliberately deferred**: the sprite-glyph paint block
  (`fill:none; stroke:currentColor; stroke-width:2; …`) is repeated in 8+
  component files and could become one `@utility icon-glyph` — do it as a
  dedicated pass with full visual re-verification, not opportunistically.

## Installation

```bash
npm install @valiify/shortapp-ui tailwindcss
```

CSS-only — there is no Tailwind plugin to register, and no `tailwind.config.js`.
**Two supported entry points**, and the difference is load-bearing:

| Entry                             | You get                                              | You do NOT get          |
| --------------------------------- | ---------------------------------------------------- | ----------------------- |
| `@valiify/shortapp-ui` (prebuilt) | component classes + tokens as CSS custom properties  | token-derived utilities |
| `@valiify/shortapp-ui/source`     | the above **plus** token-generated utility classes   | —                       |

```css
/* prebuilt */
@import "tailwindcss";
@import "@valiify/shortapp-ui";

/* source — consumer's Tailwind processes our @theme */
@import "tailwindcss";
@import "@valiify/shortapp-ui/source";
```

`./source` maps to [src/library.css](src/library.css), which deliberately omits
`@import "tailwindcss"` so the consumer's config stays in charge.

**Fonts are not bundled.** CSS requires every `@import` to precede all other
rules, so a font import inside `dist/index.css` is discarded when a consumer
imports that bundle. Opt in with `@import "@valiify/shortapp-ui/fonts";` as the
**first** line, or self-host.

> **Token names are public API.** Renaming or removing a token is a breaking
> change — consumers write token utilities and `var(--…)` in their own code.
> Changing a token's _value_ is fine; changing its _name_ is not.

## Development Status

**Current Phase**: Infrastructure setup — migrated from the dashboard library
**Next Phase**: Short App Figma token extraction, then component build-out

Completed:

- ✅ Infrastructure migrated: build pipeline, verification tooling
  (visual / a11y / static / layers), component generator, Storybook 10,
  TypeScript setup, examples
- ✅ Dashboard content archived to `_dashboard-archive/` for reference
- ✅ Package renamed to `@valiify/shortapp-ui`
- ✅ Icon sprite system retained (Lucide, shared with the dashboard library)

Pending:

- ⏳ Extract Short App design tokens from Figma into
  `tokens/figma-tokens.json`; regenerate the theme
- ⏳ Build out Short App components (each with a visual spec)
- ⏳ Chromatic visual regression — deliberately deferred until the full
  library is complete
- ⏳ NPM publishing, Storybook deployment

## Building a Component

**The full process is [docs/component-process.md](docs/component-process.md).
Read it before starting.** It covers locating the component in Figma, the
subagent extraction brief, the CSS traps, and what Figma routinely gets wrong.

The short version:

```bash
# 1. sweep the component's metadata first — one cheap call, gives the variant
#    matrix and catches changes the designer did not mention
# 2. extract the spec with a subagent (cheapest tool per question — see the doc)
npm run new:component Badge     # scaffold — one name only
# populate badge.css by hand
# add an entry to scripts/visual-specs.mjs        <- not optional
# document the classes in the Quick Reference above
npm run build && npm run typecheck
npm run verify:component Badge
npm run verify:visual -- Badge  # scoped while iterating; full suite before commit
npm run audit                   # coverage across the library
```

Three rules that are load-bearing:

1. **Scaffold first** — `npm run new:component` writes the CSS from the
   template, registers the `@import` alphabetically, creates the story, and
   adds the class type. Creating those by hand gets one of them wrong.
2. **Every component needs a visual spec.** A component with no entry in
   [scripts/visual-specs.mjs](scripts/visual-specs.mjs) is unverified however
   good its CSS looks. On the dashboard library the harness caught four defects
   in components that already looked finished.
3. **Size bordered components with `height`, not `min-height`** — Chrome rounds
   the 0.5px hairline up to a full 1px, so a hairline adds 2px of height and
   the component lands past its Figma frame.

Pattern references: the dashboard library's
[button.css](_dashboard-archive/components/button.css) (variants, sizes,
states) and [input.css](_dashboard-archive/components/input.css) (nested state
selectors) remain the best worked examples of the CSS structure — the styling
is dashboard's, the structure is the library's.

### Visual verification — the check that actually catches things

```bash
npm run storybook              # in one terminal
npm run verify:visual          # every component with a spec
npm run verify:visual -- Input Button
npm run verify:visual -- --url http://localhost:6007
```

Renders each story in headless Chromium and asserts **computed** styles against
values extracted from Figma. This is the only check that catches a component
which compiles cleanly, uses every right token, and still renders at the wrong
size.

- Expected values live in [scripts/visual-specs.mjs](scripts/visual-specs.mjs);
  the runner is [scripts/visual-verify.mjs](scripts/visual-verify.mjs).
- Compare colours with `{ token: '--color-x' }`, never a literal — the theme
  emits `oklch()`, so a hardcoded `rgb()` fails even when the colour is right.
- Default tolerance is exact. Widen it only where the delta is understood and
  written down next to the check; a loose tolerance hides regressions.

### Accessibility verification

```bash
npm run verify:a11y                    # every story
npm run verify:a11y -- ComponentName   # one component
```

axe-core over each story in headless Chromium. Exits non-zero when anything
fires. This is the third lens and it sees what the other two cannot — names,
roles, ARIA wiring and contrast.

> **Do not check accessible names with `textContent`.** It reads through
> `display:none`, so a hidden label still looks present. Use this script or
> Playwright's `ariaSnapshot()`.

> **Let transitions settle before measuring computed colour.**
> `transition-colors` covers `outline-color`, so a focus ring read immediately
> after `Tab` returns an in-flight blend. Wait ~400ms.

### Static verification

```bash
npm run verify:component Avatar
```

Reads the source rather than rendering it: hardcoded colours / radii / type,
`@layer components` wrapper, `:hover` guarded against disabled, import
registered and alphabetical, and whether the component is typed, storied and
present in `dist`.

The two checks are complementary and neither replaces the other — this one
cannot see a 1px height error, and the visual harness cannot see a hardcoded
hex that happens to match its token.

> **Deliberate raw values need a waiver pragma, never a workaround.** When a
> value is raw because FIGMA binds no variable (DropdownList's shadow,
> Skeleton's fill), put this on the flagged line or the line above:
> `/* static-ok(hardcoded-color): <reason, citing the designer list> */`
> Waived findings print in yellow (never silent), and a pragma that waives
> nothing fails as `stale-waiver` — so waivers can't outlive the defect.

### Bundle verification

```bash
npm run verify:bundle   # after npm run build — reads dist
```

Two gates over the build output that no other harness can see (both bug
classes shipped for real before this existed):

1. **Undefined `var()` references** — a fallback-less `var(--x)` defined
   nowhere in the bundle resolves to nothing with no error anywhere (the
   `--color-surface-frame` dashboard-leftover bug).
2. **Class/utility collisions** — every component class name is compiled
   through the real Tailwind + theme as a candidate; any name that produces
   a utility rule collides (the `.list-item` / `.text-field-label` bugs).
   A built-in canary (`flex`) must be flagged every run or the gate fails
   itself rather than passing vacuously.

Both run in CI, together with `verify:a11y` (which waives documented design
defects via `KNOWN_ISSUES` in [scripts/a11y-scan.mjs](scripts/a11y-scan.mjs)
— printed, never silent). The consolidated designer list lives at
[docs/designer-list.md](docs/designer-list.md).

## Storybook

```bash
npm run storybook
```

View all components with interactive controls and documentation at
http://localhost:6006. Storybook is the audit surface — the visual and a11y
harnesses both drive it, so keep it running while building components.

## Build

```bash
npm run build       # Regenerate theme + icons, then compile src/index.css -> dist/index.css
npm run build:theme # Regenerate src/themes/valiify.css from tokens/figma-tokens.json
npm run build:icons # Rebuild the icon sprite
npm run dev         # Compile in watch mode
npm run typecheck   # tsc --noEmit over types/, stories/, .storybook/
npm run format      # Format code with Prettier
```

Output:

- `dist/index.css` - the entire published artifact (tokens + component styles)

`dist/index.css` deliberately contains **no Tailwind utility classes** — a
component library shouldn't ship an app's utilities. Consumers generate their
own. Storybook gets utilities via `@source` globs in its preview CSS.

Type definitions are hand-maintained in [types/](types/) and shipped as-is;
they are not generated.

`src/themes/valiify.css` IS generated — from `tokens/figma-tokens.json` via
`scripts/build-theme.mjs`. Edit the JSON, not the CSS.

## Icon System

The Lucide-based icon sprite system is **shared with the dashboard library**
and carries over unchanged:

- Sprite system: `src/icons/README.md` (build process)
- Integration guide: `src/components/ICON-SYSTEM.md` (usage patterns)
- Icon list: `src/icons/icon-list.txt` (searchable names)

Icon stroke weights and per-size classes will be re-verified against the Short
App Figma once its icon usage is extracted.

## Architecture

- **CSS-only** - Zero JavaScript dependencies, no Tailwind plugin, no `tailwind.config.js`
- **Tailwind v4 `@theme`** - Tokens generate utilities automatically
- **Framework-agnostic** - Works with React, Vue, Svelte, vanilla HTML, etc.
- **Modular** - Import only what you need

## Design System

Based on the Valiify Short App design system from Figma
(file key: `PA5pr1Q8KLfbjTxdAbFm0V`, file: Updated-Short-App).

## Links

- **Repository**: https://github.com/BubbaCoop/Valiify-Application-Component-Library
- **NPM Package**: TBD (will publish as `@valiify/shortapp-ui`)
- **Figma**: Updated-Short-App (PA5pr1Q8KLfbjTxdAbFm0V)
- **Storybook**: TBD (will be deployed)
- **Dashboard library (predecessor)**: https://github.com/BubbaCoop/Valiify-dashboard-ui

## License

MIT © Valiify
