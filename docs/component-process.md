# Building a Component

**This is the process of record.** If another document describes a different
way to build a component, that document is stale — fix it or delete it rather
than following it.

Six components have been built this way: Textarea, MenuItem, DropdownMenu,
DropdownField, Avatar, and the Chip size property. Every one of them turned up
at least one defect that only this sequence would have caught.

---

## The seven steps

| # | Step | Output |
| - | ---- | ------ |
| 1 | Locate it in Figma, and sweep its metadata | node id + variant matrix |
| 2 | Extract the spec with a subagent | raw values table |
| 3 | Scaffold | 4 files created and wired |
| 4 | Implement | CSS + story |
| 5 | Add a visual spec | entry in `scripts/visual-specs.mjs` |
| 6 | Document | Quick Reference section in `CLAUDE.md` |
| 7 | Verify and commit | green suite, screenshot checked |

Steps 5 and 6 are not optional. A component with no spec entry is unverified
however good its CSS looks, and an undocumented component gets reinvented — see
Avatar, which existed twice before anyone noticed.

**Revising something that already ships? Skip to
[Revising an existing component](#revising-an-existing-component)** — running
the full seven steps again is how one two-line change cost 66k tokens.

---

## Step 1 · Locate it in Figma

File key: `PA5pr1Q8KLfbjTxdAbFm0V`.

Most components live in the **Basic components** section, `67:3409`. Running
`get_metadata` on that node returns every component frame with its node id and
every variant with its dimensions — that one call is usually enough to find
what you need and to read variant sizes straight off the frames.

```
get_metadata(fileKey, "67:3409")
```

Fields (Text Input, Text Field, Dropdown Field) live in a separate section,
`854:24664`.

**Then run `get_metadata` on the component itself before extracting anything.**
It costs ~200-1,400 tokens and returns the full variant list with dimensions.
Two reasons it is worth doing every time:

- It tells you the variant matrix, so the expensive calls in step 2 can be
  aimed rather than sprayed across every variant.
- It catches "the designer changed more than they mentioned", which has now
  happened twice — the Input resize and the Tabs 44→32 height drop were both
  visible in metadata alone.

```
get_metadata(fileKey, "<component node id>")
```

> **Use `search_design_system` to audit variables, not `get_variable_defs`.**
> `get_variable_defs` only returns variables *applied to a layer*. A token that
> exists in Figma but is unused anywhere comes back absent, and you will
> conclude it does not exist. This is exactly how `Surface/Card` (`#fafafb`)
> stayed missing from the token set long enough for CLAUDE.md to assert the
> surface stack had only three levels. It had four.

---

## Step 2 · Extract the spec — the multi-agent pipeline

Extraction is a **multi-subagent pipeline**, orchestrated by the `/extract`
command ([.claude/commands/extract.md](../.claude/commands/extract.md)). A
single briefed agent was tried first and produced uneven results — quality
tracked the discipline of each hand-written brief, single-source readings went
unchecked (the dashboard shipped a ring a third too thick off one bad pixel
trace), and 13 sequential remote Figma calls made even a 4-variant component
take ~10 minutes. Three parallel lanes are both faster (wall clock ≈ the
slowest lane, not the sum) and safer (synthesis cross-checks every value two
lanes both speak to).

```
/extract <Name> <node-url>
   Gate 0  metadata sweep (main session, 1 call → variant matrix)
   Gate 1  three lanes IN PARALLEL:
             extract-structure   anatomy, slots, booleans, SVG geometry
             extract-tokens      per-variant variable bindings, state deltas
             extract-visual      pixel measurement, state distinguishability
   Gate 2  extract-synthesis    cross-check + Tailwind v4 mapping
   Gate 3  implement (main session — Steps 3–7 below)
```

| stage | agent | what it alone can see |
| --- | --- | --- |
| lane 1 | [`extract-structure`](../.claude/agents/extract-structure.md) | child layers, hidden booleans, stroke alignment, authoring quirks |
| lane 2 | [`extract-tokens`](../.claude/agents/extract-tokens.md) | exact variable names + hex per variant, per-state deltas |
| lane 3 | [`extract-visual`](../.claude/agents/extract-visual.md) | painted stroke widths by pixel coverage, flattened vectors, whether states are actually distinguishable |
| synthesis | [`extract-synthesis`](../.claude/agents/extract-synthesis.md) | conflicts between the lanes; the Tailwind utility/token mapping and trap flags; the visual-spec assertion list |

Rules that hold across the pipeline:

- **Lanes report; they never write files and never interpret.** Synthesis
  reconciles; the main session implements. A BLOCKING conflict from synthesis
  stops the build — never implement around a contradiction.
- **Every lane batches its independent Figma calls in one parallel message** —
  the wall-clock cost is remote calls at 10–60s each, not tokens or models.
- The visual lane may be skipped only for components with no strokes, no
  vector glyphs and no fractional-looking values; when in doubt, run it.
- **Multiple components**: run every component's lanes concurrently; synthesis
  stays per-component. Seven components were once extracted in a single
  parallel pass, and that pass found four real defects in components that
  were already "done".
- **None of this touches Val.** Different agent prefix, read-only lanes,
  nothing in `commands/val.md` references it. Val assembles pages from
  finished components; this pipeline builds the components.

The brief template below remains the reference for what a complete extraction
covers — the lane agents embed its rules in their definitions.

### Use the cheapest tool that answers the question

The three Figma read tools differ in cost by a factor of fifteen, and the
expensive one is easy to reach for by default. Measured across 13 extraction
runs, cost tracked the **number of `get_design_context` calls** and almost
nothing else — see [process-cost.md](process-cost.md).

| tool | ~cost | use it for |
| --- | ---: | --- |
| `get_metadata` | 200–1,400 | the variant matrix and every dimension |
| `get_variable_defs` | ~150 | which tokens a layer binds — colours, state deltas |
| `get_design_context` | **~2,400** | structure: child layers, slots, hidden booleans |

**Put this budget in the brief:**

```
TOOL BUDGET — use the cheapest tool that answers each question:
- Dimensions and the variant matrix come from `get_metadata`. They are already
  listed below; do not re-query them per variant.
- Colours and state deltas ("what changes on hover?") are `get_variable_defs`
  questions. It returns a compact map and is ~15x cheaper.
- Reserve `get_design_context` for STRUCTURE — child layers, slots, hidden
  booleans. One representative variant per Type is normally enough; you do not
  need it for every variant in a state matrix.
- Use `get_screenshot` when a question is visual ("is hover distinguishable?").
```

That single paragraph is where the saving is. It does not change what the agent
reports — the rules below are unchanged — only which call it makes to find out.

### Brief template

Adapt the node list and the structural questions; keep the rules verbatim.

```
Extract raw design specs from Figma for the Valiify **<Name>** component, so
they can be implemented as CSS and encoded as expected values in an automated
visual-regression test.

Figma fileKey: `PA5pr1Q8KLfbjTxdAbFm0V`
Component set frame: `<node-id>`

Variants (dimensions from metadata in parentheses):
- `<id>` <variant name>  (<w>×<h>)
  …

Load Figma MCP schemas with ToolSearch first if needed.

TOOL BUDGET — use the cheapest tool that answers each question:
- Dimensions and the variant matrix are listed above, from `get_metadata`. Do
  not re-query them per variant.
- Colours and state deltas ("what changes on hover?") are `get_variable_defs`
  questions — a compact map, ~15x cheaper than the alternative.
- Reserve `get_design_context` for STRUCTURE — child layers, slots, hidden
  booleans. One representative variant per Type is normally enough.
- Use `get_screenshot` when the question is visual.

CRITICAL RULES — report RAW values, do not interpret or convert:
1. All dimensions in raw px exactly as Figma reports them.
2. Colors by their Figma VARIABLE NAME (e.g. `Primary/Main`, `Stroke/Divider`)
   AND hex. Never invent a name.
3. Text STYLE NAME plus size/weight/lineHeight/letterSpacing exactly as
   reported.
4. If `lineHeight` comes back as the number `100`, report it literally as
   `100` — it is Figma's "Auto" sentinel, do NOT convert it to 1 or 100%.
5. `letterSpacing` from this API is a PERCENTAGE, not px. Report the raw
   number and say so.
6. If a value is absent, write `null`. Never guess or fill in a plausible
   number.

<structural questions — see below>

Return ONLY markdown tables plus a notes list:

## Per-size geometry
| size | … |

## <state> delta
| size | property | enabled | disabled |

## Notes
- anything ambiguous, contradictory, or surprising
- explicitly flag anything you could not determine

Do not write any files. Do not modify the repo. Report findings only.
```

### Ask structural questions, not just numbers

The numbers are the easy part. What has actually caught problems:

- **What can this contain?** Every child layer, and whether it is hidden by
  default. Avatar's description promised an image; there was no image layer.
- **What does each state actually change?** Ask for a property-by-property
  diff against the enabled twin. Avatar's disabled state changes the fill and
  nothing else — the initials deliberately do not dim.
- **Does each size use its own type style?** Do not assume. Button uses three
  different styles across three sizes; Avatar uses three styles across *four*
  sizes, with xs and sm sharing one.
- **Is a property orthogonal or a variant axis?** Chip's `Ring` is a boolean
  that combines with any colour; modelling it as a variant would be wrong.

### Rules 4 and 5 exist because they are silent failures

`lineHeight: 100` renders as `line-height: 1` if taken literally — visibly too
tight, and nothing errors. `letterSpacing: 0.4` emitted as `0.4px` instead of
`0.004em` is wrong by a factor of 12. Both shipped once.

---

## Step 3 · Scaffold

```bash
npm run new:component <Name>
```

One name only — it rejects extra arguments rather than silently ignoring them.
This creates the CSS from `_template.css`, registers the `@import`
alphabetically in `src/components/index.css`, creates the story, and adds
`<Name>Class` to `types/components.d.ts`.

Delete the house-style comment block from the template once the CSS is
populated.

---

## Step 4 · Implement

House style is in the template header and in CLAUDE.md. Beyond it, these are
the traps that have actually cost time:

### Size bordered components with `height`, never `min-height`

Chrome rounds the 0.5px `--border-thin` hairline **up to a full 1px**, at any
DPI, and the extra pixel is really in the layout box — so a hairline adds 2px
of height, not 1px. Figma draws its stroke *inside* the frame, so a
`min-height` component lands 1–2px past its Figma frame.

Input and DropdownField both shipped oversized this way. Use explicit
`height`, as `button.css`, `input.css` and `dropdown-field.css` do.

### Side-specific hairlines need the side-specific utility

`border-[length:…]` sets all four sides. This:

```css
@apply border-t border-[length:var(--border-thin)];   /* WRONG */
```

produces a 0.5px box *plus* a 1px top. Write
`border-t border-t-[length:var(--border-thin)]` instead.

### `--text-*` carries neither font-family nor text-transform

JetBrains Mono styles need `font-mono` or they silently render in Inter. Label
styles need the generated `type-label-*` utilities to pick up their casing.

### Half-pixel padding needs arbitrary syntax

Tailwind's spacing multiplier steps in whole pixels. `py-[5.5px]` works;
there is no multiplier form for it.

### Sizing of nested primitives belongs at the call site

Icons take `.icon-size-14`; Avatar takes `.avatar-md`. Do not reach into a
child component with a descendant selector to resize it — DropdownField used
to do this to its avatar and it hid the duplication.

---

## Step 5 · Add a visual spec

Add an entry to [`scripts/visual-specs.mjs`](../scripts/visual-specs.mjs). This
is what makes the component verifiable, and it is where the process earns its
keep — the harness has caught four defects in components that already looked
finished.

- Compare colours with `{ token: '--color-x' }`, **never a literal**. The theme
  emits `oklch()`, so a hardcoded `rgb()` fails even when the colour is right.
- Default the tolerance to exact. Widen it only where the delta is understood,
  and write the reason next to the check — a loose tolerance hides regressions.
- Pin the things a future change could plausibly break: per-size heights, the
  properties a state does *not* change, and any value that differs between two
  sizes that look similar.

---

## Step 6 · Document

Add a `#### <Name>` section to the Quick Reference in
[`CLAUDE.md`](../CLAUDE.md), following the shape of the existing ones: class
list, size table, usage examples, and a blockquote for any trap.

State plainly what is **not** from Figma. Invented API is fine when it is
necessary and labelled; it is corrosive when it looks design-approved.
`.dropdown-menu-divider` and `.textarea-counter` are both extensions, and both
say so.

---

## Step 7 · Verify and commit

```bash
npm run build && npm run typecheck
npm run verify:component <Name>       # static: tokens, conventions, wiring
npm run storybook                     # separate terminal
npm run verify:visual -- <Name>       # SCOPED — use this while iterating
npm run verify:visual                 # full suite, once, before committing
npm run audit                         # coverage + gaps across the library
```

**Scope `verify:visual` while iterating.** With no argument it boots a browser
and walks every story for all 16 components. Running the scoped form during the
edit loop and the full suite once before committing is the same coverage for a
fraction of the wall-clock.

`npm run audit` is worth a glance at the end: it reports this component's
checks-per-variant against the rest of the library, and flags anything shipping
without a spec at all. A component landing near the bottom of that table is not
wrong, but it is unverified — see [component-audit.md](component-audit.md).

Then **look at it**. Screenshot the story and compare against the Figma frame.
Two defects this session were invisible to the assertions and obvious on
sight — a Combined menu row whose check was black instead of primary, and a
badge whose digit was cramped in too small a circle.

---

## Revising an existing component

When the designer changes something that already ships, **do not re-run the
full extraction.** The Tabs revision cost 66k tokens and 28 calls to answer two
questions, because the brief asked for a whole diff instead of naming what to
look at. A targeted brief is roughly a tenth of that and gives a better answer,
because a narrow question is harder to answer vaguely.

1. **Run `get_metadata` on the component yourself first.** It is one cheap
   call and it answers most revisions outright — every dimension and the whole
   variant list. Diff it against the `variants:` count and the heights already
   asserted in `scripts/visual-specs.mjs`.
2. **Only spawn an agent for what metadata cannot see** — colours, tokens,
   type styles, structure.
3. **Give it the current values to diff against.** Paste the relevant rows from
   the spec or the CSS header. Without them the agent re-derives everything.

```
Re-extract ONLY what changed in the Valiify **<Name>** component.

Figma fileKey: `PA5pr1Q8KLfbjTxdAbFm0V`
Component set frame: `<node-id>`

The designer reported: <what they said>.
Assume they under-reported — that has happened on every revision so far.

Here is what we currently implement, to diff against:
<paste the geometry table / relevant CSS>

TOOL BUDGET:
- Dimensions and the variant list: already swept via `get_metadata`, results
  below. Do not re-query.
- Colours, tokens and state deltas: `get_variable_defs` on the SPECIFIC
  variants in question — not all of them.
- `get_design_context` only if the STRUCTURE may have changed (new slot, new
  child layer). Say so explicitly if you use it and why.

<the same CRITICAL RULES block as a full extraction>

Report ONLY differences from the table above, plus anything the designer did
not mention. State clearly if something they reported did NOT change.
```

> **Always ask what else moved.** On the two revisions so far the designer
> reported one change and there were two, then reported two and there were
> four. The under-report is not carelessness — it is that a padding edit
> silently reflows a hug-sized frame.

---

## What Figma gets wrong

Not a criticism of the designer — a list of things to expect, because every
component so far has hit at least one.

| Pattern | Real instance |
| --- | --- |
| Half-updated variants after a resize | 8 of 12 Input `sm` variants kept a stale `h-[29px]` frame |
| Description contradicts the layers | Avatar says "user profile image"; no image layer exists |
| Unbound raw values | Card's `#8a38f5` border and 12px radius match no token |
| Token names inverted | Button's `hover` variant is filled with `Action/Subtle`; `selected` uses `Action/Hover` |
| Style names that lie | `Micro L - Bold` and `Micro M - Bold` are both weight 500 |
| Declared padding the frame overrides | Icon Button declares `Spacing/6` at every size; real offsets are 6/2/0 |
| Geometry that does not fit its own box | Badge MD shipped 11px type in a 15px circle |

When something looks wrong, it often is. Two of these were fixed by the
designer after being raised — say so rather than implementing around it.

---

## Related

- [`CLAUDE.md`](../CLAUDE.md) — component reference and token system
- [`figma-extraction.md`](figma-extraction.md) — the *token* pipeline, for when
  a new variable appears rather than a new component
- [`component-roadmap.md`](component-roadmap.md) — what is built and what is next
- [`scripts/visual-verify.mjs`](../scripts/visual-verify.mjs) — the harness
- [`scripts/visual-specs.mjs`](../scripts/visual-specs.mjs) — expected values
