# Ticket: no disabled state exists on any form field

**Status:** open · **Raised:** 2026-09-16 · **Blocks:** no current run
**Not part of 1.1.0** — see [the error-axis scope](../val/runs/2026-09-16-design-bsa-account-information/library-ask-error-axis.md) §B10.
**Needs:** a designer decision first (frames or a written rule), then a library change.

## The gap

Four form components model **no disabled state**, in Figma or in the library:

| component | disabled axis in Figma | what the library ships today |
| --- | --- | --- |
| `TextField` | none | nothing — `:disabled` is unstyled |
| `DropdownField` | none | nothing |
| `TextArea` | none | nothing |
| `RadioField` | none | nothing |
| `Radio` (the bare control) | none | cursor only |
| `Checkbox` | **yes** | ring thins to 1px + swaps to `Stroke/Divider`; checked fill `Primary/Disabled` |
| `Switch` | none | cursor only |
| `Button` | **yes** (Figma's `Inactive`) | per-type: `Primary/Disabled` fill, `Stroke/Divider` border, `Text/Tertiary` ink |
| `UtilityButton` | none | cursor only — no `Inactive` axis exists, unlike Standard |

So the library has two worked examples of a disabled treatment (Button, Checkbox) and **none for
any field**. Each component's CSS says so explicitly — TextField's header calls it out as
"a priority gap for real forms".

`docs/designer-list.md` systemic item 4 already records this and calls it **launch-blocking for an
application form**.

## Why it matters

A multi-step application has fields that are conditionally locked: prefilled from a prior step,
awaiting an upstream answer, or read-only for this applicant class. Today a consumer has three
options, all bad:

1. Ship `disabled` with no visual change — the field looks editable, the applicant clicks and
   nothing happens.
2. Invent a treatment locally — the exact failure the component library exists to prevent, and it
   will differ per consumer.
3. Avoid disabled fields entirely, distorting the flow design around a library gap.

Note the asymmetry that makes this sharper: `Button` **does** have a disabled treatment, so a form
can render a correctly-greyed Continue button above a row of fields that give no such signal.

## What is needed from the designer

Frames would be ideal. A written rule is enough, because the family's state model is already
uniform and well understood — the fields react on the **border only** (fill, label ink and value
ink are constant in every drawn state, pixel-verified across all nine TextField variants).

Concretely:

1. **Does the border change, and to what?** `Stroke/Divider` is the likely candidate — it is what
   Checkbox's disabled ring swaps to, and what Button/Secondary's disabled border binds.
2. **Does the fill change?** Every field is `BG/Paper` in every drawn state. `BG/App Page` is what
   BoxAction's disabled row uses. If the fill changes, this stops being border-only and becomes the
   first field state that does.
3. **Does the ink change?** Button/Secondary's disabled ink goes `Text/Tertiary`. Fields have three
   inks in play — label, value and placeholder — and the family rule to date is that **none of them
   ever changes**. Disabled would be the first exception, so it needs saying explicitly.
4. **RadioField and the bare Radio** — the same shape of question D2 raised for errors: RadioField
   has no box to grey, so a disabled group means the `Radio` control itself must change, which is a
   change to a second component.
5. **Compound with error.** Can a field be disabled *and* invalid? If yes, which wins.

## Scope once decided (estimate, not a commitment)

- CSS: `:disabled` / `:has(:disabled)` rules on four components, plus the `Radio` control if (4)
  says so. Hover/focus rules across all four already carry `:not(:disabled)` guards in some places
  and **not** in others — that inconsistency needs a sweep either way.
- Visual specs: a disabled assertion set per component, mirroring Checkbox's.
- Stories: a `Disabled` story per component.
- Types: no new classes if disabled is driven by the native attribute, as it is on Button and
  Checkbox.
- Docs: `CLAUDE.md` Quick Reference for four components; `docs/designer-list.md` systemic item 4
  resolves.
- Semver: **minor** — new behaviour on existing markup. A consumer already setting `disabled` for
  semantics would newly see a visual change, the same reasoning that made the error axis a minor.

## Related

- `docs/designer-list.md` systemic item 4 (the standing record of this gap).
- The error-axis change, 1.1.0 — same components, same family, and the designer conversation that
  settles this could settle both. Deliberately kept separate so a two-rule change did not become a
  four-component redesign.
