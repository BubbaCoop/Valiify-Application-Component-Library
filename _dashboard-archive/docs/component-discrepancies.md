# Component discrepancies — verified audit

**Date**: 2026-08-23
**Scope**: all 20 components. Tooltip, Modal, TextButton and Toast were
re-extracted from Figma by four independent auditors who were instructed to
treat the CSS header comments as unverified claims.
**Method**: independent Figma re-extraction + empirical measurement in Chromium.
Every claim below is measured or quoted from Figma, not inferred from the code.

---

## How this was checked

The four newest components were audited by agents that pulled their Figma nodes
fresh. They were told the CSS headers are the implementer's claims, not ground
truth, and asked to classify findings as BUG / UNDOCUMENTED / DESIGNER /
FALSE-CLAIM.

Two findings were then re-verified directly rather than relayed:

- **Hover-over-active** was measured across every component with a selected
  state, by hovering the element in a real browser and diffing computed style.
- **Height overshoot** was measured against each component's Figma frame.

That second pass found one issue the auditors missed (Modal's height) and
disproved one claim in the previous audit doc (that Tabs "resolves hover-over-
active by letting active win" — it does not).

---

## 1. Systemic: hover erases the selected state — 7 components

**Measured, not inferred.** Hover and press rules are written as
`.x:hover:not(:disabled):not([aria-disabled="true"])` — specificity (0,4,0).
Active rules are bare attribute selectors — `.x[aria-pressed="true"]` — at
(0,2,0). Hover therefore wins over selection everywhere it is drawn.

| component | selected | while hovered | severity |
| --- | --- | --- | --- |
| **Tag** | solid `Primary/Main`, white label | near-transparent grey, **label stays white** | label disappears |
| TextButton `cell` | `Primary/Soft` + `Primary/Main` | `Action/Hover` + `Content/Primary` | weight stays 500 → half-state |
| TextButton `text` | `Primary/Main` | `Content/Primary` | weight stays 500 → half-state |
| Pill | `Primary/Soft` | `Action/Focused` | selection lost |
| Tabs `chip` | `Action/Hover` fill | `Action/Subtle` | selection lost |
| Tabs `segment` | white fill + hairline | `Action/Subtle` | selection lost |
| SegmentSelector | white fill | `Action/Subtle` | same rule as above |
| Button `outline` | `Action/Hover` | `Action/Subtle` | selection lost |
| RadioSelect | `Primary/Main` ring | `Secondary/Main` ring | dot stays primary → half-state |

Tabs `underline` is the only one unaffected, and only by accident: its hover
colour happens to equal its active colour.

**Figma does not specify this.** No component draws a `Hover=yes + Active=yes`
variant, so the correct behaviour is a design decision — but the current
rendering is incoherent in every case (partial reversion), which is certainly
not it.

**Fix shape**: add `:not([aria-pressed="true"]):not([aria-selected="true"])` to
the hover/press rules, or give each active rule a `:hover` companion. Mechanical
once the designer confirms "active wins".

---

## 2. Systemic: derived heights overshoot the Figma frame

Figma draws strokes *inside* the frame; CSS border-box adds them on top. Any
component whose height is derived rather than pinned lands over.

| component | Figma | rendered | delta |
| --- | --- | --- | --- |
| Tooltip | 140 | 144.5 | **+4.5** |
| Modal (destructive) | 317 | 320.5 | **+3.5** |
| Toast Full | 97 | 98.5 | **+1.5** |
| Toast Simple | 35 | 35 | 0 — pinned |
| TextButton cell | 15 | 15 | 0 — pinned |

Tooltip's +4.5 has a second cause on top of the 2px border: its two `Micro L`
parts carry a Figma "Auto" line height, which Figma resolves to 13px and Chrome
to 14px.

CLAUDE.md already states the rule ("never size a bordered component with
`min-height`"; "component heights must not be derived from Auto line height").
These three predate or ignore it. Note the counter-argument for Modal and Toast
Full: their height genuinely varies with content, so pinning is wrong — the
honest fix there is to pin nothing and *document* the 2px border offset.

---

## 3. Both new shadow tokens are probably wrong

`get_design_context` returns local effects in the CSS **filter** form
(`drop-shadow()`), whose blur is **half** the box-shadow blur and which silently
drops spread.

Proof, from Toast's own two shadows: the *named* General Drop Shadow is
authoritatively `blur 34, spread -12` (variable definition), yet the same
codegen emitted `drop-shadow(0px 12px 17px …)` — 34/2 = 17, spread gone.

Both tokens added today were read from that halved form:

| token | recorded | probably should be |
| --- | --- | --- |
| `--shadow-modal` | `0 12px 16px 0` | `0 12px 32px ?` |
| `--shadow-toast` | `0 4px 6px 0` | `0 4px 12px ?` |

Spread is unrecoverable from the filter form. **These need reading in Dev Mode
or via the plugin API before being trusted.** `--shadow-panel` and
`--shadow-knob` are unaffected — they come from named styles.

---

## 4. Per-component

### Tooltip
- **`.tooltip` sets no base `color`.** Any unclassed text, `<strong>` or icon
  dropped inside inherits the page's dark `Content/Primary` on the dark fill and
  is invisible. `.toast-simple` sets `text-content-contrast` on its container
  and gets this right. — *bug, one-line fix*
- **"The only dark surface in the library" is now false** — `.toast-simple` is
  the second. Stated in `tooltip.css` and CLAUDE.md. — *stale claim*
- Border width/colour and the divider's 0.5px height are implemented correctly
  but asserted nowhere. — *coverage gap*

### Modal
- **The footer Cancel override introduces a hover state Figma does not draw.**
  `.modal-footer .btn-empty:not(:hover):not(:active)` means hovering Cancel
  jumps the label `Content/Secondary` → `Content/Primary`. Figma's Modal draws
  one state for that button. Dropping `:not(:hover)` fixes it. — *bug, mine*
- `.modal-icon` bakes the neutral treatment into the base class, so a bare
  `.modal` silently renders as neutral. Figma's `Action` axis has no default.
  Contradicts the library's own "explicit beats clever" precedent from Tabs. —
  *undocumented*
- Header says "two values are not tokenised in Figma"; it is three — the context
  field's 8px radius is also unbound. — *stale claim*

### TextButton
- **Disabled + selected keeps the `Primary/Soft` fill** under
  `Content/Tertiary` text. Incoherent combination. — *bug*
- `border-none` emits `--tw-border-style: none`, the exact declaration CLAUDE.md
  documents as the cause of the Tabs underline bug. Inert here, but redundant —
  Preflight already gives buttons a 0-width border. — *latent*
- `.with-ring` and `:focus-visible` are asserted nowhere. `.with-ring` being
  wrong is precisely the defect the harness caught on Chip. — *coverage gap*
- The Primary hover colour depends on source order, since
  `.text-button:hover` and `.text-button-primary:hover` tie at (0,4,0). It
  works and is documented, but only one of the two pairs is spec-guarded. —
  *fragile*

### Toast
- Full's shadow is asserted only as `≠ none`, so §3 could never have been
  caught. Simple's shadow and border are asserted not at all. — *coverage gap*
- Full's 8px radius is raw in Figma, not bound to `Radius/MD`. Value is right;
  provenance is unbound. — *designer*

### Button
- `.btn-critical` drops Figma's 0.5px `Critical/Main` border. Renders
  identically under the fill, but the header claims to reproduce the rest state
  exactly. — *stale claim*
- `.btn-critical:disabled` is invented and, unlike the hover and active
  inventions, not disclosed in the header. — *undocumented*

### Card
- Still ships in `dist` with no Figma source, invented geometry and no visual
  spec. Clearly labelled as a placeholder in its header, but nothing stops a
  consumer using it. — *standing*

---

## 5. For the designer

New, from this audit:

1. **Hover over a selected control — what should happen?** Undrawn for every
   component. Needed before §1 can be fixed properly.
2. **Modal positive's confirm button carries a stale 0.5px `Critical/Main`
   border** (node 908:1523) — left over from duplicating the destructive
   variant. Invisible at 0.5px on dark blue. Not reproduced in code.
3. **Toast Simple** exists only for `Type=info`, draws a success checkmark, and
   its component description is Tooltip's copied verbatim.
4. **Toast `info` uses a refresh glyph**, not an info glyph. Intentional?
5. **Unbound radii** — Modal's 12px (no token exists; our scale stops at 8) and
   Toast/Modal-context's 8px (should bind `Radius/MD`).
6. **Icon Button MD** declares 6px padding around a 14px icon in an 18px box —
   26px of content in an 18px frame.
7. **Local effects need a readable source.** Two shadow tokens are currently
   guesses because codegen only exposes the halved filter form.

Still outstanding from the previous audit: Card's existence, an Avatar image
variant, the Tab container's 409×35 frame, DropdownField's missing BG property,
`.dropdown-menu-divider`'s treatment, Pill's off-by-one token names, and Tag's
weight/gap inconsistencies between sizes.

---

## What checked out

Worth stating plainly, because the list above is all negatives. Across the four
re-audited components, independent extraction confirmed **every** colour token,
type style, padding value, gap, width and variant matrix — including the
non-obvious ones:

- Modal's three variants are node-for-node identical apart from the icon, and
  the 299 vs 317px difference is exactly the positive subtitle occupying one
  line instead of two. The arithmetic closes to the pixel.
- Modal's confirm button really does change per Action, and positive really does
  use `Approved/Content` while neutral really does use `Surface/Neutral`.
- TextButton's `text` type really draws Hover and Pressed identically, `Primary`
  really has no Active variant, and the frame heights really are 15/18/18.
- Toast's Type axis really changes only the icon colour — the three variable
  sets are byte-identical apart from one colour each.
- Tooltip's divider really is `Content/Secondary`; pixel analysis of the Figma
  render resolves it to exactly `#5b5b68`.

The defects are concentrated in interaction states and derived geometry — not
in token mapping.
