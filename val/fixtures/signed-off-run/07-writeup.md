# Writeup — business primary contact

| field | value |
| --- | --- |
| run | `val/runs/2026-09-11-design-primary-contact/` |
| surface | `short-app` · `design-methodology/short-app.md` |
| library | `@valiify/shortapp-ui` |
| output | SvelteKit + Svelte 5 (runes) |
| archetype | §2 row 3 — Form |
| concept approved | `02-concept/concept.v2.html` · sha256 `b1cc6bb0a3788d8da2df74c914df56134b3d69b73b33299c546a10f8ac7d59be` |
| package | `05-package/` |
| status | signed-off |

Every gate ran on Opus 5 with the model set explicitly per dispatch. A superseded
earlier pass of gates 1–2 on Sonnet 4.5 is preserved for comparison only at the
sibling path `val/runs/2026-09-11-design-primary-contact-sonnet/` and forms no
part of this run.

## What was built

Route `src/routes/business/primary-contact/+page.svelte` — owns step state,
composes the canvas (b02), body column (b13), field stack (b04) and two-up row
(b05) inline, and emits `onback` / `oncontinue`.

Five components under `src/lib/components/`:

| component | blocks | role |
| --- | --- | --- |
| `StepHeader.svelte` | b01 | `.header` with logo slot and `.text-selector` (desktop/mobile label) |
| `TitleBlock.svelte` | b03 | eyebrow · title · description |
| `TextField.svelte` | b06–b10 | `.text-field` with title row, box, input, hint |
| `StepButtonRow.svelte` | b11 | web in-flow Back + Continue |
| `MobileActionBar.svelte` | b12 | 76px sticky action bar below `md` |

Plus `mapping.md`, `contract.json`, `HANDOFF.md`.

## Concept → class → file

| block | §-source | key classes | file |
| --- | --- | --- | --- |
| b01 | §10 `.header` | `header`, `header-logo`, `header-desktop/mobile`, `text-selector*` | `StepHeader.svelte:11` |
| b02 | §11 Page shell, canvas half — **the page root element** | `bg-surface-app-page px-4` | `+page.svelte:95` |
| b13 | §11 Page shell, body-column half | `py-4 flex flex-col gap-4 mx-auto md:w-140 md:py-12 md:gap-10` | `+page.svelte:96` |
| b03 | §11 Title block | `flex flex-col gap-2`, `type-eyebrow`, `text-display`, `text-input` | `TitleBlock.svelte:11` |
| b04 | §4 field stack | `flex flex-col gap-5` | `+page.svelte:104` |
| b05 | §11 Two-up fields (wrapper only) | `flex flex-col gap-5 md:flex-row md:gap-6` | `+page.svelte:105` |
| b06–b07 | §10 `.text-field` | `text-field*` + `md:w-67` each | `+page.svelte:107,118` → `TextField.svelte` |
| b08–b10 | §10 `.text-field` | `text-field*`, no width class | `+page.svelte:131,142,154` → `TextField.svelte` |
| b11 | §11 Button row (web) | `hidden md:flex gap-6`, `btn btn-secondary`, `btn btn-primary flex-1` | `StepButtonRow.svelte:17` |
| b12 | §12 planned component, §11 interim recipe | `h-19 py-3.5 px-4 … sticky bottom-0 z-40 md:hidden` | `MobileActionBar.svelte:16` |

13/13 blocks mapped. 21 copy ids. 4 states (empty · disabled · enabled · error).

## Verification record

| check | result |
| --- | --- |
| class-audit (concept v2) | PASS — 52/52 sanctioned, 0 unsanctioned, 0 violations |
| class-audit (package) | PASS — 51/51 sanctioned, 0 unsanctioned, 0 violations |
| handoff-check | PASS — 13/13 blocks, 4 states, 21 copy, 0 failures, **0 warnings** (run with `--sprite src/icons/sprite.svg`, so icon existence is checked and every referenced icon exists) |
| critic | PASS on v2 after 1 rework loop (v1 failed on 1 blocking finding) |
| verifier | PASS — 0 blocking, 4 advisories |
| approval seal | concept.v2.html still hashes to the approved value; seal intact through build |

Every mechanical check was re-run independently by the orchestrator, not taken
on the reporting agent's word.

## Methodology rules applied

Aggregated across stages:

- **§2 row 3 (Form)** and "one topic per screen" — five fields, under the ~7
  limit, so no sub-section label or page break. All five optional parts of the
  Form content block absent per the brief.
- **§1.1 web shell** — canvas `bg-surface-app-page` with a separate centred 560
  body column, sticky 60 `.header`, rhythm 48/40/40/48.
- **§1.1 button row** in flow (not sticky) on web; Back hug 99 + `gap-6` +
  primary `flex-1`.
- **§1.2 mobile shell** — 375, 16px gutter → 343 content column, `gap-4`, 76
  sticky footer, Tailwind's native `md` (768) as the only breakpoint;
  multi-up fields stack.
- **§3** — title block's three levels at `gap-2`; eyebrow carries position and
  the header carries none; grouping by label, not by card.
- **§4** — `.text-field` 73 pitch, stack `gap-5`, 48 touch targets; two-up row
  is `flex gap-6` with `w-67` on **each field** (268 + 24 + 268 = 560).
- **§5** — text for free entry, format placeholder for the one shaped field
  (phone); step button tier only; primary disabled until the step is valid.
- **§6** — empty is the default (no separate empty state); `aria-invalid`
  drives the amber field and hint; disabled primary is the brand at 30% with
  white ink.
- **§7** — forward verb CONTINUE, Back left of the primary and never in the
  header, language switch present on every step.
- **§8** — supplied copy used verbatim; casing is a transform everywhere
  (`type-eyebrow`, `type-button-label`); required fields unmarked.
- **§9.2 / §9.3** walked clean — one primary, never NEXT, no progress bar, no
  asterisk, no overlay, no second typeface, no gray disabled primary, canvas
  fill on the page element so nothing renders on pure white, no dashboard token
  or pattern leaked in.
- **§10** — nothing from the shipped-but-unused list appears.
- **§11** — five compositions used verbatim (page shell, title block, web button
  row, two-up fields, interim mobile footer).
- **§12** — the mobile action bar is a planned component; the §11 interim recipe
  is used and recorded.
- **§13** — untouched; nothing inferred from it.

## Unsure — aggregated across stages

Resolved during the run:

- **Two-up First / Last name** — RESOLVED by the reviewer at approval: frame
  172:10673 composes them two-up. Built as drawn. (The sealed concept.md still
  reads as open on this point because it could not be edited post-seal;
  `04-approval.md` is the resolution of record and HANDOFF §1.1 states it
  settled.)
- **Loading state** — closed at Gate 1 by the requester: none; the save is
  immediate and synchronous, Continue stays actionable, no `.skeleton`.
- **Help text** — closed at Gate 1: omitted, nothing drafted.

Recorded and still open:

- **Mobile content offset under the 76px sticky footer** — see the divergence
  ledger; a §1.2 methodology gap, deliberately unsolved here.
- **Eyebrow casing** and **button-label casing** — typed sentence case with the
  type utility supplying the caps. Rendered result identical either way;
  recorded so the build does not flip it.
- **Class-bag notation** — each viewport's bag declared separately in the
  concept; merged mobile-first in the package (see D1 in the ledger).
- **Header language label (c21)** — methodology-sourced; the build must not
  invent a different label or a longer locale list.
- **Eyebrow separator** — methodology's slash form used over the brief's middot
  (§8's middot rule is for inline metadata, not the eyebrow).
- **Field help `?` icons omitted** — the brief asks for no help affordance; §4c,
  nothing added that the brief did not ask for.
- **`focus-ring`** — the library applies it in component CSS, so the build may
  not need to write the class; declared so the state is visibly considered.

## Open questions for the dev team

Four advisories from verification, all document accuracy, none blocking. None
was fixed, because verification passed and the pipeline mandates rework only on
FAIL — they are handed over as-is:

1. **`mapping.md` line-number error.** It cites `TextField.svelte:38` for the
   b06–b10 root; the root is **line 36** (38 is the label). Cheapest of the four
   to fix and the most likely to waste a reader's time.
2. **Sprite load path variant unflagged.** HANDOFF §2 loads the sprite with
   `?raw` + `{@html}`; GETTING_STARTED Step 5 documents `?url` + `fetch`. Both
   resolve and both are SSR-safe, but the divergence is not called out.
3. **`contract.json` c13/c14 carry `verbatimInMarkup: false`** even though their
   contract `text` ("Back" / "Continue") does render verbatim. Harmless but
   inaccurate.
4. **`StepHeader`'s `label` / `shortLabel` props** leave a host a path to
   unapproved copy. The defaults are correct; worth marking locale-swap-only in
   §3.

Beyond those, HANDOFF §12 carries the package's own open questions and §8 the
library defects and gaps to raise upstream.

## Divergence ledger

Every place the result differs from what the brief asked or the methodology
shows.

| # | divergence | classification | detail |
| --- | --- | --- | --- |
| D1 | The 16px mobile gutter sits on b02 (canvas) as `px-4`, where the concept put `p-4` on b13 (body column). | `methodology-gap` | The concept declares one class bag per viewport; the package is a single artifact, so bags merge mobile-first over `md`. A single element cannot carry a mobile-only x-padding: the reset `md:px-0` is written nowhere in the methodology and the class audit rejects it. Leaving `p-4` on b13 would give the web column 528px of content inside `w-140` instead of the 560 that §1.1/§4 require and that `w-67 + gap-6 + w-67` needs exactly. Verifier checked the arithmetic at both viewports: at 375, `px-4` on b02 gives 343 and b13 declares no width, so rendering is identical to the concept; at ≥ md, b13 is `md:w-140` with no x-padding, so the name row closes at 268+24+268 and b02's inset (1888 at 1920, 736 at the boundary) never touches the centred column. Also stays fluid below 375 where `w-[343px]` would overflow at 320. Reversible in one line. |
| D2 | No offset protects mobile content from under the 76px sticky footer. | `methodology-gap` | §1.2 specifies the footer but no bottom offset and §13 lists no such item, so no value could be inferred. The reviewer classified this at approval as a gap in `short-app.md` itself, to be fixed there separately. No padding was invented at any stage. Carried in HANDOFF as open item O1. |
| D3 | The eyebrow renders `STEP 3 OF 10 / PRIMARY CONTACT` (slash) where the brief writes it with a middot. | `brief-gap` | §3/§10 write the eyebrow as `STEP n OF m / SECTION`. §8's middot rule governs inline metadata, not the eyebrow. Methodology spelling used. |
| D4 | Button labels typed `Back` / `Continue` where the brief types `BACK` / `CONTINUE`. | `brief-gap` | §8 and skill §10.10: casing is a transform, supplied by `type-button-label`. Rendered result is byte-identical to the brief's intent. |
| D5 | The mobile action bar is built from §11's interim recipe rather than a shipped component. | `methodology-gap` | §12 lists "Mobile sticky action bar" as a planned component and instructs "until they ship, pages use the interim recipes in §11". Recorded in the package's planned-values section; the component name is to be chosen at scaffold time. |
| D6 | `class-audit` reports `PLANNED: 0` for a page that does use a planned composition. | `methodology-gap` | §12's table has no interim-class column, so the tool has nothing to match against. Raised upstream as HANDOFF §8 item 6. |
| D7 | `contract.copy` rows carry `verbatimInMarkup: false`. | `agent-error` (design-concept-architect) | The concept's copy elements append spec prose after the string (e.g. "Enter the contact's first name. — shown on blur and on Continue; …"), so `contract.copy` must quote the full element text to reconcile. The prose never reaches the markup: the verifier byte-compared every rendered string against `01-brief.md` and c01, c02, c03–c07, c08–c12 and c15–c19 all match exactly. Cosmetic in effect, but the concept should have kept spec prose out of the copy element. |

No `agent-error` affected what renders. D7 is the only one, and it is a
provenance-annotation defect rather than a visual or behavioural one.
