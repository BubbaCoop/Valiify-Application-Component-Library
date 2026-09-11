# Brief — business-documents

## Surface short-app · methodology design-methodology/short-app.md

## Flow

`business`

## Step position

STEP 9 OF 10 · BUSINESS DOCUMENTS

> Recorded verbatim from the brief. §2 names the business flow's reference
> sequence with step 9 as *Additional business details* and step 10 as
> *Review*; the brief puts BUSINESS DOCUMENTS at 9 and Review at 10. See
> Unsure.

## User

An authorised representative opening a business account, who has already given
us the company's details and ownership structure.

## Job to be done

Provide the formation documents that prove the business exists and is who it
says it is, so underwriting can verify the application.

## Entry point

Step 8 (Account authority), after signers have been designated.

## Data displayed

| item | source |
| --- | --- |
| Legal business name | collected on Step 4 · Business Details |
| EIN | collected on Step 4 · Business Details |

Both are shown read-only so the applicant can confirm they are uploading
documents for the right entity.

## Data collected

| field | type | required | format / placeholder | options source |
| --- | --- | --- | --- | --- |
| Articles of incorporation | file upload | required | PDF, JPG or PNG; max 10 MB; one file | n/a |
| EIN confirmation letter | file upload | required | PDF, JPG or PNG; max 10 MB; one file | n/a |
| Operating agreement | file upload | optional | PDF only; max 10 MB; one file | n/a |
| Document attestation | checkbox | required | n/a | n/a |

Required-ness is stated for every field. No field sits inside a conditional
block (see Conditional logic).

## Actions & consequences

| control | verb | result | destination |
| --- | --- | --- | --- |
| Back | BACK | keeps uploaded files, no validation runs | Step 8 · Account authority |
| Remove | REMOVE | discards that uploaded file, returns the slot to empty | stays on step |
| Continue | CONTINUE | validates, stores the documents against the application | Step 10 · Review |

## States

| state | trigger | what shows |
| --- | --- | --- |
| empty | first arrival | three upload slots, none populated, attestation unchecked |
| uploading | a file transfer is in progress | that slot shows upload progress until the transfer completes |
| uploaded | transfer succeeded | that slot shows the file name and a Remove control |
| error | a file fails type or size validation | that slot shows its error message and stays empty |
| disabled | either required document missing, or attestation unchecked | Continue is not actionable |
| enabled | both required documents uploaded and attestation checked | Continue is actionable |

## Conditional logic

None stated. Per the brief: "All three upload slots and the attestation are
always visible. The Operating agreement slot is optional but never hidden."
No trigger, boundary rule or reveal exists on this step.

## Validation rules

| field | rule | message shown | when it fires |
| --- | --- | --- | --- |
| Articles of incorporation | a file is present | "Upload your articles of incorporation." | on Continue |
| Articles of incorporation | type is PDF, JPG or PNG | "Upload a PDF, JPG or PNG." | on file selection |
| Articles of incorporation | size is 10 MB or less | "That file is over 10 MB. Upload a smaller file." | on file selection |
| EIN confirmation letter | a file is present | "Upload your EIN confirmation letter." | on Continue |
| EIN confirmation letter | type is PDF, JPG or PNG | "Upload a PDF, JPG or PNG." | on file selection |
| EIN confirmation letter | size is 10 MB or less | "That file is over 10 MB. Upload a smaller file." | on file selection |
| Operating agreement | type is PDF | "Upload a PDF." | on file selection |
| Operating agreement | size is 10 MB or less | "That file is over 10 MB. Upload a smaller file." | on file selection |
| Document attestation | checked | "Confirm the documents are accurate before continuing." | on Continue |

Every rule carries its message; no copy gap in this table.

## Copy supplied

| id | role | text |
| --- | --- | --- |
| c01 | title | Upload your business documents |
| c02 | description | We use these to verify your business before opening the account. |
| c03 | field label | Articles of incorporation |
| c04 | field label | EIN confirmation letter |
| c05 | field label | Operating agreement |
| c06 | help text | PDF, JPG or PNG. Up to 10 MB. |
| c07 | help text | PDF only. Up to 10 MB. Optional. |
| c08 | button label | BACK |
| c09 | button label | CONTINUE |
| c10 | button label | REMOVE |
| c11 | error message | Upload your articles of incorporation. |
| c12 | error message | Upload your EIN confirmation letter. |
| c13 | error message | Upload a PDF, JPG or PNG. |
| c14 | error message | Upload a PDF. |
| c15 | error message | That file is over 10 MB. Upload a smaller file. |
| c16 | error message | Confirm the documents are accurate before continuing. |
| c17 | legal / consent | I confirm these documents are true and accurate copies of the originals, and that I am authorised to provide them on behalf of this business. |
| c18 | empty-state text | No file uploaded yet. |

Role-by-role status (every role stated explicitly):

| role | status |
| --- | --- |
| title | supplied — c01 |
| description | supplied — c02 |
| field labels | supplied — c03, c04, c05 (the attestation row's label is c17) |
| placeholders (per shaped field) | **not applicable** — brief: "placeholders — not applicable; upload slots take no typed input"; no shaped typed field exists on this step |
| sub-section labels | **not supplied** — brief states so; no sub-section grouping is described, so no label is required |
| help text | supplied — c06, c07 |
| button labels | supplied — c08, c09, c10 |
| error messages | supplied — c11–c16 (one per validation rule) |
| empty-state text | supplied — c18 |
| legal / consent | supplied — c17, verbatim from Legal |

## Compliance / business constraints

- "The attestation copy (c17) is supplied verbatim by Legal and must not be
  reworded or redrafted."
- "Uploaded documents are retained per the existing document-retention policy;
  no retention copy appears on this step."

## Out of scope

- Document verification or OCR — underwriting handles that after submission.
- Re-upload after a reviewer rejects a document (that is the applicant portal).
- Any camera or mobile-capture flow.

---

## Source map

| brief sentence (quoted) | rows it supports |
| --- | --- |
| "## Flow / business" | Flow |
| "STEP 9 OF 10 · BUSINESS DOCUMENTS" | Step position; eyebrow copy |
| "An authorised representative opening a business account, who has already given us the company's details and ownership structure." | User |
| "Provide the formation documents that prove the business exists and is who it says it is, so underwriting can verify the application." | Job to be done |
| "Step 8 (Account authority), after signers have been designated." | Entry point |
| "\| Legal business name \| collected on Step 4 · Business Details \|" · "\| EIN \| collected on Step 4 · Business Details \|" | Data displayed (both rows) |
| "Both are shown read-only so the applicant can confirm they are uploading documents for the right entity." | Data displayed note |
| "\| Articles of incorporation \| file upload \| required \| PDF, JPG or PNG; max 10 MB; one file \| n/a \|" | Data collected row 1; validation rows 1–3; Q1 |
| "\| EIN confirmation letter \| file upload \| required \| PDF, JPG or PNG; max 10 MB; one file \| n/a \|" | Data collected row 2; validation rows 4–6; Q1 |
| "\| Operating agreement \| file upload \| optional \| PDF only; max 10 MB; one file \| n/a \|" | Data collected row 3; validation rows 7–8; Q1 |
| "\| Document attestation \| checkbox \| required \| n/a \| n/a \|" | Data collected row 4; validation row 9 |
| "\| Back \| BACK \| keeps uploaded files, no validation runs \| Step 8 · Account authority \|" | Actions row 1 |
| "\| Remove \| REMOVE \| discards that uploaded file, returns the slot to empty \| stays on step \|" | Actions row 2; Q1 (per-slot control) |
| "\| Continue \| CONTINUE \| validates, stores the documents against the application \| Step 10 · Review \|" | Actions row 3 |
| "\| empty \| first arrival \| three upload slots, none populated, attestation unchecked \|" | States row 1 |
| "\| uploading \| a file transfer is in progress \| that slot shows upload progress until the transfer completes \|" | States row 2; Q2 |
| "\| uploaded \| transfer succeeded \| that slot shows the file name and a Remove control \|" | States row 3; Q1 |
| "\| error \| a file fails type or size validation \| that slot shows its error message and stays empty \|" | States row 4 |
| "\| disabled \| either required document missing, or attestation unchecked \| Continue is not actionable \|" | States row 5 |
| "\| enabled \| both required documents uploaded and attestation checked \| Continue is actionable \|" | States row 6 |
| "None. All three upload slots and the attestation are always visible. The Operating agreement slot is optional but never hidden." | Conditional logic |
| The nine rows of the brief's "## Validation rules" table | Validation rules (all nine rows, verbatim) |
| The eighteen rows of the brief's "## Copy supplied" table | Copy supplied c01–c18 |
| "placeholders — not applicable; upload slots take no typed input" | Copy role status — placeholders |
| "sub-section labels — not supplied" | Copy role status — sub-section labels |
| "The attestation copy (c17) is supplied verbatim by Legal and must not be reworded or redrafted." | Compliance row 1 |
| "Uploaded documents are retained per the existing document-retention policy; no retention copy appears on this step." | Compliance row 2 |
| "Document verification or OCR — underwriting handles that after submission." · "Re-upload after a reviewer rejects a document (that is the applicant portal)." · "Any camera or mobile-capture flow." | Out of scope |

## Open questions

### BLOCKING

```
Q: This step's content block is three file-upload slots, each with its own
   empty / uploading / uploaded / error state and a per-slot Remove control
   ("| Articles of incorporation | file upload | required | PDF, JPG or PNG;
   max 10 MB; one file | n/a |"). §2 lists eight archetypes — Choice,
   Checklist, Form, Roster, Informational confirm, Review, Agreement, Offer
   selection — and none of them has a file-upload content block or a per-item
   upload slot; the surface's stop triggers name "a file upload" explicitly.
   How should this step be composed, or should document collection move off
   the Short App entirely?
TRIGGER: archetype-not-in-§2
NEEDED-FOR: the whole content block — the three upload slots, their four
   per-slot states, the Remove control, and therefore every copy id c03–c07,
   c11–c15 and c18
CHECKED: design-methodology/short-app.md §2 (the eight archetypes and their
   content blocks), §8 (copy and tone), §9 (anti-patterns), §13 (open items);
   the surface block's stop triggers in the agent brief
COST-OF-GUESSING: inventing an upload slot means inventing a component — a
   dropzone, a file row, a per-slot state ramp and a Remove affordance that
   exist in neither the library nor the methodology. That is the exact
   failure mode (invented style) this pipeline exists to prevent, and it
   would ship a pattern no Figma frame has ever validated.
ACCEPTABLE-ANSWER: a decision — e.g. "documents are collected in the
   applicant portal after submission, not in the Short App; drop this step",
   or "the designer will add an upload archetype to §2 first; hold this
   run", or a named existing §2 archetype the employee intends this step to
   be, with the upload behaviour re-specified to fit it.
```

```
Q: The `uploading` state says "that slot shows upload progress until the
   transfer completes". §13 lists **Loading state** as unspecified — "none
   drawn. `.skeleton` shapes exist; composition unconfirmed" — and also
   leaves the **progress-bar track colour** unspecified ("`#1a1a1a @8%` has
   no token … Raw composition stands until a token or component exists").
   What should an in-progress upload show?
TRIGGER: §13-open-item
NEEDED-FOR: States row 2 (`uploading`) on all three upload slots
COST-OF-GUESSING: any in-flight treatment we pick — a determinate bar, a
   skeleton row, a spinner — is an invented loading vocabulary for a surface
   that has drawn none. It would set a de-facto standard for every future
   Short App loading state without a designer decision, and a progress bar
   would additionally need an untokenized track colour.
ACCEPTABLE-ANSWER: a decision — e.g. "no in-flight state; the slot flips
   straight from empty to uploaded", or "the designer will draw the loading
   composition first; hold this run", or "out of scope — uploads are
   instantaneous from the applicant's point of view".
```

### NON-BLOCKING

None. Every copy role is either supplied verbatim (c01–c18) or explicitly
not applicable on this step; the legal/consent text (c17) is supplied by
Legal, so no copy needs drafting.

## Methodology rules applied

- §2 Archetypes — checked all eight rows against the brief's content block; no
  row carries a file-upload block, so the step is recorded, not typed. Raised
  as `archetype-not-in-§2` (Q1). No substitute archetype proposed.
- §2 business reference sequence — used to check the step position "STEP 9 OF
  10 · BUSINESS DOCUMENTS" against the documented sequence (9 = Additional
  business details, 10 = Review). Discrepancy recorded in Unsure, not
  invented away.
- §8 Copy and tone — used to confirm role coverage and casing conventions;
  all supplied copy recorded verbatim, including uppercase button labels.
- §9 Anti-patterns — swept the brief against 9.1–9.3: no progress bar or back
  control in the header, no sidebar/rail/tab strip, no `NEXT`, no asterisk
  for required, no modal for consent (the attestation is an inline row), no
  second typeface, one primary per screen. **No `§9-forbidden` collision
  found.**
- §13 Open items — the `uploading` state touches "Loading state" (and would
  touch "Progress-bar track colour"). Raised as `§13-open-item` (Q2).
- Skill §5 Copy — supplied copy recorded verbatim; legal/consent present so
  no `brief-missing-field` on c17.
- Skill §6 — every ★ heading of the surface schema is present and filled from
  the brief; no required field is missing, so no `brief-missing-field`
  question was raised.

## Unsure

- **Step position vs §2's reference sequence.** §2 names business step 9 as
  *Additional business details*; the brief names it BUSINESS DOCUMENTS with
  the same m = 10 and the same Step 10 · Review destination. Recorded the
  brief's eyebrow verbatim. If this step *replaces* step 9 the count holds;
  if it *inserts*, every downstream eyebrow shifts to "OF 11". Not raised as
  a question because the brief states both n and m explicitly and is
  internally consistent with its own entry point and destination — but the
  architect should not silently renumber.
- **The read-only entity block** (Legal business name, EIN). §2's Form row
  lists labelled fields only; label/value rows appear in the Review row. The
  brief's read-only confirmation block therefore sits between archetypes.
  Not raised here — intake does not choose compositions, and §3/§5/§10/§11
  (which I am scoped out of at this stage) may carry a recipe. If they do
  not, this is a `no-component` question for the architect.
- **"Optional" placement.** §8 says "Optional is a word, not an asterisk"
  and puts it right-aligned in the field's title row; the brief carries it
  inside help text c07 ("PDF only. Up to 10 MB. Optional."). Copy recorded
  verbatim; the duplication/placement is the architect's call.
- **`REMOVE` casing.** §8 reserves uppercase for the step buttons (`BACK`,
  `CONTINUE`, `CONFIRM`) and specifies sentence-case verb + object for
  inline buttons, and the library's casing is a styled transform (§10 of the
  skill). Copy c10 is supplied as "REMOVE" and recorded verbatim; whether it
  is typed sentence-case with a transform is a build-time decision.
- **No typos found** in the supplied copy. British "authorised" appears in
  c17 and in the User sentence; it is Legal's verbatim text and must not be
  changed.
- Both BLOCKING questions concern the same content block; answering Q1 with
  "drop the step" makes Q2 moot, but Q2 is asked now so a single round of
  answers can resolve either path.
