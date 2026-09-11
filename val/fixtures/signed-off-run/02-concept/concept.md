# Concept — primary-contact v2

Surface `short-app` · methodology `design-methodology/short-app.md` · library
`@valiify/shortapp-ui` · concept `02-concept/concept.v2.html`
(v1 `02-concept/concept.v1.html` retained; fixes recorded in
`02-concept/fix-ledger.md` against `03-critique-1.md`)

## 1. Archetype

**§2 row 3 — Form.** Content block: "labelled `.text-field` / `.dropdown-field`
/ `.radio-field`s (73 pitch) `gap-5` (20), optional uppercase sub-section label,
optional conditional reveal, optional disclaimer checkbox row". Commit: "Back +
Continue".

Why this row and no other: the step collects five labelled free-text values on
one topic (the contact person) and commits with Back + Continue. It is not
Choice (no `.select-card` list, no card-tap advance), not Checklist (nothing
multi-select), not Roster (no owner rows, no matrix, no progress bar), not
Informational confirm / Review / Agreement / Offer selection (nothing is
displayed for confirmation — the brief's Data displayed is "none"). All five
optional parts of the Form content block are absent by the brief: one topic so
no sub-section label, no conditional logic so no reveal, no consent so no
disclaimer row, and the help text is omitted by the requester's decision
(answers-1.md Q2).

## 2. Step position + eyebrow text

`STEP 3 OF 10 / PRIMARY CONTACT` as rendered — business flow, step 3, section
PRIMARY CONTACT (brief § Step position; corroborated by §2's reference sequence
"1 Membership → 2 Products → 3 Primary Contact → 4 Business Details → …").

Rendered per §3 / §10: one `type-eyebrow` row, the step run in
`text-content-tertiary`, the section name in `text-primary-text`. **Typed in
sentence case in the concept (`Step 3 of 10 / Primary contact`); the caps are
`type-eyebrow`'s transform, never typed casing** (§0, §8 — the same rule that
governs c13 / c14; recorded in Unsure). The eyebrow is the only position
indicator on the step — no bar, no dots, no stepper, and nothing in the header
(§3, §9.2).

## 3. Mobile behaviour (§1.2)

- Same `.header` component at 375; its `.header-mobile` wrapper swaps the
  language label to `EN` below `md` (768) — the only breakpoint used.
- **Shell vs column (two elements, not one bag):** b02 is the canvas and
  carries only `bg-surface-app-page`; b13 is the 375-wide body column and
  carries `p-4 flex flex-col gap-4`. The 343 column is the *result* of `p-4`
  on 375, so no `w-[343px]` is written anywhere.
- **What stacks:** the First name / Last name row (b05). §1.2 names that exact
  pair — "Any row of two or three standalone fields (First name / Last name;
  Phone / ZIP / SSN last 4) becomes one field per row at the standard `gap-5`
  (20) field pitch". The wrapper (b05) carries the direction and gap only; the
  268 width lives on the two fields as `md:w-67`, so below `md` they are simply
  full-column. Job title, Email address and Mobile phone are already one per
  row and keep their web composition inside 343.
- **What stays multi-up:** nothing. §1.2's three-up exception is the joined
  City / State / ZIP row of the address composite, which this step does not
  have.
- **Sticky footer:** the web button row (b11) leaves the flow and becomes the
  76px sticky action bar (b12) — `h-19 py-3.5 px-4`, `gap-5` between Back (99,
  hug) and Continue (`flex-1`), paper fill, top hairline, `sticky bottom-0`,
  `z-40` (the sticky-chrome tier). Interim §11 recipe; the component is a §12
  planned addition. **No bottom offset is written on b13** — see Unsure.
- Title stays `text-display` 28/34; the block collapses as the description
  wraps.

## Hierarchy rationale (§3)

- Three levels in the title block, always the same three: eyebrow
  (`type-eyebrow`, 11/16) → title (`text-display`, 28/34, the largest thing on
  the step) → description (`text-input`, 16/24 in `text-content-secondary`), at
  `gap-2`. Nothing on this step is larger than 28.
- The description states the *why* in one sentence — the brief's supplied c02
  ("We'll use these details for anything we need to ask you about this
  application.") already satisfies §3/§8, so it is used verbatim.
- Grouping inside content is by label, not by card (§3): five `.text-field`s in
  a plain `gap-5` stack on the canvas. No bordered container is introduced —
  bordered surfaces are reserved for tappable cards, inputs and the
  roster/review containers, and the inputs carry their own 1px stroke.
- No hairline and no sub-section label: §3 grouping devices apply when a form
  has more than one group; the brief states one topic.
- Above the fold on web: header, eyebrow, title, description and the first
  field. The button row is in flow after the content by 40 (§1.1) and is not
  required above the fold.

## Mapping table

| block | region | pattern | §10 class or §11 recipe | content | states |
| --- | --- | --- | --- | --- | --- |
| b01 | header | Header bar with centred logo + language selector | §10 `.header` › `.header-logo`, `.header-desktop` / `.header-mobile` › `.text-selector` (`-icon`, `-label`, `-chevron`); sticky `z-40` | Logo, c21 selector label "English" / "EN" (`aria-haspopup="listbox"`, `aria-expanded`) | rest |
| b02 | shell | Page canvas (fill) | §11 Page shell, first half — canvas `bg-surface-app-page` **on the page element**, so the ground either side of the column is painted (§9.2 never pure white) | The full-bleed ground, both viewports | rest |
| b13 | shell | Page body column | §11 Page shell, second half — web `w-140 mx-auto py-12 flex flex-col gap-10`; mobile `p-4 flex flex-col gap-4` (§1.2; 343 is the result of `p-4` on 375, not a declared width) | The 560 column (343 content column on mobile) holding title block · content · button row | rest |
| b03 | title-block | Title block | §11 Title block — `type-eyebrow` row (`text-content-tertiary` run + `text-primary-text` section) › `text-display text-content-primary` › `text-input text-content-secondary`, `gap-2` | c20 eyebrow, c01 title, c02 description | rest |
| b04 | content | Form field stack | §4 form field stack — `flex flex-col gap-5` (20 between fields, 73 pitch per field) | The five fields; no sub-section label, no reveal, no disclaimer, no help text | rest |
| b05 | field-group | Two-up field row (wrapper only) | §11 Two-up fields — the row is `flex gap-6` (mobile main: `flex flex-col gap-5 md:flex-row md:gap-6`); **the `w-67` widths are on b06 / b07, each** (268 + 24 + 268 = 560) | First name + Last name | rest |
| b06 | field-group | Text input with label | §10 `.text-field` › `.text-field-title-row` › `.text-field-title`; `.text-field-box` › `.text-field-input`; `.text-field-hint`; `focus-ring` — plus §11's `w-67` (mobile main `md:w-67`) | c03 label, c08 placeholder, c15 error; text, required | empty · error |
| b07 | field-group | Text input with label | same as b06, including `w-67` / `md:w-67` | c04 label, c09 placeholder, c16 error; text, required | empty · error |
| b08 | field-group | Text input with label | same as b06, no width class (full column) | c05 label, c10 placeholder, c17 error; text, required | empty · error |
| b09 | field-group | Text input with label | same as b08 | c06 label, c11 placeholder, c18 error; `type="email"`, required | empty · error |
| b10 | field-group | Text input with format placeholder | same as b08 (§5 "formatted placeholder for anything with a shape") | c07 label, c12 format placeholder `(555) 555-5555`, c19 error; `type="tel"`, 10 digits, required | empty · error |
| b11 | button-row | Step button row (web, in flow) | §11 Button row (web) — `flex gap-6`; `.btn btn-secondary` (+ `#arrow-left`) · `.btn btn-primary flex-1` (+ `#arrow-right`) | c13 Back (99, hug), c14 Continue (437) | disabled · enabled |
| b12 | mobile-footer | Mobile sticky action bar | §11 Mobile footer (interim, until the §12 component lands) — `h-19 py-3.5 px-4 flex gap-5 bg-surface-paper border-t border-stroke-divider sticky bottom-0 z-40`; `.btn btn-secondary` 99 + `.btn btn-primary flex-1` | c13 Back, c14 Continue | disabled · enabled |

States, per §6 and the brief's States section:

- **empty** (first arrival) — fields show their placeholders in
  `text-content-hint` via the native `::placeholder`; §6 "Empty is the default;
  there is no separate empty state", so no empty-state block exists.
- **error** — the field's `.text-field-input` carries `aria-invalid="true"`;
  the library's own CSS turns `.text-field-box` amber (`border-warning`) and
  the `.text-field-hint` under it `text-warning-text` (§6, §10). Amber is the
  correct error display on this surface; the error ramp stays unused. No error
  class is written in markup — the attribute drives it (skill §10.2).
- **disabled / enabled** — the primary is `.btn-primary:disabled`
  (`bg-primary-disabled`, brand at 30%, white ink kept) until all five fields
  are present and valid (§5, §6, §9.2 "never a gray disabled primary"). Back is
  never disabled — no frame disables it and the brief does not ask.
- **No loading state is drawn anywhere.** The save is immediate and synchronous
  and Continue does not change (brief · answers-1.md Q1), so §13's open
  "Loading state" item is not touched and no `.skeleton` composition enters
  this concept.

## Copy table

| id | role | text | source | §8 rule |
| --- | --- | --- | --- | --- |
| c20 | eyebrow | Step 3 of 10 / Primary contact (renders STEP 3 OF 10 / PRIMARY CONTACT) | brief (§ Step position) | §3/§7 position is the eyebrow only; typed sentence case, `type-eyebrow` supplies the caps (§0, §8) |
| c01 | title | Who should we contact? | brief | §8 titles are questions in sentence case, no trailing period |
| c02 | description | We'll use these details for anything we need to ask you about this application. | brief | §8/§3 description states the why, one sentence, second person |
| c03 | field label (First name) | First name | brief | §8 labels are a short noun in sentence case |
| c04 | field label (Last name) | Last name | brief | §8 same |
| c05 | field label (Job title) | Job title | brief | §8 same |
| c06 | field label (Email address) | Email address | brief | §8 same |
| c07 | field label (Mobile phone) | Mobile phone | brief | §8 same |
| c08 | placeholder (First name) | Jane | brief | §8 labels/placeholders — a placeholder is not a repeat of the label (sample value; the format rule does not apply to an unshaped name field) |
| c09 | placeholder (Last name) | Doe | brief | §8 same |
| c10 | placeholder (Job title) | Chief Financial Officer | brief | §8 same |
| c11 | placeholder (Email address) | jane@company.com | brief | §8 same — a sample address, not a repeat of the label |
| c12 | placeholder (Mobile phone) | (555) 555-5555 | brief | §5/§8 every shaped field carries a format placeholder (the one shaped field on this step) |
| c13 | button label (secondary) | Back | brief (typed sentence case — see Unsure) | §8 step buttons are single verbs typed in sentence case; `type-button-label` supplies the caps |
| c14 | button label (primary) | Continue | brief (typed sentence case — see Unsure) | §8 same; §9.2 never `NEXT` |
| c15 | error message (First name) | Enter the contact's first name. | brief | §8 second person, states what to do |
| c16 | error message (Last name) | Enter the contact's last name. | brief | §8 same |
| c17 | error message (Job title) | Enter the contact's job title. | brief | §8 same |
| c18 | error message (Email address) | Enter a valid email address. | brief | §8 same |
| c19 | error message (Mobile phone) | Enter a 10-digit mobile number. | brief | §8 same |
| c21 | header language label | English (web) / EN (mobile, below `md`) | **methodology** — §1.1 writes "English", §1.2 the `EN` swap | §8 natural case, no transform on `.text-selector-label`; methodology-sourced, not drafted and not the build's to invent |

**DRAFT copy: none.** Every string on the step is supplied by the brief, except
c21, which is supplied by the methodology (§1.1 / §1.2). Help text is omitted
by the requester's decision (answers-1.md Q2) and nothing is drafted for it;
the step carries no legal or consent text (brief).

## Planned values used

| block | value | class | §12 row |
| --- | --- | --- | --- |
| b12 | mobile sticky action bar (76 tall, paper, top hairline, pinned below `md`) | `h-19 py-3.5 px-4 flex gap-5 bg-surface-paper border-t border-stroke-divider sticky bottom-0 z-40` — the §11 "Mobile footer (interim, until the §12 component lands)" recipe, verbatim | §12 "Mobile sticky action bar" — new component, name to be chosen at scaffold time |

No `[raw — planned, §12]` or `[planned variant, §12]` token value appears on
this step. The methodology's §12 table carries no interim-class column of its
own; §12's own instruction is "Until they ship, pages use the interim recipes
in §11", so the §11 recipe above is the one sanctioned spelling. The §12
TextField optional slot is not used — every field here is required and §8 says
required fields are unmarked.

## Responsive behaviour

See **section 3, Mobile behaviour (§1.2)** above — the surface's own concept
section, which carries the full responsive account (header label swap, canvas
vs column, what stacks, what stays, the sticky footer, the single `md`
breakpoint). Nothing responsive is specified outside it.

## Open questions

**None blocking.** No blocking question is open; the two Gate-1 questions
(loading state, help text) were closed by `00-input/answers-1.md` and are
recorded in the brief. No stop trigger fired:

- `archetype-not-in-§2` — no; §2 row 3 (Form) fits exactly.
- `no-component` — no; every block has a §10 class or a §11 recipe (mapping
  table above).
- `brief-missing-field` — no; the brief carries every ★ heading and declares
  legal/consent not applicable, so nothing legal is drafted.
- `§13-open-item` — no; the one §13 item this step could touch (loading state)
  is closed on the record as "no loading state", and the step has no
  conditional reveal, no progress bar, no roles matrix and no owner row. The
  mobile footer offset (Unsure, below) is an unspecified value, not a §13 row —
  it is recorded, not inferred.
- `§9-forbidden` — no; one primary, `CONTINUE` (never `NEXT`), Back as a button
  left of the primary and never in the header, no progress bar, no rail/tab
  strip, no asterisk for required, no overlay, no confirmation page, no second
  typeface, disabled primary is the brand at 30% and never gray, and the canvas
  fill is on the page (b02) so nothing renders on pure white.

## Methodology rules applied

- **§2 row 3 (Form)** — five labelled fields on one topic, Back + Continue
  commit; all optional parts of the content block absent per the brief.
- **§2 "one topic per screen"** — five fields, under the ~7 limit, so no
  sub-section label or page break.
- **§1.1 web shell** — canvas `bg-surface-app-page` (b02) with a separate
  centred 560 body column (b13), sticky 60 `.header`, rhythm 48 / 40 / 40 / 48
  (`py-12`, `gap-10`).
- **§1.1 button row** — in flow (not sticky) on web; Back hug 99 + `gap-6` +
  primary `flex-1`.
- **§1.2 mobile shell** — 375, `p-4` → a 343 content column, `gap-4`, 76 sticky
  footer, Tailwind's native `md` (768) as the only breakpoint; multi-up fields
  stack.
- **§3 title block** — the same three levels, `gap-2`, eyebrow carries position
  and the header carries none.
- **§3 grouping is by label, not by card** — no bordered container around the
  fields.
- **§4 field pitch** — `.text-field` 73 pitch, stack `gap-5`; touch targets 48
  (`.text-field-box`, `.btn`).
- **§4 / §11 two-up fields** — the row is `flex gap-6`; `w-67` is on **each
  field**, per the §11 recipe's wording.
- **§5 text for free entry, formatted placeholder for anything with a shape** —
  all five are `.text-field`; the phone carries the format placeholder. No
  `.dropdown-field` (no enumeration), no `.radio-field` (no binary question),
  no `.switch` (nothing to reveal).
- **§5 two button tiers** — step tier only: `.btn btn-secondary` +
  `.btn btn-primary`; no `.utility-button` (no inline card form on this step).
- **§5 / §6 primary disabled until the step is valid**; §6 disabled = brand at
  30% with white ink.
- **§6 empty is the default** — placeholders in `text-content-hint`, no
  separate empty state.
- **§6 validation** — `aria-invalid="true"` drives the amber field display and
  the amber hint; the warning ramp is the intended binding.
- **§7 forward verb `CONTINUE`, back is a button left of the primary** on every
  step after the first; language switch available in the header on every step
  (c21).
- **§8 copy** — supplied copy used verbatim; casing is a transform everywhere
  (eyebrow via `type-eyebrow`, buttons via `type-button-label`); required
  fields unmarked (no asterisk, no `Optional` marker).
- **§9.2 / §9.3 walked** — no forbidden pattern present, no dashboard token or
  pattern leaked in (crimson brand, warm canvas, Inter only, 48 controls, no
  mono, no rail, no table); the canvas fill is on the page element.
- **§10** — every shipped component used is mapped from the component map;
  nothing from §10's "shipped but unused" list (`.avatar`, `.btn-bubble`,
  `.tab-portal`, `.text-area`, `.box-action-switch`, `.toast`,
  `.status-tracker`, `.action`, `.utility-button-rounded` / `-text`,
  `.icon-button-subtle`) appears.
- **§11** — page shell (canvas + body column), title block, web button row,
  two-up fields and the interim mobile footer are the only non-component
  compositions, each used verbatim.
- **§12** — the mobile action bar is a planned component; the §11 interim
  recipe is used and recorded above for the handoff.
- **§13** — untouched; nothing is inferred from it.

## Unsure

- **Two-up First name / Last name (b05) — one reversible block.** The brief
  specifies no layout for the five fields. §1.2 names "First name / Last name"
  as a standalone two-up row that stacks on mobile, and §4 / §11 give the exact
  composition (`flex gap-6` at row level, `w-67` each), so the pair is composed
  two-up on web. **No §-row evidences the two-up on the Primary Contact frame
  172:10673** (§4's two-up evidence cites 258:13116 and Additional_Details) —
  the reviewer settles it against that frame. If it in fact stacks, this is the
  one block to change: delete the b05 wrapper, with no class change inside
  b06 / b07 other than dropping the `w-67` / `md:w-67`. (Critique F7 —
  sustained as written, no change required.)
- **Mobile content offset under the sticky footer.** Nothing offsets b13's
  content from under b12's 76px bar, so the last field can sit behind it. §1.2
  specifies the footer but no bottom offset and §13 lists no such item, so **no
  value may be inferred and none is written**. Recorded as an unspecified value
  the build will hit; if the build needs a padding it is a new question, not a
  default. (Critique F8 — record-only.)
- **Eyebrow casing.** Typed sentence case (`Step 3 of 10 / Primary contact`)
  with `type-eyebrow` supplying the caps — chosen for one casing convention
  across the file, matching c13 / c14 and §0 / §8 ("casing is a transform"),
  and matching the library's own resolved reading of Eyebrow (typed mixed case,
  styled caps — Avatar / Badge evidence in CLAUDE.md). Skill §7's contract
  example types the eyebrow in caps, so the rendered result is identical either
  way; the choice is recorded here so the build does not flip it. (Critique F5.)
- **Button-label casing.** The brief types c13 / c14 as "BACK" / "CONTINUE";
  carried here as "Back" / "Continue" with `type-button-label` supplying the
  caps, per §8 and skill §10.10. Rendered result is identical.
- **Class-bag notation.** The file's convention: **each `<main>` declares the
  bag resolved for its own viewport** (b02, b13, b11 / b12 all follow it). The
  only `md:` prefixes in the file are on b05 / b06 / b07 in the mobile main,
  where they record §1.2's stacking branch — the single genuinely responsive
  rule on this step — and where the critique's F1 fix prescribes them
  verbatim. Stated here so the notation is a declared choice, not drift.
  (Critique F2.)
- **Header language label (c21).** Methodology-sourced sample copy (§1.1
  "English", §1.2 "EN"), now tracked in the copy table; the build must not
  invent a different label or a longer locale list. (Critique F6.)
- **Eyebrow separator.** §3 / §10 write the eyebrow as `STEP n OF m / SECTION`
  (slash); the brief's Step position writes it with a middot. The methodology's
  spelling is used, since §8's middot rule is for inline metadata, not the
  eyebrow.
- **Help text block omitted.** Not drafted, not composed — the requester's
  decision (answers-1.md Q2). §11's instruction-callout recipe therefore does
  not appear, and the `instruction` region is unused on this step.
- **Field help `?` icons omitted.** `.text-field-help` + `.tooltip` exists in
  §10, but the brief asks for no help affordance; per §4c nothing the brief did
  not ask for is added. The component is used whole minus that optional part
  (skill §4d).
- **`focus-ring` listed on every interactive block.** §10 "Keyboard focus —
  `focus-ring` utility on every interactive element"; the library applies it
  inside the components' own CSS, so the build may not need to write the class
  — it is declared so the critic can see the state was considered.
- **Mobile `.owner-container` pin (§13) and the conditional-reveal indent
  (§13)** — not reached by this step; no owner rows, no reveal.
- **`aria-invalid` wiring and `aria-describedby` for the hints** is behaviour,
  not style; specified in the block labels so the build carries it (CLAUDE.md
  TextField example).
