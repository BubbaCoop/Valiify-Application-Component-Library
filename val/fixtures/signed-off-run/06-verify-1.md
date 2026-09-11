# Verify 1 — primary-contact handoff package

**VERDICT: PASS** — 13/13 concept blocks implemented, 4 states reachable, 21 copy
strings byte-identical to the approved sources, 0 blocking findings, 4 advisories.

## Mechanical pass (orchestrator's runs, quoted)

```
CLASS-AUDIT: PASS | CLASSES: 51 | SANCTIONED: 51 | PLANNED: 0 | UNSANCTIONED: 0 | VIOLATIONS: 0
HANDOFF-CHECK: PASS | BLOCKS: 13/13 | STATES: 4 | COPY: 21 | FAILURES: 0 | WARNINGS: 0
```
Concept hash re-verified: `b1cc6bb0…d7d59be`, seal holds.

## Judgements a script cannot make

**D1 — the 16px gutter moved from b13 to b02 (`px-4`). Arithmetic checks out;
the claim holds at both viewports.**

- Mobile 375: `px-4` on b02 → content box 375 − 32 = **343**; b13 carries no
  width, so it fills 343 exactly as the concept's `p-4`-on-b13 does; `py-4`
  reproduces the 16 top/bottom the concept's `p-4` supplied; `gap-4` unchanged.
  Rendering is identical, and no `w-[343px]` is declared (concept requirement).
- Web ≥ md: b13 is `md:w-140` = 560 with no x-padding, so **every content
  element is the required 560** and the name row closes exactly
  (`w-67` 268 + `gap-6` 24 + `w-67` 268 = 560, §1.1/§4). b02's `px-4` insets
  the canvas content box to viewport − 32 (1888 at 1920, 736 at the 768
  boundary), both ≥ 560, so the centred column is unaffected and `mx-auto`
  still centres symmetrically on the viewport.
- The rejected alternative is correctly rejected: `p-4` on b13 would yield
  560 − 32 = **528** of content at md (name row would not close), and
  `md:px-0` is not in the methodology (class audit would reject it).
- Below 375 the canvas gutter stays fluid; `w-[343px]` would overflow at 320.
- Fill is unaffected (padding sits inside the background), and b12/b01 are
  siblings of b02, so the sticky bar keeps its own full-bleed `px-4` per §11.

**Reviewer decisions.** (1) Two-up row: HANDOFF §1.1 states it settled —
"**This is not an open question for the dev team**" — and it is absent from §12;
b05/b06/b07 built as drawn. (2) Footer offset: HANDOFF §12 O1 carries it as a
methodology gap in §1.2, owned by the methodology owner; no padding invented
anywhere (b13 has `py-4`/`md:py-12` only, no bottom offset). (3) F11: b02 named
page root in mapping.md and HANDOFF §4/§12 O4 as a label only — no height class,
markup unchanged.

**Copy.** Every rendered string was byte-compared against `01-brief.md`: c01,
c02, c03–c07, c08–c12, c15–c19 all match exactly (ASCII apostrophes on both
sides; the package's only non-ASCII characters are §, —, ›, · inside comments).
c13/c14 render "Back"/"Continue" with `type-button-label` supplying the caps —
the approved concept's choice, recorded in HANDOFF §4 with ↑. c20 renders
"Step 3 of 10 / Primary contact" with the methodology's slash separator. c21 is
"English"/"EN" from §1.1/§1.2. Nothing reworded, nothing drafted, no help text,
no loading affordance, no `.skeleton`.

**Markup fidelity.** StepHeader, TextField and both buttons are the CLAUDE.md
examples element-for-element (same nesting, same class strings, no added
wrappers); TextField's only additions are the `{widthClass}` slot (§11's `w-67`
at the call site) and the documented `…rest` spread carrying `data-block`.
`.text-field-help` omitted and recorded. Behaviour is real: error is
`aria-invalid="true"` + `aria-describedby`, disabled is the real `:disabled`
attribute — no synced classes, no style bindings, no `<style>`/`style=`/`.css`.

**States.** empty (`value`), error (`touched`), disabled/enabled
(`continueEnabled`) are each produced by the prop the contract names and each
renders the concept's change.

**Planned values.** §12 has no interim-class column (Addition | Spec | Library
home), so §11's "Mobile footer (interim)" recipe is the sanctioned spelling; the
package's b12 string matches it character-for-character, and HANDOFF §7's swap
table carries it against the §12 row "Mobile sticky action bar". HANDOFF §8.6
raises the missing column as upstream work.

## Findings

| id | check | severity | file | finding | fix |
| --- | --- | --- | --- | --- | --- |
| A1 | traceability | advisory | `05-package/mapping.md` | b06–b10 cite `src/lib/components/TextField.svelte:38` as the component root; line 38 is `<label class="text-field-title">` — the root `<div class="text-field {widthClass}">` is line 36. | Change `TextField.svelte:38` → `:36` in the five rows. |
| A2 | load path | advisory | `05-package/HANDOFF.md` §2 | The sprite is loaded with `sprite.svg?raw` + `{@html}`; GETTING_STARTED Step 5 documents `sprite.svg?url` + `fetch`. The specifier resolves (package exports `./icons/sprite.svg`) and the variant is SSR-safe, but the swap is not flagged as a variant. | Either use the documented `?url` form or add one line: "SSR-safe variant of GETTING_STARTED Step 5". |
| A3 | contract accuracy | advisory | `05-package/contract.json` (c13, c14) | `verbatimInMarkup: false`, yet the contract's own `text` values "Back"/"Continue" **are** rendered byte-identically; the flag here means "differs from the brief's typed BACK/CONTINUE", which a machine consumer cannot infer. | Set `true`, or state in HANDOFF D4 that for c13/c14 the flag is measured against the brief's typed caps, not the contract text. |
| A4 | one-to-one with the concept | advisory | `StepHeader.svelte`, HANDOFF §3 | `label`/`shortLabel` are public props; defaults are the approved "English"/"EN", but the API leaves a host a path to copy outside the approved table, which the concept forbids ("the build must not invent a different label"). | Note in §3 that these are locale-swap slots only — any other value is unapproved copy. |

No finding blocks handoff. The package may go to the dev team as is; A1–A4 are
document-accuracy fixes.

VERIFY: PASS | BLOCKS: 13/13 | STATES: 4 | FINDINGS: 4 | BLOCKING: 0
