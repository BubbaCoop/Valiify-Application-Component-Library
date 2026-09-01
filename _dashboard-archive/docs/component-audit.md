# Component health audit

**Audited 2026-08-23** against Figma file `FdcEV83HPv44bzLPAQU1hR`.
Regenerate the mechanical half with `npm run audit`.

---

## Headline

Three things worth knowing before the table:

1. **No drift.** All 16 components still match Figma's variant matrix and
   dimensions. A previously-flagged Figma inconsistency has also been fixed.
2. **262/262 passing is measuring the wrong thing.** Coverage is distributed
   almost inversely to importance — the three most-used components are the
   three least verified.
3. **15 of 16 components cannot be interacted with.** Their states exist in
   Storybook only as hardcoded attributes.

---

## 1. Drift sweep — clean

`get_metadata` on all 16 component sets, comparing Figma's variant list and
dimensions against what `scripts/visual-specs.mjs` asserts.

| component | Figma | our spec | |
| --- | --- | --- | --- |
| Button | 24 / 28 / 32 | same | ✅ |
| Input | 35 / 29 / 25 | same | ✅ |
| DropdownField | 35 / 29 / 25 | same | ✅ |
| Tabs | 32 / 26, chip+segment 26 | same | ✅ |
| Tag | 21 / 24 | same | ✅ |
| Pill | 17 | same | ✅ |
| Chip | 20 / 23, badge 15 / 19, dot 5 / 7 | same | ✅ |
| Avatar | 34 / 20 / 18 / 16 | same | ✅ |
| MenuItem | 42 / 29 / 25, combined 55 | same | ✅ |
| Switch | 32 × 18 | same | ✅ |
| RadioSelect | circle 15 | same | ✅ |
| IconButton | 28 / 18 / 12 | same | ✅ |
| Icon | 10–24 | same | ✅ |
| Textarea | 50 (height not asserted, by design) | n/a | ✅ |
| DropdownMenu / SegmentSelector | container geometry | same | ✅ |

**Also resolved:** Input's `sm` variants were previously half-updated — 8 of 12
still carried a stale 29px frame while the others were 25px. All 84 variants
are now consistent at 25px. Our implementation was correct on instruction; it
is now correct on evidence too.

> **What this sweep does not cover.** `get_metadata` returns names and
> dimensions only. A colour or token change that keeps the same box is
> invisible to it. A clean sweep means *nothing moved or resized* — not
> *nothing changed*. Full re-extraction is the only way to be certain, and
> costs ~65k tokens per component (see `process-cost.md`).

---

## 2. Coverage — a 70× spread

`npm run audit` for the live numbers.

| component | variants | checks | ratio | |
| --- | ---: | ---: | ---: | --- |
| **Input** | 84 | 17 | **0.20** | 🔴 |
| **DropdownField** | 36 | 16 | **0.44** | 🔴 |
| **Button** | 42 | 20 | **0.48** | 🔴 |
| Icon | 11 | 6 | 0.55 | 🔴 |
| Textarea | 12 | 7 | 0.58 | 🔴 |
| Chip | 54 | 35 | 0.65 | 🟡 |
| IconButton | 12 | 10 | 0.83 | 🟡 |
| Switch | 6 | 7 | 1.17 | 🟡 |
| MenuItem | 7 | 12 | 1.71 | 🟢 |
| Avatar | 8 | 17 | 2.13 | 🟢 |
| RadioSelect | 4 | 10 | 2.50 | 🟢 |
| Pill | 6 | 18 | 3.00 | 🟢 |
| Tag | 8 | 25 | 3.13 | 🟢 |
| Tabs | 12 | 40 | 3.33 | 🟢 |
| DropdownMenu | 1 | 8 | 8.00 | 🟢 |
| SegmentSelector | 1 | 14 | 14.00 | 🟢 |

**The ratio tracks build order, not complexity or importance.** Everything
built early is thin; everything built after the harness matured is thorough.
Input, Button and DropdownField — the three workhorses of the library, and the
three with the largest variant matrices — sit at the bottom.

Concretely, Input asserts 17 things about 84 drawn variants. Its error states,
its BG=Neutral variants at sizes other than the one spot-checked, and most of
its hover and disabled combinations are unverified. It would be entirely
possible to break one and ship green.

> Ratio measures effort spent, not correctness. A high ratio on a one-variant
> component is easy; a low one on an 84-variant component is where risk lives.

---

## 3. Interaction — 1 of 16

Only `DropdownField.stories.ts` wires event listeners. Everything else renders
static markup with hardcoded `aria-selected` / `aria-pressed` / `checked`.

In practice that means **you cannot click a Tab, toggle a Pill, select a Tag,
flip a Switch or choose a Radio in Storybook** and see it respond. Those states
are viewable only as separate pre-set examples.

This is a review and QA gap more than a library defect — the CSS is driven by
attributes a consuming app sets, and the library ships no JavaScript by design.
But it means nobody has ever exercised most of these components as controls,
and the keyboard behaviour of the roving-tabindex patterns (Tabs, SegmentSelector,
RadioSelect) is entirely unexercised.

The DropdownField pattern — a delegated listener in the story file, never in
the package — is the template if this is worth closing.

---

## 4. API that is not in Figma

Everything here is deliberate and labelled in its CSS header. Listed because
"labelled in a comment" is not the same as "visible".

| class / behaviour | component | why |
| --- | --- | --- |
| `.dropdown-menu-divider` | DropdownMenu | grouped menus need one; Figma has none |
| `.textarea-counter` | Textarea | described in Figma prose, never drawn |
| Textarea sizing | Textarea | Figma has no Size property; height left to the consumer |
| `.segment-selector-fill` | SegmentSelector | equal-width segments; Figma's hug and go ragged |
| `.tabs` gap defaults | Tabs | now partly grounded — Figma added containers |
| `:disabled` | Button, Input, DropdownField, Textarea, IconButton, MenuItem, Pill, RadioSelect, Switch, Tabs, Tag | house convention; several have no Figma disabled variant |
| `.tab.with-ring` geometry | Tabs | Figma's ring inset is state-dependent; ours is uniform |

---

## 5. Figma oddities reproduced, not corrected

Kept faithful on purpose. Each will look like a bug in review.

- **Pill** — the *rest* background is the token named `Action/Hover`; *hover*
  uses `Action/Focused`. The names are off by one against the states they serve.
- **Tag** — `md` bumps its label to weight 500 when active while `sm` stays
  400; and the gap is *larger* on the smaller size (sm 10px, md 8px).
- **Tabs** — no `Hover=yes + Active=yes` variant exists for any type, so the
  hover appearance of an already-active tab is undefined in Figma. Our CSS
  resolves it by letting active win.
- **MenuItem / Tag** — no active-without-hover variant is drawn either.

---

## 6. Open questions for the designer

Currently scattered across CSS headers and CLAUDE.md. Consolidated:

| question | component | raised |
| --- | --- | --- |
| Should Card exist at all? It is placeholder scaffolding with no Figma source and ships template styles. | Card | outstanding |
| Was an Avatar image variant planned? The description says "user profile image"; no image layer exists. | Avatar | outstanding |
| Is the Tab container's 409×35 frame intentional? It carries 18px/3px slack with no padding to account for it, and stretches children to 35px. | Tabs | outstanding |
| Should DropdownField have a BG property? We mirrored Input's White/Neutral pair without one in Figma. | DropdownField | outstanding |
| Is the chip variant's local override in the Navigation composition intentional? It no longer matches its source Tabs variant. | Tabs | outstanding |
| Is `.dropdown-menu-divider` the right treatment? | DropdownMenu | outstanding |
| Pill's off-by-one token names — intentional? | Pill | outstanding |
| Tag's weight and gap inconsistencies between sizes — intentional? | Tag | outstanding |

Two previously-raised items **have** been resolved: the Input `sm` variant
inconsistency, and Tabs' underline hover, which was a visual no-op and now
binds `Content/Primary`.

---

## 7. Ranked exposure

1. **Input at 0.20 coverage.** Biggest matrix, thinnest verification, most used.
2. **Card ships as a placeholder.** No Figma source, no spec, invented
   geometry — and it is in `dist`, so consumers can use it.
3. **No interaction wiring on 15 components.** Keyboard behaviour for the
   roving-tabindex patterns has never been exercised.
4. **Button and DropdownField under 0.5.** Same shape of risk as Input.
5. **Colour drift is invisible to the cheap sweep.** Clean here does not mean
   colours have not moved.

None of these are fixed by this audit. It reports them.
