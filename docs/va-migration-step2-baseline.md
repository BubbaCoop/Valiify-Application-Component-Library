# `va-` migration — step 2 baseline

**Date:** 2026-09-14 · **val-core:** 0.4.0 → 0.5.0 · **Tailwind:** 4.3.3

Step 2 of the `va-` namespace migration is the val-core bump **and nothing else**.
This file is the before-picture: captured after the bump, before step 3 renames a
single class. Anything that changes after this is the rename's doing.

Every run below uses `--no-write`, so the pinned `signed-off-run` fixture's own
`class-audit.json` is never overwritten (see the fixture pin note).

## Correction: the compile check was NOT silently off in this repo

The plan asserted that 0.5.0's `file://` resolver fix (`ee914a6`) turns the
Tailwind compile check on here for the first time, because this repo's path
contains spaces. **That is wrong, and was verified wrong before relying on it.**

The bug fires only on the `file://` fallback, which is used when `--package` is
omitted. All five generated `class-audit` invocations pass
`--package {{LIBRARY_PACKAGE}}`, so agent runs resolved through `createRequire`
and never touched the broken path.

Measured against a real 0.4.0 checkout (`d5b2806`):

| val-core | `--package` passed (every agent) | `--package` omitted |
| --- | --- | --- |
| 0.4.0 | `tailwind 4.3.3: 34 compiled; 0 did not` | `skipped: ENOENT …valiify%20shortapp%20library/src/library.css` |
| 0.5.0 | `TAILWIND: 4.3.3` | `TAILWIND: 4.3.3` |

Consequences:

- **No pre-existing compile defect was revealed by the bump**, because nothing
  was hidden on the agent path. `0 did not compile` both before and after.
- **`signed-off-run/class-audit.json` is trustworthy on this point** — it records
  `checked: true, tailwind: 4.3.3, candidates: 34, nonCompiling: []`, and that
  was real. The fixture pin note has been corrected.
- The `| TAILWIND: <version>` segment in the headline is **new in 0.5.0**; it
  replaces the field's *absence*, not `UNAVAILABLE`.

## Baseline A — concept, as an agent invokes it

```
CLASS-AUDIT: PASS | CLASSES: 52 | SANCTIONED: 52 | PLANNED: 0 | UNSANCTIONED: 0 | VIOLATIONS: 0 | TAILWIND: 4.3.3
  §12 GAP     §12 lists 2 planned addition(s) but its table has no interim/class column (headers: Addition | Spec from the frames | Library home), so no interim class is sanctioned. A page composing one of these writes a class the audit cannot recognise as planned. Add the column, or move the row to §10 once it ships. (methodology format defect — report it; not a failure)
  tailwind 4.3.3: 35 sanctioned utilities compiled; 0 did not
  report not written: --no-write
```

## Baseline B — package, as an agent invokes it

```
CLASS-AUDIT: PASS | CLASSES: 51 | SANCTIONED: 51 | PLANNED: 0 | UNSANCTIONED: 0 | VIOLATIONS: 0 | TAILWIND: 4.3.3
  §12 GAP     §12 lists 2 planned addition(s) but its table has no interim/class column (headers: Addition | Spec from the frames | Library home), so no interim class is sanctioned. A page composing one of these writes a class the audit cannot recognise as planned. Add the column, or move the row to §10 once it ships. (methodology format defect — report it; not a failure)
  tailwind 4.3.3: 34 sanctioned utilities compiled; 0 did not
  report not written: --no-write
```

## Tolerance proof

Both runs cover **identical vocabulary in opposite spellings**:
`val/fixtures/va-tolerance/concept.va.html` is `concept.v2.html` with every
`data-class` token respelled — component classes gain the va- namespace, utilities the va: prefix. A PASS on both is
therefore tolerance, not two independently clean pages.

### A — unrenamed concept, `--class-prefix va`

```
CLASS-AUDIT: PASS | CLASSES: 52 | SANCTIONED: 52 | PLANNED: 0 | UNSANCTIONED: 0 | VIOLATIONS: 0 | TAILWIND: 4.3.3 | PREFIX: va (tolerant)
  §12 GAP     §12 lists 2 planned addition(s) but its table has no interim/class column (headers: Addition | Spec from the frames | Library home), so no interim class is sanctioned. A page composing one of these writes a class the audit cannot recognise as planned. Add the column, or move the row to §10 once it ships. (methodology format defect — report it; not a failure)
  tailwind 4.3.3: 35 sanctioned utilities compiled; 0 did not
  report not written: --no-write
```

### B — `va:`-spelled concept, `--class-prefix va`

```
CLASS-AUDIT: PASS | CLASSES: 52 | SANCTIONED: 52 | PLANNED: 0 | UNSANCTIONED: 0 | VIOLATIONS: 0 | TAILWIND: 4.3.3 | PREFIX: va (tolerant)
  §12 GAP     §12 lists 2 planned addition(s) but its table has no interim/class column (headers: Addition | Spec from the frames | Library home), so no interim class is sanctioned. A page composing one of these writes a class the audit cannot recognise as planned. Add the column, or move the row to §10 once it ships. (methodology format defect — report it; not a failure)
  tailwind 4.3.3: 35 sanctioned utilities compiled; 0 did not
  report not written: --no-write
```

Kind coverage in B, per the four registration paths that can fail independently:

| requirement | covered by |
| --- | --- |
| component class, namespaced | `va-btn`, `va-btn-primary`, `va-btn-secondary` (17 total) |
| structural utility | `va:flex` (8 total) |
| token utility | `va:text-display`, `va:bg-surface-paper` (9 total) |
| custom `@utility type-*` — emitted by `build-theme.mjs` into `src/themes/` | `va:type-eyebrow` |
| custom `@utility focus-ring` — hand-authored in `src/utilities/` | `va:focus-ring` |

## Known advisory, pre-existing and unrelated

Every run reports the same methodology format defect. It predates this work and
is **not** caused by the bump or the prefix:

> §12 lists 2 planned addition(s) but its table has no interim/class column
> (headers: Addition | Spec from the frames | Library home), so no interim class
> is sanctioned.

Carry it to the designer/methodology list; do not "fix" it during the rename.
