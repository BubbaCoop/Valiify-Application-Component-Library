---
description: Help developers use the Valiify Short App UI component kit
---

# Valiify Short App UI Component Kit Skill

Use this skill when developers ask which Short App component to use, about
component class names and variants, theme customization, or integration
patterns — and as the design-language reference the Val build stage reads.

> **The authoritative class list is `class-manifest.json`** — generated from
> `dist/shortapp-ui.css` by `npm run build`, and enforced by
> `npm run verify:vocabulary`, which fails on any class named here that the
> published bundle does not define. The table below stays hand-curated for its
> notes (which class is required, which name diverges from the component name);
> the manifest is what decides whether a name is real.
>
> Component classes are namespaced `va-` and utilities carry the Tailwind v4
> prefix `va:` — see CLAUDE.md "Library Contracts".

**31 components shipped** from the Short App Figma file (fileKey
`PA5pr1Q8KLfbjTxdAbFm0V`), published as `@valiify/shortapp-ui` (**1.4.1**,
173 component classes / 297 utilities; Storybook:
https://bubbacoop.github.io/Valiify-Application-Component-Library/). The
authoritative deep reference is the **Quick Reference section of CLAUDE.md**
(one section per component: class API, state tables, traps, copy-pasteable
HTML). This file is the compact map; go to CLAUDE.md for any detail.

## Component class map

| Component | Classes (base · modifiers/parts) |
| --- | --- |
| Button (Standard appearance) | `.va-btn` + REQUIRED type `.va-btn-primary/-secondary/-micro/-bubble`; heights `var(--height-lg)` 48 / 48 / 16 hug / `var(--height-sm)` 32; uppercase is styled (micro = Eyebrow); loading via `aria-busy` |
| UtilityButton (Utility appearance) | `.va-utility-button` + REQUIRED type `-empty/-filled/-rounded/-text/-link`; SM `var(--height-sm)` 32 default, `-md` `var(--height-lg)` 48; Field Label natural case; `-link` is the underlined inline button (Primary ramp) |
| IconButton | `.va-icon-button` (18px glyph=box) · `-sm` (14) · `-state` (padded + hover halo) · `-subtle`; ALWAYS aria-label; tap-target overlay built in |
| Radio | `.va-radio` on native input; 20px; inset-shadow ring; disabled drawn (Divider ring / Primary-Disabled checked) |
| Checkbox | `.va-checkbox-control` wrapper + `.va-checkbox-input` + `.va-checkbox-check` (sprite #check); 20px box, glyph fills it |
| Switch | `.va-switch` on native checkbox `role="switch"`; 36×20; knob = ::before; disabled drawn (Divider / Primary-Disabled tracks) |
| Tabs | `.va-tabs` row + `.va-tab` + REQUIRED `.va-tab-portal/-application`; `var(--height-sm)` 32; aria-selected drives active; NO underline exists |
| TextSelector | `.va-text-selector` + `-icon/-label/-chevron`; aria-expanded = open |
| TextField | `.va-text-field` › `-title-row`/`-title` › `-box` (`var(--height-lg)`, :has-driven) › `-input` + `-icon` › `-hint`; error = aria-invalid; disabled drawn (App Page + Divider + Tertiary) |
| DropdownField | `.va-dropdown-field` › `-title-row`/`-title` › `-trigger` (button, aria-expanded, `var(--height-lg)`) › `-value`(+`-value-placeholder`)/`-chevron` › `-hint`; disabled drawn |
| TextArea | `.va-text-area` › `-title-row`/`-title` › `-input` (native textarea, 79px, resize:none) › `-hint`; error + disabled drawn, mirroring TextField |
| RadioField | `.va-radio-field` (fieldset) › `-title` (legend) › `-options` › `-option` composing `.va-radio` › `-hint`; no disabled BY DECISION |
| Address | `.va-address` › `-title-row`/`-title` › `-group` (ONE box carries every state) › `-row` (×3, `var(--height-lg)`) › `-input` (+`-input-city` 227 / `-input-state` 133) + `-optional` › `-hint`; focus marks the focused row (Primary/Track inset) |
| Upload | `.va-upload` (label wrapping hidden `-input` file; dashed border, radius 8, `var(--height-lg)`) › `-left/-icon/-prompt/-browse/-meta/-filename`; states `-active` (drag-over) / `-complete` |
| OtpCell | `.va-otp-cell` on a native per-digit input; `var(--height-xl)` 56 square; error = aria-invalid (amber); disabled drawn; caret is crimson (caret-color) |
| OtpField | `.va-otp-field` (fieldset) › `-title` (legend) › `-cells` (6 cells, 8px gap, hugs 376) › `-hint`; error = aria-invalid on EVERY cell |
| SelectCard | `.va-select-card` (label+va-radio = selection, button+chevron = navigation) + `-text/-title/-description/-chevron`; 0.5px inset-shadow ring in every state |
| BoxAction | `.va-box-action` (label) + REQUIRED `-checkbox`/`-switch` (both `var(--height-lg)` 48) + `-label`; composes shipped control |
| ListItem | `.va-list-option` (NOT .list-item — Tailwind collision) + REQUIRED size `-sm/-md/-lg` (32/40/48 pinned) + `-text/-check` + `-critical` (Error/Base ink, destructive rows) + `data-active` (keyboard highlight) |
| DropdownList | `.va-dropdown-list` panel holding `.va-list-option` rows (md rows for a field panel); overflow clip + shadow-basic |
| Action | `.va-action` (+`-pending`/`-done`) › `-icon/-content/-title/-description/-status/-cta` |
| Modal | `.va-modal` (dialog-first) › `-header/-title` + composed `.va-icon-button` close › `-description` › `-notice` +`-destructive/-success` › `-actions`; `.va-modal-backdrop` / `dialog::backdrop`; z-60/50 |
| Toast | `.va-toast` + type `-success/-error/-info` (icon ink only) › `-icon/-content/-title/-body`; `.va-toast-simple` dark pill; z-70 |
| Tooltip | `.va-tooltip` (BG/Contrast dark) + `-title/-body`; max-w 280 hug |
| Skeleton | `.va-skeleton` + REQUIRED shape (16) + size `-sm/-md/-lg`; container carries role=status; fill = `--color-surface-skeleton` behind `--skeleton-fill` |
| StatusTracker | `.va-status-tracker` (+`-active`); 14px glyph slot; ink swap only |
| Avatar | `.va-avatar` (24) · `-sm` (20) · `-feint`; initials only, circular |
| Badge | `.va-badge` — 16px pill, no variants |
| Owner | `.va-owner` — 34px rounded square, glyph slot (#user/#plus/#building); never interactive |
| OwnerContainer | `.va-owner-container` › `-info/-title/-name/-percent/-contact/-contact-text/-actions`; composes Owner/Badge/va-btn-micro/va-icon-button |
| Header | `.va-header` (sticky top-0 z-40) + `-logo` + `.va-header-desktop/.va-header-mobile` wrappers (768px swap) |

## Tokens (all emitted from `src/themes/valiify.css`, consumed as utilities)

- **59 colors**: `primary*` (crimson ramp + tints), `neutral*`, `content-*`
  (Figma Text/*), `surface-*` (Figma BG/* — paper/app-page/page/card/
  contrast/**skeleton**), `stroke-*`, `action-*`, four status ramps
  `success*/warning*/error*/info*` (the Error ramp IS consumed: ListItem
  Critical)
- **Heights**: `--height-sm/md/lg/xl` = 32/40/48/56 (**no xs**). Controls pin
  `height: var(--height-*)` with ZERO vertical padding — never derive a
  control's height from padding + line-height. Hug-content controls (icon
  button, text selector, micro/text/link buttons, radio, checkbox, switch)
  take NO height token; their tap area extends via a built-in overlay
  (`--target-min` 24 / `--target-touch` 44 under pointer: coarse)
- **24 consumed text styles** as `text-*` utilities; uppercase label styles
  have paired `type-*` utilities that bundle the casing (eyebrow,
  button-label, micro-label, tag-pill, data-key, lockup-* — casing is fully
  resolved)
- **Radii**: Tailwind t-shirt names verbatim; `rounded-xl` = 10, `-2xl` = 12
  (library overrides). **Spacing**: native Tailwind scale only
- **Effects**: `focus-ring` (3px Primary/Ring, offset 0 — FIELDS) ·
  `focus-ring-control` (2px solid Primary, offset 2 — CONTROLS) ·
  `shadow-basic` (0 8px 24px −4px — Modal/DropdownList/Toast/Tooltip)
- **Z-scale**: content 0 · sticky va-header 40 · backdrop 50 · va-modal 60 · va-toast 70

## Design-language rules the build must not violate

- **Control heights are the Height tokens** — a Figma control at 32/40/48/56
  maps to `height: var(--height-sm|md|lg|xl)`, never a raw `h-*` step; the
  old 34/44/54/12 values are retired.
- **Two focus rings by design**: fields keep `focus-ring` (3px translucent);
  controls take `focus-ring-control` (2px solid Primary, offset 2); list
  rows take NEITHER (focus stays on the listbox trigger; `data-active`
  paints the highlight).
- **Error doctrine**: field errors bind the WARNING ramp (amber) — a
  recorded decision (D4), not a slip. Red `Error/Base` is for DESTRUCTIVE
  actions only (ListItem `-critical`). Never swap the two.
- **Disabled recipe**: no fill, `Stroke/Divider` border, `Text/Tertiary` ink
  (+icon); filled-Primary controls keep `Primary/Disabled`. Fields add the
  `BG/App Page` ground. Radio/Switch/RadioField… every drawn disabled ships;
  undrawn combos are still excluded by name, never invented.
- **Loading**: `aria-busy="true"` on the button families — 16px 270° spinner
  in the label's ink, width-stable, clicks blocked.
- **Inter + JetBrains Mono**: components consume Inter only; the two
  Metric/Mono styles are real JetBrains Mono but nothing binds them yet —
  numerics in components get `tabular-nums`, not a font swap.
- **Hairlines and inside strokes on content-driven heights are inset
  box-shadows, never borders** (Chrome floors 0.5px to 1px and borders add
  height): OwnerContainer/Action row dividers, Modal/Toast card rings,
  Tabs-Application ring, Radio/Checkbox/BoxAction/SelectCard rings.
- **Uppercase is styled** (`type-*` utilities / text-transform), never typed.
- **Composition over modes**: selection/state derives from real inputs via
  `:has()` (SelectCard, BoxAction, Address, OtpField) or ARIA attributes
  (va-tabs, dropdowns, invalid fields) — never a synced class.
- **Icons**: sprite symbols via `<use href="#name">`; components paint their
  own glyph slots (`currentColor`; the Button family paints 1px, others 2);
  icon-only buttons always get `aria-label`.

## Integration essentials

- CSS-only; no Tailwind plugin, no `tailwind.config.js`.
- `@import "@valiify/shortapp-ui"` (prebuilt) or `…/source` (adds
  token-generated utilities). Fonts opt-in: `@import "…/fonts";` FIRST line.
- The library ships no JS: dropdown open/close, va-modal show, va-toast
  timers, va-tooltip anchoring, OTP auto-advance, Upload drag events are the
  consumer's (native `<dialog>` and the Popover API cover most of it).
- Val builds consume `dist/index.css` directly and inline
  `src/icons/sprite.svg` (vite-starter pattern in `examples/`).

> **/design methodology gap (deliberate):** `design-methodology/short-app.md`
> has NO entries yet for Address, Upload, OtpField/OtpCell, the Link button
> or ListItem Critical — methodology entries are evidence-based and wait for
> the first real Figma screen that uses them. Until then, `/design` pages
> cannot compose these components; `/val` can (the registry knows them).
