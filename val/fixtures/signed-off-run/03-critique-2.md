# Critique 2 — primary-contact v2

**VERDICT: PASS** — zero blocking findings, no open stop-trigger question. The
v1 blocking item (F1) is fixed correctly and nothing adjacent broke; the two
structural advisories (F3, F4) landed as a clean shell/column split with one new
block; the two record-only items (F7, F8) are still recorded and nothing was
designed away. One new advisory (F11) rides to the gate.

Mechanical pass: class-audit re-run by the orchestrator on v2 — PASS, 52/52
sanctioned, 0 planned, 0 unsanctioned, 0 violations. No class finding is raised.

Diff discipline verified mechanically: the `data-class` diff v1 → v2 contains
**only** the F1, F3 and F4 edits — b02 split into b02 + b13 in both mains,
`w-67` moved off b05 onto b06/b07 (web) and `md:w-67` onto b06/b07 (mobile),
`w-[343px]` deleted. Every other bag in the file is byte-identical to v1. Block
ids b01–b12 are unchanged and all still present in both mains; b13 is the next
integer, present in both mains; copy ids c01–c20 unchanged, c21 added. No
`class=`, no `<style>`, no `style=`. All seven `data-region` values are from the
surface vocabulary.

Settled at Gate 1 and correctly absent — **not** findings: no loading state / no
`.skeleton` composition, and no help-text block with nothing drafted.

## Findings

| id | block | severity | rule | finding | fix |
| --- | --- | --- | --- | --- | --- |
| F11 | b02 | advisory | §11 "Page shell"; §9.2 "never pure white"; §10 Header sticky contract | The split is right, but b02's identity as an *element* is still half-named. Its bag is §11's canvas verbatim (`bg-surface-app-page`, no height — §11 gives none, so none may be invented), yet it is drawn as a `<section>` sibling of b01 with the label "the full-bleed page ground". Two things follow that a build will have to decide and the concept does not say: (a) a content-height `<section>` leaves the viewport below it unpainted on any short render, which is the §9.2 risk the F4 fix was meant to close; (b) §11 also says `.header` is "a direct child of the scroll container" — if b02 *is* the page root / scroll container, the header as drawn sits outside it. Neither is an invented-value problem; it is an unnamed one. | Add one line to b02's label (and a matching Unsure bullet): name the canvas as the page root / scroll container itself — the element the header is a direct child of — so the fill covers the full viewport by being the root, **not** by adding a height class. §11 supplies no height and none may be inferred. No class change. |

## Adjudication of the ledger, F1–F10

- **F1 (blocking) — fixed, and fixed exactly.** Web: b05 `flex gap-6`, b06/b07
  each `… w-67` (268 + 24 + 268 = 560, §4 line 145 / §11 line 322 verbatim).
  Mobile: b05 `flex flex-col gap-5 md:flex-row md:gap-6`, b06/b07 each
  `… md:w-67`. Nothing adjacent moved: b08–b10 keep no width class (full
  column), b11/b12 untouched, and concept.md's mapping rows for b05/b06/b07 now
  say what the markup says. **Closed.**
- **F2 — dispute stands, in the architect's favour; closed, not re-raised.**
  The residual is exactly as declared: each `<main>` carries its own resolved
  bag, and the only `md:` prefixes in the file are on b05/b06/b07 in the mobile
  main. That is what F1's own fix column prescribed verbatim, and the prefixes
  encode the one genuinely responsive rule on this step (§1.2's stacking
  branch). Where an advisory and a blocking finding pull opposite ways the
  blocking one wins — the right call. The convention is now a stated choice in
  Unsure rather than drift, which is what F2 actually asked for. No finding.
- **F3 — fixed.** `w-[343px]` is gone from the file (grep-confirmed). Mobile
  b13 is `p-4 flex flex-col gap-4` and its label states that 343 is the result
  of the padding on 375, matching concept.md §3. **Closed.**
- **F4 — fixed; the new block is properly mapped.** b02 = §11's canvas half
  (`bg-surface-app-page`) in both mains; b13 = §11's body half, web
  `w-140 mx-auto py-12 flex flex-col gap-10` — character-for-character §11's
  "Page shell" row — mobile `p-4 flex flex-col gap-4` per §1.2. b13 has a
  mapping-table row naming the §11 recipe, a `data-region` from the vocabulary
  (`shell`), `data-methodology`, `data-states`, and a block label. Nesting is
  correct: on web b13 holds title block · content · button row; on mobile b13
  holds title block · content only, with b12 outside it as the sticky footer.
  The fill can no longer land on the 560 column. Residual naming gap carried as
  F11 above — advisory, not a regression. **Closed.**
- **F5 — fixed, choice recorded.** The eyebrow is typed
  `Step 3 of 10 / Primary contact` in both mains with `type-eyebrow` supplying
  the caps; §11's Title block row does specify `type-eyebrow`, which bundles
  the transform, so the rendered `STEP 3 OF 10 / PRIMARY CONTACT` is unchanged.
  One casing convention now governs the file (c13/c14/c20). Recorded in Unsure.
  **Closed.**
- **F6 — fixed.** c21 exists with source **methodology** (§1.1/§1.2), the
  `data-copy="c21"` is on b01 in both mains, the label lines carry
  `data-copy-id="c21"`, and Unsure states the build must not invent a different
  label or locale list. **Closed.**
- **F7 — correctly not designed away.** The two-up name row is still flagged in
  Unsure as one reversible block, now naming frame 172:10673 and the exact
  reversal (delete the b05 wrapper, drop `w-67` / `md:w-67`, no other class
  change). No layout was changed to dodge the flag, and no evidence was
  invented for the frame. As my own F7 said: no change required. **Closed.**
- **F8 — correctly not designed away.** No bottom padding appears anywhere:
  mobile b13 is `p-4 flex flex-col gap-4` with no `pb-*`, b12 carries the open
  note in its label, and Unsure records that §1.2 gives no offset and §13 lists
  none, so no value may be inferred. This is the right outcome — a plausible
  `pb-19` here would have been an invented value. **Closed.**
- **F9 — fixed.** c08–c11 now cite the labels/placeholders rule (a placeholder
  is not a repeat of the label); the format rule is cited only on c12, the one
  shaped field. Strings untouched and still verbatim from the brief. **Closed.**
- **F10 — fixed.** A one-line "Responsive behaviour" section sits after Planned
  values and points at concept section 3. Section list now reads complete
  against skill §7. **Closed.**

## Checklist result — v2

- **A Composition** — every block maps to a §10 class or a §11 recipe, now
  including b13; §11's Page shell, Title block, Two-up fields, Button row and
  interim Mobile footer are each used with §11's own values and no others. No
  `data-blocked`. Nothing composed from scratch where §11 has a row.
- **B Archetype** — §2 row 3 (Form) unchanged and correct; commit row is Back +
  Continue with the primary disabled until all five fields are valid.
- **C States** — unchanged from v1 and still complete: empty (default per §6),
  error (`aria-invalid` driving the library's amber display, no error class
  typed), disabled/enabled on the primary. No roll-up counts to reconcile.
- **D Copy** — 21 rows, 0 DRAFT; c01–c19 verbatim from the brief, c20 de-cased
  with the transform supplying caps, c21 methodology-sourced and now tracked.
  No legal/consent text exists to draft.
- **E Anti-patterns** — §9.2 and §9.3 still clean; the eyebrow de-casing and the
  shell split introduced nothing from either list, and no shipped-but-unused
  §10 component appears.
- **F Responsive** — both mandatory viewports drawn; the §1.2 rules hold and are
  now stated on the right elements (canvas vs column, stacking on the fields not
  the wrapper, footer outside the column, `md` the only breakpoint).
- **G Contract** — ids stable and non-renumbered, regions valid, all four data-
  attributes present on every block, no forbidden attributes, concept.md's
  surface sections 1–3 open the file in order and all four tables are complete.

No stop-trigger question is open.

CRITIQUE: PASS | VERSION: v2 | FINDINGS: 1 | BLOCKING: 0 | ADVISORY: 1
