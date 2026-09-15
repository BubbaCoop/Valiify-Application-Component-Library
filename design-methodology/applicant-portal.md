# Applicant Portal surface — page composition methodology

**Status:** v1.0 · 2026-09-11 · extracted from Figma `PA5pr1Q8KLfbjTxdAbFm0V` (Updated-Short-App), page `Portal V2`. This file holds current rules only.
**Scope:** post-submission member portal — hub, section indexes, application/record detail, task flows. Companion to `short-app.md`. Not a component spec; buttons, cards, rows and the header are library components and are only referenced here. Component classes named here are the library's; their full specifications, states and markup live in the library's `CLAUDE.md`.

## 0. Conventions

**Sources.** 9 Figma frames from the `Portal V2` page: Overview (hub), Applications / Accounts / Offers (section indexes), Checking Account / Auto Loan refinance / Business Checking (application detail), Profile (record detail), Add Funds (task flow), The extraction cites 9 PNG exports; they were not available when this document was written, so every rule here rests on the extraction text reconciled against the library. Every value is expressed in the library's vocabulary — `src/themes/valiify.css` (58 colors, 6 radii, 24 text styles, 2 effects), `src/utilities/index.css`, `src/components/*.css` (27 components) and `CLAUDE.md`. Where a frame and the library disagree, the library value is the rule and the frame is to be updated in Figma.

**Value notation.** Utility first, with the token in parentheses on first mention in a section — `va:bg-surface-app-page` (`--color-surface-app-page`) — then utility alone. **§1–§9 carry tokens only; hex values live in Appendix A** (and in §13 where a raw value has no token). Components are named by class: `.va-action`, `.va-utility-button va-utility-button-filled`. Spacing has no tokens by design; Tailwind's scale is the token (4px → `1`, 8px → `2`, 16px → `4`, 20px → `5`). Off-scale whole pixels take arbitrary values (`va:w-[343px]`); half-pixels always do (`va:h-[92.5px]`). A value with no token is written raw and marked `[raw]`. This document does not invent tokens.

Type utilities (`va:text-display`, `va:text-input`, …) carry size, line-height, weight and tracking but **not** font-family or text-transform. The three uppercase styles ship as bundled utilities — `va:type-eyebrow`, `va:type-micro-label`, `va:type-button-label` — and are used in place of the bare `text-*`. No monospace appears on this surface.

**Viewport.** Web only — 1920 canvas, 720 column. No frame below 1920 exists for this surface; mobile is out of scope for v1 (§13.1).

**Rule format.** `rule` → **Evidence:** node ids / frame names → **Confidence:** high / medium / low. Open items are collected in §13.

**Screen inventory.**

| Archetype | Node | Frame | Height | PNG |
|---|---|---|---|---|
| Hub | 28:631 | Overview | 1591 | Overview |
| Section index | 36:1344 | Applications | 1810 | Applications |
| Section index | 38:1847 | Accounts | 990 | Accounts |
| Section index | 39:2201 | Offers | 1105 | Offers |
| Application detail | 66:4684 | Checking Account | 1080 | Checking_Account |
| Application detail | 74:2730 | Auto Loan refinance | 1080 | Auto_Loan_refinance |
| Application detail | 697:7826 | Business Checking | 1599 | Business_Checking |
| Record detail | 40:2342 | Profile | 1586 | Profile |
| Task flow | 63:4470 | Add Funds | 1080 | Add_Funds |

---

## 1. Layout skeleton

One shell, one column, no rails. The portal is a persistent signed-in surface: a two-row header with global navigation, then a single 720px column of stacked sections.

```
┌ canvas va:bg-surface-app-page───────────────────────────────────────────────────────────────┐
│ 102 .va-header                                                                              │
│   row 1 · 60 │ logo (left, on canvas)   [NC] .va-avatar chip (right)                        │
│   row 2 · 34 │ .va-tabs › .va-tab va-tab-portal × 5 (Overview · Applications ...)           │
│─────────────────────────────────────────────────────────────────────────────────────────────│
│ 32 ↓                                                                                        │
│      600 │◄───────────── 720 column ──────────────►│ 600                                    │
│          │ (detail only) .va-utility-button-rounded pill ‹ Applications                     │
│          │ Page Header: title va:text-display · subtitle 16/24/500 · meta 12/16             │
│     28 ↓                                                                                    │
│          │ va:type-eyebrow label ················· counter / link                           │
│     12 ↓ │ ┌ card va:ring-1 va:ring-inset va:ring-stroke-divider va:rounded-md ─┐           │
│          │ │ .va-action rows (84) / .va-owner-container (84) / content (44+)    │           │
│          │ └────────────────────────────────────────────────────────────────────┘           │
│     28 ↓ next section …                                                                     │
│ 32 ↓ bottom padding                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

- **Canvas `va:bg-surface-app-page` (`--color-surface-app-page`); surfaces `va:bg-surface-paper` (`--color-surface-paper`)** — the same warm two-tone as the applicant surface. No pure white anywhere. **Evidence:** frame fills on all nine; header `.va-header`, cards `.va-action` / `.va-owner-container` all `va:bg-surface-paper`. **Confidence:** high.
- **Header is 102 = 60 base + 34 nav row + 8 bottom padding.** Row 1 holds the logo (left, sitting on the canvas outside the 720 column, `.va-header-logo` 30 tall) and an account chip (right: `.va-avatar` 20px — `va:bg-neutral` ground, `va:text-content-contrast` initials — + name `va:text-help-caption`). Row 2 holds five nav tabs (`.va-tabs` › `.va-tab va-tab-portal`: 34 tall hug, `va:gap-2` icon 16 + label 14/20, active filled `va:bg-action-active` with Medium-weight `va:text-content-primary`, inactive `va:text-content-secondary`). **Evidence:** 28:631 `Frame 2`, `Actions` row; every frame. **Confidence:** high.
- **Navigation is horizontal, global, and always the same five items** — Overview, Applications, Accounts, Offers, Profile. No sidebar, no breadcrumb, no sub-navigation. **Evidence:** identical nav row on all nine frames. **Confidence:** high.
- **Single 720 column, centered (x = 600 on 1920).** Body is `va:gap-7` (28) between sections, `va:py-8` (32) top and bottom. Every section, card and row is exactly 720 wide. **Evidence:** `Frame 8` children on all nine; gaps measured from y-positions. **Confidence:** high. The hub frames measure 20 and the detail frames 28; 28 is the rule everywhere by decision (§13.1) and the hub frames are corrected upstream.
- **Everything below the header is a stack of sections.** A section = a 16px label row (`va:type-eyebrow` label left, counter or link right) + `va:gap-3` (12) + one bordered card. Sections never sit side by side. **Evidence:** `Frame 4` + content cards on every frame. **Confidence:** high.
- **Cards are `va:ring-1 va:ring-inset va:ring-stroke-divider` (`--color-stroke-divider` at 0.5px, an inset box-shadow), `va:rounded-md` (`--radius-md`: 6px), no external shadow.** Rows inside a card are separated by the row's own padding, not by rules; the card is the only border. **Evidence:** all content cards; measured 0.5px from PNGs. **Confidence:** high.
- **The page is in flow and grows** (990 → 1810). No sticky footer, no fixed action bar; only the header is sticky (`position: sticky; top: 0` + `va:z-40` — library `.va-header` contract). **Evidence:** frame heights; no bottom-pinned elements. **Confidence:** high (composition) / medium (header stickiness inferred, not drawn).

---

## 2. Archetypes

| # | Archetype | Composition | Frames |
|---|---|---|---|
| 1 | **Hub** | Greeting + action count → 3 quick-action buttons → setup checklist → In progress preview → Accounts preview. Every section but the first has a counter or "All …" link. | Overview |
| 2 | **Section index** | Stacked labeled groups, newest/most-urgent first, each group a card or run of cards; "open a new X" and "finished" groups last. | Applications, Accounts, Offers |
| 3 | **Application detail** | Back pill → title/subtitle/meta → status tracker track (4–6 `.va-status-tracker` steps) → optional metric strip → To-do (`.va-action` card) → optional owners roster | Checking Account, Auto Loan refinance, Business Checking |
| 4 | **Record detail** | Title + identifier → labeled groups of read-only rows, each row with its own action | Profile |
| 5 | **Task flow** | Title + target → method `.va-radio`s → form card (`.va-text-field`, `.va-dropdown-field`) → `.va-btn-primary` commit + text link escape | Add Funds |

- **The hub is a digest, not a dashboard.** Each section shows at most two or three items and links out (`All Applications ›`, `All Accounts ›`); nothing on Overview is unique to Overview. **Evidence:** 28:631 sections vs 36:1344 / 38:1847. **Confidence:** high.
- **Section indexes are ordered by what the member must do.** Applications: Invitations → Pick up where you left off → In progress → Open a new account → Finished. Accounts: the setup-incomplete account (ungrouped, at the very top) → Accounts. Offers: Pre-approved offers → More offers. **Evidence:** section label order on 36:1344, 38:1847, 39:2201. **Confidence:** high.
- **Application detail is one page per application, with a horizontal status tracker.** The tracker is a 48px row of 4–6 `.va-status-tracker` steps (`Application · Identity · Documents · Owners · Sign · Setup`), `va:gap-5` to `va:gap-6`, with completed and future steps in `va:text-content-tertiary` (`--color-content-tertiary`) and the current step in `va:text-content-primary` (`--color-content-primary`). It is a progress display and is never interactive — the extraction describes it as a display and `.va-status-tracker` models no interactive states (§13.1). **Evidence:** 74:2730 / 697:7826 `Status tracker`, composed of 4–6 `Application Status` (64:4623) instances. **Confidence:** high.
- **The to-do list is the page's spine.** A card of `.va-action` rows (84px: 18px icon, title 16/20/500 + description 13/16, optional count badge `0/4`, and a right-side `.va-utility-button` or status chip `UPCOMING` / `DONE`). **Evidence:** 66:4684, 74:2730, 697:7826 `Action` (71:848) instances. **Confidence:** high.
- **Business applications add an owners roster** in the same card grammar: a 133px header block (percentage + segmented bar + legend) followed by `.va-owner-container` rows (`va:h-[92.5px]`, the library pin) with an inline add/edit form + *Add another owner* footer. **Evidence:** 697:7826 `Frame 6`, `Owner Container` (274:258). **Confidence:** high.

---

## 3. Hierarchy rules

- **Three text levels above the content, three inside it.** Page: title `va:text-display` (`--text-display`: Inter Medium 28/34), subtitle `va:text-title-medium` (`--text-title-medium`: Inter Medium 16/20), meta `va:text-timestamp` (`--text-timestamp`: Inter Regular 12/16) in `va:text-content-secondary` (`#781410 · started 2 Aug 2026 · 1 thing for you`). Content: section label `va:type-eyebrow va:text-content-secondary`, row title `va:text-title-medium va:text-content-primary`, row description `va:text-body-content va:text-content-tertiary` (`--text-body-content`: Inter Regular 13/16 · `--color-content-tertiary`). **Evidence:** `Page Header` and `Frame 4` on every frame. **Confidence:** high.
- **Every section label has a right-hand partner** — a counter (`0 of 3 done`, `1 of 4 verified`) or a link (`All Applications ›`, `Hide ›`). Counters are `va:text-field-label va:text-content-tertiary` (`--text-field-label`: Inter Medium 13/16). The pair is a fixed 16px row. **Evidence:** `Frame 4` label rows on all frames. **Confidence:** high.
- **What's blocking comes first.** Overview leads with the setup checklist; Applications leads with Invitations then "Pick up where you left off"; Accounts leads with the un-funded account *above* the `ACCOUNTS` label; detail pages lead with To-do. Finished/approved items are last and collapsible (`Hide ›`). **Evidence:** section order; 38:1847's ungrouped first card. **Confidence:** high.
- **Money is the largest thing in a row.** Balances are `va:text-metric-small` (`--text-metric-small`: Inter Medium 20/26), right-aligned, with a `va:text-body-content va:text-content-tertiary` qualifier beneath (`of $9,000 limit`, `Opened 31 Jul 2026`). **Evidence:** 38:1847 account balances. **Confidence:** high.
- **Section delimiting is the card border plus the 20/28 gap.** Inside a card, rows are delimited by padding alone — no rules between to-do rows, account rows or owner rows. The only internal hairlines are the 0.5px inset dividers in list-like cards. **Evidence:** `.va-action` rows stacked with no separator nodes. **Confidence:** high.
- **Above the fold on every page:** header, page title, first section label, first card. On detail pages the status tracker is also above the fold. **Evidence:** the four 1080 frames. **Confidence:** high.

---

## 4. Density and spacing rhythm

All values from portal frame evidence.

| Relationship | Value | Evidence |
|---|---|---|
| Header | `.va-header` = `va:h-15 va:px-5 va:border-b va:border-stroke-divider` (60 + 34 + 8 = 102, pad 20) | 28:631 `Frame 2` |
| Nav tabs | `.va-tab va-tab-portal` = 34 hug, `va:gap-2` (8), icon 16 + label 14/20 | `Actions` |
| Account chip | `.va-avatar` 20px + `va:gap-1.5` (6) + name 12/14 | `User` |
| Body padding | `va:py-8` (32 top / bottom) | `Frame 8` |
| Section gap | `va:gap-7` (28) everywhere | detail frames; hub's 20 corrected upstream (§13.1) |
| Column | `va:w-180 va:mx-auto` (720 @ x 600) | all frames |
| Page header | title 34 + `va:gap-1` (4) + subtitle 20 (+ `va:gap-1` + meta 16) | `Page Header` |
| Section label row → card | 16 + `va:gap-3` (12) | `Frame 4` + gap |
| Action row | `.va-action` = `va:h-21 va:px-5 va:py-4 va:gap-4` (84, pad 20, gap 16); icon 18; content `va:gap-2` (8) | 71:848 `Action` |
| Owner row | `.va-owner-container` = `va:h-[92.5px] va:px-5 va:py-4 va:gap-4` — the library pin; the frames' 84 is corrected upstream (§13.1) | 274:258 |
| Account card body | `va:p-5 va:gap-3` (pad 20, gap 12); content row 44; footer row 34 | 38:1847 `Account` |
| Quick-action button | 232×54, `va:p-2 va:px-4 va:gap-2` (pad 8/16, gap 8), `va:rounded-md`, icon 18, label 13/16 | 28:631 hub buttons |
| Back pill | `.va-utility-button va-utility-button-rounded` = 128×34 hug, `va:rounded-full`, `va:px-3` | navigation `Button / Utility` |
| Status tracker | one `.va-status-tracker` step = 14px icon + `va:gap-2` + label 13/16, `va:whitespace-nowrap`; track composes 4–6 at `va:gap-5` to `va:gap-6`, total 48 tall | 64:4623 step; 74:2730 / 697:7826 tracks |
| Metric strip | 59 tall, 3 × 240, `va:p-3 va:px-3.5 va:gap-1` (pad 12/14, gap 4), `va:rounded-sm` | 74:2730 `Frame 10` |
| Progress bar (flow position) | `va:h-1 va:rounded-full` (4px); label row `va:h-9.5` (38) | 28:631 `Progress` |
| Segmented ownership bar | `va:h-[7px] va:rounded-full`, segments `va:gap-1`, dotted-outline remainder | 697:7826 `Frame 1000001394` |
| Owners header block | 133 tall, `va:p-5 va:gap-6` (pad 20, gap 24) | 697:7826 |
| Count badge | `.va-badge` = `va:h-4 va:rounded-full va:px-2` (16, pad 0/8), `va:bg-neutral-bg` | `Badge` instances |

- **The 84px action row is the surface's unit.** To-do items (`.va-action`), account rows, and owner rows (`.va-owner-container`, pinned `va:h-[92.5px]`) all run at the same 20px padding. **Confidence:** high.
- **Vertical rhythm is 32 / 28 / 20 / 12.** Page padding 32, section gap 28 (detail) or 20 (hub), label→card 12. **Confidence:** high.
- **Controls are 34, not 48.** Nav tabs (`.va-tab va-tab-portal`), inline buttons (`.va-utility-button`), the back pill and quick actions (54, the exception) are all shorter than the applicant surface's 48px `.va-btn` controls — this is a denser, return-visit surface. **Confidence:** high.

---

## 5. Component selection rules

- **Card-with-rows for everything; no tables.** Even Profile — the most field-like page — renders as rows of `label above value` with a right-side action, not a two-column list. No column-headed grids on portal. **Evidence:** 40:2342 `Content` rows. **Confidence:** high.
- **One primary per page at most, usually none.** The portal's normal state has no `.va-btn-primary`: to-do rows use `.va-action-cta` (the Action component's own 34px mini button: Paper, 1px `va:border-stroke-divider`, `va:text-field-label va:text-content-primary` + 18px `#arrow-right` — **not** any shipped `.va-btn` or `.va-utility-button` type) (`Verify →`, `Upload →`, `Review →`), account rows use outline `Transfer`, Profile rows use `Change` / `Edit` / `Manage`. Filled crimson (`.va-btn-primary`, 48px) appears only on Offers (`Accept Increase`, `Start Refinance`) and Add Funds (`Add Funds`) — where the member is committing to something. **Evidence:** 39:2201, 63:4470 vs all other frames. **Confidence:** high.
- **A row's right side is an `.va-action-cta` *or* an `.va-action-status` chip, never both.** `UPCOMING` and `DONE` (`.va-action-status`: `va:type-micro-label` 9/12/600 UPPERCASE in `va:text-content-hint` / `va:text-success`) replace the button in the same slot with the same 34px footprint. **Evidence:** 697:7826 `.va-action` rows. **Confidence:** high.
- **Text-button links for navigation out of a section** (`All Applications ›`, `All Accounts ›`, `Hide ›`) — `.va-utility-button va-utility-button-text`: `va:h-4` (16px), `va:text-body-content va:text-content-tertiary` → primary on hover, chevron-suffixed, no border. **Evidence:** link instances in `Frame 4` labels and card footers. **Confidence:** high.
- **`.va-radio` for a choice inside a form.** Add Funds uses three stacked `.va-radio` rows (method + timing on the right) that swap the form card beneath. Not a dropdown, not tabs, not `.va-radio-field` (the short-app labeled fieldset). **Evidence:** 63:4470 `Transfer Details`. **Confidence:** high.
- **The escape hatch is a plain underlined link below the commit button** (`I'll Add funds Later`), never a secondary button. **Evidence:** 63:4470. **Confidence:** high.
- **The metric strip is a borderless 3-up inside one `va:rounded-sm` container** — uppercase 9/11 label (`va:type-eyebrow` variant, tracked) over `va:text-label-strong` (14/20/500) value, no dividers drawn between cells. Used for the terms of an offer or application (`Payoff quote · Your offer · Vehicle`; `New Limit · Current · Rate`). **Evidence:** 74:2730 `Frame 10`; 39:2201. **Confidence:** high.
- **Two progress shapes, by meaning.** A plain 4px bar (`va:h-1 va:rounded-full`) for *how far through a flow* (in-progress application cards, node 28:631 `Progress`); a 7px segmented bar (`va:h-[7px]` with `va:gap-1` and a dotted-outline remainder) for *composition of a set* (ownership verified / waiting / declined, node 697:7826). **Evidence:** 28:631, 697:7826. **Confidence:** high.
- **Invitations get the only dual-action row** (`Review & Accept` `.va-utility-button-filled` + `Decline` `.va-utility-button-text`). Everything else offers one action plus a link. **Evidence:** 36:1344 Invitations. **Confidence:** high.

---

## 6. State handling

- **Two status vocabularies, distinguished by weight.** *Row-level status* (`va:text-timestamp` 12/16) for an item's overall state: `Actions Pending` `va:text-warning-text` (`--color-warning-text`), `Waiting on Marcus` `va:text-content-tertiary`, `Approved · opened 9 Mar` `va:text-content-tertiary`, `Withdrawn` `va:text-content-tertiary`. *Emphatic status* (`va:type-eyebrow` 11/16/600/+5% UPPERCASE) for a person or task that has stalled: `DECLINED` `va:text-error` (`--color-error`), `LINK EXPIRED` `va:text-content-secondary`, `UPLOADING ID` `va:text-content-secondary`. **Evidence:** 36:1344 row statuses; 697:7826 owner-row states. **Confidence:** high.
- **Task status is a third form** (`va:type-micro-label` 9/12/600/+8% UPPERCASE inside the 34px button slot): `DONE` `va:text-success-text` (the `.va-action-done` binding), `UPCOMING` `va:text-content-hint` (the `.va-action-pending` binding). **Evidence:** 697:7826 `.va-action` status chips. **Confidence:** high.
- **Semantic palette maps to theme tokens.** Success green, warning amber, error red — distinct from the brand crimson, which is reserved for commit actions. **Evidence:** status texts map to `--color-success`, `--color-warning-text`, `--color-error`; each an exact hex match to the extraction, verified against `src/themes/valiify.css`; hex in Appendix A. **Confidence:** high.
- **Worst-state roll-up is explicit and quantified, never a single word.** The owners bar shows `95% of the company accounted for` with `40% VERIFIED / 30% WAITING / 25% DECLINED` and a dotted-outline remainder for the unaccounted 5%; the section counter reads `1 of 4 verified`; the page meta reads `2 things for you`. **Evidence:** 697:7826. **Confidence:** high.
- **A blocked item names the person and the thing.** `Waiting on Marcus · Upload the formation documents`, with the blocker's `.va-avatar` inline (20px, `va:text-content-secondary` initials on `va:bg-neutral`). **Evidence:** 28:631 / 36:1344 in-progress cards. **Confidence:** high.
- **Setup-incomplete accounts sit outside the normal group** with a `.va-badge` `SETUP`, a `$0.00` balance, and a `Finish Setup ›` link. **Evidence:** 38:1847 first card. **Confidence:** high.
- **Empty is rendered as a to-do, not a blank.** The un-funded account becomes `Add your opening deposit`; missing owners become rows with `LINK EXPIRED` and a chevron. **Evidence:** 28:631, 697:7826. **Confidence:** high.
- **Loading, error, validation and post-commit success states appear in no frame.** The library ships `.va-skeleton` (16 shapes × sm/md/lg, container `role="status" aria-busy="true"`); whether it is used here is open (§13).

---

## 7. Navigation and progression

- **The five-item top nav is the only persistent navigation, and the portal is its own root.** There is no breadcrumb; detail pages instead show a back pill (`.va-utility-button va-utility-button-rounded` with leading `#chevron-left`, 128×34 hug) naming the section (`‹ Applications`). **Evidence:** navigation pill on 66:4684, 74:2730, 697:7826, 63:4470. **Confidence:** high.
- **Hub → index → detail → task.** Overview's section links go to the index pages; index cards' `Open ›` / `Continue →` go to application detail; detail to-do rows launch tasks (`Verify`, `Upload`, `Add Funds`); Add Funds returns via its back pill. **Evidence:** link targets by label across frames. **Confidence:** high (structure) / medium (target mapping inferred from labels).
- **Two entry points to the same work, deliberately.** An in-progress application appears on Overview *and* on Applications with the same card and the same actions; Add Funds is reachable from the Overview quick action, the Overview checklist, and the Accounts card. **Evidence:** identical content cards on 28:631 and 36:1344. **Confidence:** high.
- **Step position is shown as text:** `Step 4 of 5 · Review` under the progress bar on index cards; the status tracker on detail pages (4–6 `.va-status-tracker` steps). **Evidence:** 28:631, 36:1344, 74:2730. **Confidence:** high.
- **Finished work is retained and collapsible**, never deleted from the list — `FINISHED` with `Hide ›`. **Evidence:** 36:1344. **Confidence:** high.

---

## 8. Copy and tone

- **The hub greets; every other page states a noun.** `Welcome back, Nicholas` + `1 invitation & 4 actions are waiting for you.` vs `Business Checking`, `Add Funds`, `Nicholas Cooper`. **Evidence:** `Page Header` texts. **Confidence:** high.
- **Section labels are sentence case in the source and rendered uppercase by text-case:** `Finish setting up your new account`, `Pick up where you left off`, `Open a new account`. They read as short instructions, not category nouns. Figma's `textCase UPPER` on the `va:type-eyebrow` token supplies the caps. **Evidence:** `Frame 4` labels with `textCase UPPER`. **Confidence:** high.
- **Counters are plain-English fractions:** `0 of 3 done`, `1 of 4 verified`, `0 of 2 done`, `2 things for you`. **Evidence:** counter texts. **Confidence:** high.
- **Buttons are verb-first and sentence case** — `Verify`, `Upload`, `Review`, `Add Funds`, `Transfer`, `Change`, `Edit`, `Manage`, `Accept Increase`, `Start Refinance`, `Review & Accept`, `Decline`. No uppercase button labels anywhere on this surface (opposite of short-app's `va:type-button-label` UPPERCASE). **Evidence:** all button texts. **Confidence:** high.
- **Middot joins inline metadata:** `#204417 · with Dana Whitfield`, `••••4821 · with Jane Doe`, `Step 4 of 5 · Review`, `Managing member · 40%`. **Evidence:** throughout. **Confidence:** high.
- **Masked identifiers use the bullet form** `••••4821`, `••• •• 4417` — never a monospace treatment. **Evidence:** 38:1847, 40:2342. **Confidence:** high.
- **Descriptions state the benefit or the next physical step:** `Apple Pay or Google Wallet, ready in a tap`, `Send your paycheck here, or split it`, `Verify your identity, make sure you have your passport or drivers license to continue.` **Evidence:** action row descriptions. **Confidence:** high.
- **Offers disclose their own basis and expiry:** `Your income and credit are already on file, so this is a firm offer, not an estimate.` + `Honoured through 31 Aug 2026`. **Evidence:** 39:2201. **Confidence:** high.

---

## 9. Anti-patterns

### 9.1 Failure modes this surface avoids

| Failure mode | What the frames do instead | Evidence |
|---|---|---|
| Dashboard sprawl | Hub is a digest of three or four sections, each linking out | §2 |
| Unclear blockage | Blocked items name the person and the artifact | §6 |
| Status by color alone | Every status is a word; color is added to the word | §6 |
| Hidden progress | Section counters, `Step n of m`, status tracker, quantified bars | §3, §6 |
| Orphaned empty states | Empties render as to-do rows with actions | §6 |
| Action ambiguity | One action per row, plus at most one link | §5 |
| Losing finished work | Finished group retained, collapsible | §7 |

### 9.2 Things the designer never does here (observed)

- Never a sidebar, breadcrumb, or sub-navigation; five top-level tabs only.
- Never pure white; surfaces are `va:bg-surface-paper` on `va:bg-surface-app-page`.
- Never a table or a column-headed grid.
- Never an uppercase button label (sentence case only; opposite of short-app).
- Never a second typeface; Inter only. The Noto Serif and Noto Sans title runs in the frames are defects to be corrected upstream (§13.1).
- Never monospace, even for account and application IDs.
- Never a filled button except to commit (Offers, Add Funds).
- Never a shadow; cards are hairline-only.
- Never a rule between rows inside a card.
- Never a bare number without its unit or denominator.

### 9.3 Short App patterns that must not leak in

The applicant surface (`short-app.md`) is a linear data-collection flow. None of its flow vocabulary belongs here:

**From the applicant surface — must not leak in:**
- **`STEP n OF m` eyebrow.** The portal is a hub, not a sequence; pages show section names, never position. **Confidence:** high.
- **Progress bar as position indicator.** The portal uses a 4px bar for *how far through a flow* on in-progress cards (node 28:631), not as the member's position in a sequence. **Confidence:** high.
- **Back/Continue footer row.** The portal's buttons are inline (`.va-utility-button`, 34px); the applicant surface's are a footer row (`.va-btn`, 48px). **Confidence:** high.
- **560 column.** Portal is 720 wide. **Confidence:** high.
- **`.va-btn` components (`.va-btn-primary`, `.va-btn-secondary`, `.va-btn-micro`, `.va-btn-bubble`).** Portal uses `.va-utility-button` (34px, four types: empty/filled/rounded/text) for inline actions; short-app uses `.va-btn` (48px, uppercase labels) for step navigation. Portal uses `.va-btn-primary` (48px) only for commit actions on Offers and Add Funds. **Confidence:** high.
- **Full-width uppercase `CONTINUE` / `CONFIRM`.** Portal says "Add Funds" (sentence case, `.va-btn-primary`). **Confidence:** high.
- **`.va-box-action` checklist rows.** Portal is post-submission browsing; short-app is data collection. **Confidence:** high.
- **`.va-select-card` choice cards.** Portal uses bare `.va-radio` in forms; short-app uses `.va-select-card` for single-choice steps. **Confidence:** high.
- **`.va-radio-field` labeled fieldsets.** Portal uses bare `.va-radio` rows; short-app uses `.va-radio-field` for yes/no questions. **Confidence:** high.

---

## 10. Component map

Every pattern in §1–§8 that the library ships, with the class to use. Slots and states follow the library's `CLAUDE.md`.

| Pattern | Library |
|---|---|
| Header: 60 bar, centered logo, bottom hairline, language selector; mobile `EN` swap; sticky z-40 | `.va-header` › `.va-header-logo`, `.va-text-selector` (`.va-text-selector-icon`, `-label`, `-chevron`) |
| Account chip (header row 1 right) | `.va-avatar` 20px + `va:gap-1.5` + name `va:text-help-caption` |
| Nav tabs row (header row 2) | `.va-tabs` › `.va-tab va-tab-portal` (`aria-selected`); active `va:bg-action-active va:text-content-primary`, inactive `va:text-content-secondary` |
| Language dropdown panel | `.va-dropdown-list` › `.va-list-option va-list-option-sm` (`aria-selected`) |
| Back pill (‹ Applications) | `.va-utility-button va-utility-button-rounded` + leading `#chevron-left` |
| Status tracker track (4–6 steps) | compose 4–6 `.va-status-tracker` (+ `.va-status-tracker-active`) in `va:flex va:gap-5` to `va:gap-6` row |
| One status step (icon + label) | `.va-status-tracker` = 14px icon + `va:gap-2` + label `va:text-field-label`; active `va:text-content-primary`, rest `va:text-content-tertiary` |
| To-do row (84px: icon, title, description, badge, button or status) | `.va-action` › `.va-action-icon`, `.va-action-content` › `.va-action-title`, `.va-action-description`; `.va-action-cta` (own 34px mini button) or `.va-action-status` chip; optional `.va-badge` |
| To-do card | `va:bg-surface-paper va:rounded-md va:ring-1 va:ring-inset va:ring-stroke-divider va:flex va:flex-col` holding `.va-action` rows |
| To-do row trailing CTA (Verify, Upload, Add Funds) | `.va-action-cta` — the Action component's own mini button (34px, Paper + 1px `va:border-stroke-divider`, `va:text-field-label va:text-content-primary`, 18px trailing glyph); **not** `.va-btn`, **not** `.va-utility-button` |
| Standalone inline buttons (Transfer, Change, Edit, Manage, Accept Increase) | `.va-utility-button va-utility-button-empty` / `va-utility-button-filled` (34px, sentence case, `va:text-field-label` 13/500) |
| Section nav links (All Applications ›, Hide ›) | `.va-utility-button va-utility-button-text` + trailing `#chevron-right` (16px bare underlined row) |
| Owner row (well, name, %, contact, Edit + trash) | `.va-owner-container` › `.va-owner` (`#user` / `#building`), `.va-owner-container-info` › `.va-owner-container-title` (`.va-owner-container-name`, `.va-badge`, `.va-owner-container-percent`) › `.va-owner-container-contact` (`.va-owner-container-contact-text`, `.va-owner-container-actions`) |
| "Avatar" well (34px, 8% neutral, 18 glyph) | `.va-owner` — **not** `.va-avatar` (the 24/20px initials circle) |
| Role pills (Manager / Signer) | `.va-badge` (16, `va:bg-neutral-bg`, `va:type-eyebrow va:text-content-secondary`) |
| Blocker avatar inline (Waiting on Marcus) | `.va-avatar` 20px in `va:text-content-secondary` initials on `va:bg-neutral` |
| `EDIT` micro text button | `.va-btn va-btn-micro` + `#pencil` (9/12 UPPERCASE, `va:text-content-secondary` → primary) |
| Trash icon button | `.va-icon-button va-icon-button-sm va-icon-button-state` + `#trash-2` |
| Method radios (Add Funds) | bare `.va-radio` rows in `va:flex va:flex-col va:gap-4` (not `.va-radio-field`) |
| Form fields (Add Funds, Profile) | `.va-text-field` › `.va-text-field-title`, `.va-text-field-box` › `.va-text-field-input`; `.va-dropdown-field` › `.va-dropdown-field-title`, `.va-dropdown-field-trigger` |
| Commit button (Offers, Add Funds) | `.va-btn va-btn-primary` (48px, `va:type-button-label` UPPERCASE, trailing `#arrow-right`) |
| Escape link (I'll Add funds Later) | plain `<a>` with `va:underline`, `va:text-label va:text-content-secondary` |
| Switch (account setup) | `.va-switch` (`role="switch"`, 36×20) |
| Count badge (0/4 on action rows) | `.va-badge` (16, `va:bg-neutral-bg`, `va:type-eyebrow`) |
| Keyboard focus | `va:focus-ring` utility on every interactive element (3px `--color-primary-ring`, outline at offset 0) |
| Transient confirmation (available) | `.va-toast va-toast-success` (`role="status"`) / `.va-toast va-toast-error` (`role="alert"`), `va:z-70`; positioning, timers and dismissal are the consumer's |
| Destructive or blocking confirmation (available) | `.va-modal` (`<dialog>` + `showModal()`, `.modal-notice-*` banners, backdrop `va:z-50` / card `va:z-60`) |
| Loading (proposed, unconfirmed) | `.va-skeleton` shapes in a `role="status"` container — open (§13.2) |

Shipped components that no in-scope frame uses: `.va-box-action`, `.va-checkbox-control`, `.va-btn-secondary`, `.va-btn-micro`, `.va-btn-bubble`, `.va-select-card`, `.va-radio-field`, `.va-text-area`, `.va-tab-application`, `.va-tooltip`.

`.va-toast` and `.va-modal` are **available, not forbidden.** No in-scope frame draws either, but these nine frames draw no transient state at all — the absence is the extraction's silence, not a designer rule. Both are mapped above; use them for the states §13.2 leaves open rather than composing a bespoke overlay.

---

## 11. Patterns with no component

Compose these from tokens and the primitives above.

| Pattern | Composition |
|---|---|
| Page shell | canvas `va:bg-surface-app-page`; body `va:w-180 va:mx-auto va:py-8 va:flex va:flex-col va:gap-5` (hub) or `va:gap-7` (detail); `.va-header` as a direct child of the scroll container (sticky contract) |
| Page header | `va:text-display va:text-content-primary` › `va:text-title-medium va:text-content-secondary` › `va:text-timestamp va:text-content-secondary`, `va:gap-1` |
| Header nav row (row 2, contains the tabs) | `va:flex va:gap-2 va:items-center` holding `.va-tabs` › `.va-tab va-tab-portal` × 5 |
| Section label + counter | `va:type-eyebrow va:text-content-secondary` label left; counter `va:text-field-label va:text-content-tertiary` or link `.va-utility-button va-utility-button-text` right, in `va:flex va:items-center va:justify-between va:h-4` (16px row) |
| Quick-action buttons (hub only, 232×54) | `va:flex va:items-center va:gap-2 va:p-2 va:px-4 va:rounded-md va:bg-surface-paper va:ring-1 va:ring-inset va:ring-stroke-divider`; icon 18px + label `va:text-field-label va:text-content-secondary` |
| Metric strip (3-up 59px, offer/application terms) | `va:flex va:h-[59px] va:rounded-sm`; cells `va:flex-1 va:p-3 va:px-3.5 va:flex va:flex-col va:gap-1`; label uppercase `va:text-timestamp` (or smaller tracked variant) over value `va:text-label-strong va:text-content-primary` |
| Progress bar (flow position, 4px on in-progress cards) | label row `va:flex va:items-center va:justify-between va:h-9.5`; track `va:h-1 va:w-full va:rounded-full va:bg-stroke-divider` with fill `va:bg-content-primary` at % width (the token is the nearest shipped stroke; §13.1) |
| Segmented ownership bar (7px, composition %) | `va:flex va:h-[7px] va:gap-1`; segments `va:flex-1 va:rounded-full va:bg-success` / `va:bg-content-tertiary` / `va:bg-error`; dotted remainder `va:border va:border-dashed va:border-stroke-divider va:rounded-full` |
| Account card | `va:bg-surface-paper va:rounded-md va:ring-1 va:ring-inset va:ring-stroke-divider va:p-5 va:flex va:flex-col va:gap-3`; rows `va:flex va:items-center va:justify-between va:h-11` (content) or `va:h-[34px]` (footer); left column `va:flex va:flex-col va:gap-1` |
| Profile field row | `va:flex va:items-start va:gap-4 va:text-timestamp` with `va:border-b va:border-stroke-divider` seam; label `va:w-[142px] va:text-content-secondary`, value `va:flex-1 va:text-content-primary`, action `.va-utility-button va-utility-button-text` |
| Radio row (Add Funds method) | `va:flex va:items-center va:justify-between va:gap-4 va:h-10`; `.va-radio` left, label `va:text-label-strong va:text-content-secondary` center, detail `va:text-label va:text-content-tertiary` right |

---

## 12. Planned library additions

No planned additions for the portal surface. All patterns route to either §10 (shipped components) or §11 (utility recipes).

| Addition | Spec from frames | Interim class |
|---|---|---|

---

## 13. Decisions and open items

### 13.1 Decided

Settled; the body sections above carry these as rules. Recorded here with the reason so the next reader does not reopen them.

- **Page titles are Inter.** `val/config.json` declares the type system Inter-only (all 24 text styles, no second family). The Noto Serif title on Overview and the Noto Sans titles on application detail are Figma defects, to be corrected upstream. **Decided:** 2026-09-11.
- **Section gap is 28 (`va:gap-7`) everywhere.** The hub frames measure 20 and the detail frames 28; one rhythm governs the surface. The hub frames are corrected upstream. **Decided:** 2026-09-11.
- **The status tracker is display-only.** The extraction calls it a progress display, and `.va-status-tracker` models no interactive state — no hover, focus, or pressed variant exists to bind. A consumer who later needs clickable steps composes a button around the step and adds `va:focus-ring`, which is a component change, not a page decision. **Decided:** 2026-09-11.
- **`.va-owner-container` keeps its pinned `va:h-[92.5px]`.** The library pins it; the Portal V2 frames measure 84. Per `short-app.md`'s standing rule the library value is the rule and the frame is updated in Figma. **Decided:** 2026-09-11.
- **Mobile is out of scope for v1.** No frame below 1920 exists for this surface, and the portal ships web-only at one viewport. A mobile shell is a new extraction, not an inference from these nine frames. **Decided:** 2026-09-11.
- **The progress track binds `va:bg-stroke-divider`.** The frames author a raw 8% warm-black wash that matches no token; `--color-stroke-divider` is the nearest shipped stroke at 11%. The library value ships and the 3-point difference goes to Figma. (`--color-action-active` and `--color-action-pressed` are 8% exactly but are interaction overlays and must not be repurposed as a static fill; `--color-primary-track` is crimson.) **Decided:** 2026-09-11.

### 13.2 Open

Anything a page needs from this list is unspecified; do not infer it.

- **Quick-action button height (54px)** — off both the 34px (`.va-utility-button`) and 48px (`.va-btn`) scales, and used only on the hub. Is 54 deliberate, or should these be 48?
- **Nav-tab height (34px)** — `.va-tab va-tab-portal` hugs its content rather than pinning a height, so the frames' 34 is emergent. Confirm whether 34 is the spec or the hug is.
- **Header stickiness** — `.va-header` carries `position: sticky; top: 0` + `va:z-40` by library contract, but no frame draws a scrolled state and the portal's tallest page is 1810. Confirm the contract holds here, and whether a scrolled shadow is wanted (Figma draws none).
- **Loading and error / validation states** — neither is drawn. `.va-skeleton` ships 16 shapes; `.va-text-field` and `.va-dropdown-field` ship error displays (`va:border-warning`, `va:text-warning-text`). Both are available; which the portal uses, and where, is unspecified.
- **Post-commit success** — not drawn, and the surface now has two viable shipped paths. **(a)** The launching row's `.va-action-status` flips to `.va-action-done` on return, so the confirmation lives where the task lived and nothing floats. **(b)** `.va-toast va-toast-success` on return, `role="status"`, `va:z-70` — louder, and it survives the member landing on a different page than the one they left. To be decided after the first portal run.

---

## Appendix A — Value ledger

**Color**

| Role | Token / utility | Hex |
|---|---|---|
| Canvas | `--color-surface-app-page` · `va:bg-surface-app-page` | #fafaf9 |
| Surface (header, cards) | `--color-surface-paper` · `va:bg-surface-paper` | #fffdfb |
| Text primary | `--color-content-primary` · `va:text-content-primary` | #1a1a1a |
| Text secondary (labels, subtitles, descriptions) | `--color-content-secondary` · `va:text-content-secondary` | #54565b |
| Text muted (section labels, counters) | `--color-content-tertiary` · `va:text-content-tertiary` | #6f7276 |
| Placeholder / upcoming status | `--color-content-hint` · `va:text-content-hint` | #8e9195 |
| Brand / primary / commit / active nav | `--color-primary` · `va:bg-primary`; `--color-primary-text` · `va:text-primary-text` | #a6192e |
| Card ring | `--color-stroke-divider` · `va:ring-1 va:ring-inset va:ring-stroke-divider` | #1a1a1a @11% |
| Hairline (header, separators) | `--color-stroke-divider` · `va:border-b va:border-stroke-divider` | #1a1a1a @11% |
| Control stroke (outline buttons) | `--color-stroke-border` · `va:border-stroke-border` | #1a1a1a @17% |
| Progress track | `--color-stroke-divider` · `va:bg-stroke-divider` | #1a1a1a @11% — frames author #1a1a1a @8% (§13.1) |
| Avatar / badge well | `--color-neutral` · `va:bg-neutral` / `--color-neutral-bg` · `va:bg-neutral-bg` | #6f7276 / @8% |
| Active tab fill | `--color-action-active` · `va:bg-action-active` | #1a1a1a @8% |
| Success (Done, Pre-Approved, verified segment) | `--color-success` · `va:text-success` / `va:bg-success` | #2e6e4e |
| Warning (Actions Pending) | `--color-warning-text` · `va:text-warning-text` | #8b5d16 |
| Error (Declined) | `--color-error` · `va:text-error` / `va:bg-error` | #c0362c |
| Focus ring | `--ring-focus-width` 3px · `--ring-focus-color` (`--color-primary-ring`, @22%) · `va:focus-ring` | #a6192e @22% |

**Type**

| Role | Utility | Spec |
|---|---|---|
| Page title | `va:text-display` | Inter Medium 28/34 |
| Page subtitle | `va:text-title-medium` | Inter Medium 16/20 |
| Page meta / counter / review row | `va:text-timestamp` | Inter Regular 12/16 |
| Section label / badge / tracker label | `va:type-eyebrow` | Inter Semi Bold 11/16, +10%, UPPERCASE |
| Row title / owner name / balance qualifier | `va:text-title-medium` | Inter Medium 16/20 |
| Row description / contact line | `va:text-body-content` | Inter Regular 13/16 |
| Balance | `va:text-metric-small` | Inter Medium 20/26 |
| Nav tab / inline button label | `va:text-label` (tab) / `va:text-field-label` (button) | Inter Regular 14/20 / Inter Medium 13/16 |
| Task status chip (Done / Upcoming) | `va:type-micro-label` | Inter Semi Bold 9/12, +8%, UPPERCASE |
| Metric label | `va:text-timestamp` (or smaller tracked variant) | Inter Regular 12/16 |
| Metric value | `va:text-label-strong` | Inter Medium 14/20 |
| Help text / account chip name | `va:text-help-caption` | Inter Regular 12/14 |

**Dimensions**

| Element | Utility / class |
|---|---|
| Viewport / column | 1920 / `va:w-180 va:mx-auto` (720 @ x 600) |
| Header | `.va-header` `va:h-15 va:px-5 va:border-b` (60 + 34 + 8 = 102, pad 20, 1px bottom) |
| Body padding / section gap | `va:py-8` (32) / `va:gap-7` (28) |
| Page header | title 34 + subtitle 20 (+ meta 16), `va:gap-1` (4) |
| Section label row → card | 16 + `va:gap-3` (12) |
| Action row | `.va-action` `va:h-21 va:px-5 va:py-4 va:gap-4` (84, pad 20, gap 16) |
| Owner row | `.va-owner-container` `va:h-[92.5px]` |
| Nav tab / inline button / back pill / badge | `.va-tab va-tab-portal` 34 hug / `.va-utility-button` `va:h-[34px]` / 128×34 hug / `.va-badge` `va:h-4` (16) |
| Quick action | 232×54 (`va:p-2 va:px-4 va:gap-2`) |
| Metric strip | 59 tall, 3 × 240 |
| Progress bars | `va:h-1` (4px flow) · `va:h-[7px]` (7px segmented ownership) |
| Radii | `va:rounded-md` (6: cards) · `va:rounded-sm` (4: metric strip, buttons) · `va:rounded-full` (pills, progress, bars) |
| Icons | `va:size-4.5` (18: action, owner, button glyphs) · `va:size-4` (16: nav tab, text-button chevron) · `va:size-3.5` (14: status tracker) · `.va-avatar` `va:size-5` (20: chip, blocker) |
| Z-index | library scale: content `va:z-0` · sticky chrome `va:z-40` (`.va-header`) · backdrop `va:z-50` · modal `va:z-60` · toast `va:z-70` |
