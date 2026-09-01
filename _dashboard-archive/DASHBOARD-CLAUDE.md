# Valiify Dashboard UI Component Kit

A Tailwind CSS component library for building Valiify Dashboard applications. CSS-only, zero JavaScript dependencies, framework-agnostic.

## Git

**Never run `git commit` or `git push`.** Stage changes with `git add` if asked,
then stop — I write all commit messages and commit myself.

## Quick Reference

### Available Components (Phase 1 - Proof of Concept)

#### Button

- **Base**: `.btn` — Display=outline at medium size (see the note below)
- **Variants**: `.btn-primary`, `.btn-outline`, `.btn-empty`, `.btn-critical` (not in Figma's Button set — see Modal)
- **Sizes**: `.btn-sm` (24px), `.btn-lg` (32px) - medium (28px) is default
- **States**: `:hover`, `:active`, `:focus-visible`, `:disabled`, `[aria-selected="true"]`
- **Heights**: Explicitly set (24px / 28px / 32px) per Figma measurements
- **Typography**: one style PER SIZE — `text-action-s` (12px), `text-action-m`
  (12.5px, default), `text-action-l` (13px). They are not shared.
- **Icons**: Use Icon component with size-matched icons (sm=13px, md=14px, lg=15px)

> **There is no "default" Display value.** Figma's axis is
> primary / outline / empty, and a bare `.btn` is outline — that is all
> "default" ever meant here. The Storybook control still offers `default`, but
> it renders a bare `.btn`, not a fourth variant.
>
> **Fixed 2026-08-24:** the base previously took outline's _rest appearance_
> while its interaction rules lived inside `.btn-outline`, so a bare `.btn`
> looked like an outline button and responded to nothing — inert on hover and on
> `aria-selected`. The ramp now lives on the base and `.btn-outline` is an
> explicit alias for the same thing.
>
> **Outline and empty share one ramp in Figma** — hover `Action/Subtle`,
> selected `Action/Hover`, active `Primary/Soft` + `Primary/Main` — differing
> only in the rest border and whether active draws one. That is why the ramp
> sits on the base, and it also closed the two states `.btn-empty` was missing.
>
> The filled displays override all of it. Because the base `:active` sets both a
> border colour and `Primary/Main` text, `.btn-primary` and `.btn-critical` reset
> `border-transparent` **and** `Content/Contrast` in their own active rules —
> without the second, a pressed primary renders a blue label on a blue fill.
>
> **The `md` size default is not verified against Figma.** Outline as the base
> Display is grounded (it is the set's rest default), but nothing confirms
> medium as the default size — the set's top-left variant is `sm`. Unresolved.

```html
<!-- Basic buttons -->
<button class="btn btn-primary">Primary Button</button>
<button class="btn btn-outline btn-sm">Small Outline</button>
<button class="btn btn-empty btn-lg">Large Empty</button>
<button class="btn btn-primary" disabled>Disabled</button>
<button class="btn btn-outline" aria-selected="true">Selected</button>

<!-- Buttons with icons (using Icon component + sprite) -->
<button class="btn btn-primary">
  <svg class="icon icon-size-14" aria-hidden="true">
    <use href="#save" />
  </svg>
  Save
</button>

<button class="btn btn-outline btn-sm">
  <svg class="icon icon-size-13" aria-hidden="true">
    <use href="#filter" />
  </svg>
  Filter
</button>

<!-- Icon-only button (requires aria-label) -->
<button class="btn btn-outline" aria-label="Settings">
  <svg class="icon icon-size-14" aria-hidden="true">
    <use href="#settings" />
  </svg>
</button>
```

#### Input

Complete form input system with labels, help text, icons, and error messages.

- **Container**: `.input-container` (wraps label + input + error)
- **Label**: `.input-label` (10px semibold uppercase, optional help button)
- **Help Button**: `.icon-button icon-button-xs` (12px icon button)
- **Field**: `.input-field` (the styled input row container)
- **Input**: `.input` (actual input element, unstyled)
- **Icons**: `.input-icon-left`, `.input-icon-right` (14px icons)
- **Error**: `.input-error-message` (11px error text)
- **Sizes**: `.input-sm` (25px), `.input-md` (29px), `.input-lg` (35px, default)
- **BG Variants**: default (white, `surface-paper`), `.input-bg-neutral` (`surface-card`)
- **States**: `.input-error`, `:hover`, `:focus-within`, `:disabled`

Each size carries padding **and** type — lg and md are both Body 1 (13px) at
different padding, sm drops to Micro L (11px):

| Size | Padding (x / y) | Type | Height |
| ---- | --------------- | ---- | ------ |
| sm   | 8 / 5.5         | 11px | 25px   |
| md   | 10 / 4          | 13px | 29px   |
| lg   | 12 / 7          | 13px | 35px   |

> Sizes changed on **2026-08-22** (were 29 / 33 / 35) so Input and DropdownField
> line up. The placeholder also moved from `content-faint` to `content-tertiary`
> in the same update. Note DropdownField's placeholder is still `content-faint`
> — the two field types genuinely differ in the design file.
>
> `py-[5.5px]` needs arbitrary syntax: Tailwind's multiplier only steps in whole
> pixels, so there is no multiplier form for a half-pixel.

```html
<!-- Complete form field -->
<div class="input-container">
  <div class="input-label">
    <span>Email Address</span>
    <button class="icon-button icon-button-xs" aria-label="Help">
      <svg class="icon icon-size-12" aria-hidden="true">
        <use href="#custom-help" />
      </svg>
    </button>
  </div>

  <div class="input-field input-md">
    <svg class="input-icon-left icon icon-size-14" aria-hidden="true">
      <use href="#mail" />
    </svg>
    <input type="email" class="input" placeholder="you@example.com" />
  </div>

  <div class="input-error-message">Please enter a valid email address</div>
</div>

<!-- Simple input (no label/icons) -->
<div class="input-container">
  <div class="input-field">
    <input type="text" class="input" placeholder="Enter text..." />
  </div>
</div>

<!-- Small input with neutral background -->
<div class="input-container">
  <div class="input-field input-sm input-bg-neutral">
    <input type="text" class="input" placeholder="Search..." />
    <svg class="input-icon-right icon icon-size-14" aria-hidden="true">
      <use href="#search" />
    </svg>
  </div>
</div>

<!-- Error state -->
<div class="input-container">
  <div class="input-field input-error">
    <input type="text" class="input" value="Invalid value" />
  </div>
  <div class="input-error-message">This field is required</div>
</div>

<!-- Disabled -->
<div class="input-container">
  <div class="input-field">
    <input type="text" class="input" disabled value="Disabled input" />
  </div>
</div>
```

#### Textarea

Multi-line text input field with labels, help text, and error messages. Separate component from Input for multi-line text entry like comments, descriptions, and messages.

- **Container**: `.textarea-container` (wraps label + textarea + error/counter)
- **Label**: `.textarea-label` (10px semibold uppercase, optional help button)
- **Help Button**: `.icon-button icon-button-xs` (12px icon button)
- **Field**: `.textarea-field` (the styled textarea container)
- **Textarea**: `.textarea` (actual textarea element, resizable)
- **Error**: `.textarea-error-message` (11px error text)
- **Counter**: `.textarea-counter` (optional character counter)
- **Sizes**: none — height is set by `rows`, a height utility, or the resize handle
- **BG Variants**: default (white, `surface-paper`), `.textarea-bg-neutral` (`surface-card`)
- **States**: `.textarea-error`, `:hover`, `:focus-within`, `:disabled`

> **Height is deliberately not styled.** Figma defines one geometry — 12px / 7px
> padding, 6px radius, 0.5px hairline, Body 1 text — across 12 variants
> (state × filled × error), and **no Size property**. A multi-line box's height
> is a usage decision, so the field hugs its `<textarea>`: size it with `rows`,
> a height utility, or the resize handle. Pair an explicit height with
> `resize-none` for a fixed box.
>
> `.textarea-counter` is a library extension, not in the design file.

```html
<!-- Complete textarea field -->
<div class="textarea-container">
  <div class="textarea-label">
    <span>Description</span>
    <button class="icon-button icon-button-xs" aria-label="Help">
      <svg class="icon icon-size-12" aria-hidden="true">
        <use href="#custom-help" />
      </svg>
    </button>
  </div>

  <div class="textarea-field">
    <textarea
      class="textarea"
      rows="4"
      placeholder="Enter description..."
    ></textarea>
  </div>

  <div class="textarea-counter">45 / 500</div>
</div>

<!-- Simple textarea -->
<div class="textarea-container">
  <div class="textarea-field">
    <textarea class="textarea" rows="4" placeholder="Enter text..."></textarea>
  </div>
</div>

<!-- Small textarea with neutral background -->
<div class="textarea-container">
  <div class="textarea-field textarea-sm textarea-bg-neutral">
    <textarea class="textarea" rows="3" placeholder="Quick note..."></textarea>
  </div>
</div>

<!-- Error state -->
<div class="textarea-container">
  <div class="textarea-field textarea-error">
    <textarea class="textarea" rows="4">Invalid content</textarea>
  </div>
  <div class="textarea-error-message">Please provide more details</div>
</div>

<!-- Disabled -->
<div class="textarea-container">
  <div class="textarea-field">
    <textarea class="textarea" rows="4" disabled>Cannot edit this</textarea>
  </div>
</div>
```

#### MenuItem

Single row within a dropdown menu or navigation list. Supports left icon, avatar, badge, subtitle, right icon, and right text slots.

- **Base**: `.menu-item` (defaults to md; full-width flex row)
- **Parts**: `.menu-item-text` (flex column wrapper), `.menu-item-title`,
  `.menu-item-subtitle` (11px, same at every size), `.menu-item-right-text`,
  `.menu-item-badge` (20px tinted icon tile). Use the Avatar component
  (`.avatar avatar-md`) for the initials bubble.
- **Sizes**: `.menu-item-sm` (11px / 10×6 padding), `.menu-item-md` (12.5px / 12×7, default),
  `.menu-item-lg` (13px / 12×11)
- **Variant**: `.menu-item-combined` — medium-weight primary title, designed for `lg`
- **States**: `:hover`, `:focus-visible`, `[aria-selected="true"]` /
  `[aria-checked="true"]`, `:disabled` / `[aria-disabled="true"]`
- **Icons**: sm uses 12px icons, md and lg use 15px

> **Heights are content-driven** (padding + line box), matching Figma's hug
> behaviour — 25 / 29 / 42px with a right icon present. They are deliberately
> not hardcoded, because the sm title uses an Auto line height.

```html
<!-- Simple row -->
<button class="menu-item" role="menuitem">
  <span class="menu-item-text">
    <span class="menu-item-title">Daily</span>
  </span>
</button>

<!-- Selected row with a check -->
<button class="menu-item" role="menuitem" aria-selected="true">
  <span class="menu-item-text">
    <span class="menu-item-title">Weekly</span>
  </span>
  <svg class="icon icon-size-15" aria-hidden="true">
    <use href="#check" />
  </svg>
</button>

<!-- Left icon + keyboard shortcut -->
<button class="menu-item" role="menuitem">
  <svg class="icon icon-size-15" aria-hidden="true">
    <use href="#settings" />
  </svg>
  <span class="menu-item-text">
    <span class="menu-item-title">Preferences</span>
  </span>
  <span class="menu-item-right-text">⌘,</span>
</button>

<!-- Large row with avatar and subtitle -->
<button class="menu-item menu-item-lg" role="menuitem">
  <span class="avatar avatar-md">NC</span>
  <span class="menu-item-text">
    <span class="menu-item-title">Nicholas Cooper</span>
    <span class="menu-item-subtitle">Primary applicant</span>
  </span>
</button>

<!-- Combined variant: badge + primary title -->
<button class="menu-item menu-item-lg menu-item-combined" role="menuitem">
  <span class="menu-item-badge">
    <svg class="icon icon-size-12" aria-hidden="true">
      <use href="#users" />
    </svg>
  </span>
  <span class="menu-item-text">
    <span class="menu-item-title">Combined</span>
    <span class="menu-item-subtitle">Both Applicants</span>
  </span>
</button>

<!-- Small row -->
<button class="menu-item menu-item-sm" role="menuitem">
  <span class="menu-item-text">
    <span class="menu-item-title">Quarterly</span>
  </span>
</button>

<!-- Disabled -->
<button class="menu-item" role="menuitem" disabled>
  <span class="menu-item-text">
    <span class="menu-item-title">Archived</span>
  </span>
</button>
```

#### DropdownMenu

Overlay panel holding a vertical list of MenuItem rows. Rows stretch to the
panel width on their own, so they need no extra width class.

- **Base**: `.dropdown-menu` (200px minimum width, 4px padding, `rounded-surface`, `shadow-panel`)
- **Parts**: `.dropdown-menu-divider`
- **Positioning**: `.dropdown` (relative wrapper) + `.dropdown-panel` (absolute, below the trigger)
- **States**: `:focus-visible`

> `.dropdown-menu-divider` is **not in Figma yet**. It is composed from existing
> tokens (0.5px `stroke-divider` rule) for grouped menus; confirm the treatment
> with the designer before relying on it.

**Opening and closing.** The library ships no JavaScript, so the consuming app
drives two attributes:

| Element           | Attribute                         |
| ----------------- | --------------------------------- |
| trigger           | `aria-expanded="true" \| "false"` |
| `.dropdown-panel` | `hidden` present / absent         |

`.dropdown-panel` deliberately declares no `display`, so the native `hidden`
attribute keeps working; a `[hidden] { display: none }` guard backs it up. Do
**not** add a display utility to the panel — it would defeat `hidden` and the
menu could never close.

```html
<!-- Select-style menu -->
<div class="dropdown-menu" role="menu">
  <button class="menu-item" role="menuitem" aria-selected="true">
    <span class="menu-item-text"
      ><span class="menu-item-title">Weekly</span></span
    >
    <svg class="icon icon-size-15" aria-hidden="true">
      <use href="#check" />
    </svg>
  </button>
  <button class="menu-item" role="menuitem">
    <span class="menu-item-text"
      ><span class="menu-item-title">Daily</span></span
    >
  </button>
  <button class="menu-item" role="menuitem">
    <span class="menu-item-text"
      ><span class="menu-item-title">Monthly</span></span
    >
  </button>
</div>

<!-- Action menu with a divider before a destructive row -->
<div class="dropdown-menu" role="menu">
  <button class="menu-item" role="menuitem">
    <svg class="icon icon-size-15" aria-hidden="true">
      <use href="#pencil" />
    </svg>
    <span class="menu-item-text"
      ><span class="menu-item-title">Edit</span></span
    >
  </button>

  <div class="dropdown-menu-divider"></div>

  <button class="menu-item" role="menuitem">
    <svg class="icon icon-size-15 text-critical" aria-hidden="true">
      <use href="#trash-2" />
    </svg>
    <span class="menu-item-text">
      <span class="menu-item-title text-critical">Delete</span>
    </span>
  </button>
</div>

<!-- Anchored under a trigger (positioning is the consumer's) -->
<!-- Anchored under a trigger -->
<div class="dropdown">
  <button class="btn btn-outline" aria-expanded="false" aria-haspopup="menu">
    Weekly
    <svg class="icon icon-size-14" aria-hidden="true">
      <use href="#chevron-down" />
    </svg>
  </button>
  <div class="dropdown-panel" hidden>
    <div class="dropdown-menu" role="menu">
      <!-- .menu-item rows -->
    </div>
  </div>
</div>
```

#### DropdownField

Dropdown select field for choosing from a list of options. Supports avatar and
left icon, with interaction states across 3 sizes. Structurally mirrors Input,
and pairs with DropdownMenu for the panel.

- **Container**: `.dropdown-field-container` (wraps label + field + error)
- **Label**: `.dropdown-field-label` (10px semibold uppercase, optional help button)
- **Trigger**: `.dropdown-field` (defaults to lg)
- **Value**: `.dropdown-field-value` (chosen, `content-primary`) /
  `.dropdown-field-placeholder` (empty, `content-faint`)
- **Slots**: `.dropdown-field-icon` (14px leading), `.dropdown-field-chevron` (14px trailing),
  Avatar for the initials bubble — `avatar-sm` (18px) at lg, `avatar-xs` (16px) at md/sm
- **Error**: `.dropdown-field-error-message` (11px)
- **Sizes**: `.dropdown-field-sm` (25px), `.dropdown-field-md` (29px), `.dropdown-field-lg` (35px, default)
- **BG Variants**: default (white, `surface-paper`), `.dropdown-field-bg-neutral` (`surface-card`)
- **States**: `:hover`, `:focus-visible`, `[aria-expanded="true"]`,
  `.dropdown-field-error`, `:disabled`

Open state comes from `aria-expanded="true"` on the trigger: it takes the focus
ring and rotates the chevron 180°. Both icons are 14px at every size.

Heights match Input exactly (35 / 29 / 25), so the two field types can sit
side by side in a form row.

> **Avatar sizing is the call site's choice, not automatic.** This component
> used to resize its own initials bubble with a descendant selector. That copy
> was retired in favour of the shared Avatar component, so pick `avatar-sm` at
> lg and `avatar-xs` at md/sm yourself — the same way you pick `.icon-size-*`.

> The error hairline is deliberately overridden by the open ring, matching the
> active + error variants in Figma. Disabled leaves the border alone, so a
> disabled field in error keeps its crimson hairline.
>
> The Dropdown Field Container has **no BG property in Figma yet**.
> `.dropdown-field-bg-neutral` mirrors the Text Input Container's White/Neutral
> pair so the three field types stay interchangeable; confirm with the designer.

```html
<!-- Complete field, closed -->
<div class="dropdown-field-container">
  <div class="dropdown-field-label">
    <span>Frequency</span>
    <button class="icon-button icon-button-xs" aria-label="Help">
      <svg class="icon icon-size-12" aria-hidden="true">
        <use href="#custom-help" />
      </svg>
    </button>
  </div>

  <div class="dropdown">
    <button
      class="dropdown-field"
      aria-haspopup="listbox"
      aria-expanded="false"
    >
      <svg class="dropdown-field-icon icon icon-size-14" aria-hidden="true">
        <use href="#calendar" />
      </svg>
      <span class="dropdown-field-placeholder">Select</span>
      <svg class="dropdown-field-chevron icon icon-size-14" aria-hidden="true">
        <use href="#chevron-down" />
      </svg>
    </button>

    <div class="dropdown-panel" hidden>
      <div class="dropdown-menu" role="listbox">
        <button class="menu-item" role="option" aria-selected="false">
          <span class="menu-item-text"
            ><span class="menu-item-title">Weekly</span></span
          >
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Filled -->
<button class="dropdown-field" aria-haspopup="listbox" aria-expanded="false">
  <span class="dropdown-field-value">Weekly</span>
  <svg class="dropdown-field-chevron icon icon-size-14" aria-hidden="true">
    <use href="#chevron-down" />
  </svg>
</button>

<!-- With avatar -->
<button class="dropdown-field" aria-haspopup="listbox" aria-expanded="false">
  <span class="avatar avatar-sm">NC</span>
  <span class="dropdown-field-value">Nicholas Cooper</span>
  <svg class="dropdown-field-chevron icon icon-size-14" aria-hidden="true">
    <use href="#chevron-down" />
  </svg>
</button>

<!-- Small, error -->
<div class="dropdown-field-container">
  <button
    class="dropdown-field dropdown-field-sm dropdown-field-error"
    aria-haspopup="listbox"
    aria-expanded="false"
  >
    <span class="dropdown-field-placeholder">Select</span>
    <svg class="dropdown-field-chevron icon icon-size-14" aria-hidden="true">
      <use href="#chevron-down" />
    </svg>
  </button>
  <div class="dropdown-field-error-message">Please choose an option</div>
</div>

<!-- Disabled -->
<button
  class="dropdown-field"
  aria-haspopup="listbox"
  aria-expanded="false"
  disabled
>
  <span class="dropdown-field-value">Weekly</span>
  <svg class="dropdown-field-chevron icon icon-size-14" aria-hidden="true">
    <use href="#chevron-down" />
  </svg>
</button>
```

#### Card — PLACEHOLDER, not a real component

> **Leftover Phase 1 proof-of-concept scaffolding.** It was never extracted from
> Figma and has not been replaced by a real component yet. Its padding, radius
> and structure are invented — do not use it as a reference for new components
> and do not build product UI on it. It is excluded from `verify:visual` on
> purpose. When the real Card lands in Figma, rewrite the file from scratch.

- **Base**: `.card`
- **Parts**: `.card-title`, `.card-body`
- **Modifiers**: `.card-compact`, `.card-bordered`, `.card-hover`

```html
<div class="card">
  <h2 class="card-title">Title</h2>
  <p class="card-body">Content goes here.</p>
</div>
```

#### RadioSelect

- **Base**: `.radio-select` (label wrapper)
- **Parts**: `.radio-select-input` (radio input), `.radio-select-label` (label text)
- **States**: `:hover`, `:focus-visible`, `:checked`, `:disabled`
- **Dimensions**: 15px circle, 8px inner dot when selected, 9px gap
- **Typography**: Caption (12px/18px/400)

```html
<label class="radio-select">
  <input type="radio" name="group" class="radio-select-input" />
  <span class="radio-select-label">Option 1</span>
</label>
<label class="radio-select">
  <input type="radio" name="group" class="radio-select-input" checked />
  <span class="radio-select-label">Option 2</span>
</label>
```

#### Chip

Status indicator system with three presentation modes: chip (text with optional dot), badge (circular number), and dot (indicator only).

All three share Figma's **Size** property (SM / MD). **SM is the default**, so
bare `.chip` / `.badge` / `.dot` are SM and need no size class.

|       | SM (default)                 | MD                                    |
| ----- | ---------------------------- | ------------------------------------- |
| chip  | 20px tall, 4px gap, 8px text | 23px tall, 6px gap, 11px text         |
| badge | 15×15, 4px padding, 8px mono | **19×19**, **6px** padding, 11px mono |
| dot   | 5×5                          | 7×7                                   |

> The chip's **padding is identical** at both sizes (9 / 5) and its inner
> `.chip-dot` **stays 5px** — only gap and type move. The badge is the one
> element that grows its box.

They also share Figma's **BG** property (yes / no). **`yes` (filled) is the
default**, so bare `.chip` / `.badge` need no class; `.chip-bg-no` and
`.badge-bg-no` are the opt-out — the same shape as Input/Textarea/DropdownField's
`-bg-*` classes.

|       | BG=yes (default) | BG=no                                         |
| ----- | ---------------- | --------------------------------------------- |
| chip  | soft tinted fill | no fill, no border — bare coloured text + dot |
| badge | soft tinted fill | no fill, **no circle at all**                 |
| dot   | filled           | **identical — BG is a no-op**                 |

> **Only the fill changes.** Text and dot keep the same colour token across the
> axis, and there is deliberately **no hairline or border** in the unfilled
> form — verified against the Figma render.

> **There is no `.dot-bg-no`.** Figma draws all 18 dot variants across the axis,
> but a dot _is_ its fill: `BG=yes` and `BG=no` sample byte-identical. Nine of
> those variants are redundant. On the designer list.

> **`primary` exists only at BG=no in Figma** — there is no filled primary,
> which is why `.chip-primary` and `.badge-primary` are already transparent.
> Adding `.chip-bg-no` to one is harmless but redundant.

> **Casing is the caller's — confirmed 2026-08-26.** Figma renders the labels
> UPPERCASE (`REVIEW`, `FLAGGED`), and for a long time nothing distinguished a
> `text-transform` on the component from the casing of the sample strings. The
> designer has since bound a text style to the label — `Micro Text/Micro S -
Bold` — and it applies **no** text-case: the rendered variant emits `REVIEW`
> with no `uppercase`. So the caps are typed into the sample strings, and leaving
> casing alone was right — a label passed as "Review" stays "Review". There is
> still no `text-transform: none` assertion, because nothing sets one to guard
> against. Contrast Pill, where the same question was answered differently and
> the spec does pin it; Divider reached the same behaviour from the other
> direction, by dropping the `type-label-*` form.

**Chip** (text with optional dot):

- **Base**: `.chip`
- **Parts**: `.chip-dot` (5px circle indicator, both sizes)
- **Variants**: `.chip-warning`, `.chip-critical`, `.chip-success`, `.chip-neutral`, `.chip-primary`
- **Sizes**: `.chip-sm` (default), `.chip-md`
- **BG**: default filled, `.chip-bg-no` (unfilled)
- **States**: `.with-ring` (2px inset ring in `Primary/Main`, zero offset)
- **Dimensions**: 9px horizontal padding, 5px vertical padding, pill-shaped
- **Typography**: `text-micro-s-bold` (8px/600/0.4%) — MD uses `text-micro-l-bold` (11px/500)

**Badge** (circular number indicator):

- **Base**: `.badge`
- **Variants**: `.badge-warning`, `.badge-critical`, `.badge-success`, `.badge-neutral`, `.badge-primary`
- **Sizes**: `.badge-sm` (default), `.badge-md`
- **BG**: default filled, `.badge-bg-no` (unfilled — removes the circle)
- **States**: `.with-ring` (2px inset ring in `Primary/Main`, zero offset)
- **Dimensions**: 15px × 15px circle, 4px padding — MD is 19px × 19px, 6px padding
- **Typography**: `text-data-micro-s` (8px/500, JetBrains Mono) — MD uses `text-data-micro-l` (11px/500)

**Dot** (indicator only):

- **Base**: `.dot`
- **Variants**: `.dot-warning`, `.dot-critical`, `.dot-success`, `.dot-neutral`, `.dot-primary`
- **Sizes**: `.dot-sm` (default, 5px), `.dot-md` (7px)
- **States**: `.with-ring` (2px inset ring in `Primary/Main`, zero offset)
- **Dimensions**: 5px × 5px circle (7px at MD)

```html
<!-- Chip with dot -->
<span class="chip chip-warning">
  <span class="chip-dot"></span>
  <span>Warning</span>
</span>

<!-- Chip without dot -->
<span class="chip chip-success">Approved</span>

<!-- BG=no — same colour, unfilled -->
<span class="chip chip-warning chip-bg-no">
  <span class="chip-dot"></span>
  <span>Warning</span>
</span>
<span class="badge badge-critical badge-bg-no">3</span>

<!-- Chip with ring state -->
<span class="chip chip-critical with-ring">
  <span class="chip-dot"></span>
  <span>Critical</span>
</span>

<!-- Badge (circular number) -->
<span class="badge badge-critical">3</span>
<span class="badge badge-warning with-ring">5</span>

<!-- Dot (indicator only) -->
<span class="dot dot-success"></span>
<span class="dot dot-warning with-ring"></span>

<!-- MD size -->
<span class="chip chip-warning chip-md">
  <span class="chip-dot"></span>
  <span>Warning</span>
</span>
<span class="badge badge-critical badge-md">3</span>
<span class="dot dot-success dot-md"></span>
```

#### Switch

Toggle switch for binary on/off settings with smooth slide animation.

- **Base**: `.switch` (label wrapper)
- **Parts**: `.switch-input` (checkbox input, visually hidden but accessible)
- **Dimensions**: 32px × 18px track, 14px knob diameter, 2px padding
- **States**: `:hover`, `:focus-visible`, `:checked`, `:disabled`
- **Animation**: Knob slides 14px on toggle with 150ms transition
- **Colors**: Off state uses `Action/Focused`, on state uses `Primary/Main`

```html
<!-- Basic switch (unchecked) -->
<label class="switch">
  <input type="checkbox" class="switch-input" />
</label>

<!-- Checked switch -->
<label class="switch">
  <input type="checkbox" class="switch-input" checked />
</label>

<!-- Disabled switches -->
<label class="switch">
  <input type="checkbox" class="switch-input" disabled />
</label>
<label class="switch">
  <input type="checkbox" class="switch-input" checked disabled />
</label>

<!-- With label (common pattern) -->
<label
  style="display: inline-flex; align-items: center; gap: 8px; cursor: pointer;"
>
  <span>Enable feature</span>
  <div class="switch">
    <input type="checkbox" class="switch-input" checked />
  </div>
</label>
```

#### Tabs

A tab item in three styles. Extracted from Figma Tabs (108:653) — Type × Size ×
Hover × Active, 12 variants.

> Underline was resized on **2026-08-22**: padding 2 → 6 horizontal and 5 → 8
> (lg) / 5 → 6 (sm) vertical, and the height dropped from 44/40 to **32/26**.
> Figma now authors no height on it at all — those fall out of padding plus the
> line box — but they are pinned here because lg's line box comes from an Auto
> line height, which is font-dependent.

- **Container**: `.tabs` (structural only — see below)
- **Item**: `.tab` **plus a required type class**
- **Types**: `.tab-underline` (32px), `.tab-chip` (26px, 6px radius),
  `.tab-segment` (26px, 2px radius)
- **Size**: `.tab-sm` (26px) — **underline only**, Figma draws no small chip or segment
- **Parts**: `.tab-subtitle`; the badge slot is `.badge badge-neutral` from Chip
- **States**: `:hover`, `:focus-visible`, `[aria-selected="true"]` /
  `[aria-checked="true"]`, `:disabled`, `.with-ring`

**Selector or navigator — same styling, different contract:**

|                           | markup                                   | ARIA                                                                                   |
| ------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------- |
| navigator (swaps a panel) | `.tabs` › `.tab`                         | `role="tablist"` › `role="tab"` › `aria-selected`, `aria-controls` → `role="tabpanel"` |
| selector (sets a value)   | `.segment-selector` › `.tab tab-segment` | `role="radiogroup"` › `role="radio"` › `aria-checked`                                  |

Both attributes drive the active styling. Pick the one matching what the control
actually does.

> **A tab always needs an explicit type class.** Type is a required axis in
> Figma with no default. Giving `.tab` a built-in default meant `:not()` chains
> whose specificity then outranked `.tab-sm`, so small active tabs rendered at
> the large size. Explicit beats clever.

> **`.tab` must not set `border-none`.** That sets `--tw-border-style: none`,
> which the underline's active rule inherits through
> `border-bottom-style: var(--tw-border-style)` — computing the 2px rule to
> zero. Preflight already gives buttons a 0-width border.

> **chip and segment are one control with two skins**, differing in exactly two
> declarations: radius (6px vs 2px) and active fill (grey tint vs white).
> Height, padding, gap, every text colour, hover and the active hairline are
> identical. Modifiers, never two components.

> **Only underline changes weight when active** (500 → 600). chip and segment
> keep 500.

**Containers.** Figma's Navigation set (994:31364) defines one per type:

| Figma variant        | class               | chrome                                  |
| -------------------- | ------------------- | --------------------------------------- |
| Navigation / Tab     | `.tabs`             | bare row, 8px gap                       |
| Navigation / chip    | `.tabs tabs-chip`   | bare row, 12px gap + 12/6 inset padding |
| Navigation / Segment | `.segment-selector` | filled frame, 4px radius, 1px padding   |

> `.tabs` defaults to the underline row since that is the common case;
> `.tabs-chip` overrides it.
>
> **Not encoded:** Figma's Tab variant frame is a fixed 409×35 with 18px
> horizontal and 3px vertical slack it has no padding to account for, and its
> children stretch to 35px rather than their natural 32. That reads as a
> hand-resized frame rather than intent, so the row is derived from gap plus
> item height. Raised with the designer.

> **Underline hover reaches the active colour** (`Content/Primary`) while
> keeping rest's weight and gaining no rule — it previews the active state
> without asserting it.
>
> This was a no-op until 2026-08-22: hover bound `Content/Secondary`, which
> resolves to the same `#5b5b68` as rest's `Secondary/Main`, so the two were
> indistinguishable and the visual spec could not assert them apart. The
> designer rebound it, and the spec now pins the difference.

```html
<!-- Navigator -->
<div class="tabs" role="tablist" aria-label="Sections" style="gap: 16px">
  <button
    class="tab tab-underline"
    role="tab"
    aria-selected="true"
    aria-controls="p1"
  >
    Overview<span class="badge badge-neutral">3</span>
  </button>
  <button
    class="tab tab-underline"
    role="tab"
    aria-selected="false"
    aria-controls="p2"
  >
    Documents
  </button>
</div>
<div id="p1" role="tabpanel">…</div>

<!-- Small underline -->
<button class="tab tab-underline tab-sm" role="tab" aria-selected="true">
  Overview
</button>

<!-- With a subtitle -->
<button class="tab tab-underline" role="tab" aria-selected="true">
  <span>Overview<span class="tab-subtitle">APPLICANT</span></span>
</button>

<!-- Chip -->
<button class="tab tab-chip" role="tab" aria-selected="true">Overview</button>
```

#### SegmentSelector

The framed container that wraps segment tabs. Extracted from Figma Segment
Selector (784:34686): _"Horizontal segmented control combining multiple filter
segments. Use for toggling between 2-5 mutually exclusive options."_

- **Base**: `.segment-selector` (`surface-frame` fill, 4px radius, 1px padding, no gap)
- **Modifier**: `.segment-selector-fill` — equal-width segments, **not from Figma**
- **Children**: `.tab tab-segment`
- **States**: `:focus-visible`, `.with-ring`

It is a **parent of Tabs, not a variant of it** — Figma composes it literally
from `Tabs Type=segment` instances.

> **There is no sliding thumb.** The selected state is styling on the selected
> child — white fill, 0.5px hairline, darker text — and Figma models no
> indicator layer. No shadow either; most segmented controls elevate the active
> thumb, this one uses the hairline. Any slide animation would be invented.

> **Children hug their labels and do not shrink.** Figma's 160px example is
> content-driven — its two segments are 79px only because both labels are the
> string "Overview". Adding segments **grows the container**; there is no
> overflow handling, which is why the description caps it at 2–5. Use
> `.segment-selector-fill` when you want equal widths.

> Deliberately no `:focus-within` on the frame — focus lands on a segment,
> which rings itself, and ringing the frame too would double it.

```html
<div class="segment-selector" role="radiogroup" aria-label="Density">
  <button class="tab tab-segment" role="radio" aria-checked="true">
    Compact
  </button>
  <button class="tab tab-segment" role="radio" aria-checked="false">
    Comfortable
  </button>
</div>

<!-- Equal-width -->
<div
  class="segment-selector segment-selector-fill"
  role="radiogroup"
  aria-label="View"
>
  <button class="tab tab-segment" role="radio" aria-checked="true">All</button>
  <button class="tab tab-segment" role="radio" aria-checked="false">
    Needs review
  </button>
</div>
```

#### Breadcrumbs

Hierarchical navigation path. **Rebuilt 2026-08-25** against a restructured
Figma design, which splits the component across three nodes: Breadcrumb Item
(1046:22649), Breadcrumb Separator (1046:22654) and the Breadcrumbs container
(880:31218).

- **Base**: `.breadcrumbs` (the row, 8px gap)
- **Crumbs**: `.breadcrumb`, `.breadcrumb-current`, `.breadcrumb-home`
- **Separators**: `.breadcrumb-separator`, `+ -dot`
- **States**: `:hover`, `:focus-visible`

| Item state       | treatment                                               |
| ---------------- | ------------------------------------------------------- |
| ancestor         | `text-body-1` (13/19.5/400), `Content/Secondary`        |
| `-current`       | `text-body-1-bold` (13/19.5/**500**), `Content/Primary` |
| `:hover`         | 0.5px rule under the label in **`currentColor`**        |
| `:focus-visible` | `focus-ring` — 2px `Primary/Main`                       |

> **The crumb is a box now, not a bare text node.** Figma gives it 2px/4px
> padding and a 4px radius (`Radius/XS`) — which is what gives the focus ring
> something to draw around. Height stays content-driven (2 + 19.5 + 2 = 23.5
> against Figma's 24px frame); there is no border, so the hairline trap that
> forces explicit heights elsewhere does not apply.

> **The type is bound now.** The previous revision documented it as "raw
> throughout"; Figma now binds `Body Content/Body 1` and `Body 1 - Bold`, which
> map exactly onto `--text-body-1` and `--text-body-1-bold`. So the current crumb
> steps its **weight** as well as its colour, and the old `leading: normal` is
> gone — 19.5px is authored. The visual spec used to assert the exact opposite.

> **Hover is painted as a gradient band, not `text-decoration` — and that is
> forced.** Chrome renders `text-decoration-thickness: 0.5px` as a full 1px;
> measured at 1x and 2x, the 0.5 and 1 cases came out byte-identical. A
> background gradient antialiases and carries the authored 0.5 exactly (verified:
> 0.500px painted at both densities). Same trap, same fix, as LoadingIndicator's
> ring. Because the rule is `currentColor`, one declaration reproduces both of
> Figma's hover colours — `#5b5b68` on an ancestor, `#16161a` on a current item.

> **Figma draws focus as a 2px inside border; we use the outline ring.** Same
> width, same `Primary/Main`, same position (the ring's offset is negative). It
> also keeps focus from reflowing the row, which a real border would do by adding
> 4px to a content-driven box.

> **The separators are uniform now** — both chevron and slash are 12px Inter
> Regular in `Content/Tertiary`. The previous revision documented three
> inconsistent treatments (13 Regular / 12 Regular / 13 Bold) and reproduced them
> as deliberate optical corrections; the designer has since regularised them.
> `.breadcrumb-separator-chevron` is **retained as a no-op** so existing markup
> keeps working — it restates the base and is safe to drop.

> **Separators must carry `aria-hidden="true"`.** They are decorative text;
> without it a screen reader announces "greater than" / "slash" / "middot"
> between every crumb.

> **The middot is not a Separator instance.** In the slash variant Figma draws it
> as a loose text node at 13px Inter **Regular** — a different size from the 12px
> separators, and Regular where it used to be Bold. It joins two facets of one
> location rather than two levels of hierarchy.

> **Colour and weight mark depth, not position.** In the slash variant **both**
> trailing items are current, because the ID and the business name are two halves
> of one location — so `-current` is not "the last child".

> **The home icon is `Content/Tertiary`**, a step lighter than the crumbs beside
> it. Previously inferred from a render; now confirmed by sampling the
> restructured container at full opacity.

> **`.breadcrumb-mono` was removed in this rebuild** — a breaking change, see
> [CHANGELOG.md](CHANGELOG.md). The redesign renders `#BA-204417` as an ordinary
> current item in Inter Medium, so the JetBrains Mono 700 treatment has no basis
> in Figma any more. Add `font-mono` at the call site if you still want it.

> **Still class-only:** `aria-current="page"` is documented and correct for
> assistive tech, but nothing selects it — `.breadcrumb-current` drives the
> styling. Parked for the accessibility pass.

```html
<nav class="breadcrumbs" aria-label="Breadcrumb">
  <svg class="breadcrumb-home icon icon-size-14" aria-hidden="true">
    <use href="#home" />
  </svg>
  <span class="breadcrumb-separator" aria-hidden="true">&gt;</span>
  <a class="breadcrumb" href="/applications">Applications</a>
  <span class="breadcrumb-separator" aria-hidden="true">&gt;</span>
  <span class="breadcrumb breadcrumb-current" aria-current="page"
    >#BA-204417</span
  >
</nav>

<!-- slash variant: two current items joined by the loose middot -->
<nav class="breadcrumbs" aria-label="Breadcrumb">
  <a class="breadcrumb" href="/queue">Queue</a>
  <span class="breadcrumb-separator" aria-hidden="true">/</span>
  <span class="breadcrumb breadcrumb-current">#BA-204417</span>
  <span class="breadcrumb-separator breadcrumb-separator-dot" aria-hidden="true"
    >&middot;</span
  >
  <span class="breadcrumb breadcrumb-current" aria-current="page"
    >Northwind Freight LLC</span
  >
</nav>
```

#### Step

A single marker in a stepped progression. Extracted from Figma Step (1032:2012)
— 3 variants on a `State` axis, plus a Step Title boolean.

- **Base**: `.step` (the `completed` state — Figma's default)
- **States**: `.step-active`, `.step-upcoming`
- **Parts**: `.step-marker` (24px circle), `.step-label`

| State       | marker fill     | marker border           | content       | label                      |
| ----------- | --------------- | ----------------------- | ------------- | -------------------------- |
| completed   | `Primary/Main`  | none                    | 12px `#check` | `Content/Tertiary`, Medium |
| `-active`   | `Surface/Paper` | **2px** `Primary/Main`  | number        | `Primary/Main`, Medium     |
| `-upcoming` | `Surface/Paper` | **1px** `Content/Faint` | number        | `Neutral/Strong`, Regular  |

> **The label ramp is inverted, and that is not a transcription error.** A
> completed step's label is `Content/Tertiary` (#727280) while an upcoming one is
> `Neutral/Strong` (#4e4e59) — so the step you have _finished_ is drawn lighter
> than the one you have not reached. The weights disagree in the other direction
> (Medium vs Regular). Reproduced faithfully and pinned in the spec; on the
> designer list, because one of the two looks like it was meant to go the other
> way.

> **The border widths are different tokens**, not one value at two sizes —
> active binds `Stroke/Micro` (2px), upcoming `Stroke/Line` (1px). Completed
> draws none; a transparent border keeps all three markers at 24px under
> border-box so a mixed row shares a baseline.

> Figma writes the marker fill as a literal white rather than binding
> `Surface/Paper`. The value is identical, so it is mapped to the token.

#### Stepper

A row of Steps joined by progress connectors. Extracted from Figma Stepper
(1032:2013) — one symbol with a Stepper Title boolean.

- **Base**: `.stepper`
- **Parts**: `.stepper-title`, `.stepper-steps`, `.stepper-connector`,
  `.stepper-connector-complete`
- **Slots (reused components)**: `.step`

> **The connectors carry the progress, not the steps.** Each is `flex-1`, so it
> absorbs whatever the labels leave — which is why Figma's step instances are
> 38 / 38 / 41 / 51px wide while every connector is the same 70.67px. Its colour
> says whether that _segment_ is behind you: `Primary/Main` when passed,
> `Stroke/Border` when not. Incomplete is the default even though Figma's first
> two instances are filled, so an empty stepper implies no progress it has not
> made.

> **The connectors sit 9px below the marker centres**, and that is faithful: the
> row is `items-center` over a 42px step (24 marker + 6 gap + 12 label), so a 2px
> line centres at y=21 while the marker centres at y=12. Figma places its lines
> at exactly y=20 for the same reason. Most steppers align the two, so this may
> be unintended — but it is what the file draws.

> **The step number is a text slot, and the design file still shows the wrong
> ones.** As of 2026-08-25 Figma does expose a `Stepper Number` text property on
> Step (1032:2012), defaulting to `"1"` — but the Stepper's own four instances
> (1032:2013) pass only `label` and `state` and never set it, so every marker
> falls back to the default and the design file renders **"1" four times**. The
> property exists; it is simply not applied. Our stories pass real numbers
> (`i + 1`, so the active and upcoming markers read 3 and 4), which is what the
> flow should look like. No CSS is involved either way — the number is the
> marker's text content. **Do not copy the numbering from the design file.**

> **The root's white fill and 8px radius are not reproduced.** Figma sets both on
> a frame with no padding, border or shadow, so the fill hugs the content exactly
> and the radius clips nothing — the white would be wrong on any surface that is
> not already white. Same call as Progress Bar's root radius.

> **The title is `Content/Secondary`** where Progress Bar's otherwise identical
> 11px uppercase title is `Content/Primary`. Both raw; the difference may be
> unintentional, and the spec pins it either way.

```html
<div class="stepper">
  <p class="stepper-title">Stepped progression flow</p>
  <div class="stepper-steps">
    <div class="step">
      <span class="step-marker">
        <svg class="icon icon-size-12" aria-hidden="true">
          <use href="#check" />
        </svg>
      </span>
      <span class="step-label">Intake</span>
    </div>
    <span class="stepper-connector stepper-connector-complete"></span>
    <div class="step step-active" aria-current="step">
      <span class="step-marker">2</span>
      <span class="step-label">Review</span>
    </div>
    <span class="stepper-connector"></span>
    <div class="step step-upcoming">
      <span class="step-marker">3</span>
      <span class="step-label">Decision</span>
    </div>
  </div>
</div>
```

#### ProgressBar

Extracted from Figma Progress Bar (1032:1991) — 2 variants, plus Top Content and
Bottom Content booleans.

- **Base**: `.progress-bar` (the Primary colour scheme)
- **Scheme**: `.progress-bar-success` (the Approved ramp)
- **Parts**: `.progress-bar-header`, `-title`, `-value`, `-track`, `-fill`,
  `-legend`, `-legend-item`, `-legend-swatch`, `-legend-swatch-neutral`,
  `-legend-label`

> **Figma's variant property is misnamed.** The axis is called `Has Legend`, but
> it does not control the legend — **both** variants render the legend row,
> which is gated by a separate `Bottom Content` boolean that is true in each.
> What it actually swaps is the colour scheme, so it ships as a colour modifier
> and is renamed: a class called `has-legend` that changes colour would be worse
> than the original mistake. On the designer list.

| Scheme     | value text               | fill + first swatch   |
| ---------- | ------------------------ | --------------------- |
| base       | `Primary/Main`           | `Primary/Main`        |
| `-success` | `Approved/`**`Content`** | `Approved/`**`Main`** |

> **The success scheme splits two Approved tokens** — `Approved/Content` for the
> value text, `Approved/Main` for the fill and swatch. The same split Modal's
> positive variant has.

> **The `false` variant contradicts itself three ways**, so do not treat its
> numbers as a spec: its value label reads 92%, its fill is 260 of 360 (72%),
> and its legend says 68%. The `true` variant is consistent at 92/92/92, so the
> blue one looks like an un-updated duplicate. Also on the designer list.

> **The track is full width here.** Figma fixes it at 360px inside a 400px frame
> while the label and legend rows are both full width, so the bar stops 40px
> short of everything above and below it, with no padding to explain it. Treated
> as a slip — a progress track that does not span its container is not
> shippable. Same judgement as Alert's 828px.

> **The root's 8px radius is vestigial** and is not reproduced: Figma sets it on
> a frame with no fill and no border, so it clips nothing and paints nothing.

> **The type is raw** — Figma binds no text style to any of the three. The
> value's 13px Inter Medium happens to equal `--text-action-l`, but that is a
> Button & Actions token, and coupling a progress readout to it would mean a
> button change silently moved this.

> **The fill width is the consumer's** — set it inline or with a utility, and
> mirror it in `aria-valuenow`.

```html
<div class="progress-bar progress-bar-success">
  <div class="progress-bar-header">
    <span class="progress-bar-title">Review completion</span>
    <span class="progress-bar-value">92%</span>
  </div>

  <div
    class="progress-bar-track"
    role="progressbar"
    aria-valuenow="92"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-label="Review completion"
  >
    <div class="progress-bar-fill" style="width: 92%"></div>
  </div>

  <div class="progress-bar-legend">
    <span class="progress-bar-legend-item">
      <span class="progress-bar-legend-swatch"></span>
      <span class="progress-bar-legend-label">92% verified</span>
    </span>
    <span class="progress-bar-legend-item">
      <span
        class="progress-bar-legend-swatch progress-bar-legend-swatch-neutral"
      ></span>
      <span class="progress-bar-legend-label">8% unaccounted</span>
    </span>
  </div>
</div>
```

#### LoadingIndicator

Extracted from Figma Loading Indicator (1028:1992) — 8 variants across Type
(Circle / Dots) × Size (XS / SM / MD / LG).

- **Base**: `.loading-indicator` (Circle, XS)
- **Type**: `.loading-indicator-dots` + three `.loading-indicator-dot` children
- **Sizes**: `.loading-indicator-sm` (16), `-md` (24), `-lg` (32); XS (12) is default

| Size | box | ring |
| ---- | --- | ---- |
| XS   | 12  | 1.5  |
| SM   | 16  | 2    |
| MD   | 24  | 2.52 |
| LG   | 32  | 3.04 |

> **Both types were flattened to SVG in Figma** — `get_design_context` returns an
> `<img>` and no variables at all — so every value was read out of the exported
> asset and cross-checked against the rendered PNG.

> **The circle is a masked conic-gradient, not a border**, and that is what lets
> it carry Figma's authored values exactly. Chrome **floors** fractional
> `border-width` — measured at 1x and 2x, `1.5px` computes to `1px` — so a
> bordered ring cannot express 1.5 or 2.52 at all. An earlier revision shipped
> integers (2/2/3/3) to compensate, on the strength of a pixel trace that was
> wrong; the result was an XS ring a third thicker than the design, on the
> default size and the one embedded in every Loading Inline variant. Tracing by
> pixel _coverage_ rather than a binary test gives Figma 1.56 / 2.00 / 2.50 /
> 3.11 — the authored values. A mask has no rounding, so those ship verbatim.
>
> One coloured quarter of a conic-gradient is the same 90° arc a single coloured
> border side used to draw — `Primary/Main` over a `Stroke/Divider` track.

> **The dots' diameter and gap are always the same number**, which is why each
> Figma frame is exactly 5× its height. One custom property drives both. Fill is
> `Secondary/Main` — _not_ the circle's Primary.

> **The animation is not in Figma.** Both types are static vectors there: no
> prototype, no timing, no easing. The motion is a library decision — 0.8s
> linear spin, 1.4s staggered opacity pulse — and is on the designer list.
> `prefers-reduced-motion: reduce` stops both, which is why every usage needs
> `role="status"` and a label.

> **Motion is unasserted in the visual spec** by necessity: the harness injects
> `animation: none !important` so mid-animation values cannot corrupt colour
> checks. It is exercised in the Motion story instead.

```html
<span
  class="loading-indicator loading-indicator-md"
  role="status"
  aria-label="Loading"
></span>

<span
  class="loading-indicator loading-indicator-dots"
  role="status"
  aria-label="Loading"
>
  <span class="loading-indicator-dot"></span>
  <span class="loading-indicator-dot"></span>
  <span class="loading-indicator-dot"></span>
</span>
```

#### LoadingInline

A loading indicator paired with a label. Extracted from Figma Loading Inline
(1028:2013) — 4 variants on a single `Size` axis.

- **Base**: `.loading-inline` (XS)
- **Sizes**: `.loading-inline-sm`, `-md`, `-lg`
- **Slots (reused components)**: `.loading-indicator`

| Size | gap | label / leading |
| ---- | --- | --------------- |
| XS   | 6   | 11 / 17         |
| SM   | 8   | 12 / 18         |
| MD   | 10  | 14 / 21         |
| LG   | 12  | 16 / 24         |

> **The indicator is 12px at every size.** Figma embeds a `Size=XS` Loading
> Indicator instance in all four variants while the gap and label scale around
> it — visible in the rendered frames as a constant spinner beside growing text.
> Reproduced faithfully, which is why the nested `.loading-indicator` needs no
> size class: its own default is already 12px. Flagged for the designer, since
> at LG it reads small against 16px text.

> **Only SM maps to a token.** Its 12/18 is exactly `--text-caption`; 11/17,
> 14/21 and 16/24 have no equivalent, and `--text-subtitle` is the nearest 14px
> but carries 19.6px leading and Medium weight. All four are written directly so
> they read consistently. On the designer list.

```html
<span class="loading-inline loading-inline-md" role="status">
  <span class="loading-indicator"></span>
  Loading...
</span>
```

#### Divider

Content separator for visual breaks between sections. Extracted from Figma
Divider (880:31270) — 3 variants on a single `Type` axis.

- **Simple**: `.divider` (a 1px rule; works on an `<hr>`)
- **Labeled**: `.divider-labeled` + `.divider-label`, flanked by two `.divider`s
- **Metadata**: `.divider-metadata`, `-item`, `-key`, `-value`, `-separator`

> **The three types are structurally incompatible**, so they are not modifiers
> of one base. `simple` is a single element; `labeled` and `metadata` are flex
> rows with children. `.divider-labeled` and `.divider-metadata` stand alone and
> do **not** take `.divider` — the same shape as `.link-inline`.

> **`.divider` is the simple type**, which is a deliberate departure: Figma's
> default variant is `labeled`, but a bare `.divider` cannot render it — labeled
> needs three children. Naming the plainest form after the component is the only
> reading that works, and it is what makes the reuse below possible.

> **Labeled is built from two `.divider`s**, exactly as Figma models it: the
> variant contains two Line children flanking the text. They flex, so the label
> stays centred at any container width.

> **Two different stroke tokens, easy to conflate:**
>
> |                          | token            |                       |
> | ------------------------ | ---------------- | --------------------- |
> | horizontal rules         | `Stroke/Divider` | `rgba(20,20,40,0.08)` |
> | metadata's vertical bars | `Stroke/Border`  | `rgba(20,20,40,0.13)` |
>
> The vertical separators really are the heavier of the two.

> **The rules are backgrounds, not borders.** Figma draws them as 1px lines on
> zero-height frames; here they are a 1px box with a background, which sidesteps
> the border-box hairline trap entirely — nothing in this component needs a
> pinned height.

> **No text style is bound anywhere in this component**, on either type —
> verified. The labeled label's _values_ match `Label S Sans - Bold`
> (10px/12px/600/0.1em) but nothing binds it, so it uses `text-label-s-bold`.

> **Casing is the consumer's.** It previously used the `type-label-*` form, which
> adds `text-transform: uppercase` — but Figma applies no transform; the caps are
> typed into the sample string. Forcing them meant a label passed as "Beneficial
> owners" came back shouted. Chip leaves casing alone for the same reason; both
> now agree.

> **The metadata type is raw too**: keys are 12px Inter Regular and values 12px
> Inter Medium, both with Auto leading, so `--text-caption` is the wrong fit
> despite matching the size — its 18px line-height would make the row 18px where
> Figma is 16.

> **Mono is a call-site choice.** Figma's sample renders its _date_ value in
> JetBrains Mono Medium while the other two are Inter Medium — an instance
> override for data, not a rule. `.divider-metadata-value` stays Inter; add
> `font-mono` where the value is data.

```html
<hr class="divider" />

<div class="divider-labeled">
  <hr class="divider" />
  <span class="divider-label">Beneficial owners</span>
  <hr class="divider" />
</div>

<div class="divider-metadata">
  <span class="divider-metadata-item">
    <span class="divider-metadata-key">Updated</span>
    <span class="divider-metadata-value font-mono">Jul 17</span>
  </span>
  <span class="divider-metadata-separator"></span>
  <span class="divider-metadata-item">
    <span class="divider-metadata-key">Reviewer</span>
    <span class="divider-metadata-value">M. Carden</span>
  </span>
</div>
```

#### Link

Hyperlink styles for navigation and inline references. Extracted from Figma Link
(880:31368) — 15 variants across Style × State (default / hover / pressed).

- **Base**: `.link` (the `strong` style)
- **Styles**: `.link-strong`, `.link-quiet`, `.link-monospace`, `.link-critical`
- **Prose**: `.link-inline` — a paragraph class, **not** used with `.link`
- **States**: `:hover`, `:active`, `:focus-visible`, `[aria-disabled="true"]`

| Style        | type                        | rest                | hover             | pressed            |
| ------------ | --------------------------- | ------------------- | ----------------- | ------------------ |
| `strong`     | Inter SemiBold 14           | `Primary/Main`      | `Primary/Dark`    | `Primary/Pressed`  |
| `-quiet`     | Inter Regular 14            | `Content/Secondary` | `Primary/Main`    | `Primary/Dark`     |
| `-monospace` | JetBrains Mono Medium 13    | `Content/Primary`   | `Primary/Main`    | `Primary/Dark`     |
| `-critical`  | Inter Medium 14 + 12px icon | `Critical/Main`     | `Critical/Strong` | `Critical/Content` |
| `-inline`    | Inter Regular 12 (Caption)  | `Primary/Main`      | `Primary/Dark`    | `Primary/Pressed`  |

> **`strong` is the only style whose underline is a state.** It has none at rest
> and gains one on hover and pressed; the other three are underlined throughout.
> That is the most surprising thing about this component.

> **The ramps differ in length.** `strong` and `inline` run Main → Dark →
> Pressed; `quiet` and `monospace` only reach Dark, because they _start_ outside
> the primary ramp. Do not regularise them.

> **`inline` is a paragraph, not a link.** Figma draws body copy carrying
> anchors, so the class goes on the block and its `<a>` children are styled as
> descendants. It deliberately does not take `.link`.

> **The type is raw.** Figma binds no text style to the four standalone styles —
> only `inline` carries one (`Body Content/Caption` → `--text-caption`). The
> nearest token to 14px Inter is `--text-subtitle`, but it is Medium/500 with a
> 19.6px line-height where these are Auto in a 17px box, so two of its three
> properties would need overriding. Sizes and weights are written directly
> rather than force-fitted. On the designer list.

> **`Critical/Content` was added to the theme for this component** — a real
> Figma variable that was missing because nothing had applied it. See the token
> section's note on `get_variable_defs`.

```html
<a class="link" href="/report">Open full report →</a>
<a class="link link-quiet" href="/log">View activity log</a>
<a class="link link-monospace" href="/case">#BA-204417</a>

<a class="link link-critical" href="/fix">
  <svg class="icon icon-size-12" aria-hidden="true">
    <use href="#alert-triangle" />
  </svg>
  Resolve mismatch
</a>

<!-- inline: a paragraph, styled on its anchors -->
<p class="link-inline">
  Valiify utilizes <a href="/middesk">Middesk</a> for instant background
  screenings.
</p>
```

#### FilterSegment

Individual segment within a segmented filter control. Extracted from Figma
Filter Segment (678:21020) — 18 variants across Position × Hover × Selected ×
Size, plus Text, Icon and Ring booleans.

- **Base**: `.filter-segment` (the `middle` position, sm)
- **Position**: `.filter-segment-first`, `.filter-segment-last`
- **Size**: `.filter-segment-md` (28px); sm (21px) is the default
- **Group**: `.filter-segments`
- **States**: `:hover`, `[aria-pressed="true"]` / `[aria-selected="true"]`,
  `:focus-visible`, `:disabled`, `.with-ring`
- **Slots (reused components)**: `.icon-button icon-button-md`

**Segments share their edges**, which is the whole point of the position axis:

| Position      | borders                         | radius        |
| ------------- | ------------------------------- | ------------- |
| middle (base) | top / right / bottom            | none          |
| `-first`      | top / right / bottom / **left** | rounded left  |
| `-last`       | top / right / bottom            | rounded right |

Each segment's right border is the divider to the next, so no pair ever doubles
up. `first` adds the group's left edge; `last` needs nothing extra, because its
own right border closes the group.

> **Middle is the base** because it is Figma's default variant. A lone segment
> therefore renders square and open on the left — correct for the model, rarely
> what you want. Mark the ends explicitly.

> **Position is three booleans in Figma**, not one enum: `First`, `Middle` and
> `Last` are separate yes/no properties with exactly one ever set. That is an
> authoring choice rather than a real distinction, so it collapses to two
> modifier classes here. On the designer list.

> **Both heights are pinned** (21 / 28px). Figma fixes them, and the 0.5px
> hairlines would each add 2px under border-box. The two sizes share padding,
> gap and type entirely — md is purely a taller box.

> **Hover and selected replace the fill**, they do not tint it. Rest is the
> opaque `Surface/Card`; both other states drop to a translucent `Action` token,
> so the page shows through rather than the card. Figma draws no
> hover-and-selected combination, and the hover rule excludes selected by name.

> **The Figma example expresses "label vs value" through text overrides, not
> states.** In 1018:33960 every segment keeps the _rest_ background; the
> operator is `Content/Secondary`, the values are `Content/Primary`, and the
> chosen one steps to `Micro L - Bold`. That is a usage pattern, so it lives in
> the story rather than in a class.

> **Every segment is a control.** Use a `<button>` (or `<a>`) for each, so the
> whole group is keyboard-reachable and each segment can carry its own action —
> a filter row where only some segments tab is worse than one where none do. An
> earlier revision used `<div>` for the value segments, which silently dropped
> the first and third out of the tab order. The icon segment stays a non-button
> element wrapping the Icon Button, because nesting a button inside a button is
> invalid HTML; the icon button is itself focusable.

```html
<div class="filter-segments">
  <button
    class="filter-segment filter-segment-first filter-segment-md text-content-primary"
  >
    Product
  </button>
  <button class="filter-segment filter-segment-md">Is any of</button>
  <button
    class="filter-segment filter-segment-md text-micro-l-bold text-content-primary"
  >
    Deposit Account
  </button>
  <span class="filter-segment filter-segment-last filter-segment-md">
    <button class="icon-button icon-button-md" aria-label="Remove filter">
      <svg class="icon icon-size-14" aria-hidden="true"><use href="#x" /></svg>
    </button>
  </span>
</div>

<!-- as a toggle group -->
<div class="filter-segments" role="group" aria-label="Match mode">
  <button class="filter-segment filter-segment-first" aria-pressed="true">
    All
  </button>
  <button class="filter-segment" aria-pressed="false">Any</button>
  <button class="filter-segment filter-segment-last" aria-pressed="false">
    None
  </button>
</div>
```

#### Pagination

Page navigation controls for multi-page data sets. Extracted from Figma
Pagination (880:31248) — 2 variants on a single `Type` axis.

- **Base**: `.pagination` (the bar — both types share it)
- **Numbered parts**: `.pagination-pages`, `.pagination-summary`
- **Simple parts**: `.pagination-status`, `.pagination-status-current`
- **Slots (reused components)**: `.pagination-item` cells (numbered),
  `.btn btn-outline btn-sm` (simple's Prev / Next)

> **Both types share the same root, so there is no modifier class.** Figma draws
> `flex items-center justify-between` at full width for each; only the children
> differ. A `.pagination-simple` that set nothing would be noise.

> **Everything interactive is an existing component.** Simple's Prev and Next
> are literal Button instances, and their Figma geometry — 24px tall, 8px/5px
> padding, 5px gap, 6px radius, 0.5px `Stroke/Divider`, `Action S` 12/500 in
> `Content/Primary` — is `.btn btn-outline btn-sm` down to the pixel, with a
> 13px icon.

> **Two Figma oddities, reported rather than reproduced.** The numbered bar's
> _trailing_ nav cell points **left**, identical to the leading one — the
> instance was never flipped; ours points right, because a "next" arrow that
> points backwards is not a design decision. And the two types use different
> arrow families: numbered cells carry chevrons, simple's buttons carry true
> arrows. Both on the designer list.

> **Width is not pinned** — Figma's 1208px is the artboard's content width, and
> a pagination bar spans its table.

> The 4px cell gap is `Spacing/4` and belongs to the bar, not the cell:
> `.pagination-item` sets no margin, so cells used elsewhere space themselves.

```html
<!-- numbered -->
<nav class="pagination" aria-label="Pagination">
  <div class="pagination-pages">
    <button
      class="pagination-item pagination-item-nav"
      aria-label="Previous page"
    >
      <svg class="icon icon-size-14" aria-hidden="true">
        <use href="#chevron-left" />
      </svg>
    </button>
    <button class="pagination-item pagination-item-active" aria-current="page">
      1
    </button>
    <button class="pagination-item">2</button>
    <span class="pagination-item pagination-item-ellipsis" aria-hidden="true"
      >...</span
    >
    <button class="pagination-item">18</button>
    <button class="pagination-item pagination-item-nav" aria-label="Next page">
      <svg class="icon icon-size-14" aria-hidden="true">
        <use href="#chevron-right" />
      </svg>
    </button>
  </div>
  <p class="pagination-summary">1-20 of 352</p>
</nav>

<!-- simple -->
<nav class="pagination" aria-label="Pagination">
  <button class="btn btn-outline btn-sm">
    <svg class="icon icon-size-13" aria-hidden="true">
      <use href="#arrow-left" />
    </svg>
    Prev
  </button>
  <p class="pagination-status">
    Page <span class="pagination-status-current">7</span> of 18
  </p>
  <button class="btn btn-outline btn-sm">
    Next
    <svg class="icon icon-size-13" aria-hidden="true">
      <use href="#arrow-right" />
    </svg>
  </button>
</nav>
```

#### PaginationItem

Individual pagination cell — page number, ellipsis, or navigation arrow.
Extracted from Figma Pagination Item (894:1495) — 10 variants on a single
`State` axis. Composes inside the Pagination bar.

- **Base**: `.pagination-item` (the `default` kind — a 32×32 cell)
- **Kinds**: `.pagination-item-active`, `.pagination-item-ellipsis`,
  `.pagination-item-nav`
- **States**: `:hover`, `:active`, `:focus-visible`, `:disabled`

| Kind        | box                                   | content                             |
| ----------- | ------------------------------------- | ----------------------------------- |
| default     | `Surface/Paper` + 1px `Stroke/Border` | 13px mono, `Content/Secondary`      |
| `-active`   | `Primary/Main`, **no stroke**         | `Content/Contrast`                  |
| `-ellipsis` | no fill, no stroke                    | `Content/Tertiary`, a literal `...` |
| `-nav`      | same as default                       | 14px icon, `Secondary/Main`         |

> **The six hover and pressed states are not tokenised.** `get_variable_defs`
> returns only `Stroke/Line` for those variants, so their fills and strokes are
> raw values, read by sampling the render. The fills ship on the Action ramp,
> which is what the progression intends and lands within a few units:
>
> | state           | Figma raw | shipped           | Δ   |
> | --------------- | --------- | ----------------- | --- |
> | default-hover   | `#f2f2f5` | `Action/Hover`    | 3.3 |
> | default-pressed | `#e6e6eb` | `Action/Selected` | 5.7 |
>
> On the designer list.

> **Active hover goes _lighter_ in Figma** (`#295c9e` against `Primary/Main`'s
> `#1e4d8c`), where Button, TextButton and Pill all darken to `Primary/Dark`.
> No lighter-primary token exists, so this darkens like the rest of the library
> — a deliberate divergence, not a match.

> **The border darkens through three un-tokenised greys**: `#e1e1e3` at rest
> (which _is_ exactly `Stroke/Border`), then `#c6c6cc` and `#b1b1ba` — roughly
> `Stroke/Border` at 0.24 and 0.33 alpha. The stroke ramp has no such steps, so
> the border is held at `Stroke/Border` throughout and the fill carries the
> state.

> **Ellipsis is a label, not a control.** Figma draws no hover or pressed for
> it, so it ships as a `<span>` and the shared hover rule excludes it by name —
> `:hover` matches spans too, so the exclusion is load-bearing.

> **No disabled variant exists in Figma**, but the nav arrows need one at the
> first and last page. Added with tokens rather than a blanket opacity, and
> scoped away from `active` so a disabled current page keeps its fill.

> **The label weight varies by kind**, which is easy to miss because the size
> and family do not: default is **Medium (500)**, active **Bold (700)**, and
> ellipsis **Regular (400)**. None is a named Figma text style, and
> `--text-data-s` is Regular, so the token supplies family and size while each
> kind steps its own weight.

> The 4px radius is raw in Figma but equals `--radius-tight` exactly.

```html
<div role="navigation" aria-label="Pagination" style="display: flex; gap: 6px;">
  <button
    class="pagination-item pagination-item-nav"
    aria-label="Previous page"
    disabled
  >
    <svg class="icon icon-size-14" aria-hidden="true">
      <use href="#chevron-left" />
    </svg>
  </button>
  <button class="pagination-item pagination-item-active" aria-current="page">
    1
  </button>
  <button class="pagination-item">2</button>
  <span class="pagination-item pagination-item-ellipsis" aria-hidden="true"
    >...</span
  >
  <button class="pagination-item">24</button>
  <button class="pagination-item pagination-item-nav" aria-label="Next page">
    <svg class="icon icon-size-14" aria-hidden="true">
      <use href="#chevron-right" />
    </svg>
  </button>
</div>
```

#### FieldVerification

Inline field-level verification indicator. Extracted from Figma Field
Verification (142:350) — 5 variants on a single `State` axis, plus a Ring
boolean.

- **Base**: `.field-verification`
- **States**: `.field-verification-verified`, `-pending`, `-none`, `-mismatch`
- **Parts**: `.field-verification-icon` (mismatch only), `-label`, `-details`,
  `-detail`, `-action`
- **Slots (reused components)**: `.section-marker` (verified, pending, none)
- **States**: `.with-ring`

**Four states are one-line rows; the fifth is a stacked panel.** Every value
below was measured from the Figma render, because Figma flattens the glyphs to
vectors:

| State                | mark                                     | colours                                            |
| -------------------- | ---------------------------------------- | -------------------------------------------------- |
| `verified`           | Section Marker + 14px `#check`           | `Approved/Main` icon, `Content/Tertiary` label     |
| `pending`            | Section Marker + 14px `#circle`          | `Content/Tertiary` throughout                      |
| `none`               | Section Marker + 14px `#minus`, no label | `Content/Tertiary`                                 |
| `mismatch` (preview) | bare 15px `#triangle-alert`              | `Critical/Main` throughout                         |
| `mismatch` (details) | same icon + stacked block                | `Critical/Main`, one `Content/Secondary` mono line |

> **Three of the five icons are Section Marker instances.** Figma nests a 16×16
> instance at y=1 for verified, pending _and_ none — each is an `<instance>` in
> the node metadata, and pending's label starts at x=23 (16 + the 7px gap).
> Only mismatch uses a bare 15px glyph, in a 15×18 frame.
>
> That 16px box is load-bearing: a bare 14px icon shifts the label 2px left and
> misaligns pending and none against verified in a column.
>
> Only the **colour** differs — pending and none bind `Content/Tertiary` where
> Section Marker's own `unverified` binds `Secondary/Main`.

> **`State=none` is a `#minus` glyph**, not a rule and not a hyphen character.
> An earlier revision built it as a 10×1px bar from the `Spacing/10` and
> `Spacing/1` bindings — but `Spacing/10` appears in pending and mismatch too,
> so it was never none-specific.

> **The expanded state tops-aligns while the rows centre.** Driven off the
> presence of `.field-verification-details` with `:has()`, so there is no extra
> modifier class to remember.

> **The outer widths are not pinned** — Figma's 83 / 111 / 16 / 159px are its
> sample strings and this sits inline beside a field value. **The 137px details
> column is different**: Figma authors it as a fixed width, which is why its
> mono line wraps to two rows. Left unpinned here so the block adapts, at the
> cost of that line running on where Figma wraps it.

> **The mismatch action row is not a Text Button.** It looks like one, but Figma
> draws plain text plus an arrow rather than an instance, and its colour is
> `Critical/Main` where every Text Button type is Content or Primary. On the
> designer list.

```html
<!-- verified — the icon is a Section Marker -->
<span class="field-verification field-verification-verified">
  <span class="section-marker section-marker-approve">
    <svg class="icon icon-size-14" aria-hidden="true">
      <use href="#check" />
    </svg>
  </span>
  <span class="field-verification-label">Matches X</span>
</span>

<!-- none — a #minus glyph in a Section Marker, not a character -->
<span
  class="field-verification field-verification-none"
  role="img"
  aria-label="No status"
>
  <span class="section-marker">
    <svg class="icon icon-size-14" aria-hidden="true">
      <use href="#minus" />
    </svg>
  </span>
</span>

<!-- mismatch, expanded -->
<span class="field-verification field-verification-mismatch">
  <svg class="field-verification-icon icon icon-size-15" aria-hidden="true">
    <use href="#triangle-alert" />
  </svg>
  <span class="field-verification-details">
    <span class="field-verification-label">Does not match KYC</span>
    <span class="field-verification-detail">Reported: 04/12/1988</span>
    <span class="field-verification-action">
      Review discrepancy
      <svg class="icon icon-size-15" aria-hidden="true">
        <use href="#arrow-right" />
      </svg>
    </span>
  </span>
</span>
```

#### SectionMarker

Visual marker indicating the verification status of a document section.
Extracted from Figma Section Marker (141:1071) — 4 variants on a single
`Status` axis, plus a Ring boolean.

- **Base**: `.section-marker` (a fixed 16×16 box)
- **Statuses**: `.section-marker-approve`, `.section-marker-mismatch`,
  `.section-marker-unverified` — and `na`, which takes **no class**
- **Parts**: `.section-marker-dot` (mismatch's 8px filled circle)
- **States**: `.with-ring`

**What goes inside the box is not uniform** — two glyphs, one shape, one nothing:

| Status       | mark                      | colour           |
| ------------ | ------------------------- | ---------------- |
| `approve`    | 14px `#check`             | `Approved/Main`  |
| `mismatch`   | 8px `.section-marker-dot` | `Critical/Main`  |
| `unverified` | 14px `#circle`            | `Secondary/Main` |
| `na`         | nothing at all            | —                |

> **`Status=na` draws nothing.** Not a dash, not a hollow box — the variant is
> empty. It still occupies 16px so a column of markers stays aligned, which is
> presumably the intent but is equally consistent with an unfinished variant.
> On the designer list. There is deliberately no `.section-marker-na` class:
> with no colour to set it would be an empty rule.

> **Measured, not assumed.** Figma flattens these to vectors, so the geometry
> was read by tracing the exported PNG — approve's ink is 12×8, the mismatch dot
> is exactly 8×8 centred with a 4px inset (matching its `Spacing/4` binding),
> unverified's ring fills 14×14, and na's box is uniformly blank.

> **`unverified` binds `Secondary/Main`, not `Content/Secondary`.** They resolve
> to the same `#5b5b68`, but the spec pins the token Figma actually uses.

> **The ring is square here.** Every other `.with-ring` sits on a rounded
> element and inherits its radius; this box has none, which matches Figma's
> `inset-0` with no corner rounding.

> **It carries meaning, so it needs a name.** Give the container `role="img"`
> and an `aria-label`, and leave the glyph `aria-hidden`. `na` needs one too, or
> a screen reader announces nothing at all.

```html
<span
  class="section-marker section-marker-approve"
  role="img"
  aria-label="Approved"
>
  <svg class="icon icon-size-14" aria-hidden="true"><use href="#check" /></svg>
</span>

<span
  class="section-marker section-marker-mismatch"
  role="img"
  aria-label="Mismatch"
>
  <span class="section-marker-dot"></span>
</span>

<span
  class="section-marker section-marker-unverified"
  role="img"
  aria-label="Unverified"
>
  <svg class="icon icon-size-14" aria-hidden="true"><use href="#circle" /></svg>
</span>

<!-- na: no status class, no child -->
<span class="section-marker" role="img" aria-label="Not applicable"></span>
```

#### Alert

Contextual feedback banner for inline status messages. Extracted from Figma
Alert (880:31080) — 5 variants on a single `Type` axis, plus three booleans
(Icon, Action Button, Dismiss).

- **Base**: `.alert` — layout only, **a type class is required**
- **Types**: `.alert-critical`, `.alert-warning`, `.alert-success`,
  `.alert-info`, `.alert-neutral`
- **Parts**: `.alert-body`, `.alert-icon`, `.alert-content`, `.alert-title`,
  `.alert-message`
- **Slots (reused components)**: `.text-button text-button-primary` (action),
  `.icon-button icon-button-md` (dismiss)

> **A type class is required.** Figma's `Type` axis has no default, and baking
> one into the base class is the mistake Tabs already taught us. A bare `.alert`
> renders transparent, which reads as the authoring error it is.

Type drives the fill, the 3px rail and the icon — one pattern, one exception:

| Type              | fill            | rail            | icon                  |
| ----------------- | --------------- | --------------- | --------------------- |
| `.alert-critical` | `Critical/Soft` | `Critical/Main` | `Critical/Main`       |
| `.alert-warning`  | `Warning/Soft`  | `Warning/Main`  | `Warning/Main`        |
| `.alert-success`  | `Approved/Soft` | `Approved/Main` | `Approved/Main`       |
| `.alert-info`     | `Primary/Soft`  | `Primary/Main`  | `Primary/Main`        |
| `.alert-neutral`  | `Neutral/Soft`  | `Neutral/Main`  | **`Neutral/Content`** |

> **Neutral's icon is the odd one out**, and this was verified by sampling the
> Figma render rather than assumed: its rail is `Neutral/Main` (#9999a6) while
> its glyph is `Neutral/Content` (#65656e). That is why `Neutral/Content`
> appears in that one variant's variable set and nowhere else.

**The icon is a slot** — Type sets only its colour:

| Type     | glyph                                         |
| -------- | --------------------------------------------- |
| critical | `#triangle-alert`                             |
| warning  | `#info` (an info glyph on the _warning_ type) |
| success  | `#check`                                      |
| info     | `#refresh-cw` (not an info glyph)             |
| neutral  | `#refresh-cw`                                 |

> **The rail is a left border, not a child element.** Figma models it as a
> rectangle clipped by an `overflow: clip` frame. Both renders were traced pixel
> by pixel down the corner arc: Figma reaches the full 3px seven rows down, ours
> on the eighth — a one-row antialiasing difference, identical either side.

> **Width is not pinned.** Figma's 828px is the leftover of a 1007px artboard
> with 36px margins, not a spec — a banner spans its container. Contrast Modal
> (480) and Toast (356), which are genuinely fixed and _are_ pinned.

> **The dismiss is not an instance in Figma** — it is a stray 10×16 raw vector,
> where Toast and Modal both use a real Icon Button. Treated as an authoring
> slip and implemented as `.icon-button icon-button-md`. On the designer list.

```html
<div class="alert alert-critical" role="alert">
  <div class="alert-body">
    <svg class="alert-icon icon icon-size-18" aria-hidden="true">
      <use href="#triangle-alert" />
    </svg>
    <div class="alert-content">
      <p class="alert-title">Business address mismatch</p>
      <p class="alert-message">Middesk returns a registered-agent address.</p>
      <button class="text-button text-button-primary">Review Field</button>
    </div>
    <button class="icon-button icon-button-md" aria-label="Dismiss">
      <svg class="icon icon-size-14" aria-hidden="true"><use href="#x" /></svg>
    </button>
  </div>
</div>
```

#### Toast

Transient floating notification for brief status feedback. Extracted from Figma
Toast (880:31121) — Type (success / error / info) × Style (Full / Simple).

- **Base**: `.toast` (Full — a 356px card)
- **Types**: `.toast-success`, `.toast-error`, `.toast-info` (icon colour only)
- **Style**: `.toast-simple` (a 280px dark pill)
- **Parts**: `.toast-header`, `.toast-main`, `.toast-icon`, `.toast-text`,
  `.toast-title`, `.toast-message`, `.toast-footer`, `.toast-timestamp`
- **Slots (reused components)**: `.icon-button icon-button-md` (dismiss),
  `.text-button text-button-primary` (footer action)

> **The two styles share almost nothing.** Figma models them as one component,
> but Full is a white card and Simple is a dark pill — different background,
> radius, padding, direction, width, shadow and text colour. `.toast-simple`
> overrides essentially all of `.toast`.

> **The action and dismiss are existing components, not new parts.** Figma's
> "Retry" is a literal Text Button instance (Type=Primary) and the close is an
> Icon Button. Nothing new is defined for either.

**The icon is a slot** — Type sets only its colour. What Figma draws:

| Type             | glyph                             | colour                      |
| ---------------- | --------------------------------- | --------------------------- |
| `.toast-success` | `#circle-check`                   | `Approved/Main`             |
| `.toast-error`   | `#triangle-alert`                 | `Critical/Main`             |
| `.toast-info`    | `#refresh-cw` (not an info glyph) | `Primary/Main`              |
| `.toast-simple`  | `#check`                          | inherits `Content/Contrast` |

> **Three Figma gaps, reported rather than papered over.** Simple exists only
> for `Type=info` — there is no success or error Simple, so `.toast-simple`
> ignores the type classes rather than invent two. That one variant is typed
> `info` but draws a success check. And its Figma description is Tooltip's,
> copied verbatim. All three are on the designer list.

> **Two shadows, deliberately.** Full uses a local effect, tokenised as
> `--shadow-toast`; Simple uses the named General Drop Shadow, already
> `--shadow-panel`. They are not interchangeable.

> **Simple's 35px height is pinned.** Figma draws strokes without adding to the
> frame, so its 10 + 15 + 10 ignores the 1px border; border-box derives 37. Same
> trap `button.css` and `pill.css` document.

```html
<!-- Full -->
<div class="toast toast-success" role="status">
  <div class="toast-header">
    <div class="toast-main">
      <svg class="toast-icon icon icon-size-18" aria-hidden="true">
        <use href="#circle-check" />
      </svg>
      <div class="toast-text">
        <p class="toast-title">Document request sent</p>
        <p class="toast-message">
          Client has been notified to upload their W-9.
        </p>
      </div>
    </div>
    <button class="icon-button icon-button-md" aria-label="Dismiss">
      <svg class="icon icon-size-14" aria-hidden="true"><use href="#x" /></svg>
    </button>
  </div>
  <div class="toast-footer">
    <span class="toast-timestamp">just now</span>
    <button class="text-button text-button-primary">Retry</button>
  </div>
</div>

<!-- Simple -->
<div class="toast toast-simple" role="status">
  <svg class="icon icon-size-15" aria-hidden="true"><use href="#check" /></svg>
  Template Saved
</div>
```

#### TextButton

Text-only button for inline or cell-level actions. Extracted from Figma Text
Button (679:21601) — 11 variants across Type × Hover × Pressed × Active, plus
Icon and Ring booleans.

- **Base**: `.text-button` (defaults to the `cell` type)
- **Types**: `.text-button-cell`, `.text-button-text`, `.text-button-primary`
- **Icon**: `.icon icon-size-12` (Figma's Icon boolean, 4px gap)
- **States**: `:hover`, `:active`, `:focus-visible`, `[aria-pressed="true"]` /
  `[aria-selected="true"]`, `:disabled`, `.with-ring`

> **This is not a `.btn` variant.** Different Figma component, different type
> scale, different geometry — `.btn` has fixed 24/28/32px heights, this hugs its
> text at 15px or 18px. Use `.btn-empty` for a real button that happens to look
> bare; use `.text-button` for an inline affordance inside a table cell or a
> line of copy.

**The three types are not three skins of one control** — `cell` is a genuinely
different size:

| Type      | type         | padding   | height | rest                | hover                              | pressed                              | active                          |
| --------- | ------------ | --------- | ------ | ------------------- | ---------------------------------- | ------------------------------------ | ------------------------------- |
| `cell`    | 11px Micro L | 7px / 1px | 15px   | `Content/Secondary` | `Content/Primary` + `Action/Hover` | `Content/Primary` + `Action/Focused` | `Primary/Main` + `Primary/Soft` |
| `text`    | 12px Caption | none      | 18px   | `Content/Secondary` | `Content/Primary`                  | `Content/Primary`                    | `Primary/Main`                  |
| `primary` | 12px Caption | none      | 18px   | `Primary/Main`      | `Primary/Dark`                     | `Primary/Pressed`                    | —                               |

`cell` is the only type with padding or a background. `text` and `primary`
differ only in colour ramp.

> **Active steps the weight 400 → 500**, via `Micro L - Bold` / `Caption - Bold`.
> Both Figma styles say "Bold" and both report Medium / 500 — do not map "-Bold"
> to 700. The whole type token is swapped rather than a bare `font-medium`,
> because `--text-*` also carries size and line-height.

> **`cell`'s 15px height is pinned, and must be.** `Micro L` carries a Figma
> "Auto" line height, so the box is font-dependent: Figma resolves it to 13px
> and Chrome to 14px. Same trap `button.css` and `pill.css` document. `text` and
> `primary` need no pin — their 18px line-height is explicit.

> **Two Figma oddities reproduced, not corrected.** `text` draws Hover and
> Pressed identically, so pressing gives no feedback; and `primary` has no
> Active variant, where the other two have one. Both are on the designer list.

```html
<!-- cell: inline action inside a table cell -->
<button class="text-button text-button-cell" aria-pressed="false">
  Select all
</button>

<!-- text: standalone link-style action -->
<button class="text-button text-button-text" aria-pressed="false">
  View details
</button>

<!-- primary, with the Icon boolean -->
<button class="text-button text-button-primary">
  <svg class="icon icon-size-12" aria-hidden="true"><use href="#plus" /></svg>
  Add row
</button>

<!-- selected -->
<button class="text-button text-button-cell" aria-pressed="true">
  Select all
</button>
```

#### Modal

Dialog for confirmations and focused workflows. Extracted from Figma Modal
(908:1580) — three variants on one `Action` axis, plus two booleans.

- **Base**: `.modal` (480px wide, height follows content)
- **Actions**: `.modal-destructive`, `.modal-positive`, `.modal-neutral`
- **Parts**: `.modal-header`, `.modal-title-group`, `.modal-icon`,
  `.modal-title`, `.modal-subtitles`, `.modal-subtitle`, `.modal-description`,
  `.modal-context`, `.modal-context-text`, `.modal-footer`
- **Slots (reused components)**: `.icon-button icon-button-lg` (close),
  `.btn … btn-lg` (footer)

**Action drives three things**, and the CSS only styles the first — the icon and
the button are slots, exactly as in Figma:

| Action               | icon container                       | header icon       | confirm button  |
| -------------------- | ------------------------------------ | ----------------- | --------------- |
| `.modal-destructive` | `Critical/Soft` + `Critical/Main`    | `#triangle-alert` | `.btn-critical` |
| `.modal-positive`    | `Approved/Soft` + `Approved/Content` | `#circle-check`   | `.btn-primary`  |
| `.modal-neutral`     | `Surface/Neutral` + `Neutral/Main`   | `#info`           | `.btn-outline`  |

> **Two of those three break the `{Action}/Soft` + `{Action}/Main` pattern** —
> positive uses `Approved/Content`, and neutral fills with `Surface/Neutral`
> rather than the `Neutral/Soft` that exists. Both are reproduced from Figma
> rather than corrected, and both are on the designer list.

> **`.btn-critical` is new, and is not in Figma's Button set** (73:180, which is
> primary / outline / empty only). It comes from this modal's destructive
> confirm button. It lives in [button.css](src/components/button.css) because a
> destructive confirm is not modal-specific. Figma specifies its rest state
> only; hover steps to `Critical/Strong` by our choice.

> **The two 12px subtitle styles are not interchangeable.** `.modal-subtitle` is
> `Body Content/Caption` (18px leading, `Content/Secondary`);
> `.modal-description` is `Body & Supporting/Help & Caption` (14px leading,
> `Content/Tertiary`). Same size, different everything else. This modal is also
> the evidence that `Help & Caption` is still current — it was flagged as
> unconfirmed under **Still open** below.

> **Height is content-driven.** Figma's 299px (positive) vs 317px (the other
> two) is the subtitle wrapping to a second line, not a spec difference. Only
> the 480px width is fixed.

> **The 12px corner radius is past the end of our radius scale** and is
> hardcoded in Figma too, so it is written raw. The drop shadow is a local
> effect rather than a named style, but is tokenised as `--shadow-modal`,
> following the precedent of `--shadow-knob`.

> **Positioning and the backdrop are yours**, as with Tooltip — Figma draws the
> dialog frame only. On a native `<dialog>` the browser supplies centring, the
> backdrop, focus trapping and Escape-to-close for free, and `.modal` ships a
> `::backdrop` scrim for that case. That is the recommended way to use it.

```html
<dialog class="modal modal-destructive" aria-labelledby="decline-title">
  <div class="modal-header">
    <div class="modal-title-group">
      <span class="modal-icon">
        <svg class="icon icon-size-20" aria-hidden="true">
          <use href="#triangle-alert" />
        </svg>
      </span>
      <h2 class="modal-title" id="decline-title">Decline this application?</h2>
    </div>
    <button class="icon-button icon-button-lg" aria-label="Close">
      <svg class="icon icon-size-16" aria-hidden="true"><use href="#x" /></svg>
    </button>
  </div>

  <div class="modal-subtitles">
    <p class="modal-subtitle">The applicant is notified through the portal.</p>
    <p class="modal-description">Two blocking items remain unresolved.</p>
  </div>

  <!-- Context Window boolean -->
  <div class="modal-context">
    <p class="modal-context-text">#BA-204417 &middot; Northwind Freight LLC</p>
  </div>

  <div class="modal-footer">
    <button class="btn btn-empty btn-lg">Cancel</button>
    <button class="btn btn-critical btn-lg">Decline application</button>
  </div>
</dialog>

<script>
  // No component JS — <dialog> does the work.
  dialog.showModal();
</script>
```

#### Tooltip

Dark contextual popover for hover explanations and helper text. Extracted from
Figma Tooltip (880:31125) — a single symbol, no variants.

- **Base**: `.tooltip` (280px wide, dark)
- **Parts**: `.tooltip-title`, `.tooltip-content`, `.tooltip-divider`, `.tooltip-subtext`

| part               | type              | colour             |
| ------------------ | ----------------- | ------------------ |
| `.tooltip-title`   | 11px / 400        | `Content/Faint`    |
| `.tooltip-content` | 12px / 18px / 400 | `Content/Contrast` |
| `.tooltip-subtext` | 11px / 400        | `Content/Faint`    |

> **The only dark surface in the library.** The fill is `Content/Primary` and
> the text tokens invert accordingly. Do not reach for the usual
> `content-primary` text colour inside it.

> **The divider is `Content/Secondary`, not `Stroke/Divider`.** The latter is
> `rgba(20,20,40,0.08)` and would be invisible on this background. Read from
> the exported SVG, since the codegen renders the rule as an asset and does not
> expose its stroke.
>
> The 1px border, however, _is_ `Stroke/Divider` — near-black at 8% on a
> near-black fill, so it contributes nothing visually. Implemented faithfully;
> looks vestigial.

> **All four parts are optional in markup.** Figma models title / content /
> subtext as text properties rather than boolean toggles, so it always draws
> them, but a body-only tooltip is the common case and nothing depends on the
> siblings being present.

> **Positioning is the consumer's job** — Figma models the bubble only. No
> arrow, no placement, no collision handling, and no caret layer exists in the
> component.

```html
<!-- Full, as drawn in Figma -->
<div class="tooltip" role="tooltip" id="tt-naics">
  <p class="tooltip-title">INDUSTRY / NAICS</p>
  <p class="tooltip-content">
    Six digits used to classify business establishments.
  </p>
  <hr class="tooltip-divider" />
  <p class="tooltip-subtext">Middesk · Secretary of State</p>
</div>

<!-- Body only — the common case -->
<div class="tooltip" role="tooltip">
  <p class="tooltip-content">
    Six digits used to classify business establishments.
  </p>
</div>

<!-- Anchored to a trigger; positioning is yours -->
<span style="position: relative; display: inline-block;">
  <button
    class="icon-button icon-button-xs"
    aria-describedby="tt-naics"
    aria-label="What is NAICS?"
  >
    <svg class="icon icon-size-12" aria-hidden="true">
      <use href="#custom-help" />
    </svg>
  </button>
  <span
    style="position: absolute; top: calc(100% + 8px); left: 0; z-index: 50;"
  >
    <!-- .tooltip -->
  </span>
</span>
```

#### Tag

Compact label for categorization and filtering — a label that happens to be
clickable. Extracted from Figma Tag (79:251): Hover × Active × Disabled × Size,
plus four boolean slots.

- **Base**: `.tag` (defaults to sm)
- **Sizes**: `.tag-sm` (21px, default), `.tag-md` (24px)
- **Parts**: `.tag-count` (trailing count, md only)
- **Slots (reused components)**: `.avatar avatar-xs` (leading, md only),
  `.dot dot-warning` (trailing, both sizes)
- **States**: `:hover`, `:focus-visible`, `[aria-pressed="true"]` /
  `[aria-selected="true"]`, `:disabled`, `.with-ring`

> **The slots are existing components, not new parts.** Figma's avatar slot is
> a literal instance of Avatar `Size=xs` — byte-identical class list — so it
> uses `.avatar avatar-xs`. The status dot is a 5px `Warning/Main` circle,
> which is exactly `.dot dot-warning`. Only the count needed a new class,
> because despite Figma calling it a "count badge" it is **not a badge**: bare
> JetBrains Mono text, no circle, no fill, no border.

> **Avatar and count are md-only.** Figma draws neither on any sm variant —
> the layers do not exist there, they are not merely hidden.

> **Disabled dims the label and nothing else** — not the border, not the
> background, not the slots. A disabled Tag keeps a fully enabled Avatar.

> Two Figma oddities reproduced rather than corrected: md's active state bumps
> the label to weight 500 while sm's stays 400, and the gap is _larger_ on the
> smaller size (sm 10px, md 8px). Both look like authoring slips — raised with
> the designer.
>
> Figma draws no active-without-hover variant, so a non-hovered active is
> unconfirmed. The spec asserts only the four combinations that exist.

#### Tag vs Pill

Both descriptions say "filtering". They are not the same control:

|           | Tag                              | Pill                                        |
| --------- | -------------------------------- | ------------------------------------------- |
| reads as  | content                          | chrome                                      |
| rest      | transparent + hairline           | always filled, borderless                   |
| active    | solid `Primary/Main`, white text | soft `Primary/Soft` tint                    |
| height    | 21 / 24px                        | 17px                                        |
| slots     | avatar, count, status dot        | optional dropdown chevron                   |
| disabled  | yes                              | not modelled                                |
| use it to | label a record inline in content | offer a choice in a filter or segmented bar |

```html
<!-- Simple label -->
<button class="tag" aria-pressed="false">Design</button>

<!-- Selected -->
<button class="tag" aria-pressed="true">Approved</button>

<!-- md with every slot -->
<button class="tag tag-md" aria-pressed="false">
  <span class="avatar avatar-xs">JS</span>
  Design
  <span class="tag-count">1</span>
  <span class="dot dot-warning"></span>
</button>

<!-- Disabled — label dims, nothing else -->
<button class="tag" aria-pressed="false" disabled>Archived</button>
```

#### Pill

Compact rounded control — a filter toggle, or a dropdown trigger when it carries
a chevron. Extracted from Figma Pill (91:505) — 6 variants (State × Dropdown),
plus a Ring boolean.

- **Base**: `.pill` (17px tall, hug width)
- **Parts**: `.pill-chevron` (13px trailing chevron)
- **States**: `:hover`, `:focus-visible`, `[aria-expanded="true"]` /
  `[aria-pressed="true"]` / `[aria-selected="true"]`, `:disabled`, `.with-ring`
- **Type**: `text-statecap` (9.5px / 600)

> **Active means two things, and the chevron decides which.** Figma draws one
> active treatment but ships both a Dropdown=Yes and a Dropdown=No variant:
>
> |              | attribute              | meaning   | chevron    |
> | ------------ | ---------------------- | --------- | ---------- |
> | with chevron | `aria-expanded="true"` | menu open | flips 180° |
> | without      | `aria-pressed="true"`  | selected  | n/a        |
>
> Both give the same `primary-soft` fill and `primary` text. Only
> `aria-expanded` rotates anything.

> **The token names are off by one — do not "fix" them.** Rest uses the token
> literally named `Action/Hover`; hover uses `Action/Focused`. It reads like a
> bug in review. It is what the design file specifies.

> **"Statecap" is not uppercase.** Despite the style name, Figma renders the
> label mixed-case with no transform. The visual spec asserts
> `text-transform: none` so nobody adds it back.

> Height is pinned at 17px. Without a chevron the 9.5px Auto line box alone
> would give ~15.5px, but Figma is 17 either way.
>
> Width hugs the label — Figma's 88px and 70px are just the widths of its
> sample strings, not fixed sizes.

```html
<!-- Dropdown trigger -->
<button class="pill" aria-haspopup="listbox" aria-expanded="false">
  John Smith
  <svg class="pill-chevron icon icon-size-13" aria-hidden="true">
    <use href="#chevron-down" />
  </svg>
</button>

<!-- Filter toggle, no chevron -->
<button class="pill" aria-pressed="false">Overdue</button>
<button class="pill" aria-pressed="true">Approved</button>

<!-- Ring -->
<button class="pill with-ring" aria-pressed="false">Overdue</button>
```

`.pill` the component is unrelated to `rounded-pill` the radius utility — the
latter is Figma's `Radius/Rounded` and is used by Avatar, Chip and Switch too.

#### Avatar

Circular user marker showing initials. Extracted from Figma Avatar (79:230) —
8 variants (4 sizes × Disabled), plus a Ring boolean.

- **Base**: `.avatar` (defaults to md)
- **Sizes**: `.avatar-xs` (16px), `.avatar-sm` (18px), `.avatar-md` (20px, default), `.avatar-lg` (34px)
- **States**: `.avatar-disabled`, `.with-ring` (shared with Chip — 2px inset ring in `Primary/Main`)
- **Colors**: `Primary/Main` fill, `Content/Contrast` initials, 0.5px `Stroke/Divider` hairline

| Size | Diameter | Type style          |                  |
| ---- | -------- | ------------------- | ---------------- |
| xs   | 16px     | `text-micro-s-bold` | 8px / 600 / 0.4% |
| sm   | 18px     | `text-micro-s-bold` | 8px / 600 / 0.4% |
| md   | 20px     | `text-micro-m-bold` | 8.5px / 500      |
| lg   | 34px     | `text-micro-l-bold` | 11px / 500       |

> **Four sizes, three type styles.** xs and sm both use Micro S - Bold; only md
> and lg step up. Do not assume one style per size.
>
> **Disabled changes the fill and nothing else.** The initials stay
> `Content/Contrast` — they do not dim with the background.
>
> Figma names the md and lg styles "- Bold" but both report Medium / 500. Only
> Micro S - Bold is genuinely 600. Do not map "-Bold" to 700.

> **Initials only.** Figma's component description says _"User profile image
> displayed as a circle"_, but no image layer, image fill, or swap slot exists
> in any of the 8 variants — the children are the initials text and a hidden
> Ring. No image support is implemented rather than invent one. Open with the
> designer: was an image variant planned and dropped, or is the description
> stale?

```html
<!-- Default (md) -->
<span class="avatar avatar-md">NC</span>

<!-- Every size -->
<span class="avatar avatar-xs">NC</span>
<span class="avatar avatar-sm">NC</span>
<span class="avatar avatar-lg">NC</span>

<!-- Disabled — fill dims, initials do not -->
<span class="avatar avatar-md avatar-disabled">NC</span>

<!-- Ring -->
<span class="avatar avatar-lg with-ring">NC</span>
```

Avatar is the shared primitive behind the initials bubbles in MenuItem and
DropdownField. Both previously hand-rolled their own copies; those were retired
in favour of this component. Pick the size at the call site, the same way you
pick `.icon-size-*`.

#### IconButton

Compact button displaying only an icon. Use for toolbar actions, close buttons, and secondary actions where space is limited. Extracted from Figma (78:210).

- **Base**: `.icon-button` (transparent background, defaults to LG size)
- **Sizes**: `.icon-button-xs` (12×12px), `.icon-button-md` (18×18px), `.icon-button-lg` (28×28px, default)
- **Icon Sizes**: XS uses 12px icons, MD uses 14px icons, LG uses 16px icons
- **Glyph colour**: `Secondary/Main` at rest, `Secondary/Strong` on hover/active,
  `Secondary/Disabled` when disabled — icons inherit it via `currentColor`
- **States**: `:hover` (bg-action-hover), `:active` (bg-action-focused), `:disabled`
- **Optional**: `.icon-ring` (adds 2px ring in primary color for selected state)

```html
<!-- Extra small (12px - for labels) -->
<button class="icon-button icon-button-xs" aria-label="Help">
  <svg class="icon icon-size-12" aria-hidden="true">
    <use href="#custom-help" />
  </svg>
</button>

<!-- Medium (18px - compact actions) -->
<button class="icon-button icon-button-md" aria-label="Close">
  <svg class="icon icon-size-14" aria-hidden="true">
    <use href="#x" />
  </svg>
</button>

<!-- Large (28px - default, primary actions) -->
<button class="icon-button icon-button-lg" aria-label="Settings">
  <svg class="icon icon-size-16" aria-hidden="true">
    <use href="#settings" />
  </svg>
</button>

<!-- Disabled -->
<button class="icon-button icon-button-md" disabled aria-label="Disabled">
  <svg class="icon icon-size-14" aria-hidden="true">
    <use href="#x" />
  </svg>
</button>

<!-- With ring state (selected) -->
<button class="icon-button icon-button-md icon-ring" aria-label="Active filter">
  <svg class="icon icon-size-14" aria-hidden="true">
    <use href="#filter" />
  </svg>
</button>
```

#### Icon

Wrapper container for icons at standardized sizes. Maintains consistent icon dimensions across the UI. Icons inherit the current text color by default.

- **Base**: `.icon` (inline-flex container, defaults to 16px size)
- **Sizes**: `.icon-size-10`, `.icon-size-11`, `.icon-size-12`, `.icon-size-13`, `.icon-size-14`, `.icon-size-15`, `.icon-size-16`, `.icon-size-18`, `.icon-size-20`, `.icon-size-22`, `.icon-size-24`
- **State**: `.icon-ring` (adds circular border with 2px width in primary color)
- **Layout**: Flex container with centered content, prevents squashing in flex layouts
- **Color**: Inherits current text color via `currentColor`
- **Stroke**: scales with size via `--icon-stroke` — see below

**Stroke weight scales with size, and not proportionally.** Read from the Figma
Icon Container (69:6944) exports on 2026-08-25 — each size variant exports at
its own viewBox with a hand-set `stroke-width`, so the declared number _is_ the
rendered pixel width:

| Icon size  | Rendered stroke |
| ---------- | --------------- |
| 10, 11     | 0.75px          |
| 12, 13     | 1.00px          |
| 14         | 1.25px          |
| 15, 16, 18 | 1.25px          |
| 20, 22     | 1.50px          |
| 24         | 2.00px          |

> **The CSS numbers are user units, not pixels.** The sprite is one 24-unit
> viewBox, so `stroke-width: 2` renders `2 × size / 24` px. Each size class sets
> `--icon-stroke = target × 24 / size`, which is why the values are **not
> monotonic**: 18px needs a _smaller_ user-unit value (1.667) than 16px (1.875)
> to draw the same 1.25px, because its box is bigger. Do not tidy them into a
> sequence.

> **This replaced a flat `stroke-width: 2`**, a strictly linear `size/12` ramp —
> exact at 12, 15 and 24, but up to 22% too thick elsewhere (1.83px against
> Figma's 1.50 at 22px). Note the direction: an earlier audit claimed our strokes
> were "roughly half" Figma's, on the grounds that Figma exports
> `stroke-width="2"` at every size. Both halves are false — only the 24px variant
> declares 2, the 12px variant declares nothing at all (SVG default 1), and our
> strokes were too **thick**, never thin. Verified by measuring painted output in
> Chromium against the Figma exports at all eleven sizes.

> **14px was the one open value, and is now resolved at 1.25px.** Figma declares
> 1.1px there; the designer confirmed that was an authoring mistake and specified
> **1.25px**, so 14 joins the 15 / 16 / 18 plateau rather than extending the 1.0
> run at 12 / 13. Its user-unit value (2.142857) is the largest in the ramp — as
> it should be, since 14px is the smallest box that has to reach 1.25px.

> **Sizing with a raw utility skips the ramp.** `.icon-size-*` carries the
> weight, so an icon sized with `w-5 h-5` instead of `.icon-size-20` keeps the
> base 1.25px-at-16px value. Set `--icon-stroke` yourself in that case.

> **One symbol is exempt**: `custom-help` is the sprite's only non-24 viewBox
> (22×22) and its only symbol with a `stroke-width` presentation attribute. An
> element's own presentation attribute beats an inherited CSS value, so the ramp
> does not reach it.

```html
<!-- Basic icon with sprite (14px - common for buttons) -->
<svg class="icon icon-size-14" aria-hidden="true">
  <use href="#save" />
</svg>

<!-- Small icon (13px) -->
<svg class="icon icon-size-13" aria-hidden="true">
  <use href="#search" />
</svg>

<!-- Icon with ring state (selected/active) -->
<svg class="icon icon-size-14 icon-ring" role="img" aria-label="Active">
  <use href="#check" />
</svg>

<!-- Icon with status color -->
<svg class="icon icon-size-13 text-approved" aria-hidden="true">
  <use href="#check-circle" />
</svg>

<!-- Button with icon (see Button section above for full examples) -->
<button class="btn btn-primary">
  <svg class="icon icon-size-14" aria-hidden="true">
    <use href="#save" />
  </svg>
  Save Changes
</button>

<!-- Custom icon (prefixed with 'custom-') -->
<svg class="icon icon-size-24" aria-hidden="true">
  <use href="#custom-valiify-logo" />
</svg>
```

**Icon System Documentation**:

- Sprite system: `src/icons/README.md` (2,035 icons, build process)
- Integration guide: `src/components/ICON-SYSTEM.md` (complete usage patterns)
- Icon list: `src/icons/icon-list.txt` (searchable names)

#### SensitiveData

A masked value with a toggle that reveals it — an SSN, an account number, a date
of birth. Extracted from Figma Sensitive Data (296:5303) — 2 variants on a
`Checked` boolean, plus `obscuredData` / `unobscuredData` text properties and a
Ring boolean.

- **Base**: `.sensitive-data` (the row, 4px gap)
- **Parts**: `.sensitive-data-value` (Caption, `Content/Primary`)
- **Slots (reused components)**: `.icon-button icon-button-md` + `.icon icon-size-14`
- **States**: `.with-ring`

> **The toggle is an Icon Button, not a new part.** Figma nests an 18×18 box
> around a 14px glyph, which is `.icon-button icon-button-md` down to the pixel —
> including the 6px radius (`Radius/SM`) and the `Secondary/Main` glyph. Alert,
> Modal and Toast reuse Icon Button the same way for their dismiss controls.

> **State is `aria-pressed`, and the CSS deliberately has no state rule.** The
> two Figma variants are visually **identical** — same box, same colours, same
> type. Only the value string and the glyph change, and both are the consumer's
> to supply, so there is nothing for CSS to select on. Inventing an
> `[aria-pressed]` rule to justify the attribute would be styling Figma does not
> draw. The attribute still matters: it tells assistive tech the control is a
> toggle and which way it is set, matching Pill, Tag and Tabs.

> **`Checked` is not used as a class name, on purpose.** In Figma `Checked=yes`
> means the data is **hidden**, which reads backwards — a
> `.sensitive-data-checked` class would be actively misleading. Pair
> `aria-pressed="true"` with `#eye-off` and the obscured string; `false` with
> `#eye` and the plain one.

> **No hover, focus or disabled variants are modelled** — the axis is `Checked`
> alone. All of them arrive from Icon Button, which carries its own hover,
> active, disabled and `:focus-visible`. The row itself is not interactive.

> **Four Figma authoring artefacts are noted, not reproduced.** The component
> description is a **checkbox's**, pasted onto a masked-data toggle (same class
> of error as Toast carrying Tooltip's). `Radius/XS` (4px) is bound in the
> variant set but appears nowhere in the structure — the same phantom binding as
> FilterSegment's. The toggle's `Spacing/6` padding cannot contain its own glyph
> (18 − 12 leaves 6px for a 14px icon), so `.icon-button-md`'s 2px is used
> instead. And `Spacing/10` is set as a gap on a box with one child. All on the
> designer list.

```html
<!-- hidden — Figma's Checked=yes -->
<span class="sensitive-data">
  <span class="sensitive-data-value">***-**-1234</span>
  <button
    class="icon-button icon-button-md"
    aria-pressed="true"
    aria-label="Show full value"
  >
    <svg class="icon icon-size-14" aria-hidden="true">
      <use href="#eye-off" />
    </svg>
  </button>
</span>

<!-- revealed — Checked=no -->
<span class="sensitive-data">
  <span class="sensitive-data-value">123-12-1234</span>
  <button
    class="icon-button icon-button-md"
    aria-pressed="false"
    aria-label="Hide value"
  >
    <svg class="icon icon-size-14" aria-hidden="true"><use href="#eye" /></svg>
  </button>
</span>
```

#### DataRow

One labelled field in a review panel: field name, value, verification status,
and actions that appear on hover. Extracted from Figma Data Row (165:678) — 4
variants across `Hover` × `Icon`, plus `comment`, `help` and `ring` booleans.

- **Base**: `.data-row` (38px, 16px column gap)
- **Columns**: `.data-row-field` (200px, truncating), `.data-row-value` (400px)
- **Slot modifier**: `.data-row-status` — additive, stretches the Field Verification slot
- **Actions**: `.data-row-action` — additive on an Icon Button, revealed on hover/focus
- **States**: `:hover`, `.with-ring`
- **Slots (reused components)**: `.field-verification`, `.sensitive-data`, `.icon-button icon-button-md`

> **This component is mostly composition.** Figma builds it from three components
> we already ship, and so does the CSS — nothing is rebuilt. The status column is
> `.field-verification field-verification-verified` (an exact match: 7px gap, 16px
> Section Marker, 14px `#check` in `Approved/Main`, Caption label); the `Icon=yes`
> value is a literal `.sensitive-data` instance; the trailing actions are
> `.icon-button icon-button-md`. Only four classes are new, three of which carry
> nothing but column geometry.

> **`.data-row-status` is an additive class, not a wrapper.** Figma stretches its
> Field Verification instance to `flex-1`, which `.field-verification` does not do
> on its own. Rather than a descendant selector reaching into another component —
> the mistake DropdownField's avatar sizing made and had retired — it ships as a
> modifier you add alongside, the same shape as `.segment-selector-fill`.

> **The Sensitive Data type override is Data Row's, not the caller's.**
> Standalone, `.sensitive-data-value` is `Body Content/Caption` (12/18). Inside a
> Data Row, Figma overrides it to `Body 2` (12.5/12.5) so it lines up with the
> field label. That is a fixed fact of the composition rather than a per-instance
> choice, so it is scoped in `data-row.css` — and it has to be, because a utility
> at the call site would not exist for consumers on the prebuilt entry.

> **Actions are revealed by hover AND focus.** Figma draws the rest action at
> `opacity: 0` — laid out but invisible. Reproduced, except a button that is
> invisible and still focusable is a keyboard trap in all but name, so
> `:focus-within` reveals it too. That is a superset of Figma: identical on hover,
> and a keyboard user can now see what they tabbed to. Every action is icon-only
> and needs an `aria-label`.

> **No focus, disabled or selected state is modelled** — the axis is `Hover`
> alone. The row is not interactive; only its actions are, and those bring Icon
> Button's own states.

> **Three Figma artefacts, noted and not copied.** The description says "optional
> **leading** icon", but the `Icon` axis swaps the value cell for a Sensitive Data
> with a **trailing** eye toggle. `Neutral/Main` is bound in the variant set but
> appears nowhere in the structure — the same phantom binding as Sensitive Data's
> and FilterSegment's. And the 12.5px vertical padding cannot contain the row's
> own contents: 38 − 25 leaves 13px for an 18px Icon Button, so the vertical
> padding is vestigial; both are reproduced because `items-center` makes the
> overflow symmetrical and the rendered 38px is what matters.

> **The 932px frame width is not reproduced** — it is the artboard's content
> width, with slack absorbed by the `flex-1` status column. Same call as Alert's
> 828 and Pagination's 1208. A data row spans its table.

```html
<div class="data-row">
  <span class="data-row-field">First Name</span>
  <span class="data-row-value">John</span>

  <span class="field-verification field-verification-verified data-row-status">
    <span
      class="section-marker section-marker-approve"
      role="img"
      aria-label="Verified"
    >
      <svg class="icon icon-size-14" aria-hidden="true">
        <use href="#check" />
      </svg>
    </span>
    <span class="field-verification-label">Matches Plaid KYC</span>
  </span>

  <button
    class="icon-button icon-button-md data-row-action"
    aria-label="Field help"
  >
    <svg class="icon icon-size-14" aria-hidden="true">
      <use href="#circle-question-mark" />
    </svg>
  </button>
</div>
```

#### Checkbox

A native checkbox with a label, plus optional mono subtitle and trailing action.
Extracted from Figma Checkbox (108:607) — 4 variants across `Active` × `Hover` ×
`Disabled`, plus `label`, `subtitle`, `icon` and `ring` booleans.

- **Base**: `.checkbox` (a `<label>`, 9px gap)
- **Control**: `.checkbox-control` (15px positioning box), `.checkbox-input`, `.checkbox-check`
- **Parts**: `.checkbox-label`, `.checkbox-subtitle`
- **Slots (reused components)**: `.icon-button icon-button-md`
- **States**: `:hover`, `:checked`, `:focus-visible`, `:disabled`, `.with-ring`

| State              | box                                                            |
| ------------------ | -------------------------------------------------------------- |
| unchecked          | 1px `Stroke/Divider`, no fill                                  |
| unchecked hover    | 1px `Stroke/Border`, `Action/Hover` fill                       |
| unchecked disabled | 1px `Stroke/Disabled`, no fill                                 |
| checked            | 1px + fill `Primary/Main`, 10px `#check` in `Content/Contrast` |

> **The control is a real `<input type="checkbox">` inside a real `<label>`.**
> That is not incidental. Form-control accessible names are the most repeated
> defect in the accessibility audit — 20 nodes across Input, Switch and Textarea
> — and the cause every time was `<div class="…-label">`, which is styling with
> no programmatic association. A wrapping `<label>` names this control for free.
> If the visible text must sit outside, associate it with `for` / `id`; do not
> drop to a `<div>`.

> **Everything is driven by native state** — `:checked`, `:disabled`,
> `:focus-visible`, `:hover`. There is no `checked` or `disabled` class to fall
> out of sync with the input, and the control submits with a form and works with
> the keyboard and a screen reader without any JavaScript.

> **The checkmark is the sprite glyph, which is why there is a wrapper.** Figma
> draws Lucide `check` at 10px. A pseudo-element cannot render
> `<use href="#check">`, and a CSS-drawn tick would not be the same mark, so
> `.checkbox-control` exists purely to give the input and the glyph a shared 15px
> positioning context. RadioSelect needs no wrapper because its inner mark is a
> plain circle it can draw with `::before`.

> **The label goes _lighter_ when checked, and that is not a transcription
> error.** Unchecked it is `Content/Primary`; checked it is `Content/Tertiary` —
> the same colour as disabled. So a ticked row reads dimmer than an unticked one,
> and identical to one you cannot interact with. Reproduced faithfully and pinned
> in the spec; on the designer list, because a checked box reading as disabled is
> the opposite of the usual convention. Same shape as Step's inverted label ramp.

> **Four things Figma does not model, none invented here:**
>
> - **No indeterminate state.** The axis is `Active`, a boolean — this is a
>   two-state checkbox. `:indeterminate` is deliberately unstyled, so
>   `input.indeterminate = true` currently renders as unchecked. A "select all"
>   header has nothing to draw. Needs a designer decision; see the
>   `IndeterminateGap` story.
> - **No focus state.** `:focus-visible` uses the library-wide `focus-ring`, as
>   RadioSelect does.
> - **No error / invalid state.**
> - **No checked+hover and no checked+disabled** — only 4 of 8 combinations are
>   drawn. Checked+disabled is the consequential one: with nothing drawn, a
>   disabled ticked box keeps its full `Primary/Main` fill and reads as enabled.
>   RadioSelect invented a treatment for exactly this gap; Checkbox does **not**,
>   so the two components currently answer the same question differently.

> **Two quirks that did _not_ appear**, worth recording because the components
> built alongside it all had them: the Figma description is **accurate**, and
> `Radius/XS` is genuinely the box radius rather than a phantom binding. The
> checked box's `Spacing/1` padding also fits its own glyph (15 − 2 ≥ 10), unlike
> Sensitive Data's and Data Row's.

```html
<label class="checkbox">
  <span class="checkbox-control">
    <input type="checkbox" class="checkbox-input" />
    <svg class="checkbox-check icon icon-size-10" aria-hidden="true">
      <use href="#check" />
    </svg>
  </span>
  <span class="checkbox-label">Content</span>
</label>

<!-- with the subtitle and trailing-action booleans -->
<label class="checkbox">
  <span class="checkbox-control">
    <input type="checkbox" class="checkbox-input" checked />
    <svg class="checkbox-check icon icon-size-10" aria-hidden="true">
      <use href="#check" />
    </svg>
  </span>
  <span class="checkbox-label">Beneficial owner</span>
  <span class="checkbox-subtitle">TYPE</span>
  <button
    type="button"
    class="icon-button icon-button-md"
    aria-label="Open beneficial owner"
  >
    <svg class="icon icon-size-14" aria-hidden="true">
      <use href="#chevron-right" />
    </svg>
  </button>
</label>
```

#### Skeleton

A placeholder that mimics the shape and size of content while it loads,
previewing page structure and preventing layout shift. Extracted from Figma
Skeleton (1063:24034) — 15 variants across `Shape` × `Size` — with a written
usage spec at 1081:1986.

- **Base**: `.skeleton` (fill + motion only — no dimensions)
- **Shapes**: `.skeleton-line`, `.skeleton-heading`, `.skeleton-circle`, `.skeleton-rectangle`, `.skeleton-button`
- **Sizes**: `.skeleton-sm`, `.skeleton-md`, `.skeleton-lg`

**Both a shape and a size class are required.** Neither axis has a default in
Figma, and the dimensions are a 5×3 matrix rather than one box with three
scales — a Line SM is 120×12 while a Circle SM is 32×32.

| Shape     | radius                | SM     | MD      | LG      |
| --------- | --------------------- | ------ | ------- | ------- |
| Line      | `rounded-tight` 4px   | 120×12 | 200×16  | 320×20  |
| Heading   | `rounded-tight` 4px   | 160×20 | 240×24  | 360×32  |
| Circle    | `rounded-pill`        | 32     | 40      | 56      |
| Rectangle | `rounded-surface` 8px | 120×80 | 200×120 | 320×180 |
| Button    | `rounded-control` 6px | 64×32  | 96×36   | 128×40  |

> **Shape carries the radius, size carries the dimensions.** This is the only
> component in the library that uses four of the five radius tokens. Every one of
> the 15 pairs maps to a standard Tailwind step — 120px is `w-30`, 180px is
> `h-45` — so none needs arbitrary syntax.

> **The defaults are starting points, not a spec.** The usage node is explicit:
> "stretch instances with fill in auto-layout to match real content widths",
> while "heights should generally stay close to defaults to match the replaced
> element". A consumer utility beats a component class under our layer order, so
> `class="skeleton skeleton-line skeleton-md w-full"` just works.

> **The animation is a pulse, and Figma specifies it precisely** — unusually,
> since it draws no motion itself ("Animation is handled in code, not in Figma"):
> **2s per cycle, ease-in-out, opacity 1.0 → 0.4 → 1.0**.

> **It is deliberately not Tailwind's `animate-pulse`, though the node suggests
> it.** The usage spec offers `class="animate-pulse"` as a shortcut, but
> Tailwind's built-in keyframe is `50% { opacity: 0.5 }` on a
> `cubic-bezier(0.4, 0, 0.6, 1)` curve — neither the 0.4 floor nor the ease-in-out
> the same document specifies four bullets later. Custom keyframes are the only
> way to honour the written spec.

> **Instances pulse in sync, and that falls out for free.** Figma asks that "all
> skeleton instances within a single container should pulse in sync (same
> animation start time)". Identical animations on elements rendered together
> share a start time, so they do. The thing to avoid is the opposite instinct —
> do **not** add per-element `animation-delay` to stagger them; that is exactly
> the effect the spec rules out.

> **Reduced motion is guarded from the start, and the guard sits _inside_
> `@layer components`.** That placement is deliberate: `loading-indicator.css`
> puts its `prefers-reduced-motion` block outside the layer, which makes it the
> one rule in `dist` that outranks a consumer's utilities — the single place the
> overlay contract breaks. This file does not repeat it. The `@keyframes` stay
> outside the layer, as they do there, because `@keyframes` is name-scoped rather
> than cascaded.

> **Accessibility: the skeleton is decorative, and this is a library decision** —
> Figma specifies nothing. A screen reader announcing five grey boxes is worse
> than silence, so each `.skeleton` takes `aria-hidden="true"` and the
> **container** carries `role="status"`, `aria-busy="true"` and a label: one clear
> "Loading…" instead of N meaningless nodes. That differs from LoadingIndicator,
> where the spinner _is_ the announcement and carries `role="status"` itself.
> Markup is the consumer's, so CSS cannot enforce it.

**Composition patterns**, from the usage node:

| Pattern        | compose                                                   |
| -------------- | --------------------------------------------------------- |
| Card           | 1× Rectangle MD · 1× Heading MD · 2× Line MD · 1× Line SM |
| List item      | 1× Circle SM · 1× Heading SM · 1× Line MD                 |
| Table row      | multiple Line SM — one per column                         |
| Profile header | 1× Circle LG · 1× Heading LG · 1× Line MD                 |

```html
<div role="status" aria-busy="true" aria-label="Loading profile">
  <span class="skeleton skeleton-circle skeleton-lg" aria-hidden="true"></span>
  <span class="skeleton skeleton-heading skeleton-lg" aria-hidden="true"></span>
  <span class="skeleton skeleton-line skeleton-md" aria-hidden="true"></span>
</div>

<!-- widths stretch; heights stay near the defaults -->
<span
  class="skeleton skeleton-line skeleton-md w-full"
  aria-hidden="true"
></span>
```

#### NavigationRail

The sidebar family. Four sub-components in one file, composed together to build
the rail. **The rail container's own Figma reference has not been extracted yet**
— `.nav-rail` is layout-only scaffolding (a flex column) and deliberately
declares no width, padding, surface or border until that spec arrives.

- **Container**: `.nav-rail` (provisional — see above)
- **Sub-components**:
  - `.nav-title` — 46px header. Parts: `.nav-title-logo` (30px tile, put your own
    `<img>`/`<svg>` inside), `.nav-title-details`, `.nav-title-name`,
    `.nav-title-subtitle`, `.nav-title-action` (18px hit box)
  - `.nav-group` — 26px group header. Parts: `.nav-group-label`,
    `.nav-group-chevron`, `.nav-group-rule` (the collapsed-rail divider)
  - `.nav-item` — 32px row. Parts: `.nav-item-icon` (16px),
    `.nav-item-label`, `.nav-item-count` (mono), `.nav-item-status` (5px dot)
  - `.nav-badge` — 14px "Beta" pill; slots inside a nav item
- **Collapsed rail**: `.nav-title-collapsed`, `.nav-group-collapsed`,
  `.nav-item-collapsed` — per-part for now, so each is independently renderable
  and verifiable. A rail-level switch should drive them once the rail lands.
- **Nav item states**: `:hover`, `:active`, `:focus-visible`,
  `[aria-current="page"]` (current page, blue), `.nav-item-active` (ancestor
  section, grey), `:disabled` / `[aria-disabled="true"]`
- **Group disclosure**: `aria-expanded` on the `.nav-group` button rotates the
  chevron **and hides the rows it controls**. Two markup shapes work:
  `.nav-group` + `.nav-rail-items` (recommended — the wrapper gives
  `aria-controls` a target), or flat `.nav-group ~ .nav-item` siblings.
  Deliberately **inert in a collapsed rail**, where the header is a bare rule
  with no chevron: hiding rows there would strand them with no way back.

> **The library ships no JavaScript, so flipping `aria-expanded` is yours.** The
> whole integration is one handler; the CSS does the rest:
>
> ```js
> rail.addEventListener("click", (e) => {
>   const header = e.target.closest(".nav-group");
>   if (!header) return;
>   header.setAttribute(
>     "aria-expanded",
>     header.getAttribute("aria-expanded") === "true" ? "false" : "true",
>   );
> });
> ```
>
> Because the header is a real `<button>` with `aria-controls`, Enter/Space and
> screen-reader state announcement come for free. Verified both keys work.

> **Give the rail a height.** `.nav-rail` is `h-full` (`height: 100%`), so in an
> auto-height parent it resolves to content height (measured: 64px for a two-row
> rail) and `justify-between` has no slack — the footer stops being
> bottom-pinned. Put it in an `h-screen` wrapper, a grid row, or a sized flex
> parent.

> **Keep the label and details in the DOM when collapsed.** They are `sr-only`,
> not removed. `.nav-item-label`, `.nav-item-count` and `.nav-title-details` are
> what give those links their accessible names — omit them and you ship
> anonymous links in the tab order. Before this was fixed, axe found **16 of 21
> focusable nodes in the collapsed rail with no accessible name**.

> **Figma's state names are inverted from intuition.** In the Nav Item set,
> **"Passive" is the blue current-page look** (`Primary/Soft` + `Primary/Main`)
> and **"Active" is a neutral grey highlight** (`Action/Selected` +
> `Content/Primary`). Mapped here to what they describe — `aria-current="page"`
> for the page you are on, `.nav-item-active` for the section containing it.
> That pairing is a **reading**, not a fact from the file; confirm
> `.nav-item-active` with the designer before relying on it.

> **The group chevron is hover-only in Figma.** In the standalone component that
> makes the row grow 58 → 77px on pointer enter. **Inside the rail it does not
> grow** — the in-rail group fills, so it is 224px either way and the chevron
> just appears within it. Measured 224 at rest and 224 on hover. Touch users get
> no chevron; `:focus-visible` was added so keyboard users reach parity with
> mouse users, which is an addition to the design rather than a reading of it.

Four more things the file gets wrong or leaves undone, reproduced as drawn rather
than silently corrected:

| Finding                                                                                                                           | What we did                                                                                                                                                                                    |
| --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nav Badge declares `micro` / `md` sizes that are **pixel-identical**                                                              | Ship one `.nav-badge`. No size modifiers — synonyms would encode a distinction the design does not make.                                                                                       |
| Collapsed group is **38.5px** wide (8 + a raw 22.5px rule + 8), which does not line up with the 44px collapsed nav item beside it | Reproduced at 38.5px; flagged as a suspected authoring artefact.                                                                                                                               |
| Collapsed Nav Title frame is **44px** but its contents measure 46 (8 + 30 + 8)                                                    | Width held at Figma's 44, padding tightened to 7px so the tile fits.                                                                                                                           |
| Status dot exists **only on the collapsed** nav item, though the description mentions a status indicator                          | Available in both, in **three colours** — Neutral/Main default, `.nav-item-status-warning`, `.nav-item-status-primary` — since the composed rail uses all three.                               |
| Collapsed Nav Group hugs to that **38.5px** half-pixel standalone                                                                 | **Resolved by the rail spec**: inside the rail all three headers are set to fill, rendering 44px like everything else. 38.5 was only ever the hug width of a component nobody uses standalone. |

**Audit findings (2026-08-27).** Reviewed with axe-core 4.13 over all 11 nav
stories, Playwright `ariaSnapshot` for accessible names, real Tab-key traversal
for focus, and the 89-check visual spec.

| Finding                                                                                                               | Status                                                                                               |
| --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Group disclosure rotated the chevron but **did not hide the rows** — a disclosure control that disclosed nothing      | **Fixed.** Rows now hide, in both markup shapes.                                                     |
| Collapsed rail: **16 of 21 focusable nodes had no accessible name** (`display:none` on the only text of each link)    | **Fixed.** Labels/counts/details are `sr-only`, not hidden. Re-measured: 0 unnamed.                  |
| Collapsed rail: `.nav-badge` stayed visible, rendering 30.4px in a 44px row — **7px overflow** (scrollWidth 51 vs 44) | **Fixed.** Dropped when collapsed, as Figma does.                                                    |
| `.nav-group-label` and `.nav-item-count` are **Content/Tertiary**, which fails WCAG AA on two of four surfaces        | **Open — designer.** See below.                                                                      |
| Chevron is hover-only, so touch users get no disclosure affordance                                                    | **Open — designer.** Mitigated: rows hiding now signals state, and `:focus-visible` covers keyboard. |

Everything else passed: focus rings are Primary/Main at 2px on all three
interactive parts (verified after the 150ms `transition-colors` settles — measured
mid-transition it reads as an in-flight blend), tab order follows document order,
Enter and Space both toggle, and all 26 classes ship in `dist`.

**Contrast, measured.** Content/Tertiary `#727280` against the four surfaces —
11px and 12px text both need 4.5:1:

| Surface           | Ratio |          |
| ----------------- | ----- | -------- |
| Paper `#ffffff`   | 4.74  | pass     |
| Card `#fafafb`    | 4.54  | pass     |
| Neutral `#f1f1f4` | 4.20  | **fail** |
| Frame `#f0f3f7`   | 4.26  | **fail** |

Short by 0.24 at worst. It is a **token-wide** issue, not a nav one — the same
token is used across the library, and `docs/accessibility-audit.md` already
flagged it. Not changed here: it is Figma's specified colour and a designer's
call. Darkening the token to `#6d6d7a` would clear all four surfaces (4.58 on
Frame). Note the rail is transparent, so whether this fails at all depends on
the surface a consumer puts it on.

Also note the `Beta` axis on Nav Item is declared but undrawn — every variant is
`Beta=no`, and the Beta visual comes from the badge slot instead. Not modelled.
And two text styles are named "- Bold" while resolving to Medium/500
(`Body 1 - Bold`, `Micro L - Bold`); 500 is what ships.

```html
<nav class="nav-rail">
  <a href="#" class="nav-title">
    <span class="nav-title-logo"><img src="/logo.svg" alt="" /></span>
    <span class="nav-title-details">
      <span class="nav-title-name">Central Williamette</span>
      <span class="nav-title-subtitle">Main st branch</span>
    </span>
    <span class="nav-title-action">
      <svg class="icon icon-size-14" aria-hidden="true">
        <use href="#chevron-down" />
      </svg>
    </span>
  </a>

  <!-- Current page — Figma calls this "Passive" -->
  <a href="#" class="nav-item" aria-current="page">
    <svg class="nav-item-icon icon icon-size-16" aria-hidden="true">
      <use href="#inbox" />
    </svg>
    <span class="nav-item-label">Inbox</span>
    <span class="nav-item-count">41</span>
  </a>

  <!-- Group header; chevron only appears on hover -->
  <button class="nav-group" aria-expanded="true">
    <span class="nav-group-label">Analyze</span>
    <svg class="nav-group-chevron icon icon-size-16" aria-hidden="true">
      <use href="#chevron-down" />
    </svg>
  </button>

  <!-- Ancestor section — Figma calls this "Active" -->
  <a href="#" class="nav-item nav-item-active">
    <svg class="nav-item-icon icon icon-size-16" aria-hidden="true">
      <use href="#users" />
    </svg>
    <span class="nav-item-label">Businesses</span>
    <span class="nav-badge">Beta</span>
  </a>
</nav>

<!-- Collapsed rail: same markup, plus the -collapsed classes -->
<nav class="nav-rail">
  <div class="nav-group nav-group-collapsed">
    <span class="nav-group-rule"></span>
  </div>
  <a href="#" class="nav-item nav-item-collapsed">
    <svg class="nav-item-icon icon icon-size-16" aria-hidden="true">
      <use href="#bell" />
    </svg>
    <span class="nav-item-label">Alerts</span>
    <span class="nav-item-status"></span>
  </a>
</nav>
```

### Design Tokens (real values, extracted from Figma)

Tokens are **generated** — do not edit [src/themes/valiify.css](src/themes/valiify.css)
by hand:

```
tokens/figma-tokens.json  ──scripts/build-theme.mjs──>  src/themes/valiify.css
```

Regenerate with `npm run build:theme` (also runs as part of `npm run build`).
To pick up Figma changes, re-extract into the JSON, then regenerate.

They live in a Tailwind `@theme` block, so **each one generates utilities** —
that is the intended way to consume them:

| Token                       | Generates                                           |
| --------------------------- | --------------------------------------------------- |
| `--color-primary`           | `bg-primary`, `text-primary`, `border-primary`      |
| `--color-content-secondary` | `text-content-secondary`                            |
| `--radius-control`          | `rounded-control`                                   |
| `--text-body-1`             | `text-body-1` (size + line-height + weight + track) |

Prefer those over hand-written `var(--color-…)`. Browse the whole set in
Storybook under **Foundations → Design Tokens**.

**Colors** — 40 tokens. `Main` is unsuffixed (`Primary/Main` → `--color-primary`):

- Primary: `--color-primary` / `-dark` / `-pressed` / `-soft` / `-disabled`
- Secondary: `--color-secondary` / `-strong` / `-soft` / `-disabled`
- Content: `--color-content-primary` / `-secondary` / `-tertiary` / `-faint` / `-contrast`
- Surface: `--color-surface-frame` / `-neutral` / `-card` / `-paper`
- Stroke (colors): `--color-stroke-divider` / `-border` / `-disabled`
- Action: `--color-action-subtle` / `-hover` / `-selected` / `-focused`
- Status: `--color-approved` / `-soft` / `-strong` / `-content`,
  `--color-critical` / `-soft` / `-strong` / `-content`, `--color-warning` / `-soft`,
  `--color-neutral` / `-soft` / `-strong` / `-content`
- One-off: `--color-misc-purple`

**The surface stack is four deep**, back to front:

| Token                     | Hex       | Use                                     |
| ------------------------- | --------- | --------------------------------------- |
| `--color-surface-frame`   | `#f0f3f7` | app background                          |
| `--color-surface-neutral` | `#f1f1f4` | recessed regions                        |
| `--color-surface-card`    | `#fafafb` | form fields on the `BG=Neutral` variant |
| `--color-surface-paper`   | `#ffffff` | cards, panels, default field background |

> **`surface-card` was missing until 2026-08-22, and this doc used to claim it
> did not exist.** It was absent from every extraction because
> `get_variable_defs` only returns variables _applied to a layer_, and nothing
> used it yet. The Text Input Container's new `BG=Neutral` variant applies it,
> and `search_design_system` confirms it as a real variable in Collection 1.
> The three field components previously mapped `BG=Neutral` onto
> `surface-neutral` (`#f1f1f4`), which rendered visibly darker than the design.
>
> **Lesson: use `search_design_system` — not `get_variable_defs` — to audit
> whether a token group is complete.**
>
> **It has now bitten twice.** `Critical/Content` (`#b73943`) was missing for
> exactly the same reason until Link (880:31368) applied it to its critical
> pressed state on **2026-08-24** — `Approved/Content` and `Neutral/Content`
> were both present, so it was a lone gap in an otherwise complete ramp.
> Confirmed as a real Collection 1 variable with `search_design_system` before
> being added. The colour group still has not been swept end-to-end.
>
> **There are no `info-*` colors.** Those were invented placeholders and are gone.

**Radii** — named by role, because Tailwind v4 ships `--radius-xs`/`-sm`/`-md`
and redefining those silently changes `rounded-xs`/`-sm`/`-md` for consumers:

| Token              | px   | Figma          | Use              |
| ------------------ | ---- | -------------- | ---------------- |
| `--radius-micro`   | 2    | Radius/Micro   | indicators, bars |
| `--radius-tight`   | 4    | Radius/XS      | tags, badges     |
| `--radius-control` | 6    | Radius/SM      | buttons, inputs  |
| `--radius-surface` | 8    | Radius/MD      | cards, panels    |
| `--radius-pill`    | 9999 | Radius/Rounded | avatars, pills   |

**Border widths** — no Tailwind namespace, so they need an explicit `var()`:

- `--border-thin` 0.5px, `--border-line` 1px, `--border-micro` 2px
- `@apply border border-[length:var(--border-thin)];`

> **Chrome renders the 0.5px hairline as a full 1px** — measured, at both 1x and
> 2x DPI. `getComputedStyle` reports `border-top-width: 1px` and the extra pixel
> is really in the layout box, so a 0.5px border adds **2px** to an element's
> height, not 1px.
>
> Consequence: **never size a bordered component with `min-height`** — it lands
> 1–2px past its Figma frame, because Figma draws its stroke _inside_ the frame.
> Use an explicit `height`, as `button.css`, `input.css`, and
> `dropdown-field.css` do. Verified in Storybook: all three field sizes then
> measure exactly 25 / 29 / 35.
>
> **Side-specific hairlines need the side-specific length utility.**
> `border-[length:…]` sets all four sides, so `border-t border-[length:var(--border-thin)]`
> silently produces a 0.5px box plus a 1px top. Write
> `border-t border-t-[length:var(--border-thin)]` instead.

**Typography** — 37 composite `--text-*` tokens carrying size, line-height,
weight, and tracking in one utility. Roles: `text-display`, `text-h1`/`h2`,
`text-subtitle`, `text-body-1`/`-2` (±`-bold`), `text-caption`,
`text-action-l`/`m`/`s` (±`-bold`), `text-micro-l`/`m`/`s` (±`-bold`),
`text-statecap`, `text-label-*`, `text-data-*`, `text-help-caption`.

> **`--text-*` carries neither `font-family` nor `text-transform`.** This is the
> most repeatable trap in the token system, and it fails silently:
>
> - JetBrains Mono styles need `font-mono` or they render in Inter:
>   `@apply text-data-m font-mono;`
> - Label styles are uppercase in Figma. Use the generated `type-label-*`
>   utilities, which bundle casing (and the mono family) into one class:
>   `@apply type-label-l;`

**Line height** — `normal` on 12 styles is Figma's **"Auto"**: the font's own
metrics, ~1.21x for Inter. The Figma API reports Auto as the sentinel `100`,
which does **not** mean 100%. Emitting `1` for it makes those styles visibly too
tight; an earlier version of this pipeline got that wrong.

Because Auto makes the line box font-dependent, **component heights must not be
derived from it.** `button.css` sets explicit heights (24 / 28 / 32px, measured
from the Figma variant frames) for exactly this reason.

**Letter spacing** — every Figma letter-spacing value is a **percentage** of font
size, never px, so tokens are emitted in `em`: `10%` → `0.1em`, `0.4%` →
`0.004em`.

**Spacing** — no tokens defined, on purpose. Tailwind v4's scale is a multiplier
of `--spacing` (0.25rem), so Figma's whole-pixel values all map to standard
steps. Use native utilities:

| Figma         | px  | Tailwind    | Figma          | px   | Tailwind     |
| ------------- | --- | ----------- | -------------- | ---- | ------------ |
| `Spacing/1`   | 1   | `p-0.25`    | `Spacing/11`   | 11   | `p-2.75`     |
| `Spacing/2`   | 2   | `p-0.5`     | `Spacing/12`   | 12   | `p-3`        |
| `Spacing/3`   | 3   | `p-0.75`    | `Spacing/12-5` | 12.5 | `p-[12.5px]` |
| `Spacing/4`   | 4   | `p-1`       | `Spacing/14`   | 14   | `p-3.5`      |
| `Spacing/5`   | 5   | `p-1.25`    | `Spacing/16`   | 16   | `p-4`        |
| `Spacing/6`   | 6   | `p-1.5`     | `Spacing/20`   | 20   | `p-5`        |
| `Spacing/7`   | 7   | `p-1.75`    | `Spacing/22`   | 22   | `p-5.5`      |
| `Spacing/7-5` | 7.5 | `p-[7.5px]` | `Spacing/24`   | 24   | `p-6`        |
| `Spacing/8`   | 8   | `p-2`       | `Spacing/28`   | 28   | `p-7`        |
| `Spacing/9`   | 9   | `p-2.25`    | `Spacing/32`   | 32   | `p-8`        |
| `Spacing/10`  | 10  | `p-2.5`     |                |      |              |

> Never define `--spacing-8: 8px`. It would make `p-8` mean 8px instead of 32px
> and break existing usage.
>
> **Half-pixel values need arbitrary syntax.** Tailwind's multiplier must be a
> multiple of 0.25 (= 1px steps), so it can express any whole pixel but no
> half-pixel. The multiplier forms `p-1.875` and `p-3.125` do **not** compile —
> verified against the compiler, not assumed. Use the arbitrary values
> `p-[7.5px]` and `p-[12.5px]` for Figma's two fractional spacing tokens.

**Elevation** — `--shadow-panel` → `shadow-panel` (Figma General Drop Shadow).

**Focus ring** — the shared tab-through affordance, from Figma Menu Item → Ring.
Apply the `focus-ring` utility on `:focus-visible`:

```css
.btn:focus-visible {
  @apply focus-ring;
}
```

- `--ring-focus-width` 2px, `--ring-focus-color` `Primary/Main`
- Defined with `@utility` in [src/utilities/index.css](src/utilities/index.css).
  Only `@utility` registers a real Tailwind utility; a plain class in
  `@layer utilities` cannot be `@apply`-ed.
- Uses a negative `outline-offset` so the ring's outer edge aligns with the
  component's own outer edge, matching Figma's full-size overlay frame.
- Needs no radius — `outline` follows the element's `border-radius`.

### Token readings — resolved

Verified against the Figma **Text Preview** section (`929:28132`), which labels
every style with its spec. Recorded in `tokens/figma-tokens.json` under
`$meta.resolved`:

- `lineHeight: 100` is Figma **"Auto"**, not 100% → `line-height: normal`
- `letterSpacing` values are **percentages**, not px → emitted as `em`
- The six Label styles are **uppercase** → `type-label-*` utilities

### Still open

- **`get_variable_defs` only returns variables applied to a layer.** Typography
  is exhaustive (it comes from the Text Preview section), but a colour or number
  token defined in Figma and not yet used could still be missing. **This has now
  bitten once** — `Surface/Card` was absent for exactly this reason until
  2026-08-22. Audit with `search_design_system`, which lists variables whether
  or not anything uses them. The colour group has not yet been swept that way
  end-to-end, so other unused tokens may still be missing.
- **Duplicate Figma style names silently drop tokens.** The API returns a keyed
  object, so two styles sharing a name collapse into one — and the survivor's
  values get attributed to the wrong style. This already happened once with
  `Label S Sans`. If a token looks wrong, check for a name collision first.
- ~~`Body & Supporting/Help & Caption` is applied to component layers but
  absent from the Text Preview section~~ — **resolved 2026-08-23**: Modal
  (908:1580) applies it to `.modal-description`, so it is current.
- `--radius-micro` and `--radius-tight` role names are provisional.
- Component **horizontal** padding is still inferred; heights are now exact.

## Installation

```bash
npm install @valiify/dashboard-ui tailwindcss
```

## Configuration

CSS-only — there is no Tailwind plugin to register, and no `tailwind.config.js`.
**Two supported entry points**, and the difference is load-bearing:

| Entry                              | You get                                                             | You do NOT get          |
| ---------------------------------- | ------------------------------------------------------------------- | ----------------------- |
| `@valiify/dashboard-ui` (prebuilt) | component classes + tokens as CSS custom properties                 | token-derived utilities |
| `@valiify/dashboard-ui/source`     | the above **plus** `bg-approved`, `rounded-pill`, `type-label-l`, … | —                       |

```css
/* prebuilt */
@import "tailwindcss";
@import "@valiify/dashboard-ui";

/* source — consumer's Tailwind processes our @theme */
@import "tailwindcss";
@import "@valiify/dashboard-ui/source";
```

`./source` maps to [src/library.css](src/library.css), which deliberately omits
`@import "tailwindcss"` so the consumer's config stays in charge. Verified against
a real packed install that our internal `source(none)` does not disable a
consumer's content detection.

**Fonts are not bundled.** CSS requires every `@import` to precede all other
rules, so a font import inside `dist/index.css` is discarded as soon as a
consumer imports that bundle (measured: it landed after 44 rules). Opt in with
`@import "@valiify/dashboard-ui/fonts";` as the **first** line, or self-host.

There is no `data-theme` attribute to set. V1 is a single light theme applied at
the root.

> **Token names are public API.** Renaming or removing a token is a breaking
> change — consumers write `bg-approved` and `var(--radius-control)` in their own
> code. Changing a token's _value_ is fine; changing its _name_ is not. See
> [CHANGELOG.md](CHANGELOG.md).

## Development Status

**Current Phase**: Phase 3 — the component set is built out  
**Next Phase**: Accessibility remediation, then publish

Completed:

- ✅ Project infrastructure (build pipeline, TypeScript, PostCSS)
- ✅ Real design tokens extracted from Figma (40 colors, 5 radii, 3 border
  widths, 37 text styles, 6 label utilities and 4 shadows) via a generated
  pipeline
- ✅ **39 components**, each extracted from a Figma node and documented above.
  38 carry a visual spec; Card is the one exclusion, and is placeholder
  scaffolding rather than a real component
- ✅ Token showcase in Storybook (Foundations → Design Tokens)
- ✅ Component generator (`npm run new:component`)
- ✅ Storybook 10 with interactive documentation
- ✅ TypeScript definitions
- ✅ Four verification gates — `audit`, `verify:component`, `verify:layers`,
  `verify:visual` — all wired into CI
  ([.github/workflows/ci.yml](.github/workflows/ci.yml))

Pending:

- ⏳ **Contrast tokens fail WCAG AA** on high-traffic labels and placeholders.
  Designer-blocked; no CSS resolves a token pair below AA. This blocks
  accessibility sign-off — see [docs/handoff-report.md](docs/handoff-report.md) §4a
- ⏳ Accessibility remediation: five code-fixable bugs and three ARIA defects in
  documented markup (§3b, §3c of the same report)
- ⏳ Confirm the unconfirmed token readings with the designer (see **Still open**)
- ⏳ Component **horizontal** padding is still inferred; heights are exact
- ⏳ Re-audit Checkbox, DataRow and SensitiveData — all three were built after
  the audit passes ran, so neither axe nor the Figma sweep has covered them
- ⏳ Code Connect mappings
- ⏳ NPM publishing
- ⏳ Storybook deployment

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

**Revising a component that already ships?** Do not re-run the whole sequence —
`get_metadata` plus a targeted agent answers most revisions for about a tenth
of the cost. See _Revising an existing component_ in the process doc.

Three rules that are load-bearing:

1. **Scaffold first** — `npm run new:component` writes the CSS from the
   template, registers the `@import` alphabetically, creates the story, and
   adds the class type. Creating those by hand gets one of them wrong.
2. **Every component needs a visual spec.** A component with no entry in
   [scripts/visual-specs.mjs](scripts/visual-specs.mjs) is unverified however
   good its CSS looks. The harness has caught four defects in components that
   already looked finished.
3. **Size bordered components with `height`, not `min-height`** — Chrome rounds
   the 0.5px hairline up to a full 1px, so a hairline adds 2px of height and
   the component lands past its Figma frame.

The reference implementations are [button.css](src/components/button.css)
(variants, sizes, states) and [input.css](src/components/input.css) (nested
state selectors).

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
size — which has now happened four times:

| Caught                                                                                    | Component            |
| ----------------------------------------------------------------------------------------- | -------------------- |
| Rendered 1–2px oversized (`min-height` + a hairline Chrome rounds to 1px)                 | Input, DropdownField |
| `sm` and `md` shipped the wrong text style — the three sizes are three styles, not one    | Button               |
| `.with-ring` was outset in the variant's own colour; Figma has it inset in `Primary/Main` | Chip                 |
| Disabled faded the whole button with `opacity-50` instead of using `Secondary/Disabled`   | IconButton           |

- Expected values live in [scripts/visual-specs.mjs](scripts/visual-specs.mjs);
  the runner is [scripts/visual-verify.mjs](scripts/visual-verify.mjs).
- Compare colours with `{ token: '--color-x' }`, never a literal — the theme
  emits `oklch()`, so a hardcoded `rgb()` fails even when the colour is right.
- Default tolerance is exact. Widen it only where the delta is understood and
  written down next to the check; a loose tolerance hides regressions.
- **Add a spec entry whenever you build a component.** A component with no spec
  is unverified, however good its CSS looks. The one deliberate omission is
  Card, which is placeholder scaffolding rather than a real component.

### Accessibility verification

```bash
npm run verify:a11y                    # every story
npm run verify:a11y -- NavigationRail  # one component
```

axe-core over each story in headless Chromium, with the same five harness-level
rules disabled that `docs/accessibility-audit.md` used, so runs stay comparable.
Exits non-zero when anything fires.

This is the third lens and it sees what the other two cannot — names, roles,
ARIA wiring and contrast. It earned its place immediately: it found that every
nav item in the collapsed rail was an **unnamed link in the tab order**, which
the 89-check visual spec passed clean, because `display:none` on a label is
invisible to a geometry assertion and fatal to a screen reader.

> **Do not check accessible names with `textContent`.** It reads through
> `display:none`, so a hidden label still looks present — a probe built that way
> reported names for all 21 controls in the collapsed rail while axe reported 16
> with none. axe was right. Use this script or Playwright's `ariaSnapshot()`.

> **Let transitions settle before measuring computed colour.** `transition-colors`
> covers `outline-color`, so a focus ring read immediately after `Tab` returns an
> in-flight blend between the old and new colour. Measured mid-transition it
> looks like a broken ring; after ~400ms it is correct. This cost a false-alarm
> investigation.

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

## Storybook

Run locally:

```bash
npm run storybook
```

View all components with interactive controls and documentation at http://localhost:6006

## Build

```bash
npm run build      # Regenerate theme, then compile src/index.css -> dist/index.css
npm run build:theme # Regenerate src/themes/valiify.css from tokens/figma-tokens.json
npm run dev        # Same, in watch mode
npm run typecheck  # tsc --noEmit over types/, stories/, .storybook/
npm run format     # Format code with Prettier
```

Output:

- `dist/index.css` - the entire published artifact (tokens + component styles)

`dist/index.css` deliberately contains **no Tailwind utility classes** — a
component library shouldn't ship an app's utilities. Consumers generate their own.
Storybook gets utilities via `@source` globs in
[.storybook/preview.css](.storybook/preview.css).

Type definitions are hand-maintained in [types/](types/) and shipped as-is; they
are not generated.

`src/themes/valiify.css` IS generated — from `tokens/figma-tokens.json` via
`scripts/build-theme.mjs`. Edit the JSON, not the CSS.

## Architecture

- **CSS-only** - Zero JavaScript dependencies, no Tailwind plugin, no `tailwind.config.js`
- **Tailwind v4 `@theme`** - Tokens generate utilities automatically
- **Single light theme** - V1 only; no dark mode or per-tenant theming
- **Framework-agnostic** - Works with React, Vue, Svelte, vanilla HTML, etc.

> **Tailwind v4, not v3.** Several v3 idioms silently produce invalid CSS here.
> Notably `rounded-[--token]` and `border-[length:--token]` — the implicit-var
> shorthand was dropped, so those compile to `border-radius: --token`, which
> browsers discard without warning. Always write `var()` explicitly, and check
> `dist/index.css` when a style mysteriously doesn't apply.

- **Modular** - Import only what you need

## Design System

Based on Valiify design system from Figma (Commercial-Designs file, key: FdcEV83HPv44bzLPAQU1hR).

**Typography:**

- Inter (UI text)
- JetBrains Mono (data/code)

**Color System:**

- OKLch color notation for perceptually uniform colors
- Status ramps: Approved, Critical, Warning, Info
- Surface stack: Frame → Neutral → Card → Paper (back to front)

**Component Categories (planned):**

- Foundation: Button, Input, Checkbox, Radio, Switch, Badge
- Data Display: Card, Cell, Data Row, Avatar, Tag
- Navigation: Tabs, Dropdown, Modal, Icon Button
- Review-Specific: Field Verification, Section Marker, Secure, Rule, Event

## Links

- **Repository**: TBD
- **NPM Package**: [@valiify/dashboard-ui](https://www.npmjs.com/package/@valiify/dashboard-ui)
- **Figma**: Commercial-Designs (fileKey: FdcEV83HPv44bzLPAQU1hR)
- **Storybook**: TBD (will be deployed)

## License

MIT © Valiify
