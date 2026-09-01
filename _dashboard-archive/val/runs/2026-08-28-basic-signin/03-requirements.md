# Requirements — 2026-08-28-basic-signin

## Source limitation (read first)

This run's source is a **screenshot** (`00-input/design@2x.png`, 2560×1600 =
2x of a 1280×800 frame; `manifest.json` has `input.figmaUrl: null`). There are
**no Figma annotations, no Figma comments, and no prototype connections**
available for this run — `01-extraction/behaviors.json` is an explicit
source-limited empty set (`behaviors: []`, with each of the 7
interactive-looking nodes listed as `reactions: []`), and the Figma MCP is
unavailable. Consequently:

- **The requester's writeup (`00-input/writeup.md`) is the sole source of
  navigation and behavioral requirements.** Everything in sections 2 and 5
  below is writeup-sourced, not extracted prototype data.
- The definition-of-done clause "every prototype connection and annotation is
  reflected or listed as out-of-scope" is satisfied vacuously: there are zero
  prototype connections and zero annotations in the source. The 7
  interactive-looking nodes from `behaviors.json` are each accounted for in
  the trigger table in section 2.

---

## 1. Purpose & audience

A **sign-in page for the Valiify dashboard**: a centered authentication card
("Welcome Back" / "Sign in to your Valiify Dashboard account.") on the
`Surface/Frame` app background, plus one utility button pinned to the
bottom-right of the viewport.

**Audience: bank reviewers** signing in to the dashboard — the writeup states
this explicitly ("reviewer-facing"). This selects the **reviewer-facing design
language register**: the internal dashboard idiom (Valiify library components
and tokens), not an applicant/consumer-marketing treatment.

This is a **prototype with no backend** — the writeup is explicit that Sign In
and Cancel do not authenticate; they show placeholder alerts.

## 2. Navigation & triggers

Zero prototype connections exist in the source (screenshot). All flows below
come from the writeup. Every interactive-looking node from
`behaviors.json` is mapped:

| # | Trigger element (behaviors.json node) | Interaction | Destination / outcome | Source |
| - | --- | --- | --- | --- |
| 1 | "Sign In" primary button (`est-btn-primary`) | click | Shows a **confirmation alert** (no backend; no navigation) | writeup |
| 2 | "Cancel" outline button (`est-btn-cancel`) | click | Shows a **confirmation alert** (no backend; no navigation) | writeup |
| 3 | "Forgot password?" link (`est-link`) | click | **Forgot-password page** — the only true outbound navigation. The destination page is explicitly **not part of this build**; only the link itself is in scope. | writeup |
| 4 | "View Demo Info" button (`est-btn-view-demo`) | click | Shows an **informational alert** (in-page; no navigation) | writeup |
| — | Email field (`est-email-value`) | edit | Standard text entry; no navigation or behavior specified beyond the prefilled value | writeup (prefill only) |
| — | Password field (`est-password-placeholder`) | edit | Standard masked text entry; no behavior specified beyond the placeholder | writeup (placeholder only) |
| — | "Remember me" checkbox (`est-checkbox`) | toggle | Toggles checked/unchecked; **no functional effect specified** (no backend) | writeup (default state only) |

**Flow count: 4** trigger→outcome flows (rows 1–4). Of these, exactly **one**
(Forgot password?) navigates away from the page; the other three are in-page
alert behaviors. The remaining three interactive nodes are plain form controls
with no specified flow.

## 3. States

The writeup is explicit: **"No error/empty states are in scope for this
prototype — the design shows the default state only."**

**Specified states: 1** — the **default state**, which is what the static
design depicts:

- Email field **prefilled** with `user@valiify.com`.
- Password field **empty**, showing placeholder "Enter your password".
- "Remember me" checkbox **unchecked** (unchecked by default, per writeup).
- Buttons and link at rest.

Explicitly **out of scope** (per writeup): error states, empty states,
validation states. Not mentioned anywhere (therefore also out of scope, noted
for completeness): loading/pending states, disabled states, signed-in state.

Interaction-implied but **unspecified** states (not counted; the source
specifies no visuals for them): checkbox checked; alert visible after clicking
Sign In / Cancel / View Demo Info; standard hover/focus/active states of the
library components used (those come with the components — the source draws
none of them).

## 4. Data semantics

Design-system rule applied: **verifiable data (IDs, amounts, account values)
→ JetBrains Mono + tabular-nums; labels/UI text → Inter.**

| Content | Classification | Face |
| --- | --- | --- |
| "Welcome Back" title | UI text | Inter |
| "Sign in to your Valiify Dashboard account." subtitle | UI text | Inter |
| "Email" / "Password" field labels | UI labels | Inter |
| **`user@valiify.com` email value** | **Data — the writeup explicitly calls it "account data"** | **JetBrains Mono per the system rule — but see Open Question 1: the screenshot renders it in a proportional sans** |
| "Enter your password" placeholder | UI text (placeholder, not data) | Inter |
| Typed password value | Masked entry (rendered as dots); no data face required | Inter (input default) |
| "Remember me" label | UI label | Inter |
| "Sign In" / "Cancel" / "View Demo Info" button labels | UI actions | Inter |
| "Forgot password?" link | UI action | Inter |

No IDs, amounts, percentages, dates, or counts appear on this page — the email
value is the only data-classified field.

## 5. Writeup-only requirements (not visible in the static design)

Because the source is a static screenshot, **all behavior is writeup-only**:

1. **Sign In → confirmation alert** ("in this prototype — no backend yet").
2. **Cancel → confirmation alert** (same caveat).
3. **View Demo Info → informational alert.**
4. **"Forgot password?" destination** is the forgot-password page; that page
   is explicitly not part of this build.
5. **"Remember me" is unchecked by default** — the depicted unchecked box is
   confirmed as the default, not a coincidence of the capture.
6. **"View Demo Info" is pinned to the bottom-right of the viewport** — i.e.
   fixed positioning relative to the viewport. A static image cannot
   distinguish fixed from flow positioning; the writeup makes it fixed.
7. **The Sign In button takes the full remaining width** of the actions row
   beside a hug-width Cancel (visible in the render — 291px + 8px gap + 67px
   across the 366px content width — but stated as a rule by the writeup, so it
   holds at other card widths).
8. **No backend** — no authentication, no form submission target, no
   remember-me persistence.

## 6. Open questions

Contradictions and ambiguities between the writeup, the screenshot, and the
design system. Surfaced, not resolved:

1. **Email value typography — writeup vs screenshot.** The writeup classifies
   the email value as "account data", which under the Valiify system rule
   means JetBrains Mono. The screenshot renders `user@valiify.com` in a
   proportional sans (~13px/400, indistinguishable from Inter). Which wins —
   the data-semantics rule (mono) or the pixel-faithful render (Inter)?
2. **Input field chrome is unspecified.** The extraction found **no border,
   background, or underline** around either field — bare label + text (see
   `structure.md` §2b). The library's Input has visible chrome (hairline
   border, sized field container). Is the chrome-less rendering intentional,
   or an artifact of an unstyled source render that the build should replace
   with the library `.input-field`?
3. **Checkbox: native control vs library component.** The screenshot shows a
   16×16 native Chromium checkbox (off-palette `#767676` border), not the
   library's 15px Checkbox component. Should the build use the library
   Checkbox (the presumable intent), accepting a 1px size and style departure
   from the render?
4. **Alert mechanism and copy unspecified.** "Confirmation alert" /
   "informational alert" — native `window.alert()`, or the library's Alert /
   Toast / Modal components? And the alert message copy is not specified for
   any of the three triggers. (Also unspecified: whether anything changes
   after the alert is dismissed — the "no backend" note suggests nothing
   does.)
5. **Card surface treatment.** The rendered card (white, 1px hairline
   `Stroke/Divider` border, ≈6px radius, **no shadow**) matches no shipped
   component — the library's Card is explicitly placeholder scaffolding not to
   be built on (per CLAUDE.md). Confirm the card is composed from tokens
   (`surface-paper`, hairline, radius) as a bespoke surface rather than the
   placeholder `.card`.

---

REQUIREMENTS: OK | FLOWS: 4 | STATES: 1 | OPEN-QUESTIONS: 5
