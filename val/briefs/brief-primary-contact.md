# Brief — business primary contact

## Flow
business

## Step position
STEP 3 OF 10 · PRIMARY CONTACT

## User
An authorised representative opening a business account on behalf of their company.

## Job to be done
Give us the name and reachable contact details of the one person we should
correspond with about this application.

## Entry point
Step 2 (Products), after the applicant has selected the products they want.

## Data displayed
None. This step displays no pre-existing data; every value on it is collected here.

## Data collected
| field | type | required | format / placeholder | options source |
| First name | text | required | placeholder "Jane" | n/a |
| Last name | text | required | placeholder "Doe" | n/a |
| Job title | text | required | placeholder "Chief Financial Officer" | n/a |
| Email address | email | required | placeholder "jane@company.com" | n/a |
| Mobile phone | tel | required | 10 digits, placeholder "(555) 555-5555" | n/a |

All five fields are required. There are no optional fields on this step and no
fields inside any conditional block.

## Actions & consequences
| control | verb | result | destination |
| Back | BACK | keeps every entered value, no validation runs | Step 2 · Products |
| Continue | CONTINUE | validates all five fields, saves the contact | Step 4 · Business Details |

## States
| state | trigger | what shows |
| empty | first arrival at the step | all five fields blank, Continue not yet actionable |
| disabled | any required field empty or invalid | Continue is not actionable |
| enabled | all five fields present and valid | Continue is actionable |
| error | a field fails its rule (see Validation rules) | that field shows its error message |

No loading state is specified for this step.

## Conditional logic
None. Every field is always visible and always required; nothing on this step
reveals or hides anything.

## Validation rules
| field | rule | message shown | when it fires |
| First name | not empty | "Enter the contact's first name." | on blur, and on Continue |
| Last name | not empty | "Enter the contact's last name." | on blur, and on Continue |
| Job title | not empty | "Enter the contact's job title." | on blur, and on Continue |
| Email address | not empty and a valid email address | "Enter a valid email address." | on blur, and on Continue |
| Mobile phone | exactly 10 digits after formatting characters are ignored | "Enter a 10-digit mobile number." | on blur, and on Continue |

## Copy supplied
| id | role | text |
| c01 | title | Who should we contact? |
| c02 | description | We'll use these details for anything we need to ask you about this application. |
| c03 | field label | First name |
| c04 | field label | Last name |
| c05 | field label | Job title |
| c06 | field label | Email address |
| c07 | field label | Mobile phone |
| c08 | placeholder | Jane |
| c09 | placeholder | Doe |
| c10 | placeholder | Chief Financial Officer |
| c11 | placeholder | jane@company.com |
| c12 | placeholder | (555) 555-5555 |
| c13 | button label | BACK |
| c14 | button label | CONTINUE |
| c15 | error message | Enter the contact's first name. |
| c16 | error message | Enter the contact's last name. |
| c17 | error message | Enter the contact's job title. |
| c18 | error message | Enter a valid email address. |
| c19 | error message | Enter a 10-digit mobile number. |

Roles not supplied or not applicable:
- help text — **not supplied**
- sub-section labels — not applicable; this step covers a single topic
- empty-state text — not applicable; the step has no list or roster
- legal / consent copy — **not applicable; this step collects no consent and
  presents no legal text.** Nothing legal is to be drafted for it.

## Compliance / business constraints
None specific to this step. The contact captured here is correspondence-only and
carries no signing or control authority — that is designated later in the flow.

## Out of scope
- Additional or secondary contacts (Step 7 · Ownership).
- Account authority and signer designation (Step 8 · Account authority).
- Verifying the contact's identity or running any check against them.
- Any mobile-specific layout decision not already fixed by the methodology.
