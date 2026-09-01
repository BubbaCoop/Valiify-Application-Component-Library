# Short App Development — Orientation

This library builds the component kit for the Valiify Short App (the online
account application). It was bootstrapped from the dashboard library's
infrastructure on 2026-09-01; this doc is the map of what exists, what is
pending, and where the process documentation lives.

## Where things stand

| Area                        | Status                                                          |
| --------------------------- | --------------------------------------------------------------- |
| Build pipeline              | ✅ Working (`npm run build` — tokens → theme → dist)             |
| Component generator         | ✅ Working (`npm run new:component <Name>`)                      |
| Visual verification harness | ✅ Working, zero specs (passes clean until components land)      |
| A11y / static / layer gates | ✅ Working                                                       |
| Storybook 10                | ✅ Builds and runs; Components section empty                     |
| CI (GitHub Actions)         | ✅ `.github/workflows/ci.yml` — full gate sequence               |
| Icon sprite (Lucide)        | ✅ Retained from dashboard — shared icon system                  |
| Design tokens               | ⏳ **Pending extraction** — `tokens/figma-tokens.json` is empty  |
| Components                  | ⏳ **None yet**                                                  |
| Short App Figma file key    | ⏳ **TBD** — grep for `TBD` in docs/ to find every place it goes |
| Chromatic                   | ⏸ Deferred until the full library is complete                   |

## The two process docs (read before building anything)

1. **[figma-extraction.md](figma-extraction.md)** — the token extraction
   workflow. Run this FIRST, before any component: components consume token
   utilities, so the theme must exist before the first component is styled.
2. **[component-process.md](component-process.md)** — the per-component
   workflow: locating the Figma node, the metadata sweep, the subagent
   extraction brief, CSS traps, verification.

Both were proven on the dashboard library and updated for this one. The
dashboard's component docs, tokens, specs, stories, and audit reports live in
[`_dashboard-archive/`](../_dashboard-archive/) — pattern references only,
never a spec for Short App components.

## Bootstrapping order

1. **Confirm the Short App Figma file key** and replace every `TBD` in:
   `tokens/figma-tokens.json` ($meta), `docs/component-process.md`,
   `docs/figma-extraction.md`, `CLAUDE.md` (Design System / Links).
2. **Extract design tokens** per figma-extraction.md into
   `tokens/figma-tokens.json`, then `npm run build:theme`. Check the
   role-name maps in `scripts/build-theme.mjs` (`RADIUS_ROLES`,
   `STROKE_ROLES`, `SHADOW_NAMES`) — they are keyed by the dashboard's Figma
   token names and will need re-mapping to the Short App's.
3. **Rebuild the token showcase** — `stories/Foundations.mdx` is a placeholder;
   the archived `_dashboard-archive/Foundations.mdx` shows the format.
4. **Survey the Short App component set** in Figma (one `get_metadata` sweep of
   the components page) and write the component roadmap: priority order,
   dependencies (primitives like Icon/Button first), effort notes.
5. **Build components** per component-process.md — scaffold, extract, style,
   spec, verify, document in CLAUDE.md.

## Verification commands

```bash
npm run build            # tokens -> theme -> icons -> dist
npm run typecheck
npm run storybook        # keep running; the harnesses drive it
npm run verify:visual    # computed styles vs Figma values
npm run verify:a11y      # axe-core over every story
npm run verify:component <Name>
npm run verify:layers    # cascade-layer contract in dist
npm run audit            # spec coverage across the library
```

## Rules that carry over

- Every component gets an entry in `scripts/visual-specs.mjs` — no spec, not done.
- Size bordered components with `height`, never `min-height` (hairline trap).
- Compare colours in specs with `{ token: '--color-x' }`, never literals.
- Token names are public API once published — rename is a breaking change.
- Never `git commit` or `git push` — stage only.
