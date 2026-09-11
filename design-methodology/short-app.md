# Short App surface — page composition methodology (applicant)

**Status:** v1.0 · 2026-09-10 · extracted from Figma `PA5pr1Q8KLfbjTxdAbFm0V` (Updated-Short-App) and reconciled against `@valiify/shortapp-ui`. This file holds current rules only. Decision history, frame↔library deltas, and resolved items live in `short-app-decisions.md`.
**Scope:** how steps on the applicant-facing Short App are *assembled* from library components — consumer, business, and auto-loan flows. Companion to `dashboard.md`. Not a component spec; fields, buttons, cards, controls and the header are library components and are only referenced here. Component classes named here are the library's; their full specifications, states and markup live in the library's `CLAUDE.md`.

## 0. Conventions

**Sources.** 37 Figma frames across the `Consumer`, `Business` and `Auto Loan` pages, plus 40 PNG exports used only for whole-page composition judgments. `Portal V2` is a separate document; `Credit Card` is empty. Every value is expressed in the library's vocabulary — `src/themes/valiify.css` (58 colours, 6 radii, 24 text styles, 2 effects), `src/utilities/index.css`, `src/components/*.css` (28 components) and `CLAUDE.md`. Where a frame and the library disagree, the library value is the rule and the frame is to be updated in Figma.

**Value notation.** Utility first, with token and hex in parentheses on first mention in a section — `bg-surface-app-page` (`--color-surface-app-page`: #fafaf9) — then utility alone. Components are named by class: `.select-card`, `.box-action box-action-checkbox`. Spacing has no tokens by design; Tailwind's scale is the token (4px → `1`, 8px → `2`, 16px → `4`, 48px → `12`). Off-scale whole pixels take arbitrary values (`w-[343px]`); half-pixels always do (`h-[92.5px]`). A value with no token is written raw and marked `[raw]`. This document does not invent tokens.

Type utilities (`text-display`, `text-input`, …) carry size, line-height, weight and tracking but **not** font-family or text-transform. The three uppercase styles ship as bundled utilities — `type-eyebrow`, `type-micro-label`, `type-button-label` — and are used in place of the bare `text-*`. No monospace appears on this surface.

**Rule format.** `rule` → **Evidence:** node ids / frame names → **Confidence:** high / medium / low. Open items are collected in §13.

**Screen inventory.**

| Archetype | Node | Frame name | Flow · step | PNG |
|---|---|---|---|---|
| Choice | 9:544 | Are you a member | Consumer 1/7 | Are_you_a_member |
| Choice | 9:368 | Select a product | Consumer 2/7 | Select_a_product (consumer) |
| Choice | 137:6386 | Employment status | Consumer 2/7 | Employment_status |
| Choice | 137:6730 | Own or rent | Consumer 2/7 | Own_or_rent |
| Choice | 137:7013 | Membership (How do you qualify?) | Consumer 2/7 | Membership |
| Choice | 172:10613 | Are you a member | Business 1/10 | Are_you_a_member (business) |
| Choice | 172:10626 | Select a product | Business 2/10 | Select_a_product (business) |
| Checklist | 199:12833 | High Risk Industries | Business 6/10, nothing selected | High_Risk_Industries |
| Checklist | 199:13001 | High Risk Industries 2 | Business 6/10, *None of the below* selected | High_Risk_Industries_2 |
| Form | 7:219 | Short App (Tell us about yourself) | Consumer 4/7 | Short_App |
| Form | 118:5928 | Additional Details | Consumer 4/7 | Additonal_Details |
| Form | 137:6503 | Full time (Tell us about your employment) | Consumer 4/7 | Full_time (consumer) |
| Form | 137:6813 | Residential details | Consumer 4/7 | Residential_details |
| Form | 172:10673 | Primary Contact | Business 3/10 | Primary_Contact |
| Form | 172:10811 | Business Details (Tell us about your business) | Business 4/10 | Business_Details |
| Form | 199:12008 | BSA | Business 5/10, empty | BSA |
| Form | 199:12185 | BSA Filled | Business 5/10, conditional fields revealed (1920×1505) | BSA_Filled |
| Form | 348:8058 | Business Details (Additional business details) | Business 9/10 | Business_Details-1 |
| Form | 348:8076 | Business Details mailing address | Business 9/10, mailing toggle on | Business_Details_mailing_address |
| Roster | 290:5694 | Full time (Business ownership) | Business 7/10, list | Full_time (business) |
| Roster | 258:13116 | Full time (Business ownership) | Business 7/10, new-owner form open (1920×1662) | Full_time-1 |
| Roster | 298:6344 | Full time (Account Roles) | Business 8/10, matrix | Account_role_1 |
| Roster | 298:6425 | Full time (Account Roles) | Business 8/10, add-person form open | Account_role_2 |
| Informational confirm | 137:7136 | Donate | Consumer 4/7 | Donate |
| Review | 137:7266 | Review | Consumer 4/7 | Review (consumer) |
| Review | 364:8398 | Review | Business 10/10 (1920×1324) | Business_review |
| Agreement | 137:7541 | Signature | Consumer "Agreement" | Signature |
| Offer selection | 449:10429–10473 | Loan Web 1–5 | Auto Loan, five coverage/discount states | Loan_Web_1–5 |
| Offer selection | 449:10374–10418 | Loan Mobile 1–5 | Auto Loan, same five states at 375 | Loan_Mobile_1–5 |
| Form (mobile) | 675:4131 | Tell us about yourself | Consumer 4/7 at 375, stacked fields | — |
| Roster | 676:4620 / 676:4501 | Account Roles | Business 8/10, matrix — web / mobile | Web_Account_Roles / Mobile_Account_Roles |
| Roster | 676:4758 / 676:4982 | Business ownership | Business 7/10, new-owner form open — web / mobile | Web_add_owner / Mobile_add_owner |
| Review | 688:5554 / 688:5717 | Review your application | Business 10/10 — web / mobile | Web_review / Mobile_Review |

---

## 1. Layout skeleton

One shell, one column, no rails. Everything below the header is a single 560px column; the only variation is whether a footer button row exists and where it sits.

### 1.1 Web shell (all consumer/business frames, 5 loan web)

```
┌ canvas #fafaf9 ──────────────────────────────────────────────────────────────┐
│ 60  header #fffdfb · bottom 1px hairline · logo centered · [globe] English ▾ │
│ 48  ↓                                                                         │
│      680 │◄───────────── 560 column ─────────────►│ 680                       │
│          │ STEP n OF m / SECTION   (11/16, tracked, uppercase)                │
│          │ Title (28/34)                                                       │
│          │ Description (16/24)                                                 │
│      40  ↓                                                                     │
│          │ Content — cards, fields, roster, review groups (gap 12 or 20)      │
│      40  ↓                                                                     │
│          │ [ ← BACK 99 ] 24 [ CONTINUE ──────────────── → 437 ]  (48 tall)    │
│      48  ↓ (bottom padding)                                                   │
└───────────────────────────────────────────────────────────────────────────────┘
```

- **Canvas is warm off-white `bg-surface-app-page` (`--color-surface-app-page`: #fafaf9); surfaces are `bg-surface-paper` (`--color-surface-paper`: #fffdfb).** The header, choice cards, inputs, review cards and roster cards are all `bg-surface-paper` on the `bg-surface-app-page` canvas — a two-tone warm palette, no pure white on the applicant surface. The library's own components already paint this way: `.header`, `.select-card`, `.box-action`, `.text-field-box` and `.owner-container` are all `bg-surface-paper`. **Evidence:** 9:544 frame fill, Header fill, Card fill, input fill. **Confidence:** high.
- **Header is the library's `.header` — 60 (`h-15 px-5`), bottom stroke `border-b border-stroke-divider` (`--color-stroke-divider`: #1a1a1a @11%, a real 1px border absorbed by the pinned height),** logo centered (`.header-logo`, 30 tall, absolutely centered — the crimson in the asset is the client's, untokenized), language selector right (`.text-selector`: 16px leading `#globe` `.text-selector-icon`, `text-help-caption text-content-tertiary` label — `--text-help-caption`: Inter Regular 12/14 · `--color-content-tertiary`: #6f7276 — and an 18px `.text-selector-chevron`). No back control in the header; no progress bar. `.header` is `position: sticky; top: 0; z-40` by library contract. **Evidence:** 9:544 Header; 449:10429 Header. **Confidence:** high.
- **Single 560 column, centered (x = 680 on 1920)** — `w-140 mx-auto`. Title block, content, and buttons are all exactly 560 wide; nothing spans wider and nothing sits beside the column. No component owns the column; it is page layout. **Evidence:** Title 560 @680, Content 560 @680, button row 560 @680 on every frame. **Confidence:** high.
- **Vertical rhythm is 48 / 40 / 40 / 48.** The page body is `py-12` (48 top and bottom) with `gap-10` (40) between its three children: title block → content → button row. **Evidence:** Frame 5 `V gap40 pad48/0/48/0` on all frames. **Confidence:** high.
- **Title block is 90 tall:** eyebrow row (16, `type-eyebrow` line box) → `gap-2` (8) → title (34, `text-display` line box) → `gap-2` → description (24, `text-input` line box). The 90 is emergent from the three type tokens, not pinned. Present on every step, including the loan offer. **Evidence:** Title frame `V gap8` h=90. **Confidence:** high.
- **The button row is in flow, not sticky, on web.** It follows the content by 40 and the page grows (1505, 1662, 1324 tall frames). Layout: `Back` = `.btn btn-secondary` (99×48, hug) + `gap-6` (24) + primary = `.btn btn-primary flex-1` (437×48); when there is no Back, the primary is `w-full` (560). `.btn` is `h-12 px-3.5`. **Evidence:** button frame `H gap24` 560×48 at y = content-bottom + 40; 137:7136 / 137:7266 / 137:7541 full-width primaries. **Confidence:** high (composition); scroll behavior §13.
- **Choice steps advance on card tap and carry a button row containing only `BACK`** (`.btn btn-secondary`, 99×48, left-aligned, same 40 gap). Step 1 of a flow omits the row entirely. **Evidence:** designer decision 2026-09-09. **Confidence:** high.

### 1.2 Mobile shell

- **375 wide; header 60 (`.header` — the same component; its `.header-mobile` wrapper swaps the selector label to `EN` below 768px); page container `p-4` (16 → 343 column, `w-[343px]`), `gap-4` (16); a separate 76px sticky footer** (`h-19 py-3.5 px-4`; `.btn btn-secondary` 99 + `gap-5` (20) + `.btn btn-primary flex-1`; `z-40`, the sticky-chrome tier) — a **planned library component** (§12; interim recipe §11). Title is `text-display` 28/34; the block collapses to 96 tall as the description wraps. **The breakpoint is Tailwind's native `md` (768)**, matching the header's `max-width: 767px` media query; the library defines no `--breakpoint-*` token. **Evidence:** 449:10374–10418 children `Header 375x60`, `Page Container`, `Footer 375x76`; Title Container `Mobile=yes`. **Confidence:** high.
- **This mobile shell applies to every flow.** No consumer or business step has a mobile frame; by decision they use the same 343 column / 16 padding / 76 sticky footer. **Evidence:** designer decision; 675:4131, 676:4501, 676:4982, 688:5717. **Confidence:** high.
- **Multi-up fields stack on mobile.** Any row of two or three standalone fields (First name / Last name; Phone / ZIP / SSN last 4) becomes one field per row at the standard `gap-5` (20) field pitch, including inside the roster's inline form. **Exception:** the joined City / State / ZIP row inside the address composite stays three-up; the State dropdown abbreviates to `ST` and the ZIP placeholder to `ZIP`. Everything else keeps its web composition inside the 343 column. **Evidence:** 675:4131, 676:4982 vs the same steps at 1920. **Confidence:** high.
- **The roles matrix keeps its three columns at 343.** Same card, same `PERSON / CONTROLS / SIGNER` eyebrow header, same 47px rows and *Add another owner* footer; the person column simply absorbs the width. It does not collapse to a per-person list. **Evidence:** 676:4501 vs 676:4620. **Confidence:** high.
- **Roster owner rows hug their content at 343.** The contact line (`phone · email`) wraps to two lines, long names wrap, and the row grows; percentage, badge, `EDIT` and trash keep their positions. The inline form, radio cards, Save / Cancel row and footer affordance keep their web composition. **Evidence:** 676:4982 vs 676:4758; 688:5717 owner rows. **Confidence:** high.
- **Review keeps its two-column rows at 343.** Label column stays fixed (`w-[142px]`), values wrap onto a second line; group labels, `EDIT`, add-affordance (B) and the product card's `View Details` link keep their web positions. **Evidence:** 688:5717 vs 688:5554. **Confidence:** high.

### 1.3 Loan offer variant

Same shell, but the content is built from a **legacy** remote library with its own tokens. Use these ten frames for the *UX* of offer selection — total → collapsible breakdown → collapsible coverages with switches → radio offer cards → strikethrough discount — and take no color, radius, type, or spacing values from them. The current-library equivalent of every element is in §4–§5: offer cards are `.select-card` (the `<label>` + `.radio` variant), coverage opt-ins are `.switch`, the button row is §1.1's. The library's portal components — `.status-tracker`, `.action`, `.utility-button` (Text type), `.tab tab-portal` — appear on **no** in-scope frame and are not mapped by analogy here. **Evidence:** 449:10462 Form Container; designer decision. **Confidence:** high.

---

## 2. Archetypes

Eight step types compose every screen. A step = eyebrow + title + description + one content block + (optionally) a button row.

| # | Archetype | Content block | Commit |
|---|---|---|---|
| 1 | **Choice** | 2–7 single-select `.select-card`s (76 tall) with chevrons, `gap-3` (12) | `BACK` only (omitted on step 1); card tap advances |
| 2 | **Checklist** | 6 multi-select `.box-action box-action-checkbox` rows (48 tall), first is *None of the below*, hairline under it, `gap-3` | Back + Continue (enabled once anything is checked) |
| 3 | **Form** | labelled `.text-field` / `.dropdown-field` / `.radio-field`s (73 pitch) `gap-5` (20), optional uppercase sub-section label, optional conditional reveal, optional disclaimer checkbox row | Back + Continue |
| 4 | **Roster** | progress bar + bordered card of `.owner-container` rows with inline add/edit form + *Add another owner* footer; or column-headed matrix of `.radio`s / `.checkbox-control`s | Back + Continue, preceded by a left-rule instruction |
| 5 | **Informational confirm** | one explainer card | full-width Confirm |
| 6 | **Review** | gray uppercase group labels, each with a bordered card: eyebrow, name, label/value rows (12/16); three add-affordances by scope (§5) | Back + Confirm |
| 7 | **Agreement** | 3 disclaimer rows separated by hairlines | Back + Confirm |
| 8 | **Offer selection** | total card with collapsible breakdown → collapsible coverages with `.switch`es → radio `.select-card`s | Back + Continue (disabled until an offer is chosen) |

- **One question per screen for choices; one topic per screen for forms.** No form step carries more than ~7 fields before a sub-section label or a page break; no choice step mixes card choice with free-text. **Evidence:** every consumer/business frame. **Confidence:** high.
- **The business flow is the reference sequence** (1 Membership → 2 Products → 3 Primary Contact → 4 Business Details → 5 BSA → 6 BSA high-risk → 7 Ownership → 8 Account authority → 9 Additional business details → 10 Review). The consumer flow branches, so its step numbers in the frames are placeholders; the eyebrow increments by the step's actual position in the applicant's workflow. **Evidence:** eyebrow text on all frames; designer decision. **Confidence:** high.

---

## 3. Hierarchy rules

- **Three levels in the title block, always the same three.** Eyebrow: `type-eyebrow` (`--text-eyebrow`: Inter Semi Bold 11/16, +10%, bundled UPPERCASE) — the `STEP n OF m` run in `text-content-tertiary` (`--color-content-tertiary`: #6f7276), the section name in `text-primary-text` (`--color-primary-text`: #a6192e); title `text-display text-content-primary` (`--text-display`: Inter Medium 28/34 · `--color-content-primary`: #1a1a1a); description `text-input text-content-secondary` (`--text-input`: Inter Regular 16/24 · `--color-content-secondary`: #54565b). Nothing on the surface is larger than 28 except the consumer Review applicant name (22, `text-title`). **Evidence:** Title frames on 9:544, 118:5928, 137:7266; 449:10462 Value. **Confidence:** high.
- **The eyebrow carries position; the header carries none.** "STEP 4 OF 7 / IDENTITY" is the only progress indicator — there is no bar, no dots, no stepper. (The library's `.status-tracker` is a portal component and is not used here.) **Evidence:** all frames; Header contains no progress element. **Confidence:** high.
- **Description states the *why*, in one sentence.** "Our institution needs these to verify your account." / "Required to comply with federal banking regulations." / "Pick the account to open today. You can add more later." **Evidence:** description texts. **Confidence:** high.
- **Grouping inside content is by label, not by card, until Review.** Forms use an uppercase sub-section label (`ACCOUNT ACTIVITY`, `type-eyebrow text-content-secondary`) and a hairline (`border-b border-stroke-divider`); Review is the first place content is wrapped in bordered cards with their own eyebrow (`PRIMARY APPLICANT`, `BUSINESS` — `type-eyebrow text-content-secondary`). Review group labels are gray `text-content-secondary`, never crimson. The review card itself has no component (§11). **Evidence:** 199:12185 "Account Activity"; 137:7266 / 364:8398 "Selectable field" cards; designer decision. **Confidence:** high.
- **Above the fold, always:** header, eyebrow, title, description, and the first content element. **Never above the fold as a requirement:** the button row — on tall steps it is below the fold by design (1505/1662/1324 frames). **Evidence:** 1080 frames vs 199:12185, 258:13116, 364:8398. **Confidence:** high.
- **Section delimiting is hairline + whitespace; surfaces mean "a thing you can act on."** Hairlines (`border-stroke-divider`, #1a1a1a @11%) separate form groups, agreement rows and review rows. Bordered surfaces are reserved for tappable cards (`.select-card`, `.box-action`), inputs (`.text-field-box`, `.dropdown-field-trigger`), and the roster/review containers; all of them ring at 1px `stroke-divider` — the components natively (inset box-shadow), the composed containers by the sanctioned class `ring-1 ring-inset ring-stroke-divider` (the same inset 1px shadow; never a `border`, which adds to the box). Filled tints appear only on the selected state (`bg-primary-bg`, `--color-primary-bg`: #a6192e @6%) and on the inline new-owner form (which drops to canvas `bg-surface-app-page` to read as a nested surface). **Evidence:** 137:7541 rows; 199:12185 seams; 258:13116 "New Owner" fill. **Confidence:** high.

---

## 4. Density and spacing rhythm

The surface runs on a 4px grid — Tailwind's spacing scale expresses it directly; the few off-scale values (343, 518, 142) take arbitrary widths, and the one half-pixel height is the library's own (`.owner-container` `h-[92.5px]`).

| Relationship | Value | Evidence |
|---|---|---|
| Header | `.header` = `h-15 px-5 border-b border-stroke-divider` (60, pad 16/20, 1px bottom) | 9:544 Header |
| Body padding | `py-12` (48 top / bottom) | Frame 5 |
| Title block → content → buttons | `gap-10` (40 / 40) | Frame 5 gap |
| Eyebrow → title → description | `gap-2` (8 / 8) | Title frame gap |
| Choice cards | `.select-card` = `p-4 gap-3 rounded-md`, `.select-card-text` `gap-1`, title `text-label-strong` 14/20 (76 emergent: 16+20+4+20+16); list `gap-3` | 9:544 Card |
| Checklist boxes | `.box-action box-action-checkbox` = `h-12 px-4 py-3 rounded-sm` (48); list `gap-3`; hairline after *None of the below* is page-composed (`border-b border-stroke-divider`) | 199:13001 Box |
| Form field | `.text-field` = `.text-field-title-row` (`text-label-strong`, `pb-1.25`) + `.text-field-box` `h-12` — 73 pitch (20 + 5 + 48); stack `gap-5` (20) | 118:5928 Plain Text Field |
| Two-up fields | `flex gap-4` inside `w-[518px]` (251 + 16 + 251); `flex gap-6` at column level (`w-67` each: 268 + 24 + 268) | 258:13116 Row; Additional_Details PNG |
| Radio group | `.radio-field` = `.radio-field-title` `pb-1.25` + `.radio-field-options` `h-10 gap-6` + `.radio-field-option` `gap-2`; `.radio` is `size-5` (20) | 118:5928 Radio Fields |
| Disclaimer | `.checkbox-control` (`size-4.5`) + `gap-3` + `text-label text-content-secondary` — no component (§11) | Disclaimer container |
| Instruction callout | `text-help-caption text-content-secondary` (12/14) behind `border-l border-stroke-divider`; `mb-4` above the button row — no component (§11) | Footer "Layer field" |
| Button row | `.btn btn-secondary` + `gap-6` (24) + `.btn btn-primary flex-1`; `.btn` = `h-12 px-3.5 gap-2.5` (48), icons `size-4.5` (18) | Frame 1000001366 |
| Review card | `p-4.5 gap-3 rounded-sm bg-surface-paper` (pad 18, gap 12); rows `text-timestamp` (12/16) with `border-b border-stroke-divider`; label `w-[142px]` — no component (§11) | 137:7266 / 364:8398 Selectable field |
| Roster owner row | `.owner-container` = `h-[92.5px] px-5 py-4 gap-4`; the "avatar" is `.owner` (`size-8.5 rounded-sm`, 18px glyph) — not `.avatar` | 258:13116 Owner Container |
| Roster inline form | `p-5 gap-4 bg-surface-app-page` (pad 20, gap 16); fields `w-[518px]` — no component (§11) | New Owner |
| Roles matrix | header `h-6`; rows `h-[47px] py-1 px-4` (46 + 1 hairline) with `box-shadow: inset 0 -1px 0 var(--color-stroke-divider)`; columns `w-79` / `w-30` / `w-30` (316/120/120) — no component (§11) | 298:6425 |
| Progress bar | `h-1 rounded-full`; label row `h-9.5` (38) — no component; track colour `[raw]` (§13) | 258:13116 State |
| Loan cards | legacy geometry, not mapped; the current equivalents are `.select-card` (76) and `.switch` | 449:10462 |
| Mobile | `p-4 gap-4`, `w-[343px]`; footer `h-19 py-3.5 px-4 gap-5` (76, pad 14/16, buttons gap 20) — planned component (§12; interim recipe §11) | 449:10407 |

- **The column is the unit; the card is the second unit.** Every content element is 560 wide (`w-140`); nothing narrower than 560 sits alone except two-up fields, and nothing has horizontal margins inside the column except card padding. **Confidence:** high.
- **Vertical rhythm is 40 between blocks, 20 between fields, 12 between cards, 8 inside the title block** — `gap-10` / `gap-5` / `gap-3` / `gap-2`. Four steps, consistently. **Confidence:** high.
- **Touch targets are 48.** Inputs (`.text-field-box`, `.dropdown-field-trigger`), buttons (`.btn`), checklist boxes (`.box-action-checkbox`) and the *Add another owner* affordance row are all 48 (`h-12`); choice cards are 76; radios/checkboxes 18–20 (`.checkbox-control` `size-4.5`, `.radio` `size-5`) inside 40px rows (`.radio-field-options` `h-10`). **Confidence:** high.

---

## 5. Component selection rules

- **Card list for a single choice; box list for multiple; radios for yes/no.** Choice cards = `.select-card` as a `<button>` with `.select-card-chevron` (76, chevron, no commit button) when exactly one option advances the flow. Checklist boxes = `.box-action box-action-checkbox` (48, `.checkbox-control` inside, commit button) when several may apply. Inline `Yes / No` = `.radio-field` (`.radio-field-option`s composing `.radio`; never a `.dropdown-field`, never a `.switch`) for binary questions inside a form. **Evidence:** §2 archetypes 1–3; 118:5928 Radio Fields. **Confidence:** high.
- **Dropdown for enumerations, text for free entry, formatted placeholder for anything with a shape.** `Select…` = `.dropdown-field` (a `<button>` trigger, 48, `aria-haspopup="listbox"`, opening the shipped `.dropdown-list` › `.list-option list-option-sm` panel) for revenue bands, employee counts, industry; `.text-field` with `000-000-0000`, `MM/YYYY`, `00000`, `0.00`, `••••` placeholders (native `::placeholder` in `text-content-hint` — `--color-content-hint`: #8e9195). Currency inputs carry a leading `$` in the `.text-field-icon` slot (18, `text-content-secondary`, glyph `#dollar-sign`). **Evidence:** BSA.png, Full_time.png, Short_App.png, 118:5928 AttachMoneyRounded. **Confidence:** high.
- **Toggle only for "reveal more fields."** The single switch on the applicant surface (`Mail should go to a different address`) is `.switch` (36×20; off track `bg-stroke-border`, on `bg-primary`) and reveals a second address block; it is not used for yes/no answers. Loan coverages use switches because they are opt-ins with a price. (The library also ships `.box-action box-action-switch`, a boxed 44px switch row; no frame uses it.) **Evidence:** 348:8076, 449:10462 Switch. **Confidence:** high.
- **Conditional fields reveal in place, indented, with a left rule.** BSA follow-ups ("Do you plan to send or receive international wires?" → "To or from which countries?") and the mailing address block indent ~22px under a vertical hairline (`border-l border-stroke-divider pl-5.5` `[raw]`). Nothing opens a modal or a new step. **Evidence:** BSA_Filled.png, Business_Details_mailing_address.png. **Confidence:** high (composition) / medium (exact indent — §13).
- **Two button tiers.** *Step tier:* the Standard button — `.btn` at 48 (`h-12`), `type-button-label` (`--text-button-label`: Inter Semi Bold 14/20, +10% tracking, bundled UPPERCASE), `rounded-sm` (`--radius-sm`: 4px), with an 18px arrow `svg` child — `BACK` = `.btn btn-secondary` (`border border-stroke-border`, `--color-stroke-border`: #1a1a1a @17%, ink `text-content-secondary`, leading `#arrow-left`), primary = `.btn btn-primary` (`bg-primary`, `--color-primary`: #a6192e; `:disabled` → `bg-primary-disabled`, `--color-primary-disabled`: #a6192e @30%; trailing `#arrow-right`); a disabled Back is `.btn-secondary:disabled` (`border-stroke-divider text-content-tertiary` — gray by design, reserved; no current frame disables Back). *Inline tier:* the Utility button — `.utility-button utility-button-filled` / `utility-button-empty` (34 tall, `text-field-label` 13/500, natural case — `Add Person`, `Save`, `Cancel`), the same crimson/outline pairing, used only inside a card's inline form. **Evidence:** button instances on all frames; Account_role_2.png, Full_time-1.png. **Confidence:** high.
- **Three add-affordances, chosen by what is being added.** (A) *Review-only entities* that have no step of their own — beneficiary, co-applicant — get a full-width 48px outline button below the cards: `.btn btn-secondary w-full` with a trailing `#plus` (`ADD A BENEFICIARY +`), the heaviest shape because it is the only place the applicant will ever see the option. (B) *Entities that are real steps* — product, owner — get the micro text button, `.btn btn-micro` + 12px `#plus` (`type-micro-label` 9/12, `text-content-secondary` → primary on hover — the same component as the OwnerContainer `EDIT`), right-aligned in the section header (`ADD PRODUCT +`), because the action re-enters a step the applicant has already seen. (C) *Rows in a list being edited* — another owner on a roster step — get the same `.btn btn-micro` + `#plus`, centered in a full-width 48px (`h-12`) footer row of the card (`ADD ANOTHER OWNER +`). Emphasis tracks user type and stakes; the three are not interchangeable. **Evidence:** 137:7266, 364:8398, 258:13116; designer decision. **Confidence:** high.
- **Primary is disabled until the step is valid.** Every form, checklist, roster and offer frame shows the primary at 30% (`.btn-primary:disabled` → `bg-primary-disabled`, white ink kept) until required input exists; only Donate (nothing to enter) and the selected-checklist state show it enabled. **Evidence:** 199:13001 vs 199:12833; 137:7136. **Confidence:** high.
- **Back is a button, not a link, and sits left of the primary — never in the header.** It is present on every step after the first, including choice steps (alone), Review and Agreement. **Evidence:** button rows; designer decisions. **Confidence:** high.
- **Editing happens where the data lives.** Review cards carry `EDIT` (`.btn btn-micro` + `#pencil`) in the card header; owner rows carry `EDIT` + trash inline (`.owner-container-actions`: `.btn btn-micro` + `.icon-button icon-button-sm icon-button-state` with `#trash-2` and an `aria-label`); owners are added by a form that opens *inside* the roster card, with the list above it still visible. **Evidence:** Business_review.png, Full_time-1.png, Account_role_2.png. **Confidence:** high.
- **Selection is border + tint, not a check color alone.** Selected checklist box: `.box-action:has(:checked)` → inset 1px `--color-primary` ring + `bg-primary-bg` (#a6192e @6%) + the crimson `.checkbox-input:checked` (the label also steps to `text-lead`, 16/500); selected segmented tab (Individual/Company): `.tab tab-application[aria-selected="true"]` → inset 1px primary ring + `bg-primary-bg text-primary-text`; selected radio card ("I'll enter their details now"): `.select-card:has(.radio:checked)` → inset 1px primary + `bg-primary-bg`; selected offer card: the same `.select-card` selected state (the legacy loan frame's value is not used). **Evidence:** 199:13001 Box; 258:13116 Tabs; Full_time-1.png; 449:10462 Offer Selected=yes. **Confidence:** high.
- **Tables are avoided; the one matrix is a card.** Account Roles is the only column-headed layout on the surface; it is a bordered card with 47px rows of `.radio` / `.checkbox-control` cells, not a data table with header chrome — no component (§11). **Evidence:** 298:6344. **Confidence:** high.

---

## 6. State handling

- **Empty is the default; there is no separate empty state.** Fields show format placeholders in `text-content-hint` (`--color-content-hint`: #8e9195 — the `.text-field-input::placeholder` and `.dropdown-field-value-placeholder` ink); the checklist shows nothing selected; the roster shows existing owners or the inline form. **Evidence:** 199:12008 vs 199:12185; 290:5694. **Confidence:** high.
- **Progress is quantitative and neutral.** Declared ownership shows `40%` and a 4px bar (`h-1 rounded-full`) filled `bg-content-primary` (#1a1a1a, not brand) on a `#1a1a1a @8%` track `[raw]` — no progress component and no neutral track token (§13). **Evidence:** 258:13116 State; designer decision. **Confidence:** high.
- **Disabled = 30% of the brand fill, white text** — `.btn-primary:disabled` = `bg-primary-disabled` (`--color-primary-disabled`: #a6192e @30%), ink `text-content-contrast` never fades. The disabled *primary* is never gray. A disabled Back is the library's `.btn-secondary:disabled` — `border-stroke-divider text-content-tertiary`, gray by design and reserved for future use; no current frame disables Back. **Evidence:** all disabled primaries #a6192e @30%; designer decision. **Confidence:** high.
- **Selected = crimson border + 6% crimson tint** (`.box-action:has(:checked)`: inset 1px `--color-primary` + `bg-primary-bg`); **unselected checklist boxes are the library's rest display — `bg-surface-paper` (#fffdfb) with the label in `text-content-primary` (#1a1a1a) inside a 1px `stroke-divider` ring.** BoxAction has exactly three displays — rest, active (`:has(:checked)`: primary ring + `bg-primary-bg`, label `text-lead`) and disabled (`:has(:disabled)`: `bg-surface-app-page`, `text-content-tertiary`, 0.5px ring) — and the checklist uses rest and active only. **Evidence:** 199:13001; designer decision. **Confidence:** high.
- **Roles are pills, ownership is a number.** Business Review shows `Manager` / `Signer` as `.badge` (16px full-round `bg-neutral-bg` pill, `type-eyebrow text-content-secondary` — the OwnerContainer's own `tag` slot) beside a `text-title-medium` (16/20/500) percentage (`.owner-container-percent`); roster rows show the percentage alone. **Evidence:** Business_review.png, Full_time.png. **Confidence:** high.
- **The offer discount is shown as a strikethrough delta, and coverage acceptance flips the card text to crimson.** `6̶%̶ 5.5% APR`, `0.5% APR discount applied` in `text-primary-text`, two-dot pager fills per accepted coverage. Pattern only. **Evidence:** Loan_Web_4/5, Loan_Mobile_4/5. **Confidence:** high.
- **Validation errors render below the field in the warning color, with the field itself in its error display.** Both are the library's: `.text-field-box:has([aria-invalid="true"])` → `border-warning` (`--color-warning`: #b4791c) and the `.text-field-hint` under an invalid input → `text-warning-text` (`--color-warning-text`: #8b5d16); `.dropdown-field-trigger[aria-invalid="true"]` behaves the same. **Amber is the correct error display** — the Warning ramp is the intended binding on this surface; the `--color-error*` ramp stays unused here. `.text-area-input` has no error axis. **Evidence:** designer decision; library bindings. **Confidence:** high (rule) / low (no frame draws the state).
- **Loading and post-`CONFIRM` success states appear in no frame.** The library ships `.skeleton` (16 shapes × sm/md/lg, container `role="status" aria-busy="true"`) and `.toast toast-success` / `.toast-simple`; whether either is used here is open (§13). `.modal` is the sanctioned overlay for any future confirmation on this surface (reserved).

---

## 7. Navigation and progression

- **Forward is the primary button or a card tap; back is the outline button, on every step after the first.** Choice steps render the row with `BACK` alone (`.btn btn-secondary`). **Evidence:** §2 table; designer decision. **Confidence:** high.
- **Position is the eyebrow only.** `STEP n OF m / SECTION`. Section names repeat across steps (`BSA DETAILS` on 5 and 6; `BUSINESS DETAILS` on 4 and 9). **Evidence:** eyebrow texts. **Confidence:** high.
- **Review is the hub for edits.** Every review card has `EDIT`; every roster row has `EDIT`; `ADD PRODUCT +` / `ADD OWNER +` (business) or `ADD A BENEFICIARY +` / `ADD A CO-APPLICANT +` (consumer) let the applicant grow the application from Review (affordances B and A respectively, §5). **Evidence:** 364:8398, 137:7266. **Confidence:** high.
- **Two forward verbs only: `CONTINUE` for every intermediate step, `CONFIRM` for Donate, Review (consumer and business) and Agreement.** Both are `.btn btn-primary` — the verb is content, not a variant. **Evidence:** button texts; designer decisions. **Confidence:** high.
- **`CONFIRM` on the final Review step hands off to the Applicant Portal.** The Short App has no success or submitted screen of its own; the portal (see `applicant-portal.md`) is the landing page after submission. Do not compose a confirmation page on this surface. **Evidence:** designer decision 2026-09-10. **Confidence:** high.
- **Linked legal text is inline and underlined,** never a separate step: `terms of use`, `privacy policy`, `Electronic agreement disclosure`, `fee schedule`, `membership signature card`. Plain `<a>` with `underline` inside the disclaimer's `text-label` run; the library ships no link component (`text-link` is a 14/Auto token with no consumer here). **Evidence:** Disclaimer container texts. **Confidence:** high.
- **Language switch is a header dropdown available on every step** — `.text-selector` (`aria-haspopup="listbox"`, `aria-expanded` flips the chevron and darkens the ink) opening a `.dropdown-list` of `.list-option list-option-sm` rows. **Evidence:** Text Selector on every Header. **Confidence:** high.

---

## 8. Copy and tone

- **Titles are questions or plain imperatives in sentence case, no trailing period:** "Are you currently a member?", "Tell us about yourself", "Select a loan offer", "One last step". **Evidence:** title texts. **Confidence:** high.
- **Second person, first-person consent.** Descriptions address "you"; disclaimers are "I have read and understand…", "I consent to…". **Evidence:** Disclaimer container texts. **Confidence:** high.
- **Step buttons are single uppercase verbs:** `BACK`, `CONTINUE`, `CONFIRM` — typed in sentence case; the `type-button-label` utility on `.btn-primary` / `.btn-secondary` supplies the caps (the library's casing-is-a-transform rule). Inline buttons are sentence-case verb + object: `Add Person`, `Save`, `Cancel`, `Add Another Owner` (`.utility-button` never transforms). **Evidence:** Button Text nodes. **Confidence:** high.
- **Field labels are the question or a short noun in sentence case; placeholders show the format, not a repeat of the label.** "What is your monthly income?" / `0.00`; "Phone number" / `000-000-0000`; "SSN, last 4" / `••••`. Labels are `.text-field-title`, `text-label-strong text-content-secondary` (`--text-label-strong`: Inter Medium 14/20): `First name`, `Date of birth`, `Business address`. **Evidence:** Label and {text} nodes; designer decision. **Confidence:** high.
- **Help text says what happens next and what won't be needed:** "After you submit, invited owners receive an email and text to complete their own identity details. You won't need their SSN." Always `text-help-caption text-content-secondary` (`--text-help-caption`: Inter Regular 12/14 · #54565b) behind a left rule, above the button row. Review rows use `text-timestamp` (12/16). **Evidence:** Footer "Layer field"; designer decision. **Confidence:** high.
- **Optional is a word, not an asterisk.** `Optional` right-aligned in gray (`text-help-caption text-content-tertiary`) in the field's title row — `.dropdown-field-optional` / `.text-area-optional` today; `.text-field` gains the same slot (§12). Required fields are unmarked. **Evidence:** Business_Details-1.png; designer decision. **Confidence:** high.
- **Middot separates inline metadata** (`(123) 456-7890 · john.smith@valiify.com` in `.owner-container-contact-text`, `6% APR • 60 Months`). **Evidence:** Contact Container; Offer Metrics. **Confidence:** high.

---

## 9. Anti-patterns

### 9.1 Failure modes this surface avoids (page-level)

| Failure mode | What the frames do instead | Evidence |
|---|---|---|
| Decision fatigue | One question per choice step; one topic per form step | §2 |
| Hidden progress | Eyebrow on every step; disabled primary until valid | §3, §6 |
| Buried consent | Consent rows are full-width, hairline-separated, with inline links; never a modal | 137:7541 |
| Ambiguous selection | Border + tint + control state together, never color alone | §5 |
| Dead-end edits | Every review card and roster row has an edit path; adds happen from Review | §7 |
| Orphaned conditional fields | Reveals indent under a left rule beneath their trigger | §5 |
| Format guessing | Every shaped field has a format placeholder | §5 |

### 9.2 Things the designer never does here

- Never a sidebar, rail, tab strip, breadcrumb, or KPI band. One column. (`.tabs` exists in the library; the only tab on this surface is the Individual/Company `.tab tab-application` pair inside a form.)
- Never a table with header chrome; the one matrix is a card.
- Never pure white on the applicant surface — surfaces are `bg-surface-paper` (#fffdfb) on `bg-surface-app-page` (#fafaf9); `--color-content-contrast` (#ffffff) is ink on fills only.
- Never a gray disabled *primary*; the disabled primary is the brand at 30% (`bg-primary-disabled`). A disabled Back is the library's gray `.btn-secondary:disabled`, reserved for future use.
- No current frame uses an overlay — inline forms, inline reveals. When a confirmation needs one, it is the library's `.modal` (reserved); never a bespoke drawer.
- Never a progress bar or back control in the header.
- Never monospace, never colored value text, never severity dots. (`--font-mono` is defined in the theme and has no consumer on this surface.)
- Never a second typeface; Inter only.
- Never `NEXT` as a button label; the forward verbs are `CONTINUE` and `CONFIRM`.
- Never a frame's typo reproduced; copy defects in source frames are accidents.
- Never an asterisk for required.
- Never more than one primary per screen; never a primary in the header.
- Never a value from the legacy loan frames (their text ink, red, white surface, radius 8, light weight) — pattern only.

### 9.3 Dashboard tokens and patterns that must not leak in

The reviewer surface (`dashboard.md`) has its own language. None of it belongs here, and none of it is *in* here: the values below were checked against this library's `src/themes/valiify.css` and resolve to nothing.

- **Deep-blue accent `#1e4d8c` and cool canvas `#f0f3f7`.** Verified absent — this library's `--color-primary` is crimson #a6192e and its canvas is `--color-surface-app-page` #fafaf9 / paper #fffdfb. **Confidence:** high.
- **Blue-black hairlines at `#141428 @8%`.** Verified absent — every applicant hairline is warm-black `--color-stroke-*` on #1a1a1a: card rings 1px `stroke-divider`, header and separators `border-stroke-divider` (1px, @11%), control strokes `border-stroke-border` (1px, @17%; 1.5px on `.checkbox-control` / `.radio`). **Confidence:** high.
- **10.5px semi-bold tracked labels, 12.5px data type, 13px row titles.** The applicant floor is `type-eyebrow` (11/16) for eyebrows, `text-help-caption` (12/14) for help text and `text-timestamp` (12/16) for review rows; body is 14–16 (`text-label`, `text-input`); titles `text-display` (28). Nothing under 11 on a page (the library's `type-micro-label` 9/12 appears only inside `.btn-micro` and `.action-status`). **Confidence:** high.
- **JetBrains Mono for IDs, counts, timestamps.** No monospace anywhere on the applicant surface; IDs and phone numbers are Inter. **Confidence:** high.
- **The 140/960 margin-label module grid, summary rail, tab lenses, kebab menus, popover menus, KPI tiles, filter chips, severity dots, verification-column vocabulary (`Verified` / `Applicant stated` / `n/m checks`).** None appear. **Confidence:** high.
- **Reviewer voice** ("Requirement", "Finding", "Source", "Go to source · KYB · TIN check"). Applicant copy is second person and never names vendors or checks. **Confidence:** high.
- **Compact 24–28px controls.** Applicant controls are 48 (`h-12`) — `.btn`, `.text-field-box`, `.dropdown-field-trigger`, `.box-action-checkbox`. The library's 34px `.utility-button` and 24px `.icon-button-state` appear only inside cards. **Confidence:** high.

---

## 10. Component map

Every pattern in §1–§8 that the library ships, with the class to use. Slots and states follow the library's `CLAUDE.md`.

| Pattern | Library |
|---|---|
| Header: 60 bar, centered logo, bottom hairline, language selector; mobile `EN` swap | `.header` › `.header-logo`, `.header-desktop` / `.header-mobile` › `.text-selector` (`.text-selector-icon`, `-label`, `-chevron`); sticky z-40 |
| Language dropdown panel | `.dropdown-list` › `.list-option list-option-sm` (`aria-selected`) |
| Choice card (76, chevron, radius 6) | `.select-card` (`<button>`) › `.select-card-text` › `.select-card-title` (`text-label-strong` 14/20), `.select-card-description`, `.select-card-chevron` (18, `text-neutral`) |
| Selected radio card ("I'll enter their details now") | `.select-card` (`<label>`) + `.radio`; `:has(:checked)` → 1px primary ring + `bg-primary-bg` |
| Checklist box (48, checkbox, selected = crimson ring + 6% tint) | `.box-action box-action-checkbox` › `.checkbox-control` › `.checkbox-input` + `.checkbox-check`, `.box-action-label`; rest and active displays only |
| Checkbox (18, radius 3, 1.5px ring) | `.checkbox-control` › `.checkbox-input` + `.checkbox-check` (`#check`) |
| Radio (20) | `.radio` on `<input type="radio">` |
| Yes / No radio group | `.radio-field` (`<fieldset>`) › `.radio-field-title` (`<legend>`), `.radio-field-options`, `.radio-field-option`, optional `.radio-field-hint` |
| Text input with label (73 pitch, 48 box, radius 4, `$` icon) | `.text-field` › `.text-field-title-row` › `.text-field-title`; `.text-field-box` › `.text-field-icon` + `.text-field-input`; `.text-field-hint`; `Optional` title-row slot planned (§12) |
| `Select…` dropdown field | `.dropdown-field` › `.dropdown-field-title-row` › `.dropdown-field-title` (+ `.dropdown-field-optional`); `.dropdown-field-trigger` › `.dropdown-field-value` (`-value-placeholder`) + `.dropdown-field-chevron`; panel `.dropdown-list` › `.list-option` |
| Validation error (amber border, hint) | `[aria-invalid="true"]` on `.text-field-input` / `.dropdown-field-trigger`; `.text-field-hint` / `.dropdown-field-hint` → `border-warning`, `text-warning-text` |
| Mailing-address toggle; loan coverage switches | `.switch` (`role="switch"`, 36×20) |
| Step buttons `BACK` / `CONTINUE` / `CONFIRM`; disabled primary; add-affordance (A) | `.btn btn-secondary` / `.btn btn-primary` (+ `w-full`, `flex-1`); `:disabled` → `bg-primary-disabled` |
| Inline `Add Person` / `Save` / `Cancel` | `.utility-button utility-button-filled` / `utility-button-empty` (34, `text-field-label` 13/500, natural case) |
| Roster owner row (well 34, name, %, contact, Edit + trash) | `.owner-container` › `.owner` (`#user` / `#building`), `.owner-container-info` › `.owner-container-title` (`.owner-container-name`, `.badge`, `.owner-container-percent`) › `.owner-container-contact` (`.owner-container-contact-text`, `.owner-container-actions`) |
| "Avatar" well (34, 8% neutral, 18 glyph) | `.owner` — **not** `.avatar` (a 24/20 initials circle) |
| Role pills `Manager` / `Signer` | `.badge` (16, `bg-neutral-bg`, `type-eyebrow text-content-secondary`) |
| Individual / Company segmented tab | `.tabs` › `.tab tab-application` (`aria-selected`) |
| `EDIT` micro text button; trash | `.btn btn-micro` + `#pencil`; `.icon-button icon-button-sm icon-button-state` + `#trash-2` |
| Add-affordances (B) header text button, (C) roster footer | `.btn btn-micro` + `#plus` |
| Field help `?` icon | `.text-field-help` / `.dropdown-field-help` / `.radio-field-help` + `.tooltip` (18, `text-neutral-disabled`) |
| Title-block eyebrow (`STEP n OF m / SECTION`) | `type-eyebrow` in `text-content-tertiary` + `text-primary-text` |
| Confirmations (future) | `.modal` (`<dialog>` + `showModal()`, `.modal-notice-*` banners, backdrop z-50 / card z-60) — reserved, no current frame |
| Disabled Back (future) | `.btn btn-secondary:disabled` — reserved, no current frame |
| Keyboard focus | `focus-ring` utility on every interactive element (3px `--color-primary-ring`, #a6192e @22%) |
| Loading (proposed) | `.skeleton skeleton-input skeleton-sm`, `skeleton-button`, `skeleton-text`, `skeleton-heading` in a `role="status"` container — unconfirmed (§13) |

Shipped components that no in-scope frame uses: `.avatar`, `.btn-bubble`, `.tab-portal`, `.text-area`, `.box-action-switch`, `.toast`, `.status-tracker`, `.action`, `.utility-button-rounded` / `-text`, `.icon-button-subtle`. Do not map by analogy — the loan pages in particular are legacy and have no portal components.

---

## 11. Patterns with no component

Compose these from tokens and the primitives above. Nothing in `_dashboard-archive/` may be cited or imported; `_template.css` is scaffolding, not a component.

| Pattern | Composition |
|---|---|
| Page shell | canvas `bg-surface-app-page`; body `w-140 mx-auto py-12 flex flex-col gap-10`; `.header` as a direct child of the scroll container (sticky contract) |
| Title block | `type-eyebrow` row (`text-content-tertiary` run + `text-primary-text` section) › `text-display text-content-primary` › `text-input text-content-secondary`, `gap-2` |
| Button row (web) | `flex gap-6`; `.btn btn-secondary` (+ `#arrow-left`) · `.btn btn-primary flex-1` (+ `#arrow-right`); `w-full` primary when no Back; in flow |
| Mobile footer (interim, until the §12 component lands) | `h-19 py-3.5 px-4 flex gap-5 bg-surface-paper border-t border-stroke-divider sticky bottom-0 z-40`; `.btn btn-secondary` 99 + `.btn btn-primary flex-1` |
| Sub-section label + hairline | `type-eyebrow text-content-secondary` over `border-b border-stroke-divider` |
| Checklist "None of the below" seam | `border-b border-stroke-divider` after the first `.box-action`, inside the `gap-3` stack |
| Conditional reveal | `border-l border-stroke-divider pl-5.5 flex flex-col gap-5` (indent ~22 `[raw]`) |
| Disclaimer row | `flex items-start gap-3`; `.checkbox-control` + `text-label text-content-secondary` with `underline` links; Agreement rows separated by `border-b border-stroke-divider` |
| Instruction callout | `border-l border-stroke-divider pl-4 text-help-caption text-content-secondary mb-4` |
| Review group | `type-eyebrow text-content-secondary` label (+ affordance B right) › card `bg-surface-paper rounded-sm p-4.5 flex flex-col gap-3` with `ring-1 ring-inset ring-stroke-divider` › `type-eyebrow` eyebrow, `text-title` name (consumer) / `text-title-medium`, `EDIT` `.btn btn-micro`; rows `flex text-timestamp` with `w-[142px]` label in `text-content-secondary`, value `text-content-primary`, `border-b border-stroke-divider` |
| Product review card | card as above, `p-4 flex items-center justify-between gap-4`; left `text-label-strong` product name over `text-label text-content-secondary` one-line description; right `View Details` as a plain `<a>` `text-label text-content-secondary underline` (no button component); group label carries affordance (B) `ADD PRODUCT +` |
| Affordance (A) | `.btn btn-secondary w-full` + `#plus` below the review cards |
| Affordance (B) | `.btn btn-micro` + `#plus`, `ml-auto` in the group label row |
| Affordance (C) | `h-12 w-full flex items-center justify-center` row holding `.btn btn-micro` + `#plus`, last row of the roster card |
| Roster card | `bg-surface-paper rounded-sm ring-1 ring-inset ring-stroke-divider`; `.owner-container` rows (own bottom hairline); inline form `bg-surface-app-page p-5 flex flex-col gap-4`, fields `w-[518px]`, two-up `flex gap-4`; footer affordance (C) |
| Ownership progress | label row `h-9.5 flex items-center justify-between text-label-strong`; track `h-1 rounded-full` in `#1a1a1a @8%` `[raw]` with fill `bg-content-primary` |
| Roles matrix | card as above; header `h-6 grid` `w-79 / w-30 / w-30` in `type-eyebrow text-content-secondary`; rows `h-[47px] py-1 px-4 grid` with `box-shadow: inset 0 -1px 0 var(--color-stroke-divider)`; cells `.radio` / `.checkbox-control`; `.tabs` › `.tab tab-application` for Individual/Company |
| Informational confirm card | `bg-surface-paper rounded-sm p-4 ring-1 ring-inset ring-stroke-divider`; `text-label-strong` title, `text-label text-content-secondary` body |
| Two-up fields | `flex gap-6` (column level, `w-67` each) / `flex gap-4` (inside the 518 inline form) |
| Three-up standalone fields (Phone / ZIP / SSN last 4) | `flex gap-4`; first field `flex-1`, the two short fields `w-32` (128) each (272 + 16 + 128 + 16 + 128 = 560); stacks on mobile per §1.2. Standalone titled fields only — the address composite below is a different pattern |
| Address composite (Address / Apt / City · State · ZIP) | one joined group, not three fields: outer `rounded-sm` container with `ring-1 ring-inset ring-stroke-divider`; rows Address, Apt, City·State·ZIP stacked with `border-b border-stroke-divider` seams, no gaps; inputs are `.text-field-box` without `.text-field-title-row` (the composite has no per-field titles — the group's title is `Address` above it); the last row is `grid grid-cols-[7fr_4fr_5fr]` with `border-l border-stroke-divider` seams between cells (City ≈ 44% / State ≈ 25% / ZIP ≈ 31%); State is a `.dropdown-field-trigger`; `Optional` on the Apt row sits inside the input, right-aligned, `text-help-caption text-content-tertiary` (the only place Optional is not in a title row). Same proportions at 343; State label → `ST`, ZIP placeholder → `ZIP`. Evidence 676:4758 / 676:4982, measured from PNG — confidence medium on the exact ratio |
| Switch row (mailing-address toggle, coverage opt-ins) | `flex items-center justify-between gap-4 h-12`; label `text-label-strong text-content-secondary` left, `.switch` right; the revealed block follows as a conditional reveal |
| `Optional` on a text field (interim, until the §12 slot ships) | `.text-field-title-row flex justify-between` with a trailing `<span class="ml-auto text-help-caption text-content-tertiary">Optional</span>`, mirroring `.dropdown-field-optional` |
| Offer selection (loan, pattern only) | total card + collapsible breakdown as a review-style card; coverage rows as `flex` rows with `.switch`; offers as `.select-card` (`<label>` + `.radio`); strikethrough `line-through text-content-tertiary` + `text-primary-text` delta |

---

## 12. Planned library additions

Decided; repo work outside this document (Figma component first, then the library's `/extract` → `npm run new:component` → visual-spec process). Until they ship, pages use the interim recipes in §11; once they ship, the rows here become §10 entries.

| Addition | Spec from the frames | Library home |
|---|---|---|
| Mobile sticky action bar | 76 tall (`h-19`), `py-3.5 px-4`, `bg-surface-paper`, top hairline `border-t border-stroke-divider`, `sticky bottom-0`, `z-40`; slots for `.btn btn-secondary` (99, hug) + `gap-5` + `.btn btn-primary flex-1`; applies to every flow below `md` (§1.2) | new component — name to be chosen at scaffold time |
| TextField optional slot | title-row marker `Optional`, `ml-auto text-help-caption text-content-tertiary`, mirroring `.dropdown-field-optional` / `.text-area-optional` | modifier on `.text-field-title-row` (expected `.text-field-optional`, following the siblings' naming — to be confirmed when built) |

---

## 13. Open items

Anything a page needs from this list is unspecified; do not infer it.

- **Loading state** — none drawn. `.skeleton` shapes exist; composition unconfirmed.
- **Web button-row scroll behavior** — in flow by decision; the frames are static and neither confirm nor contradict it.
- **Conditional-reveal indent** — ~22px from PNG only; exact values are in the `Layer field` / `Address Super entry` components. The §11 recipe (`pl-5.5`) is the interim rule and is not a stop.
- **Progress-bar track colour** — `#1a1a1a @8%` has no token (`--color-action-active` / `-pressed` share the value but are interaction overlays; `--color-primary-track` is crimson). Raw composition stands until a token or component exists.
- **Roles-matrix label type** — the frame's 16/20 has no component; unmapped.
- **`.owner-container` pinned height on mobile** — the library pins `h-[92.5px]`, but at 343 the contact line wraps and the row must hug (§1.2). Needs a library check: drop the pin below `md` or let the row hug everywhere.
- **Library follow-ups (§12)** — decided but not yet built.

---

## Appendix A — Value ledger

**Color**

| Role | Token / utility |
|---|---|
| Canvas | `--color-surface-app-page` (#fafaf9) · `bg-surface-app-page` |
| Surface (header, cards, inputs) | `--color-surface-paper` (#fffdfb) · `bg-surface-paper` |
| Text primary | `--color-content-primary` (#1a1a1a) · `text-content-primary` |
| Text secondary (labels, descriptions, disclaimers) | `--color-content-secondary` (#54565b) · `text-content-secondary` |
| Text muted (eyebrow run, language, optional) | `--color-content-tertiary` (#6f7276) · `text-content-tertiary` (same hex as `--color-neutral`, the glyph ink of `.select-card-chevron` / `.owner`) |
| Placeholder | `--color-content-hint` (#8e9195) · `text-content-hint` |
| Brand / primary / selection / section eyebrow | `--color-primary` (#a6192e) · `bg-primary` / `border-primary`; `--color-primary-text` · `text-primary-text`; `--color-primary-bg` (@6%) · `bg-primary-bg`; `--color-primary-disabled` (@30%) · `bg-primary-disabled` |
| Card ring | `--color-stroke-divider` · components carry it natively (`.select-card`, `.box-action`); composed cards use `ring-1 ring-inset ring-stroke-divider` — the class form of the same inset 1px shadow |
| Hairline (header, separators) | `--color-stroke-divider` (#1a1a1a @11%) · `border-b border-stroke-divider` (`.header`); row seams `inset 0 -1px 0 var(--color-stroke-divider)` (`.list-option`) |
| Control stroke (inputs, outline buttons) | `--color-stroke-border` (#1a1a1a @17%) · `border-stroke-border` (`.text-field-box`, `.btn-secondary`); `inset 0 0 0 1.5px` on `.checkbox-input` / `.radio` |
| Control hover stroke | `--color-stroke-hover` (#1a1a1a @56%) — library hover on fields, cards, boxes |
| Progress track / fill | `#1a1a1a @8%` `[raw]` / `bg-content-primary` |
| Avatar well | `--color-neutral-bg` (#6f7276 @8%) · `bg-neutral-bg` (`.owner`, `.badge`) |
| Validation | `--color-warning` (#b4791c) · `border-warning`; `--color-warning-text` (#8b5d16) · `text-warning-text` |
| White on fills | `--color-content-contrast` (#ffffff) · `text-content-contrast` (`.btn-primary`, `.checkbox-check`) |
| Focus ring | `--ring-focus-width` 3px · `--ring-focus-color` (`--color-primary-ring`, #a6192e @22%) · `focus-ring`; `--shadow-focus-ring` for real-shadow cases |

**Type**

| Role | Utility |
|---|---|
| Eyebrow — `STEP n OF m` run, section name, sub-section label, matrix header, review eyebrow | `type-eyebrow` (Inter Semi Bold 11/16, +10%, UPPERCASE) in `text-content-tertiary` / `text-primary-text` / `text-content-secondary` |
| Step title | `text-display` (Inter Medium 28/34) |
| Description | `text-input` (Inter Regular 16/24) |
| Input value / checklist label / radio option | `text-input` (`.text-field-input`, `.box-action-label`, `.radio-field-option`); checked box label `text-lead` (16/24/500) |
| Choice title | `.select-card-title` `text-label-strong` (14/20/500) |
| Owner name / percent | `text-title-medium` (Inter Medium 16/20) (`.owner-container-name`, `-percent`) |
| Field label / radio title | `text-label-strong` (Inter Medium 14/20) (`.text-field-title`, `.radio-field-title`) |
| Disclaimer / choice description | `text-label` (Inter Regular 14/20) (`.select-card-description`) |
| Review row (label and value) | `text-timestamp` (Inter Regular 12/16) |
| Help text (instruction callout), language selector, owner contact line | `text-help-caption` (Inter Regular 12/14) |
| Step button | `type-button-label` (Inter Semi Bold 14/20, +10%, UPPERCASE) (`.btn-primary`, `.btn-secondary`) |
| Inline button (`Add Person`, `Save`) | `text-field-label` (13/16/500) (`.utility-button`) |
| `EDIT` / add-affordance micro button | `type-micro-label` (9/12/600, +8%, UPPERCASE) (`.btn-micro`) |
| Review applicant name | `text-title` (Inter Medium 22/26) |

**Dimensions**

| Element | Utility / class |
|---|---|
| Viewport / column | 1920 / `w-140 mx-auto` (560 @ x 680) · mobile 375 / `w-[343px]` (`p-4` shell) |
| Header / mobile footer | `.header` `h-15` (60) · footer `h-19` (76, planned component) |
| Body padding / block gap | `py-12` (48) / `gap-10` (40) |
| Title block | 90 emergent from `type-eyebrow` / `text-display` / `text-input` + `gap-2` |
| Choice card / checklist box / input / button / add-another row | `.select-card` (76 emergent) / `.box-action-checkbox` `h-12` / `.text-field-box` `h-12` / `.btn` `h-12` / `h-12` row holding `.btn-micro` |
| Field pitch / field gap / card gap | `.text-field` (25 + 48 = 73) / `gap-5` (20) / `gap-3` (12) |
| Owner row / matrix row | `.owner-container` `h-[92.5px]` / `h-[47px]` (composed) |
| Inline button / segmented tab / badge | `.utility-button` `h-[34px]` / `.tab-application` (hug) / `.badge` `h-4` |
| Two-up fields | `gap-4` in `w-[518px]` · `gap-6`, `w-67` |
| Review card padding / label column / progress label row | `p-4.5` (18) / `w-[142px]` / `h-9.5` (38) |
| Roles matrix columns | `w-79` / `w-30` / `w-30` (316/120/120) |
| Icons | `size-4.5` (18: `.btn svg`, `.select-card-chevron`, `.text-field-icon`, `.owner svg`) · `.owner` `size-8.5` (34 well) · `.radio` `size-5` (20) · `.checkbox-control` `size-4.5` (18) |
| Radii | `rounded-md` (`--radius-md`, 6: choice card) · `rounded-sm` (`--radius-sm`, 4: input/button/box/review/roster) · `rounded-[3px]` (checkbox, library raw) · `rounded-full` (progress, badge) |
| Strokes | `border-b border-stroke-divider` (1px header/separators) · `border border-stroke-border` (1px controls) · `inset 0 0 0 1.5px` (checkbox, radio) · card rings `ring-1 ring-inset ring-stroke-divider` |
| Z-index | library scale: content `z-0` · sticky chrome `z-40` (`.header`, mobile footer) · backdrop `z-50` · modal `z-60` · toast `z-70` |
