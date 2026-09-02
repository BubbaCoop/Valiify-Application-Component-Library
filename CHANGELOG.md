# Changelog

All notable changes to `@valiify/shortapp-ui` are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Token names are public API — renaming or removing one is a breaking change.

## [Unreleased]

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

- **2026-09-02** — `src/base/index.css` referenced the dashboard-era
  `--color-surface-frame` (undefined in this theme): every consumer page's
  `html` background silently resolved to nothing. Now `surface-app-page`
  (#fafaf9), gated by `verify:bundle`.
- **2026-09-02** — Renamed `.text-field-label` → `.text-field-title`
  (family-wide `-title`): the class collided with the `text-field-label`
  type token's generated utility. Same class of bug as the earlier
  `.list-item` → `.list-option` rename (Tailwind display utility).
