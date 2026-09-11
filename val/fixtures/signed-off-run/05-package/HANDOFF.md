# HANDOFF — Primary contact (business · STEP 3 OF 10 · PRIMARY CONTACT)

## 1. Status and provenance

| field | value |
| --- | --- |
| run | `val/runs/2026-09-11-design-primary-contact` |
| surface | `short-app` · methodology `design-methodology/short-app.md` |
| flow / step | business · step 3 of 10 · section PRIMARY CONTACT |
| archetype | §2 row 3 — **Form** |
| concept | `02-concept/concept.v2.html`, sha256 `b1cc6bb0a3788d8da2df74c914df56134b3d69b73b33299c546a10f8ac7d59be` |
| approval | `04-approval.md`, 2026-09-11T16:02:03Z — hash re-verified at build time, matched |
| library | `@valiify/shortapp-ui` (CSS-only; components used as shipped) |
| output | SvelteKit + Svelte 5 (runes) |
| route | `/business/primary-contact` |

13 concept blocks, 13 implemented. 5 fields, 4 states, 2 actions, 21 copy strings, 4 icons,
1 planned (§12) composition. Nothing is drafted here: every string comes from the brief except
the header language label, which comes from the methodology (§1.1 / §1.2).

Three reviewer decisions from `04-approval.md` are built in, not re-litigated:

1. **The two-up name row is settled** — frame 172:10673 composes First name / Last name
   two-up. b05 is built as drawn and the 268 widths sit on b06 / b07. The sealed concept's
   Unsure section still reads as open on this point only because the concept could not be
   edited without voiding its hash; the approval is the resolution of record. **This is not an
   open question for the dev team.**
2. **The mobile content offset under the sticky footer is a methodology gap** (§1.2 specifies
   the 76px footer but no bottom offset), to be fixed in `short-app.md` separately. No padding
   was invented here. See §12, item O1.
3. **Critique F11's label fix** — b02 is named as the page root in `mapping.md` and here. A
   naming fix only: no height class was added and nothing renders differently.

Also settled before the build and not reopened: **no loading state** (the save is immediate
and synchronous, Continue stays actionable, no `.skeleton` composition) and **no help text
block**.

## 2. Load path

Not in this package (skill §11 — the package carries no stylesheet and never loads the
sprite). The consumer app provides both, once:

```css
/* src/app.css — order is load-bearing */
@import "@valiify/shortapp-ui/fonts";
@import "tailwindcss";
@import "@valiify/shortapp-ui/source";
```

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import "../app.css";
  import sprite from "@valiify/shortapp-ui/icons/sprite.svg?raw";
  let { children } = $props();
</script>
<div hidden aria-hidden="true">{@html sprite}</div>
{@render children()}
```

Never import the library from JavaScript — it fails silently.
Icons referenced by this page: `#globe`, `#chevron-down`, `#arrow-left`, `#arrow-right`.

## 3. Public API

### `src/routes/business/primary-contact/+page.svelte`

| prop | type | required | meaning |
| --- | --- | --- | --- |
| `logoSrc` | `string` | yes | the host's brand asset for `.header-logo` (a caller slot — see §12 O2) |
| `logoAlt` | `string` | yes | alt text for that asset (host-supplied; nothing was drafted) |
| `onback` | `(values) => void` | no | fired by Back with the current payload; no validation runs |
| `oncontinue` | `(values) => void` | no | fired by Continue with the payload, only when valid |

The page owns step state (`values`, `touched`) and never navigates or persists — routing and
persistence are the host app's (skill §11).

### Components (`src/lib/components/`)

| component | block(s) | props | bindable |
| --- | --- | --- | --- |
| `StepHeader` | b01 | `logoSrc`, `logoAlt`, `label` = `"English"`, `shortLabel` = `"EN"` | — |
| `TitleBlock` | b03 | `step`, `section`, `title`, `description` | — |
| `TextField` | b06–b10 | `id`, `label`, `type` = `"text"`, `placeholder`, `error`, `touched`, `widthClass`, `onblur`, `…rest` | `value` |
| `StepButtonRow` | b11 | `continueEnabled`, `onback`, `oncontinue` | — |
| `MobileActionBar` | b12 | `continueEnabled`, `onback`, `oncontinue` | — |

`TextField` spreads `…rest` onto its root so the call site carries `data-block="b06"`…`"b10"`
(traceability, skill §10.12). `widthClass` carries §11's two-up width (`md:w-67`) at the call
site and is empty for the full-column fields.

## 4. Markup contract

Every element below is the library's own markup from `CLAUDE.md`, pasted and given
expressions — same elements, same nesting, same class strings.

| block | root element | classes | notes |
| --- | --- | --- | --- |
| b01 | `<header>` | `header` | CLAUDE.md › Header verbatim, both selector wrappers rendered (`header-desktop` "English" / `header-mobile` "EN") |
| b02 | `<div>` | `bg-surface-app-page px-4` | page root; the canvas paints the ground either side of the column |
| b13 | `<div>` | `py-4 flex flex-col gap-4 mx-auto md:w-140 md:py-12 md:gap-10` | 343 column at 375, 560 column at md; 16 / 48 rhythm |
| b03 | `<div>` | `flex flex-col gap-2` | eyebrow `<p class="type-eyebrow text-content-tertiary">` with the section in `<span class="text-primary-text">`, `<h1 class="text-display text-content-primary">`, `<p class="text-input text-content-secondary">` |
| b04 | `<div>` | `flex flex-col gap-5` | the five-field stack |
| b05 | `<div>` | `flex flex-col gap-5 md:flex-row md:gap-6` | wrapper only; stacks below md (§1.2) |
| b06–b10 | `<div>` | `text-field` (+ `md:w-67` on b06 / b07) | `.text-field-title-row` › `.text-field-title` ; `.text-field-box` › `.text-field-input` ; `.text-field-hint` only while invalid |
| b11 | `<div>` | `hidden md:flex gap-6` | `.btn btn-secondary` (leading `#arrow-left`) + `.btn btn-primary flex-1` (trailing `#arrow-right`) |
| b12 | `<div>` | `h-19 py-3.5 px-4 flex gap-5 bg-surface-paper border-t border-stroke-divider sticky bottom-0 z-40 md:hidden` | same two buttons; §11 interim recipe verbatim |

**Rendered copy, verbatim** (casing marked ↑ is supplied by a `type-*` utility, so the markup
carries the sentence-case form — skill §10.10):

| id | rendered string | where |
| --- | --- | --- |
| c20 | `Step 3 of 10` / `Primary contact` ↑ (`type-eyebrow` → STEP 3 OF 10 / PRIMARY CONTACT) | b03 |
| c01 | `Who should we contact?` | b03 |
| c02 | `We'll use these details for anything we need to ask you about this application.` | b03 |
| c03–c07 | `First name` · `Last name` · `Job title` · `Email address` · `Mobile phone` | b06–b10 labels |
| c08–c12 | `Jane` · `Doe` · `Chief Financial Officer` · `jane@company.com` · `(555) 555-5555` | b06–b10 placeholders |
| c15 | `Enter the contact's first name.` | b06 hint |
| c16 | `Enter the contact's last name.` | b07 hint |
| c17 | `Enter the contact's job title.` | b08 hint |
| c18 | `Enter a valid email address.` | b09 hint |
| c19 | `Enter a 10-digit mobile number.` | b10 hint |
| c13 / c14 | `Back` ↑ / `Continue` ↑ (`type-button-label` → BACK / CONTINUE) | b11, b12 |
| c21 | `English` (web) / `EN` (below md) | b01 |

## 5. Behaviour spec

- **Empty** is the default and has no branch — the native `::placeholder` paints it (§6).
- **Error** is driven by the attribute the library CSS already selects on: the input carries
  `aria-invalid="true"` and `aria-describedby="<id>-hint"`, and the `.text-field-hint`
  paragraph renders. No error class is written and no colour is set here — the library turns
  the box amber and the hint ink amber (§6, §10; the surface's error display is the Warning
  ramp, see §8).
- **When errors fire**: on blur of the field, and on Continue (brief § Validation rules).
  `touched[field]` is set by the field's `onblur`; `handleContinue()` sets all five before it
  checks validity. Because the primary is disabled while the step is invalid, the
  "on Continue" path only ever fires on an already-valid step — it is implemented because the
  brief states the rule, and it is the path a keyboard/AT user hits if the disabled attribute
  is ever lifted.
- **Validation** (brief, verbatim): first / last / job title non-blank after trim; email
  matches a single `@` with a dotted domain; mobile has exactly 10 digits once non-digits are
  ignored.
- **Disabled / enabled**: the primary is the real `:disabled` state
  (`disabled={!continueEnabled}`), so `.btn-primary:disabled` paints the brand at 30% with
  white ink kept (§6, §9.2 — never a gray disabled primary). Back is never disabled and runs
  no validation.
- **No in-flight display.** `oncontinue` is called synchronously; nothing changes on the
  button (answers-1.md Q1).
- **Viewport switch**: above `md` the in-flow `StepButtonRow` (b11) is visible and the sticky
  bar is hidden; below `md` the reverse. The two are separate concept blocks with the same two
  actions and the same two states.
- **The language selector is a trigger only.** The concept draws no listbox panel, so none is
  built: the button keeps `aria-haspopup="listbox"` and `aria-expanded="false"` and has no
  handler. Wiring the menu is the host app's (§12 O3, GETTING_STARTED "Components That Need
  JavaScript").

## 6. Payload

Emitted by both `onback` and `oncontinue` as a plain object (a shallow copy of `values`):

```js
{
  firstName: string,  // required, non-blank
  lastName:  string,  // required, non-blank
  jobTitle:  string,  // required, non-blank
  email:     string,  // required, valid email address
  mobile:    string,  // required, exactly 10 digits once formatting characters are ignored
}
```

Raw as typed — the mobile number is **not** normalised or reformatted here; the brief
specifies a format placeholder, not an input mask. Back emits the same object unvalidated so
the host can keep every entered value (brief § Actions).

## 7. Deviations

**Kept whole**: `.header`, `.text-field`, `.btn btn-secondary`, `.btn btn-primary`,
`.text-selector` — all as shipped, no restyling, no restructuring, no substitutes.

| # | deviation | why | reversible by |
| --- | --- | --- | --- |
| D1 | b13's mobile 16px gutter is written as `px-4` on **b02** (the canvas) instead of `p-4` on b13 | One element cannot hold a mobile-only x-padding: the reset `md:px-0` is written nowhere in the methodology and the class audit does not sanction it, and leaving `p-4` on b13 would give the web column 528px of content inside `w-140` instead of the required 560 (§1.1, §4 "every content element is 560"). `px-4` on the full-bleed canvas reproduces the concept's geometry exactly at both viewports — 16px gutters below md, no effect at md where the column is centred — and keeps the column width undeclared, as the concept requires (no `w-[343px]`). | moving `px-4` back onto b13 the day a sanctioned `md:px-0` exists |
| D2 | `hidden md:flex` added to b11 and `md:hidden` to b12 | The concept draws the button row twice — in flow on web (b11), sticky on mobile (b12). One artifact needs the switch; §1.2 names the breakpoint and §12 scopes the bar to "below `md`". Both classes are sanctioned structural utilities. | — |
| D3 | `focus-ring` (b06–b11) and `sticky top-0 z-40` (b01) are not written as utilities | The library applies both from its own component CSS (§10 keyboard focus; §1.1 "`.header` is `position: sticky; top: 0; z-40` by library contract"). Writing them would restate component CSS as utilities. The concept's Unsure section anticipated exactly this. | — |
| D4 | `contract.copy` rows c13–c21 carry the concept element's **full** text and are marked `verbatimInMarkup: false` | Two different reasons, both recorded: c13 / c14 / c20 because a `type-*` utility supplies the casing (the intended use of the flag), and c15–c19 / c20 / c21 because the concept's copy elements put spec prose after the string ("… — on blur and on Continue"), so the machine reconciliation against the concept must quote it. The strings that actually render are listed verbatim in §4 and are byte-identical to the brief's. | a concept convention that closes copy elements after the string — raise at Gate 2 |

**Omitted, deliberately**: the `.text-field-help` "?" icon slot (the brief asks for no help
affordance — component kept whole minus the optional part, skill §10.8); the help-text block
and any loading display (both settled before the build); every §10 "shipped but unused"
component.

**Planned-value swap table** (§11b) — swap when the library ships the addition:

| block | §12 row | interim class used (the §11 recipe, verbatim) | swap to |
| --- | --- | --- | --- |
| b12 | Mobile sticky action bar | `h-19 py-3.5 px-4 flex gap-5 bg-surface-paper border-t border-stroke-divider sticky bottom-0 z-40` | the shipped component (name chosen at scaffold time); delete `MobileActionBar.svelte`'s composition and keep its two slots |

No `[raw — planned, §12]` token value is used anywhere on this step.

## 8. Library defects and gaps to raise upstream

1. **The error display binds the Warning (amber) ramp, not the Error ramp.** `.text-field`'s
   `aria-invalid` state paints `Warning/Base` and the hint `Warning/Text`; the tokenized Error
   ramp is applied nowhere in the file. Already on the designer list ("an authoring slip") —
   this page will change colour, with no markup change, when the designer rebinds.
2. **`.text-field` has no disabled state** (documented as a priority gap for real forms). Not
   needed on this step; flagged because any step that disables a field will hit it.
3. **The `.text-field-hint` error ink is inferred**, not verified in Figma (the hint row is
   hidden in every variant). This page is a live consumer of that inference.
4. **Placeholder contrast fails WCAG as authored** (`Text/Hint`, 3.11:1) — this step renders
   five placeholders, so it is the widest exposure yet. Waived in the library's KNOWN_ISSUES;
   worth re-raising with the designer.
5. **§12 Mobile sticky action bar is still a recipe, not a component** — the composition in
   `MobileActionBar.svelte` is the interim spelling and should be deleted on arrival.
6. **The methodology's §12 table carries no interim-class column**, so `class-audit` reports
   `PLANNED: 0` for a page that does use a planned composition. The interim classes are
   sanctioned through §11 instead, and the use is recorded in `contract.planned`. Worth adding
   the column so the audit can see it.

## 9. Tests

Both tools were run against this package before handoff; the orchestrator re-runs them
independently.

```
CLASS-AUDIT: PASS | CLASSES: 51 | SANCTIONED: 51 | PLANNED: 0 | UNSANCTIONED: 0 | VIOLATIONS: 0
HANDOFF-CHECK: PASS | BLOCKS: 13/13 | STATES: 4 | COPY: 21 | FAILURES: 0 | WARNINGS: 0
```

Commands:

```bash
node val/tools/design/class-audit.mjs val/runs/2026-09-11-design-primary-contact/05-package \
  --library . --methodology design-methodology/short-app.md --tailwind-from . --package @valiify/shortapp-ui
node val/tools/design/handoff-check.mjs val/runs/2026-09-11-design-primary-contact --sprite src/icons/sprite.svg
```

The handoff check also compiles every `.svelte` file with `svelte/compiler` in runes mode and
verifies each sprite symbol exists. Not run here (out of scope for a handoff package): the
library's own visual, a11y, static and bundle harnesses.

## 10. Evidence

- Concept `02-concept/concept.v2.html` (sealed hash, re-verified) and `02-concept/concept.md`
  — mapping table, copy table, planned values, Unsure.
- `01-brief.md` — fields, actions, states, validation rules and messages, copy supplied.
- `00-input/answers-1.md` — Q1 no loading state, Q2 help text omitted.
- `04-approval.md` — the three reviewer decisions in §1.
- `design-methodology/short-app.md` — §1.1, §1.2, §2 row 3, §3, §4, §5, §6, §7, §8, §9.2,
  §10, §11 (Page shell, Title block, Button row, Mobile footer, Two-up fields), §12, §13.
- `CLAUDE.md` — Header, TextField, Button component sections (the markup shipped here).
- `GETTING_STARTED.md` — Svelte setup, "Components That Need JavaScript".

## 11. Gotchas

- **`bind:value` cannot ride a dynamic `type`.** Svelte rejects two-way binding on an input
  whose `type` is an expression, and `TextField` needs `text` / `email` / `tel` from one
  component. The input writes back through `oninput` instead; the parent still uses
  `bind:value` via `$bindable`. Do not "fix" this into `bind:value` without splitting the
  component.
- **The sticky header only sticks if the document is the scroll container.** `.header` is
  `position: sticky` by library contract; mount the route inside a shell that scrolls the
  document (§12 O4).
- **Do not add a class to switch the error display.** The library selects on
  `aria-invalid="true"`; a synced class would double-paint and drift.
- **The two-up widths belong on the fields, not the row.** b05 carries direction and gap only;
  268 lives on b06 / b07 as `md:w-67` (§11, and the fix that closed critique F1).
- **Casing is never typed.** `BACK` / `CONTINUE` / `STEP 3 OF 10 / PRIMARY CONTACT` come from
  `type-button-label` and `type-eyebrow`. Typing caps would double-transform the copy and
  break the §8 rule.
- **No `<style>`, no `style=`, no `.css`** anywhere in this package, by contract.

## 12. Open questions for the dev team

| # | question | who owns it |
| --- | --- | --- |
| O1 | **Mobile content offset under the sticky footer.** Nothing offsets b13's content from under b12's 76px bar, so the last field can sit behind it at 375. The reviewer classified this as a **gap in the methodology itself** (§1.2 specifies the footer but no bottom offset, and §13 lists no such item) to be fixed in `short-app.md` separately. No padding was invented here. Do not patch it locally — take the value from §1.2 once it lands. | methodology owner, then this page |
| O2 | **Logo asset and its alt text.** `.header-logo` is a caller slot; neither the brief nor the concept supplies an asset or alt string, so `logoSrc` / `logoAlt` are required props with no defaults. | host app |
| O3 | **Language menu.** The concept draws the `.text-selector` trigger but no `.dropdown-list` panel, so none is built. Wiring `aria-expanded`, the panel and outside-click is the host's (GETTING_STARTED). | host app |
| O4 | **Scroll container for the sticky header**, and the canvas's content height: b02 is the page root and carries no height class (the reviewer's F11 fix is a naming fix, explicitly not a height class), so a short page can leave the viewport below b02 unpainted. Both are shell-level decisions. | host app / methodology §11 |

**Not open** — settled and recorded so nobody reopens them: the two-up name row (approval
decision 1), the loading state (none — answers-1.md Q1), the help text block (omitted —
answers-1.md Q2).

## Methodology rules applied

- **§2 row 3 (Form)** — five labelled `.text-field`s on one topic at `gap-5`, Back + Continue
  commit; no sub-section label, no conditional reveal, no disclaimer row, no help text.
- **§1.1** — canvas `bg-surface-app-page` with a separate centred 560 column, sticky 60
  `.header`, rhythm 48 / 40 / 40 / 48, button row in flow.
- **§1.2** — 343 content column and 16 rhythm at 375, the name row stacks, the button row
  becomes the 76px sticky bar, Tailwind's native `md` as the only breakpoint.
- **§3** — three-level title block at `gap-2`; grouping by label, not by card; position lives
  in the eyebrow and nowhere else.
- **§4** — 73 field pitch, `gap-5` stack, 48 touch targets, two-up `flex gap-6` with `w-67`
  each.
- **§5** — free text for every field, format placeholder on the one shaped field, step-tier
  buttons only, primary disabled until the step is valid.
- **§6** — empty is the default; `aria-invalid` drives the error display; disabled primary is
  the brand at 30%.
- **§7** — forward verb CONTINUE (never NEXT), Back as a button left of the primary, language
  switch in the header.
- **§8** — supplied copy verbatim; casing is a transform; required fields unmarked.
- **§9.2 / §9.3** — no progress bar, no back control in the header, no rail or tab strip, no
  asterisk, no gray disabled primary, no overlay, no confirmation page, no second typeface,
  no dashboard token or pattern.
- **§10 / §11 / §11b / §12** — shipped components used as shipped; the five §11 recipes
  (page shell, title block, button row, two-up fields, mobile footer) used verbatim; the one
  §12 planned composition recorded in `contract.planned` and §7.
- **Skill §10** — library markup pasted verbatim; state from the real input and its ARIA
  attributes; runes only; `data-block` on every block root; no `<style>`, `style=`, `style:`,
  `@apply` or `.css`; no load path and no sprite loading in the package.

## Unsure

- **D1's placement of the 16px gutter** is the one judgement call in this build. Two sanctioned
  spellings exist for the mobile column (`p-4` on the column, or `w-[343px]` — §1.2 and §4
  write both) and neither survives the merge with the web bag on a single element; `px-4` on
  the canvas was chosen because it reproduces the concept's geometry at both viewports, stays
  fluid below 375 (which `w-[343px]` would not — it overflows a 320 viewport), and keeps the
  column width undeclared as the concept insists. Reversible in one line.
- **Whether `handleContinue()`'s "mark everything touched" step should exist at all**, given
  the primary is disabled while the step is invalid. Kept because the brief states the rule;
  it is inert on the happy path.
- **The email rule is a shape check**, not a deliverability check — the brief says "a valid
  email address" and supplies one message. If the product wants stricter validation it needs a
  second message.
- **`contract.planned` reports through §11, not §12** (see §8 item 6), so `class-audit` shows
  `PLANNED: 0`. The use is real and recorded; the audit simply has no column to read.
