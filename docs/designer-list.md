# Designer List — open questions & authoring defects in the Short App Figma

Consolidated from the per-component extraction notes in CLAUDE.md (which stay
the canonical per-component record). Every item was found during extraction of
`Updated-Short-App` (PA5pr1Q8KLfbjTxdAbFm0V) and is reproduced faithfully in
the library until the design changes — nothing here blocks shipping, but the
**Systemic** items affect multiple components and are worth fixing at the
source.

_Last updated 2026-09-02 (27 components extracted)._

## Systemic — one Figma fix resolves several components

1. **The Error ramp is defined but applied nowhere.** Every field `Error=Yes`
   variant — Plain Text Field (515:5147/5159/5171) and Dropdown Field
   (521:5308/5318/5328) — binds `Warning/Base` (#b4791c amber), never
   `Error/*` (#c0362c). Settled with both variable reads and pixel samples.
   → Should field errors rebind to the Error ramp? The library ships amber
   verbatim and will follow the file. **Now the sharpest instance: the Toast
   Type literally named "error" (582:9338) binds Warning/Base — while its
   sibling variants bind Success/Base and Info/Base correctly, proving the
   ramps are wired deliberately.** The Modal's Destructive (Primary tints)
   is the same family.
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
4. **No disabled variant exists on any field** (TextField, DropdownField,
   TextArea, RadioField) — for an application form this is a launch-blocking
   gap; the library invents nothing (cursor-only `:disabled`).
   Radio/Switch/IconButton also model no disabled visual.
5. **The Text/Hint-on-Paper pairing fails WCAG contrast** (3.11:1, needs
   4.5:1) wherever it appears: field placeholders (DropdownField flagged
   live by axe; TextField/TextArea hide it inside native `::placeholder`),
   and now the Action row's PENDING chip (9px micro-label — harsher still).
   All waived with documentation; one ink fix resolves the family.
6. **Casing still unconfirmed** for Data Key, Tag & Pill, and the Lockup
   styles (Eyebrow, Button Label, Micro-Label are resolved: styled
   transforms). Confirm per component as they get used.
7. **Skeleton's written spec names a "Surface/Neutral" variable that does
   not exist** in the file's collection — the fill ships as raw #f1f1f4 via
   `--skeleton-fill`. Add the variable and the library will tokenize it.
8. **The `Field Label` type token (13/16/500) is misnamed** — RESOLVED-ish
   2026-09-02: its first (and only) consumer turned out to be the TOOLTIP
   title (582:9178), while actual field labels bind `Labels, links &
   UI/Strong`. Consider renaming the style to match its real use.

## Per-component

### Button / Standard (1:218)
- ~~Pressed drawn only as hover+pressed combos~~ RESOLVED 2026-09-02: the
  rework formalized Pressed into its own axis (511:5xxx); values are
  byte-identical to the shipped :active treatments — variable-diffed, no
  CSS change. Set renamed "Button / Standard" (inline uses).
- Micro's hover and pressed are pixel-identical (0-diff measured).
- Primary's authored height math is 2px short of the 48px frame (13+13+20=46).
- `Primary/Focus` is the literal name of the PRESSED fill (wired to
  `:active`) — confusing name, same on Checkbox.

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
- No Error axis (unlike the siblings) — deliberate?

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

### Button / Utility (24:4382)
- **The Empty type's border renders at rest only** — hover/pressed variants
  drop both the Paper fill and the border (the wash sits directly on the
  page), yet Stroke/Divider stays bound on those variants (a stale layer?).
  Confirm the vanishing border is intended.
- **The Text type's Size axis is unwired** — MD and SM Text are
  byte-identical (0/1376 pixel diff), the RadioField defect class.
- **The Text type's rest ink stacks a raw #6f7276 over a bound
  Text/Secondary** — the raw hex wins and happens to equal Text/Tertiary;
  bind the token it means.
- SM Empty/Filled/Rounded hug width but MD Empty bakes w-214 (sample-hug
  trap, Standard's 239 precedent).
- Filled binds Stroke/Divider in all states but no border is visible over
  the solid fill — stale binding?
- Rounded uses py-7 where Empty/Filled use py-8 (border compensation?).
- The trailing icon layer is named "AttachMoneyRounded" again.
- No disabled/Inactive axis exists (Standard has one) — intended?
