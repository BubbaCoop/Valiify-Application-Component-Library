# Designer List — open questions & authoring defects in the Short App Figma

Consolidated from the per-component extraction notes in CLAUDE.md (which stay
the canonical per-component record). Every item was found during extraction of
`Updated-Short-App` (PA5pr1Q8KLfbjTxdAbFm0V) and is reproduced faithfully in
the library until the design changes — nothing here blocks shipping, but the
**Systemic** items affect multiple components and are worth fixing at the
source.

_Last updated 2026-10-15 (follow-up syncs: Height/XS deleted, utility disabled unified, Eyebrow bound on Micro, Data Key cased, Skeleton fully closed incl. its rewritten set description — 31 components)._

## Process decisions (recorded here so they stop resurfacing)

- **Visual regression (2026-10-15):** the visual-spec harness — 741
  computed-style assertions against Figma-extracted values — IS the
  regression gate. **Chromatic is closed**, not deferred; the inert
  secret-gated CI step remains as the opt-in if designer screenshot review
  is ever wanted.
- **Error vs amber (2026-10-15):** red `Error/*` = destructive actions
  (ListItem Critical); amber `Warning/*` = consumer-facing field errors (D4).

## Systemic — one Figma fix resolves several components

1. **The Error ramp is defined but applied nowhere — RESOLVED FOR FIELDS
   (designer, 2026-09-16; decision D4).** Every field `Error=Yes` variant —
   Plain Text Field (515:5147/5159/5171) and Dropdown Field
   (521:5308/5318/5328) — binds `Warning/Base` (#b4791c amber), never
   `Error/*` (#c0362c). Settled with both variable reads and pixel samples.
   → **Amber is the intended error colour for the field family, permanently.**
   It was never a slip. The library will not rebind, and future extractions
   should stop raising it. TextArea and RadioField joined the amber binding in
   1.2.0 on the same decision. The `Error/*` tokens stay in the theme, unused.
   **UPDATE 2026-10-15: the Error ramp's role is APPROVED as a decision** —
   ListItem's Critical axis (`Error/Base`, red) is the destructive-action
   display; amber stays field-errors only. The ramps coexist deliberately;
   extractions should stop asking.
   **STILL OPEN — the Toast Type literally named "error" (582:9338) binds
   Warning/Base** while its siblings bind Success/Base and Info/Base
   correctly. D4 answered a question about _colour_; this one is about
   _naming_, and is not covered by it. The Modal's Destructive (Primary
   tints) is the same family.
2. **`bottomContent` rows have broken authored geometry** (absolute,
   `bottom: -19px`, `right: -313%`, width ~1706px on 413px parents) in
   Plain Text Field, Dropdown Field, Text Area Field, and RadioField. The
   library ships the hint in normal flow as a labeled correction. One
   upstream fix beats four local ones.
3. **Placeholder/stale glyph layer names** — helper icon-buttons everywhere
   nest a glyph named "ChevronLeft" (reads as a placeholder): RadioField,
   all three fields. Also: SelectCard's "ChevronLeft" renders a RIGHT
   chevron; OwnerContainer's "arrow-right" renders a pencil and its
   "ChevronLeft" renders a trash can. A rename pass would prevent every
   future extraction from re-flagging these.
4. ~~No disabled variant exists on any field~~ **RESOLVED 2026-10-13**: the
   designer drew disabled variants for TextField (865:5431), TextArea
   (865:5526) and DropdownField (865:4512) — `BG/App Page` fill +
   `Stroke/Divider` border + `Text/Tertiary` ink, empty+rest only — and
   DECIDED that Radio, Switch and RadioField get no disabled visual
   (deliberate exclusion, not a gap). Checkbox already modelled one.
   Still cursor-only by design: Radio, Switch, RadioField, IconButton,
   UtilityButton (non-Link). Residual note: no disabled+filled /
   disabled+error compounds are drawn — the library resolves them by source
   order (disabled wins); say if that is wrong.
5. **The Text/Hint-on-Paper pairing fails WCAG contrast** (3.11:1, needs
   4.5:1) wherever it appears: field placeholders (DropdownField flagged
   live by axe; TextField/TextArea hide it inside native `::placeholder`),
   and now the Action row's PENDING chip (9px micro-label — harsher still).
   All waived with documentation; one ink fix resolves the family.
6. **Casing still unconfirmed** for Data Key, Tag & Pill, and the Lockup
   styles (Eyebrow, Button Label, Micro-Label are resolved: styled
   transforms). Confirm per component as they get used.
7. ~~Skeleton's fill variable missing~~ RESOLVED 2026-10-15: `BG/Skeleton`
   (#e4e7eb) landed and the library tokenized it (`--color-surface-skeleton`).
8. **The `Field Label` type token (13/16/500) is misnamed** — RESOLVED-ish
   2026-09-02: its first (and only) consumer turned out to be the TOOLTIP
   title (582:9178), while actual field labels bind `Labels, links &
UI/Strong`. Consider renaming the style to match its real use.

## Per-component

### Button — unified set (1:218, merged 2026-10; formerly Button / Standard + Button / Utility)

**From the 2026-10-13 merge re-extraction (three lanes + full variable
enumeration):**

- ~~Utility/Link renders black but binds crimson~~ RESOLVED 2026-10-13: the
  `button/foreground` + `button/link-foreground` variable collections were
  removed ("no new color tokens") and every Link variant now binds
  `Text/Primary` directly — the dark ink was the intent; the library
  reverted to a constant Text/Primary the same day. STILL OPEN from it:
  Link's four variants remain byte-identical (the set description promises
  Default/Hover/Pressed/Disabled — either draw the states or drop the
  claim), and the "Buttons / Inline link disabled" text style (underline
  off) is now ORPHANED — no variant binds it. The library invents neither.
- **Icon exports carry inconsistent per-slot stroke widths**: every
  `Icon / Left` is 2.0 and every `Icon / Right` is 1.2 (icon-space px), i.e.
  ≈2.67/24 vs ≈1.6/24 — neither matches the sprite's 2/24 and the two slots
  disagree with each other. All 18 slots draw the same `arrow-right`. The
  library keeps the sprite convention (≈1.5px at 18px).
- **Utility/Secondary rest ink differs by size**: SM (25:368) binds
  `Text/Primary` vs MD (24:4381) `Text/Secondary` — re-confirmed after the
  2026-10-13 token removal as direct bindings. The SM value equals the hover
  ink; likely a slip. The library ships Text/Secondary for both.
- **Utility/Primary gained a 1px Stroke/Divider ring** (57:2953; the old
  Filled had none) — near-invisible over crimson. Intended? (Shipped.)
- **Utility/Secondary hover drops BG/Paper but keeps the border** — the 4%
  wash composites over the page, not Paper. Confirm. (This REVERSES the old
  "Empty border is rest-only" item below — closed by the merge.)
- **"Buttons / Inline link" is a new text style numerically identical to
  Body & Supporting/Input (16/24/400)** — merge them or confirm the split.
  The two new variables' lowercase single-segment names (`button/foreground`,
  `button/link-foreground`) also break the file's Group/Name convention.
- **The two Metric/Mono styles (24, 20) are Inter, not mono** — the
  names-that-lie family.
- Utility Text MD's old raw-#6f7276 stacking **appears fixed** (rest now
  binds a clean Text/Secondary) — confirm.
- Utility Secondary MD is a fixed 54px frame over a 34px content stack
  (hand-resized look); w-214 is the sample hug.
- Disabled still exists only for the four Standard styles (+ Link's designed
  modes) — no Utility Empty/Filled/Rounded/Text disabled.

**Carried forward (pre-merge, still true):**

- Micro's (now Standard/Text XS) hover and pressed are pixel-identical
  (0/6096 re-measured); Utility Text's hover = pressed too (0/5080).
- Primary's authored height math is 2px short of the 48px frame (13+13+20=46).
- `Primary/Focus` is the literal name of the PRESSED fill (wired to
  `:active`) — confusing name, same on Checkbox.
- Radius-4 on the bare text rows (invisible, harmless).

### Checkbox (1:424)

- Raw 3px radius sits on no Radius token.
- The check glyph's white is unbound (ships as `Text/Contrast` — confirm).

### Radio (1:419)

- Disabled swaps the cursor only — a disabled radio renders identical to an
  enabled one.
- Structure quirk: unchecked variants draw the ring as a child ellipse,
  checked puts the stroke on the frame. Harmless, inconsistent.

### Switch (1:446)

- Off-track paints STROKE-family tokens as fills (naming oddity).
- The knob's faint shadow spill (~1% in one export) is unbound — shipped
  shadowless.

### IconButton (1:429) — post Neutral-rework

- `23:725`'s hand-shrunk 14px glyph still open (shipped 18px).
- Subtle rest ink (60%) is very faint over white.
- (Fixed by designer: the old `23:723` rest-binding slip. ✓)

### ListItem (1:463)

- sm selected rows grow 30→34 (emergent hug: the fixed 18px check exceeds
  sm's line box). Reproduced and spec-pinned.

### DropdownList (1:480)

- "Property 1 = sm/md" toggles which sample row is selected — it is NOT a
  size axis.
- ~~Raw unbound shadow~~ RESOLVED 2026-09-02: rebound to the new
  "Basic Drop Shadow" effect style per designer direction (a value change,
  0 2px 5px 10% → 0 8px 24px −4px). Note the effect style's own color is
  still a raw literal (bound to no color variable).

### Tabs (23:825)

- Portal active+hover is a near-invisible token swap (Δ6/255).
- The active weight step (400→500) reflows the hug ~1px.

### TextSelector (1:489)

- Duplicate `Hover=yes` variant columns with different treatments; shipped
  reading: modest step = hover, near-black step = open (aria-expanded).

### RadioField (123:6059)

- All six variants' state axes are UNWIRED (identical variables, structure,
  pixels). Top item.
- ~~No error state.~~ **RESOLVED 2026-09-16 (D2): text-only** — the hint turns
  `Warning/Text`, the radio controls are untouched. The component has no box,
  so the siblings' border treatment had no target; a ring tint was ruled out
  as invented style. Shipped in 1.2.0. No frames were needed or drawn.
- Option ink is raw #000000 (the file's only raw black) — shipped as
  `Text/Primary`.
- Stray sibling symbol "Radio field" (123:6056, 56×24) — intended component
  or leftover?

### SelectCard (9:367)

- "Pressed" means SELECTED on the radio variant but a transient wash on the
  chevron variant — two strategies on one axis.

### BoxAction (199:12990)

- Per-type disabled inconsistencies (different ring tokens; no distinct
  disabled switch asset).

### Owner (261:13225) / OwnerContainer (274:258)

- A Gate-0 metadata read said 94.5px row height; authored/pixels/math all say
  92.5 (92 + 0.5 hairline). Worth confirming which is current.
- Ownership % type style inferred (single title-level binding) — confirm
  it binds `Display & Title/Medium`.
- Title/contact row heights (34/18) exceed their line boxes with no authored
  padding (frame authority shipped).
- The `tag` Badge boolean is never shown true in any variant.

### TextField (1:291) / DropdownField (1:358)

- Box padding split ambiguity: structure reads 14/20/14, the bound 24px
  line-height closes at 12/24/12 — re-measure the node.
- hover+focus is undrawn — the library ships focus-wins; confirm intended.
- TextField lacks the "Optional Text" label-row slot Dropdown Field has —
  intentional asymmetry?

### TextArea (199:12523)

- 10px y-padding vs the siblings' taller boxes — intended?
- The value node carries the Input style's single-line nowrap/ellipsis
  (copy-paste artifact); no variant demonstrates wrapping or overflow.
- No resize grabber and no overflow state — the library chose
  `resize: none`; confirm.
- ~~No Error axis (unlike the siblings) — deliberate?~~ **RESOLVED 2026-09-16
  (D1/D3): the library added one as a labeled extension**, mirroring Plain
  Text Field exactly (amber border, amber hint, error+hover excluded,
  error+focus = amber border + crimson ring). Shipped in 1.2.0. Figma still
  draws no error variant for this component — **adding one would be
  welcome**, but the treatment is now pinned in code either way.

### Header (550:7507)

- No scrolled shadow drawn — confirm none is wanted for the sticky state.
- The logo's crimson #CD1041 is the client asset's own colour, deliberately
  untokenized.

### Modal (557:5127)

- **The Success banner is entirely raw, unbound hex** (#f0fdf4 fill,
  #16a34a border, #15803d label ink, #166534 body ink — Tailwind-palette
  greens) while the Destructive banner properly binds Primary tokens, and
  the values visibly differ from the tokenized Success ramp (#2e6e4e
  family). Bind variables (new group or the Success ramp?) — top item.
- **Destructive binds Primary (crimson), not the Error ramp** — one more
  instance of the file-wide unused-Error-ramp finding (item 1 above).
- **Untokenized type styles**: title 18/24/600, notice label 12/16/600
  uppercase, notice body 13/18/400 — none match the 24-style scale; worth
  naming if banners/dialogs recur.
- **Title carries whitespace-nowrap** with no truncation drawn — an overflow
  defect on long titles; the library ships wrapping. Confirm intent.
- **The close glyph's master is a misnamed "ChevronLeft" (383:8970)** that
  duplicates IconButton rather than instancing the real component (1:429);
  the library composes the shipped IconButton with #x.
- **Stray cursor-pointer on the button-row frame** (the row isn't
  interactive) — authoring artifact.
- **No scrim/backdrop layer exists anywhere** (Canvas 557:5013 holds only
  the cards) — the library's wash (Content/Primary at 45%) is an unsourced
  placeholder; please supply a scrim spec.
- Visual-lane gaps to note: the close-X region and the Success variant's
  lower rows were not pixel-scanned (structure-verified only).

### Tooltip (582:9178)

- `BG/Contrast` (#1a1a1a) was added to the collection with this component —
  extracted as token 58 (`--color-surface-contrast`). No other new variables.
- The fixed 280px sample frame ships as max-width-with-hug (the authored
  word-break implies wrap-at-limit) — confirm intent.
- No arrow/caret, placement, or state is modelled — confirm none is wanted.

### Toast (582:9325)

- **Type "error" binds Warning/Base** — see systemic item 1; success/info
  bind their ramps correctly in the same set.
- The Simple pill's glyph is authored 15px — off the 12/14/16/18 icon grid.
- The Simple style exists only as Type=info and binds no status token — is
  the Type axis meant to apply to it at all?
- Close is the same misnamed "ChevronLeft"-renders-X master as Modal's.
- Text layers carry whitespace-nowrap (the Modal-title defect family) —
  the library ships wrapping.

### StatusTracker / Application Status (64:4623)

- No connector between steps and no interactive states are modelled —
  confirm the track is compose-only.

### Action (71:848)

- **The PENDING chip binds Text/Hint on Paper — 3.11:1 at 9px** (systemic
  item 5's worst case).
- The CTA is a novel 34px bordered mini button matching no shipped Button
  type — should it become a Button variant in the design system?
- The CTA's trailing arrow layer is named "AttachMoneyRounded" (renders a
  forward arrow) — the naming-lies family again.
- No hover/pressed is drawn for the CTA (an interactive control with no
  states) — confirm intended.

### Button / Utility (24:4382) — MERGED into Button (1:218), 2026-10

All items superseded by the unified-set section above: the border-drop item
is reversed (the border now persists), the Text ink stacking appears fixed,
the Text underline moved to the new Link style, and Filled's Stroke/Divider
binding is now a real drawn ring. The Size-axis no-op (Text MD ≡ SM) and the
sample-hug widths carry forward above.

### OTP / Digit cell (824:4856) + OTP field (815:9211) — extracted 2026-10-13

- **The Focused cell's "caret" is a literal `|` text glyph** drawn in
  Primary/Primary — no caret layer, and it is why the focused "digit ink"
  reads crimson. Shipped as `caret-color: Primary` with constant digit ink.
- **Empty ≡ Filled in the cell masters** (0/3136 px — the `digit` prop
  defaults to a space; no digit is drawn anywhere in the set).
- **No hover, disabled or pressed** on cell or field — disabled is the
  field-family priority gap again.
- **Error is all-six-cells only** (no per-cell error, no error+empty, no
  error+focus); digits are retained. Error binds `Warning/Base` /
  `Warning/Text` — consistent with D4.
- **Cell radius is a raw 4px** (no Radius token bound — same as Button); a
  pixel fit read ≈5.4 on the 1px-stroked box. Confirm 4 (= Radius/sm).
  Related: Skeleton's written spec gives the "input" shape 6px while
  TextField/TextArea/OtpCell ship 4px — which is right?
- The field's Focused sample rings the NEXT-EMPTY cell (behavioral intent,
  not a drawable state) — noted as consumer JS.

### From the 2026-10-14 go-live handoff rework (heights / focus / disabled / loading)

New findings, all shipped as drawn unless noted:

1. ~~Standard Text XS's label bound to no style~~ RESOLVED 2026-10-15: it
   binds **Eyebrow** (11/16/600/10% UPPER); shipped as `type-eyebrow`.
2. ~~Data Key has no UPPER transform~~ RESOLVED 2026-10-15: the transform is
   on; baked as `type-data-key`. **The casing question is now closed for the
   entire type set.**
3. ~~Focus Ring authored inconsistently~~ RESOLVED 2026-10-15 (documented by
   the designer). The library ships the effect-style recipe everywhere
   (`outline 2px / offset 2px`).
4. ~~Utility disabled recipes unalike~~ RESOLVED 2026-10-15: unified to the
   Standard treatment (no fill, Divider border, Tertiary ink; Primary keeps
   Primary/Disabled). Re-verified direct and shipped.
5. **Loading spinner has no motion spec** (static 16px 270° arc exports,
   914:671/677/683/689) — the library spins it at 800ms linear; say if the
   design wants different. Utility SM Loading frames hug 2px narrower than
   their Default twins (16px spinner vs 18px icon slot) — the library keeps
   the 18px slot so width never changes (the handoff contract).
6. ~~Skeleton~~ FULLY RESOLVED 2026-10-15: field bones 4px; the fill binds
   the new `BG/Skeleton` variable (#e4e7eb, tokenized as
   `--color-surface-skeleton`); the Checkbox bone is 20×20 at the control's
   3px radius; the Avatar bone is 24×24; and the set description was
   rewritten to match the shipped bones (verified — it now names BG/Skeleton
   and the real sizes; the "h-10 rounded-md" text is gone). Nothing remains
   open on Skeleton.
7. **Address (281:4634)**: the Focus variants flip the title style from
   Strong 14/20 to Field Label 13/16 (the 171-vs-167 frame-height split);
   two frames are 517 wide against eleven at 518; Error variants draw no
   hint row; the non-error Hover variants were unreadable (rate limit) —
   shipped from the set-level Stroke/Hover binding. Library ships the title
   at Strong consistently.
8. **Upload (778:6949)**: the glyph layers are named "ChevronLeft" and draw
   an upload tray / a file (the naming-lies family — a rename would stop
   every extraction re-flagging it); the "choose a file" run is a raw
   #1b4e8b (= `Info/Base` exactly — bind it); the drawn Remove button is a
   stale underlined instance of the old Utility Text style; variant value
   casing is inconsistent ("No" vs "yes"); Expanded=no+Completed=yes is
   undrawn.
9. **ListItem (786:6869)**: Critical exists only with Selected=No (no
   critical+selected drawn — the library excludes the combination); size
   value casing is inconsistent ("sm"/"md"/"LG").
10. ~~Button set description stale~~ RESOLVED 2026-10-15: the designer
    documented the Focus variants and updated the description.

## From the BSA "Account information" Val run (2026-09-17; frames 199:12008, 199:12185, 720:8067, 721:8438)

Page-level findings from building the BSA step against `@valiify/shortapp-ui@1.3.0`
with all four frames measured. Run record:
`val/runs/2026-09-16-val-bsa-account-information/` (07-writeup.md).

1. **Back button label ink is an instance override on all four frames.** The
   Button / Standard main (1:227, Secondary rest) binds `Text/Secondary`; the BSA
   Back instances (496:3449, 496:3461, 720:8133, 721:8462) override the label to
   `Text/Primary` while the arrow stays `#54565b` — mixed inks on one control. The
   library keeps the main's binding. Confirm which is intended.
2. **The step eyebrow's first segment binds Tag & Pill on the BSA frames**
   ("Step 5 of 10", 199:12013 — 5% tracking) while the methodology's reference
   frames bind Eyebrow (10%) for the whole `STEP n OF m / SECTION` run. Reproduced
   as Eyebrow (methodology §3); the row renders ~7px wider than the frame.
3. **Conditional-reveal indent — exact values now known**: `Layer field`
   Type=Type4 (199:12725) indents 20px with a 1px `Stroke/Border` rule whose
   stroke is centred on the column edge; the grandchild Text Area Field draws its
   own rule segment via its Indented boolean at the same indent. Methodology §11
   (`va:pl-5.5`, ~22) and §13's open item should take these. Note the rule token is
   `Stroke/Border`, not the `Stroke/Divider` the recipe names.
4. **`ACCOUNT ACTIVITY` sits above the Estimated-monthly field in both EMPTY
   frames and below it in both FILLED frames.** Built below (brief order).
5. **The mobile frames use a legacy header/footer shell** (main component
   unresolvable via the API; binds `bg/paper` #ffffff, `stroke/stroke`,
   `content/hidden` from a different collection; hidden opacity-0 back iconbutton;
   footer label **Next** where web says **Continue** and §9 forbids NEXT). Rebuilt
   in the shipped `.va-header` + 1.3.0 tokens with "Continue". The two frames also
   pin the footer bar to the artboard bottom with inconsistent gaps (13 / 16).
6. **ACH child copy** (199:12772, 721:8593) reads "…international wires?" under the
   ACH field — corrected to "…international ACH transfers?" by the requester's
   decision (2026-09-16). Fix at source.
7. **Field labels are title case on the frames** ("Annual Revenue", "Number of
   Employees") against the sentence-case rule (§8). Built sentence case.
8. **The web EMPTY frame draws a value ("25,000") in Estimated monthly
   transaction volume**; built empty.
9. **One nested Radio Fields instance carries a stray `pb 12`** (ACH child, 77 tall
   vs 65) — built at the component's geometry.
10. **Radio option ink is raw `#000000`** in every Radio Fields instance (the
    file's only raw black) — shipped as `Text/Primary` (already listed under
    RadioField; repeated here because every BSA instance carries it).
11. **Frame 5 (199:12187) reports a stale hug height** (1392 → bottom 1452) above
    its own footer child (bottom 1455).
12. **Button / Standard's label is fill-container with left text on a fixed 239px
    frame** (mains 1:259 / 1:227). The 239 sample hides it, so the library shipped a
    centred label; a stretched button now reads label-left / icon-right as the BSA
    frames draw it. Confirm that is the intended stretched layout (centred labels are
    the more common intent) — and whether a stretched button with a LEADING icon
    should keep its label beside the icon (no frame draws that case).
13. **No frame draws an open dropdown panel.** The library now positions the panel
    4px below its trigger (methodology §11, 2026-09-17) as a library decision; confirm
    the offset, and whether the header language menu should hang right-aligned.
14. **Mobile frames revised to 20px horizontal padding (2026-09-17), inconsistently.**
    720:8067 and 721:8438 now pad the shell 20 (335 column); the empty frame's footer
    bar (720:8131) pads 14/20 but the filled frame's (721:8460) still pads 14/16. Built
    20 on both. Also: §1.2's surface-wide rule (16 / 343, from the loan-flow frames) now
    disagrees with the BSA pair — is 20 the shell rule for every flow?
15. **Library facts surfaced, not design defects**: `.va-btn-secondary`'s real 1px
    border adds 2px to Figma's inside-stroke hug width; the RadioField `<legend>`
    kept Chromium's 2px UA inline padding under `./reset.css` (fixed after 1.3.0,
    `px-0`); the utility surface lacks `text-tag-pill`, `tabular-nums`,
    `absolute`/`relative` (dropdown panels render in flow) and any footer-pin
    spelling.
