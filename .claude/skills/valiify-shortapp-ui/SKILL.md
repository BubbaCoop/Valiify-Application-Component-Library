---
description: Help developers use the Valiify Short App UI component kit
---

# Valiify Short App UI Component Kit Skill

Use this skill when developers ask which Short App component to use, about
component class names and variants, theme customization, or integration
patterns — and as the design-language reference the Val build stage reads.

**27 components shipped** from the Short App Figma file (fileKey
`PA5pr1Q8KLfbjTxdAbFm0V`), published as `@valiify/shortapp-ui`. The
authoritative deep reference is the **Quick Reference section of CLAUDE.md**
(one section per component: class API, state tables, traps, copy-pasteable
HTML). This file is the compact map; go to CLAUDE.md for any detail.

## Component class map

| Component | Classes (base · modifiers/parts) |
| --- | --- |
| Button (Standard, inline) | `.btn` + REQUIRED type `.btn-primary/-secondary/-micro/-bubble`; heights 48/48/12/34; uppercase is styled |
| UtilityButton (non-inline) | `.utility-button` + REQUIRED type `-empty/-filled/-rounded/-text`; SM 34 default, `-md` 54; Field Label natural case |
| IconButton | `.icon-button` (18px glyph=box) · `-sm` (14) · `-state` (padded + hover halo) · `-subtle`; ALWAYS aria-label |
| Radio | `.radio` on native input; 20px; inset-shadow ring |
| Checkbox | `.checkbox-control` wrapper + `.checkbox-input` + `.checkbox-check` (sprite #check) |
| Switch | `.switch` on native checkbox `role="switch"`; 36×20; knob = ::before |
| Tabs | `.tabs` row + `.tab` + REQUIRED `.tab-portal/-application`; aria-selected drives active; NO underline exists |
| TextSelector | `.text-selector` + `-icon/-label/-chevron`; aria-expanded = open |
| TextField | `.text-field` › `-title-row`/`-title` › `-box` (48px, :has-driven) › `-input` + `-icon` › `-hint`; error = aria-invalid |
| DropdownField | `.dropdown-field` › `-title-row`/`-title` › `-trigger` (button, aria-expanded) › `-value`(+`-value-placeholder`)/`-chevron` › `-hint` |
| TextArea | `.text-area` › `-title-row`/`-title` › `-input` (native textarea, 79px, resize:none) › `-hint`; NO error axis |
| RadioField | `.radio-field` (fieldset) › `-title` (legend) › `-options` › `-option` composing `.radio` › `-hint` |
| SelectCard | `.select-card` (label+radio = selection, button+chevron = navigation) + `-text/-title/-description/-chevron` |
| BoxAction | `.box-action` (label) + REQUIRED `-checkbox` (48px) / `-switch` (44px) + `-label`; composes shipped control |
| ListItem | `.list-option` (NOT .list-item — Tailwind collision) + REQUIRED size `-sm/-md/-lg` + `-text/-check` |
| DropdownList | `.dropdown-list` panel holding `.list-option` rows; overflow clip + shadow-basic |
| Action | `.action` (+`-pending`/`-done`) › `-icon/-content/-title/-description/-status/-cta` |
| Modal | `.modal` (dialog-first) › `-header/-title` + composed `.icon-button` close › `-description` › `-notice` +`-destructive/-success` › `-actions`; `.modal-backdrop` / `dialog::backdrop`; z-60/50 |
| Toast | `.toast` + type `-success/-error/-info` (icon ink only) › `-icon/-content/-title/-body`; `.toast-simple` dark pill; z-70 |
| Tooltip | `.tooltip` (BG/Contrast dark) + `-title/-body`; max-w 280 hug |
| Skeleton | `.skeleton` + REQUIRED shape (16) + size `-sm/-md/-lg`; container carries role=status |
| StatusTracker | `.status-tracker` (+`-active`); 14px glyph slot; ink swap only |
| Avatar | `.avatar` (24) · `-sm` (20) · `-feint`; initials only, circular |
| Badge | `.badge` — 16px pill, no variants |
| Owner | `.owner` — 34px rounded square, glyph slot (#user/#plus/#building); never interactive |
| OwnerContainer | `.owner-container` › `-info/-title/-name/-percent/-contact/-contact-text/-actions`; composes Owner/Badge/btn-micro/icon-button |
| Header | `.header` (sticky top-0 z-40) + `-logo` + `.header-desktop/.header-mobile` wrappers (768px swap) |

## Tokens (all emitted from `src/themes/valiify.css`, consumed as utilities)

- **58 colors**: `primary*` (crimson ramp + tints), `neutral*` (incl. the
  reworked `-hover/-pressed/-text`), `content-*` (Figma Text/*), `surface-*`
  (Figma BG/* — paper/app-page/page/card/**contrast**), `stroke-*`,
  `action-*`, four status ramps `success*/warning*/error*/info*`
- **24 text styles** as `text-*` utilities (display, title, title-medium,
  lead, body, input, body-content, help-caption, label, label-strong,
  field-label, button-label, micro-label, eyebrow…); uppercase label styles
  have paired `type-*` utilities that bundle the casing
- **Radii**: Tailwind t-shirt names verbatim; `rounded-xl` = 10, `-2xl` = 12
  (library overrides). **Spacing**: native Tailwind scale only
- **Effects**: `focus-ring` utility (3px Primary/Ring outline, offset 0) and
  `shadow-basic` (0 8px 24px −4px — Modal/DropdownList/Toast/Tooltip)
- **Z-scale**: content 0 · sticky header 40 · backdrop 50 · modal 60 · toast 70

## Design-language rules the build must not violate

- **Inter only** — no mono typeface exists in this system; numerics get
  `tabular-nums`, not a font swap.
- **Hairlines and inside strokes on content-driven heights are inset
  box-shadows, never borders** (Chrome floors 0.5px to 1px and borders add
  height): OwnerContainer/Action row dividers, Modal/Toast card rings,
  Tabs-Application ring, Radio/Checkbox/BoxAction rings.
- **Undrawn state combos are excluded by name**, never invented (no
  disabled fields, no hover+focus, no checked+hover radio…).
- **Error states bind the WARNING ramp (amber) verbatim** — a documented
  file-wide Figma slip; do not "fix" to the error ramp in builds.
- **Uppercase is styled** (`type-*` utilities / text-transform), never typed.
- **Composition over modes**: selection/state derives from real inputs via
  `:has()` (SelectCard, BoxAction) or ARIA attributes (tabs, dropdowns,
  invalid fields) — never a synced class.
- **Icons**: sprite symbols via `<use href="#name">`; components paint their
  own glyph slots (`currentColor`, stroke-width 2); icon-only buttons always
  get `aria-label`.

## Integration essentials

- CSS-only; no Tailwind plugin, no `tailwind.config.js`.
- `@import "@valiify/shortapp-ui"` (prebuilt) or `…/source` (adds
  token-generated utilities). Fonts opt-in: `@import "…/fonts";` FIRST line.
- The library ships no JS: dropdown open/close, modal show, toast timers,
  tooltip anchoring are the consumer's (native `<dialog>` and the Popover
  API cover most of it).
- Val builds consume `dist/index.css` directly and inline
  `src/icons/sprite.svg` (vite-starter pattern in `examples/`).
