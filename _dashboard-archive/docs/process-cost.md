# Where the tokens go

**Audited 2026-08-23.** Diagnosis only — nothing here has been applied to the
process. Prompted by the Tabs revision costing a great deal for what looked
like a small change.

---

## The measurement

Thirteen subagents ran during the component build-out. Each reported its own
token count, tool calls and duration:

| run | tokens | calls | tokens/call |
| --- | ---: | ---: | ---: |
| Tabs extract | 84,489 | 38 | 2,223 |
| Navigation extract | 77,608 | 34 | 2,283 |
| Tag extract | 73,107 | 40 | 1,828 |
| Card / IconButton / Icon | 71,061 | 35 | 2,030 |
| Tabs **re**-extract | 66,107 | 28 | 2,361 |
| Button extract | 63,176 | 20 | 3,159 |
| Avatar extract | 61,792 | 32 | 1,931 |
| Pill extract | 61,575 | 21 | 2,932 |
| Chip extract | 57,108 | 21 | 2,719 |
| Switch + Radio extract | 52,664 | 15 | 3,511 |
| SegmentSelector extract | 48,722 | 12 | 4,060 |
| Explore: scaffolder callers | 45,000 | 16 | 2,813 |
| Explore: doc surface | 42,651 | 18 | 2,370 |
| **total** | **805,060** | **330** | **2,440** |

Roughly **0.8M tokens on extraction alone**, at a strikingly consistent ~2.4k
per tool call. That consistency is the finding: cost tracks *number of Figma
calls*, almost nothing else.

> Main-loop cost — my own reading, writing and verification — is not
> instrumented and is not included. The subagent figure is a floor, not a total.

---

## Cost driver 1 — the wrong tool, by a factor of 15

The three Figma read tools differ enormously in price, and the expensive one
became the default:

| tool | typical response | what it answers |
| --- | ---: | --- |
| `get_variable_defs` | ~150 tokens | which tokens a layer binds |
| `get_metadata` | ~200–1,400 tokens | variant names and dimensions |
| `get_design_context` | **~2,400 tokens** | full structure, per variant |

`get_design_context` returns a complete React + Tailwind component — every
child layer, every class string, asset URLs — **per variant**. For a 12-variant
component queried exhaustively that is ~29k tokens before any thinking.

Much of it was spent answering questions the cheap tools answer. State deltas
(*what changes on hover?*) and colour confirmation are `get_variable_defs`
questions. Variant matrices and dimensions are `get_metadata` questions.

**Measured today:** the drift sweep across all 16 components used 16
`get_metadata` calls for roughly **12–25k tokens total**. Full re-extraction
would have been ~800k. The cheap tool answered *"has anything moved?"* for
about **1.5%** of the cost — and it is the tool that would have caught the Tabs
44→32 height change instantly.

## Cost driver 2 — fixed boilerplate, paid per call

Every `get_design_context` response carries the same preamble regardless of
what was asked:

- "SUPER CRITICAL: The generated React+Tailwind code MUST be converted…" (4 numbered steps)
- the node-id note
- the "Images and SVGs will be stored as constants" note
- the full component-description block, repeated verbatim

That is ~350–500 tokens of identical text. Across ~296 extraction calls,
roughly **120k tokens — about 15% of the entire spend — was the same paragraph,
re-sent.** Nothing in the process can prevent this; it is worth knowing because
it makes *call count* the thing to optimise, not response size.

## Cost driver 3 — re-extraction re-reads everything

The Tabs re-extract cost **66k tokens and 28 calls** to answer two questions:
what is the padding now, and what does hover bind. It re-queried all 12
variants because the brief asked for a full diff.

A targeted brief — *"read `get_metadata` for dimensions, then
`get_variable_defs` on the three hover variants only"* — would have cost
roughly 3–5k. **An order of magnitude, for a strictly better answer**, because
a narrow question is harder to answer vaguely.

This is the single clearest waste in the audit, and it is the run that prompted
it.

## Cost driver 4 — unscoped verification

`npm run verify:visual` with no argument boots a browser and visits every story
for all 16 components. It was run this way repeatedly mid-iteration when
`verify:visual -- Tabs` would have done. Cheap in tokens (~40 lines of output),
expensive in wall-clock, and it encourages re-reading full output to find one
line.

---

## What would actually help

Not applied. Ordered by saving per unit of disruption.

1. **A tool ladder in the extraction brief.** Start at `get_metadata` for the
   variant matrix, drop to `get_variable_defs` for colours and state deltas,
   and reach for `get_design_context` only where structure genuinely matters —
   typically one representative variant per Type, not all twelve.
   *Estimated: 40–60% off a typical extraction.*
2. **A diff-mode brief for re-extractions.** When a component already exists,
   supply the current spec and ask only what changed, naming the cheap tools.
   *Estimated: 90% off a revision like Tabs.*
3. **Sweep before extracting.** One `get_metadata` call up front reveals the
   variant count and dimensions, so the expensive calls can be aimed. It also
   catches "the designer changed more than they mentioned", which has now
   happened twice.
4. **Scope `verify:visual` during iteration**, full suite only before commit.

None of these change *what* the process does — only which tool answers which
question.

---

## What this audit cost

The drift sweep and this write-up: **~25k tokens**, no subagents. For
comparison, one component extraction is ~65k. Keeping the mechanical half in
`npm run audit` means repeating it is free.
