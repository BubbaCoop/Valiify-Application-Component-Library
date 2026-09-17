# Ticket: `DropdownField`'s error state hangs `aria-invalid` on a role that does not support it

**Status:** open · **Raised:** 2026-09-16 · **Component:** `DropdownField`
**Found by:** the BSA design run's `handoff-check` compile pass
**Do not fix inside that run** — it is a library change, and the run ships with the warning
documented.

## The warning

Svelte's compiler, on the generated page:

```
a11y_role_supports_aria_props_implicit — The attribute 'aria-invalid' is not supported
by the role 'button'. This role is implicit on the element <button>
```

It is correct. `aria-invalid` is not in the `button` role's supported-attributes set, so the
attribute is **inert on that element** for assistive technology. A screen reader user gets the
amber border and no announcement that the field is invalid.

## Why the package cannot just remove it

`[aria-invalid="true"]` on `.va-dropdown-field-trigger` **is the library's error selector**:

```css
.va-dropdown-field-trigger[aria-invalid="true"] { @apply border-warning; }
.va-dropdown-field:has(.va-dropdown-field-trigger[aria-invalid="true"]) .va-dropdown-field-hint {
  @apply text-warning-text;
}
```

Dropping the attribute removes the error display entirely. So a consumer is forced to choose
between a visible error state and a valid ARIA contract, which is a library defect rather than a
consumer mistake. The BSA package keeps the attribute deliberately and documents the warning so
a developer does not "fix" it by deleting it.

The same shape of problem does **not** affect the siblings: `TextField` and `TextArea` hang the
attribute on a native `<input>` / `<textarea>`, where it is fully supported, and `RadioField`
(since 1.2.0) hangs it on a `<fieldset>` carrying an explicit `role="radiogroup"`, which does
support it. **`DropdownField` is the only field whose error state is announced to nobody.**

## Why it happens

The trigger is documented and shipped as:

```html
<button class="va-dropdown-field-trigger" aria-haspopup="listbox"
        aria-expanded="false" aria-labelledby="x-label"> … </button>
```

A `<button>` with `aria-haspopup="listbox"` is a legitimate disclosure pattern, and it is what
the library chose because `DropdownField` is deliberately **not** a native `<select>`. But the
implicit `button` role is what makes `aria-invalid` inert.

## Candidate fixes — needs a decision, not a patch

1. **`role="combobox"` on the trigger.** `combobox` supports `aria-invalid`, `aria-expanded` and
   `aria-controls`, and matches what the control actually is. Likely the right answer, but it is
   a real ARIA-contract change: `combobox` brings expectations about `aria-controls` and focus
   management, and every consumer's markup changes.
2. **Move the selector to the wrapper** — `.va-dropdown-field[aria-invalid="true"]`, styling the
   trigger as a descendant. The wrapper is a `<div>` with no implicit role, so the attribute is
   valid there; but on a generic container it is also announced to nobody, which trades a warning
   for silence and is arguably worse.
3. **Keep the attribute for styling and add `aria-errormessage` / `aria-describedby`** pointing
   at the hint. This is the smallest change that actually gets the error announced, and it can
   ship alongside (1) or (2).

**Recommendation: (1) plus (3).** (1) makes the attribute legal on the element the CSS already
selects, and (3) is what actually reaches a screen reader — the two solve different halves and
neither is sufficient alone.

## Scope once decided

- `src/components/dropdown-field.css` — selector change only if (2); doc block either way.
- `stories/components/DropdownField.stories.ts` — the error story's markup, plus the wiring (3)
  requires.
- `scripts/visual-specs.mjs` — the existing error assertions select on the trigger; a selector
  change means updating them.
- `scripts/a11y-scan.mjs` — worth checking whether axe flags the current state; the Svelte
  compiler does, axe may not, which is itself worth knowing.
- `CLAUDE.md` DropdownField Quick Reference — the documented markup is the consumer contract and
  changes with (1).
- **Semver: minor at least.** If (1) is taken, every consumer's trigger markup changes to stay
  correct, so the release note must say so plainly even though nothing breaks visually.

## Related

- `docs/ticket-disabled-state-field-family.md` — the other open field-family gap. Same four
  components, and one designer/a11y conversation could reasonably cover both.
- The BSA run documents this warning in its `HANDOFF.md` §9 and §11 as expected output, so the
  receiving developer does not remove the attribute.
