# Changelog

All notable changes to `@valiify/dashboard-ui`.

This project follows [Semantic Versioning](https://semver.org/). While the
version is `0.x-alpha`, breaking changes may land in minor releases — but they
will always be called out here under **Breaking**.

## Public API

These are the things consumers depend on, and therefore the things we cannot
change quietly:

1. **Component class names** — `.btn`, `.btn-primary`, `.card`, `.input`, and
   their modifiers.
2. **Design token names** — every `--color-*`, `--radius-*`, `--border-*`,
   `--text-*`, `--shadow-*`, and `--ring-*` custom property, **and the Tailwind
   utilities generated from them** (`bg-approved`, `rounded-control`,
   `text-body-1`, …).
3. **Entry points** — `.`, `./source`, `./fonts`, `./types`.
4. **Custom utilities** — `focus-ring`, `type-label-*`.

**Token names are part of the public API. Renaming or removing one is a breaking
change**, even though the value lives in a generated file. Downstream apps write
`bg-approved` and `var(--radius-control)` in their own code; a rename breaks them
exactly as surely as renaming `.btn` would.

Changing a token's _value_ is not breaking — that is a design update, and the
whole point of tokens. Changing its _name_ is.

When a rename is genuinely needed, ship the new name alongside the old one, note
the deprecation here, and remove the old name in a later release.

## Unreleased

### Breaking

- **Removed `.breadcrumb-mono`.** Figma restructured Breadcrumbs on 2026-08-25
  (Item `1046:22649`, Separator `1046:22654`, container `880:31218`), and the
  current crumb — the case the class existed for, `#BA-204417` — is now an
  ordinary current item in Inter Medium 500 rather than JetBrains Mono 700. The
  class no longer has any basis in the design. Replace
  `class="breadcrumb breadcrumb-current breadcrumb-mono"` with
  `class="breadcrumb breadcrumb-current"`; add `font-mono` yourself if you still
  want a mono treatment at a call site.

### Added

- Real design tokens extracted from Figma (`Valiify-Dashboard-Component-Library`)
  — 38 colors, 5 radii, 3 border widths, 37 text styles, 1 shadow, focus ring.
  Generated from `tokens/figma-tokens.json` by `scripts/build-theme.mjs`, which
  asserts every OKLCh color round-trips to its source hex within 1/255.
- `@valiify/dashboard-ui/source` documented as a supported entry point, for
  consumers who want token-derived utilities and not just component classes.
- `@valiify/dashboard-ui/fonts` as an opt-in webfont import.
- `focus-ring` utility, from Figma Menu Item → Ring.
- `type-label-*` utilities, which bundle uppercase (and the mono family) with the
  label text tokens, since `--text-*` can carry neither.
- Storybook **Foundations → Design Tokens** page rendering the whole token set
  for side-by-side comparison against Figma.
- `npm run new:component <Name>` scaffold generator.
- `npm run typecheck`.

### Changed

- **Tailwind v4 throughout.** Removed `tailwind.config.js` and the no-op plugin
  entry; the package is now genuinely CSS-only with no plugin to register.
- Consumers now import CSS rather than registering a plugin — see the README.
- Component heights are set explicitly (24 / 28 / 32px) from the Figma variant
  frames rather than derived from padding.

### Fixed

- **Border radii and custom border widths were silently dropped.**
  `rounded-[--token]` is Tailwind v3 syntax that compiles to invalid CSS under
  v4, so every component rendered square with a 1px border instead of 0.5px.
- **Fonts never loaded.** The font `@import` sat inside a `@layer` block, where
  CSS discards it. Now opt-in via `./fonts`, at a position where it is valid.
- **`dist/index.d.ts` was raw JavaScript**, not a declaration file.
- **Most tokens were missing from the published CSS.** A plain `@theme` emits
  only referenced variables, so the artifact shipped 43 of 135 tokens. Now
  `@theme static`.
- **Documentation prose leaked into the published CSS** — Tailwind scanned
  markdown and emitted a utility for every class-shaped string it found. Fixed
  with `source(none)`.
- **Typography was misread in two ways.** Figma's `lineHeight: 100` is "Auto"
  (the font's own metrics, `normal` in CSS), not 100%; and every Figma
  letter-spacing value is a percentage, not px.
- **CHANGELOG lacked the entry-point caveat for `focus-ring` / `type-label-*`.**
  These utilities are absent from the prebuilt `.` entry by design — `source(none)`
  plus on-demand `@utility` means they resolve only inside a Tailwind build via
  `./source`. The README documents this; the CHANGELOG did not, so a consumer
  reading only the changelog could reasonably expect `focus-ring` to work off the
  prebuilt entry. They are public API (see the "Custom utilities" list above) and
  are unchanged — this entry just records where they live.

### Known limitations

- Component **horizontal** padding is still inferred from Figma spacing steps
  rather than measured per size. Heights are exact.
- `--radius-micro` and `--radius-tight` role names are provisional.
- Colour and number tokens come from component sweeps, so a token defined in
  Figma but not yet applied to any layer may be missing. Typography is
  exhaustive.
