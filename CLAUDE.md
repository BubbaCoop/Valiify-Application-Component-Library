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

**None yet.** Components will be documented here as they are extracted from the
Short App Figma file, one section per component, following the format used in
[_dashboard-archive/DASHBOARD-CLAUDE.md](_dashboard-archive/DASHBOARD-CLAUDE.md):
base class, variants, sizes, states, the traps discovered during extraction,
and copy-pasteable HTML examples.

### Design Tokens

**Not yet extracted.** The Short App Figma file's tokens have not been pulled
yet — [tokens/figma-tokens.json](tokens/figma-tokens.json) is a placeholder and
[src/themes/valiify.css](src/themes/valiify.css) is regenerated from it.

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
(**file key: TBD** — to be confirmed when token extraction begins).

## Links

- **Repository**: https://github.com/BubbaCoop/Valiify-Application-Component-Library
- **NPM Package**: TBD (will publish as `@valiify/shortapp-ui`)
- **Figma**: Short App component library (file key TBD)
- **Storybook**: TBD (will be deployed)
- **Dashboard library (predecessor)**: https://github.com/BubbaCoop/Valiify-dashboard-ui

## License

MIT © Valiify
