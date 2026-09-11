# Critique 1 — primary-contact v1

**VERDICT: FAIL** — 1 blocking finding. Everything else is advisory and may ride
to the gate. The concept is derived, not invented: archetype, commit row, states,
copy and both viewports all trace to a § or to the brief. The one blocking item
is a misplaced width in the two-up name row that would build a 268px row inside a
560 column.

Mechanical pass: class-audit re-run by the orchestrator — PASS, 53/53 sanctioned,
0 planned, 0 unsanctioned, 0 violations. No class finding is raised.

Settled at Gate 1 and correctly absent — **not** findings: no loading state / no
`.skeleton` composition (answers-1.md Q1; §13's open item stays untouched), and no
help-text block / nothing drafted (answers-1.md Q2; §11's instruction callout and
the `instruction` region correctly unused).

## Findings

| id | block | severity | rule | finding | fix |
| --- | --- | --- | --- | --- | --- |
| F1 | b05 / b06 / b07 | blocking | §4 "Two-up fields"; §11 "Two-up fields"; skill §7 `data-class` | `w-67` sits in **b05's** bag (`flex gap-6 w-67`), and b06/b07 declare no width at all. §4/§11 say `flex gap-6` at column level with `w-67` **each** — the width belongs to the two fields (268 + 24 + 268 = 560). Skill §7 binds each block's element to a superset of its own bag, so a compliant build renders a 268px name row holding two shrunken fields inside the 560 column. concept.md's mapping row says "each" and is right; the markup contract is wrong. | Drop `w-67` from b05 (web bag becomes `flex gap-6`) and add `w-67` to b06 and b07; in the mobile main add `md:w-67` to b06/b07 and drop `md:w-67` from b05. No other class changes. |
| F2 | b05 | advisory | skill §7 `data-class` | The same block id declares two different bags across viewports: web `flex gap-6 w-67`, mobile `flex flex-col gap-5 md:flex-row md:gap-6 md:w-67`. Per-viewport divergence is this concept's own convention (b02 does it too and is fine), but b05 is the only block that mixes conventions by carrying `md:` prefixes inside the mobile main. | Pick one notation for the file. Either unprefixed per-viewport bags (the b02 convention used everywhere else here) or one mobile-first prefixed bag repeated in both mains. |
| F3 | b02 | advisory | §1.2; Appendix A "Dimensions" | Mobile bag is `bg-surface-app-page w-[343px] mx-auto p-4 flex flex-col gap-4`. `w-[343px]` is the **result** of `p-4` on the 375 viewport, not a sibling class — on one element the two compose to a 311px content column. concept.md §3 states it correctly ("`p-4` → a 343 column"); the bag does not. | Say which element carries which: 375 shell `p-4` → 343 column. Either drop `w-[343px]` from the bag or split the shell and column into two declared elements in the block label. |
| F4 | b02 | advisory | §11 "Page shell"; §9.2 "never pure white" | The canvas fill and the centred body share one bag (`bg-surface-app-page w-140 mx-auto py-12 …`). §11 names them as two things — canvas `bg-surface-app-page`; body `w-140 mx-auto py-12 flex flex-col gap-10`. A build that lands the fill on the 560 column leaves the page either side of it unpainted, which §9.2 forbids. | Name the canvas element separately in the block label (or as its own `shell` block) so the fill is unambiguously the page, not the column. |
| F5 | b03 | advisory | §0 casing; §8 "casing is a transform" | The eyebrow is typed uppercase in markup (`STEP 3 OF 10 / PRIMARY CONTACT`) while c13/c14 were correctly de-cased to `Back` / `Continue` — two casing conventions in one concept. **Not blocking:** skill §7's own contract example types the eyebrow in caps, and no §-row de-cases it the way §8 does for step buttons. Worth the reviewer's eye because the eyebrow is a translated string on a surface that ships a language switch (§7). | Leave as drawn or de-case to `Step 3 of 10 / Primary contact` with `type-eyebrow` supplying the caps — either way record the choice in Unsure so the build does not flip it. |
| F6 | b01 | advisory | §1.1; §1.2; skill §5 (copy is content) | The header renders `English` / `EN` but b01 carries no `data-copy` and the copy table has no row for the selector label. It is methodology-sourced (§1.1 writes "English", §1.2 the `EN` swap), not drafted — but it is untracked copy in a concept whose copy table claims to be complete. | Add a copy row (id, role "header language label", text `English` / `EN`, source §1.1/§1.2) and put its id in b01's `data-copy`, or state in Unsure that it is component sample content the build must not invent. |
| F7 | b05 | advisory | §1.2; §4; §11 | Two-up First name / Last name is a layout the brief does not specify. **The citation holds as far as it goes:** §1.2 names that exact pair as a web two-up row that stacks on mobile, and §4/§11 give the exact composition (`flex gap-6`, `w-67` each). But no §-row asserts that the Primary Contact step's own frame composes them two-up — §4's two-up evidence cites 258:13116 and Additional_Details, not 172:10673. The architect's "one reversible block" flag is sustained as written. | No change required. Keep the flag in Unsure and let the reviewer confirm against frame 172:10673; if it stacks, the fix is deleting the b05 wrapper with no class change inside b06/b07. |
| F8 | b12 / b02 (mobile) | advisory | §1.2; §13 | Nothing offsets the mobile page container from under the 76px sticky footer, so the last field can sit behind it. §1.2 specifies the footer but no bottom offset, and §13 does not list one — so no value may be inferred. | Record in Unsure as an unspecified value the build will hit. Do not invent a padding; if the build needs one, it is a new question, not a default. |
| F9 | copy table c08–c10 | advisory | §8 "placeholders show the format" | The §8 rule column cites the format-placeholder rule for `Jane`, `Doe` and `Chief Financial Officer`. Those are sample values, not formats; §8's rule covers shaped fields (`000-000-0000`, `0.00`, `••••`) and is correctly cited only for c12. Using the supplied strings verbatim is right (skill §5) — the cited justification is not. | Change the §8 cell for c08–c10 to the labels/placeholders rule ("placeholders … not a repeat of the label") and drop the format claim. Leave the strings untouched. |
| F10 | concept.md | advisory | skill §7 section order | No standalone "Responsive behaviour" section. Satisfied in substance by the surface's own concept section 3 (Mobile behaviour per §1.2), which must open the file — so this is a labelling gap, not a content gap. | Add a one-line "Responsive behaviour" section after Planned values pointing at section 3, so the section list reads complete against skill §7. |

## Adjudication of the architect's flagged judgement calls

- **Two-up name row (b05).** Citation supports the composition; it does not
  establish it for this step. Sustained as advisory (F7). The separate blocking
  item F1 is about where `w-67` lives, not whether the row should exist.
- **`Back` / `Continue` typed sentence case.** Correct and required. §8: "typed
  in sentence case; the `type-button-label` utility … supplies the caps." The
  brief's literal `BACK` / `CONTINUE` is the rendered form. No finding.
- **Eyebrow slash separator.** Correct. §3, §7 and §10 all write the eyebrow as
  `STEP n OF m / SECTION`; §8's middot rule governs inline metadata
  (`phone · email`), not the eyebrow, and the brief's middot is the brief
  schema's own notation. No finding.
- **Mobile sticky footer as §11 interim against §12's planned component.**
  Correct. §12: "Until they ship, pages use the interim recipes in §11." The
  recipe is reproduced verbatim (`h-19 py-3.5 px-4 flex gap-5 bg-surface-paper
  border-t border-stroke-divider sticky bottom-0 z-40`, `.btn btn-secondary` 99 +
  `.btn btn-primary flex-1`), the z-tier matches Appendix A, and the Planned
  values table cites the right §12 row. No finding.

## Checklist result

- **A Composition** — every block maps to a §10 class or a §11 recipe; no
  `data-blocked` anywhere; no pattern composed from scratch where §11 has a row.
  One misplaced value (F1).
- **B Archetype** — §2 row 3 (Form) fits; commit row is Back + Continue with the
  primary disabled until valid, matching that row and §5/§6 exactly.
- **C States** — all four brief states present (empty, disabled, enabled, error);
  error uses `aria-invalid` driving the library's amber display per §6/§10, no
  error class typed; empty is the default per §6; no roll-up counts to reconcile.
- **D Copy** — all 19 supplied strings verbatim; 0 DRAFT; casing via the type
  utilities for the buttons. F5, F6, F9 are the exceptions, all advisory.
- **E Anti-patterns** — §9.2 clean (no `NEXT`, no asterisk, no header progress or
  back control, no rail/tab strip, no overlay, no confirmation page, no gray
  disabled primary, no second typeface). §9.3 clean. Nothing from §10's
  shipped-but-unused list mapped by analogy.
- **F Responsive** — both mandatory viewports drawn; §1.2 followed (EN swap,
  `p-4`/343, `gap-4`, 76 sticky footer outside the page container, two-up stacks
  at `gap-5`, title stays `text-display`, `md` as the only breakpoint). F3, F8
  advisory.
- **G Contract** — stable ids b01–b12, `data-region` from the surface vocabulary
  on every block, no `class=`, no `<style>`, no `style=`, concept.md's surface
  sections in order and all four tables present and complete. F10 advisory.

No stop-trigger question is open.

CRITIQUE: FAIL | VERSION: v1 | FINDINGS: 10 | BLOCKING: 1 | ADVISORY: 9
