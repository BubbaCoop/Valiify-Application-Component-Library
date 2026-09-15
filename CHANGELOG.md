# Changelog

All notable changes to `@valiify/shortapp-ui` are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Token names are public API — renaming or removing one is a breaking change.

## [Unreleased]

### BREAKING — component classes are namespaced `va-`, shipped utilities carry `va:`

- **2026-09-14** — Every component class gains the `va-` namespace: `.btn` →
  `.va-btn`, `.text-field-input` → `.va-text-field-input`, all 146 of them. The
  prebuilt bundle's utility layer carries Tailwind v4's `va:` prefix
  (`va:flex`, `va:gap-4`; the prefix leads any variant, `va:md:w-full`).

  **Why.** Measured against `daisyui@4.12.24`, 13 of our 146 classes collided:
  `btn`, `btn-primary`, `btn-secondary`, `badge`, `avatar`, `radio`, `skeleton`,
  `tab`, `tabs`, `modal`, `modal-backdrop`, `toast`, `tooltip`. Our rules are in
  `@layer components`; daisyUI's are unlayered (Tailwind v3 hoists
  `addComponents` output out of its layers), and unlayered normal declarations
  beat layered ones before specificity or source order is consulted — so daisyUI
  won all 13 and no import ordering could change it. Unlayering ours would not
  have helped either: daisyUI supplies every property we leave unset, and its
  modal class is `pointer-events: none; opacity: 0` by default, so a dialog
  carrying that name rendered invisible. Renaming is the only fix that works,
  and the surface was growing — 15 of the 40 components still to be built
  already exist in daisyUI.

  **Migration.** Prefix every component class with `va-` and every utility with
  `va:`. `class-manifest.json` (new, exported as `./manifest`) lists both sets.
  Token names are **unchanged**: `--color-primary` is still `--color-primary`.
  Component `@apply` payloads and the `./source` entry are unchanged too — the
  prefix belongs to the prebuilt bundle's utility layer only.

### Added

- **2026-09-14** — `./styles.css` → `dist/shortapp-ui.css`: a self-contained
  bundle of component classes, tokens and the `va:` utility layer, built by two
  Tailwind passes and concatenated. **Preflight is excluded**, so it cannot
  fight the host's reset, and it needs no Tailwind in the consumer — which makes
  the host's Tailwind version irrelevant. Its utility layer is deliberately
  unlayered, so it cannot lose to an unlayered host rule.
- **2026-09-14** — `./manifest` → `class-manifest.json`, generated from the
  built bundle: 146 component classes, 140 utilities.
- **2026-09-14** — Two gates: `verify:vocabulary` fails when a doc names a class
  the bundle does not define, `verify:markup` fails when generated markup uses a
  class with no rule in the bundle. Both carry canaries so they cannot pass
  vacuously. Both run in CI.

### Removed

- **2026-09-14** — `peerDependencies` on `tailwindcss`. The prebuilt entries
  need no Tailwind at all. `./source` still requires v4; nothing enforces that
  now except the documentation.

### Changed

- **2026-09-03** — Val pipeline retargeted from the dashboard library to
  this one: registry regenerated for all 27 components and hand-enriched
  with Figma set/variant node ids, `figmaNames` aliases (a new merged
  registry field) and behavior notes; val-build/val-context updated for
  the Inter-only Short App type system and the shortapp skill;
  val-components taught the alias matching; the skill rewritten as the
  full design-language cheat sheet.

## [0.1.2] — 2026-09-02

### Added

- **2026-09-02** — Deployment hardening: `verify:package` packaging smoke
  test (packs the real tarball, installs it into a scratch Vite app, builds
  both entry points, and asserts the two-entry contract — token utilities
  present via `/source`, absent via prebuilt), wired into CI; tag-driven
  Release workflow (`npm version` + push tag → gated publish with npm
  provenance, requires the `NPM_TOKEN` secret); Chromatic in CI
  (`CHROMATIC_PROJECT_TOKEN` secret, reuses the CI Storybook build).

### Fixed

- **2026-09-02** — Example starters carried the dashboard-era
  `--color-surface-frame` dead token (the base-layer bug's surviving
  sibling) and a JetBrains Mono font import; the vite-starter's setup check
  is now a component sampler built from the shipped library classes, and
  all "component set not yet extracted" copy is gone.

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
