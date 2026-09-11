# Brief — business formation documents

> **This brief is a deliberate negative fixture.** It asks for a document-upload
> step, which the Short App methodology does not compose: §2 lists eight
> archetypes and none of them is a file upload, and the surface's stop triggers
> name "a file upload" explicitly. It also asks for an upload-progress state,
> which §13 leaves open. It exists so the pipeline's BLOCKED path and the
> clarification format can be exercised on a realistic brief rather than a
> malformed one. Every required heading below is genuinely filled in — the only
> thing wrong with it is that the surface cannot build it.
>
> Expected result: `BRIEF: BLOCKED` with questions grouped under at least
> `archetype-not-in-§2` and `§13-open-item`. If it ever passes intake, that is
> a pipeline regression, not progress.

## Flow
business

## Step position
STEP 9 OF 10 · BUSINESS DOCUMENTS

## User
An authorised representative opening a business account, who has already given
us the company's details and ownership structure.

## Job to be done
Provide the formation documents that prove the business exists and is who it
says it is, so underwriting can verify the application.

## Data displayed
| item | source |
| Legal business name | collected on Step 4 · Business Details |
| EIN | collected on Step 4 · Business Details |

Both are shown read-only so the applicant can confirm they are uploading
documents for the right entity.

## Entry point
Step 8 (Account authority), after signers have been designated.

## Data collected
| field | type | required | format / placeholder | options source |
| Articles of incorporation | file upload | required | PDF, JPG or PNG; max 10 MB; one file | n/a |
| EIN confirmation letter | file upload | required | PDF, JPG or PNG; max 10 MB; one file | n/a |
| Operating agreement | file upload | optional | PDF only; max 10 MB; one file | n/a |
| Document attestation | checkbox | required | n/a | n/a |

## Actions & consequences
| control | verb | result | destination |
| Back | BACK | keeps uploaded files, no validation runs | Step 8 · Account authority |
| Remove | REMOVE | discards that uploaded file, returns the slot to empty | stays on step |
| Continue | CONTINUE | validates, stores the documents against the application | Step 10 · Review |

## States
| state | trigger | what shows |
| empty | first arrival | three upload slots, none populated, attestation unchecked |
| uploading | a file transfer is in progress | that slot shows upload progress until the transfer completes |
| uploaded | transfer succeeded | that slot shows the file name and a Remove control |
| error | a file fails type or size validation | that slot shows its error message and stays empty |
| disabled | either required document missing, or attestation unchecked | Continue is not actionable |
| enabled | both required documents uploaded and attestation checked | Continue is actionable |

## Conditional logic
None. All three upload slots and the attestation are always visible. The
Operating agreement slot is optional but never hidden.

## Validation rules
| field | rule | message shown | when it fires |
| Articles of incorporation | a file is present | "Upload your articles of incorporation." | on Continue |
| Articles of incorporation | type is PDF, JPG or PNG | "Upload a PDF, JPG or PNG." | on file selection |
| Articles of incorporation | size is 10 MB or less | "That file is over 10 MB. Upload a smaller file." | on file selection |
| EIN confirmation letter | a file is present | "Upload your EIN confirmation letter." | on Continue |
| EIN confirmation letter | type is PDF, JPG or PNG | "Upload a PDF, JPG or PNG." | on file selection |
| EIN confirmation letter | size is 10 MB or less | "That file is over 10 MB. Upload a smaller file." | on file selection |
| Operating agreement | type is PDF | "Upload a PDF." | on file selection |
| Operating agreement | size is 10 MB or less | "That file is over 10 MB. Upload a smaller file." | on file selection |
| Document attestation | checked | "Confirm the documents are accurate before continuing." | on Continue |

## Copy supplied
| id | role | text |
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

Roles not supplied or not applicable:
- placeholders — not applicable; upload slots take no typed input
- sub-section labels — not supplied

## Compliance / business constraints
The attestation copy (c17) is supplied verbatim by Legal and must not be
reworded or redrafted. Uploaded documents are retained per the existing
document-retention policy; no retention copy appears on this step.

## Out of scope
- Document verification or OCR — underwriting handles that after submission.
- Re-upload after a reviewer rejects a document (that is the applicant portal).
- Any camera or mobile-capture flow.
