# Brief — primary-contact
## Surface short-app · methodology design-methodology/short-app.md

## Flow

`business`

## Step position

STEP 3 OF 10 · PRIMARY CONTACT

Corroborated by the methodology's reference sequence (§2: "1 Membership → 2
Products → 3 Primary Contact → 4 Business Details → …"), which places Primary
Contact at step 3 of 10 in the business flow.

## User

An authorised representative opening a business account on behalf of their
company.

## Job to be done

Give the institution the name and reachable contact details of the one person
it should correspond with about this application.

## Entry point

Step 2 · Products, after the applicant has selected the products they want.

## Data displayed

| item | source |
| --- | --- |
| none | Brief: "This step displays no pre-existing data; every value on it is collected here." |

## Data collected

| field | type | required | format / placeholder | options source |
| --- | --- | --- | --- | --- |
| First name | text | required | placeholder "Jane" | n/a |
| Last name | text | required | placeholder "Doe" | n/a |
| Job title | text | required | placeholder "Chief Financial Officer" | n/a |
| Email address | email | required | placeholder "jane@company.com" | n/a |
| Mobile phone | tel | required | 10 digits, placeholder "(555) 555-5555" | n/a |

Required-ness is stated for every field; the brief states there are no optional
fields and no fields inside any conditional block.

## Actions & consequences

| control | verb | result | destination |
| --- | --- | --- | --- |
| Back | BACK | keeps every entered value, no validation runs | Step 2 · Products |
| Continue | CONTINUE | validates all five fields, saves the contact — the save is immediate and synchronous; Continue stays actionable with no visual change while it happens (answers-1.md Q1) | Step 4 · Business Details |

## States

| state | trigger | what shows |
| --- | --- | --- |
| empty | first arrival at the step | all five fields blank, Continue not yet actionable |
| disabled | any required field empty or invalid | Continue is not actionable |
| enabled | all five fields present and valid | Continue is actionable |
| error | a field fails its rule (see Validation rules) | that field shows its error message |

**No loading state exists on this step.** The requester answered: "No loading
state; treat the save as immediate and synchronous. Continue stays actionable,
no visual change." (answers-1.md Q1). Nothing is drawn for an in-flight save,
and this answer sanctions no skeleton composition — §13's "Loading state — none
drawn … composition unconfirmed" stays untouched by this run.

## Conditional logic

| trigger | exact boundary rule | what reveals | required-ness of the revealed fields |
| --- | --- | --- | --- |
| none stated | — | — | — |

Brief: "Every field is always visible and always required; nothing on this step
reveals or hides anything."

## Validation rules

| field | rule | message shown | when it fires |
| --- | --- | --- | --- |
| First name | not empty | "Enter the contact's first name." | on blur, and on Continue |
| Last name | not empty | "Enter the contact's last name." | on blur, and on Continue |
| Job title | not empty | "Enter the contact's job title." | on blur, and on Continue |
| Email address | not empty and a valid email address | "Enter a valid email address." | on blur, and on Continue |
| Mobile phone | exactly 10 digits after formatting characters are ignored | "Enter a 10-digit mobile number." | on blur, and on Continue |

Every rule carries its message; no copy gap in this section.

## Copy supplied

| id | role | text |
| --- | --- | --- |
| c01 | title | Who should we contact? |
| c02 | description | We'll use these details for anything we need to ask you about this application. |
| c03 | field label | First name |
| c04 | field label | Last name |
| c05 | field label | Job title |
| c06 | field label | Email address |
| c07 | field label | Mobile phone |
| c08 | placeholder (First name) | Jane |
| c09 | placeholder (Last name) | Doe |
| c10 | placeholder (Job title) | Chief Financial Officer |
| c11 | placeholder (Email address) | jane@company.com |
| c12 | placeholder (Mobile phone) | (555) 555-5555 |
| c13 | button label (secondary) | BACK |
| c14 | button label (primary) | CONTINUE |
| c15 | error message (First name) | Enter the contact's first name. |
| c16 | error message (Last name) | Enter the contact's last name. |
| c17 | error message (Job title) | Enter the contact's job title. |
| c18 | error message (Email address) | Enter a valid email address. |
| c19 | error message (Mobile phone) | Enter a 10-digit mobile number. |
| — | eyebrow | not supplied as a copy id; determined by Step position: "STEP 3 OF 10 · PRIMARY CONTACT" |
| — | help text | **omitted by decision** — the brief supplied none and the requester accepted the default: "accept the default — omit the help text block, draft nothing." (answers-1.md Q2). The step carries no help-text block and nothing is to be drafted for it. |
| — | sub-section labels | not applicable; "this step covers a single topic" |
| — | empty-state text | not applicable; "the step has no list or roster" |
| — | legal / consent | not applicable; "this step collects no consent and presents no legal text. Nothing legal is to be drafted for it." |

Every role is accounted for explicitly. No typos observed in the supplied copy.

## Compliance / business constraints

None specific to this step. The contact captured here is correspondence-only and
carries no signing or control authority — that is designated later in the flow.

## Out of scope

- Additional or secondary contacts (Step 7 · Ownership).
- Account authority and signer designation (Step 8 · Account authority).
- Verifying the contact's identity or running any check against them.
- Any mobile-specific layout decision not already fixed by the methodology.
- Any in-flight / loading treatment for the save, and any help-text block
  (both closed by answers-1.md; see States and Copy supplied).

## Source map

| brief sentence (quoted) | rows it supports |
| --- | --- |
| "## Flow / business" | Flow |
| "STEP 3 OF 10 · PRIMARY CONTACT" | Step position; eyebrow row of Copy supplied |
| §2 of the methodology: "The business flow is the reference sequence (1 Membership → 2 Products → 3 Primary Contact → 4 Business Details …)" | Step position (corroboration) |
| "An authorised representative opening a business account on behalf of their company." | User |
| "Give us the name and reachable contact details of the one person we should correspond with about this application." | Job to be done |
| "Step 2 (Products), after the applicant has selected the products they want." | Entry point |
| "None. This step displays no pre-existing data; every value on it is collected here." | Data displayed |
| "\| First name \| text \| required \| placeholder \"Jane\" \| n/a \|" | Data collected row 1; c03; c08 |
| "\| Last name \| text \| required \| placeholder \"Doe\" \| n/a \|" | Data collected row 2; c04; c09 |
| "\| Job title \| text \| required \| placeholder \"Chief Financial Officer\" \| n/a \|" | Data collected row 3; c05; c10 |
| "\| Email address \| email \| required \| placeholder \"jane@company.com\" \| n/a \|" | Data collected row 4; c06; c11 |
| "\| Mobile phone \| tel \| required \| 10 digits, placeholder \"(555) 555-5555\" \| n/a \|" | Data collected row 5; c07; c12 |
| "All five fields are required. There are no optional fields on this step and no fields inside any conditional block." | Data collected required-ness; Conditional logic |
| "\| Back \| BACK \| keeps every entered value, no validation runs \| Step 2 · Products \|" | Actions row 1; c13 |
| "\| Continue \| CONTINUE \| validates all five fields, saves the contact \| Step 4 · Business Details \|" | Actions row 2; c14 |
| answers-1.md Q1: "No loading state; treat the save as immediate and synchronous. Continue stays actionable, no visual change." | Actions row 2 (save semantics); States — the no-loading-state paragraph; Out of scope (in-flight treatment) |
| "No loading state is specified for this step." | the gap that prompted Q1 — superseded by answers-1.md Q1 |
| "\| empty \| first arrival at the step \| all five fields blank, Continue not yet actionable \|" | States row 1 |
| "\| disabled \| any required field empty or invalid \| Continue is not actionable \|" | States row 2 |
| "\| enabled \| all five fields present and valid \| Continue is actionable \|" | States row 3 |
| "\| error \| a field fails its rule (see Validation rules) \| that field shows its error message \|" | States row 4 |
| "None. Every field is always visible and always required; nothing on this step reveals or hides anything." | Conditional logic |
| "\| First name \| not empty \| \"Enter the contact's first name.\" \| on blur, and on Continue \|" | Validation row 1; c15 |
| "\| Last name \| not empty \| \"Enter the contact's last name.\" \| on blur, and on Continue \|" | Validation row 2; c16 |
| "\| Job title \| not empty \| \"Enter the contact's job title.\" \| on blur, and on Continue \|" | Validation row 3; c17 |
| "\| Email address \| not empty and a valid email address \| \"Enter a valid email address.\" \| on blur, and on Continue \|" | Validation row 4; c18 |
| "\| Mobile phone \| exactly 10 digits after formatting characters are ignored \| \"Enter a 10-digit mobile number.\" \| on blur, and on Continue \|" | Validation row 5; c19 |
| "\| c01 \| title \| Who should we contact? \|" | Copy c01 |
| "\| c02 \| description \| We'll use these details for anything we need to ask you about this application. \|" | Copy c02 |
| "help text — **not supplied**" | the gap that prompted Q2 |
| answers-1.md Q2: "accept the default — omit the help text block, draft nothing." | Copy help-text row; Out of scope (help-text block) |
| "sub-section labels — not applicable; this step covers a single topic" | Copy sub-section row |
| "empty-state text — not applicable; the step has no list or roster" | Copy empty-state row |
| "legal / consent copy — **not applicable; this step collects no consent and presents no legal text.** Nothing legal is to be drafted for it." | Copy legal row (no `brief-missing-field` raised) |
| "None specific to this step. The contact captured here is correspondence-only and carries no signing or control authority — that is designated later in the flow." | Compliance / business constraints |
| "Additional or secondary contacts (Step 7 · Ownership)." / "Account authority and signer designation (Step 8 · Account authority)." / "Verifying the contact's identity or running any check against them." / "Any mobile-specific layout decision not already fixed by the methodology." | Out of scope |

## Open questions

None. Both questions raised at Gate 1 were answered in `00-input/answers-1.md`
and are folded into the record above:

| # | trigger | resolution | recorded in |
| --- | --- | --- | --- |
| Q1 | `§13-open-item` (loading state) | No loading state; the save is immediate and synchronous, Continue stays actionable with no visual change. No skeleton composition sanctioned. | States; Actions & consequences; Out of scope |
| Q2 | missing non-legal copy (help text) | Default accepted — omit the help-text block, draft nothing. | Copy supplied; Out of scope |

## Methodology rules applied

- §2 reference sequence — the brief's "STEP 3 OF 10 · PRIMARY CONTACT" matches
  the business flow's own step 3 of 10; recorded, not inferred.
- §2 archetype scan — the step is five labelled fields on one topic with a
  Back + Continue commit; no block in the brief (table, tile, upload, roster,
  offer, agreement) falls outside the eight archetypes, so no
  `archetype-not-in-§2` question is raised. Intake records this; choosing the
  archetype row remains stage 2's job.
- §2 archetype 3 (Form) — help text is an optional part of the content block,
  which is what made Q2 non-blocking and what sanctions omitting it outright.
- §9.2 scan — the brief asks for none of the forbidden things: forward verb is
  `CONTINUE` (never `NEXT`), no asterisk for required ("All five fields are
  required" is stated in prose, §8's "Optional is a word, not an asterisk"), no
  header progress bar or header back control, no sidebar/rail/tab strip, no
  overlay, no confirmation page, one primary only. No `§9-forbidden` question.
- §13 scan — "Loading state" was the one §13 item this step touched (Continue
  saves); raised as Q1 and closed by answers-1.md with "no loading state", so
  nothing is inferred from §13 and no `.skeleton` composition enters this run.
  Conditional-reveal indent, progress-bar track colour, roles-matrix label type
  and the `.owner-container` mobile pin are untouched: the step has no reveal,
  no progress bar, no matrix and no roster.
- §8 copy roles — every role enumerated explicitly; legal/consent is declared
  not applicable by the brief, so no `brief-missing-field` is raised for it
  (the surface block's "legal / consent copy is missing" stop does not fire
  when the brief rules the role out on the record).

## Unsure

- **Button-label casing (c13 "BACK", c14 "CONTINUE").** Recorded verbatim as
  supplied. §8 says the step verbs are "typed in sentence case; the
  `type-button-label` utility on `.btn-primary` / `.btn-secondary` supplies the
  caps", and the skill's §10.10 repeats that uppercase is styled, never typed.
  The rendered result is identical either way, so this is not raised as a
  question — but the architect should carry these as typed sentence case
  ("Back" / "Continue") with the transform supplying the caps, and note the
  deviation from the brief's literal text.
- **"enabled" as a state name.** The brief lists `enabled` alongside
  `empty` / `disabled` / `error`; the surface block's state column is
  open-ended ("empty / disabled / error / success / …"), so it is recorded as
  given rather than renamed.
- **Copy ids c08–c12 are placeholders without a stated field binding in the
  copy table** (the binding is unambiguous from the Data collected table, and
  is annotated in parentheses above). Recorded, not invented.
- No typos found in the supplied copy — checked each of c01–c19 against its
  source line.
- Q1's severity is no longer open: it was recorded BLOCKING because §13 says
  loading state is unspecified and "do not infer it" while Continue performs a
  save; the requester's answer closes it on the record rather than by
  inference.

BRIEF: OK | ARCHETYPE: business | FIELDS: 5 | ACTIONS: 2 | STATES: 4 | COPY: partial | QUESTIONS: 0/0
