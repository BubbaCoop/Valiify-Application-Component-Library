# Changelog

All notable changes to `@valiify/shortapp-ui` are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Token names are public API — renaming or removing one is a breaking change.

## [Unreleased]

_Nothing yet._

## [0.1.1] — 2026-09-02

### Fixed

- README currency: the published 0.1.0 README still described the
  bootstrap-era empty library ("component set is currently empty") — now
  reflects the 27 shipped components, the complete token set, and the
  verification gates. Docs-only patch; no CSS changes.

## [0.1.0] — 2026-09-02

### Added

- **2026-09-02** — `UtilityButton` (Button / Utility 24:4382): the
  non-inline button family — Empty / Filled / Rounded / Text types, SM/MD,
  Field Label natural-case convention. Button (1:218) is now "Button /
  Standard" (inline uses); its rework formalized Pressed into an axis with
  values identical to the shipped :active treatments (no CSS change).

- **2026-09-02** — `Toast` (582:9325), `StatusTracker` (Application Status
  64:4623) and `Action` (71:848), all inline fast-path. Toast marks the
  status ramps' first bindings (Success/Base, Info/Base — while Type
  "error" binds Warning/Base verbatim, the file-wide slip's sharpest
  instance); Action's Done chip adds Success/Text. New a11y waiver for the
  Action pending chip (Text/Hint-on-Paper contrast family).

- **2026-09-02** — `Tooltip` (582:9178, inline fast-path): dark contrast
  tooltip with optional muted title. First use of the NEW `BG/Contrast`
  variable (token 58, `--color-surface-contrast`) and of the
  `text-field-label` style (whose real consumer is tooltip titles, not
  field labels — designer list). Third consumer of `--shadow-basic`.

- **2026-09-02** — `Modal` (557:5127): the library's first overlay — card +
  Type-bound notice banners (Destructive/Success; Neutral = no banner),
  composed close (IconButton) and actions (Buttons), `<dialog>`-first overlay
  plumbing with a styled `::backdrop` plus a `.modal-backdrop` div fallback
  (unsourced scrim, designer list), on the Library Contracts z-scale. New
  **`--shadow-basic`** token from Figma's new "Basic Drop Shadow" effect
  style (0 8px 24px −4px).

### Changed

- **2026-09-02** — `DropdownList` shadow rebound from its raw
  `0 2px 5px 10%` to the tokenized `--shadow-basic` (designer direction —
  a value change), now a real `box-shadow`: the −4px spread is
  inexpressible as a `filter: drop-shadow()`, and the dashboard-era
  "overflow-clip eats box-shadow" claim was re-tested and is false.

### Added

- **2026-09-02** — Field family: `TextField` (Plain Text Field 1:291),
  `DropdownField` (1:358, listbox-trigger composing DropdownList), `TextArea`
  (199:12523). Settled the Error-ramp question: field errors bind
  `Warning/Base` verbatim (designer list). New `verify:bundle` gate
  (undefined `var()` refs + class/utility collision probe) after the
  `--color-surface-frame` base-layer bug; `verify:a11y` and `verify:bundle`
  added to CI. A11y scanner gained a documented KNOWN_ISSUES waiver
  (DropdownField placeholder contrast — a Figma design defect).
- **2026-09-02** — `Owner` (261:13225, glyph-slot tile) and `OwnerContainer`
  (274:258, owners-list row composing Owner/Badge/Button/IconButton).
  IconButton revised for the designer's Neutral-ramp rework (new
  `Neutral/Pressed` token, Pressed axis, darker `Neutral/Hover`).
- **2026-09-01/02** — Core set extracted from the Short App Figma file:
  `Radio`, `Checkbox`, `Switch`, `Button`, `IconButton`, `ListItem`
  (`.list-option*`), `DropdownList`, `TextSelector`, `SelectCard`, `Avatar`,
  `Badge`, `BoxAction`, `Tabs`, `Header`, `RadioField`, `Skeleton` — each
  with a visual spec, stories, and Quick Reference docs.
- **2026-09-01/02** — Design tokens: complete Plugin-API enumeration (57
  colors incl. the Neutral rework, 8 radii, 13 spacing values, 24 text
  styles, the Primary Ring focus effect), emitted as OKLCh via
  `build-theme.mjs`.
- **2026-09-01** — Project bootstrapped from the Valiify Dashboard UI library's
  infrastructure: build pipeline (tokens → theme → dist), component generator,
  visual / a11y / static verification harnesses, Storybook 10, TypeScript
  definitions structure, icon sprite system (Lucide), and example starters.
  Dashboard components, tokens, stories, specs, and documentation are preserved
  for reference in `_dashboard-archive/` and are not part of this package.

### Fixed

- **2026-09-02** — First full-CI static sweep: Tabs' active-hover rules
  gained the house `:not(:disabled)` guards; the two deliberately-raw values
  (DropdownList's unbound Figma shadow, Skeleton's nonexistent
  "Surface/Neutral" fill) are now covered by documented
  `static-ok(<rule>)` waiver pragmas in `verify-component.mjs` — printed,
  never silent, with a stale-waiver guard.
- **2026-09-02** — `src/base/index.css` referenced the dashboard-era
  `--color-surface-frame` (undefined in this theme): every consumer page's
  `html` background silently resolved to nothing. Now `surface-app-page`
  (#fafaf9), gated by `verify:bundle`.
- **2026-09-02** — Renamed `.text-field-label` → `.text-field-title`
  (family-wide `-title`): the class collided with the `text-field-label`
  type token's generated utility. Same class of bug as the earlier
  `.list-item` → `.list-option` rename (Tailwind display utility).
